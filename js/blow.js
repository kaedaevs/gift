// Select all flame elements, including those inside .vela-eight
const allFlames = document.querySelectorAll('.fuego');

// Function to turn off flames (simulate blow out)
function blowOutFlames() {
  allFlames.forEach(flame => {
    flame.classList.add('fade-out');
  });
}

// Function to restore flames
function relightFlames() {
  allFlames.forEach(flame => {
    flame.classList.remove('fade-out');
  });
}

// Setup audio input to detect blowing
async function setupBlowDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    source.connect(analyser);
    analyser.fftSize = 512;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);

      // Calculate average volume of frequencies
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;

      // Threshold for blowing sound (adjust if needed)
      if (average > 50) {
        blowOutFlames();
      } else {
        relightFlames();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();

  } catch (err) {
    console.error('Microphone access denied or error:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setupBlowDetection();

  const music = new Audio('your-music-file.mp3');
  music.loop = true;

  // Try to play the music
  music.play().catch(() => {
    // Autoplay might be blocked, so wait for user interaction to play
    const playMusicOnInteraction = () => {
      music.play();
      window.removeEventListener('click', playMusicOnInteraction);
      window.removeEventListener('keydown', playMusicOnInteraction);
    };
    window.addEventListener('click', playMusicOnInteraction);
    window.addEventListener('keydown', playMusicOnInteraction);
  });
});

