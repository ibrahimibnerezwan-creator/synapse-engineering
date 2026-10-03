'use client';

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main id="main" className="min-h-[70vh] flex flex-col items-center justify-center gap-5 p-6 text-center">
    <h1 className="display text-4xl">The desk is temporarily unavailable.</h1>
    <p>We couldn’t load the latest catalogue. Please try again.</p>
    <button type="button" className="btn-ink" onClick={reset}>Try again</button>
    <a href="https://wa.me/8801886113236" className="btn-jade" target="_blank" rel="noopener noreferrer">Contact Sohel</a>
  </main>;
}
