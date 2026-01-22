
fetch('https://script.google.com/macros/s/AKfycbxUjLSyfJ1BA4Rg_5LwknPeeCi84v4WEQ0nJlsu-iV3-0EseWHQaABbCLJwBKaB7eq3/exec')
.then(r=>r.json()).then(d=>{
 if(d.status==='BLOCKED'){document.body.innerHTML='<h1>Acesso bloqueado</h1>';}
});
