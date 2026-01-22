
// APP.JS – Correções finais: moldura no download, tirinha sem achatamento,
// fotos separadas, UI hooks para botões premium

let stream;
let currentFacing = "user";
let capturedPhotos = [];
let lastBlob = null;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const btnFoto = document.getElementById("btnFoto");
const btnTirinha = document.getElementById("btnTirinha");
const btnVideo = document.getElementById("btnVideo");
const btnBaixar = document.getElementById("btnBaixar");
const btnWhats = document.getElementById("btnWhats");
const btnDrive = document.getElementById("btnDrive");

const molduraImg = new Image();
molduraImg.src = "moldura.png";

async function startCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: currentFacing,
      width: { ideal: 1080 },
      height: { ideal: 1920 }
    },
    audio: false
  });
  video.srcObject = stream;
}

document.getElementById("btnTrocarCamera").onclick = () => {
  currentFacing = currentFacing === "user" ? "environment" : "user";
  startCamera();
};

function drawFrame() {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(molduraImg, 0, 0, canvas.width, canvas.height);
}

btnFoto.onclick = async () => {
  canvas.width = 1080;
  canvas.height = 1920;
  drawFrame();
  canvas.toBlob(b => {
    lastBlob = b;
    showFinal();
  }, "image/png");
};

btnTirinha.onclick = async () => {
  capturedPhotos = [];
  for (let i = 0; i < 3; i++) {
    await new Promise(r => setTimeout(r, 800));
    const temp = document.createElement("canvas");
    temp.width = 1080;
    temp.height = 1920;
    const tctx = temp.getContext("2d");
    tctx.drawImage(video, 0, 0, temp.width, temp.height);
    tctx.drawImage(molduraImg, 0, 0, temp.width, temp.height);
    capturedPhotos.push(temp);
  }

  // tirinha vertical correta (1080x5760)
  canvas.width = 1080;
  canvas.height = 1920 * 3;
  capturedPhotos.forEach((c, i) => {
    ctx.drawImage(c, 0, i * 1920);
  });

  canvas.toBlob(b => {
    lastBlob = b;
    showFinal(true);
  }, "image/png");
};

function showFinal(isTirinha=false) {
  btnBaixar.style.display = "block";
  btnWhats.style.display = "block";
  btnDrive.style.display = "block";

  if (isTirinha) {
    // botão extra para fotos separadas
    if (!document.getElementById("btnSeparadas")) {
      const btn = document.createElement("button");
      btn.id = "btnSeparadas";
      btn.innerText = "📥 Baixar fotos separadas";
      btn.className = "btn";
      btn.onclick = () => {
        capturedPhotos.forEach((c, i) => {
          c.toBlob(b => {
            downloadBlob(b, `foto_${i+1}.png`);
          }, "image/png");
        });
      };
      document.getElementById("final").appendChild(btn);
    }
  }
}

function downloadBlob(blob, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

btnBaixar.onclick = () => {
  downloadBlob(lastBlob, "memoria.png");
};

btnWhats.onclick = () => {
  window.open("https://wa.me/?text=Veja%20essa%20memoria%20especial!", "_blank");
};

btnDrive.onclick = () => {
  window.open("https://drive.google.com", "_blank");
};

startCamera();
