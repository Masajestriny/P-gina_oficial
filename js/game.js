// ============================================================
//  TRINY MASAJES — Prize Wheel Game Module
// ============================================================

(function() {
  const prizes = window.WHEEL_PRIZES || [];
  let isSpinning  = false;
  let currentAngle = 0;
  let wonPrize = null;

  // ── Canvas Setup ──
  function initWheel() {
    const canvas = document.getElementById('wheelCanvas');
    if (!canvas) return;
    drawWheel(canvas, currentAngle);
    renderPrizesList();
  }

  function drawWheel(canvas, rotation) {
    const ctx = canvas.getContext('2d');
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const R  = cx - 8;
    const arc = (2 * Math.PI) / prizes.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Outer glow ring
    const glowGrad = ctx.createRadialGradient(cx, cy, R * 0.85, cx, cy, R + 8);
    glowGrad.addColorStop(0, 'rgba(255,107,0,0.8)');
    glowGrad.addColorStop(1, 'rgba(255,107,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, R + 8, 0, 2 * Math.PI);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    prizes.forEach((prize, i) => {
      const start = rotation + arc * i;
      const end   = start + arc;

      // Slice
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, R, start, end);
      ctx.closePath();
      ctx.fillStyle = prize.bg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(start + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = 'white';
      ctx.font = `bold ${canvas.width < 300 ? 10 : 13}px Inter, sans-serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      // Truncate long labels
      const label = prize.label.length > 16 ? prize.label.slice(0, 15) + '…' : prize.label;
      ctx.fillText(label, R - 16, 5);
      ctx.restore();
    });

    // Center circle
    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 36);
    cGrad.addColorStop(0, '#FFFFFF');
    cGrad.addColorStop(1, '#F0F0F0');
    ctx.beginPath();
    ctx.arc(cx, cy, 36, 0, 2 * Math.PI);
    ctx.fillStyle = cGrad;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // Center logo text
    ctx.fillStyle = '#FF6B00';
    ctx.font = `bold ${canvas.width < 300 ? 9 : 11}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('TRINY', cx, cy - 4);
    ctx.fillText('MASAJES', cx, cy + 10);
  }

  // ── Spin ──
  window.spinWheel = function() {
    if (isSpinning) return;
    const canvas = document.getElementById('wheelCanvas');
    const spinBtn = document.getElementById('spinBtn');
    if (!canvas || !spinBtn) return;

    isSpinning = true;
    spinBtn.disabled = true;

    const arc    = (2 * Math.PI) / prizes.length;
    const spins  = (Math.floor(Math.random() * 5) + 5) * 2 * Math.PI; // 5-10 full spins
    const offset = Math.random() * 2 * Math.PI;
    const target = currentAngle + spins + offset;

    // Determine winner (which slice is at top = 270° = -π/2)
    const normalized = ((2 * Math.PI) - ((target % (2 * Math.PI)) + (Math.PI / 2))) % (2 * Math.PI);
    const prizeIndex = Math.floor(normalized / arc) % prizes.length;
    wonPrize = prizes[prizeIndex];

    // Animation
    const start = performance.now();
    const duration = 5000 + Math.random() * 2000;

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 4);
    }

    function animate(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      currentAngle   = currentAngle + (target - currentAngle) * easeOut(progress);
      drawWheel(canvas, currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentAngle = target;
        isSpinning = false;
        showWheelResult();
      }
    }

    requestAnimationFrame(animate);
  };

  function showWheelResult() {
    const resultEl = document.getElementById('wheelResult');
    const prizeEl  = document.getElementById('resultPrize');
    if (resultEl && prizeEl) {
      prizeEl.textContent = `🎉 ¡Ganaste: ${wonPrize.label}!`;
      resultEl.removeAttribute('hidden');
    }
    // Auto-advance to form after 1.5s
    setTimeout(() => showGamePhase(2), 1800);
  }

  function showGamePhase(phase) {
    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById(`gamePhase${i}`);
      if (el) el.hidden = i !== phase;
    }
    if (phase === 2) {
      const banner = document.getElementById('prizeBanner');
      if (banner) banner.textContent = `🎉 ¡Felicitaciones! Ganaste: ${wonPrize.label}`;
    }
  }

  // ── Form Submit ──
  window.submitGameForm = function(e) {
    e.preventDefault();
    const name  = document.getElementById('gameName')?.value?.trim();
    const phone = document.getElementById('gamePhone')?.value?.trim();
    const email = document.getElementById('gameEmail')?.value?.trim();

    if (!name || !phone || !email) {
      showToast('Campos requeridos', 'Por favor completa todos los campos.', 'warning');
      return;
    }

    // Register in CRM
    if (window.CRM_addClient) {
      window.CRM_addClient({
        name, phone, email,
        prize:  wonPrize?.label || '',
        service: 'Premio Ruleta',
        notes:  `Premio ganado en ruleta: ${wonPrize?.label}. Fecha: ${new Date().toLocaleDateString('es-PE')}`
      });
    }

    // Show success
    const successText = document.getElementById('successPrizeText');
    if (successText) successText.textContent = `Tu premio: ${wonPrize?.label}`;
    showGamePhase(3);
    showToast('¡Premio registrado!', `${name}, tu premio "${wonPrize?.label}" fue guardado.`, 'success');
  };

  window.resetGame = function() {
    wonPrize = null;
    const spinBtn = document.getElementById('spinBtn');
    const resultEl = document.getElementById('wheelResult');
    if (spinBtn) spinBtn.disabled = false;
    if (resultEl) resultEl.hidden = true;
    const form = document.getElementById('gameForm');
    if (form) form.reset();
    showGamePhase(1);
    const canvas = document.getElementById('wheelCanvas');
    if (canvas) drawWheel(canvas, currentAngle);
  };

  // ── Prizes List ──
  function renderPrizesList() {
    const list = document.getElementById('prizesList');
    if (!list) return;
    list.innerHTML = prizes.map(p => `
      <li class="prize-item" role="listitem">
        <div class="prize-dot" style="background:${p.bg}"></div>
        <span class="prize-name">${p.label}</span>
        <span class="prize-prob">${p.prob}</span>
      </li>
    `).join('');
  }

  // ── Init ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWheel);
  } else {
    initWheel();
  }

  console.log('[Triny Masajes] Game module loaded ✓');
})();
