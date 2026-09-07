# ProspectaPro · Fase 1 Actualizada v2 · Supabase + Vercel

Esta versión incluye el núcleo de ProspectaPro y deja implementados desde esta fase:

- Registro e inicio de sesión de agentes con Supabase Auth.
- Dashboard, prospectos, conversaciones, mensajes y seguimientos.
- Campañas precargadas por administrador, filtradas por Instagram/Facebook y Vida/Gastos Médicos Mayores.
- Módulo **Crear campaña** para que el agente active una campaña y genere su enlace personalizado.
- Landing pública individual por agente.
- **Landing Center > WhatsApp** para guardar/editar el número del agente.
- Botón flotante de WhatsApp en la landing, que abre una conversación con el agente.
- Cuatro calculadoras iniciales: Estudios Universitarios, Retiro, Hombre Clave y Fondo de Inversión.
- **Admin > Calculadoras** para editar las calculadoras base y crear nuevas reutilizando los motores disponibles.
- **Admin > Respuestas rápidas** para cargar mensajes que todos los agentes pueden usar.
- Mensajes propios del agente + respuestas rápidas globales del administrador.
- Registro de los datos y resultados de las calculadoras en Supabase.
- Creación automática de un prospecto en el panel del agente cuando un visitante guarda su escenario.
- RLS para separar los datos de cada agente.
- Contenido descargable de campañas mediante Supabase Storage.

## 1. Supabase

El archivo `supabase_phase1.sql` es **acumulativo**. Puede ejecutarse sobre el proyecto ProspectaPro FREE donde ya ejecutaste el SQL anterior. No borres las tablas actuales.

Ejecuta el archivo completo una sola vez en:

Supabase → ProspectaPro → SQL Editor

El administrador inicial configurado es `triptripclub@gmail.com`.

## 2. GitHub

Sube todos los archivos de este proyecto a un repositorio independiente llamado `ProspectaPro`.

No uses el ZIP SQLite anterior.

## 3. Vercel

Conecta el repositorio y agrega estas variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Nunca coloques una clave `service_role` en el navegador.

## 4. Rutas

- Agente: `/`
- Administrador: `/admin.html`
- Landing pública: `/landing.html?slug=...&campaign=...`

## 5. Flujo de campañas

Administrador → crea campaña → define red, ramo, publicación, hashtags y contenido.

Agente → selecciona red + ramo + campaña → activa → recibe enlace personalizado.

Prospecto → abre landing → usa calculadora → captura nombre/teléfono → resultado → registro en Supabase → prospecto creado automáticamente para el agente.

## 6. WhatsApp

Agente → Landing Center → WhatsApp → guarda su número con clave de país y solo números.

La landing muestra un botón flotante de WhatsApp. El botón abre WhatsApp con un mensaje inicial. Esto no requiere todavía la API oficial de WhatsApp; la integración automatizada se podrá incorporar en una fase posterior.

## 7. Calculadoras

Los resultados son estimaciones ilustrativas. No son cotizaciones ni asesoría financiera. Los cuatro motores iniciales están separados de la configuración visual para permitir que el administrador cambie nombres, descripciones, iconos y visibilidad sin modificar código.

Las calculadoras nuevas creadas por el administrador reutilizan uno de los cuatro motores disponibles en esta fase. En una fase posterior podemos agregar motores de cálculo especializados adicionales.
