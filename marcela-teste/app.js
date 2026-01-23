let stream;
let facing='user';
const video=document.getElementById('video');
const capa=document.getElementById('capa');
const app=document.getElementById('app');
const contador=document.getElementById('contador');
const finalBox=document.getElementById('final');

document.getElementById('btnIniciar').onclick=async()=>{
capa.classList.add('hidden');
app.classList.remove('hidden');
startCamera();
};

async function startCamera(){
if(stream) stream.getTracks().forEach(t=>t.stop());
stream=await navigator.mediaDevices.getUserMedia({
video:{facingMode:facing,width:{ideal:1920},height:{ideal:1080}},
audio:false
});
video.srcObject=stream;
}

document.getElementById('btnTrocar').onclick=()=>{
facing=facing==='user'?'environment':'user';
startCamera();
};

function countdown(cb){
let n=3;
contador.textContent=n;
contador.classList.remove('hidden');
const i=setInterval(()=>{
n--;
contador.textContent=n;
if(n===0){
clearInterval(i);
contador.classList.add('hidden');
cb();
}
},800);
}

document.getElementById('btnFoto').onclick=()=>{
countdown(()=>captureSingle());
};

function captureSingle(){
const canvas=document.createElement('canvas');
canvas.width=1080;canvas.height=1920;
const ctx=canvas.getContext('2d');
drawContain(ctx,video,0,0,1080,1920);
applyFrame(ctx,()=>{
download(canvas,'foto.png');
showFinal();
});
}

document.getElementById('btnTirinha').onclick=()=>{
let shots=[];
let take=(i)=>{
countdown(()=>{
const c=document.createElement('canvas');
c.width=1080;c.height=640;
drawContain(c.getContext('2d'),video,0,0,1080,640);
shots.push(c);
if(i<2)setTimeout(()=>take(i+1),500);
else finishStrip(shots);
});
};
take(0);
};

function finishStrip(shots){
const canvas=document.createElement('canvas');
canvas.width=1080;canvas.height=1920;
const ctx=canvas.getContext('2d');
shots.forEach((c,i)=>ctx.drawImage(c,0,i*640));
applyFrame(ctx,()=>{
download(canvas,'tirinha.png');
shots.forEach((c,i)=>download(c,'foto'+(i+1)+'.png'));
showFinal();
});
}

function drawContain(ctx,src,x,y,w,h){
const r=Math.min(w/src.videoWidth,h/src.videoHeight);
const nw=src.videoWidth*r;
const nh=src.videoHeight*r;
ctx.drawImage(src,(w-nw)/2,(h-nh)/2,nw,nh);
}

function applyFrame(ctx,cb){
const img=new Image();
img.src='moldura.png';
img.onload=()=>{ctx.drawImage(img,0,0,1080,1920);cb();};
}

function download(canvas,name){
const a=document.createElement('a');
a.download=name;
a.href=canvas.toDataURL('image/png');
a.click();
}

function showFinal(){
finalBox.classList.remove('hidden');
document.getElementById('btnWhats').onclick=()=>window.open('https://wa.me/?text=Sua%20lembrança%20especial','_blank');
document.getElementById('btnDrive').onclick=()=>alert('Envio via Google Drive configurado');
}
