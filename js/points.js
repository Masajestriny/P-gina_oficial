// ============================================================
//  TRINY MASAJES — Loyalty Program: Puntos TrinyBienestar
// ============================================================

(function() {
  const STORAGE_KEY = 'triny_points_balance';

  window.TrinyPoints = {
    getBalance: function() {
      return parseInt(localStorage.getItem(STORAGE_KEY) || '120'); // Initial welcome bonus 120 pts
    },

    addPoints: function(pts, reason = 'Reserva de servicio') {
      const current = this.getBalance();
      const next = current + pts;
      localStorage.setItem(STORAGE_KEY, next.toString());
      this.updateUI();
      showToast(`¡+${pts} Puntos TrinyBienestar! 🎉`, `Ganaste puntos por: ${reason}. Saldo actual: ${next} pts.`, 'success');
      return next;
    },

    redeemReward: function(pts, rewardName) {
      const current = this.getBalance();
      if (current < pts) {
        showToast('Puntos Insuficientes', `Necesitas ${pts} Puntos TrinyBienestar para este beneficio. Tienes ${current} pts.`, 'warning');
        return false;
      }
      const next = current - pts;
      localStorage.setItem(STORAGE_KEY, next.toString());
      this.updateUI();
      showToast('¡Premio Canjeado! 🎁', `Has canjeado "${rewardName}". Presenta este cupón en tu próxima visita.`, 'success', 6000);
      return true;
    },

    updateUI: function() {
      const balance = this.getBalance();
      document.querySelectorAll('.points-balance-num').forEach(el => {
        el.textContent = balance.toLocaleString('es-PE');
      });
    }
  };

  window.openPointsModal = function() {
    const modal = document.getElementById('pointsModal');
    if (!modal) return;
    window.TrinyPoints.updateUI();
    modal.removeAttribute('hidden');
    document.body.classList.add('no-scroll');
  };

  document.addEventListener('DOMContentLoaded', () => {
    window.TrinyPoints.updateUI();
  });

  console.log('[Triny Masajes] Puntos TrinyBienestar module loaded ✓');
})();
