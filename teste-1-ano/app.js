// MEMORIAS DE UM DIA ESPECIAL - APP.JS FINAL

let stream;
let facingMode = "user";
let mediaRecorder;
let recordedChunks = [];

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const btnIniciar = document.getElementById("btnIniciar");
const btnFoto = document.getElementById("btnFoto");
const btnTirinha = document.getElementById("btnTirinha");
const btnVideo = document.getElementById("btnVideo");
const btnTrocar = document.getElementById("btnTrocarCamera");
const btnBaixar = document.getElementById("btnBaixar");
const btnWhats = document.getElementById("btnWhats");
const btnDrive = document.getElementById("btnDrive");
const contador = document.getElementById("contador");
const finalBox = document.getElementById("final");

btnIniciar.onclick = iniciarCamera;
btnTrocar.onclick = trocarCamera;
btnFoto.onclick = () => capturarFoto(1);
btnTirinha.onclick = () => capturarFoto(3);
btnVideo.onclick = gravarVideo;

async function iniciarCamera() {
  document.getElementById("capa").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
    audio: true
  });

  video.srcObject = stream;
}

function trocarCamera() {
  facingMode = facingMode === "user" ? "environment" : "user";
  if (stream) stream.getTracks().forEach(t => t.stop());
  iniciarCamera();
}

async function contagem() {
  contador.classList.remove("hidden");
  for (let i = 3; i > 0; i--) {
    contador.innerText = i;
    await new Promise(r => setTimeout(r, 1000));
  }
  contador.classList.add("hidden");
}

async function capturarFoto(qtd) {
  canvas.width = 1080;
  canvas.height = 1920;

  let imagens = [];

  for (let i = 0; i < qtd; i++) {
    await contagem();
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    imagens.push(canvas.toDataURL("image/png"));
  }

  if (qtd === 3) {
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 1080;
    finalCanvas.height = 1920;
    const fctx = finalCanvas.getContext("2d");

    for (let i = 0; i < 3; i++) {
      const img = new Image();
      img.src = imagens[i];
      await img.decode();
      fctx.drawImage(img, 0, i * 640, 1080, 640);
    }

    canvas.width = 1080;
    canvas.height = 1920;
    ctx.drawImage(finalCanvas, 0, 0);
  }

  exibirFinal(canvas.toDataURL("image/png"), "image/png");
}

function gravarVideo() {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

  mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);

  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    exibirFinal(url, "video/webm");
  };

  contagem().then(() => mediaRecorder.start());
  setTimeout(() => mediaRecorder.stop(), 10000);
}

function exibirFinal(url, tipo) {
  finalBox.classList.remove("hidden");

  btnBaixar.onclick = () => {
    const a = document.createElement("a");
    a.href = url;
    a.download = tipo.includes("video") ? "memoria.webm" : "memoria.png";
    a.click();
  };

  btnWhats.onclick = () => {
    const msg = encodeURIComponent("Aqui está uma lembrança especial do evento ❤️");
    window.open(`https://wa.me/?text=${msg}`);
  };

  btnDrive.onclick = () => {
    window.open("https://docs.google.com/forms");
  };
}
