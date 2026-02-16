# Notas de Integración

## Estructura Híbrida

Este fork mantiene una estructura híbrida que combina:

### 🔧 TU SETUP (Instalación Simplificada)
- `install.sh` - Script de instalación automatizado
- `global-settings.json` - Configuración global lista para usar
- `project-settings.json` - Configuración de proyecto
- `project-CLAUDE.md` - Plantilla para CLAUDE.md de proyectos
- `commands/rpi/*.md` - Comandos RPI originales simplificados
- `rules/*.md` - Reglas de código listas para usar

### 📚 UPSTREAM (Documentación y Referencias)
- `reports/` - 10 reportes técnicos detallados del upstream
- `workflow/rpi/` - Workflow RPI expandido con 8 agentes especializados
- `.claude/skills/` - Skills avanzados (agent-browser, weather, presentation)
- `CLAUDE-upstream-reference.md` - CLAUDE.md de referencia del upstream

---

## Uso Recomendado

### Para Comenzar Rápido (Principiantes)
Usá la estructura simplificada:
```bash
./install.sh
```

Esto instala:
- Config global en `~/.claude/`
- Comandos RPI básicos
- Reglas de código esenciales
- Plantilla CLAUDE.md

### Para Proyectos Avanzados
Consultá y usá las versiones extendidas:

**Workflow RPI Avanzado**: `workflow/rpi/.claude/`
- 8 agentes especializados
- Comandos RPI con validación constitucional
- Flujo más robusto para equipos

**Skills Especializados**: `.claude/skills/`
- `agent-browser` - Navegación web automatizada
- `vibe-to-agentic-framework` - Conversión de patrones
- `weather-*` - Ejemplo de arquitectura de microservicios

**Documentación Profunda**: `reports/`
- Settings detallados
- Comparativas SDK vs CLI
- Tips de Boris Cherny (creador de Claude Code)
- Hooks y MCP servers

---

## Diferencias Clave

| Aspecto | Tu Setup (Simplificado) | Upstream (Avanzado) |
|---------|------------------------|---------------------|
| **Instalación** | Script automatizado | Manual, referencia |
| **Comandos RPI** | 3 archivos básicos | 3 comandos + 8 agentes |
| **Configuración** | Preconfigurada en español | Ejemplos avanzados |
| **Documentación** | README conciso | 10+ reportes detallados |
| **Target** | Setup rápido | Aprendizaje profundo |

---

## Cuándo Usar Cada Versión

### Usar Setup Simplificado Si:
- Estás empezando con Claude Code
- Querés setup rápido sin configurar mucho
- Proyecto personal o pequeño equipo
- Preferís español

### Usar Versiones Upstream Si:
- Querés control total sobre el workflow
- Equipo grande con necesidades específicas
- Proyectos enterprise con compliance estricto
- Querés entender a fondo cómo funciona Claude Code

---

## Actualización desde Upstream

Este fork NO hace merge automático del upstream porque las filosofías son diferentes:
- **Upstream**: Repositorio de conocimiento y ejemplos
- **Este fork**: Kit de instalación plug-and-play

Para traer updates selectivos:
```bash
# Ver qué hay nuevo
./sync-upstream.sh  # Opción 3

# Traer archivos específicos
git checkout upstream/main -- reports/nuevo-reporte.md
```

---

## Contribuciones

Si encontrás mejoras útiles en el upstream que deberían estar en el setup simplificado:
1. Evaluá si mantiene la simplicidad
2. Adaptalo al español si es necesario
3. Integralo de forma opcional (no obligatoria)

**Principio**: El setup simplificado debe seguir siendo simple.
