const marketOverviewSymbols = ['AAPL', 'MSFT', 'NVDA', 'SPY'];

const sectorCandidates = {
  Tech: [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' }
  ],
  'Insurance / Healthcare': [
    { symbol: 'UNH', name: 'UnitedHealth Group' },
    { symbol: 'ELV', name: 'Elevance Health' },
    { symbol: 'CI', name: 'Cigna Group' }
  ],
  'Real Estate': [
    { symbol: 'PLD', name: 'Prologis' },
    { symbol: 'O', name: 'Realty Income' },
    { symbol: 'AMT', name: 'American Tower' }
  ],
  Financials: [
    { symbol: 'JPM', name: 'JPMorgan Chase' },
    { symbol: 'BAC', name: 'Bank of America' },
    { symbol: 'GS', name: 'Goldman Sachs' }
  ],
  'Consumer Discretionary': [
    { symbol: 'AMZN', name: 'Amazon.com' },
    { symbol: 'TSLA', name: 'Tesla' },
    { symbol: 'HD', name: 'Home Depot' }
  ],
  Energy: [
    { symbol: 'XOM', name: 'Exxon Mobil' },
    { symbol: 'CVX', name: 'Chevron' },
    { symbol: 'COP', name: 'ConocoPhillips' }
  ]
};

const sectorStats = {
  Tech: { avgPE: 31.4, avgMktCap: '$1.8T', note: 'High valuation sensitivity to rates, but strong margins and cash flow quality.' },
  'Insurance / Healthcare': { avgPE: 18.7, avgMktCap: '$240B', note: 'Usually steadier demand profile; reimbursement and policy updates matter.' },
  'Real Estate': { avgPE: 23.1, avgMktCap: '$78B', note: 'Rate-sensitive sector where refinancing costs and occupancy trends drive outlook.' },
  Financials: { avgPE: 14.2, avgMktCap: '$360B', note: 'Credit quality, net interest margins, and regulation are core performance levers.' },
  'Consumer Discretionary': { avgPE: 27.6, avgMktCap: '$420B', note: 'Demand responds quickly to income trends, confidence, and financing conditions.' },
  Energy: { avgPE: 12.5, avgMktCap: '$270B', note: 'Cash flows often track commodity cycles; capital discipline influences returns.' }
};

const fallbackPrices = {
  AAPL: { price: 198.43, changePct: 0.94 },
  MSFT: { price: 421.17, changePct: -0.35 },
  NVDA: { price: 1024.88, changePct: 1.62 },
  SPY: { price: 518.07, changePct: 0.28 }
};

const dailyStoryPool = [
  {
    id: 'oil-inflation-pass-through',
    title: 'Oil Supply Shock and the Inflation Pass-Through',
    paragraphs: [
      'Energy disruptions often look like a commodity story at first, but the effect quickly spreads across logistics, manufacturing, and household budgets. When crude moves sharply in a short period, transport and input costs are repriced before official inflation prints fully capture the impact.',
      'As businesses absorb higher fuel and freight bills, they face a difficult margin decision: hold prices and take lower profitability, or pass costs through and risk demand softness. This process tends to happen unevenly by sector, with low-margin businesses forced to react earlier than firms with stronger pricing power.',
      'Financial markets then start to price two paths at once: a growth slowdown from tighter household budgets and a renewed inflation impulse from energy pass-through. That can create short-term volatility where cyclicals and duration-sensitive growth names both reprice for different reasons.',
      'Policy expectations become central. If investors believe the inflation shock will persist for multiple months, they may move forecasts toward fewer or later rate cuts. Bond yields can adjust quickly, and that yield move flows into equity discount rates and credit spreads.',
      'For students, this is a useful framework for connecting real events to core concepts. The event itself is a supply shock, but the investable takeaway is the chain: input costs, pricing decisions, inflation persistence, and policy response. Watching that chain over time helps avoid overreacting to one headline.',
      'In portfolio terms, the key is balance. Energy-linked exposures may help in the initial phase of the shock, while high-debt or low-pricing-power businesses can face pressure. Maintaining diversification across sectors with different inflation sensitivities is usually more resilient than concentrated thematic bets.'
    ],
    financialImportance: 'Financially, this setup matters because it can keep borrowing costs elevated while earnings estimates are being revised. That combination can compress valuation multiples and increase dispersion between winners and losers.' ,
    diagram: ['Supply shock', 'Input costs rise', 'Prices & margins reprice', 'Policy expectations tighten'],
    stats: [
      { label: 'Oil jump (%)', value: 18 },
      { label: 'Freight pressure', value: 12 },
      { label: 'Core inflation risk', value: 9 },
      { label: 'Rate-cut odds', value: 6 }
    ]
  },
  {
    id: 'merger-synergy-risk',
    title: 'Mega-Cap Acquisition Talks and Valuation Discipline',
    paragraphs: [
      'Acquisition headlines can move quickly because the market immediately prices expected synergies, execution risk, and regulatory probability. The target often rerates toward the implied offer value while the acquirer reflects financing cost and integration uncertainty.',
      'In high-profile deals, investors can overemphasize strategic narrative and underestimate integration complexity. Systems integration, cultural alignment, and customer-retention risk are often where expected synergies drift from plan.',
      'Regulatory review is another critical variable. Even if strategic logic is clear, antitrust scrutiny can change deal timelines, required divestitures, and completion odds, which directly affects merger spreads and event-driven positioning.',
      'From a concept standpoint, this is where valuation discipline matters: a great asset can still be a poor investment if purchased at a price that assumes flawless execution. Students should focus on financing mix, debt burden, and whether cost synergies are measurable or aspirational.',
      'In broader market context, active M&A cycles can signal confidence in earnings durability and capital access. But if financing costs stay elevated, only the highest-conviction deals tend to proceed, which can reduce transaction volume even in strategic sectors.',
      'For long-term investors, the lesson is to separate event excitement from expected value. Estimating downside in delayed or blocked scenarios is just as important as modeling upside from successful integration.'
    ],
    financialImportance: 'Financially, merger regimes affect valuation spreads, sector leadership, and balance-sheet risk. The biggest errors usually come from overpaying for uncertain synergies when rates are not supportive.',
    diagram: ['Deal rumor', 'Target reprices', 'Regulatory & integration risk', 'Value creation or dilution'],
    stats: [
      { label: 'Expected synergy ($B)', value: 15 },
      { label: 'Integration risk', value: 9 },
      { label: 'Regulatory drag', value: 11 },
      { label: 'Deal spread', value: 7 }
    ]
  },
  {
    id: 'tariff-margin-cycle',
    title: 'Tariff Shifts and the Corporate Margin Cycle',
    paragraphs: [
      'When tariffs are imposed on imported components, companies must immediately revisit sourcing, pricing, and inventory decisions. The effect is rarely uniform because firms have different supplier concentration, contract structures, and pass-through ability.',
      'Businesses with limited alternatives can experience a direct input-cost step-up, while those with flexible supplier networks may contain the shock over time. In both cases, near-term margin guidance often becomes less certain.',
      'Demand elasticity determines how much cost can be passed through. In categories where consumers can easily substitute, price increases may reduce volume. In categories with high brand loyalty or necessity characteristics, pass-through tends to be stronger.',
      'At the macro level, broad tariff rounds can operate like a tax on trade efficiency. That can raise costs, dampen productivity gains from specialization, and complicate inflation management when growth is already uneven.',
      'For students, the key analytic move is linking policy headline to unit economics: cost per unit, price per unit, and volume trajectory. That framework reveals whether a tariff story is margin-destructive, neutral, or potentially supportive for domestic substitutes.',
      'Portfolio resilience in this environment often favors firms with diversified supply chains, strong procurement execution, and clear evidence of pricing power under stress.'
    ],
    financialImportance: 'Financially, tariff cycles can change earnings quality and valuation confidence. Investors often reward predictable pass-through execution and penalize opaque cost exposure.',
    diagram: ['Tariff applied', 'Input costs reset', 'Pricing vs volume trade-off', 'Margin outcome'],
    stats: [
      { label: 'Input-cost rise', value: 13 },
      { label: 'Pass-through ability', value: 8 },
      { label: 'Volume risk', value: 10 },
      { label: 'Margin stability', value: 6 }
    ]
  },
  {
    id: 'credit-transmission-stress',
    title: 'Regional Bank Stress and Credit Transmission',
    paragraphs: [
      'Bank stress can tighten economic conditions even when policy rates do not change. If lenders become cautious on balance-sheet risk, credit standards tighten and loan growth slows for households and small businesses.',
      'This credit channel often impacts investment and hiring with a lag. Borrowers face higher spreads, stricter collateral terms, or reduced access altogether, which can suppress expansion plans and reduce cyclical momentum.',
      'Markets monitor this through bank funding costs, lending surveys, and credit-spread behavior. A widening spread environment can signal that risk appetite is deteriorating before macro data fully reflects the slowdown.',
      'From a portfolio perspective, quality balance sheets and stable cash-flow profiles usually gain relative strength during credit-tightening periods. Highly leveraged models face refinancing risk if capital becomes more selective.',
      'For students, the key takeaway is that financial conditions are broader than headline policy rates. The same benchmark rate can feel very different in the real economy depending on credit availability and lender confidence.',
      'Understanding transmission helps explain why markets sometimes weaken before hard data does: investors are pricing tomorrow’s financing constraints today.'
    ],
    financialImportance: 'Financially, tighter credit can pressure small-cap and leveraged segments first, while defensive sectors and high-quality cash generators often hold up better.',
    diagram: ['Bank stress rises', 'Lending standards tighten', 'Investment slows', 'Growth cools'],
    stats: [
      { label: 'Lending standards', value: 14 },
      { label: 'Credit spread risk', value: 11 },
      { label: 'Refinancing pressure', value: 10 },
      { label: 'Growth drag', value: 8 }
    ]
  }
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatChange(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function setChangeClass(el, value) {
  el.classList.remove('positive', 'negative', 'neutral');
  if (value > 0) el.classList.add('positive');
  else if (value < 0) el.classList.add('negative');
  else el.classList.add('neutral');
}

function getDailyFeaturedStocks() {
  const daySeed = Math.floor(Date.now() / 86400000);
  return Object.entries(sectorCandidates).map(([sectorName, candidates], index) => {
    const stock = candidates[(daySeed + index) % candidates.length];
    return { sector: sectorName, ...stock };
  });
}

function renderFeaturedGrid(featuredStocks, quoteMap) {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  grid.innerHTML = '';
  featuredStocks.forEach((stock) => {
    const quote = quoteMap.get(stock.symbol);
    const stats = sectorStats[stock.sector];

    const card = document.createElement('article');
    card.className = 'card featured-card';
    card.innerHTML = `
      <p class="badge">${stock.sector}</p>
      <h3>${stock.symbol}</h3>
      <p class="company">${stock.name}</p>
      <p class="price">${quote ? formatCurrency(quote.price) : '$---.--'}</p>
      <p class="change neutral">${quote ? formatChange(quote.changePct) : '--.--%'}</p>
      <div class="sector-meta">
        <p><strong>Avg P/E:</strong> ${stats.avgPE}</p>
        <p><strong>Major-player avg mkt cap:</strong> ${stats.avgMktCap}</p>
        <p>${stats.note}</p>
      </div>
    `;

    const changeEl = card.querySelector('.change');
    if (quote) setChangeClass(changeEl, quote.changePct);
    grid.appendChild(card);
  });
}

function renderMarketOverview(quoteMap) {
  marketOverviewSymbols.forEach((symbol) => {
    const card = document.querySelector(`[data-symbol="${symbol}"]`);
    if (!card) return;

    const quote = quoteMap.get(symbol) || fallbackPrices[symbol];
    if (!quote) return;

    const priceEl = card.querySelector('.price');
    const changeEl = card.querySelector('.change');
    priceEl.textContent = formatCurrency(quote.price);
    changeEl.textContent = formatChange(quote.changePct);
    setChangeClass(changeEl, quote.changePct);
  });
}

async function fetchLiveQuotes(symbols) {
  const url = `https://financialmodelingprep.com/api/v3/quote/${symbols.join(',')}?apikey=demo`;
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Unexpected quote payload');

  return data.reduce((map, item) => {
    if (item?.symbol && typeof item?.price === 'number' && typeof item?.changesPercentage === 'number') {
      map.set(item.symbol, { price: item.price, changePct: item.changesPercentage });
    }
    return map;
  }, new Map());
}

function initVocabToggle() {
  const button = document.getElementById('toggle-vocab');
  const vocabMore = document.getElementById('vocab-more');
  if (!button || !vocabMore) return;

  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    vocabMore.hidden = expanded;
    button.textContent = expanded ? 'See more terms' : 'See fewer terms';
  });
}

function drawFlowDiagram(labels, elementId = 'story-diagram') {
  const svg = document.getElementById(elementId);
  if (!svg) return;

  svg.innerHTML = '';
  const boxWidth = 150;
  const boxHeight = 56;
  const y = 82;
  const startX = 20;
  const gap = 22;

  labels.forEach((label, index) => {
    const x = startX + index * (boxWidth + gap);
    const fill = index % 2 === 0 ? 'rgba(145, 145, 145, 0.2)' : 'rgba(105, 105, 105, 0.2)';

    svg.insertAdjacentHTML('beforeend', `<rect x="${x}" y="${y}" rx="10" ry="10" width="${boxWidth}" height="${boxHeight}" fill="${fill}" stroke="#4a4a4a" />`);

    const words = label.split(' ');
    const lines = [];
    let current = '';
    words.forEach((w) => {
      const candidate = current ? `${current} ${w}` : w;
      if (candidate.length <= 14) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = w;
      }
    });
    if (current) lines.push(current);

    const lineHeight = 14;
    const startY = y + 32 - ((lines.length - 1) * lineHeight) / 2;
    const tspans = lines
      .map((line, i) => `<tspan x="${x + boxWidth / 2}" y="${startY + i * lineHeight}">${line}</tspan>`)
      .join('');
    svg.insertAdjacentHTML('beforeend', `<text text-anchor="middle" fill="#e2e2e2" font-size="12" font-family="Inter">${tspans}</text>`);

    if (index < labels.length - 1) {
      const ax = x + boxWidth + 6;
      svg.insertAdjacentHTML('beforeend', `<line x1="${ax}" y1="${y + boxHeight / 2}" x2="${ax + 12}" y2="${y + boxHeight / 2}" stroke="#b8b8b8" stroke-width="2" />`);
      svg.insertAdjacentHTML('beforeend', `<polygon points="${ax + 12},${y + boxHeight / 2} ${ax + 7},${y + boxHeight / 2 - 4} ${ax + 7},${y + boxHeight / 2 + 4}" fill="#b8b8b8" />`);
    }
  });
}

function drawStatsChart(stats, elementId = 'story-stats-chart') {
  const svg = document.getElementById(elementId);
  if (!svg) return;
  svg.innerHTML = '';

  const max = Math.max(...stats.map((s) => s.value), 1);
  const barWidth = 120;
  const gap = 40;

  stats.forEach((item, i) => {
    const x = 50 + i * (barWidth + gap);
    const h = (item.value / max) * 150;
    const y = 200 - h;
    const fill = i % 2 === 0 ? 'rgba(170, 170, 170, 0.65)' : 'rgba(120, 120, 120, 0.62)';

    svg.insertAdjacentHTML('beforeend', `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="8" fill="${fill}" />`);
    svg.insertAdjacentHTML('beforeend', `<text x="${x + barWidth / 2}" y="215" text-anchor="middle" fill="#d5d5d5" font-size="12" font-family="Inter">${item.label}</text>`);
    svg.insertAdjacentHTML('beforeend', `<text x="${x + barWidth / 2}" y="${y - 8}" text-anchor="middle" fill="#f1f1f1" font-size="12" font-family="Inter">${item.value}</text>`);
  });
}

function getTodayStory() {
  const daySeed = Math.floor(Date.now() / 86400000);
  return dailyStoryPool[daySeed % dailyStoryPool.length];
}

function updateStoryArchiveLog(todayStory) {
  const today = new Date().toISOString().slice(0, 10);
  const key = 'sfb_story_current';
  const logKey = 'sfb_story_archive_log';
  const currentRecord = JSON.parse(localStorage.getItem(key) || 'null');
  const log = JSON.parse(localStorage.getItem(logKey) || '[]');

  if (!currentRecord) {
    localStorage.setItem(key, JSON.stringify({ date: today, storyId: todayStory.id, title: todayStory.title }));
    return;
  }

  if (currentRecord.date !== today || currentRecord.storyId !== todayStory.id) {
    log.unshift({
      archivedOn: today,
      previousDate: currentRecord.date,
      title: currentRecord.title
    });
    localStorage.setItem(logKey, JSON.stringify(log.slice(0, 60)));
    localStorage.setItem(key, JSON.stringify({ date: today, storyId: todayStory.id, title: todayStory.title }));
  }
}

function renderStoryArchiveLog() {
  const container = document.getElementById('daily-archive-log');
  if (!container) return;

  const log = JSON.parse(localStorage.getItem('sfb_story_archive_log') || '[]');
  if (!log.length) {
    container.innerHTML = '<p class="subtitle">No replaced daily stories yet. Check back after the next day rollover.</p>';
    return;
  }

  container.innerHTML = log
    .map((entry) => `<article class="card log-item"><h3>${entry.title}</h3><p>Originally shown on ${entry.previousDate}. Moved to archive on ${entry.archivedOn}.</p></article>`)
    .join('');
}

function initDailyMainStory() {
  const titleEl = document.getElementById('main-story-title');
  if (!titleEl) return;

  const story = getTodayStory();
  updateStoryArchiveLog(story);

  const content = document.getElementById('main-story-content');
  const financial = document.getElementById('main-story-financial');
  const dateNote = document.getElementById('story-date-note');

  titleEl.textContent = story.title;
  if (dateNote) dateNote.textContent = `Updated for ${new Date().toLocaleDateString()}.`;
  if (content) {
    content.innerHTML = `
      <p>${story.paragraphs[0]}</p>
      <p>${story.paragraphs[1]}</p>
      <figure class="inline-visual">
        <figcaption>The chain from real-world event to market effect.</figcaption>
        <svg id="story-diagram" viewBox="0 0 720 220" role="img" aria-label="Story flow diagram"></svg>
      </figure>
      <p>${story.paragraphs[2]}</p>
      <p>${story.paragraphs[3]}</p>
      <figure class="inline-visual">
        <figcaption>Supporting indicators that help frame risk and valuation pressure.</figcaption>
        <svg id="story-stats-chart" viewBox="0 0 720 260" role="img" aria-label="Story statistics chart"></svg>
      </figure>
      <p>${story.paragraphs[4]}</p>
      <p>${story.paragraphs[5]}</p>
    `;
  }
  if (financial) {
    financial.innerHTML = `<h4>Market significance</h4><p>${story.financialImportance}</p>`;
  }

  drawFlowDiagram(story.diagram, 'story-diagram');
  drawStatsChart(story.stats, 'story-stats-chart');
}

async function initStockSpotlights() {
  const hasTickerGrid = Boolean(document.getElementById('ticker-grid'));
  const hasFeaturedGrid = Boolean(document.getElementById('featured-grid'));
  if (!hasTickerGrid && !hasFeaturedGrid) return;

  const note = document.getElementById('data-note');
  const featuredStocks = getDailyFeaturedStocks();
  const allSymbols = [...new Set([...marketOverviewSymbols, ...featuredStocks.map((s) => s.symbol)])];

  try {
    const quoteMap = await fetchLiveQuotes(allSymbols);
    renderMarketOverview(quoteMap);
    renderFeaturedGrid(featuredStocks, quoteMap);
    if (note) note.textContent = `Live quotes updated ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}.`;
  } catch (error) {
    renderMarketOverview(new Map());
    renderFeaturedGrid(featuredStocks, new Map());
    if (note) note.textContent = 'Live quote API unavailable; showing placeholder values where needed.';
    console.error('Live quote fetch failed:', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initVocabToggle();
  initDailyMainStory();
  renderStoryArchiveLog();
  initStockSpotlights();
});
