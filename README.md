# investPAL

This project has been modified from its original setup to a streamlined version focusing on core capabilities, a Web UI dashboard, added token logging, and historical outcome tracking.

## Changes Made
1. **Custom Multi-Agent Framework**: Implemented a specialized multi-agent architecture representing distinct financial personas: 
   - `quant-modeler`
   - `macro-economist`
   - `behavioral-psychologist`
2. **Simplified Skills**: Removed the previous suite of separated trading skills (and the risk-actuary subagent) to optimize token costs.
3. **`investpal-quick-portfolio` Skill**: Orchestrates the 3 custom subagents to generate a composite snapshot and robust portfolio analysis (sector allocation, diversification, beta).
4. **`investpal-backtest` Skill**: Orchestrates the 3 subagents to look *only* at past data relative to a given date (limited to a **max 12-month lookup window** to save tokens) to form a thesis, then includes a verification phase comparing that historical recommendation against current actual market data.
5. **Token Usage Logging**: Agents and skills log/print estimated token usage for each sub-command and search operation directly into their generated markdown reports to avoid cluttering the terminal.
6. **Output Redirection & Naming**: Outputs are redirected into dynamically named markdown files inside `output/` (e.g., `output/quick-portfolio_AAPL_2026-05-27_10-45.md`). The tool guarantees it will not pollute the terminal with summary output, saving it purely as a concluding segment in the `.md` report.
7. **Local Web UI Dashboard**: A complete, native interface generated under `ui/` that dynamically auto-detects and loads reports from the `output/` folder and mathematically parses/plots Sector Allocation percentage logic to an interactive Chart.js Doughnut graphic.

## Skills

### `/investpal quick-portfolio <TICKER> [HOLDINGS]`
Combines a specialized 3-agent stock assessment and full portfolio strategy evaluation.
- Launches `quant-modeler`, `macro-economist`, and `behavioral-psychologist` in parallel.
- Evaluates any provided holding distributions.
- Writes detailed report directly to `output/quick-portfolio_<TICKER>_<TIMESTAMP>.md`.
- Concludes with an interactive Q&A step to discuss the findings and answer user questions.

### `/investpal backtest <TICKER> <PAST_DATE> [HOLDINGS]`
A replica of `quick-portfolio` restricted to a `<PAST_DATE>` for historical simulation. 
- Analyzes data strictly on or prior to the date using the 3 custom agents (restricted to **a max 12-month historical window** to save tokens).
- Emits strategy signals conceptually from the past.
- Analyzes actual outcome from `<PAST_DATE>` to today to verify accuracy.
- Writes detailed report directly to `output/backtest_<TICKER>_<TIMESTAMP>.md`.
- Concludes with an interactive Q&A step to discuss the findings and answer user questions.

## How to Run

1. **Install Skills and Agents**: Run the install script to copy the custom agents and skills to your user configuration directory (e.g., `~/.claude/`):
   ```bash
   ./install.sh
   ```
   *(Note: If you want to remove the installed tools later, simply run `./uninstall.sh`)*

2. **Launch the Agent**: Open the Claude Code CLI (or GitHub Copilot Chat).

3. **Execute Commands**: Request the agent to trigger the trading skills:
   - Command: `/investpal quick-portfolio AAPL`
   - Command: `/investpal backtest AAPL 2026-02-26` *(Token limit logic restricts queries strictly to a trailing 12 months)*

4. **Viewing the UI Dashboard**:
   We included a local Web Frontend to parse and visualize the Markdown outputs dynamically!
   1. Open a terminal in the root of this project (`investPAL/`).
   2. Start a local server: `python3 -m http.server 8000`
   3. Open `http://localhost:8000/ui/` in your browser.
   4. The unified navigation sidebar dynamically lists all dynamically named timestamped versions of `backtest` and `quick-portfolio` markdown files stored in the `output/` directory and auto-renders their table of contents and doughnut charts natively on click.

## Project Structure
```text
investPAL/
├── agents/
│   ├── quant-modeler.md
│   ├── macro-economist.md
│   └── behavioral-psychologist.md
├── mockdata/
│   └── sample.md
├── output/
│   └── latest-report.md                     # Agent generated markdown dumps
├── skills/
│   ├── investpal-quick-portfolio/SKILL.md   # Orchestrator (Snapshot + Portfolio)
│   └── investpal-backtest/SKILL.md          # Historical Strategy Backtest
├── ui/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── investpal/
│   └── SKILL.md                             # Master Orchestrator
├── install.sh
└── uninstall.sh
```
