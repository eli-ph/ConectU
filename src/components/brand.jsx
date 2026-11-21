import Link from "next/link";
export function Brand({ compact = false, href = "/", light = false }) {
  return (
    <Link
      href={href}
      className={`inline-flex shrink-0 items-center ${light ? "rounded-lg bg-white px-3 py-2" : ""}`}
      aria-label="Vinculación Universitaria, inicio"
    >
      <img src="/logo-conectu.svg" alt="ConectU" className={compact ? "h-8 w-auto" : "h-10 w-auto sm:h-11"} width="420" height="124" />
    </Link>
  );
}
