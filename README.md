# AI Trading Analyst (Modified)

This project has been modified from its original 16-skill setup to a streamlined version focusing on core capabilities with added token logging and historical outcome tracking.

## Changes Made
1. **Custom Multi-Agent Framework**: Removed the original repo's generic agents (technical, fundamental, etc.) and implemented a brand new, specialized multi-agent architecture representing distinct financial personas: 
   - `quant-modeler`
   - `macro-economist`
   - `behavioral-psychologist`
   - `risk-actuary`
2. **Simplified Skills**: Removed the previous suite of separated trading skills.
3. **Combined `quick-portfolio` Skill**: Created a new single skill `trade-quick-portfolio` that orchestrates the 4 custom subagents to generate a composite snapshot and robust portfolio analysis (sector allocation, diversification, beta).
4. **New `backtest` Skill**: Added a new skill `trade-backtest` to run historical data simulation. It orchestrates the 4 subagents forcing them to look only at past data relative to a given date to form a thesis, then includes a verification phase comparing that historical recommendation against current actual market data.
5. **Token Usage Logging**: Agents and skills log/print estimated token usage for each sub-command and search operation directly to the terminal.
6. **Output Redirection**: Outputs are redirected into markdown files (`output/quick-portfolio-output.md` and `output/backtest-output.md`).

## Skills

### `/trade quick-portfolio <TICKER> [HOLDINGS]`
Combines a specialized 4-agent stock assessment and full portfolio strategy evaluation.
- Launches `quant-modeler`, `macro-economist`, `behavioral-psychologist`, and `risk-actuary` in parallel.
- Evaluates any provided holding distributions.
- Prints execution token usage per command to terminal.
- Outputs detailed report to `output/quick-portfolio-output.md`.

### `/trade backtest <TICKER> <PAST_DATE> [HOLDINGS]`
A replica of `quick-portfolio` restricted to a `<PAST_DATE>` for historical simulation. 
- Analyzes data strictly on or prior to the date using the 4 custom agents.
- Emits strategy signals conceptually from the past.
- Analyzes actual outcome from `<PAST_DATE>` to today to verify accuracy.
- Prints execution token usage per command to terminal.
- Outputs detailed report to `output/backtest-output.md`.

## How to Run

1. **Install Skills and Agents**: Run the install script to copy the custom agents and skills to your user configuration directory (e.g., `~/.claude/`):
   ```bash
   ./install.sh
   ```
2. **Setup Output Directory**: Ensure the output folder exists at `/Users/ziyuegong/.claude/skills/trade/output` (or `~/.claude/skills/trade/output`) to hold the generated reports:
   ```bash
   mkdir -p ~/.claude/skills/trade/output
   ```
3. **Launch the Agent**: Start the Claude Code CLI (or your compatible AI agent extension like GitHub Copilot):
   ```bash
   claude
   ```
4. **Execute Commands**: Request the agent to trigger the trading skills:
   - Example: `@claude /trade quick-portfolio AAPL`
   - Example: `@claude /trade backtest AAPL 2023-01-01`

*(Note: If you want to remove the installed tools later, simply run `./uninstall.sh`)*

## Project Structure
```text
ai-trading-claude/
├── agents/
│   ├── quant-modeler.md
│   ├── macro-economist.md
│   ├── behavioral-psychologist.md
│   └── risk-actuary.md
├── skills/
│   ├── trade-quick-portfolio/SKILL.md   # Orchestrator (Snapshot + Portfolio)
│   └── trade-backtest/SKILL.md          # Historical Strategy Backtest
...
```

## token assumption
Backtest complete — the system would have called HOLD with strong contrarian-BUY undercurrent on AAPL as of
   2023-01-01 (composite 53.5: Behavioral 76 / Risk 58 / Quant 42 / Macro 38), and the actual outcome was a
  +135% cumulative return (~28% CAGR) with the $124 invalidation level never tested — verdict: SUCCESS,
  though the strict composite understated the opportunity. Total token usage ~30K

  
**Disclaimer:** For educational/research purposes only. Not financial advice.