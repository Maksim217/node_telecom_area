module.exports = randomBalance = () => {
  const rand = 100 - 0.5 + Math.random() * 1000;
  return Math.round(rand);
};

module.exports = toCurrency = (balance) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
  }).format(balance);
};

module.exports = randomTariffPlan = () => {
  const rand = 200 + Math.random() * 2500;
  return 'Все за ' + Math.round(rand);
};
