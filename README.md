# 🛠️ Claude Code - Setup Optimizado

> Fork personalizado de [shanraisshan/claude-code-best-practice](https://github.com/shanraisshan/claude-code-best-practice) con instalador automatizado, configuración en español y mejoras adicionales.

[![Fork Status](https://img.shields.io/badge/fork-upstream%20synced-green)](https://github.com/shanraisshan/claude-code-best-practice)

## 🎯 Dos Niveles de Complejidad

Este repositorio ofrece **dos enfoques**:

1. **🚀 Setup Simplificado** - Instalación rápida con `install.sh`, ideal para comenzar
2. **🔬 Contenido Avanzado** - Workflows extendidos, skills y 10+ reportes técnicos del upstream

Elegí el nivel que necesites según tu proyecto.

---

## 📦 Contenido

### Setup Simplificado (Listo para Instalar)
- `install.sh` - Script de instalación automatizado
- `global-settings.json` - Configuración global preconfigurada
- `project-settings.json` - Settings de proyecto
- `project-CLAUDE.md` - Plantilla para tus proyectos
- `commands/rpi/` - Comandos Research → Plan → Implement
- `rules/` - 5 reglas de código (vibe-coding, commits, nextjs, etc)

### Contenido Avanzado (Referencias del Upstream)
- `reports/` - 10 reportes técnicos sobre Claude Code
  - Settings detallados
  - CLI flags y comandos
  - SDK vs CLI comparisons
  - Tips de Boris Cherny (creador)
  - Hooks, MCP servers y más
- `workflow/rpi/` - RPI expandido con 8 agentes especializados
- `.claude/skills/` - Skills avanzados (agent-browser, vibe-to-agentic, etc)
- `CLAUDE-upstream-reference.md` - Ejemplo de CLAUDE.md del upstream

Lee [INTEGRATION-NOTES.md](./INTEGRATION-NOTES.md) para entender cuándo usar cada nivel.

---

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

Este proyecto es un fork del repositorio original de shanraisshan. Tenés **3 formas** de sincronizar:

### 🤖 Opción 1: Automatización con GitHub Actions (Recomendado)

**Configuración de una sola vez:**

El fork incluye un workflow de GitHub Actions que:
- ✅ **Revisa cambios semanalmente** (cada lunes)
- ✅ **Analiza y categoriza** por nivel de riesgo
- ✅ **Crea issues automáticos** con reportes detallados
- ✅ **Opción de auto-integración** para cambios seguros (reportes, docs)

**No requiere acción - funciona automáticamente después del primer push** 🎉

Lee [AUTOMATION.md](./AUTOMATION.md) para detalles completos.

**Ejecución manual desde GitHub:**
1. Andá a: `Actions` → `Sync Upstream Changes`
2. Click en `Run workflow`
3. Elegí `auto_integrate: true` para integrar cambios seguros automáticamente

### 🔧 Opción 2: Script interactivo local

```bash
./sync-upstream.sh
```

El script te permitirá:
- Ver los cambios disponibles desde upstream
- Elegir entre merge o rebase
- Ver solo las diferencias sin aplicar cambios

### ⚙️ Opción 3: Sincronización manual

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

**Nota**: Este fork NO hace merge automático del upstream. Integramos selectivamente las mejoras más valiosas manteniendo la simplicidad del instalador.

---

## 📚 Contenido Avanzado

### Reportes Técnicos (`reports/`)

Documentación profunda sobre Claude Code (traída del upstream):

- `claude-settings.md` - Guía completa de todas las configuraciones
- `claude-commands.md` - Todos los comandos disponibles
- `claude-cli-startup-flags.md` - Flags de inicio del CLI
- `claude-global-vs-project-settings.md` - Diferencias entre configs
- `claude-boris-tips-feb-26.md` - Tips del creador Boris Cherny
- `claude-agent-memory.md` - Sistema de memoria de agentes
- `claude-agent-sdk-vs-cli-system-prompts.md` - Comparativa SDK vs CLI
- Y más...

### Workflow RPI Extendido (`workflow/rpi/`)

Versión avanzada del flujo Research → Plan → Implement con:

**8 Agentes Especializados**:
- `requirement-parser` - Parsea y valida requerimientos
- `product-manager` - Perspectiva de producto
- `technical-cto-advisor` - Decisiones arquitectónicas
- `ux-designer` - Experiencia de usuario
- `senior-software-engineer` - Implementación
- `code-reviewer` - Revisión de código
- `constitutional-validator` - Validación de constraints
- `documentation-analyst-writer` - Documentación

**3 Comandos Mejorados**:
- `research.md` - Investigación con validación constitucional
- `plan.md` - Planificación detallada multi-agente
- `implement.md` - Implementación con revisión automática

### Skills Avanzados (`.claude/skills/`)

- **agent-browser** - Navegación web automatizada con agentes
- **vibe-to-agentic-framework** - Convierte workflows vibe a agentic
- **weather-fetcher/transformer** - Ejemplo de arquitectura de microservicios

### ¿Cuándo usar el contenido avanzado?

**Usá el Setup Simplificado** para proyectos personales o equipos pequeños.

**Usá el Contenido Avanzado** cuando:
- Trabajás en equipos grandes con procesos estrictos
- Necesitás compliance y validaciones específicas
- Querés entender a fondo cómo funciona Claude Code
- Tenés requerimientos enterprise complejos

---

## 🤝 Filosofía de este Fork

**Upstream (shanraisshan)**: Repositorio de conocimiento y ejemplos de referencia
**Este Fork**: Kit de instalación plug-and-play + referencias avanzadas opcionales

Mantenemos ambos mundos:
- ✅ Instalación rápida y simple por defecto
- ✅ Contenido avanzado disponible cuando lo necesites
- ✅ Actualizaciones selectivas del upstream
```
