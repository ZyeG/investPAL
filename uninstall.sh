#!/bin/bash
# ============================================================================
# AI Trading Analyst — Claude Code Skills Uninstaller
# ============================================================================
set -e

SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"

echo "Uninstalling AI Trading Analyst..."
rm -rf "$SKILLS_DIR/investpal"
rm -rf "$SKILLS_DIR/investpal-quick-portfolio"
rm -rf "$SKILLS_DIR/investpal-backtest"

rm -f "$AGENTS_DIR/quant-modeler.md"
rm -f "$AGENTS_DIR/macro-economist.md"
rm -f "$AGENTS_DIR/behavioral-psychologist.md"

echo "The AI Trading Analyst has been removed from Claude Code."
