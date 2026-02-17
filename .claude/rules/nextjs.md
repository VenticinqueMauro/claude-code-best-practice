---
description: Convenciones para proyectos Next.js y React
globs: "**/*.{tsx,ts,jsx,js}"
---

# Reglas Next.js / React

## Estructura de Componentes

- Un componente por archivo. El nombre del archivo = nombre del componente.
- Componentes en PascalCase. Hooks en camelCase con prefijo `use`.
- Preferí function components con arrow functions.
- Props siempre tipadas con interface, no type alias.

## App Router (Next.js 14+)

- Server Components por defecto. Solo agregar `"use client"` cuando sea necesario.
- Data fetching en Server Components, no en Client Components.
- Usar `loading.tsx`, `error.tsx`, `not-found.tsx` para cada route significativa.
- Server Actions en archivos separados con `"use server"` al inicio.

## State Management

- Estado local: `useState` / `useReducer`.
- Estado de server: React Query / SWR / Server Components.
- Estado global: Zustand solo si es estrictamente necesario. Evitar Context para state frecuente.

## Performance

- Usar `React.memo` solo con evidencia de re-renders innecesarios, no preventivamente.
- Imágenes con `next/image`. Links con `next/link`.
- Dynamic imports con `next/dynamic` para componentes pesados.
- Evitar barrel exports (`index.ts`) en carpetas grandes.

## Styling

- Preferir Tailwind CSS. Evitar CSS modules salvo casos justificados.
- No usar `style={}` inline excepto para valores dinámicos calculados.
- Clases de Tailwind ordenadas: layout → sizing → spacing → typography → visual.
