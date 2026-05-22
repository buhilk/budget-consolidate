import type { PotSnapshot } from '../budget';

export function PotAlert({ pot }: { pot: PotSnapshot }) {
  return (
    <div
      className={`pot-alert pot-alert--${pot.status}`}
      role="alert"
      aria-live="polite"
    >
      {pot.message}
    </div>
  );
}
