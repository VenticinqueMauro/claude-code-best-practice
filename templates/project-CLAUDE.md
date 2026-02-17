# CLAUDE.md

> Guía de contexto para Claude Code en este proyecto.

## Proyecto

- **Nombre**: {nombre-del-proyecto}
- **Tipo**: Next.js 14+ / App Router
- **Descripción**: {una línea describiendo qué hace}
- **Repo**: {url}

## Stack

- **Framework**: Next.js 14+ con App Router
- **Lenguaje**: TypeScript (strict)
- **Styling**: Tailwind CSS
- **DB**: {Prisma + PostgreSQL / MongoDB / Supabase / etc}
- **Auth**: {NextAuth / Clerk / Custom / etc}
- **Deploy**: {Vercel / Railway / etc}
- **Package Manager**: {npm / pnpm / yarn}

## Comandos Principales

```bash
{pm} run dev        # Servidor de desarrollo
{pm} run build      # Build de producción
{pm} run lint       # Linting
{pm} run test       # Tests
npx tsc --noEmit    # Type-check sin emitir
```

## Estructura del Proyecto

```
src/
├── app/              # App Router: routes, layouts, pages
│   ├── api/          # API routes
│   ├── (auth)/       # Grupo de rutas con auth
│   └── globals.css
├── components/       # Componentes reutilizables
│   ├── ui/           # Primitivos (Button, Input, Modal)
│   └── features/     # Componentes de negocio
├── lib/              # Utilidades, helpers, configs
├── hooks/            # Custom hooks
├── types/            # Types e interfaces globales
├── services/         # Lógica de negocio y API calls
└── constants/        # Constantes y enums
```

## Convenciones de Código

- Server Components por defecto. `"use client"` solo cuando sea necesario.
- Props tipadas con `interface`, no `type`.
- Named exports siempre. Default exports solo para pages de Next.js.
- Un componente por archivo. Nombre de archivo = nombre del componente.
- Hooks personalizados en `hooks/` con prefijo `use`.
- Imports absolutos con alias `@/` desde `src/`.

## Patrones del Proyecto

{Describir 3-5 patrones específicos del proyecto, por ejemplo:}

- **Data Fetching**: Server Components con fetch directo. Client-side con React Query.
- **Forms**: React Hook Form + Zod para validación.
- **Error Handling**: Error boundaries por ruta. Try/catch en server actions.
- **API Pattern**: Route handlers en `app/api/` retornan `NextResponse.json()`.

## Archivos Clave

| Archivo | Propósito |
|---------|-----------|
| `src/lib/db.ts` | Conexión a base de datos |
| `src/lib/auth.ts` | Configuración de autenticación |
| `src/types/index.ts` | Types compartidos |
| `middleware.ts` | Middleware de Next.js |
| `.env.local` | Variables de entorno (NO leer) |

## Reglas Críticas

1. NUNCA leer `.env`, `.env.local` ni archivos en `secrets/`.
2. SIEMPRE correr `npx tsc --noEmit` antes de commitear.
3. SIEMPRE empezar con plan antes de implementar cambios grandes.
4. Commits atómicos: un cambio lógico por commit.
5. `/compact` manual al 50% de contexto.

## Dependencias Importantes

{Listar las 5-8 dependencias más relevantes y su versión}

| Paquete | Versión | Uso |
|---------|---------|-----|
| next | ^14.x | Framework |
| react | ^18.x | UI |
| typescript | ^5.x | Tipado |
| tailwindcss | ^3.x | Styling |
| {dep} | ^x.x | {uso} |

## Testing

- **Unit**: {Jest / Vitest} para funciones y hooks
- **Components**: React Testing Library
- **E2E**: {Playwright / Cypress} (si aplica)
- Correr: `{pm} run test` antes de PR

## Workflow RPI

Para features nuevas, usar el flujo Research → Plan → Implement:
1. `/rpi:research` - Analizar viabilidad antes de codificar
2. `/rpi:plan` - Descomponer en micro-tareas
3. `/rpi:implement` - Ejecutar tarea por tarea con commits atómicos

Los planes se guardan en `rpi/{feature-slug}/`.

---

## Memoria

{Esta sección se actualiza entre sesiones. Claude debe leer esto al inicio.}

### Última Sesión
- **Fecha**: {fecha}
- **Feature en progreso**: {nombre o "ninguna"}
- **Estado**: {descripción breve}
- **Próximo paso**: {qué hacer al retomar}

### Decisiones Técnicas Recientes
- {decisión 1}
- {decisión 2}

### Problemas Conocidos
- {issue 1}
- {issue 2}

---

## Skills

{Referencias a conocimiento especializado del proyecto}

### Dominio de Negocio
- {Contexto del negocio relevante para entender los requerimientos}

### APIs Externas
- {API 1}: {endpoint base, auth method, docs URL}
- {API 2}: {endpoint base, auth method, docs URL}

### Patrones Custom
- {Patrón propio del proyecto que Claude debe conocer}
