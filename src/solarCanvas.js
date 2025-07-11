import {gsap} from 'gsap';
import { ScrollTrigger}  from 'gsap/all';

gsap.registerPlugin(ScrollTrigger)





const audioUrl = 'assets/universe-cosmic-space-ambient-interstellar-soundscape-sci-fi-181916.mp3';

const AudioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioBuffer;
let sourceNode;
//adding landing page :)
const landing = document.createElement('div');
landing.id = 'landing-page';
landing.innerHTML = `
  <div class="landing-content">
    <h1>Welcome to the Solar System</h1>
    <p>For best experience, increase brightness and volume</p>
    <p>Best viewed on desktop</p>
    <button id="enter-btn">Enter</button>
  </div>
`;
document.body.appendChild(  landing);
// 👕 Landing Page Style
const style = document.createElement('style');
style.textContent = `
  #landing-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: black;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
    #landing-page h1{
    font-size: 2.5em;
    margin-bottom: 20px;
    }
    #landing-page p{
    font-size:1.2em;
    margin-bottom: 20px;}
  .landing-content {
    text-align: center;
  }
  #enter-btn {
    margin-top: 2rem;
    padding: 12px 32px;
    font-size: 1.1rem;
    color: black;
    background-color: linear-gradient(135deg , #00c6ff , #0072ff)
    border: none;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 6px rgba(0 , 0 , 0 , 0.1);
    border-radius: 50px;
    cursor: pointer;
  }
    .enter-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 183, 255, 0.6);
  }

  .enter-btn:active {
    transform: scale(0.98);
  }
`;
document.head.appendChild(style);

async function LoadAudio(){
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await AudioContext.decodeAudioData(arrayBuffer);
}
function playAudio() {
  if (sourceNode) {
    sourceNode.stop();
  }
  sourceNode = AudioContext.createBufferSource();
  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;

  // Connect to output (speakers)
  sourceNode.connect(AudioContext.destination);

  sourceNode.start();
}

// Start loading audio immediately
LoadAudio().then(() => {
  // Try to play audio immediately (will throw error if no user gesture)
  AudioContext.resume().then(() => {
    try {
      playAudio();
      console.log('Audio started');
    } catch (e) {
      console.log('Autoplay prevented, waiting for user gesture');
    }
  });
});

// If autoplay blocked, play on first user interaction
window.addEventListener('click', () => {
  if (AudioContext.state === 'suspended') {
    AudioContext.resume().then(() => {
      playAudio();
      console.log('Audio started after user interaction');
    });
  }
}, { once: true });

document.addEventListener('DOMContentLoaded', async () => {
  await LoadAudio();

  document.getElementById('enter-btn').addEventListener('click', () => {
    landing.remove();  // Hide landing
    audioCtx.resume().then(() => {
      playAudio();     // Start music
    });
  });
});
