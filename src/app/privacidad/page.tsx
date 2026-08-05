import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacidad",
  description: "Política de privacidad del sitio web de Marta Moreno.",
  alternates: { canonical: "/privacidad" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Tu intimidad también se cuida"
      title="Política de privacidad"
      updatedAt="28 de julio de 2026"
    >
      <h2>Quién trata los datos</h2>
      <p>
        La responsable es Marta Moreno. Puedes contactar en{" "}
        <a href="mailto:mm@martamoreno.com">mm@martamoreno.com</a>.
      </p>

      <h2>Qué datos recoge esta web</h2>
      <p>
        La parte pública no solicita nombre, correo ni otros datos personales.
        Cuando se descarga un recurso mediante un enlace privado solo se
        registra la fecha de descarga y el enlace utilizado. No se almacenan la
        dirección IP, el dispositivo ni identificadores publicitarios.
      </p>
      <p>
        El acceso de administración trata únicamente los datos necesarios para
        autenticar a Marta y proteger el panel.
      </p>

      <h2>Finalidad y base jurídica</h2>
      <p>
        Los registros anónimos de descarga se usan para conocer el uso de los
        materiales y mantener la seguridad del servicio. La autenticación se
        utiliza para gestionar documentos y enlaces de forma segura. El
        tratamiento se basa en el interés legítimo de prestar y proteger el
        servicio.
      </p>

      <h2>Proveedores y conservación</h2>
      <p>
        La infraestructura utiliza Supabase para base de datos, autenticación y
        almacenamiento, y Vercel para alojar la aplicación. Los datos se
        conservan mientras sean necesarios para prestar el servicio o cumplir
        obligaciones legales.
      </p>

      <h2>Newsletter y páginas externas</h2>
      <p>
        La suscripción a la newsletter y determinadas formaciones se realizan
        en páginas externas. Antes de enviar tus datos, revisa la información de
        privacidad que aparece en esos formularios, ya que se rigen por sus
        propias condiciones.
      </p>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar acceso, rectificación, supresión, oposición,
        limitación o portabilidad escribiendo al correo indicado. Si consideras
        que el tratamiento no es adecuado, también puedes acudir a la Agencia
        Española de Protección de Datos.
      </p>
    </LegalPage>
  );
}
