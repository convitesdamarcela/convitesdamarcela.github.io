let video=document.getElementById('video');
let stream,mode='foto',facing='user',orientation='portrait';
const btnStart=document.getElementById('btnStart');
const capa=document.getElementById('capa');
const menu=document.getElementById('menu');
const camera=document.getElementById('camera');
const countdown=document.getElementById('countdown');

btnStart.onclick=()=>{
 capa.classList.add('hidden');
 menu.classList.remove('hidden');
 startCamera();
}

async function startCamera(){
 if(stream) stream.getTracks().forEach(t=>t.stop());
 stream=await navigator.mediaDevices.getUserMedia({
  video:{facingMode:facing,width:{ideal:1920},height:{ideal:1080}},
  audio:false
 });
 video.srcObject=stream;
}

document.querySelectorAll('[data-mode]').forEach(b=>{
 b.onclick=()=>{mode=b.dataset.mode;takeAction()}
});

document.getElementById('btnSwitch').onclick=()=>{
 facing=facing==='user'?'environment':'user';
 startCamera();
}

document.getElementById('btnRotate').onclick=()=>{
 orientation=orientation==='portrait'?'landscape':'portrait';
}

function showCountdown(cb){
 let n=3;
 countdown.textContent=n;
 countdown.classList.remove('hidden');
 let i=setInterval(()=>{
  n--;
  if(n===0){clearInterval(i);countdown.classList.add('hidden');cb();}
  else countdown.textContent=n;
 },1000);
}

function takeAction(){
 showCountdown(()=>{
  if(mode==='foto') capturePhoto();
  if(mode==='tirinha') captureStrip();
 });
}

function capturePhoto(){
 const canvas=document.createElement('canvas');
 canvas.width=1080;canvas.height=1920;
 const ctx=canvas.getContext('2d');
 drawVideo(ctx,canvas);
 finish(canvas.toDataURL('image/png'));
}

function captureStrip(){
 const canvas=document.createElement('canvas');
 canvas.width=1080;canvas.height=1920;
 const ctx=canvas.getContext('2d');
 let shots=0,imgs=[];
 function shot(){
  const c=document.createElement('canvas');
  c.width=1080;c.height=640;
  const cx=c.getContext('2d');
  drawVideo(cx,c);
  imgs.push(c);
  shots++;
  if(shots<3){showCountdown(shot)}
  else{
   imgs.forEach((img,i)=>ctx.drawImage(img,0,i*640));
   finish(canvas.toDataURL('image/png'));
  }
 }
 shot();
}

function drawVideo(ctx,canvas){
 const vw=video.videoWidth,vh=video.videoHeight;
 const cw=canvas.width,ch=canvas.height;
 const scale=Math.max(cw/vw,ch/vh);
 const x=(cw-vw*scale)/2,y=(ch-vh*scale)/2;
 ctx.drawImage(video,x,y,vw*scale,vh*scale);
}

function finish(data){
 menu.classList.add('hidden');
 document.getElementById('final').classList.remove('hidden');
 document.getElementById('btnDownload').onclick=()=>{
  const a=document.createElement('a');a.href=data;a.download='foto.png';a.click();
 }
 document.getElementById('btnWhats').onclick=()=>{
  window.open('https://wa.me/?text=Olha%20essa%20lembrança!');
 }
 document.getElementById('btnDrive').onclick=()=>alert('Envio via Drive');
}
