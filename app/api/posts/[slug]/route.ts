import { NextResponse } from 'next/server';
import Airtable from 'airtable';

// Initialize Airtable
const base = new Airtable({
  apiKey: process.env.AIRTABLE_TOKEN,
}).base(process.env.AIRTABLE_BASE_ID || '');

interface AirtablePost {
  id: string;
  fields: {
    Title?: string;
    Date?: string;
    Category?: string;
    Excerpt?: string;
    Content?: string;
    Summary?: string;
    'Read Time (minutes)'?: number;
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable credentials not configured' },
        { status: 500 }
      );
    }

    const records = await base('Blog Posts')
      .select({
        filterByFormula: `{Title} != ""`,
      })
      .all();

    const post = records.find((record: AirtablePost) => {
      const title = String(record.fields.Title || '');
      return generateSlug(title) === slug;
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    const fields = post.fields;
    const title = String(fields.Title || '');
    
    // Split content by newlines or double newlines into paragraphs
    const content = String(fields.Content || '');
    const contentParagraphs = content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);

    const postData = {
      id: post.id,
      title,
      slug: generateSlug(title),
      date: String(fields.Date || ''),
      category: String(fields.Category || ''),
      excerpt: String(fields.Excerpt || ''),
      content: contentParagraphs.length > 0 ? contentParagraphs : [content],
      summary: String(fields.Summary || ''),
      readTime: typeof fields['Read Time (minutes)'] === 'number' ? fields['Read Time (minutes)'] : 0,
    };

    return NextResponse.json({ post: postData });
  } catch (error) {
    console.error('Error fetching post from Airtable:', error);
    
    let errorMessage = 'Unknown error';
    let errorDetails = '';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack || '';
    } else if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; error?: string; statusCode?: number };
      errorMessage = err.message || err.error || 'Unknown error';
      errorDetails = JSON.stringify(error);
    } else {
      errorMessage = String(error);
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch post', 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable credentials not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, date, category, excerpt, content, recordId } = body;

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required for update' },
        { status: 400 }
      );
    }

    if (!title || !date || !category || !excerpt || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update record in Airtable
    const record = await base('Blog Posts').update([
      {
        id: recordId,
        fields: {
          Title: title,
          Date: date,
          Category: category,
          Excerpt: excerpt,
          Content: content,
        },
      },
    ]);

    const updatedRecord = record[0];
    const fields = updatedRecord.fields;
    const recordTitle = String(fields.Title || '');

    return NextResponse.json({
      success: true,
      post: {
        id: updatedRecord.id,
        title: recordTitle,
        slug: generateSlug(recordTitle),
        date: String(fields.Date || ''),
        category: String(fields.Category || ''),
        excerpt: String(fields.Excerpt || ''),
        content: String(fields.Content || ''),
      },
    });
  } catch (error) {
    console.error('Error updating post in Airtable:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; error?: string };
      errorMessage = err.message || err.error || 'Unknown error';
    } else {
      errorMessage = String(error);
    }
    
    return NextResponse.json(
      { error: 'Failed to update post', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable credentials not configured' },
        { status: 500 }
      );
    }

    const url = new URL(request.url);
    const recordId = url.searchParams.get('recordId');

    if (!recordId) {
      return NextResponse.json(
        { error: 'Record ID is required for deletion' },
        { status: 400 }
      );
    }

    // Delete record from Airtable
    await base('Blog Posts').destroy([recordId]);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post from Airtable:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'object' && error !== null) {
      const err = error as { message?: string; error?: string };
      errorMessage = err.message || err.error || 'Unknown error';
    } else {
      errorMessage = String(error);
    }
    
    return NextResponse.json(
      { error: 'Failed to delete post', details: errorMessage },
      { status: 500 }
    );
  }
}

