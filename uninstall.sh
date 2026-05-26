#!/bin/bash
# ============================================================================
# AI Trading Analyst — Claude Code Skills Uninstaller
# ============================================================================
set -e

SKILLS_DIR="$HOME/.claude/skills"
AGENTS_DIR="$HOME/.claude/agents"

echo "Uninstalling AI Trading Analyst..."
rm -rf "$SKILLS_DIR/trade"
rm -rf "$SKILLS_DIR/trade-quick-portfolio"
rm -rf "$SKILLS_DIR/trade-backtest"

rm -f "$AGENTS_DIR/quant-modeler.md"
rm -f "$AGENTS_DIR/macro-economist.md"
rm -f "$AGENTS_DIR/behavioral-psychologist.md"
rm -f "$AGENTS_DIR/risk-actuary.md"

echo "The AI Trading Analyst has been removed from Claude Code."
