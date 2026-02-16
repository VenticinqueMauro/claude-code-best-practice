#!/bin/bash
# ============================================================
# Sync Script - Actualizar desde upstream
# ============================================================
# Este script sincroniza los cambios del repositorio original
# (shanraisshan/claude-code-best-practice) con tu fork.
# ============================================================

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Sync desde upstream                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ──────────────────────────────────────────
# Verificar que estamos en un repo git
# ──────────────────────────────────────────
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}✗ Error: No estás en un repositorio git${NC}"
    exit 1
fi

# ──────────────────────────────────────────
# Verificar que upstream está configurado
# ──────────────────────────────────────────
if ! git remote get-url upstream > /dev/null 2>&1; then
    echo -e "${RED}✗ Error: El remote 'upstream' no está configurado${NC}"
    echo -e "${YELLOW}Ejecutá: git remote add upstream https://github.com/shanraisshan/claude-code-best-practice.git${NC}"
    exit 1
fi

# ──────────────────────────────────────────
# Paso 1: Fetch desde upstream
# ──────────────────────────────────────────
echo -e "${GREEN}[1/4] Haciendo fetch desde upstream...${NC}"
git fetch upstream
echo ""

# ──────────────────────────────────────────
# Paso 2: Mostrar cambios disponibles
# ──────────────────────────────────────────
echo -e "${BLUE}[2/4] Cambios disponibles desde upstream:${NC}"
echo -e "${YELLOW}────────────────────────────────────────${NC}"

CURRENT_BRANCH=$(git branch --show-current)
COMMITS_BEHIND=$(git rev-list --count HEAD..upstream/main 2>/dev/null || echo "0")

if [ "$COMMITS_BEHIND" -eq 0 ]; then
    echo -e "${GREEN}✓ Ya estás actualizado. No hay cambios nuevos.${NC}"
    exit 0
fi

echo -e "${YELLOW}Hay $COMMITS_BEHIND commits nuevos en upstream/main${NC}"
echo ""
echo -e "${BLUE}Últimos 5 commits de upstream:${NC}"
git log --oneline --graph --decorate -5 upstream/main
echo ""

# ──────────────────────────────────────────
# Paso 3: Preguntar estrategia de merge
# ──────────────────────────────────────────
echo -e "${YELLOW}[3/4] ¿Cómo querés sincronizar?${NC}"
echo "  1) Merge (mantiene historial completo)"
echo "  2) Rebase (historial lineal, más limpio)"
echo "  3) Solo mostrar diferencias (no aplicar cambios)"
echo "  4) Cancelar"
echo ""
read -p "Seleccioná una opción (1-4): " SYNC_OPTION

case $SYNC_OPTION in
    1)
        echo -e "${GREEN}[4/4] Haciendo merge desde upstream/main...${NC}"
        if git merge upstream/main --no-edit; then
            echo -e "${GREEN}✓ Merge exitoso${NC}"
            echo -e "${YELLOW}Ahora ejecutá: git push origin $CURRENT_BRANCH${NC}"
        else
            echo -e "${RED}✗ Conflictos detectados. Resolvelos manualmente y luego:${NC}"
            echo -e "  1. git add <archivos-resueltos>"
            echo -e "  2. git commit"
            echo -e "  3. git push origin $CURRENT_BRANCH"
        fi
        ;;

    2)
        echo -e "${GREEN}[4/4] Haciendo rebase sobre upstream/main...${NC}"
        if git rebase upstream/main; then
            echo -e "${GREEN}✓ Rebase exitoso${NC}"
            echo -e "${YELLOW}Ahora ejecutá: git push origin $CURRENT_BRANCH --force-with-lease${NC}"
        else
            echo -e "${RED}✗ Conflictos detectados. Resolvelos manualmente y luego:${NC}"
            echo -e "  1. git add <archivos-resueltos>"
            echo -e "  2. git rebase --continue"
            echo -e "  3. git push origin $CURRENT_BRANCH --force-with-lease"
        fi
        ;;

    3)
        echo -e "${BLUE}[4/4] Diferencias entre tu rama y upstream/main:${NC}"
        echo -e "${YELLOW}────────────────────────────────────────${NC}"
        git diff HEAD..upstream/main --stat
        echo ""
        echo -e "${YELLOW}Para ver diferencias detalladas:${NC}"
        echo -e "  git diff HEAD..upstream/main"
        ;;

    4)
        echo -e "${YELLOW}Sync cancelado${NC}"
        exit 0
        ;;

    *)
        echo -e "${RED}Opción inválida${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ Proceso completado${NC}"
