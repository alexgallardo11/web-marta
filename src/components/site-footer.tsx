import Image from "next/image";
import Link from "next/link";
import { InstagramIcon } from "@/components/icons/instagram-icon";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container site-footer__main">
        <div className="site-footer__brand">
          <Image
            src="/images/marta-moreno-logo.png"
            alt="Marta Moreno"
            width={226}
            height={60}
            className="h-auto w-48 brightness-0 invert"
          />
          <p>
            Ilustradora infantil y maestra. Te acompaño a crear personajes que
            emocionen y conecten.
          </p>
          <a
            href="https://www.instagram.com/martamoreno.art/"
            target="_blank"
            rel="noreferrer"
            className="site-footer__instagram"
          >
            <InstagramIcon className="size-5" aria-hidden="true" />
            @martamoreno.art
          </a>
        </div>

        <div className="site-footer__line" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="site-footer__links">
          <Link href="/#formacion">Formación</Link>
          <Link href="/juegos/personajes-locos">Juegos creativos</Link>
          <Link href="/#sobre-mi">Sobre mí</Link>
          <Link href="/aviso-legal">
            Aviso legal
          </Link>
          <Link href="/privacidad">Privacidad</Link>
          <Link href="/cookies">Cookies</Link>
          <Link href="/admin/login">Acceso</Link>
        </div>
      </div>
      <div className="site-footer__bottom">
        © {new Date().getFullYear()} Marta Moreno. Ilustración infantil y
        formación creativa.
      </div>
    </footer>
  );
}
