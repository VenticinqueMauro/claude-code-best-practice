# 🛠️ Claude Code - Setup Optimizado

> Fork personalizado de [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) con instalador automatizado, configuración en español y mejoras adicionales.

[![Fork Status](https://img.shields.io/badge/fork-upstream%20synced-green)](https://github.com/shanraisshan/claude-code-best-practice)

## Estructura de archivos a crear

```
~/.claude/
├── settings.json              ← (1) Config Global de Comportamiento
├── CLAUDE.md                  ← (4) Memoria Global

TU_PROYECTO/
├── CLAUDE.md                  ← (4) Plantilla de Proyecto
├── .claude/
│   ├── settings.json          ← Config de equipo
│   ├── settings.local.json    ← Config personal (git-ignored)
│   ├── commands/
│   │   └── rpi/
│   │       ├── research.md    ← (2) RPI: Investigación
│   │       ├── plan.md        ← (2) RPI: Planificación
│   │       └── implement.md   ← (2) RPI: Implementación
│   └── rules/
│       ├── vibe-coding.md     ← (3) Reglas de vibe coding
│       ├── micro-tasks.md     ← (3) Gestión de micro-tareas
│       ├── commits.md         ← (3) Commits atómicos
│       ├── nextjs.md          ← (3) Reglas Next.js/React
│       └── context.md         ← (3) Gestión de contexto
```

---

## Instrucciones de instalación rápida

Ejecutar en terminal:

```bash
# 1. Config global
mkdir -p ~/.claude
cp global-settings.json ~/.claude/settings.json

# 2. Para CADA proyecto nuevo:
cd tu-proyecto
mkdir -p .claude/commands/rpi .claude/rules rpi/plans
cp project-CLAUDE.md ./CLAUDE.md
cp project-settings.json .claude/settings.json
cp commands/rpi/*.md .claude/commands/rpi/
cp rules/*.md .claude/rules/

# 3. Agregar a .gitignore
echo ".claude/settings.local.json" >> .gitignore
```

---

## Mantener tu fork actualizado

Este proyecto es un fork del repositorio original de shanraisshan. Para mantenerlo sincronizado con los últimos cambios:

### Opción 1: Script automatizado (Recomendado)

```bash
./sync-upstream.sh
```

El script te permitirá:
- Ver los cambios disponibles desde upstream
- Elegir entre merge o rebase
- Ver solo las diferencias sin aplicar cambios

### Opción 2: Sincronización manual

```bash
# 1. Fetch cambios del upstream
git fetch upstream

# 2. Ver qué cambios hay
git log --oneline HEAD..upstream/main

# 3. Merge o rebase según prefieras
git merge upstream/main
# o
git rebase upstream/main

# 4. Push a tu fork
git push origin master
```

### ¿Cuándo sincronizar?

- Antes de comenzar un proyecto nuevo
- Cada 2-4 semanas si el upstream está activo
- Cuando veas features interesantes en el repo original

**Nota**: Este fork agrega mejoras específicas que no están en el upstream (instalador, español, scripts), así que algunas configuraciones pueden divergir intencionalmente.
```
