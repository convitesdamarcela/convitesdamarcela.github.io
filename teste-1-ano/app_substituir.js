
// Memórias de um Dia Especial - app.js FINAL
let video = document.getElementById('video');
let btnIniciar = document.getElementById('btnIniciar');
let btnTrocar = document.getElementById('btnTrocarCamera');
let btnFoto = document.getElementById('btnFoto');
let btnTirinha = document.getElementById('btnTirinha');
let btnVideo = document.getElementById('btnVideo');
let contador = document.getElementById('contador');
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let finalBox = document.getElementById('final');
let btnBaixar = document.getElementById('btnBaixar');
let btnWhats = document.getElementById('btnWhats');
let btnDrive = document.getElementById('btnDrive');

let stream = null;
let facing = 'user';
let fotosTirinha = [];
let molduraImg = new Image();
molduraImg.src = 'moldura.png';

const W = 1080;
const H = 1920;

async function iniciarCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      width: { ideal: 1920 },
      height: { ideal: 1080 },
      facingMode: facing
    },
    audio: false
  });
  video.srcObject = stream;
}

btnIniciar.onclick = async () => {
  document.getElementById('capa').style.display = 'none';
  document.getElementById('app').classList.remove('hidden');
  await iniciarCamera();
};

btnTrocar.onclick = async () => {
  facing = facing === 'user' ? 'environment' : 'user';
  await iniciarCamera();
};

function esperar(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function contagem() {
  contador.classList.remove('hidden');
  for (let i = 3; i >= 1; i--) {
    contador.innerText = i;
    await esperar(700);
  }
  contador.classList.add('hidden');
}

function capturarFoto() {
  canvas.width = W;
  canvas.height = H;

  ctx.drawImage(video, 0, 0, W, H);
  ctx.drawImage(molduraImg, 0, 0, W, H);

  return canvas.toDataURL('image/png');
}

btnFoto.onclick = async () => {
  await contagem();
  let img = capturarFoto();
  mostrarFinal(img);
};

btnTirinha.onclick = async () => {
  fotosTirinha = [];
  for (let i = 0; i < 3; i++) {
    await contagem();
    fotosTirinha.push(capturarFoto());
    await esperar(500);
  }
  gerarTirinha();
};

function gerarTirinha() {
  let tirinhaCanvas = document.createElement('canvas');
  tirinhaCanvas.width = W;
  tirinhaCanvas.height = H * 3;
  let tctx = tirinhaCanvas.getContext('2d');

  fotosTirinha.forEach((src, i) => {
    let img = new Image();
    img.src = src;
    img.onload = () => {
      tctx.drawImage(img, 0, H * i, W, H);
      if (i === 2) {
        mostrarFinal(tirinhaCanvas.toDataURL('image/png'), true);
      }
    };
  });
}

function mostrarFinal(imgData, tirinha=false) {
  finalBox.classList.remove('hidden');

  btnBaixar.onclick = () => {
    let a = document.createElement('a');
    a.href = imgData;
    a.download = tirinha ? 'tirinha.png' : 'foto.png';
    a.click();
  };

  btnWhats.onclick = () => {
    let msg = encodeURIComponent('Aqui está minha lembrança do evento ❤️');
    window.open('https://wa.me/?text=' + msg, '_blank');
  };

  btnDrive.onclick = () => {
    alert('Envio via Google Drive deve ser feito pelo link do formulário.');
  };
}
