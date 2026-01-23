const btn=document.getElementById('btnIniciar');
const capa=document.getElementById('capa');
const app=document.getElementById('app');
const video=document.getElementById('video');
let facing='user';
let stream;

btn.onclick=async()=>{
  capa.classList.add('hidden');
  app.classList.remove('hidden');
  await startCamera();
};

async function startCamera(){
  if(stream) stream.getTracks().forEach(t=>t.stop());
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing}});
  video.srcObject=stream;
}

document.getElementById('btnTrocar').onclick=()=>{
  facing=facing==='user'?'environment':'user';
  startCamera();
};
