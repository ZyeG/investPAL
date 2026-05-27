# Backtest Report for AAPL (from 2026-02-26)

> **Generated:** 2026-05-26 · **Holding window analyzed:** 2026-02-26 → 2026-05-26 (3 months)
> **DISCLAIMER:** Educational/research only. Not financial advice. Always do your own due diligence.

---

## Token Usage Summary

| Step | Description | Estimated Tokens |
|---|---|---|
| 1a | `quant-modeler` subagent (historical quant snapshot, 6 web searches) | ~21,400 |
| 1b | `macro-economist` subagent (macro context, training knowledge only) | ~13,200 |
| 1c | `behavioral-psychologist` subagent (sentiment snapshot, 6 web searches) | ~23,100 |
| 2  | Synthesis (orchestrator, in-context) | ~2,000 |
| 3  | Verification web searches (2 queries) | ~2,000 |
| 4  | Markdown report generation (orchestrator) | ~3,500 |
| **Total** | | **~65,200 tokens** |

---

## Historical Quick Snapshot — as of 2026-02-26

### Composite Trade Score: **51 / 100** — *Signal: HOLD (Contrarian-Lean Buy on Pullback)*

| Dimension | Score | Read |
|---|---|---|
| **Quant** | 64 | Bullish fundamentals (record Q1'26 beat) offset by stretched valuation (P/E ~32x, PEG 2.4) |
| **Macro** | 52 | Fed easing helps, but China weakness + AI laggard narrative drag |
| **Sentiment** | 38 | Fearful crowd — Berkshire trimming, Siri delay, AI credibility crisis |
| **Composite (equal-weight)** | **51** | **Neutral → mildly constructive on contrarian read** |

### Price & Returns (heading into 2026-02-26)
- **Price on 2026-02-26:** ~$268 (estimated; interpolated from $265 on Feb 18 and subsequent run-up)
- **1M:** ~+1% · **3M:** ~+8% · **6M:** ~+12% · **12M:** ~+22%

### Valuation Snapshot
| Metric | Value | Read |
|---|---|---|
| Trailing P/E | ~32x | Rich vs 10Y median ~26x |
| Forward P/E | ~29x | Premium |
| P/S | ~8.5x | Elevated |
| EV/EBITDA | ~23x | Stretched |
| PEG | ~2.4 | Overvalued vs growth |

### Most Recent Earnings (reported 2026-01-29, FY Q1'26)
- **EPS:** $2.84 vs $2.67 est — **BEAT +6.3%**, +19% YoY
- **Revenue:** $143.8B vs $138.5B est — **BEAT**, +16% YoY (all-time record)
- iPhone $85.3B (+23%) · Services $30.0B (+14%) · Net income $42.1B
- Installed base >2.5B devices

### Technical Posture
- Above 50DMA; immature golden cross with 50DMA crossing 200DMA in early Feb
- RSI(14) ~58–62 (cooling after Feb 4 upper-Bollinger break)
- MACD positive but flattening
- ~70th percentile of 52-week range ($194–$280)
- 30D realized vol ~22–25%; Beta vs SPY ~1.10

### Macro Context (TAILWIND vs HEADWIND)
| Vector | Direction | Note |
|---|---|---|
| Fed funds (~3.50–3.75%, easing) | + | ~75bps of cuts in trailing 12M |
| 10Y yield ~4.1–4.3%, falling | + | Supportive for tech multiples |
| DXY ~102–104, weaker | + | Tailwind for ~60% intl revenue |
| China demand / iPhone share | − | Huawei/Xiaomi gains; shipments –7.7% YoY |
| Tariff overhang | − | ~$8.5B MS-estimated exposure |
| Tech rotation | − | Money rotating OUT of mega-cap into broadening rally |
| AI capex vs hyperscalers | − | Apple seen as AI laggard; Apple Intelligence underwhelming |

### Behavioral / Sentiment Read
- **Analyst consensus:** Moderate Buy, ~$292–$308 avg PT (bull: Wedbush $350; bear: Jefferies ~$210)
- **Retail:** Bearish→apathetic; sentiment score collapsed from ~74 (late Jan) to ~32 (mid-Feb) on Siri delay
- **Options:** P/C ratio ~1.05–1.15; IV rank ~55–65; downside put accumulation $215–$230 strikes
- **Institutional:** Berkshire trimmed another ~4% in Q4'25 13F → ~238M shares (~$62B), rotating into GOOGL
- **Insiders:** Net selling (routine RSU vest sales; no buys)
- **Short interest:** Low (~0.7–0.9% of float)
- **Narrative:** "AI credibility crisis" — Siri 2.0 delayed to May 2026, dominant story is doubt
- **Contrarian read:** Wall of worry; closer to **buy-the-fear setup** than fade-the-greed, *if* AI narrative inflects at WWDC June 2026

### Historical Thesis (as it would have read on 2026-02-26)
> AAPL screens as a **HOLD with a contrarian lean-Buy** at ~$268. Record Q1'26 fundamentals validate the growth story, but the stock is digesting a 22% trailing-12M rally and faces a wall of worry: Berkshire distribution, Siri delays, China share loss, AI-laggard perception. Valuation (P/E ~32x) prevents chasing strength. The setup favors **patient accumulation on a pullback to the 50DMA**, with WWDC (June 2026) as the next narrative catalyst that could re-rate sentiment.
>
> **Signal: HOLD · Bias: Buy weakness · Avoid: Chasing strength**

---

## Historical Portfolio Analysis

*No holdings supplied — ticker-only backtest. No portfolio metrics to compute.*

---

## Strategy Verification (Historical vs Current)

### Actual Price Action: 2026-02-26 → 2026-05-26

| Metric | Value |
|---|---|
| Price on 2026-02-26 (est.) | ~$268 |
| Price on 2026-05-26 (close 5/22) | **$308.82** |
| **Absolute return** | **+$40.82** |
| **% return** | **+15.2%** |
| 30D return into 5/26 | +12.69% |
| 12M return into 5/26 | +41.99% |
| Day range on 5/22 | $305.84 – $311.40 |
| 52-week range | $195.07 – $311.40 (at highs) |

### Path Notable Events
- **Pivot bottom signaled 2026-03-30**, after which AAPL has risen +22.55% — directly vindicating the "buy on pullback" sub-thesis
- Stock has appreciated in 6 of the last 10 sessions
- Currently at upper end of 52W range ($311.40 high) — momentum strong

### Signal Verification
- **Predicted Signal:** HOLD (lean BUY on pullback)
- **Actual Outcome:** AAPL rallied **+15.2%** in 3 months, with a clean pullback in March that confirmed the entry timing thesis, followed by a +22.55% surge off the March 30 pivot bottom
- **What the historical view got right:**
  - ✅ Identified the contrarian opportunity beneath fearful sentiment (sentiment score 38 → fear was over-extended)
  - ✅ The "buy the pullback" sub-thesis was *precisely* correct — March 30 delivered the pullback and the subsequent +22.55% rally
  - ✅ Recognized that fundamentals (Q1 beat) were stronger than the narrative suggested
- **What the historical view got wrong / underweighted:**
  - ❌ The cautious HOLD slightly understated the magnitude of the rally — a pure BUY call would have captured the full +15.2%
  - ❌ Macro view tagged tech-rotation as a headwind, but AAPL led the broader market over this window
  - ❌ Valuation discipline (PEG 2.4, P/E 32x) was overweighted; the market re-rated even higher

### **Verdict: PARTIAL SUCCESS** ✓

The historical strategy correctly identified the contrarian setup (fearful sentiment + intact fundamentals) and the timing thesis (buy the pullback), both of which played out almost exactly as scripted. The conservative HOLD/lean-Buy signal would have captured most but not all of the +15.2% upside — a more confident BUY call would have scored cleaner. The framework's signal *direction* was right; only the *magnitude/conviction* was understated.

**Strategy grade: B+ · Direction right, conviction half-throttle.**

---

## Lessons & Calibration Notes

1. **Sentiment-fear extremes are alpha:** When the sentiment score collapses (38 here) while quant fundamentals stay strong (64), the contrarian setup is robust. Weight sentiment-divergence higher next time.
2. **Valuation drag is over-weighted near narrative inflection points:** P/E 32x looked rich; the market re-rated to ~37x. When a narrative catalyst (WWDC) is months away, valuation alone shouldn't anchor signal.
3. **Macro "tech rotation" reads can be ticker-specific noise:** AAPL led despite the sector-rotation thesis. Always test the rotation read at the single-ticker level, not just sector.
4. **"Buy the pullback" was the alpha-generating call** — execution timing > broad signal in this case.

---

*Report generated by `/investpal backtest AAPL` orchestrator · Sources: Yahoo Finance, MarketBeat, MacroTrends, StockTitan, SEC EDGAR, Capital.com, AltIndex, AlphaQuery, CNBC, 24/7 Wall St., FX Leaders.*
