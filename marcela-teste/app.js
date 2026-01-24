
const btn=document.getElementById('startBtn');
const video=document.getElementById('camera');
const capa=document.getElementById('capa');

btn.onclick=async()=>{
 try{
  const s=await navigator.mediaDevices.getUserMedia({video:true});
  video.srcObject=s;
  video.style.display='block';
  capa.style.display='none';
 }catch(e){alert('Permita a câmera');}
}
