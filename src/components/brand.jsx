import Link from "next/link";

/**
 * `light` utiliza la variante blanca y dorada sobre fondos oscuros.
 * La imagen no añade fondos ni rellenos alrededor del logotipo.
 */
export function Brand({ compact = false, href = "/", light = false }) {
  const logoSrc = light ? "/logo-conectu-dark.svg" : "/logo-conectu.svg";

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center"
      aria-label="ConectU, ir al inicio"
    >
      <img
        src={logoSrc}
        alt="ConectU"
        width="1078"
        height="368"
        className={compact ? "h-8 w-auto" : "h-10 w-auto sm:h-11"}
      />
    </Link>
  );
}
