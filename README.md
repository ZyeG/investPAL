# AI Trading Analyst (Modified)

This project has been modified from its original 16-skill setup to a streamlined version focusing on core capabilities with added token logging and historical outcome tracking.

## Changes Made
1. **Custom Multi-Agent Framework**: Removed the original repo's generic agents (technical, fundamental, etc.) and implemented a brand new, specialized multi-agent architecture representing distinct financial personas: 
   - `quant-modeler`
   - `macro-economist`
   - `behavioral-psychologist`
2. **Simplified Skills**: Removed the previous suite of separated trading skills.
3. **Combined `quick-portfolio` Skill**: Created a new single skill `investpal-quick-portfolio` that orchestrates the 3 custom subagents to generate a composite snapshot and robust portfolio analysis (sector allocation, diversification, beta).
4. **New `backtest` Skill**: Added a new skill read SKILLS.md in  investpal-quick-portfolio and frontend/sserver.js; make sure in the SKILLS.md such that when the server tries to parse the markdown file, all the data required is present (all the variables in parseReport in server.js), for example, the company name, price, 52-week high, etc.`investpal-backtest` to run historical data simulation. It orchestrates the 3 subagents forcing them to look only at past data relative to a given date (limited to a **max 12-month lookup window**) to form a thesis, then includes a verification phase comparing that historical recommendation against current actual market data.
5. **Token Usage Logging**: Agents and skills log/print estimated token usage for each sub-command and search operation directly to the terminal.
6. **Output Redirection**: Outputs are redirected into markdown files (`output/quick-portfolio-output.md` and `output/backtest-output.md`). No longer support pdf generation. 

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
2. **Setup Output Directory**: Ensure the output folder exists at `~/.claude/skills/investpal/output` to hold the generated reports:
   ```bash
   mkdir -p ~/.claude/skills/investpal/output
   ```
3. **Launch the Agent**: Start the Claude Code CLI (or your compatible AI agent extension like GitHub Copilot):
   ```bash
   claude
   ```
4. **Execute Commands**: Request the agent to trigger the trading skills:
   - Example: `/investpal quick-portfolio AAPL`
   - Example: `/investpal backtest AAPL 2026-02-26` (only support max 1 year backtest, due to token cost)

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
├── investpal/
│   └── SKILL.md                             # Master Orchestrator
├── install.sh
└── uninstall.sh
```

## sample output (with token assumption)
**/investpal backtest AAPL 2026-02-26**
```
Backtest Complete — AAPL from 2026-02-26

  Bottom line: The historical signal was HOLD with a contrarian lean-Buy on pullback (Composite Score
  51/100). AAPL went from ~$268 to $308.82 = +15.2% in 3 months, with the March 30 pullback delivering the
  exact "buy the dip" setup the strategy called for. Verdict: PARTIAL SUCCESS / B+ — direction right,
  conviction slightly understated.
  
  Total token usage: ~65,200 tokens (3 subagents + synthesis + verification).
  
  Report: /Users/ziyuegong/output/backtest-output.md
```
**/investpal quick-portfolio AAPL**
```
 Quick-Portfolio Complete — AAPL @ $308.82

  Bottom line: Composite Trade Score 64/100, signal HOLD (lean Trim) — wait for pullback. AAPL is at 98th
  percentile of its 52W range with RSI ~72 and PEG 3.0, heading into a binary WWDC June 8 catalyst. Sentiment
   has rotated FEAR 38 → GREED 68 since Feb — the easy money from the contrarian-fear trade is gone; new
  entries should wait for a pullback to ~$283 (50DMA) or a post-WWDC reaction.

  Total token usage: ~79,100 tokens (3 subagents + synthesis).

  Report: /Users/ziyuegong/output/quick-portfolio-output.md
  
  Want to go deeper on any of these?
  - WWDC June 8 options strategy (straddle/strangle sizing for the binary event)
  - Re-run with actual holdings to get a real portfolio health score (sector allocation, beta, concentration)
  - Compare AAPL head-to-head against another mega-cap (e.g., GOOGL, MSFT, NVDA) to see relative setup
  - Bear scenario: what does AAPL look like if WWDC disappoints and 10Y breaks above 4.7%
```

### sample terminal session
ziyuegong@ziyues-MacBook-Air-2 ~ % claude
╭─── Claude Code v2.1.150 ──────────────────────────────────────────────────────────────────────────────────╮
│                                                    │ Tips for getting started                             │
│                 Welcome back ziyue!                │ Run /init to create a CLAUDE.md file with instructi… │
│                                                    │ Note: You have launched claude in your home directo… │
│                      ▗ ▗   ▖ ▖                     │ ──────────────────────────────────────────────────── │
│                                                    │ What's new                                           │
│                        ▘▘ ▝▝                       │ Internal infrastructure improvements (no user-facin… │
│    Opus 4.7 (1M context) · API Usage Billing ·     │ `/usage` now shows a per-category breakdown of what… │
│    ziyue’s Individual Org                          │ `/diff` detail view can now be scrolled with the ke… │
│                  /Users/ziyuegong                  │ /release-notes for more                              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────╯
 
❯ /investpal quick-portfolio AAPL                                                                            

  Searched for 1 pattern, read 1 file, listed 1 directory (ctrl+o to expand)

⏺ Bash(ls /Users/ziyuegong/.claude/skills/investpal/output/ 2>/dev/null || ls /Users/ziyuegong/output/
      2>/dev/null || pwd)
  ⎿  /Users/ziyuegong

⏺ Launching 4 specialized subagents in parallel to analyze AAPL.

⏺ 4 agents finished (ctrl+o to expand)
   ├ quant-modeler (AAPL quant analysis) · 5 tool uses · 15.6k tokens
   │ ⎿  Done
   ├ macro-economist (AAPL macro context) · 5 tool uses · 12.6k tokens
   │ ⎿  Done
   ├ behavioral-psychologist (AAPL sentiment analysis) · 7 tool uses · 19.3k tokens
   │ ⎿  Done
   └ risk-actuary (AAPL risk assessment) · 0 tool uses
     ⎿  Done
     
⏺ All 4 subagents reported. Composing the synthesis and writing to the output file.

⏺ Bash(mkdir -p /Users/ziyuegong/output)
  ⎿  Done
  ⎿  Credit balance too low · Add funds: https://platform.claude.com/settings/billing

✻ Worked for 1m 33s

─────────────────────────────────────────────────────────────────────────────────────────────────────────────
❯  
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
  Press Ctrl-D again to exit

Resume this session with:
claude --resume df6695ca-03a2-43c9-a7cd-f47f5ae9db68
ziyuegong@ziyues-MacBook-Air-2 ~ % claude
╭─── Claude Code v2.1.150 ──────────────────────────────────────────────────────────────────────────────────╮
│                                                    │ Tips for getting started                             │
│                 Welcome back ziyue!                │ Run /init to create a CLAUDE.md file with instructi… │
│                                                    │ Note: You have launched claude in your home directo… │
│                      ▗ ▗   ▖ ▖                     │ ──────────────────────────────────────────────────── │
│                                                    │ What's new                                           │
│                        ▘▘ ▝▝                       │ Internal infrastructure improvements (no user-facin… │
│                                                    │ Tips for getting started                             │
│                 Welcome back ziyue!                │ Run /init to create a CLAUDE.md file with instructi… │
│                                                    │ Note: You have launched claude in your home directo… │
│                      ▗ ▗   ▖ ▖                     │ ──────────────────────────────────────────────────── │
│                                                    │ What's new                                           │
│                        ▘▘ ▝▝                       │ Internal infrastructure improvements (no user-facin… │
│    Opus 4.7 (1M context) · API Usage Billing ·     │ `/usage` now shows a per-category breakdown of what… │
│    ziyue’s Individual Org                          │ `/diff` detail view can now be scrolled with the ke… │
│                  /Users/ziyuegong                  │ /release-notes for more                              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────────────╯

❯ /investpal backtest APPL                                                                                   

  Read 1 file, listed 2 directories (ctrl+o to expand)

⏺ I noticed two things before I run the backtest: the ticker "APPL" is likely a typo (Apple's ticker is
  AAPL), and the backtest skill requires a PAST_DATE to anchor the historical analysis (it wasn't included).

⏺ User answered Claude's questions:
  ⎿  · Did you mean AAPL (Apple Inc.)? → Yes, AAPL (Apple)
     · Which historical date should I anchor the backtest to? → 3 months ago (2026-02-26)
     · Any holdings to factor in (e.g., shares + cost basis)? → No holdings — ticker-only backtest

⏺ Confirmed: AAPL, PAST_DATE = 2026-02-26, no holdings. Launching the 3 subagents in parallel to gather
  historical data constrained to on/before 2026-02-26 (max 12-month lookback).

  Step 1 token estimate: ~3 subagents × ~3-5K tokens each ≈ 9-15K tokens

⏺ Bash(mkdir -p /Users/ziyuegong/output && ls /Users/ziyuegong/output/)
  ⎿  (No output)

⏺ 3 agents finished (ctrl+o to expand)
   ├ quant-modeler (Quant historical snapshot AAPL) · 7 tool uses · 17.6k tokens
   │ ⎿  Done
   ├ macro-economist (Macro context AAPL Feb 2026) · 0 tool uses
   │ ⎿  Done
   └ behavioral-psychologist (Sentiment historical AAPL) · 7 tool uses · 18.5k tokens
     ⎿  Done
     
⏺ Step 3 needs current AAPL price data (2026-05-26) to verify. Let me load WebSearch.

⏺ Web Search("AAPL Apple stock price May 26 2026 current")
  ⎿  Did 1 search in 4s

⏺ Web Search("AAPL Apple stock performance February to May 2026 returns")
  ⎿  Did 1 search in 6s

⏺ Got it. AAPL was ~$268 on 2026-02-26 and is $308.82 today (2026-05-26) — a +15.2% return over 3 months. Now
   synthesizing and writing the report.
     
⏺ Write(output/backtest-output.md)
  ⎿  Wrote 142 lines to output/backtest-output.md
       2 # Backtest Report for AAPL (from 2026-02-26)
       3 > **Generated:** 2026-05-26 · **Holding window analyzed:** 2026-02-26 → 2026-05-26 (3 months)
       4 > **DISCLAIMER:** Educational/research only. Not financial advice. Always do your own due dil
         igence.
       5 
       6 ---
       7 
       8 ## Token Usage Summary
       9 
      10 | Step | Description | Estimated Tokens |
     … +161 lines (ctrl+o to expand)

⏺ Backtest Complete — AAPL from 2026-02-26

  Bottom line: The historical signal was HOLD with a contrarian lean-Buy on pullback (Composite Score
  51/100). AAPL went from ~$268 to $308.82 = +15.2% in 3 months, with the March 30 pullback delivering the
  exact "buy the dip" setup the strategy called for. Verdict: PARTIAL SUCCESS / B+ — direction right,
  conviction slightly understated.
  
  Total token usage: ~65,200 tokens (3 subagents + synthesis + verification).
  
  Report: /Users/ziyuegong/output/backtest-output.md
  
  Want to dig into any of these next?
  - Why the sentiment score collapsed to 38 in mid-Feb (the AI-credibility-crisis narrative)
  - The Berkshire rotation dynamics (AAPL → GOOGL) and whether that signal still applies
  - A current /investpal snapshot of AAPL today at $308 to see if the contrarian setup has flipped to
  fade-the-greed
  - Re-running the backtest at a different anchor date (e.g., 6M ago to capture the full rally)

  Sources:
  - Yahoo Finance — AAPL (https://finance.yahoo.com/quote/AAPL/)
  - MarketBeat — AAPL Chart 2026 (https://www.marketbeat.com/stocks/NASDAQ/AAPL/chart/)
  - MacroTrends — AAPL 15Y Price History
  (https://www.macrotrends.net/stocks/charts/AAPL/apple/stock-price-history)
  - StockInvest — AAPL Forecast (https://stockinvest.us/stock/AAPL)

✻ Churned for 3m 48s

❯ /investpal quick-portfolio AAPL                                                                            

  Read 1 file (ctrl+o to expand)

⏺ Launching 3 subagents in parallel for current AAPL snapshot (as of 2026-05-26). Step 1 estimate: ~12-18K 
  tokens.
     
⏺ 3 agents finished (ctrl+o to expand)
   ├ quant-modeler (Current AAPL quant snapshot) · 8 tool uses · 17.8k tokens
   │ ⎿  Done
   ├ macro-economist (Current macro for AAPL) · 8 tool uses · 17.8k tokens
   │ ⎿  Done
   └ behavioral-psychologist (Current sentiment for AAPL) · 8 tool uses · 19.1k tokens
     ⎿  Done
     
⏺ Write(output/quick-portfolio-output.md)
  ⎿  Wrote 122 lines to output/quick-portfolio-output.md
       2 # Quick-Portfolio Report — AAPL
       3 > **Generated:** 2026-05-26 · **Ticker:** AAPL (Apple Inc.) · **Holdings:** none supplied (ti
         cker-only snapshot)
       4 > **DISCLAIMER:** Educational/research only. Not financial advice. Always do your own due dil
         igence.
       6 ---
       7 
       8 ## Token Usage Summary
       9 
      10 | Step | Description | Estimated Tokens |
     … +153 lines (ctrl+o to expand)

⏺ Quick-Portfolio Complete — AAPL @ $308.82

  Bottom line: Composite Trade Score 64/100, signal HOLD (lean Trim) — wait for pullback. AAPL is at 98th
  percentile of its 52W range with RSI ~72 and PEG 3.0, heading into a binary WWDC June 8 catalyst. Sentiment
   has rotated FEAR 38 → GREED 68 since Feb — the easy money from the contrarian-fear trade is gone; new
  entries should wait for a pullback to ~$283 (50DMA) or a post-WWDC reaction.

  Total token usage: ~79,100 tokens (3 subagents + synthesis).

  Report: /Users/ziyuegong/output/quick-portfolio-output.md
  
  Want to go deeper on any of these?
  - WWDC June 8 options strategy (straddle/strangle sizing for the binary event)
  - Re-run with actual holdings to get a real portfolio health score (sector allocation, beta, concentration)
  - Compare AAPL head-to-head against another mega-cap (e.g., GOOGL, MSFT, NVDA) to see relative setup
  - Bear scenario: what does AAPL look like if WWDC disappoints and 10Y breaks above 4.7%

✻ Cogitated for 2m 56s 

※ recap: We ran an AAPL backtest from 2026-02-26 (verdict: partial success, +15.2% in 3 months) and a current
   snapshot showing Score 64/100, HOLD-lean-Trim ahead of WWDC June 8. Next: pick a follow-up (options 
  strategy, real holdings, peer compare, or bear scenario). (disable recaps in /config)
  
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
❯  
─────────────────────────────────────────────────────────────────────────────────────────────────────────────
  Press Ctrl-D again to exit

Resume this session with:
claude --resume 79292bd8-4ce7-4ce1-81e3-0b045e3b6d3c

### cost
cost for the above 2 commands is ~ 3 usd

**Disclaimer:** For educational/research purposes only. Not financial advice.