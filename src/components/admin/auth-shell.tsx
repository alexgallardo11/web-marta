import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <main
      id="contenido"
      className="admin-auth-page paper-grain grid min-h-screen place-items-center px-4 py-10"
    >
      <div className="w-full max-w-md">
        <Link href="/" aria-label="Volver a la web de Marta">
          <Image
            src="/images/marta-moreno-logo.png"
            alt="Marta Moreno"
            width={226}
            height={60}
            className="mx-auto mb-8 h-auto w-48"
          />
        </Link>
        <section className="admin-auth-card border border-foreground/20 bg-[var(--paper)] p-6 sm:p-8">
          <p className="admin-eyebrow mb-3 text-[var(--pink)]">
            Biblioteca profesional
          </p>
          <h1 className="font-display text-5xl leading-none">{title}</h1>
          <p className="mb-8 mt-4 text-foreground/65">{description}</p>
          {children}
        </section>
      </div>
    </main>
  );
}
