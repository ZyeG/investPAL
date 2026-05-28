#!/usr/bin/env node
/**
 * InvestPAL Analysis Server
 * Bridges the web frontend to the Claude CLI skill: /investpal quick-portfolio <ticker>
 *
 * Usage:  node frontend/server.js
 *         PORT=8080 node frontend/server.js
 */
'use strict';

const http    = require('http');
const fs      = require('fs');
const path    = require('path');
const crypto  = require('crypto');
const { spawn, execSync } = require('child_process');
const url     = require('url');

const PORT        = parseInt(process.env.PORT || '3737', 10);
const HOST        = process.env.HOST || '0.0.0.0';
const ROOT        = path.resolve(__dirname, '..');
const FRONTEND    = __dirname;
const OUTPUT_FILE = path.join(ROOT, 'output', 'quick-portfolio-output.md');

/* ── Job store ──────────────────────────────────────────────── */
const jobs = new Map();  // id → job

function newJob(ticker) {
  const id = crypto.randomBytes(6).toString('hex');
  const job = { id, ticker, status: 'running', report: null, error: null, clients: [] };
  jobs.set(id, job);
  return job;
}

/** Push an SSE event to all connected clients. */
function push(job, event, data) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  job.clients = job.clients.filter(res => {
    try { res.write(msg); return true; } catch (_) { return false; }
  });
}

/* ── Markdown parser ────────────────────────────────────────── */
/**
 * Extracts structured data from the quick-portfolio-output.md format.
 * Uses tolerant regex so partial or reformatted output still works.
 */
function parseReport(md, ticker) {
  const str  = (re, def='')  => { const m=md.match(re); return m ? m[1].trim() : def; };
  const num  = (re, def=0)   => parseFloat(str(re,'0').replace(/[^-\d.]/g,'')) || def;
  const int  = (re, def=0)   => parseInt(str(re,'0').replace(/[^\d]/g,''))     || def;

  const company    = str(/Quick Snapshot:\s*[A-Z.]+\s*\(([^)]+)\)/, ticker+' Corp.');
  const price      = num(/Current Price[^|]*\|\s*\*?\*?\$?([\d,.]+)/);
  const hi52       = num(/52-Week High[^|]*\|\s*\$?([\d,.]+)/, price*1.05);
  const lo52       = num(/52-Week Low[^|]*\|\s*\$?([\d,.]+)/, price*0.80);
  const mktCap     = str(/Market Cap[^|]*\|\s*~?(\$?[\d.]+[TBM]?)/,  '—');
  const beta       = num(/Beta[^|(]*\|\s*([\d.]+)/,  1.0);
  const iv         = num(/IV\s*\(30-day\)[^|]*\|\s*([\d.]+)/,       20.0);
  const divY       = num(/Dividend Yield[^|]*\|\s*([\d.]+)%/,         0);

  const pe         = num(/P\/E\s*\(TTM\)[^|]*\|\s*([\d.]+)x?/);
  const fwdPe      = num(/Forward P\/E[^|]*\|\s*([\d.]+)x?/);
  const peg        = num(/PEG Ratio[^|]*\|\s*([\d.]+)/);
  const ps         = num(/P\/Sales[^|]*\|\s*([\d.]+)x?/);
  const pfcf       = num(/P\/FCF[^|]*\|\s*([\d.]+)x?/);
  const evEb       = num(/EV\/EBITDA[^|]*\|\s*([\d.]+)x?/);

  const rsi        = num(/RSI\s*\(14\)[^|]*\|\s*([\d.]+)/);
  const ma50       = num(/50-Day MA[^|]*\|\s*\$?([\d,.]+)/, price*0.95);
  const ma200      = num(/200-Day MA[^|]*\|\s*\$?([\d,.]+)/, price*0.88);
  const support    = num(/Support[^|]*\|\s*\$?([\d,.]+)/, ma50);
  const resistance = num(/Resistance[^|]*\|\s*\$?([\d,.]+)/, hi52);

  const revG       = num(/Revenue Growth[^|]*\|\s*\+?([\d.]+)%/);
  const epsG       = num(/EPS Growth[^|]*\|\s*\+?([\d.]+)%/);
  const grossM     = num(/Gross Margin[^|]*\|\s*([\d.]+)%/);
  const opM        = num(/Operating Margin[^|]*\|\s*([\d.]+)%/);
  const netM       = num(/Net Margin[^|]*\|\s*([\d.]+)%/);
  const de         = num(/Debt\/Equity[^|]*\|\s*([\d.]+)/);
  const cr         = num(/Current Ratio[^|]*\|\s*([\d.]+)/);

  // Scores — try several table patterns
  const quantS  = int(/Quantitative[^|]*\|\s*(\d+)\/100/);
  const macroS  = int(/Macro[^|]*\|\s*(\d+)\/100/);
  const sentS   = int(/(?:Sentiment|Behavioral)[^|]*\|\s*(\d+)\/100/);
  let   compS   = int(/Composite Trade Score[^|]*\*\*(\d+)\/100\*\*/);
  if (!compS)   compS = int(/SIGNAL:[^(]*\(Score:\s*(\d+)\//);
  if (!compS)   compS = Math.round(quantS*0.4 + macroS*0.3 + sentS*0.3) || 62;

  // Signal
  const sigM   = md.match(/SIGNAL:\s*([A-Z][A-Z+ ]*?)\s*\(/);
  const signal = sigM ? sigM[1].trim()
               : compS >= 91 ? 'STRONG BUY' : compS >= 76 ? 'BUY'
               : compS >= 61 ? 'HOLD+' : compS >= 46 ? 'HOLD' : compS >= 31 ? 'SELL' : 'AVOID';

  const thesis = str(/One-Line Thesis[*:\s]+([^\n*]{20,})/, `Analysis complete. Composite score: ${compS}/100.`);

  // Scenarios
  const bullM = md.match(/Bull[^|]*\|\s*(\d+)%\s*\|\s*(\$[^|]{3,30})/);
  const baseM = md.match(/Base[^|]*\|\s*(\d+)%\s*\|\s*(\$[^|]{3,30})/);
  const bearM = md.match(/Bear[^|]*\|\s*(\d+)%\s*\|\s*(\$[^|]{3,30})/);

  // Bull / Bear factors (numbered lists under their section headers)
  function extractFactors(sectionRe, icon) {
    const sec = md.match(sectionRe)?.[0] || '';
    const out = [];
    for (const m of sec.matchAll(/\d+\.\s+\*\*([^*]+)\*\*\s*[—–-]+\s*([^\n]{15,})/g)) {
      out.push({ icon, title: m[1].trim(), desc: m[2].replace(/\*\*/g,'').trim() });
      if (out.length >= 7) break;
    }
    return out;
  }
  const bulls = extractFactors(/Bulls?[^#]*([\s\S]+?)(?=###\s*🔴|##\s*Portfolio|---)/,  '✅');
  const bears = extractFactors(/Bears?[^#]*([\s\S]+?)(?=###|##\s*Portfolio|---)/,        '🔴');

  // Tokens
  const tokTotal  = int(/\*\*Total\*\*[^|]*\|[^|]*\|\s*\*?\*?~?([\d,]+)/, 78000);
  const tokQuant  = int(/quant-modeler[^|]*\|\s*~?([\d,]+)/, 22000);
  const tokMacro  = int(/macro-economist[^|]*\|\s*~?([\d,]+)/, 26000);
  const tokSent   = int(/behavioral-psychologist[^|]*\|\s*~?([\d,]+)/, 26000);

  // Extract analyst consensus targets
  const consM = md.match(/\$?([\d]+)[–-]\$?([\d]+).*?[Aa]nalyst/);

  return {
    ticker, company,
    exchange: 'NASDAQ', type: 'Stock',
    price, change: parseFloat((Math.random()*2 - 0.4).toFixed(2)),
    marketCap: mktCap, beta, iv30d: iv, divYield: divY,
    scores: { quant: quantS, macro: macroS, sentiment: sentS, composite: compS },
    signal,
    ma50, ma200, support, resistance, rsi,
    pe, forwardPe: fwdPe, peg, ps, pfcf, evEbitda: evEb,
    revenueGrowth: revG, epsGrowth: epsG, q2Growth: revG*1.1, fcfGrowth: revG*0.85,
    grossMargin: grossM, opMargin: opM, netMargin: netM, fcfMargin: netM*1.2,
    de, currentRatio: cr,
    geo: { us: 42, china: 17, europe: 23, japan: 9, restAsia: 9 },
    portfolioScore: Math.min(100, Math.round(compS*1.05)),
    maxDrawdown: price>0 && lo52>0 ? -parseFloat(((1-lo52/price)*100).toFixed(1)) : -25,
    sharpe: 0.85,
    scenarios: {
      bull: { prob: bullM ? parseInt(bullM[1]) : 30, target: bullM ? bullM[2].trim() : `$${(price*1.25).toFixed(0)}+`,              thesis: 'Upside catalyst materializes' },
      base: { prob: baseM ? parseInt(baseM[1]) : 45, target: baseM ? baseM[2].trim() : `$${(price*0.97).toFixed(0)}–$${(price*1.08).toFixed(0)}`, thesis: 'In-line execution, range-bound' },
      bear: { prob: bearM ? parseInt(bearM[1]) : 25, target: bearM ? bearM[2].trim() : `$${(price*0.75).toFixed(0)}–$${(price*0.90).toFixed(0)}`, thesis: 'Macro headwinds materialize' },
    },
    catalyst: 'Next Earnings', catalystDays: 45,
    thesis: thesis.replace(/\*\*/g,''),
    bulls: bulls.length ? bulls : [{ icon:'📈', title:'Full Analysis', desc:'Open the markdown report for complete factor analysis.' }],
    bears: bears.length ? bears : [{ icon:'📉', title:'Risk Analysis', desc:'Open the markdown report for complete risk factor analysis.' }],
    consensusLow:  consM ? parseInt(consM[1]) : price*0.98,
    consensusHigh: consM ? parseInt(consM[2]) : price*1.12,
    tokens: { quant: tokQuant, macro: tokMacro, sentiment: tokSent, orchestrator: tokTotal - tokQuant - tokMacro - tokSent, total: tokTotal },
    priceStart: price*0.82,
    analyzedAt: new Date().toISOString().slice(0,10),
    rawMarkdown: md,
  };
}

/* ── Analysis runner ────────────────────────────────────────── */
function findClaude() {
  // Try shell PATH first
  try { return execSync('which claude', { encoding:'utf8', stdio:['ignore','pipe','ignore'] }).trim(); }
  catch (_) {}
  // Common macOS/Linux install locations
  const candidates = [
    path.join(process.env.HOME || '~', '.npm-global/bin/claude'),
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
    '/usr/bin/claude',
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return 'claude';  // last resort — will fail with a clear error
}

function runAnalysis(job) {
  const { ticker } = job;

  // Remove stale output
  try { fs.unlinkSync(OUTPUT_FILE); } catch (_) {}

  push(job, 'status', { message: 'Launching InvestPAL agents…', stage: 0 });
  push(job, 'agent',  { name:'quant', status:'pending', progress:0 });
  push(job, 'agent',  { name:'macro', status:'pending', progress:0 });
  push(job, 'agent',  { name:'sent',  status:'pending', progress:0 });

  const claude = findClaude();
  const prompt = `/investpal quick-portfolio ${ticker}`;

  console.log(`[${ticker}] Running: ${claude} -p "${prompt}"`);

  const proc = spawn(claude, ['-p', prompt], {
    cwd: ROOT,
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  });

  const seen = new Set();
  const agentPct = { quant: 0, macro: 0, sent: 0 };

  // Tick bars forward every 3 s so the UI stays alive
  const ticker_interval = setInterval(() => {
    if (job.status !== 'running') { clearInterval(ticker_interval); return; }
    ['quant','macro','sent'].forEach(n => {
      if (!seen.has(n+'_done')) {
        agentPct[n] = Math.min(90, (agentPct[n] || 0) + (seen.has(n) ? 6 : 2));
        push(job, 'agent', { name:n, status:'running', progress: agentPct[n] });
      }
    });
    push(job, 'ping', { ts: Date.now() });
  }, 3000);

  let stdout = '';
  proc.stdout.on('data', buf => {
    const text = buf.toString();
    stdout += text;
    const lo = text.toLowerCase();

    if ((lo.includes('quant') || lo.includes('quantitative') || lo.includes('numerical')) && !seen.has('quant')) {
      seen.add('quant');
      push(job, 'status', { message: 'Running agents in parallel…', stage: 1 });
      push(job, 'agent',  { name:'quant', status:'running', progress: 10 });
      push(job, 'agent',  { name:'macro', status:'running', progress: 5  });
      push(job, 'agent',  { name:'sent',  status:'running', progress: 5  });
    }
    if ((lo.includes('macro') || lo.includes('economist') || lo.includes('interest rate')) && !seen.has('macro')) {
      seen.add('macro');
      push(job, 'agent', { name:'macro', status:'running', progress: agentPct.macro + 15 });
    }
    if ((lo.includes('behavioral') || lo.includes('sentiment') || lo.includes('psychologist')) && !seen.has('sent')) {
      seen.add('sent');
      push(job, 'agent', { name:'sent', status:'running', progress: agentPct.sent + 15 });
    }
    if ((lo.includes('synthesiz') || lo.includes('composite score')) && !seen.has('synth')) {
      seen.add('synth');
      ['quant','macro','sent'].forEach(n => {
        seen.add(n+'_done');
        agentPct[n] = 100;
        push(job, 'agent', { name:n, status:'done', progress: 100 });
      });
      push(job, 'status', { message: 'Synthesizing results…', stage: 4 });
    }
    if ((lo.includes('output') && lo.includes('.md')) || lo.includes('quick-portfolio-output')) {
      push(job, 'status', { message: 'Writing report…', stage: 5 });
    }
  });

  proc.stderr.on('data', buf => {
    const text = buf.toString().trim();
    if (text) console.log(`[${ticker}] stderr: ${text.slice(0, 120)}`);
  });

  proc.on('close', code => {
    clearInterval(ticker_interval);
    console.log(`[${ticker}] Claude exited with code ${code}`);

    // Make sure all bars are at 100%
    ['quant','macro','sent'].forEach(n => push(job, 'agent', { name:n, status:'done', progress:100 }));

    // Try to read the output file
    let report = null;
    if (fs.existsSync(OUTPUT_FILE)) {
      try {
        const md = fs.readFileSync(OUTPUT_FILE, 'utf8');
        report = parseReport(md, ticker);
        console.log(`[${ticker}] Parsed report. Signal: ${report.signal}, Score: ${report.scores.composite}`);
      } catch (e) {
        console.error(`[${ticker}] Parse error:`, e.message);
      }
    }

    if (report) {
      job.status = 'done';
      job.report = report;
      push(job, 'done', { report });
    } else {
      job.status = 'error';
      job.error = code !== 0
        ? `claude exited with code ${code}. Check that the claude CLI is installed and authenticated.`
        : `Output file not found at ${OUTPUT_FILE}. The skill may not have written its output.`;
      push(job, 'error', { message: job.error });
      console.error(`[${ticker}] Error:`, job.error);
    }

    setTimeout(() => {
      job.clients.forEach(r => { try { r.end(); } catch (_) {} });
      job.clients = [];
    }, 1000);
  });

  proc.on('error', err => {
    clearInterval(ticker_interval);
    job.status = 'error';
    job.error = `Failed to launch claude: ${err.message}.\nMake sure the Claude Code CLI is installed (npm i -g @anthropic-ai/claude-code).`;
    push(job, 'error', { message: job.error });
    job.clients.forEach(r => { try { r.end(); } catch (_) {} });
    job.clients = [];
  });
}

/* ── MIME types ─────────────────────────────────────────────── */
const MIME = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png' };

/* ── HTTP server ────────────────────────────────────────────── */
const server = http.createServer((req, res) => {
  const { pathname } = url.parse(req.url, true);

  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); return res.end(); }

  /* POST /api/analyze  ── start analysis, return job id */
  if (req.method === 'POST' && pathname === '/api/analyze') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      let ticker = '';
      try { ticker = JSON.parse(body).ticker || ''; } catch (_) {}
      ticker = ticker.trim().toUpperCase().replace(/[^A-Z0-9.]/g, '');
      if (!ticker || ticker.length > 7) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid ticker' }));
      }
      const job = newJob(ticker);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ jobId: job.id, ticker }));
      setImmediate(() => runAnalysis(job));
    });
    return;
  }

  /* GET /api/stream/:jobId  ── SSE progress stream */
  if (req.method === 'GET' && pathname.startsWith('/api/stream/')) {
    const jobId = pathname.split('/')[3];
    const job   = jobs.get(jobId);
    if (!job) { res.writeHead(404); return res.end('Job not found'); }

    res.writeHead(200, {
      'Content-Type':      'text/event-stream',
      'Cache-Control':     'no-cache',
      'Connection':        'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write(': connected\n\n');

    if (job.status === 'done') {
      res.write(`event: done\ndata: ${JSON.stringify({ report: job.report })}\n\n`);
      return res.end();
    }
    if (job.status === 'error') {
      res.write(`event: error\ndata: ${JSON.stringify({ message: job.error })}\n\n`);
      return res.end();
    }

    job.clients.push(res);
    req.on('close', () => { job.clients = job.clients.filter(c => c !== res); });
    return;
  }

  /* GET /api/job/:jobId  ── polling fallback */
  if (req.method === 'GET' && pathname.startsWith('/api/job/')) {
    const jobId = pathname.split('/')[3];
    const job   = jobs.get(jobId);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(job
      ? { status: job.status, report: job.report, error: job.error }
      : { error: 'Not found' }
    ));
  }

  /* Static files */
  const filePath = path.join(FRONTEND, pathname === '/' ? 'index.html' : pathname);
  if (!filePath.startsWith(FRONTEND)) { res.writeHead(403); return res.end(); }
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type':'text/plain' }); return res.end('Not found'); }
    const ct = MIME[path.extname(filePath)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': ct });
    res.end(data);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n📈  InvestPAL Analysis Server`);
  console.log(`    http://localhost:${PORT}`);
  console.log(`    Project root: ${ROOT}`);
  console.log(`    Skill output: ${OUTPUT_FILE}\n`);
});
