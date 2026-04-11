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

const fallbackPrices = {
  AAPL: { price: 198.43, changePct: 0.94 },
  MSFT: { price: 421.17, changePct: -0.35 },
  NVDA: { price: 1024.88, changePct: 1.62 },
  SPY: { price: 518.07, changePct: 0.28 }
};

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function formatChange(value) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function setChangeClass(el, value) {
  el.classList.remove('positive', 'negative', 'neutral');
  if (value > 0) {
    el.classList.add('positive');
  } else if (value < 0) {
    el.classList.add('negative');
  } else {
    el.classList.add('neutral');
  }
}

function getDailyFeaturedStocks() {
  const daySeed = Math.floor(Date.now() / 86400000);
  const sectors = Object.entries(sectorCandidates);
  return sectors.map(([sectorName, candidates], index) => {
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
    const price = quote?.price;
    const changePct = quote?.changePct;

    const card = document.createElement('article');
    card.className = 'card featured-card';
    card.innerHTML = `
      <p class="badge">${stock.sector}</p>
      <h3>${stock.symbol}</h3>
      <p class="company">${stock.name}</p>
      <p class="price">${typeof price === 'number' ? formatCurrency(price) : '$---.--'}</p>
      <p class="change neutral">${typeof changePct === 'number' ? formatChange(changePct) : '--.--%'}</p>
    `;

    const changeEl = card.querySelector('.change');
    if (typeof changePct === 'number') {
      setChangeClass(changeEl, changePct);
    }

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
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error('Unexpected quote payload');
  }

  return data.reduce((map, item) => {
    if (item?.symbol && typeof item?.price === 'number' && typeof item?.changesPercentage === 'number') {
      map.set(item.symbol, {
        price: item.price,
        changePct: item.changesPercentage
      });
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

    if (note) {
      note.textContent = `Live quotes updated ${new Date().toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit'
      })}.`;
    }
  } catch (error) {
    renderMarketOverview(new Map());
    renderFeaturedGrid(featuredStocks, new Map());

    if (note) {
      note.textContent = 'Live quote API unavailable; showing placeholder values where needed.';
    }
    console.error('Live quote fetch failed:', error);
  }
}


const dailyStoryPool = [
  {
    title: 'Oil Supply Shock and the Inflation Pass-Through',
    concept: 'Concept: Cost-Push Inflation',
    dateNote: 'Daily rotation based on your local date.',
    paragraphs: [
      'Event: a supply disruption in energy markets raises crude prices quickly. Because transport, manufacturing, and utilities all depend on energy inputs, companies face higher operating costs almost immediately.',
      'Concept tie-in: this is a classic cost-push inflation channel. Firms either absorb the higher costs (lower margins) or pass them to consumers (higher prices), which can keep inflation sticky even if demand is only moderate.',
      'Investor implication: rate-sensitive assets can react if markets expect tighter monetary policy for longer. Students can watch this by comparing energy-sector performance with consumer discretionary and bond yields.'
    ],
    diagram: ['Supply shock', 'Input costs rise', 'Consumer prices rise', 'Policy stays tighter']
  },
  {
    title: 'Mega-Cap Acquisition Talks and Valuation Discipline',
    concept: 'Concept: Merger Arbitrage & Synergy Risk',
    dateNote: 'Daily rotation based on your local date.',
    paragraphs: [
      'Event: a large company explores acquiring a smaller strategic competitor. Headlines often emphasize potential growth and market share gains, which can quickly lift the target’s stock and move the acquirer in the opposite direction.',
      'Concept tie-in: merger pricing reflects completion probability, expected synergies, and integration risk. If the market believes the deal may face regulatory friction or execution challenges, the spread between offer value and market price can widen.',
      'Investor implication: not every deal creates value. Students should analyze financing terms, debt impact, and whether projected synergies are realistic or mostly narrative.'
    ],
    diagram: ['Deal rumor', 'Target reprices', 'Spread reflects risk', 'Outcome: approve / block']
  },
  {
    title: 'New Tariffs and Corporate Margin Pressure',
    concept: 'Concept: Price Elasticity & Margin Management',
    dateNote: 'Daily rotation based on your local date.',
    paragraphs: [
      'Event: tariffs are imposed on key imported components. Companies that rely on those inputs must decide whether to absorb costs, substitute suppliers, or raise end prices.',
      'Concept tie-in: elasticity matters. If customers are sensitive to price changes, firms have limited ability to pass costs through, which can compress margins and weaken earnings growth.',
      'Investor implication: sectors with high input dependence and low pricing power can underperform in tariff cycles, while firms with strong brands or domestic supply flexibility may hold margins better.'
    ],
    diagram: ['Tariff imposed', 'Input cost rises', 'Pricing decision', 'Margin expands or contracts']
  },
  {
    title: 'Regional Bank Stress and Credit Availability',
    concept: 'Concept: Credit Transmission Mechanism',
    dateNote: 'Daily rotation based on your local date.',
    paragraphs: [
      'Event: concerns about bank balance sheets trigger tighter lending standards, especially for small businesses and real estate borrowers.',
      'Concept tie-in: even without policy-rate changes, reduced credit supply can slow economic activity. This is the credit transmission channel—financing conditions influence growth and hiring.',
      'Investor implication: when credit tightens, defensive cash-flow names can outperform while leveraged segments face higher refinancing risk.'
    ],
    diagram: ['Bank stress', 'Lending tightens', 'Investment slows', 'Growth cools']
  }
];

function drawStoryDiagram(labels) {
  const svg = document.getElementById('story-diagram');
  if (!svg) return;

  const boxWidth = 150;
  const boxHeight = 56;
  const y = 82;
  const startX = 20;
  const gap = 22;

  svg.innerHTML = '';
  labels.forEach((label, index) => {
    const x = startX + index * (boxWidth + gap);
    const fill = index % 2 === 0 ? 'rgba(82, 222, 198, 0.18)' : 'rgba(235, 204, 111, 0.16)';

    svg.insertAdjacentHTML(
      'beforeend',
      `<rect x="${x}" y="${y}" rx="10" ry="10" width="${boxWidth}" height="${boxHeight}" fill="${fill}" stroke="#3f7f60" />`
    );
    svg.insertAdjacentHTML(
      'beforeend',
      `<text x="${x + boxWidth / 2}" y="${y + 32}" text-anchor="middle" fill="#dff5c6" font-size="14" font-family="Inter">${label}</text>`
    );

    if (index < labels.length - 1) {
      const arrowX = x + boxWidth + 6;
      svg.insertAdjacentHTML(
        'beforeend',
        `<line x1="${arrowX}" y1="${y + boxHeight / 2}" x2="${arrowX + 12}" y2="${y + boxHeight / 2}" stroke="#79db9e" stroke-width="2" />`
      );
      svg.insertAdjacentHTML(
        'beforeend',
        `<polygon points="${arrowX + 12},${y + boxHeight / 2} ${arrowX + 7},${y + boxHeight / 2 - 4} ${arrowX + 7},${y + boxHeight / 2 + 4}" fill="#79db9e" />`
      );
    }
  });
}

function initDailyMainStory() {
  const titleEl = document.getElementById('main-story-title');
  if (!titleEl) return;

  const conceptEl = document.getElementById('main-story-concept');
  const body1 = document.getElementById('main-story-body-1');
  const body2 = document.getElementById('main-story-body-2');
  const body3 = document.getElementById('main-story-body-3');
  const dateNote = document.getElementById('story-date-note');

  const daySeed = Math.floor(Date.now() / 86400000);
  const story = dailyStoryPool[daySeed % dailyStoryPool.length];

  titleEl.textContent = story.title;
  conceptEl.textContent = story.concept;
  body1.textContent = story.paragraphs[0];
  body2.textContent = story.paragraphs[1];
  body3.textContent = story.paragraphs[2];
  if (dateNote) {
    dateNote.textContent = `Updated for ${new Date().toLocaleDateString()}.`;
  }

  drawStoryDiagram(story.diagram);
}

document.addEventListener('DOMContentLoaded', () => {
  initVocabToggle();
  initStockSpotlights();
  initDailyMainStory();
});
