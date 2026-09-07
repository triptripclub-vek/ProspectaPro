-- ProspectaPro Fase 1 ACTUALIZADA v2
-- ACUMULATIVO: ejecutar completo sobre el proyecto ProspectaPro FREE.
-- Incluye: agentes, prospectos, mensajes, campañas, landing por agente,
-- calculadoras administrables, respuestas rápidas del administrador y WhatsApp.

create extension if not exists pgcrypto;

-- =========================================================
-- 1) NÚCLEO
-- =========================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  platform text not null check (platform in ('Instagram','Facebook')),
  interest text not null,
  status text not null default 'Nuevo' check (status in ('Nuevo','Interesada','Caliente','Cerrado')),
  notes text not null default '',
  next_followup text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id uuid not null references public.leads(id) on delete cascade,
  direction text not null check (direction in ('in','out')),
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

-- =========================================================
-- 2) ADMINISTRADORES
-- =========================================================
create table if not exists public.app_admins (
  email text primary key,
  created_at timestamptz not null default now()
);
insert into public.app_admins(email) values ('triptripclub@gmail.com') on conflict (email) do nothing;

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.app_admins where lower(email)=lower(coalesce(auth.jwt()->>'email','')));
$$;
revoke all on function public.is_app_admin() from public;
grant execute on function public.is_app_admin() to authenticated;

-- =========================================================
-- 3) CAMPAÑAS PRECARGADAS
-- =========================================================
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null check (platform in ('Instagram','Facebook')),
  ramo text not null check (ramo in ('Vida','Gastos Médicos Mayores')),
  publication_text text not null default '',
  hashtags text not null default '',
  content_url text not null default '',
  content_name text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 4) CAMPAÑAS DEL AGENTE
-- =========================================================
create table if not exists public.agent_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  landing_slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique(user_id,campaign_id)
);

-- =========================================================
-- 5) LANDING CENTER DEL AGENTE
-- =========================================================
create table if not exists public.agent_landing_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  slug text not null unique,
  headline text not null default 'Encuentra una estrategia financiera adecuada para ti',
  subheadline text not null default 'Explora escenarios aproximados y recibe orientación personalizada.',
  welcome_text text not null default 'Elige un escenario, completa los datos y obtén una estimación rápida. Después podremos ayudarte a revisar una propuesta más completa.',
  whatsapp_number text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.agent_landing_pages add column if not exists whatsapp_number text not null default '';

-- =========================================================
-- 6) CALCULADORAS ADMINISTRABLES
-- fields = [[label,key,type,default], ...]
-- engine determina el cálculo que ejecuta la landing.
-- =========================================================
create table if not exists public.calculator_configs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '📊',
  engine text not null check (engine in ('Estudios Universitarios','Retiro','Hombre Clave','Fondo de Inversión')),
  fields jsonb not null default '[]'::jsonb,
  sort_order integer not null default 10,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 7) RESPUESTAS RÁPIDAS GLOBALES DEL ADMIN
-- =========================================================
create table if not exists public.admin_quick_replies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  sort_order integer not null default 10,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- 8) RESULTADOS DE CALCULADORAS
-- =========================================================
create table if not exists public.calculator_submissions (
  id uuid primary key default gen_random_uuid(),
  agent_user_id uuid not null references auth.users(id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  agent_campaign_id uuid references public.agent_campaigns(id) on delete set null,
  calculator_type text not null,
  prospect_name text not null,
  prospect_email text not null default '',
  prospect_phone text not null default '',
  company_name text not null default '',
  inputs jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.calculator_submissions drop constraint if exists calculator_submissions_calculator_type_check;

-- =========================================================
-- 9) ÍNDICES
-- =========================================================
create index if not exists leads_user_created_idx on public.leads(user_id,created_at desc);
create index if not exists messages_user_lead_created_idx on public.messages(user_id,lead_id,created_at);
create index if not exists campaigns_platform_ramo_idx on public.campaigns(platform,ramo,active);
create index if not exists agent_campaigns_user_idx on public.agent_campaigns(user_id,active);
create index if not exists calculator_submissions_agent_idx on public.calculator_submissions(agent_user_id,created_at desc);
create index if not exists calculator_configs_active_idx on public.calculator_configs(active,sort_order);
create index if not exists admin_quick_replies_active_idx on public.admin_quick_replies(active,sort_order);

-- =========================================================
-- 10) RLS
-- =========================================================
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.messages enable row level security;
alter table public.templates enable row level security;
alter table public.app_admins enable row level security;
alter table public.campaigns enable row level security;
alter table public.agent_campaigns enable row level security;
alter table public.agent_landing_pages enable row level security;
alter table public.calculator_configs enable row level security;
alter table public.admin_quick_replies enable row level security;
alter table public.calculator_submissions enable row level security;

drop policy if exists "profiles own rows" on public.profiles;
create policy "profiles own rows" on public.profiles for all using(id=auth.uid()) with check(id=auth.uid());
drop policy if exists "leads own rows" on public.leads;
create policy "leads own rows" on public.leads for all using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists "messages own rows" on public.messages;
create policy "messages own rows" on public.messages for all using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists "templates own rows" on public.templates;
create policy "templates own rows" on public.templates for all using(user_id=auth.uid()) with check(user_id=auth.uid());

drop policy if exists "admins self read" on public.app_admins;
create policy "admins self read" on public.app_admins for select to authenticated using(public.is_app_admin());
drop policy if exists "admins manage" on public.app_admins;
create policy "admins manage" on public.app_admins for all to authenticated using(public.is_app_admin()) with check(public.is_app_admin());

drop policy if exists "campaigns active read" on public.campaigns;
create policy "campaigns active read" on public.campaigns for select using(active=true or public.is_app_admin());
drop policy if exists "campaigns admin manage" on public.campaigns;
create policy "campaigns admin manage" on public.campaigns for all to authenticated using(public.is_app_admin()) with check(public.is_app_admin());

drop policy if exists "agent campaigns own" on public.agent_campaigns;
create policy "agent campaigns own" on public.agent_campaigns for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
drop policy if exists "agent campaigns public read" on public.agent_campaigns;
create policy "agent campaigns public read" on public.agent_campaigns for select using(active=true);

drop policy if exists "landing public read" on public.agent_landing_pages;
create policy "landing public read" on public.agent_landing_pages for select using(active=true);
drop policy if exists "landing own manage" on public.agent_landing_pages;
create policy "landing own manage" on public.agent_landing_pages for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());

drop policy if exists "calculators public read" on public.calculator_configs;
create policy "calculators public read" on public.calculator_configs for select using(active=true or public.is_app_admin());
drop policy if exists "calculators admin manage" on public.calculator_configs;
create policy "calculators admin manage" on public.calculator_configs for all to authenticated using(public.is_app_admin()) with check(public.is_app_admin());

drop policy if exists "quick replies active read" on public.admin_quick_replies;
create policy "quick replies active read" on public.admin_quick_replies for select to authenticated using(active=true);
drop policy if exists "quick replies admin manage" on public.admin_quick_replies;
create policy "quick replies admin manage" on public.admin_quick_replies for all to authenticated using(public.is_app_admin()) with check(public.is_app_admin());

drop policy if exists "calculator own read" on public.calculator_submissions;
create policy "calculator own read" on public.calculator_submissions for select to authenticated using(agent_user_id=auth.uid());

-- =========================================================
-- 11) STORAGE
-- =========================================================
insert into storage.buckets(id,name,public) values('campaign-content','campaign-content',true)
on conflict(id) do update set public=true;
drop policy if exists "campaign content admin upload" on storage.objects;
create policy "campaign content admin upload" on storage.objects for insert to authenticated with check(bucket_id='campaign-content' and public.is_app_admin());
drop policy if exists "campaign content admin update" on storage.objects;
create policy "campaign content admin update" on storage.objects for update to authenticated using(bucket_id='campaign-content' and public.is_app_admin()) with check(bucket_id='campaign-content' and public.is_app_admin());
drop policy if exists "campaign content admin delete" on storage.objects;
create policy "campaign content admin delete" on storage.objects for delete to authenticated using(bucket_id='campaign-content' and public.is_app_admin());

-- =========================================================
-- 12) PERFIL + LANDING AUTOMÁTICOS
-- =========================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,name,email) values(new.id,coalesce(new.raw_user_meta_data->>'name',''),coalesce(new.email,''))
  on conflict(id) do update set name=excluded.name,email=excluded.email;
  insert into public.agent_landing_pages(user_id,slug) values(new.id,'agente-'||replace(new.id::text,'-','')) on conflict(user_id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- =========================================================
-- 13) DATOS BASE POR AGENTE
-- =========================================================
create or replace function public.seed_prospectapro_user(p_user uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  insert into public.agent_landing_pages(user_id,slug) values(p_user,'agente-'||replace(p_user::text,'-','')) on conflict(user_id) do nothing;
  if not exists(select 1 from public.templates where user_id=p_user) then
    insert into public.templates(user_id,title,body) values
    (p_user,'Saludo inicial','¡Hola {nombre}! Gracias por escribir 😊 Con gusto te ayudo. Para recomendarte una opción adecuada, ¿qué tipo de protección estás buscando?'),
    (p_user,'Detectar necesidad','Para orientarte mejor, cuéntame: ¿qué te gustaría proteger principalmente, a tu familia, tus ingresos, tu salud o tu futuro financiero?'),
    (p_user,'Solicitar información','Perfecto. Para darte una orientación inicial necesito algunos datos básicos. Podemos revisarlos por aquí y después, si te interesa, agendamos una llamada.'),
    (p_user,'Agendar cita','Si te parece, podemos hacer una llamada breve para revisar tus opciones. ¿Qué día y horario te funcionan mejor?'),
    (p_user,'Seguimiento','Hola {nombre} 😊 Solo paso a dar seguimiento a nuestra conversación. ¿Te gustaría que retomemos la información que vimos?'),
    (p_user,'Cierre amable','Gracias por tu tiempo, {nombre}. Si más adelante quieres revisar opciones de protección, con gusto te apoyo.');
  end if;
  if not exists(select 1 from public.leads where user_id=p_user) then
    insert into public.leads(user_id,name,platform,interest,status,notes,next_followup) values
    (p_user,'Mariana López','Instagram','Seguro de vida','Caliente','Busca proteger a su familia','Hoy 18:00'),
    (p_user,'Daniela Torres','Facebook','Protección familiar','Interesada','Preguntó por costo','Mañana 10:30'),
    (p_user,'Patricia Gómez','Instagram','Retiro y ahorro','Nuevo','Quiere conocer alternativas','Jueves 12:00'),
    (p_user,'Carlos Ramírez','Facebook','Seguro de vida','Nuevo','Llegó desde publicación',''),
    (p_user,'Laura Sánchez','Instagram','Gastos médicos','Interesada','Preguntó por cobertura','');
  end if;
end;
$$;
revoke all on function public.seed_prospectapro_user(uuid) from public;
grant execute on function public.seed_prospectapro_user(uuid) to authenticated;

-- =========================================================
-- 14) RPC PÚBLICA: GUARDA CALCULADORA + CREA PROSPECTO
-- =========================================================
drop function if exists public.submit_calculator_lead(uuid,uuid,uuid,text,text,text,text,text,jsonb,jsonb);

create or replace function public.submit_calculator_lead(
  p_landing_slug text,
  p_agent_user_id uuid,
  p_campaign_id uuid,
  p_agent_campaign_id uuid,
  p_calculator_type text,
  p_prospect_name text,
  p_prospect_email text,
  p_prospect_phone text,
  p_company_name text,
  p_inputs jsonb,
  p_result jsonb
)
returns uuid language plpgsql security definer set search_path=public as $$
declare
  v_submission_id uuid;
  v_platform text := 'Instagram';
  v_notes text;
  v_lead_id uuid;
  v_calc_id uuid;
  v_calc_active boolean;
begin
  if p_agent_user_id is null then raise exception 'Agente no especificado'; end if;
  if trim(coalesce(p_prospect_name,''))='' then raise exception 'Nombre requerido'; end if;
  if trim(coalesce(p_prospect_phone,''))='' then raise exception 'Teléfono requerido'; end if;
  if trim(coalesce(p_landing_slug,''))='' then raise exception 'Landing no especificada'; end if;

  if not exists(select 1 from public.agent_landing_pages where user_id=p_agent_user_id and slug=p_landing_slug and active=true) then
    raise exception 'Landing no válida';
  end if;

  v_calc_id := nullif(coalesce(p_inputs->>'calculator_id',''),'')::uuid;
  select active into v_calc_active from public.calculator_configs where id=v_calc_id;
  if coalesce(v_calc_active,false)=false then raise exception 'Calculadora no válida'; end if;

  if p_agent_campaign_id is not null then
    if not exists(select 1 from public.agent_campaigns where id=p_agent_campaign_id and user_id=p_agent_user_id and landing_slug=p_landing_slug and active=true) then
      raise exception 'Campaña del agente no válida';
    end if;
  end if;

  if p_campaign_id is not null then
    select platform into v_platform from public.campaigns where id=p_campaign_id and active=true;
  end if;
  v_platform:=coalesce(v_platform,'Instagram');
  v_notes:='Lead generado desde Calculadora: '||p_calculator_type||'. Resultado: '||coalesce(p_result::text,'{}');

  insert into public.calculator_submissions(agent_user_id,campaign_id,agent_campaign_id,calculator_type,prospect_name,prospect_email,prospect_phone,company_name,inputs,result)
  values(p_agent_user_id,p_campaign_id,p_agent_campaign_id,trim(p_calculator_type),trim(p_prospect_name),trim(coalesce(p_prospect_email,'')),trim(p_prospect_phone),trim(coalesce(p_company_name,'')),coalesce(p_inputs,'{}'::jsonb),coalesce(p_result,'{}'::jsonb))
  returning id into v_submission_id;

  insert into public.leads(user_id,name,platform,interest,status,notes,next_followup)
  values(p_agent_user_id,trim(p_prospect_name),v_platform,trim(p_calculator_type),'Nuevo',v_notes,'') returning id into v_lead_id;
  return v_submission_id;
end;
$$;
revoke all on function public.submit_calculator_lead(text,uuid,uuid,uuid,text,text,text,text,text,jsonb,jsonb) from public;
grant execute on function public.submit_calculator_lead(text,uuid,uuid,uuid,text,text,text,text,text,jsonb,jsonb) to anon,authenticated;

-- =========================================================
-- 15) CALCULADORAS BASE
-- =========================================================
insert into public.calculator_configs(title,description,icon,engine,fields,sort_order,active)
select * from (values
('Plan de Estudios Universitario','Estima un escenario aproximado para cubrir estudios universitarios futuros.','🎓','Estudios Universitarios','[["Edad actual","f_age","number","35"],["Años hasta iniciar universidad","f_years","number","8"],["Costo anual actual estimado","f_cost","number","120000"],["Años de estudio","f_study","number","5"],["Inflación educativa anual (%)","f_inf","number","5"]]'::jsonb,1,true),
('Plan para el Retiro','Proyecta un fondo aproximado para tu etapa de retiro.','🌅','Retiro','[["Edad actual","f_age","number","40"],["Edad de retiro","f_ret","number","65"],["Gasto mensual deseado en retiro","f_cost","number","30000"],["Ahorro actual","f_save","number","200000"],["Rendimiento anual estimado (%)","f_rate","number","7"],["Inflación anual (%)","f_inf","number","4"]]'::jsonb,2,true),
('Hombre Clave de una Empresa','Estima un escenario aproximado del impacto económico de una persona clave.','🏢','Hombre Clave','[["Nombre de la persona clave","f_person","text",""],["Empresa","f_company","text",""],["Ingreso anual","f_income","number","900000"],["Años de impacto estimado","f_years","number","3"],["Impacto económico (%)","f_impact","number","50"]]'::jsonb,3,true),
('Fondo de Inversión','Proyecta el crecimiento aproximado de una inversión con aportaciones periódicas.','📈','Fondo de Inversión','[["Capital inicial","f_initial","number","100000"],["Aportación mensual","f_monthly","number","5000"],["Plazo (años)","f_years","number","10"],["Rendimiento anual estimado (%)","f_rate","number","8"]]'::jsonb,4,true)
) v(title,description,icon,engine,fields,sort_order,active)
where not exists(select 1 from public.calculator_configs c where c.engine=v.engine);

-- =========================================================
-- 16) RESPUESTAS RÁPIDAS BASE
-- =========================================================
insert into public.admin_quick_replies(title,body,sort_order,active)
select * from (values
('Primer contacto','¡Hola {nombre}! Gracias por escribirnos. Con gusto puedo orientarte y ayudarte a identificar una opción adecuada para lo que estás buscando.',1,true),
('Invitación a usar calculadora','Hola {nombre} 😊 Si quieres, puedes revisar un escenario aproximado y después lo vemos juntos para encontrar una alternativa más completa.',2,true),
('Agendar cita','Si te parece, podemos revisar tu escenario en una llamada breve. ¿Qué día y horario te funcionan mejor?',3,true),
('Seguimiento','Hola {nombre} 😊 Solo paso a dar seguimiento. ¿Te gustaría que retomemos la información que vimos?',4,true)
) v(title,body,sort_order,active)
where not exists(select 1 from public.admin_quick_replies r where r.title=v.title);

-- =========================================================
-- 17) CAMPAÑAS BASE
-- =========================================================
insert into public.campaigns(title,platform,ramo,publication_text,hashtags)
select * from (values
('Vida · Protección familiar · Instagram','Instagram','Vida','Tu familia merece una protección que siga trabajando cuando más la necesita. Conoce un escenario aproximado para proteger ingresos, metas y futuro. Descubre tu escenario y solicita orientación personalizada.','#SeguroDeVida #ProteccionFamiliar #FinanzasPersonales #PlaneacionFinanciera'),
('Vida · Protección familiar · Facebook','Facebook','Vida','¿Qué pasaría con las metas de tu familia si mañana tus ingresos cambiaran? Explora un escenario aproximado de protección y descubre alternativas para planear con tiempo.','#SeguroDeVida #ProteccionFamiliar #PlaneacionFinanciera #Prevision'),
('Gastos Médicos Mayores · Instagram','Instagram','Gastos Médicos Mayores','Una emergencia médica puede cambiar tus planes financieros. Conoce un escenario aproximado y revisa alternativas de protección para ti y tu familia.','#GastosMedicosMayores #SaludFinanciera #ProteccionFamiliar #Prevencion'),
('Gastos Médicos Mayores · Facebook','Facebook','Gastos Médicos Mayores','Tu salud y tus finanzas merecen estar protegidas. Explora un escenario aproximado de Gastos Médicos Mayores y después recibe orientación de un asesor.','#GastosMedicos #SeguroDeSalud #ProteccionFinanciera #Prevencion')
) v(title,platform,ramo,publication_text,hashtags)
where not exists(select 1 from public.campaigns c where c.title=v.title);
