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

document.addEventListener('DOMContentLoaded', () => {
  initVocabToggle();
  initStockSpotlights();
});
