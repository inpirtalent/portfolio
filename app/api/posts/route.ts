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
  if (!title || typeof title !== 'string') {
    return '';
  }
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'untitled';
}

export async function GET(request: Request) {
  try {
    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable credentials not configured', details: 'Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID environment variables' },
        { status: 500 }
      );
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '4';
    const offsetParam = searchParams.get('offset') || '0';
    const limit = Math.max(1, Math.min(100, parseInt(limitParam, 10) || 4)); // Clamp between 1 and 100
    const offset = Math.max(0, parseInt(offsetParam, 10) || 0); // Ensure non-negative

    // Try to fetch records - handle potential table name issues
    let allRecords: readonly AirtablePost[] = [];
    try {
      // Fetch all records (Airtable doesn't support offset in select, so we fetch all and paginate server-side)
      // This is fine for blog posts which typically aren't in the thousands
      const query = base('Blog Posts')
        .select({
          sort: [{ field: 'Date', direction: 'desc' }],
        });

      allRecords = await query.all() as unknown as readonly AirtablePost[];
    } catch (tableError) {
      console.error('Airtable table access error:', tableError);
      throw new Error(`Table access failed: ${tableError instanceof Error ? tableError.message : 'Unknown table error'}. Make sure the table name is exactly "Blog Posts" and the token has access.`);
    }

    // Paginate on server side
    const totalRecords = allRecords.length;
    const paginatedRecords = allRecords.slice(offset, offset + limit);
    const hasMore = offset + limit < totalRecords;

    const posts = paginatedRecords.map((record: AirtablePost) => {
      const fields = record.fields;
      const title = String(fields.Title || '');
      
      return {
        id: record.id,
        title,
        slug: generateSlug(title),
        date: String(fields.Date || ''),
        category: String(fields.Category || ''),
        excerpt: String(fields.Excerpt || ''),
        content: String(fields.Content || ''),
        summary: String(fields.Summary || ''),
        readTime: typeof fields['Read Time (minutes)'] === 'number' ? fields['Read Time (minutes)'] : 0,
      };
    });

    return NextResponse.json({ 
      posts,
      hasMore,
      offset: offset + posts.length,
    });
  } catch (error) {
    console.error('Error fetching posts from Airtable:', error);
    
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
        error: 'Failed to fetch posts', 
        details: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
      return NextResponse.json(
        { error: 'Airtable credentials not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { title, date, category, excerpt, content } = body;

    // Validate required fields
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!date || typeof date !== 'string' || date.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Date is required' },
        { status: 400 }
      );
    }

    if (!category || typeof category !== 'string' || category.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Category is required' },
        { status: 400 }
      );
    }

    if (!excerpt || typeof excerpt !== 'string' || excerpt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Excerpt is required' },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Content is required' },
        { status: 400 }
      );
    }

    // Create record in Airtable
    const records = await base('Blog Posts').create([
      {
        fields: {
          Title: title.trim(),
          Date: date.trim(),
          Category: category.trim(),
          Excerpt: excerpt.trim(),
          Content: content.trim(),
        },
      },
    ]);

    const newRecord = records[0];
    const fields = newRecord.fields;
    const recordTitle = String(fields.Title || '');

    return NextResponse.json({
      success: true,
      post: {
        id: newRecord.id,
        title: recordTitle,
        slug: generateSlug(recordTitle),
        date: String(fields.Date || ''),
        category: String(fields.Category || ''),
        excerpt: String(fields.Excerpt || ''),
        content: String(fields.Content || ''),
      },
    });
  } catch (error) {
    console.error('Error creating post in Airtable:', error);
    
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
      { error: 'Failed to create post', details: errorMessage },
      { status: 500 }
    );
  }
}

