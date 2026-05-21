import { useCallback, useEffect, useState } from 'react';
import {
  getVariantFromUrl,
  PrototypeSwitcher,
  setVariantInUrl,
  type VariantKey,
} from './PrototypeSwitcher';
import { useBudgetState } from './useBudgetState';
import { VariantA } from './variants/VariantA';
import { VariantB } from './variants/VariantB';
import { VariantC } from './variants/VariantC';

export default function App() {
  const [variant, setVariant] = useState<VariantKey>(() => getVariantFromUrl());
  const api = useBudgetState();

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has('variant')) {
      setVariantInUrl('A');
      setVariant('A');
    }
    const onPop = () => setVariant(getVariantFromUrl());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const onVariantChange = useCallback((next: VariantKey) => {
    setVariantInUrl(next);
    setVariant(next);
  }, []);

  return (
    <>
      {variant === 'A' && <VariantA {...api} />}
      {variant === 'B' && <VariantB {...api} />}
      {variant === 'C' && <VariantC {...api} />}
      <PrototypeSwitcher current={variant} onChange={onVariantChange} />
    </>
  );
}
