#!/bin/bash
# ============================================================
# Analyze Upstream Changes
# Genera un reporte detallado de cambios para revisión manual
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Obtener información de cambios
COMMITS_BEHIND=$(git rev-list --count HEAD..upstream/main)
LAST_SYNC_DATE=$(git log -1 --format=%cd --date=short)

echo "## 🔄 Resumen de Cambios del Upstream"
echo ""
echo "**Commits nuevos**: $COMMITS_BEHIND"
echo "**Última sincronización**: $LAST_SYNC_DATE"
echo "**Fecha del reporte**: $(date '+%Y-%m-%d')"
echo ""

# Últimos 10 commits del upstream
echo "---"
echo ""
echo "## 📝 Últimos Commits del Upstream"
echo ""
echo '```'
git log --oneline --graph --decorate -10 upstream/main
echo '```'
echo ""

# Análisis de archivos cambiados
echo "---"
echo ""
echo "## 📊 Análisis de Archivos Modificados"
echo ""

# Categorizar cambios
REPORTS_CHANGED=$(git diff HEAD..upstream/main --name-only | grep "^reports/" | wc -l)
WORKFLOW_CHANGED=$(git diff HEAD..upstream/main --name-only | grep "^workflow/" | wc -l)
SKILLS_CHANGED=$(git diff HEAD..upstream/main --name-only | grep "^\.claude/skills/" | wc -l)
CONFIG_CHANGED=$(git diff HEAD..upstream/main --name-only | grep -E "settings\.json|CLAUDE\.md" | wc -l)
CORE_CHANGED=$(git diff HEAD..upstream/main --name-only | grep -E "^(install\.sh|global-settings\.json|commands/rpi/|rules/)" | wc -l)

echo "### Categorías de Cambios"
echo ""
echo "| Categoría | Archivos | Riesgo | Acción Recomendada |"
echo "|-----------|----------|--------|-------------------|"
echo "| 📚 Reportes | $REPORTS_CHANGED | 🟢 Bajo | Integrar automáticamente |"
echo "| 🔧 Workflows | $WORKFLOW_CHANGED | 🟡 Medio | Revisar antes de integrar |"
echo "| 🎯 Skills | $SKILLS_CHANGED | 🟡 Medio | Revisar antes de integrar |"
echo "| ⚙️ Configuración | $CONFIG_CHANGED | 🟠 Alto | Revisar cuidadosamente |"
echo "| 🔴 Core Setup | $CORE_CHANGED | 🔴 Crítico | NO integrar sin análisis |"
echo ""

# Archivos específicos cambiados
echo "### Archivos Modificados Detallados"
echo ""
echo '```diff'
git diff HEAD..upstream/main --stat | head -50
echo '```'
echo ""

# Recomendaciones
echo "---"
echo ""
echo "## 💡 Recomendaciones de Integración"
echo ""

if [ "$REPORTS_CHANGED" -gt 0 ]; then
    echo "### ✅ Integración Segura (Auto)"
    echo ""
    echo "Estos cambios son seguros y pueden integrarse automáticamente:"
    echo ""
    echo '```bash'
    echo "git checkout upstream/main -- reports/"
    echo "git commit -m 'chore: update documentation from upstream'"
    echo '```'
    echo ""
fi

if [ "$WORKFLOW_CHANGED" -gt 0 ] || [ "$SKILLS_CHANGED" -gt 0 ]; then
    echo "### 🟡 Revisión Recomendada"
    echo ""
    echo "Estos cambios requieren revisión pero probablemente son seguros:"
    echo ""
    echo '```bash'
    echo "# Ver diferencias primero"
    echo "git diff HEAD..upstream/main -- workflow/"
    echo "git diff HEAD..upstream/main -- .claude/skills/"
    echo ""
    echo "# Si son útiles, integrar"
    echo "git checkout upstream/main -- workflow/"
    echo "git checkout upstream/main -- .claude/skills/"
    echo '```'
    echo ""
fi

if [ "$CONFIG_CHANGED" -gt 0 ] || [ "$CORE_CHANGED" -gt 0 ]; then
    echo "### ⚠️ Requiere Análisis Manual"
    echo ""
    echo "Estos cambios pueden afectar tu setup personalizado:"
    echo ""
    echo "**Archivos críticos modificados:**"
    echo '```'
    git diff HEAD..upstream/main --name-only | grep -E "(settings\.json|CLAUDE\.md|install\.sh|commands/rpi/|rules/)" || echo "Ninguno"
    echo '```'
    echo ""
    echo "**NO integres estos archivos sin revisarlos cuidadosamente.**"
    echo ""
fi

# Ver diferencias completas
echo "---"
echo ""
echo "## 🔍 Comandos Útiles"
echo ""
echo "Para ver diferencias detalladas:"
echo '```bash'
echo "# Ver todos los cambios"
echo "git diff HEAD..upstream/main"
echo ""
echo "# Ver cambios de un archivo específico"
echo "git diff HEAD..upstream/main -- path/to/file"
echo ""
echo "# Integrar manualmente con sync script"
echo "bash sync-upstream.sh"
echo '```'
echo ""

echo "---"
echo ""
echo "## 🎯 Próximos Pasos"
echo ""
echo "1. ⚡ **Automático**: Ejecutar workflow manual con opción \`auto_integrate: true\` para traer reportes"
echo "2. 👁️ **Revisar**: Analizar cambios en workflows y skills con \`git diff\`"
echo "3. 🔧 **Manual**: Usar \`./sync-upstream.sh\` para integración selectiva"
echo "4. ✅ **Validar**: Testear cambios localmente antes de pushear"
echo ""
echo "---"
echo ""
echo "*Reporte generado automáticamente por GitHub Actions* 🤖"
