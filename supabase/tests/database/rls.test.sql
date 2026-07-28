begin;

select plan(14);

select has_table('public', 'admin_users', 'Existe la tabla de administradores');
select has_table('public', 'documents', 'Existe la tabla de documentos');
select has_table('public', 'share_links', 'Existe la tabla de enlaces');
select has_table('public', 'download_events', 'Existe la tabla de descargas');

insert into auth.users (id, email)
values
  ('11111111-1111-4111-8111-111111111111', 'admin@example.com'),
  ('22222222-2222-4222-8222-222222222222', 'student@example.com');

insert into public.admin_users (user_id)
values ('11111111-1111-4111-8111-111111111111');

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
      '33333333-3333-4333-8333-333333333333/v1.pdf',
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
      '44444444-4444-4444-8444-444444444444',
      'Guía creativa',
      '55555555-5555-4555-8555-555555555555/v1.pdf',
      'guia.pdf',
      2048,
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  'La administradora puede crear documentos'
);
select is(
  (select count(*)::integer from public.documents),
  1,
  'La administradora puede listar documentos'
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
      '66666666-6666-4666-8666-666666666666',
      '44444444-4444-4444-8444-444444444444',
      repeat('a', 64),
      '11111111-1111-4111-8111-111111111111'
    )
  $$,
  'La administradora puede crear enlaces'
);
reset role;
select lives_ok(
  $$
    insert into public.download_events (share_link_id)
    values ('66666666-6666-4666-8666-666666666666')
  $$,
  'El servidor privilegiado puede registrar descargas'
);

reset role;
set local role anon;
select is(
  (select count(*)::integer from public.download_events),
  0,
  'Una persona anónima no puede leer eventos de descarga'
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

select * from finish();
rollback;
