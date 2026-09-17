"use client";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`app-shell ${className}`}>
      <div className="app-bg-blobs" aria-hidden>
        <div className="app-bg-blob app-bg-blob--primary" />
        <div className="app-bg-blob app-bg-blob--secondary" />
      </div>
      <div className="app-content">{children}</div>
    </div>
  );
}
