/**
 * ORLOV INTERACTIVE LOGIC
 * Zero-Lag Execution: Native events, zero wheel-hijacking, purely reactive DOM.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Hero Node Switcher Telemetry
  const nodeTabs = document.querySelectorAll('.node-tab');
  const leftWidgetVal = document.getElementById('widget-left-val');
  const leftWidgetMeta = document.getElementById('widget-left-meta');
  const rightWidgetVal = document.getElementById('widget-right-val');
  const rightWidgetMeta = document.getElementById('widget-right-meta');

  const nodeData = {
    '1': {
      leftVal: '3,840 лідів/міс',
      leftMeta: 'CPL: $14.20 · <span class="badge-tag-danger">Шум 62%</span>',
      rightVal: '3.1% ➔ 8.4%',
      rightMeta: 'Збережена маржа: <span class="badge-tag-success">+$48,600</span>'
    },
    '2': {
      leftVal: '4.2 дні прогріву',
      leftMeta: 'Асинхронні артефакти · <span class="badge-tag-success">Відкриття 78%</span>',
      rightVal: '89% явка на дзвінок',
      rightMeta: 'Без дзвінків-нагадувань · <span class="badge-tag-success">+24% конверсія</span>'
    },
    '3': {
      leftVal: 'CRM-паспорт ліда',
      leftMeta: 'Скоринг за бюджетом · <span class="badge-tag-success">Готове досьє</span>',
      rightVal: '$12,400 сер. чек',
      rightMeta: 'Сейлз закриває з 1-ї сесії · <span class="badge-tag-success">Маржинальність +38%</span>'
    }
  };

  nodeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      nodeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const step = tab.getAttribute('data-node');
      if (nodeData[step]) {
        if (leftWidgetVal) leftWidgetVal.textContent = nodeData[step].leftVal;
        if (leftWidgetMeta) leftWidgetMeta.innerHTML = nodeData[step].leftMeta;
        if (rightWidgetVal) rightWidgetVal.textContent = nodeData[step].rightVal;
        if (rightWidgetMeta) rightWidgetMeta.innerHTML = nodeData[step].rightMeta;
      }
    });
  });

  // 2. Interactive Funnel Leak Simulator
  const rangeBudget = document.getElementById('range-budget');
  const rangeTicket = document.getElementById('range-ticket');
  const rangeConv = document.getElementById('range-conv');

  const dispBudget = document.getElementById('disp-budget');
  const dispTicket = document.getElementById('disp-ticket');
  const dispConv = document.getElementById('disp-conv');

  const outLeakMonthly = document.getElementById('out-leak-monthly');
  const outLeakAnnual = document.getElementById('out-leak-annual');
  const btnTransferSim = document.getElementById('btn-transfer-sim');

  const formBudget = document.getElementById('form-budget');
  const formTicket = document.getElementById('form-ticket');

  function updateSimulator() {
    if (!rangeBudget || !rangeTicket || !rangeConv) return;

    const budget = parseInt(rangeBudget.value, 10);
    const ticket = parseInt(rangeTicket.value, 10);
    const conv = parseFloat(rangeConv.value);

    // Update labels
    if (dispBudget) dispBudget.textContent = `$${budget.toLocaleString('en-US')}`;
    if (dispTicket) dispTicket.textContent = `$${ticket.toLocaleString('en-US')}`;
    if (dispConv) dispConv.textContent = `${conv.toFixed(1)}%`;

    // Realistic loss math:
    // With poor funnel architecture, 38-52% of pipeline value is lost at unqualified entry and dropped followups
    const estimatedLostDeals = Math.max(1, Math.round((budget / 1000) * (3.8 / Math.max(0.8, conv))));
    const monthlyLeak = Math.round(budget * 0.42 + estimatedLostDeals * ticket * 0.22);
    const annualLeak = monthlyLeak * 12;

    if (outLeakMonthly) outLeakMonthly.textContent = `$${monthlyLeak.toLocaleString('en-US')}/міс`;
    if (outLeakAnnual) outLeakAnnual.textContent = `$${annualLeak.toLocaleString('en-US')}/рік`;

    // Prefill form values if present
    if (formBudget) formBudget.value = `$${budget.toLocaleString('en-US')}`;
    if (formTicket) formTicket.value = `$${ticket.toLocaleString('en-US')}`;
  }

  if (rangeBudget && rangeTicket && rangeConv) {
    rangeBudget.addEventListener('input', updateSimulator);
    rangeTicket.addEventListener('input', updateSimulator);
    rangeConv.addEventListener('input', updateSimulator);
    updateSimulator(); // Initial run
  }

  if (btnTransferSim) {
    btnTransferSim.addEventListener('click', () => {
      const appSection = document.getElementById('diagnostic-application');
      if (appSection) {
        appSection.scrollIntoView({ behavior: 'smooth' });
        // Pulse the inputs
        if (formBudget) {
          formBudget.focus();
          formBudget.style.borderColor = '#F5F5F5';
          setTimeout(() => { formBudget.style.borderColor = ''; }, 1500);
        }
      }
    });
  }

  // 3. Dissected Case Monograph Toggle (Before vs After)
  const toggleBefore = document.getElementById('toggle-before');
  const toggleAfter = document.getElementById('toggle-after');

  const caseStatCpl = document.getElementById('case-cpl');
  const caseStatConv = document.getElementById('case-conv');
  const caseStatCycle = document.getElementById('case-cycle');
  const caseStatRev = document.getElementById('case-rev');
  const caseDeltaRev = document.getElementById('case-delta-rev');

  if (toggleBefore && toggleAfter) {
    toggleBefore.addEventListener('click', () => {
      toggleBefore.classList.add('active');
      toggleAfter.classList.remove('active');

      if (caseStatCpl) caseStatCpl.textContent = '$46.00';
      if (caseStatConv) caseStatConv.textContent = '4.1%';
      if (caseStatCycle) caseStatCycle.textContent = '38 днів';
      if (caseStatRev) caseStatRev.textContent = '$41,000';
      if (caseDeltaRev) {
        caseDeltaRev.textContent = 'Базова каденція';
        caseDeltaRev.className = 'stat-item-delta negative';
      }
    });

    toggleAfter.addEventListener('click', () => {
      toggleAfter.classList.add('active');
      toggleBefore.classList.remove('active');

      if (caseStatCpl) caseStatCpl.textContent = '$38.50';
      if (caseStatConv) caseStatConv.textContent = '11.8%';
      if (caseStatCycle) caseStatCycle.textContent = '14 днів';
      if (caseStatRev) caseStatRev.textContent = '$172,400';
      if (caseDeltaRev) {
        caseDeltaRev.textContent = '+4.2× приріст чистої маржі';
        caseDeltaRev.className = 'stat-item-delta';
      }
    });
  }

  // 4. Form Submit Notification
  const appForm = document.getElementById('diagnostic-form');
  const formSuccessNotice = document.getElementById('form-success-notice');

  if (appForm) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = appForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Надсилання даних...';
      }
      setTimeout(() => {
        if (appForm) appForm.style.display = 'none';
        if (formSuccessNotice) {
          formSuccessNotice.style.display = 'block';
          formSuccessNotice.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 700);
    });
  }

  // 5. Back to top button
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // 6. Scroll Reveal Observer
  const revealTargets = document.querySelectorAll('.section-kicker, .section-title, .section-desc, .diagnostic-card, .simulator-panel, .monograph-wrapper, .protocol-card, .author-grid, .application-box');
  revealTargets.forEach((el, idx) => {
    el.classList.add('orlov-reveal');
    el.style.transitionDelay = `${(idx % 3) * 0.08}s`;
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }
});
