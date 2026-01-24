let video=document.getElementById('video');
let canvas=document.getElementById('canvas');
let ctx=canvas.getContext('2d');
let stream,facing='user',portrait=true,lastBlob=null;

document.getElementById('btnStart').onclick=async()=>{
 document.getElementById('capa').classList.add('hidden');
 document.getElementById('app').classList.remove('hidden');
 await startCamera();
};

async function startCamera(){
 if(stream) stream.getTracks().forEach(t=>t.stop());
 stream=await navigator.mediaDevices.getUserMedia({
  video:{facingMode:facing,width:{ideal:portrait?1080:1920},height:{ideal:portrait?1920:1080}},
  audio:true
 });
 video.srcObject=stream;
}

function switchCamera(){facing=facing==='user'?'environment':'user';startCamera();}

function toggleOrientation(){portrait=!portrait;startCamera();}

function countdown(cb){
 let el=document.getElementById('countdown');let n=3;
 el.textContent=n;el.classList.remove('hidden');
 let i=setInterval(()=>{n--;if(n===0){clearInterval(i);el.classList.add('hidden');cb();}else el.textContent=n;},1000);
}

function takePhoto(){
 countdown(()=>{
  canvas.width=portrait?1080:1920;
  canvas.height=portrait?1920:1080;
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  let img=new Image();img.src='moldura.png';
  img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);lastBlob=canvas.toDataURL('image/png');showAfter();};
 });
}

function takeStrip(){
 let shots=[],i=0;
 function next(){
  countdown(()=>{
   let c=document.createElement('canvas');
   c.width=1080;c.height=640;
   c.getContext('2d').drawImage(video,0,0,c.width,c.height);
   shots.push(c);i++;if(i<3)next();else compose();
  });
 }
 next();
 function compose(){
  canvas.width=1080;canvas.height=1920;
  shots.forEach((s,i)=>ctx.drawImage(s,0,i*640));
  let img=new Image();img.src='moldura.png';
  img.onload=()=>{ctx.drawImage(img,0,0,canvas.width,canvas.height);lastBlob=canvas.toDataURL('image/png');showAfter();};
 }
}

let rec,chunks=[];
function recordVideo(){
 let r=document.getElementById('rec');
 if(!rec){
  rec=new MediaRecorder(stream,{mimeType:'video/webm'});
  rec.ondataavailable=e=>chunks.push(e.data);
  rec.onstop=()=>{
   r.classList.add('hidden');
   let blob=new Blob(chunks,{type:'video/webm'});
   lastBlob=URL.createObjectURL(blob);
   chunks=[];rec=null;showAfter();
  };
  rec.start();r.classList.remove('hidden');
  setTimeout(()=>rec&&rec.stop(),8000);
 }else rec.stop();
}

function showAfter(){document.getElementById('after').classList.remove('hidden');}

function downloadResult(){
 let a=document.createElement('a');
 a.href=lastBlob;a.download='memoria';a.click();
}

function sendWhats(){alert('Envio via WhatsApp será aberto aqui');}
function sendDrive(){alert('Envio via Google Drive será aberto aqui');}
