# Contribuir

`main` representa la versión destinada a producción. Los cambios deben seguir
este flujo:

1. Crear una rama desde `main`.
2. Implementar y validar el cambio localmente.
3. Abrir un pull request dirigido a `main`.
4. Esperar a que `CI / Required` termine correctamente.
5. Resolver los comentarios y fusionar mediante squash.

## Comprobaciones locales

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm build
pnpm audit --prod --audit-level high
pnpm exec playwright install chromium firefox webkit
PLAYWRIGHT_WEB_SERVER_COMMAND="pnpm start" pnpm test:e2e
```

Con Docker Desktop activo:

```bash
supabase start
supabase db reset
supabase db lint --local --fail-on error
supabase test db
supabase stop --project-id marta-moreno --no-backup
```

No se deben incluir archivos `.env`, claves de Supabase, tokens de GitHub,
credenciales de Vercel, PDFs privados ni datos personales.

## Limitación de GitHub Free

GitHub Free no permite aplicar reglas de protección a ramas privadas. Hasta
cambiar a GitHub Pro, el flujo mediante pull request es una política operativa:
GitHub Actions informa si un cambio es válido, pero la cuenta administradora
todavía puede hacer push directo o fusionar con checks fallidos.

Al habilitar GitHub Pro se configurará `main` con pull request obligatorio,
`CI / Required` obligatorio, rama actualizada, conversaciones resueltas,
historial lineal y bloqueo de force-push y eliminación.
