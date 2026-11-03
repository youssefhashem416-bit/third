/**
 * معًا - عالم بلا حواجز | Core Framework & Sound Engine
 * Provides UI enhancements, Web Audio synthesizer, and celebration effects.
 */

const AppCore = {
  // Web Audio Context for zero-dependency sound synthesis
  audioCtx: null,
  soundEnabled: true,

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  /**
   * Play generated sound effects
   * @param {'click' | 'success' | 'celebrate' | 'pop' | 'error'} type 
   */
  playSound(type = 'click') {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'pop') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'success') {
        // Melodic major third chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'celebrate') {
        // Joyful fanfare
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'triangle';
          o.connect(g);
          g.connect(ctx.destination);
          const t = now + idx * 0.1;
          o.frequency.setValueAtTime(freq, t);
          g.gain.setValueAtTime(0.2, t);
          g.gain.linearRampToValueAtTime(0.01, t + 0.25);
          o.start(t);
          o.stop(t + 0.25);
        });
      } else if (type === 'error') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(150, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (err) {
      console.warn("Audio play issue:", err);
    }
  },

  /**
   * Trigger celebration confetti
   */
  celebrate() {
    this.playSound('celebrate');
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  },

  /**
   * Accessible SweetAlert2 Notification
   */
  notify(title, text = '', icon = 'info') {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: 'حسنًا',
        confirmButtonColor: '#3b66f5',
        customClass: {
          popup: 'accessible-swal'
        }
      });
    } else {
      alert(`${title}\n${text}`);
    }
  },

  /**
   * Initialize reading guide ruler
   */
  initReadingRuler() {
    let ruler = document.getElementById('readingRuler');
    if (!ruler) {
      ruler = document.createElement('div');
      ruler.id = 'readingRuler';
      document.body.appendChild(ruler);
    }
    window.addEventListener('mousemove', (e) => {
      if (document.body.classList.contains('ruler-active')) {
        ruler.style.top = `${e.clientY - 19}px`;
      }
    });
  },

  /**
   * Set active page in navigation
   */
  highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  AppCore.initReadingRuler();
  AppCore.highlightActiveNav();

  // Attach sound to interactive buttons
  document.querySelectorAll('button:not([data-no-sound]), .btn:not([data-no-sound])').forEach(btn => {
    btn.addEventListener('click', () => {
      AppCore.playSound('click');
    });
  });
});

