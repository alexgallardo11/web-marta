import Image from "next/image";
import Link from "next/link";
import { Mail } from "lucide-react";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { CLUB_URL } from "@/lib/site-links";

export function SiteFooter() {
  return (
    <footer id="contacto" className="site-footer">
      <div className="site-container site-footer__main">
        <div className="site-footer__brand">
          <div className="site-footer__brand-lockup">
            <Image
              src="/images/web-2026/marta-illustration.png"
              alt=""
              width={1525}
              height={1576}
              sizes="88px"
            />
            <div>
              <strong>Marta Moreno</strong>
              <span>Ilustradora infantil y maestra</span>
            </div>
          </div>
          <p>
            Historias, personajes y espacios para volver a disfrutar dibujando
            con emoción y a tu manera.
          </p>
        </div>

        <div className="site-footer__contact">
          <p className="eyebrow">¿Hablamos?</p>
          <a href="mailto:mm@martamoreno.com" className="site-footer__email">
            <Mail aria-hidden="true" />
            mm@martamoreno.com
          </a>
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

        <div className="site-footer__links">
          <Link href="/">Inicio</Link>
          <Link href="/#libros">Mis libros</Link>
          <a href={CLUB_URL} target="_blank" rel="noreferrer">
            Mi Club de Ilustración
          </a>
          <Link href="/juegos/personajes-locos">Juegos creativos</Link>
          <Link href="/aviso-legal">Aviso legal</Link>
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
