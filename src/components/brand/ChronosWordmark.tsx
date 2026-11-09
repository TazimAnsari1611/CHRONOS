export function ChronosWordmark() {
  return (
    <span className="chronos-wordmark inline-flex items-center gap-2.5">
      <svg
        aria-hidden="true"
        viewBox="0 0 48 48"
        className="chronos-emblem size-9 shrink-0 text-chronos-gold sm:size-10"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.15"
        />
        <circle
          cx="24"
          cy="24"
          r="15.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity=".34"
          strokeWidth=".75"
        />
        <path
          d="M8.4 15.3A18.2 18.2 0 0 1 36 9.5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.6"
        />
        <path
          d="M19 15.5h10M19 32.5h10M20 16c0 4.7 8 5.3 8 8s-8 3.3-8 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.25"
        />
        <path
          d="M28 16c0 4.7-8 5.3-8 8s8 3.3 8 8"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.25"
        />
        <circle cx="24" cy="24" r="1.6" fill="currentColor" />
      </svg>
      <span className="chronos-wordmark-type">
        <span className="chronos-wordmark-name">CHRONOS</span>
        <span className="chronos-wordmark-caption">A HUMAN STORY IN TIME</span>
      </span>
    </span>
  );
}
