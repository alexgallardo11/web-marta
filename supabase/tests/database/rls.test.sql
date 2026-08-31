begin;

select plan(30);

select has_table('public', 'admin_users', 'Existe la tabla de administradores');
select has_table('public', 'documents', 'Existe la tabla de documentos');
select has_table('public', 'share_links', 'Existe la tabla de enlaces');
select has_table('public', 'download_events', 'Existe la tabla de descargas');
select has_type('public', 'admin_role', 'Existe el enum de roles');
select has_type('public', 'share_link_policy', 'Existe el enum de políticas de enlace');

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'admin@example.com'),
  ('22222222-2222-4222-8222-222222222222', 'student@example.com'),
  ('33333333-3333-4333-8333-333333333333', 'marta@example.com'),
  ('55555555-5555-4555-8555-555555555555', 'development@example.com'),
  ('44444444-4444-4444-8444-444444444444', 'inactive@example.com');

insert into public.admin_users (user_id, email, role, is_active)
values
  ('11111111-1111-4111-8111-111111111111', 'admin@example.com', 'admin', true),
  ('33333333-3333-4333-8333-333333333333', 'marta@example.com', 'owner', true),
  ('55555555-5555-4555-8555-555555555555', 'development@example.com', 'owner', true),
  ('44444444-4444-4444-8444-444444444444', 'inactive@example.com', 'admin', false);

set local role anon;
select is(
  (select count(*)::integer from public.documents),
  0,
  'Una persona anónima no puede listar documentos'
);
select is(
  (select count(*)::integer from public.share_links),
  0,
  'Una persona anónima no puede listar enlaces'
);
select throws_ok(
  $$
    insert into storage.objects (bucket_id, name)
    values ('documents', 'intento-anonimo.pdf')
  $$,
  '42501',
  null,
  'Una persona anónima no puede subir al bucket privado'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '22222222-2222-4222-8222-222222222222',
  true
);

select is(
  (select count(*)::integer from public.documents),
  0,
  'Un usuario autenticado no autorizado no puede listar documentos'
);
select throws_ok(
  $$
    insert into public.documents (
      title,
      storage_path,
      original_filename,
      size_bytes,
      created_by
    )
    values (
      'Documento prohibido',
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/v1.pdf',
      'prohibido.pdf',
      1024,
      '22222222-2222-4222-8222-222222222222'
    )
  $$,
  '42501',
  null,
  'Un usuario no autorizado no puede crear documentos'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '11111111-1111-4111-8111-111111111111',
  true
);

select lives_ok(
  $$
    insert into public.documents (
      id,
      title,
      storage_path,
      original_filename,
      size_bytes,
      created_by
    )
    values (
      '55555555-5555-4555-8555-555555555555',
      'Guía creativa',
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb/v1.pdf',
      'guia.pdf',
      2048,
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  'La administradora activa puede crear documentos'
);
select is(
  (select count(*)::integer from public.documents),
  1,
  'La administradora activa puede listar documentos'
);
select lives_ok(
  $$
    insert into public.share_links (
      id,
      document_id,
      token_hash,
      policy,
      expires_at,
      created_by
    )
    values (
      '66666666-6666-4666-8666-666666666666',
      '55555555-5555-4555-8555-555555555555',
      repeat('a', 64),
      'one_time',
      '2030-01-01T00:00:00Z',
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  'La administradora activa puede crear enlaces con caducidad'
);
select lives_ok(
  $$
    insert into public.share_links (
      id,
      document_id,
      token_hash,
      created_by
    )
    values (
      '77777777-7777-4777-8777-777777777777',
      '55555555-5555-4555-8555-555555555555',
      repeat('b', 64),
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  'Los enlaces nuevos son permanentes por defecto'
);
select is(
  (select policy::text from public.share_links where id = '77777777-7777-4777-8777-777777777777'),
  'permanent',
  'La política por defecto es permanente'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '44444444-4444-4444-8444-444444444444',
  true
);
select is(
  (select count(*)::integer from public.documents),
  0,
  'Una administradora inactiva no puede listar documentos'
);
select throws_ok(
  $$
    insert into public.documents (
      title,
      storage_path,
      original_filename,
      size_bytes,
      created_by
    )
    values (
      'Documento inactivo',
      'cccccccc-cccc-4ccc-8ccc-cccccccccccc/v1.pdf',
      'inactivo.pdf',
      1024,
      '44444444-4444-4444-8444-444444444444'
    )
  $$,
  '42501',
  null,
  'Una administradora inactiva no puede crear documentos'
);

reset role;
set local role authenticated;
select set_config(
  'request.jwt.claim.sub',
  '33333333-3333-4333-8333-333333333333',
  true
);
select is(
  (select count(*)::integer from public.admin_users),
  4,
  'Las propietarias pueden listar todas las cuentas'
);
select throws_ok(
  $$
    update public.admin_users
    set is_active = false
    where role = 'owner'
  $$,
  'P0001',
  'The owner account cannot be deactivated or demoted',
  'Una propietaria no puede desactivarse'
);

reset role;
set local role service_role;
select set_config('request.jwt.claim.sub', '', true);
select lives_ok(
  $$ select * from public.consume_share_link(repeat('a', 64)) $$,
  'El servidor puede consumir un enlace válido'
);
select is(
  (select used_at is not null from public.share_links where id = '66666666-6666-4666-8666-666666666666'),
  true,
  'El consumo marca el enlace como utilizado'
);
select is(
  (select count(*)::integer from public.download_events where share_link_id = '66666666-6666-4666-8666-666666666666'),
  1,
  'El primer consumo registra exactamente un evento'
);
select is(
  (select count(*)::integer from public.consume_share_link(repeat('a', 64))),
  0,
  'El segundo consumo no devuelve el enlace'
);
select is(
  (select count(*)::integer from public.consume_share_link(repeat('b', 64))),
  1,
  'Un enlace permanente permite la primera descarga'
);
select is(
  (select count(*)::integer from public.download_events where share_link_id = '77777777-7777-4777-8777-777777777777'),
  1,
  'La primera descarga permanente queda registrada'
);
select is(
  (select used_at is null from public.share_links where id = '77777777-7777-4777-8777-777777777777'),
  true,
  'Un enlace permanente no se marca como utilizado'
);
select is(
  (select count(*)::integer from public.consume_share_link(repeat('b', 64))),
  1,
  'Un enlace permanente permite descargas posteriores'
);
select is(
  (select count(*)::integer from public.download_events where share_link_id = '77777777-7777-4777-8777-777777777777'),
  2,
  'Las descargas posteriores permanentes quedan registradas'
);

select is(
  (select private.is_admin()),
  false,
  'El rol service_role no depende de la sesión de administrador'
);

select * from finish();
rollback;
