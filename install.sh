#!/bin/bash
# ============================================================
# Claude Code - Setup Optimizado
# Basado en: shanraisshan/claude-code-best-practice
# Autor: Configuración personalizada para Mauro
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Claude Code - Setup Optimizado          ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# ──────────────────────────────────────────
# PASO 1: Configuración Global
# ──────────────────────────────────────────
echo -e "${GREEN}[1/3] Instalando configuración global...${NC}"

mkdir -p ~/.claude
cp "$SCRIPT_DIR/global-settings.json" ~/.claude/settings.json
echo -e "  ✓ ~/.claude/settings.json creado"
echo ""

# ──────────────────────────────────────────
# PASO 2: Setup de un proyecto
# ──────────────────────────────────────────
echo -e "${YELLOW}[2/3] ¿Querés configurar un proyecto existente? (s/n)${NC}"
read -r SETUP_PROJECT

if [[ "$SETUP_PROJECT" == "s" || "$SETUP_PROJECT" == "S" ]]; then
    echo -e "${YELLOW}Ingresá la ruta absoluta del proyecto:${NC}"
    read -r PROJECT_PATH

    if [[ ! -d "$PROJECT_PATH" ]]; then
        echo -e "  ✗ El directorio no existe: $PROJECT_PATH"
        exit 1
    fi

    echo -e "${GREEN}Configurando proyecto en: $PROJECT_PATH${NC}"

    # Crear estructura
    mkdir -p "$PROJECT_PATH/.claude/commands/rpi"
    mkdir -p "$PROJECT_PATH/.claude/rules"
    mkdir -p "$PROJECT_PATH/rpi/plans"

    # Copiar archivos
    cp "$SCRIPT_DIR/project-settings.json" "$PROJECT_PATH/.claude/settings.json"
    echo -e "  ✓ .claude/settings.json"

    cp "$SCRIPT_DIR/commands/rpi/research.md" "$PROJECT_PATH/.claude/commands/rpi/"
    cp "$SCRIPT_DIR/commands/rpi/plan.md" "$PROJECT_PATH/.claude/commands/rpi/"
    cp "$SCRIPT_DIR/commands/rpi/implement.md" "$PROJECT_PATH/.claude/commands/rpi/"
    echo -e "  ✓ .claude/commands/rpi/ (research, plan, implement)"

    cp "$SCRIPT_DIR/rules/vibe-coding.md" "$PROJECT_PATH/.claude/rules/"
    cp "$SCRIPT_DIR/rules/micro-tasks.md" "$PROJECT_PATH/.claude/rules/"
    cp "$SCRIPT_DIR/rules/commits.md" "$PROJECT_PATH/.claude/rules/"
    cp "$SCRIPT_DIR/rules/nextjs.md" "$PROJECT_PATH/.claude/rules/"
    cp "$SCRIPT_DIR/rules/context.md" "$PROJECT_PATH/.claude/rules/"
    echo -e "  ✓ .claude/rules/ (5 archivos de reglas)"

    # Solo copiar CLAUDE.md si no existe
    if [[ ! -f "$PROJECT_PATH/CLAUDE.md" ]]; then
        cp "$SCRIPT_DIR/project-CLAUDE.md" "$PROJECT_PATH/CLAUDE.md"
        echo -e "  ✓ CLAUDE.md (plantilla nueva)"
    else
        echo -e "  ⚠ CLAUDE.md ya existe, no se sobreescribió"
    fi

    # Actualizar .gitignore
    if [[ -f "$PROJECT_PATH/.gitignore" ]]; then
        if ! grep -q "settings.local.json" "$PROJECT_PATH/.gitignore"; then
            echo -e "\n# Claude Code local settings" >> "$PROJECT_PATH/.gitignore"
            echo ".claude/settings.local.json" >> "$PROJECT_PATH/.gitignore"
            echo -e "  ✓ .gitignore actualizado"
        fi
    fi

    echo ""
    echo -e "${GREEN}Proyecto configurado exitosamente.${NC}"
fi

# ──────────────────────────────────────────
# PASO 3: Resumen
# ──────────────────────────────────────────
echo ""
echo -e "${BLUE}[3/3] Resumen de instalación${NC}"
echo -e "────────────────────────────────────────"
echo -e "  Config global:    ~/.claude/settings.json"
echo -e ""
echo -e "${YELLOW}Próximos pasos:${NC}"
echo -e "  1. Editá el CLAUDE.md del proyecto con los datos reales"
echo -e "  2. En Claude Code, ejecutá /config para verificar"
echo -e "  3. Probá el flujo RPI: /rpi:research {tu-feature}"
echo -e ""
echo -e "${YELLOW}Comandos útiles de Claude Code:${NC}"
echo -e "  /config          → Ver/editar configuración"
echo -e "  /memory          → Ver archivos de memoria"
echo -e "  /compact          → Compactar contexto manual"
echo -e "  /rpi:research    → Investigar viabilidad"
echo -e "  /rpi:plan        → Crear plan de implementación"
echo -e "  /rpi:implement   → Ejecutar plan paso a paso"
echo -e ""
echo -e "${GREEN}✅ Setup completado.${NC}"
