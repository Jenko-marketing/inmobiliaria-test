# Inmobiliaria Bataglia — Maqueta funcional

Maqueta funcional (no el sistema final) para mostrarle al dueño de la inmobiliaria cómo
funcionaría el sistema de gestión: CRM de leads, stock de propiedades, seguimiento de
alquileres con pago de servicios, y automatización por WhatsApp (consultas de venta y
comprobantes de pago de inquilinos).

## Cómo correrla

Requisitos: Node.js 18+.

```bash
npm install
npx prisma generate
npm run db:push
npm run db:seed
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) para el sitio público, y
[http://localhost:3000/login](http://localhost:3000/login) para el panel interno.

**Login de demo** (ya viene precargado en el formulario):
- Email: `admin@inmobiliariabataglia.com`
- Contraseña: `bataglia2026`

Si en algún momento querés volver a dejar los datos como al principio:

```bash
npm run db:reset
```

## Qué es real y qué está simulado en esta versión

Esta es una **maqueta para la reunión con el dueño**, pensada para verse profesional y
mostrar el concepto funcionando, no para producción todavía.

**Funciona de verdad:**
- Alta, edición y baja de propiedades desde el panel — se reflejan al instante en el
  sitio público (misma base de datos).
- Sitio público con catálogo, filtros y **tour 360°** por propiedad (librería
  [Pannellum](https://pannellum.org/), con una panorámica de muestra; se reemplaza por
  fotos 360° reales de cada propiedad más adelante).
- CRM de leads (kanban por estado) y seguimiento de alquileres con estado de pago de
  luz, agua, expensas y otros gastos.
- Botón de WhatsApp en el sitio (`wa.me`) para consultas reales de visitantes.

**Está simulado** (documentado así a propósito, para no depender de cuentas externas
antes de tener el visto bueno del dueño):
- La recepción de mensajes de WhatsApp real (Meta Cloud API). En su lugar, en
  **Conversaciones** hay dos botones — "Simular comprobante recibido" y "Simular
  consulta nueva" — que generan en vivo un hilo de conversación, lo procesan y
  actualizan el dashboard (factura pagada, lead calificado y derivado a un humano),
  igual que lo haría el sistema real.
- La calificación de leads y la lectura de comprobantes usan reglas simples por
  defecto. Si se completa `ANTHROPIC_API_KEY` en `.env`, esas mismas simulaciones usan
  Claude de verdad (ver `lib/ai/claude.ts`).
- El aviso automático antes del vencimiento se representa con el badge "vence en Xd" en
  Alquileres; el envío real por WhatsApp se activa en la fase 2.

## Variables de entorno (`.env`)

Ver `.env.example`. Ya viene un `.env` con valores de desarrollo listos para correr la
demo tal cual. `ANTHROPIC_API_KEY` es opcional.

## Fase 2 (una vez aprobado por el dueño)

Lo que queda para pasar de maqueta a sistema real:

1. Cuenta de Meta Business + WhatsApp Cloud API (número verificado, `Phone Number ID`,
   token permanente) y conectar el webhook real (`lib/whatsapp/` queda como próximo
   módulo a agregar, siguiendo el mismo patrón que `lib/actions/simulate.ts`).
2. API key de Anthropic en el entorno de producción para calificación de leads y
   lectura de comprobantes en vivo.
3. Pasar la base de datos de SQLite a Postgres (un cambio de `provider` en
   `prisma/schema.prisma`) y desplegar (Vercel, Railway, etc.).
4. Autenticación multiusuario con roles (admin/agente) en lugar del usuario único de
   demo.
5. Envío real de recordatorios (cron diario) en vez del badge visual.
6. Reemplazar las imágenes y el tour 360° de muestra por material real de cada
   propiedad.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite) + Pannellum para los
tours 360°. Server Actions para todas las mutaciones (altas, cambios de estado,
simulaciones).
