# AI Trading Analyst (Modified)

This project has been modified from its original 16-skill setup to a streamlined version focusing on core capabilities with added token logging and historical outcome tracking.

## Changes Made
1. **Custom Multi-Agent Framework**: Removed the original repo's generic agents (technical, fundamental, etc.) and implemented a brand new, specialized multi-agent architecture representing distinct financial personas: 
   - `quant-modeler`
   - `macro-economist`
   - `behavioral-psychologist`
2. **Simplified Skills**: Removed the previous suite of separated trading skills.
3. **Combined `quick-portfolio` Skill**: Created a new single skill `investpal-quick-portfolio` that orchestrates the 3 custom subagents to generate a composite snapshot and robust portfolio analysis (sector allocation, diversification, beta).
4. **New `backtest` Skill**: Added a new skill `investpal-backtest` to run historical data simulation. It orchestrates the 3 subagents forcing them to look only at past data relative to a given date (limited to a **max 12-month lookup window**) to form a thesis, then includes a verification phase comparing that historical recommendation against current actual market data.
5. **Token Usage Logging**: Agents and skills log/print estimated token usage for each sub-command and search operation directly to the terminal.
6. **Output Redirection**: Outputs are redirected into markdown files (`output/quick-portfolio-output.md` and `output/backtest-output.md`).

## Skills

### `/investpal quick-portfolio <TICKER> [HOLDINGS]`
Combines a specialized 3-agent stock assessment and full portfolio strategy evaluation.
- Launches `quant-modeler`, `macro-economist`, and `behavioral-psychologist` in parallel.
- Evaluates any provided holding distributions.
- Prints execution token usage per command to terminal.
- Outputs detailed report to `output/quick-portfolio-output.md`.
- Concludes with an interactive Q&A step to discuss the findings and answer user questions.

### `/investpal backtest <TICKER> <PAST_DATE> [HOLDINGS]`
A replica of `quick-portfolio` restricted to a `<PAST_DATE>` for historical simulation. 
- Analyzes data strictly on or prior to the date using the 3 custom agents (restricted to **a max 12-month historical window** to save tokens).
- Emits strategy signals conceptually from the past.
- Analyzes actual outcome from `<PAST_DATE>` to today to verify accuracy.
- Prints execution token usage per command to terminal.
- Outputs detailed report to `output/backtest-output.md`.
- Concludes with an interactive Q&A step to discuss the findings and answer user questions.

## How to Run

1. **Install Skills and Agents**: Run the install script to copy the custom agents and skills to your user configuration directory (e.g., `~/.claude/`):
   ```bash
   ./install.sh
   ```
2. **Setup Output Directory**: Ensure the output folder exists at `/Users/ziyuegong/.claude/skills/investpal/output` (or `~/.claude/skills/investpal/output`) to hold the generated reports:
   ```bash
   mkdir -p ~/.claude/skills/investpal/output
   ```
3. **Launch the Agent**: Start the Claude Code CLI (or your compatible AI agent extension like GitHub Copilot):
   ```bash
   claude
   ```
4. **Execute Commands**: Request the agent to trigger the trading skills:
   - Example: `@claude /investpal quick-portfolio AAPL`
   - Example: `@claude /investpal backtest AAPL 2023-01-01`

*(Note: If you want to remove the installed tools later, simply run `./uninstall.sh`)*

## Project Structure
```text
investPAL/
├── agents/
│   ├── quant-modeler.md
│   ├── macro-economist.md
│   └── behavioral-psychologist.md
├── skills/
│   ├── investpal-quick-portfolio/SKILL.md   # Orchestrator (Snapshot + Portfolio)
│   └── investpal-backtest/SKILL.md          # Historical Strategy Backtest
...
```

## token assumption
Backtest complete — the system would have called HOLD with strong contrarian-BUY undercurrent on AAPL as of
   2023-01-01 (composite 52.0: Behavioral 76 / Quant 42 / Macro 38), and the actual outcome was a
  +135% cumulative return (~28% CAGR) with the $124 invalidation level never tested — verdict: SUCCESS,
  though the strict composite understated the opportunity. Total token usage ~20K


**Disclaimer:** For educational/research purposes only. Not financial advice.