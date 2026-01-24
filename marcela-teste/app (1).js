let video=document.getElementById('video');
let stream,facing='user';

document.getElementById('startBtn').onclick=async()=>{
 document.getElementById('capa').classList.add('hidden');
 document.getElementById('cameraApp').classList.remove('hidden');
 await startCamera();
};

async function startCamera(){
 if(stream) stream.getTracks().forEach(t=>t.stop());
 stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:facing},audio:true});
 video.srcObject=stream;
}

function switchCamera(){facing=facing==='user'?'environment':'user';startCamera();}

function countdown(cb){
 let c=document.getElementById('countdown');let n=3;
 c.textContent=n;c.classList.remove('hidden');
 let i=setInterval(()=>{n--;if(n==0){clearInterval(i);c.classList.add('hidden');cb();}else c.textContent=n;},1000);
}

function takePhoto(){
 countdown(()=>{
  let canvas=document.getElementById('canvas');
  canvas.width=1080;canvas.height=1920;
  let ctx=canvas.getContext('2d');
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  let img=new Image();img.src='moldura.png';
  img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);download(canvas,'foto.png');};
 });
}

function takeStrip(){
 let shots=[],i=0;
 function next(){
  countdown(()=>{
   let c=document.createElement('canvas');
   c.width=1080;c.height=640;
   c.getContext('2d').drawImage(video,0,0,c.width,c.height);
   shots.push(c);i++;
   if(i<3)next();else compose();
  });
 }
 next();
 function compose(){
  let canvas=document.getElementById('canvas');
  canvas.width=1080;canvas.height=1920;
  let ctx=canvas.getContext('2d');
  shots.forEach((s,i)=>ctx.drawImage(s,0,i*640));
  let img=new Image();img.src='moldura.png';
  img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);download(canvas,'tirinha.png');};
 }
}

let rec,chunks=[];
function recordVideo(){
 if(!rec){
  rec=new MediaRecorder(stream);
  rec.ondataavailable=e=>chunks.push(e.data);
  rec.onstop=()=>{let b=new Blob(chunks,{type:'video/webm'});let a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='video.webm';a.click();chunks=[];rec=null;};
  rec.start();alert('Gravando');
 }else rec.stop();
}

function toggleOrientation(){screen.orientation.lock(screen.orientation.type.startsWith('portrait')?'landscape':'portrait').catch(()=>{});}

function download(c,n){let a=document.createElement('a');a.href=c.toDataURL();a.download=n;a.click();}
