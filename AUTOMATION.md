# 🤖 Sistema de Sincronización Automática

Este repositorio incluye automatización para mantener tu fork actualizado con el upstream de forma inteligente.

## 🎯 Cómo Funciona

### Flujo Automático

```
┌─────────────────────────────────────────────────────────┐
│  Cada Lunes a las 9 AM UTC (o ejecución manual)       │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │  GitHub Action Corre  │
              └───────────┬───────────┘
                          │
                          ▼
            ┌─────────────────────────────┐
            │ ¿Hay cambios en upstream?   │
            └─────────┬───────────────────┘
                      │
         ┌────────────┴────────────┐
         │ NO                      │ SÍ
         ▼                         ▼
    ┌─────────┐      ┌──────────────────────────┐
    │ Terminar│      │ Ejecutar análisis        │
    └─────────┘      │ (categorizar cambios)    │
                     └──────────┬───────────────┘
                                │
                                ▼
                     ┌──────────────────────────┐
                     │ ¿Auto-integrate enabled? │
                     └──────────┬───────────────┘
                                │
                  ┌─────────────┴─────────────┐
                  │ NO                        │ SÍ
                  ▼                           ▼
         ┌────────────────┐        ┌──────────────────┐
         │ Crear Issue    │        │ Integrar cambios │
         │ para revisión  │        │ seguros (reports)│
         │ manual         │        └────────┬─────────┘
         └────────────────┘                 │
                                           ▼
                                    ┌──────────────┐
                                    │ Commit + Push│
                                    └──────────────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ Crear Issue  │
                                    │ con resumen  │
                                    └──────────────┘
```

## 🚀 Uso

### 1. Ejecución Automática (Semanal)

El workflow corre **automáticamente todos los lunes a las 9 AM UTC**:

- ✅ Detecta cambios en upstream
- ✅ Analiza y categoriza por riesgo
- ✅ Crea un issue con el reporte detallado
- ❌ NO hace push automático (requiere revisión)

### 2. Ejecución Manual (Con Auto-Integración)

Podés ejecutar el workflow manualmente desde GitHub:

**Pasos:**
1. Andá a: `https://github.com/TU_USUARIO/claude-code-best-practice/actions`
2. Click en "Sync Upstream Changes"
3. Click en "Run workflow"
4. Elegí:
   - **auto_integrate: false** → Solo crea issue para revisión
   - **auto_integrate: true** → Integra cambios seguros + crea issue

**Cambios seguros que se auto-integran:**
- ✅ `reports/` - Documentación nueva o actualizada
- ✅ `workflow/rpi/` - Ejemplos y workflows de referencia

**Cambios que NO se auto-integran:**
- ❌ `install.sh`, `global-settings.json`, etc (tu setup personalizado)
- ❌ `commands/rpi/`, `rules/` (tus versiones simplificadas)
- ❌ Configuraciones core

### 3. Ejecución Local (Script)

Para revisión manual inmediata:

```bash
# Ver análisis completo
bash scripts/analyze-upstream-changes.sh

# Usar el script interactivo original
bash sync-upstream.sh
```

## 📊 Categorización de Cambios

El sistema clasifica cambios por nivel de riesgo:

| Categoría | Riesgo | Auto-Integrable | Acción |
|-----------|--------|-----------------|--------|
| 📚 Reportes | 🟢 Bajo | ✅ Sí | Integración automática segura |
| 🔧 Workflows | 🟡 Medio | ⚠️ Con review | Revisar diff antes de integrar |
| 🎯 Skills | 🟡 Medio | ⚠️ Con review | Revisar diff antes de integrar |
| ⚙️ Configs | 🟠 Alto | ❌ No | Análisis manual cuidadoso |
| 🔴 Core Setup | 🔴 Crítico | ❌ No | NO integrar sin análisis profundo |

## 📋 Issues Automáticos

Cuando hay cambios, se crea un issue con:

### Contenido del Issue

```markdown
## 🔄 Resumen de Cambios del Upstream

**Commits nuevos**: X
**Última sincronización**: YYYY-MM-DD

## 📝 Últimos Commits del Upstream
[Log de últimos 10 commits]

## 📊 Análisis de Archivos Modificados

### Categorías de Cambios
[Tabla con archivos cambiados por categoría]

### Archivos Modificados Detallados
[Diff stat de archivos]

## 💡 Recomendaciones de Integración

### ✅ Integración Segura (Auto)
[Comandos para integrar cambios seguros]

### 🟡 Revisión Recomendada
[Comandos para revisar cambios medios]

### ⚠️ Requiere Análisis Manual
[Lista de archivos críticos]

## 🔍 Comandos Útiles
[Comandos git para explorar]

## 🎯 Próximos Pasos
[Acciones recomendadas]
```

### Labels Aplicados

- `upstream-sync` - Identifica issues de sincronización
- `needs-review` - Requiere revisión manual

## 🔧 Configuración

### Cambiar Frecuencia

Editá `.github/workflows/sync-upstream.yml`:

```yaml
on:
  schedule:
    # Cambiar el cron expression
    - cron: '0 9 * * 1'  # Lunes 9 AM UTC

# Opciones comunes:
# '0 9 * * 1' = Cada lunes 9 AM
# '0 9 * * *' = Todos los días 9 AM
# '0 9 1 * *' = Primer día del mes 9 AM
# '0 9 * * 5' = Cada viernes 9 AM
```

### Permisos Requeridos

El workflow necesita estos permisos (ya configurados):
- `contents: write` - Para hacer commits
- `issues: write` - Para crear issues
- `pull-requests: write` - Para crear PRs (futuro)

## 🎛️ Modos de Operación

### Modo 1: Solo Notificación (Default)

```yaml
# Automático cada lunes
# Manual con auto_integrate: false
```

**Comportamiento:**
- ✅ Detecta cambios
- ✅ Crea issue detallado
- ❌ NO hace cambios al código

### Modo 2: Auto-Integración Segura

```yaml
# Manual con auto_integrate: true
```

**Comportamiento:**
- ✅ Detecta cambios
- ✅ Integra reportes y workflows automáticamente
- ✅ Hace commit y push
- ✅ Crea issue con resumen

### Modo 3: Manual Local

```bash
bash sync-upstream.sh
```

**Comportamiento:**
- ✅ Control total
- ✅ Interactivo
- ✅ Elegís qué integrar

## 🔒 Seguridad

### Protecciones Implementadas

1. **Nunca sobrescribe tu setup core**
   - `install.sh`, `global-settings.json`, etc están protegidos
   - Solo se integra contenido de referencia

2. **Categorización inteligente**
   - Cambios clasificados por impacto
   - Recomendaciones claras por categoría

3. **Revisión manual por defecto**
   - Auto-integración requiere activación explícita
   - Issues para notificación y tracking

4. **Git best practices**
   - Commits descriptivos con co-autoría
   - No force push
   - Preserva tu historial

## 📝 Logs y Debugging

### Ver ejecuciones del workflow

```
https://github.com/TU_USUARIO/claude-code-best-practice/actions
```

### Testear análisis localmente

```bash
# Simular análisis
bash scripts/analyze-upstream-changes.sh

# Ver qué se integraría
git diff HEAD..upstream/main -- reports/
git diff HEAD..upstream/main -- workflow/
```

## 🎯 Mejores Prácticas

### Recomendaciones

1. **Revisá issues semanales**
   - Cuando llega un issue, dale una mirada
   - Decidí qué integrar según tus necesidades

2. **Usá auto-integrate para reportes**
   - Documentación siempre es segura de integrar
   - Ejecutá manual con `auto_integrate: true` mensualmente

3. **Análisis manual para cambios grandes**
   - Si el issue muestra muchos cambios, usá `sync-upstream.sh`
   - Revisá diffs cuidadosamente

4. **Mantené tu filosofía**
   - NO integres cambios que compliquen tu setup
   - El valor de tu fork es la simplicidad

## 🆘 Troubleshooting

### Issues deshabilitado (Error común en forks)

**Problema**: `HttpError: Issues has been disabled in this repository`

**Solución**:
1. Andá a: Settings → Features
2. Marcá la checkbox ✅ "Issues"
3. Re-run el workflow que falló

**Nota**: Los forks en GitHub suelen venir con Issues deshabilitado por defecto. El workflow ahora maneja este error gracefully y muestra el análisis en los logs si no puede crear el issue.

### El workflow no corre

**Problema**: No ves ejecuciones en Actions

**Solución**:
1. Verificá que Actions esté habilitado en tu repo
2. Settings → Actions → General → Allow all actions
3. El primer cron puede tardar hasta 1 hora en activarse

### Conflictos al auto-integrar

**Problema**: Auto-integración falla con conflictos

**Solución**:
```bash
# Local
git fetch upstream
git checkout upstream/main -- reports/
git reset  # Si hay conflictos
# Resolver manualmente
```

### Issue no se crea

**Problema**: Cambios detectados pero no hay issue

**Solución**:
1. Verificá permisos del workflow
2. Revisá logs en Actions
3. Ejecutá manual: Run workflow → auto_integrate: false

---

## 🎉 Ventajas del Sistema

✅ **Nunca te perdés updates** - Notificaciones semanales automáticas
✅ **Integración inteligente** - Solo lo seguro se auto-integra
✅ **Transparencia total** - Issues con análisis detallado
✅ **Control total** - Decidís qué integrar y cuándo
✅ **Cero mantenimiento** - Funciona solo después del setup inicial

---

**Próximo issue esperado**: Lunes que viene 🗓️
