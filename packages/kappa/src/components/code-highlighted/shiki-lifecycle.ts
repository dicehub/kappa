type DisposableHighlighter = {
  dispose: () => void;
};

type ShikiInitializationOptions<Highlighter extends DisposableHighlighter> = {
  create: () => Promise<Highlighter>;
  onError: (error: unknown) => void;
  onReady: (highlighter: Highlighter) => void;
  onSettled: () => void;
};

export function startShikiInitialization<Highlighter extends DisposableHighlighter>(
  options: ShikiInitializationOptions<Highlighter>,
): () => void {
  let cancelled = false;
  let ownedHighlighter: Highlighter | null = null;

  void (async () => {
    try {
      const nextHighlighter = await options.create();

      if (cancelled) {
        nextHighlighter.dispose();
        return;
      }

      ownedHighlighter = nextHighlighter;
      options.onReady(nextHighlighter);
    } catch (error) {
      if (!cancelled) options.onError(error);
    } finally {
      if (!cancelled) options.onSettled();
    }
  })();

  return () => {
    if (cancelled) return;

    cancelled = true;
    ownedHighlighter?.dispose();
  };
}
