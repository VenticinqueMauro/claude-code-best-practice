#!/bin/bash
# ============================================================
# Smart Integration Script
# Integra cambios del upstream automáticamente usando reglas
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
RULES_FILE="$PROJECT_ROOT/config/integration-rules.json"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# ──────────────────────────────────────────
# Funciones Helper
# ──────────────────────────────────────────

log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Verificar si un path coincide con un patrón glob
matches_pattern() {
    local file="$1"
    local pattern="$2"

    # Convertir pattern glob a regex básico
    # Escapar caracteres especiales y convertir * a .*
    local regex=$(echo "$pattern" | sed 's/\./\\./g' | sed 's/\*\*/\.\*/g' | sed 's/\*/[^\/]*/g')

    if echo "$file" | grep -qE "^${regex}$"; then
        return 0
    else
        return 1
    fi
}

# Verificar si un archivo debe ser ignorado
should_ignore() {
    local file="$1"

    # Patrones de ignore (desde el JSON simplificado)
    local ignore_patterns=(
        "**/*.png" "**/*.jpg" "**/*.jpeg" "**/*.gif" "**/*.webp"
        "**/*.mp3" "**/*.wav" "**/node_modules/**"
        "**/.DS_Store" "**/Thumbs.db"
    )

    for pattern in "${ignore_patterns[@]}"; do
        if matches_pattern "$file" "$pattern"; then
            return 0
        fi
    done

    return 1
}

# Verificar si un archivo está protegido
is_protected() {
    local file="$1"

    # Archivos críticos que NUNCA se tocan
    local protected_files=(
        "install.sh"
        "sync-upstream.sh"
        "global-settings.json"
        "project-settings.json"
        "project-CLAUDE.md"
        "README.md"
        "AUTOMATION.md"
        "INTEGRATION-NOTES.md"
        ".gitignore"
    )

    for protected in "${protected_files[@]}"; do
        if [[ "$file" == "$protected" ]]; then
            return 0
        fi
    done

    # Patterns protegidos
    local protected_patterns=(
        "commands/rpi/*.md"
        "rules/*.md"
        ".github/workflows/*.yml"
        "config/**/*"
        ".env*"
        "package*.json"
    )

    for pattern in "${protected_patterns[@]}"; do
        if matches_pattern "$file" "$pattern"; then
            return 0
        fi
    done

    return 1
}

# Verificar si un archivo es auto-integrable
is_auto_integrable() {
    local file="$1"

    # Patterns auto-integrables (riesgo bajo)
    local auto_patterns=(
        "reports/**/*.md"
        "workflow/rpi/.claude/agents/*.md"
        "workflow/rpi/.claude/commands/**/*.md"
        "workflow/rpi/*.md"
        ".claude/skills/**/SKILL.md"
        "CLAUDE-upstream-reference.md"
    )

    for pattern in "${auto_patterns[@]}"; do
        if matches_pattern "$file" "$pattern"; then
            return 0
        fi
    done

    return 1
}

# Verificar si un archivo requiere PR
requires_pr() {
    local file="$1"

    # Patterns que van a PR (riesgo medio)
    local pr_patterns=(
        ".claude/agents/*.md"
        ".claude/commands/**/*.md"
        ".claude/hooks/**/*"
        ".claude/skills/**/*.js"
        ".claude/skills/**/*.py"
        ".claude/skills/**/*.sh"
        "scripts/*.sh"
        "weather-orchestration/**/*"
        "presentation/**/*"
    )

    for pattern in "${pr_patterns[@]}"; do
        if matches_pattern "$file" "$pattern"; then
            return 0
        fi
    done

    return 1
}

# ──────────────────────────────────────────
# Proceso Principal
# ──────────────────────────────────────────

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Smart Integration - Upstream Sync       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Verificar que estamos en un repo git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    log_error "No estás en un repositorio git"
    exit 1
fi

# Verificar upstream
if ! git remote get-url upstream > /dev/null 2>&1; then
    log_error "Remote 'upstream' no configurado"
    exit 1
fi

# Fetch upstream
log_info "Fetching upstream..."
git fetch upstream

# Verificar si hay cambios
COMMITS_BEHIND=$(git rev-list --count HEAD..upstream/main)
if [ "$COMMITS_BEHIND" -eq 0 ]; then
    log_success "Ya estás actualizado"
    exit 0
fi

log_info "Detectados $COMMITS_BEHIND commits nuevos"
echo ""

# Obtener lista de archivos modificados
FILES_CHANGED=$(git diff --name-only HEAD..upstream/main)

# Categorizar archivos
AUTO_INTEGRATE_FILES=()
PR_FILES=()
PROTECTED_FILES=()
IGNORED_FILES=()

log_info "Categorizando cambios..."
echo ""

while IFS= read -r file; do
    if should_ignore "$file"; then
        IGNORED_FILES+=("$file")
    elif is_protected "$file"; then
        PROTECTED_FILES+=("$file")
        log_warning "Protegido: $file"
    elif is_auto_integrable "$file"; then
        AUTO_INTEGRATE_FILES+=("$file")
        log_success "Auto-integrar: $file"
    elif requires_pr "$file"; then
        PR_FILES+=("$file")
        log_info "PR requerido: $file"
    else
        # Default: requiere PR por seguridad
        PR_FILES+=("$file")
        log_info "PR requerido (default): $file"
    fi
done <<< "$FILES_CHANGED"

echo ""
echo "═══════════════════════════════════════════"
echo "📊 RESUMEN DE CATEGORIZACIÓN"
echo "═══════════════════════════════════════════"
echo "🟢 Auto-integrar:  ${#AUTO_INTEGRATE_FILES[@]} archivos"
echo "🟡 Requiere PR:    ${#PR_FILES[@]} archivos"
echo "🔴 Protegidos:     ${#PROTECTED_FILES[@]} archivos"
echo "⚪ Ignorados:      ${#IGNORED_FILES[@]} archivos"
echo "═══════════════════════════════════════════"
echo ""

# ──────────────────────────────────────────
# Integración Automática
# ──────────────────────────────────────────

if [ ${#AUTO_INTEGRATE_FILES[@]} -gt 0 ]; then
    log_info "Integrando archivos seguros automáticamente..."

    for file in "${AUTO_INTEGRATE_FILES[@]}"; do
        git checkout upstream/main -- "$file" 2>/dev/null || log_warning "No se pudo integrar: $file"
    done

    if ! git diff --staged --quiet; then
        git add -A

        # Crear commit
        COMMIT_MSG="chore(upstream): auto-integrate safe changes

Automatically integrated ${#AUTO_INTEGRATE_FILES[@]} safe files from upstream:
- Documentation updates (reports/)
- Workflow examples (workflow/rpi/)
- Skill definitions (.claude/skills/)

Changes categorized as low-risk and auto-integrated.
Protected files (install.sh, configs, etc) were NOT touched.

🤖 Automated via smart-integrate.sh

Co-Authored-By: Claude <noreply@anthropic.com>"

        git commit -m "$COMMIT_MSG"
        log_success "Commit creado con cambios auto-integrados"
    else
        log_info "No hay cambios para auto-integrar"
    fi
else
    log_info "No hay archivos seguros para auto-integrar"
fi

# ──────────────────────────────────────────
# Generar info para PR
# ──────────────────────────────────────────

if [ ${#PR_FILES[@]} -gt 0 ]; then
    log_info "Generando branch para PR con cambios que requieren revisión..."

    # Nombre de branch
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    PR_BRANCH="upstream-sync-pr-${TIMESTAMP}"

    # Crear branch
    git checkout -b "$PR_BRANCH"

    # Integrar archivos
    for file in "${PR_FILES[@]}"; do
        git checkout upstream/main -- "$file" 2>/dev/null || log_warning "No se pudo integrar: $file"
    done

    if ! git diff --staged --quiet; then
        git add -A

        # Crear commit
        COMMIT_MSG="feat(upstream): integrate changes requiring review

Integrated ${#PR_FILES[@]} files that require manual review:
"

        # Agregar lista de archivos
        for file in "${PR_FILES[@]}"; do
            COMMIT_MSG+="
- $file"
        done

        COMMIT_MSG+="

These changes are categorized as medium-risk and require review.
Please check the changes before merging.

🤖 Automated via smart-integrate.sh

Co-Authored-By: Claude <noreply@anthropic.com>"

        git commit -m "$COMMIT_MSG"

        log_success "Branch '$PR_BRANCH' creado con cambios para revisión"

        # Volver a main
        git checkout main

        echo ""
        log_info "Para crear PR, ejecutar:"
        echo "  git push origin $PR_BRANCH"
        echo "  gh pr create --base main --head $PR_BRANCH --fill"
    fi
else
    log_info "No hay archivos que requieran PR"
fi

# ──────────────────────────────────────────
# Resumen de protegidos
# ──────────────────────────────────────────

if [ ${#PROTECTED_FILES[@]} -gt 0 ]; then
    echo ""
    log_warning "Archivos protegidos NO integrados (requieren revisión manual):"
    for file in "${PROTECTED_FILES[@]}"; do
        echo "  🔒 $file"
    done
    echo ""
    log_info "Para revisar estos archivos manualmente:"
    echo "  git diff HEAD..upstream/main -- <archivo>"
fi

echo ""
log_success "Smart integration completada"
