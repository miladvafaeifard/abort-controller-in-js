const url = 'airforce.mp4';

const videoWrapper = document.querySelector('.videoWrapper');
const downloadBtn = document.querySelector('.download');
const abortBtn = document.querySelector('.abort');
const reports = document.querySelector('.reports');

let controller;
let progressAnimation;
let animationCount = 0;

function abortDownload() {
  controller.abort();
  console.log('Download aborted');
  downloadBtn.classList.remove('hidden');
}

async function fetchVideo() {
  controller = new AbortController();
  const signal = controller.signal;
  downloadBtn.classList.add('hidden');
  abortBtn.classList.remove('hidden');
  reports.textContent = 'Video awaiting download...';
  try {
    const response = await fetch(url, { signal });
    if (response.status === 200) {
      const videoBlob = await simulateDelay(response, signal);
      appendVideo(videoBlob);
      abortBtn.classList.add('hidden');
      downloadBtn.classList.add('hidden');
      reports.textContent = 'Video ready to play';
      removeAbortSignal(signal);
    } else {
      throw new Error('Failed to fetch');
    }
  } catch (e) {
    removeAbortSignal(signal);
    abortBtn.classList.add('hidden');
    downloadBtn.classList.remove('hidden');
    reports.textContent = 'Download error: ' + e.message;
  } finally {
    removeAbortSignal(signal);
    clearInterval(progressAnimation);
    animationCount = 0;
  }
}

function runAnimation() {
  progressAnimation = setInterval(() => {
    switch (animationCount++ & 3) {
      case 0:
        reports.textContent = 'Downloading.';
        break;
      case 1:
        reports.textContent = 'Downloading..';
        break;
      case 2:
        reports.textContent = 'Downloading...';
        break;
      case 3:
        reports.textContent = 'Downloading....';
        break;
    }
  }, 300);
}

function simulateDelay(response, signal) {
  let timeout;
  return new Promise((resolve, reject) => {
    runAnimation();
    if (!signal.aborted) {
      signal?.addEventListener(
        'abort',
        () => {
          clearInterval(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        }
      );
    }
    timeout = setTimeout(() => resolve(response.blob()), 2000);
  });
}

function removeAbortSignal(signal) {
  signal.aborted || signal?.removeEventListener('abort', () => {});
}

function appendVideo(videoBlob) {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  video.src = URL.createObjectURL(videoBlob);
  videoWrapper.appendChild(video);
  videoWrapper.classList.remove('hidden');
}