# 🛠️ Claude Code - Setup Optimizado para Mauro

> Guía completa de Ingeniería de Contexto basada en el análisis de
> [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice)

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
