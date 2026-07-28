import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal del sitio web de Marta Moreno.",
};

export default function LegalNoticePage() {
  return (
    <LegalPage
      eyebrow="La letra pequeña, contada claro"
      title="Aviso legal"
      updatedAt="28 de julio de 2026"
    >
      <h2>Responsable del sitio</h2>
      <p>
        Este sitio web pertenece a Marta Moreno, ilustradora y formadora. Para
        cualquier consulta relacionada con la web puedes escribir a{" "}
        <a href="mailto:mm@martamoreno.com">mm@martamoreno.com</a>.
      </p>

      <h2>Uso de la web</h2>
      <p>
        Al navegar por este sitio te comprometes a utilizarlo de forma lícita,
        respetuosa y sin causar daños a la web, a sus contenidos o a terceras
        personas. Marta puede actualizar, suspender o retirar contenidos cuando
        sea necesario.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Las ilustraciones, fotografías, textos, cursos, juegos y recursos
        descargables son propiedad de Marta Moreno o se utilizan con la
        autorización correspondiente. No está permitido reproducirlos,
        distribuirlos, transformarlos ni utilizarlos comercialmente sin
        permiso previo y por escrito.
      </p>
      <p>
        Los enlaces privados a recursos son personales para quienes los reciben.
        No deben publicarse ni redistribuirse sin autorización.
      </p>

      <h2>Enlaces externos y responsabilidad</h2>
      <p>
        La web puede enlazar a servicios de terceros. Marta no controla sus
        contenidos, disponibilidad ni políticas. Aunque se procura mantener la
        información actualizada, no se garantiza que la web esté disponible de
        forma ininterrumpida o libre de errores.
      </p>

      <h2>Ley aplicable</h2>
      <p>
        Este aviso se interpreta conforme a la legislación española. Cualquier
        desacuerdo se intentará resolver primero de forma amistosa.
      </p>
    </LegalPage>
  );
}
