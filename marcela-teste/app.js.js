
let stream;
let facing = 'user';
let photos = [];

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const molduraImg = new Image();
molduraImg.src = 'moldura.png';

async function startCamera() {
  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: facing, width: { ideal: 1080 }, height: { ideal: 1920 } },
    audio: false
  });
  video.srcObject = stream;
}

document.getElementById('btnIniciar').onclick = async () => {
  document.getElementById('capa').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  await startCamera();
};

document.getElementById('btnTrocar').onclick = async () => {
  facing = facing === 'user' ? 'environment' : 'user';
  await startCamera();
};

function countdown(cb) {
  const c = document.getElementById('contador');
  let n = 3;
  c.style.display = 'flex';
  c.innerText = n;
  const i = setInterval(() => {
    n--;
    if (n === 0) {
      clearInterval(i);
      c.style.display = 'none';
      cb();
    } else c.innerText = n;
  }, 1000);
}

document.getElementById('btnFoto').onclick = () => {
  countdown(capturePhoto);
};

document.getElementById('btnTirinha').onclick = () => {
  photos = [];
  const take = () => {
    countdown(() => {
      capturePhoto(true);
      if (photos.length < 3) setTimeout(take, 800);
      else renderStrip();
    });
  };
  take();
};

function capturePhoto(storeOnly=false) {
  canvas.width = 1080;
  canvas.height = 1920;
  ctx.drawImage(video, 0, 0, 1080, 1920);
  ctx.drawImage(molduraImg, 0, 0, 1080, 1920);
  if (storeOnly) {
    photos.push(canvas.toDataURL('image/png'));
  } else {
    download(canvas.toDataURL('image/png'));
  }
}

function renderStrip() {
  canvas.width = 1080;
  canvas.height = 1920;
  photos.forEach((src, i) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.drawImage(img, 0, i * 640, 1080, 640);
      if (i === 2) {
        document.getElementById('btnDownload').onclick = () =>
          download(canvas.toDataURL('image/png'));
        document.getElementById('acoesFinal').style.display = 'flex';
      }
    };
  });
}

function download(data) {
  const a = document.createElement('a');
  a.href = data;
  a.download = 'foto.png';
  a.click();
}
