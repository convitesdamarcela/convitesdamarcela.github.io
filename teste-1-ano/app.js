const btnIniciar = document.getElementById("btnIniciar");
const capa = document.getElementById("capa");
const app = document.getElementById("app");
const video = document.getElementById("video");
const btnTrocar = document.getElementById("btnTrocarCamera");

let facing = "user";
let stream;

btnIniciar.onclick = async () => {
  capa.classList.add("hidden");
  app.classList.remove("hidden");
  iniciarCamera();
};

async function iniciarCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
  }
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: facing }
  });
  video.srcObject = stream;
}

btnTrocar.onclick = () => {
  facing = facing === "user" ? "environment" : "user";
  iniciarCamera();
};
