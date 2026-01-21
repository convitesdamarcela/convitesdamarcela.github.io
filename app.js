fetch("config/experience.json").then(r=>r.json()).then(cfg=>{
fetch(cfg.tracking.url+"?action=status&reseller_id="+cfg.ids.reseller_id)
.then(r=>r.json()).then(s=>{
if(s.status==="BLOCKED"||s.status==="BLOQUEADO"){document.body.innerHTML="<h1>Acesso indisponível</h1>";return;}
});
navigator.userAgent;
});
const start=document.getElementById("start");
start.onclick=async()=>{
document.getElementById("capa").style.display="none";
document.getElementById("camera").style.display="block";
try{
const stream=await navigator.mediaDevices.getUserMedia({video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30},facingMode:{ideal:"environment"}},audio:false});
document.getElementById("video").srcObject=stream;
}catch(e){document.getElementById("msg").innerText="Permissão de câmera negada";}
};