
const video = document.getElementById('video');
const btnIniciar = document.getElementById('btnIniciar');
const capa = document.getElementById('capa');
const app = document.getElementById('app');

let stream;
let facing = 'user';

btnIniciar.onclick = async () => {
  capa.classList.add('hidden');
  app.classList.remove('hidden');
  await startCamera();
};

async function startCamera(){
  if(stream) stream.getTracks().forEach(t=>t.stop());
  stream = await navigator.mediaDevices.getUserMedia({
    video:{ facingMode:facing }
  });
  video.srcObject = stream;
  video.play();
}

document.getElementById('btnTrocar').onclick = async ()=>{
  facing = facing === 'user' ? 'environment' : 'user';
  await startCamera();
};

document.getElementById('btnFoto').onclick = ()=>{
  const canvas = document.getElementById('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  const link = document.createElement('a');
  link.download = 'foto.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
};
