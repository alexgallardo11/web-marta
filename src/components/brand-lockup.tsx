import Image from "next/image";

export function BrandLockup({ preload = false }: { preload?: boolean }) {
  return (
    <>
      <Image
        src="/images/web-2026/marta-illustration.png"
        alt=""
        width={1525}
        height={1576}
        preload={preload}
        className="site-header__mark"
        sizes="48px"
      />
      <span className="site-header__wordmark">
        <strong>Marta Moreno</strong>
        <small>Ilustradora infantil</small>
      </span>
    </>
  );
}
