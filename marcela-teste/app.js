let video = document.getElementById("video");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let stream;
let facingMode = "user";
let mediaRecorder;
let recordedChunks = [];

document.getElementById("btnStart").onclick = async () => {
  document.getElementById("capa").classList.add("hidden");
  document.getElementById("cameraApp").classList.remove("hidden");
  startCamera();
};

async function startCamera() {
  if (stream) stream.getTracks().forEach(t => t.stop());

  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: facingMode, width: 1080, height: 1920 },
    audio: true
  });

  video.srcObject = stream;
}

document.getElementById("btnFlip").onclick = () => {
  facingMode = facingMode === "user" ? "environment" : "user";
  startCamera();
};

function countdown(cb) {
  let c = 3;
  const el = document.getElementById("countdown");
  el.classList.remove("hidden");
  el.innerText = c;

  const i = setInterval(() => {
    c--;
    if (c === 0) {
      clearInterval(i);
      el.classList.add("hidden");
      cb();
    } else {
      el.innerText = c;
    }
  }, 1000);
}

document.getElementById("btnPhoto").onclick = () => {
  countdown(() => capturePhoto());
};

function capturePhoto() {
  canvas.width = 1080;
  canvas.height = 1920;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  showFinal(canvas.toDataURL("image/png"));
}

document.getElementById("btnStrip").onclick = () => {
  let shots = [];
  let count = 0;

  function take() {
    countdown(() => {
      const temp = document.createElement("canvas");
      temp.width = 1080;
      temp.height = 640;
      temp.getContext("2d").drawImage(video, 0, 0, 1080, 640);
      shots.push(temp);

      count++;
      if (count < 3) take();
      else buildStrip(shots);
    });
  }
  take();
};

function buildStrip(shots) {
  canvas.width = 1080;
  canvas.height = 1920;
  shots.forEach((c, i) => {
    ctx.drawImage(c, 0, i * 640, 1080, 640);
  });
  showFinal(canvas.toDataURL("image/png"));
}

document.getElementById("btnVideo").onclick = () => {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = e => recordedChunks.push(e.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    showFinal(url, true);
  };
  mediaRecorder.start();
  setTimeout(() => mediaRecorder.stop(), 5000);
};

function showFinal(data, isVideo=false) {
  document.getElementById("finalActions").classList.remove("hidden");

  document.getElementById("btnDownload").onclick = () => {
    const a = document.createElement("a");
    a.href = data;
    a.download = isVideo ? "video.mp4" : "foto.png";
    a.click();
  };

  document.getElementById("btnWhats").onclick = () => {
    window.open("https://wa.me/?text=Sua lembrança está pronta!");
  };

  document.getElementById("btnDrive").onclick = () => {
    alert("Envio via Google Drive configurado pelo formulário.");
  };
}

