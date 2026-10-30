/**
 * ALONA POLSKI CENTRUM — INTERACTIVE DEMO MODAL SUITE & CAPTURE CONTROLLER
 * Intercepts all clicks on demo actions across Uczeń, Rodzic, and Nauczyciel.
 * Guarantees ZERO white screens, rich interactive modals, and adaptive glassmorphism.
 */

(function () {
  'use strict';

  // Inject CSS for demo modals and adaptive glassmorphism
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Modal Backdrop */
    .alona-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 999999;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: alonaFadeIn 0.2s ease-out;
    }

    @keyframes alonaFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes alonaScaleUp {
      from { opacity: 0; transform: scale(0.95) translateY(10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    /* Modal Container */
    .alona-modal-box {
      width: 100%;
      max-width: 680px;
      max-height: 90vh;
      overflow-y: auto;
      background: #FFFFFF;
      color: #1E293B;
      border-radius: 20px;
      box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.08);
      padding: 32px;
      position: relative;
      animation: alonaScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark), [data-theme="dark"], html.dark, body.dark {
      .alona-modal-box {
        background: #0F172A;
        color: #F8FAFC;
        box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.12);
      }
      .alona-modal-close {
        color: #94A3B8 !important;
      }
      .alona-modal-close:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #FFFFFF !important;
      }
      .alona-table th {
        background: #1E293B !important;
        color: #94A3B8 !important;
        border-color: #334155 !important;
      }
      .alona-table td {
        border-color: #334155 !important;
        color: #F8FAFC !important;
      }
      .alona-card-box {
        background: #1E293B !important;
        border-color: #334155 !important;
      }
      .alona-choice-btn {
        background: #1E293B !important;
        border-color: #334155 !important;
        color: #F8FAFC !important;
      }
      .alona-choice-btn:hover {
        background: #334155 !important;
      }
      .alona-choice-btn.active {
        border-color: #10B981 !important;
        background: rgba(16, 185, 129, 0.15) !important;
      }
      .alona-input {
        background: #1E293B !important;
        border-color: #334155 !important;
        color: #FFFFFF !important;
      }
    }

    .alona-modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    }

    .alona-modal-title {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin: 0 0 6px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .alona-modal-sub {
      font-size: 13px;
      color: #64748B;
      margin: 0;
    }

    .alona-modal-close {
      background: transparent;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #64748B;
      transition: all 0.15s ease;
    }

    .alona-modal-close:hover {
      background: rgba(15, 23, 42, 0.06);
      color: #0F172A;
    }

    .alona-badge-success {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.12);
      color: #10B981;
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }

    .alona-badge-amber {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(245, 158, 11, 0.12);
      color: #D97706;
      border: 1px solid rgba(245, 158, 11, 0.25);
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }

    .alona-btn-primary {
      background: #10B981;
      color: #FFFFFF;
      border: none;
      border-radius: 12px;
      padding: 12px 24px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
      transition: all 0.15s ease;
    }

    .alona-btn-primary:hover {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
    }

    .alona-btn-secondary {
      background: transparent;
      color: #64748B;
      border: 1px solid rgba(15, 23, 42, 0.15);
      border-radius: 12px;
      padding: 12px 20px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .alona-btn-secondary:hover {
      background: rgba(15, 23, 42, 0.05);
      color: #0F172A;
    }

    .alona-card-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 20px;
    }

    .alona-grid-choice {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }

    .alona-choice-btn {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 12px;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s ease;
    }

    .alona-choice-btn:hover {
      border-color: #94A3B8;
      background: #F1F5F9;
    }

    .alona-choice-btn.active {
      border-color: #10B981;
      background: rgba(16, 185, 129, 0.08);
      color: #065F46;
      box-shadow: 0 0 0 1px #10B981;
    }

    .alona-input {
      width: 100%;
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 14px;
      color: #0F172A;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.15s ease;
    }

    .alona-input:focus {
      border-color: #10B981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
    }

    .alona-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 13px;
    }

    .alona-table th {
      text-align: left;
      padding: 10px 12px;
      background: #F1F5F9;
      color: #475569;
      font-weight: 700;
      border-bottom: 1px solid #CBD5E1;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .alona-table td {
      padding: 12px;
      border-bottom: 1px solid #E2E8F0;
      color: #1E293B;
    }

    /* Adaptive Frosted Glass Floating Role Bar (Light & Dark Theme) */
    .demo-role-floating-bar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: rgba(255, 255, 255, 0.58);
      backdrop-filter: blur(22px) saturate(190%);
      -webkit-backdrop-filter: blur(22px) saturate(190%);
      border: 1px solid rgba(15, 23, 42, 0.12);
      box-shadow: 0 14px 40px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.75);
      color: #0F172A;
      padding: 6px 8px 6px 16px;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      transition: all 0.25s ease;
    }

    [data-theme="dark"] .demo-role-floating-bar,
    html.dark .demo-role-floating-bar,
    body.dark .demo-role-floating-bar {
      background: rgba(15, 23, 42, 0.56);
      border: 1px solid rgba(255, 255, 255, 0.16);
      box-shadow: 0 16px 44px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.14);
      color: #F8FAFC;
    }

    .demo-role-status {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      font-weight: 700;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }

    .demo-role-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.85);
    }

    .demo-role-pill-group {
      display: flex;
      align-items: center;
      gap: 4px;
      background: rgba(15, 23, 42, 0.06);
      border: 1px solid rgba(15, 23, 42, 0.06);
      padding: 3px;
      border-radius: 9999px;
    }

    [data-theme="dark"] .demo-role-pill-group,
    html.dark .demo-role-pill-group,
    body.dark .demo-role-pill-group {
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .demo-role-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      color: #475569;
      border: none;
      border-radius: 9999px;
      padding: 6px 13px;
      cursor: pointer;
      font-size: 11.5px;
      font-weight: 600;
      transition: all 0.18s ease;
      white-space: nowrap;
    }

    .demo-role-btn:hover {
      color: #0F172A;
      background: rgba(15, 23, 42, 0.05);
    }

    [data-theme="dark"] .demo-role-btn,
    html.dark .demo-role-btn,
    body.dark .demo-role-btn {
      color: #CBD5E1;
    }

    [data-theme="dark"] .demo-role-btn:hover,
    html.dark .demo-role-btn:hover,
    body.dark .demo-role-btn:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.08);
    }

    .demo-role-btn.is-active {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
      color: #FFFFFF !important;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.32);
    }
  `;
  document.head.appendChild(styleEl);

  // Active modal element
  let activeModalEl = null;

  function closeModal() {
    if (activeModalEl && activeModalEl.parentNode) {
      activeModalEl.parentNode.removeChild(activeModalEl);
      activeModalEl = null;
    }
  }

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeModalEl) {
      closeModal();
    }
  });

  function showModal(contentHtml) {
    closeModal();
    const backdrop = document.createElement('div');
    backdrop.className = 'alona-modal-backdrop';
    backdrop.innerHTML = `
      <div class="alona-modal-box">
        ${contentHtml}
      </div>
    `;

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    const closeBtn = backdrop.querySelector('.alona-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    document.body.appendChild(backdrop);
    activeModalEl = backdrop;
    return backdrop;
  }

  /* ========================================================
     MODAL 1: UCZEŃ — Rezerwacja terminu i grafik
     ======================================================== */
  function openBookingModal() {
    const html = `
      <div class="alona-modal-header">
        <div>
          <h2 class="alona-modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            Rezerwacja terminu lekcji · Alona Polski Centrum
          </h2>
          <p class="alona-modal-sub">Wybierz dogodny dzień i godzinę zajęć z Panią Aloną</p>
        </div>
        <button class="alona-modal-close" aria-label="Zamknij">✕</button>
      </div>

      <div id="booking-step-form">
        <div style="margin-bottom: 20px;">
          <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">1. Wybierz dzień tygodnia:</label>
          <div class="alona-grid-choice" id="day-picker">
            <button class="alona-choice-btn active" data-val="Poniedziałek, 3 listopada">Poniedziałek<br><small>3 listopada</small></button>
            <button class="alona-choice-btn" data-val="Środa, 5 listopada">Środa<br><small>5 listopada</small></button>
            <button class="alona-choice-btn" data-val="Piątek, 7 listopada">Piątek<br><small>7 listopada</small></button>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">2. Dostępne godziny (czas polski, 45 min):</label>
          <div class="alona-grid-choice" id="time-picker">
            <button class="alona-choice-btn active" data-val="15:00 — 15:45">15:00 — 15:45</button>
            <button class="alona-choice-btn" data-val="16:30 — 17:15">16:30 — 17:15</button>
            <button class="alona-choice-btn" data-val="18:00 — 18:45">18:00 — 18:45</button>
          </div>
        </div>

        <div style="margin-bottom: 24px;">
          <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 8px;">3. Cel i moduł lekcji:</label>
          <div class="alona-grid-choice" id="focus-picker">
            <button class="alona-choice-btn active" data-val="Konwersacje i gry językowe">Konwersacje i gry</button>
            <button class="alona-choice-btn" data-val="Gramatyka A1/A2 bez stresu">Gramatyka A1/A2</button>
            <button class="alona-choice-btn" data-val="Przygotowanie szkolne">Lekcja czytania</button>
          </div>
        </div>

        <div class="alona-card-box" style="margin-bottom: 24px; display: flex; align-items: center; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #4F46E5; color: #FFF; display: grid; place-items: center; font-weight: 800; font-size: 16px; flex-shrink: 0;">A</div>
          <div>
            <strong style="font-size: 14px; display: block;">Lektorka: Pani Alona</strong>
            <span style="font-size: 12px; color: #64748B;">Lekcja 1-na-1 online · Google Meet / Wirtualna klasa Alona</span>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: flex-end;">
          <button class="alona-btn-secondary" onclick="this.closest('.alona-modal-backdrop').remove()">Anuluj</button>
          <button class="alona-btn-primary" id="btn-confirm-booking">
            Potwierdź rezerwację terminu →
          </button>
        </div>
      </div>

      <div id="booking-step-success" style="display: none; text-align: center; padding: 24px 12px;">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10B981; display: grid; place-items: center; margin: 0 auto 16px; font-size: 28px;">✓</div>
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Termin zarezerwowany pomyślnie!</h3>
        <p style="font-size: 14px; color: #64748B; max-width: 440px; margin: 0 auto 24px; line-height: 1.5;" id="booking-success-details">
          Lekcja została dodana do grafiku ucznia Maksymiliana. Link do sali wirtualnej będzie aktywny na 10 minut przed rozpoczęciem.
        </p>
        <button class="alona-btn-primary" onclick="this.closest('.alona-modal-backdrop').remove()">Wróć do pulpitu</button>
      </div>
    `;

    const modal = showModal(html);

    // Setup choice interactions
    ['day-picker', 'time-picker', 'focus-picker'].forEach(id => {
      const container = modal.querySelector('#' + id);
      if (container) {
        container.querySelectorAll('.alona-choice-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            container.querySelectorAll('.alona-choice-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          });
        });
      }
    });

    const confirmBtn = modal.querySelector('#btn-confirm-booking');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const day = modal.querySelector('#day-picker .active').getAttribute('data-val');
        const time = modal.querySelector('#time-picker .active').getAttribute('data-val');
        const focus = modal.querySelector('#focus-picker .active').getAttribute('data-val');

        modal.querySelector('#booking-step-form').style.display = 'none';
        const succPane = modal.querySelector('#booking-step-success');
        succPane.style.display = 'block';
        modal.querySelector('#booking-success-details').innerHTML = `
          <strong>${day} · ${time}</strong><br>
          Moduł: <em>${focus}</em><br>
          Powiadomienie SMS oraz zaproszenie Google Calendar zostały wysłane!
        `;
      });
    }
  }

  /* ========================================================
     MODAL 2: RODZIC — Faktury, płatności i szybki BLIK
     ======================================================== */
  function openParentBillingModal() {
    const html = `
      <div class="alona-modal-header">
        <div>
          <h2 class="alona-modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            Płatności i Faktury · Strefa Rodzica
          </h2>
          <p class="alona-modal-sub">Rozliczenia czesnego za zajęcia ucznia Maksymiliana Kowalskiego</p>
        </div>
        <button class="alona-modal-close" aria-label="Zamknij">✕</button>
      </div>

      <div id="parent-billing-view">
        <!-- Active Invoice Card -->
        <div class="alona-card-box" style="border-left: 4px solid #F59E0B;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
            <div>
              <span class="alona-badge-amber" id="invoice-status-badge">DO ZAPŁATY · TERMIN: 10 LISTOPADA</span>
              <h3 style="font-size: 18px; font-weight: 800; margin: 8px 0 4px 0;">Faktura #FV/2026/10/14</h3>
              <p style="font-size: 13px; color: #64748B; margin: 0;">Pakiet 8 lekcji indywidualnych (listopad 2026)</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 26px; font-weight: 900; color: #0F172A;" id="invoice-amount-display">640,00 PLN</div>
              <span style="font-size: 11px; color: #64748B;">80 PLN / lekcja 45 min</span>
            </div>
          </div>

          <!-- Payment Form -->
          <div style="margin-top: 18px; padding-top: 16px; border-top: 1px solid rgba(15, 23, 42, 0.08);">
            <label style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748B; display: block; margin-bottom: 8px;">
              Wybierz metodę płatności:
            </label>
            <div class="alona-grid-choice" id="payment-method-picker" style="margin-bottom: 16px;">
              <button class="alona-choice-btn active" data-method="blik"><strong>BLIK</strong> (Kod 6 cyfr)</button>
              <button class="alona-choice-btn" data-method="card">Karta / Apple Pay</button>
              <button class="alona-choice-btn" data-method="p24">Przelewy24</button>
            </div>

            <div id="blik-box" style="margin-bottom: 16px;">
              <label style="font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px;">Wpisz 6-cyfrowy kod z aplikacji bankowej:</label>
              <input type="text" class="alona-input" id="blik-code-input" placeholder="123 456" maxlength="7" style="font-size: 18px; font-weight: 700; letter-spacing: 0.2em; text-align: center; max-width: 220px;">
            </div>

            <button class="alona-btn-primary" id="btn-pay-now" style="width: 100%; padding: 14px; font-size: 15px;">
              Opłać 640,00 PLN teraz bezpiecznie →
            </button>
          </div>
        </div>

        <!-- History of Invoices -->
        <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin: 24px 0 12px 0;">Historia poprzednich wpłat</h4>
        <table class="alona-table">
          <thead>
            <tr>
              <th>Numer faktury</th>
              <th>Miesiąc</th>
              <th>Kwota</th>
              <th>Metoda</th>
              <th>Status</th>
              <th>Potwierdzenie</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>#FV/2026/09/12</strong></td>
              <td>Wrzesień 2026</td>
              <td>640,00 PLN</td>
              <td>BLIK</td>
              <td><span class="alona-badge-success">OPŁACONO</span></td>
              <td><a href="#pdf" style="color: #10B981; font-weight: 600;" onclick="alert('Pobieranie faktury PDF #FV/2026/09/12...'); return false;">PDF ↓</a></td>
            </tr>
            <tr>
              <td><strong>#FV/2026/08/10</strong></td>
              <td>Sierpień 2026</td>
              <td>640,00 PLN</td>
              <td>Karta VISA</td>
              <td><span class="alona-badge-success">OPŁACONO</span></td>
              <td><a href="#pdf" style="color: #10B981; font-weight: 600;" onclick="alert('Pobieranie faktury PDF #FV/2026/08/10...'); return false;">PDF ↓</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div id="parent-billing-success" style="display: none; text-align: center; padding: 32px 12px;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10B981; display: grid; place-items: center; margin: 0 auto 16px; font-size: 32px;">✓</div>
        <h3 style="font-size: 24px; font-weight: 800; margin-bottom: 8px;">Płatność przyjęta! Faktura opłacona.</h3>
        <p style="font-size: 14px; color: #64748B; max-width: 440px; margin: 0 auto 20px; line-height: 1.5;">
          Środki w kwocie 640,00 PLN zostały zaksięgowane na koncie szkoły Alona Polski Centrum. Pakiet 8 lekcji jest w pełni aktywny.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
          <button class="alona-btn-secondary" onclick="alert('Pobieranie oficjalnej faktury PDF #FV/2026/10/14...');">Pobierz fakturę PDF</button>
          <button class="alona-btn-primary" onclick="this.closest('.alona-modal-backdrop').remove()">Zamknij</button>
        </div>
      </div>
    `;

    const modal = showModal(html);

    const payBtn = modal.querySelector('#btn-pay-now');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        payBtn.disabled = true;
        payBtn.innerHTML = 'Autoryzacja w banku...';
        setTimeout(() => {
          modal.querySelector('#parent-billing-view').style.display = 'none';
          modal.querySelector('#parent-billing-success').style.display = 'block';
        }, 900);
      });
    }
  }

  /* ========================================================
     MODAL 3: NAUCZYCIEL — Rejestr wpłat i rozliczenia
     ======================================================== */
  function openTeacherPaymentsModal() {
    const html = `
      <div class="alona-modal-header">
        <div>
          <h2 class="alona-modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
            Rejestr Płatności i Rozliczeń · Panel Lektora
          </h2>
          <p class="alona-modal-sub">Podsumowanie finansowe miesiąca październik/listopad 2026</p>
        </div>
        <button class="alona-modal-close" aria-label="Zamknij">✕</button>
      </div>

      <!-- KPI Grid -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px;">
        <div class="alona-card-box" style="margin: 0; padding: 16px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B;">Przychód w miesiącu</span>
          <div style="font-size: 24px; font-weight: 900; color: #10B981; margin-top: 4px;">14 800 PLN</div>
          <span style="font-size: 11px; color: #64748B;">+18% do września</span>
        </div>
        <div class="alona-card-box" style="margin: 0; padding: 16px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B;">Opłacone pakiety</span>
          <div style="font-size: 24px; font-weight: 900; color: #3B82F6; margin-top: 4px;">22 / 24</div>
          <span style="font-size: 11px; color: #64748B;">92% terminowości</span>
        </div>
        <div class="alona-card-box" style="margin: 0; padding: 16px;">
          <span style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748B;">Oczekujące wpłaty</span>
          <div style="font-size: 24px; font-weight: 900; color: #F59E0B; margin-top: 4px;" id="teacher-pending-sum">1 280 PLN</div>
          <span style="font-size: 11px; color: #64748B;">2 faktury do zaksięgowania</span>
        </div>
      </div>

      <!-- Table of Students -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h4 style="font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; margin: 0;">Lista uczniów i stan czesnego</h4>
        <span class="alona-badge-success">Wszystkie dane zsynchronizowane</span>
      </div>

      <table class="alona-table" id="teacher-table">
        <thead>
          <tr>
            <th>Uczeń i Opiekun</th>
            <th>Pakiet lekcji</th>
            <th>Kwota</th>
            <th>Status</th>
            <th>Akcja</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Maksymilian Kowalski</strong><br><small style="color:#64748B;">Mama: Marta Kowalska</small></td>
            <td>Pakiet 8 lekcji (A1-Junior)</td>
            <td>640,00 PLN</td>
            <td><span class="alona-badge-success">OPŁACONO</span></td>
            <td><span style="font-size: 12px; color: #10B981; font-weight: 600;">✓ Zaksięgowano</span></td>
          </tr>
          <tr>
            <td><strong>Zofia Nowak</strong><br><small style="color:#64748B;">Mama: Anna Nowak</small></td>
            <td>Pakiet 8 lekcji (A1-Junior)</td>
            <td>640,00 PLN</td>
            <td><span class="alona-badge-success">OPŁACONO</span></td>
            <td><span style="font-size: 12px; color: #10B981; font-weight: 600;">✓ Zaksięgowano</span></td>
          </tr>
          <tr id="row-tymofii">
            <td><strong>Tymofii Bondarenko</strong><br><small style="color:#64748B;">Tata: Ołeksij Bondarenko</small></td>
            <td>Pakiet 8 lekcji (Indywidualny)</td>
            <td>640,00 PLN</td>
            <td><span class="alona-badge-amber status-badge">OCZEKUJE</span></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="alona-btn-secondary btn-sms" style="padding: 6px 10px; font-size: 11px;">SMS ✉</button>
                <button class="alona-btn-primary btn-book" style="padding: 6px 10px; font-size: 11px;">Zaksięguj</button>
              </div>
            </td>
          </tr>
          <tr id="row-hanna">
            <td><strong>Hanna Wiśniewska</strong><br><small style="color:#64748B;">Mama: Karolina Wiśniewska</small></td>
            <td>Pakiet 8 lekcji (A2-Prep)</td>
            <td>640,00 PLN</td>
            <td><span class="alona-badge-amber status-badge">OCZEKUJE</span></td>
            <td>
              <div style="display: flex; gap: 6px;">
                <button class="alona-btn-secondary btn-sms" style="padding: 6px 10px; font-size: 11px;">SMS ✉</button>
                <button class="alona-btn-primary btn-book" style="padding: 6px 10px; font-size: 11px;">Zaksięguj</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 24px; display: flex; justify-content: flex-end;">
        <button class="alona-btn-primary" onclick="this.closest('.alona-modal-backdrop').remove()">Zamknij rejestr</button>
      </div>
    `;

    const modal = showModal(html);

    // Wire up SMS and Book buttons
    modal.querySelectorAll('.btn-sms').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.innerHTML = '✓ Wysłano SMS';
        btn.disabled = true;
        btn.style.color = '#10B981';
      });
    });

    modal.querySelectorAll('.btn-book').forEach(btn => {
      btn.addEventListener('click', () => {
        const row = btn.closest('tr');
        const badge = row.querySelector('.status-badge');
        badge.className = 'alona-badge-success';
        badge.textContent = 'OPŁACONO';
        btn.style.display = 'none';
        const smsBtn = row.querySelector('.btn-sms');
        if (smsBtn) smsBtn.style.display = 'none';
        const td = btn.parentElement;
        td.innerHTML = '<span style="font-size: 12px; color: #10B981; font-weight: 600;">✓ Zaksięgowano ręcznie</span>';
      });
    });
  }

  /* ========================================================
     MODAL 4: UCZEŃ — Zadania domowe i ćwiczenia
     ======================================================== */
  function openHomeworkModal() {
    const html = `
      <div class="alona-modal-header">
        <div>
          <h2 class="alona-modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Zadania Domowe · Ćwiczenia z języka polskiego
          </h2>
          <p class="alona-modal-sub">Zadanie 14: Polskie dwuznaki i słownictwo codzienne</p>
        </div>
        <button class="alona-modal-close" aria-label="Zamknij">✕</button>
      </div>

      <div id="hw-form">
        <div class="alona-card-box">
          <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 8px;">Pytanie 1: Które słowo oznacza poranny posiłek?</h4>
          <div class="alona-grid-choice" id="hw-q1">
            <button class="alona-choice-btn" data-correct="false">Obiad</button>
            <button class="alona-choice-btn active" data-correct="true">Śniadanie ✓</button>
            <button class="alona-choice-btn" data-correct="false">Kolacja</button>
          </div>
        </div>

        <div class="alona-card-box">
          <h4 style="font-size: 14px; font-weight: 800; margin-bottom: 8px;">Pytanie 2: Wybierz poprawny dwuznak: "W ogrodzie rośnie piękny k___ak"</h4>
          <div class="alona-grid-choice" id="hw-q2">
            <button class="alona-choice-btn" data-correct="false">rz</button>
            <button class="alona-choice-btn active" data-correct="true">rz (krzak) ✓</button>
            <button class="alona-choice-btn" data-correct="false">sz</button>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
          <button class="alona-btn-secondary" onclick="this.closest('.alona-modal-backdrop').remove()">Zamknij</button>
          <button class="alona-btn-primary" id="btn-submit-hw">Wyślij do sprawdzenia Pani Alonie →</button>
        </div>
      </div>

      <div id="hw-success" style="display: none; text-align: center; padding: 28px 12px;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(16, 185, 129, 0.15); color: #10B981; display: grid; place-items: center; margin: 0 auto 16px; font-size: 26px;">✓</div>
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Zadanie pomyślnie wysłane!</h3>
        <p style="font-size: 14px; color: #64748B; max-width: 400px; margin: 0 auto 20px;">
          Pani Alona sprawdzi Twoje odpowiedzi i zostawi gwiazdki oraz komentarz głosowy.
        </p>
        <button class="alona-btn-primary" onclick="this.closest('.alona-modal-backdrop').remove()">Świetnie!</button>
      </div>
    `;

    const modal = showModal(html);
    const subBtn = modal.querySelector('#btn-submit-hw');
    if (subBtn) {
      subBtn.addEventListener('click', () => {
        modal.querySelector('#hw-form').style.display = 'none';
        modal.querySelector('#hw-success').style.display = 'block';
      });
    }
  }

  /* ========================================================
     MODAL 5: WIRTUALNA SALA LEKCYJNA (LIVE CLASSROOM)
     ======================================================== */
  function openLiveClassroomModal() {
    const html = `
      <div class="alona-modal-header">
        <div>
          <h2 class="alona-modal-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect width="14" height="12" x="1" y="6" rx="2" ry="2"/></svg>
            Wirtualna Sala Lekcyjna · Alona Live
          </h2>
          <p class="alona-modal-sub">Podgląd pokoju spotkania i test urządzeń audio/video</p>
        </div>
        <button class="alona-modal-close" aria-label="Zamknij">✕</button>
      </div>

      <div class="alona-card-box" style="background: #0F172A; color: #F8FAFC; text-align: center; padding: 40px 20px; border-radius: 16px;">
        <div style="width: 80px; height: 80px; border-radius: 50%; background: #1E293B; border: 2px solid #10B981; display: grid; place-items: center; margin: 0 auto 16px;">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
        </div>
        <h3 style="font-size: 20px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">Lekcja 10: Moja rodzina i przyjaciele</h3>
        <p style="font-size: 13px; color: #94A3B8; margin-bottom: 20px;">Lektorka: Pani Alona · Kamera i mikrofon: Aktywne</p>

        <div style="display: flex; gap: 12px; justify-content: center; margin-bottom: 24px;">
          <button class="alona-choice-btn" style="background: #1E293B; color: #FFF; border-color: #334155; padding: 8px 16px;">🎤 Mikrofon: Włączony</button>
          <button class="alona-choice-btn" style="background: #1E293B; color: #FFF; border-color: #334155; padding: 8px 16px;">📹 Kamera: Gotowa</button>
        </div>

        <button class="alona-btn-primary" style="font-size: 15px; padding: 14px 28px;" onclick="alert('Dołączanie do pokoju lekcyjnego z Panią Aloną...'); this.closest('.alona-modal-backdrop').remove();">
          Wejdź do sali lekcyjnej teraz →
        </button>
      </div>
    `;

    showModal(html);
  }

  /* ========================================================
     CAPTURE-PHASE CLICK INTERCEPTOR
     ======================================================== */
  window.addEventListener('click', (e) => {
    const el = e.target.closest('button, a, .diary-stat, .diary-home-task, .diary-slot-row, [role="button"]');
    if (!el) return;

    // Never intercept the demo role switcher itself!
    if (el.closest('.demo-role-floating-bar') || el.closest('.demo-role-switcher')) {
      return;
    }

    const text = (el.innerText || el.textContent || '').trim().toLowerCase();

    // 1. Booking & Availability
    if (text.includes('zapisz się na termin') || text.includes('dostępne godziny') || text.includes('zapisz się')) {
      setTimeout(() => openBookingModal(), 40);
      return;
    }

    // 2. Billing & Payments (Parent & Teacher)
    if (text.includes('opłać') || text.includes('faktur') || text.includes('czesne i rachunki') || text.includes('historia wpłat') || text.includes('wpłaty i rozliczenia') || text.includes('status czesnego')) {
      const isTeacherView = document.body.innerHTML.includes('Pulpit lektora') || (document.body.innerHTML.includes('Nawigacja (Lektor)') && !document.body.innerHTML.includes('Dziennik Rodzica'));
      setTimeout(() => {
        if (text.includes('wpłaty i rozliczenia') || text.includes('rozliczeni') || isTeacherView) {
          openTeacherPaymentsModal();
        } else {
          openParentBillingModal();
        }
      }, 40);
      return;
    }

    // 3. Homework interactive preview when clicking home task cards
    if (el.classList.contains('diary-home-task')) {
      e.preventDefault();
      e.stopPropagation();
      openHomeworkModal();
      return;
    }

    // 4. Live Video Classroom
    if (text.includes('подключиться') || text.includes('podgląd pokoju') || text.includes('wirtualn')) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      openLiveClassroomModal();
      return;
    }
  }, true);

  console.log('[AlonaDemoController] Interactive Demo Modal Suite loaded successfully.');
})();
