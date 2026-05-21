import { useEffect } from 'react';

const VARIANTS = ['A', 'B', 'C'] as const;
export type VariantKey = (typeof VARIANTS)[number];

const LABELS: Record<VariantKey, string> = {
  A: 'Hero pot',
  B: 'Sidebar pot',
  C: 'Table first',
};

function cycle(current: VariantKey, dir: -1 | 1): VariantKey {
  const i = VARIANTS.indexOf(current);
  const next = (i + dir + VARIANTS.length) % VARIANTS.length;
  return VARIANTS[next]!;
}

export function getVariantFromUrl(): VariantKey {
  const v = new URLSearchParams(window.location.search).get('variant') ?? 'A';
  return VARIANTS.includes(v as VariantKey) ? (v as VariantKey) : 'A';
}

export function setVariantInUrl(next: VariantKey) {
  const url = new URL(window.location.href);
  url.searchParams.set('variant', next);
  window.history.replaceState({}, '', url);
}

export function PrototypeSwitcher({
  current,
  onChange,
}: {
  current: VariantKey;
  onChange: (next: VariantKey) => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        el?.getAttribute('contenteditable') === 'true'
      ) {
        return;
      }
      if (e.key === 'ArrowLeft') onChange(cycle(current, -1));
      if (e.key === 'ArrowRight') onChange(cycle(current, 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, onChange]);

  if (import.meta.env.PROD) return null;

  return (
    <div className="proto-switcher" role="navigation" aria-label="Prototype variant">
      <button
        type="button"
        onClick={() => onChange(cycle(current, -1))}
        aria-label="Previous variant"
      >
        ←
      </button>
      <span>
        <strong>{current}</strong> — {LABELS[current]}
      </span>
      <button
        type="button"
        onClick={() => onChange(cycle(current, 1))}
        aria-label="Next variant"
      >
        →
      </button>
    </div>
  );
}
