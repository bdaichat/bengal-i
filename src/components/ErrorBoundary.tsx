import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown) {
    // Keep this log so we can see the real component stack in the console.
    // eslint-disable-next-line no-console
    console.error("App render error:", error);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const message =
      this.state.error instanceof Error
        ? this.state.error.message
        : "Unknown error";

    return (
      <main className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="max-w-xl w-full rounded-lg border border-border bg-card p-6">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p className="mt-2 text-sm text-muted-foreground font-mono whitespace-pre-wrap">
            {message}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Refresh the page. If this keeps happening, share this message.
          </p>
        </div>
      </main>
    );
  }
}
