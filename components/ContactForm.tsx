'use client';

import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // TODO: Add email API integration later
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-retro-text mb-2 text-sm">
          NAME:
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-retro-text mb-2 text-sm">
          EMAIL:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-retro-text mb-2 text-sm">
          MESSAGE:
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full bg-retro-bg border border-retro-border px-4 py-2 text-retro-text focus:outline-none focus:border-retro-border focus:glow-retro resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full border border-retro-border px-6 py-3 text-retro-text hover:bg-retro-text hover:text-retro-bg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-retro"
      >
        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
      </button>
      {submitStatus === 'success' && (
        <div className="text-retro-text text-sm text-center border border-retro-border px-4 py-2">
          MESSAGE SENT SUCCESSFULLY!
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="text-retro-muted text-sm text-center border border-retro-border px-4 py-2">
          ERROR SENDING MESSAGE. PLEASE TRY AGAIN.
        </div>
      )}
    </form>
  );
}

