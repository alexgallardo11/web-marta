# Marta Moreno · web y biblioteca de recursos

Aplicación única en Next.js 16 para la landing pública, los juegos creativos y
la gestión privada de PDFs de Marta Moreno.

## Qué incluye

- Landing editorial responsive con el contenido y las imágenes de la web actual.
- Juegos `/juegos/personajes-locos` y `/juegos/caldero-magico`.
- Exportación del Caldero Mágico a PNG de 1080 × 1920.
- Panel privado en `/admin/documentos` con subida directa a Supabase Storage.
- Renombrado, sustitución segura, borrado y enlaces configurables. Los enlaces
  permanentes, la opción por defecto, permiten descargas ilimitadas; también se
  pueden crear enlaces de un solo uso con caducidad obligatoria (24 horas, 7
  días, 30 días o fecha personalizada).
- Descarga anónima mediante tokens de 256 bits; en base de datos se guarda su
  hash SHA-256 y, solo para los enlaces permanentes, una copia cifrada que el
  panel puede recuperar bajo demanda. Abrir `/recursos/:token` no consume la
  descarga; el botón hace un `POST /recursos/:token/download`. En los enlaces
  de un solo uso, la base de datos consume el token de forma atómica; los
  permanentes registran cada descarga sin consumir el enlace.
- SEO, sitemap, datos estructurados, páginas legales y redirección de la URL
  antigua.
- Pruebas unitarias, E2E multinavegador y auditoría WCAG 2.2 AA.

## Desarrollo local

Requisitos: Node.js 22, pnpm 9, Supabase CLI y Docker Desktop para ejecutar la
base de datos local.

```bash
pnpm install
cp .env.example .env.local
supabase start
supabase db reset
pnpm dev
```

`supabase status -o env` muestra las claves locales que deben copiarse a
`.env.local`. La web estará en `http://localhost:3000` y Supabase Studio en
`http://127.0.0.1:54323`.

La configuración local deshabilita el registro público. Para crear a Marta en
local, utiliza la sección Authentication de Studio y después ejecuta:

```sql
insert into public.admin_users (user_id, email, role, is_active)
select id, lower(email), 'owner'::public.admin_role, true
from auth.users
where email = 'EMAIL_DE_MARTA';
```

## Supabase de producción

1. Enlaza la CLI con el proyecto Marta `izoysmfdhghalkjhiwvn` mediante
   `supabase link --project-ref izoysmfdhghalkjhiwvn`.
2. Revisa el cambio con `supabase db push --dry-run`.
3. Aplica la migración con `supabase db push`.
4. En Authentication, desactiva **Allow new users to sign up** y añade como
   Site URL el dominio de producción.
5. Añade como redirect URL:
   `https://TU_DOMINIO/auth/callback?next=/admin/nueva-contrasena`.
6. En **Authentication → Users**, invita a
   `development@martamoreno.com`. La persona invitada creará su contraseña
   desde el enlace recibido; no se guarda ninguna contraseña en el repositorio.
7. Cuando la cuenta exista, registra su UUID como owner:

   ```sql
   insert into public.admin_users (user_id, email, role, is_active)
   select id, lower(email), 'owner'::public.admin_role, true
   from auth.users
   where lower(email) = 'development@martamoreno.com'
   on conflict (user_id) do update
     set email = excluded.email, role = excluded.role, is_active = excluded.is_active;
   ```

   Marta se puede añadir más adelante repitiendo el mismo proceso con
   `marta.ilustraciones@gmail.com`. La plataforma admite varias propietarias y
   protege cada cuenta owner frente a desactivaciones o cambios de rol.
8. Configura un SMTP propio para que la recuperación de contraseña sea fiable.

La migración crea RLS en las cuatro tablas y un bucket privado `documents` con
límite de 100 MB y MIME `application/pdf`. La clave secreta de Supabase nunca
debe exponerse con un prefijo `NEXT_PUBLIC_`.

## Variables de entorno

```dotenv
NEXT_PUBLIC_SITE_URL=https://martamoreno.com
NEXT_PUBLIC_SUPABASE_URL=https://TU_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
```

Se admiten también los nombres antiguos
`NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.

## Vercel

Importa el repositorio en Vercel, mantén el framework detectado como Next.js y
añade las cuatro variables en Preview y Production. En Preview,
`NEXT_PUBLIC_SITE_URL` debe ser la URL estable del entorno que se vaya a probar.
Añade también cada callback de Preview permitido en Supabase Auth.

Antes de mover el DNS:

1. Ejecuta la migración en el proyecto de producción.
2. Prueba login, recuperación, subida, sustitución y revocación en Preview.
3. Comprueba `/sitemap.xml`, `/robots.txt` y la redirección de
   `/crea-personajes-locos/`.
4. Asocia `martamoreno.com` en Vercel y solo entonces cambia los registros DNS.

## Calidad

```bash
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm audit --prod --audit-level high
pnpm exec playwright install chromium firefox webkit
pnpm test:e2e
```

Con Docker Desktop activo, las políticas se validan con:

```bash
supabase db reset
supabase db lint --local --fail-on error
supabase test db
```

GitHub Actions repite estas comprobaciones en cada pull request hacia `main` y
en cada push a esa rama. El resultado agregado que debe quedar verde antes de
fusionar es `CI / Required`. Consulta [CONTRIBUTING.md](./CONTRIBUTING.md) para
el flujo de ramas, pull requests y validación local.

Las pull requests creadas por Dependabot se fusionan automáticamente mediante
squash únicamente cuando la ejecución completa de CI y el check
`CI / Required` han finalizado correctamente. El workflow vuelve a comprobar
la autoría, la rama de destino y el SHA exacto antes de fusionar.

## Decisiones de seguridad

- Los PDFs tienen rutas UUID opacas y se sirven con URLs firmadas de 60 segundos.
- Los enlaces públicos no contienen IDs. El token no se guarda en claro y solo
  se puede recuperar desde el panel autenticado para enlaces permanentes; los
  enlaces de un solo uso se muestran una sola vez al crearlos.
- Los enlaces permanentes no caducan y pueden descargarse varias veces hasta
  que se revoquen. Los enlaces de un solo uso, revocados o caducados responden
  `410` al intentar descargarlos; los desconocidos, `404`.
- Los enlaces existentes se conservan como enlaces de un solo uso al activar
  esta política; los nuevos son permanentes por defecto.
- La clave `SHARE_LINK_ENCRYPTION_KEY` debe mantenerse estable si se configura;
  si se omite, se utiliza la clave secreta de Supabase.
- Los enlaces permanentes creados antes de guardar el token cifrado siguen
  funcionando, pero hay que crear uno nuevo si se necesita recuperarlo desde el
  panel.
- Sustituir un archivo conserva el documento y todos sus enlaces.
- Desactivar una cuenta invalida el acceso aunque conserve una sesión antigua.
- No se registran IP, user-agent, correo ni otros datos personales en las
  descargas.
- Las rutas del panel y de recursos incluyen instrucciones `noindex`.

## Antes de publicar

Las páginas legales incluyen la información funcional disponible, pero deben
revisarse con los datos fiscales reales de Marta (nombre legal completo, NIF y
domicilio profesional, si corresponde) y validarse con asesoría jurídica.

Vercel se vinculará más adelante directamente con GitHub. No hay workflows de
despliegue ni credenciales de Vercel en este repositorio; al conectarlo,
`main` será la Production Branch y el resto de ramas generará Previews.
