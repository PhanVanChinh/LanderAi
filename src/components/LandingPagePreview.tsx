import { useEffect, useRef } from "react";

interface LandingPagePreviewProps {
  code: string;
}

export default function LandingPagePreview({ code }: LandingPagePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    // We need to inject Tailwind into the iframe
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; }
            h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
          </style>
        </head>
        <body>
          ${code}
        </body>
      </html>
    `;

    doc.open();
    doc.write(html);
    doc.close();
  }, [code]);

  return (
    <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
      <iframe
        ref={iframeRef}
        title="Landing Page Preview"
        className="w-full h-full border-none"
      />
    </div>
  );
}
