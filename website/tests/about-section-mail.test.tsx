import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AboutSection from '../src/components/ui/AboutSection';

describe('AboutSection Mail Functionality', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders the mail box with proper input and Send button', () => {
    render(<AboutSection />);
    const input = screen.getByPlaceholderText(/Want to share something/i);
    expect(input).toBeInTheDocument();

    const sendBtn = screen.getByRole('button', { name: /Send email to ruchith@alokam.com/i });
    expect(sendBtn).toBeInTheDocument();
  });

  it('opens the Send Note modal when Send button is clicked or form submitted', () => {
    render(<AboutSection />);
    const input = screen.getByPlaceholderText(/Want to share something/i);
    fireEvent.change(input, { target: { value: 'Great work on CompanyWise!' } });

    const sendBtn = screen.getByRole('button', { name: /Send email to ruchith@alokam.com/i });
    fireEvent.click(sendBtn);

    // Modal dialog should now be visible
    const modalTitle = screen.getByRole('heading', { name: /Send Note to Ruchith Alokam/i });
    expect(modalTitle).toBeInTheDocument();

    // Verify textarea has the note
    const textarea = screen.getByLabelText(/Your Message/i) as HTMLTextAreaElement;
    expect(textarea.value).toBe('Great work on CompanyWise!');

    // Verify Gmail and Mail App buttons exist
    expect(screen.getByRole('button', { name: /Open in Gmail \(Web\)/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Open in System Mail App/i })).toBeInTheDocument();
  });

  it('triggers window.open with Gmail compose url when Open in Gmail is clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<AboutSection />);
    const input = screen.getByPlaceholderText(/Want to share something/i);
    fireEvent.change(input, { target: { value: 'Feature suggestion' } });

    const sendBtn = screen.getByRole('button', { name: /Send email to ruchith@alokam.com/i });
    fireEvent.click(sendBtn);

    const gmailBtn = screen.getByRole('button', { name: /Open in Gmail \(Web\)/i });
    fireEvent.click(gmailBtn);

    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('mail.google.com/mail/?view=cm'),
      '_blank',
      'noopener,noreferrer'
    );
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining('to=ruchith@alokam.com'),
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('copies email to clipboard when copy button is clicked', async () => {
    render(<AboutSection />);
    const copyEmailButtons = screen.getAllByTitle(/Click to copy email address/i);
    expect(copyEmailButtons.length).toBeGreaterThan(0);

    fireEvent.click(copyEmailButtons[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('ruchith@alokam.com');
  });

  it('closes modal when close button (X) or Escape key is pressed', () => {
    render(<AboutSection />);
    const sendBtn = screen.getByRole('button', { name: /Send email to ruchith@alokam.com/i });
    fireEvent.click(sendBtn);

    expect(screen.getByRole('heading', { name: /Send Note to Ruchith Alokam/i })).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('heading', { name: /Send Note to Ruchith Alokam/i })).not.toBeInTheDocument();
  });
});
