/**
 * معًا - عالم بلا حواجز | Autism Spectrum Activities
 */

const AutismActivities = {
  selectedMessage: '',
  selectedEmotion: '',

  init() {
    this.bindScheduleItems();
  },

  showTab(tabId, button) {
    document.querySelectorAll('.activity-box').forEach(box => {
      box.classList.remove('active');
    });

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    const activeBox = document.getElementById(tabId);
    if (activeBox) {
      activeBox.classList.add('active');
    }

    if (button) {
      button.classList.add('active');
    }

    SpeechEngine.stop();
    AppCore.playSound('click');
  },

  selectMessage(element, message) {
    this.selectedMessage = message;

    // Visual selection
    document.querySelectorAll('#communication .interactive-card').forEach(card => {
      card.classList.remove('selected');
    });
    if (element) {
      element.classList.add('selected');
    }

    const resultBox = document.getElementById('messageResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <span><i class="fa-solid fa-volume-high" style="color:var(--primary); margin-left:8px;"></i> الرسالة المختارة: <strong>${message}</strong></span>
        <button class="btn btn-sm btn-outline" onclick="SpeechEngine.speak('${message}')">إعادة الاستماع</button>
      `;
    }

    AppCore.playSound('pop');
    SpeechEngine.speak(message);
  },

  selectEmotion(element, emotion, descriptiveText) {
    this.selectedEmotion = emotion;

    document.querySelectorAll('#emotions .interactive-card').forEach(card => {
      card.classList.remove('selected');
    });
    if (element) {
      element.classList.add('selected');
    }

    const fullMessage = descriptiveText || `أنا أشعر أنني ${emotion}`;

    const resultBox = document.getElementById('emotionResult');
    if (resultBox) {
      resultBox.innerHTML = `
        <span><i class="fa-solid fa-face-smile" style="color:var(--primary); margin-left:8px;"></i> الشعور المختار: <strong>${emotion}</strong></span>
        <button class="btn btn-sm btn-outline" onclick="SpeechEngine.speak('${fullMessage}')">إعادة الاستماع</button>
      `;
    }

    AppCore.playSound('pop');
    SpeechEngine.speak(fullMessage);
  },

  bindScheduleItems() {
    document.querySelectorAll('.schedule-item').forEach(item => {
      item.addEventListener('click', () => {
        const isDone = item.classList.toggle('completed');
        if (isDone) {
          AppCore.playSound('success');
          const title = item.querySelector('.schedule-text')?.textContent || '';
          SpeechEngine.speak(`أحسنت! تم إنجاز: ${title}`);
        } else {
          AppCore.playSound('click');
        }
      });
    });
  },

  resetSchedule() {
    document.querySelectorAll('.schedule-item').forEach(item => {
      item.classList.remove('completed');
    });
    AppCore.playSound('pop');
    AppCore.notify('تمت إعادة الضبط', 'تمت إعادة تعيين جدول المهام اليومي بنجاح.', 'success');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  AutismActivities.init();
});

