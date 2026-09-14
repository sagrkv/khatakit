/** Shared ledger symbol and wordmark. Colour comes from the theme. */
export default function Logo() {
  return (
    <span className="brand-lockup" aria-label="Khatakit">
      <svg className="brand-symbol" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path className="brand-symbol-back" d="M5 6h23v28H5z" />
        <path className="brand-symbol-front" d="M13 3h16l7 7v25H13z" />
        <path className="brand-symbol-fold" d="M29 3v7h7" />
        <path className="brand-symbol-lines" d="M19 17h11M19 22h11M19 28h5" />
      </svg>
      <span aria-hidden="true">Khatakit</span>
    </span>
  );
}
