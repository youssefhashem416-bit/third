/**
 * معًا - عالم بلا حواجز | Centralized Arabic Speech Synthesis Engine
 * Provides Arabic text-to-speech, visual wave indicators, and voice selection.
 */

const SpeechEngine = {
  arabicVoice: null,
  rate: 0.85,
  pitch: 1.0,
  volume: 1.0,
  isSpeaking: false,
  statusElements: [],

  init() {
    if (!('speechSynthesis' in window)) {
      this.updateStatus('المتصفح الحالي لا يدعم القراءة الصوتية.');
      return;
    }
    this.loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  },

  loadVoices() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    const arabicVoices = voices.filter(v => v.lang.toLowerCase().startsWith('ar'));

    if (arabicVoices.length > 0) {
      this.arabicVoice =
        arabicVoices.find(v => v.lang.toLowerCase() === 'ar-eg') ||
        arabicVoices.find(v => v.lang.toLowerCase().includes('ar-sa')) ||
        arabicVoices[0];

      this.updateStatus(`الصوت المعتمد: ${this.arabicVoice.name}`);
    } else {
      this.updateStatus('لم يتم العثور على صوت عربي مخصص، سيتم استخدام الصوت التلقائي.');
    }
  },

  speak(text, callback = null) {
    if (!('speechSynthesis' in window)) {
      AppCore.notify('تنبيه', 'المتصفح لا يدعم ميزة قراءة النصوص صوتيًا.', 'warning');
      return;
    }

    if (!text || !text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = this.arabicVoice ? this.arabicVoice.lang : 'ar-EG';
    if (this.arabicVoice) {
      utterance.voice = this.arabicVoice;
    }
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;
    utterance.volume = this.volume;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.toggleVisualIndicator(true);
      this.updateStatus(`🔊 جاري القراءة: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`);
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.toggleVisualIndicator(false);
      this.updateStatus(this.arabicVoice ? `الصوت المستخدم: ${this.arabicVoice.name}` : 'اكتملت القراءة بنجاح.');
      if (typeof callback === 'function') callback();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.toggleVisualIndicator(false);
      if (e.error !== 'canceled') {
        this.updateStatus('حدث خطأ أثناء تشغيل الصوت.');
      }
    };

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.toggleVisualIndicator(false);
    this.updateStatus('تم إيقاف القراءة الصوتية.');
    AppCore.playSound('click');
  },

  setRate(value) {
    this.rate = parseFloat(value);
    const rateDisplays = document.querySelectorAll('#rateValue, #speedValue, .rate-display');
    rateDisplays.forEach(el => {
      el.textContent = this.rate.toFixed(2);
    });
  },

  toggleVisualIndicator(active) {
    const indicators = document.querySelectorAll('.speaking-indicator');
    indicators.forEach(ind => {
      if (active) ind.classList.add('active');
      else ind.classList.remove('active');
    });
  },

  updateStatus(msg) {
    const targets = document.querySelectorAll('#voiceStatus, #speechStatus, #status, .voice-status-text');
    targets.forEach(el => {
      el.textContent = msg;
    });
  },

  testVoice(customMsg) {
    const msg = customMsg || 'مرحبًا بك في منصة معًا. القراءة الصوتية تعمل بكفاءة ووضوح.';
    this.speak(msg);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  SpeechEngine.init();
});

