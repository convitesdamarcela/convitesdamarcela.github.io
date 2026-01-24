const screens=document.querySelectorAll('.screen');
const show=id=>{screens.forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');}

document.getElementById('startBtn').onclick=()=>show('menu');

document.querySelectorAll('[data-mode]').forEach(b=>{
  b.onclick=()=>{show('camera');startCamera();}
});

let stream;
async function startCamera(){
  if(stream) stream.getTracks().forEach(t=>t.stop());
  stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}});
  document.getElementById('video').srcObject=stream;
}
