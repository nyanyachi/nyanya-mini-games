(function () {
  const storageKey = "nyanyaSoundEnabled";
  let audioContext = null;
  let enabled = localStorage.getItem(storageKey) === "true";

  function getAudioContext() {
    if (!audioContext) {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextConstructor) {
        return null;
      }

      audioContext = new AudioContextConstructor();
    }

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    return audioContext;
  }

  function playTone(frequency, duration, type, volume) {
    if (!enabled) {
      return;
    }

    const context = getAudioContext();

    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  function playPair(firstFrequency, secondFrequency) {
    playTone(firstFrequency, 0.06, "sine", 0.035);
    setTimeout(function () {
      playTone(secondFrequency, 0.07, "sine", 0.03);
    }, 55);
  }

  function updateToggle(toggle) {
    toggle.textContent = enabled ? "Sound On" : "Sound Off";
    toggle.setAttribute("aria-pressed", String(enabled));
  }

  function initToggle() {
    const toggles = document.querySelectorAll("[data-sound-toggle]");

    toggles.forEach(function (toggle) {
      updateToggle(toggle);

      toggle.addEventListener("click", function () {
        enabled = !enabled;
        localStorage.setItem(storageKey, String(enabled));
        updateToggle(toggle);

        if (enabled) {
          playTone(660, 0.06, "sine", 0.025);
        }
      });
    });
  }

  window.NyanyaSound = {
    click: function () {
      playTone(520, 0.045, "sine", 0.025);
    },
    success: function () {
      playPair(620, 880);
    },
    error: function () {
      playPair(220, 160);
    },
    flip: function () {
      playTone(420, 0.08, "triangle", 0.03);
    },
    roll: function () {
      playTone(150, 0.08, "square", 0.018);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }
})();
