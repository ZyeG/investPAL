#!/bin/bash
# ============================================================================
# AI Trading Analyst — Claude Code Skills Installer
# ============================================================================
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}║${NC}   ${CYAN}AI Trading Analyst — Claude Code Skills${NC}                   ${BLUE}║${NC}"
echo -e "${BLUE}║                                                              ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
echo ""

SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"

mkdir -p "$SKILLS_DIR"
mkdir -p "$AGENTS_DIR"

echo -e "${BLUE}Installing Main Orchestrator...${NC}"
if [ -d "$SOURCE_DIR/trade" ]; then
    cp -r "$SOURCE_DIR/trade" "$SKILLS_DIR/"
    echo -e "  ${GREEN}✓${NC} trade"
fi

echo -e "${BLUE}Installing Sub-Skills...${NC}"
if [ -d "$SOURCE_DIR/skills" ]; then
    cp -r "$SOURCE_DIR/skills/trade-quick-portfolio" "$SKILLS_DIR/"
    cp -r "$SOURCE_DIR/skills/trade-backtest" "$SKILLS_DIR/"
    echo -e "  ${GREEN}✓${NC} Sub-skills"
fi

echo -e "${BLUE}Installing Agents...${NC}"
if [ -d "$SOURCE_DIR/agents" ]; then
    cp "$SOURCE_DIR/agents/"*.md "$AGENTS_DIR/"
    echo -e "  ${GREEN}✓${NC} Agents (quant-modeler, macro-economist, behavioral-psychologist, risk-actuary)"
fi

echo -e "${GREEN}Done!${NC} Inside your project, run 'mkdir -p output' then type 'claude' to start."
