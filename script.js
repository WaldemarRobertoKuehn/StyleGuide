(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const currency = (cents) => (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  let state = { started: false, moving: false, km: 0, minute: 0, tolls: 0, waits: 0 };
  const fields = [$('km-rate'), $('minute-rate')];

  function setTheme(dark) {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    $('theme-label').textContent = dark ? 'Modo diurno' : 'Modo noturno';
    document.querySelector('meta[name="theme-color"]').content = dark ? '#07121F' : '#F3F1EB';
    try { localStorage.setItem('valdir-theme', dark ? 'dark' : 'light'); } catch (_) { /* Preference storage is optional. */ }
  }
  let preference;
  try { preference = localStorage.getItem('valdir-theme'); } catch (_) { /* Works without storage. */ }
  setTheme(preference === 'dark' || (!preference && window.matchMedia('(prefers-color-scheme: dark)').matches));
  $('theme-toggle').addEventListener('click', () => setTheme(document.documentElement.dataset.theme !== 'dark'));

  // Integer cents avoid floating-point rounding in money calculations.
  function parseRate(value) {
    const normalized = value.trim();
    if (!/^\d{1,4}([,.]\d{1,2})?$/.test(normalized)) return null;
    const [whole, fraction = ''] = normalized.replace(',', '.').split('.');
    const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
    return cents > 0 ? cents : null;
  }

  function render() {
    const { started, moving, km, minute, tolls, waits } = state;
    fields.forEach((field) => { field.disabled = moving; });
    $('calculate').disabled = moving;
    $('calculate').firstChild.textContent = started ? 'Recalcular e iniciar trajeto ' : 'Calcular e iniciar trajeto ';
    $('toggle-trip').hidden = !started;
    $('toggle-trip').textContent = moving ? 'Parar trajeto' : 'Retomar trajeto';
    $('trip-status').textContent = moving ? '● EM TRAJETO' : '■ PARADO';
    $('trip-status').classList.toggle('active', moving);
    $('add-toll').disabled = !started || moving;
    $('add-wait').disabled = !started || moving;
    $('extras-help').textContent = !started ? 'Primeiro, calcule e inicie o trajeto.' : moving ? 'Pare o trajeto para adicionar pedágio ou espera.' : 'Trajeto parado. Você pode acrescentar pedágio ou espera.';
    $('rate-help').textContent = moving ? 'Pare o trajeto para alterar as tarifas. O percurso continua fixo.' : started ? 'Ao alterar as tarifas, use “Recalcular e iniciar trajeto” para atualizar o total. Os adicionais serão mantidos.' : 'Tarifas ilustrativas. Ajuste os valores antes de iniciar.';
    const distance = km * 8;
    const duration = minute * 20;
    const toll = tolls * 650;
    const wait = waits * 5 * minute;
    $('distance-detail').textContent = started ? `8 km × ${currency(km)}` : '8 km';
    $('duration-detail').textContent = started ? `20 min × ${currency(minute)}` : '20 min';
    $('toll-count').textContent = `${tolls} ${tolls === 1 ? 'adicional' : 'adicionais'}`;
    $('wait-count').textContent = `${waits * 5} minutos`;
    [['distance-total', distance], ['duration-total', duration], ['toll-total', toll], ['wait-total', wait]].forEach(([id, amount]) => { $(id).textContent = started ? currency(amount) : '—'; });
    $('final-total').textContent = currency(distance + duration + toll + wait);
    $('result-description').textContent = started ? 'Total simulado · 8 km e 20 min + adicionais' : 'Informe as tarifas e calcule para começar.';
  }

  $('fare-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.moving) return;
    const rates = fields.map((field) => parseRate(field.value));
    fields.forEach((field, index) => field.setAttribute('aria-invalid', String(rates[index] === null)));
    const invalid = rates.findIndex((rate) => rate === null);
    $('fare-error').hidden = invalid === -1;
    if (invalid !== -1) {
      $('fare-error').textContent = 'Digite um valor maior que zero para o km e para o minuto. Use até R$ 9.999,99, com no máximo duas casas decimais (ex.: 3,00).';
      fields[invalid].focus();
      return;
    }
    state = { ...state, started: true, moving: true, km: rates[0], minute: rates[1] };
    render();
    $('toggle-trip').focus();
  });
  $('toggle-trip').addEventListener('click', () => {
    if (!state.started) return;
    state.moving = !state.moving;
    render();
  });
  $('add-toll').addEventListener('click', () => { if (state.started && !state.moving) { state.tolls++; render(); } });
  $('add-wait').addEventListener('click', () => { if (state.started && !state.moving) { state.waits++; render(); } });
  $('reset').addEventListener('click', () => {
    state = { started: false, moving: false, km: 0, minute: 0, tolls: 0, waits: 0 };
    $('fare-form').reset();
    $('fare-error').hidden = true;
    fields.forEach((field) => field.removeAttribute('aria-invalid'));
    render();
    fields[0].focus();
  });
  document.querySelectorAll('a[href="#simulacao"]').forEach((link) => link.addEventListener('click', () => { $('simulation-title').focus({ preventScroll: true }); }));
  render();
})();
