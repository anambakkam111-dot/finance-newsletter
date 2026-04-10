const tickerPlaceholders = [
  { symbol: 'AAPL', price: 198.43, changePct: 0.94 },
  { symbol: 'MSFT', price: 421.17, changePct: -0.35 },
  { symbol: 'NVDA', price: 1024.88, changePct: 1.62 },
  { symbol: 'SPY', price: 518.07, changePct: 0.28 }
];

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

function renderTickers() {
  tickerPlaceholders.forEach((item) => {
    const card = document.querySelector(`[data-symbol="${item.symbol}"]`);
    if (!card) return;

    const priceEl = card.querySelector('.price');
    const changeEl = card.querySelector('.change');

    priceEl.textContent = formatCurrency(item.price);
    changeEl.textContent = formatChange(item.changePct);

    changeEl.classList.remove('positive', 'negative', 'neutral');
    if (item.changePct > 0) {
      changeEl.classList.add('positive');
    } else if (item.changePct < 0) {
      changeEl.classList.add('negative');
    } else {
      changeEl.classList.add('neutral');
    }
  });
}

document.addEventListener('DOMContentLoaded', renderTickers);
