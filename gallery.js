  /* ===== Galerie circulaire =====
     Pour ajouter une photo (accueil + réalisations) : ajoutez une ligne ici et mettez l'image dans assets/gallery/ */
  var PHOTOS = [
    {src:'assets/gallery/beige-strie-2.jpg',         title:'Pierre de Taza beige — finition striée', bg:'#DCCFA9,#AE9C71'},
    {src:'assets/gallery/noir-strie-1.jpg',          title:'Marbre noir d\'Azilal — finition striée',bg:'#4A453B,#1E1B15'},
    {src:'assets/gallery/beige-strie-1.jpg',         title:'Pierre de Taza beige — finition striée', bg:'#E7DBB8,#C6B384'},
    {src:'assets/gallery/noir-strie-2.jpg',          title:'Marbre noir d\'Azilal — finition striée',bg:'#524C40,#26231B'},
    {src:'assets/gallery/facade-beige-eclatee.jpg',  title:'Façade — Beige Éclatée',      bg:'#DCCFA9,#AE9C71'},
    {src:'assets/gallery/piscine-volcanique.jpg',    title:'Piscine — Pierre Volcanique', bg:'#524C40,#26231B'},
    {src:'assets/gallery/sol-beige-polie.jpg',       title:'Sol intérieur — Beige Polie', bg:'#E7DBB8,#C6B384'},
    {src:'assets/gallery/escalier-gris-vieilli.jpg', title:'Escalier — Grise Vieillie',   bg:'#726F62,#514E43'},
    {src:'assets/gallery/terrasse-noir.jpg',         title:'Terrasse — Pierre Noire',     bg:'#4A453B,#1E1B15'}
  ];
  (function(){
    var stage=document.getElementById('ringStage'), ring=document.getElementById('ring');
    var titleEl=document.getElementById('ringTitle'), countEl=document.getElementById('ringCount');
    var lb=document.getElementById('lightbox'), lbImg=document.getElementById('lbImg');
    var N=PHOTOS.length, STEP=360/N, cards=[];
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var rot=0, vel=0, target=null, dragging=false, lastX=0, moved=0, idleT=0, radius=300, current=-1;

    PHOTOS.forEach(function(p,i){
      var c=document.createElement('div'); c.className='ring-card';
      c.style.background='linear-gradient(135deg,'+p.bg+')';
      var img=new Image(); img.src=p.src; img.alt=p.title; img.draggable=false;
      img.onerror=function(){img.remove();}; c.appendChild(img);
      c.addEventListener('click',function(){
        if(moved>6) return;
        if(i===current){ if(c.querySelector('img')){lbImg.src=p.src;lbImg.alt=p.title;lb.classList.add('open');} }
        else goTo(i);
      });
      ring.appendChild(c); cards.push(c);
    });

    function layout(){
      var w=Math.min(260,Math.max(150,stage.clientWidth*0.36));
      stage.style.setProperty('--card-w',w+'px');
      radius=Math.max(w*0.9,(w/2)/Math.tan(Math.PI/N)+w*0.35);
    }
    function nearest(){ return Math.round(-rot/STEP); }
    function goTo(i){ var k=nearest(), d=((i-k)%N+N)%N; if(d>N/2)d-=N; target=(k+d)*-STEP; idleT=performance.now(); }
    function render(){
      cards.forEach(function(c,i){
        var a=i*STEP+rot, r=((a%360)+540)%360-180, f=Math.cos(r*Math.PI/180);
        c.style.transform='rotateY('+a+'deg) translateZ('+radius+'px)';
        c.style.opacity=(0.25+0.75*Math.max(0,(f+1)/2)).toFixed(3);
        c.style.zIndex=Math.round(f*100)+100;
      });
      var idx=((nearest()%N)+N)%N;
      if(idx!==current){ current=idx; titleEl.textContent=PHOTOS[idx].title; countEl.textContent=(idx+1)+' / '+N; }
    }
    function tick(now){
      if(!dragging){
        if(target!==null){ rot+=(target-rot)*(reduce?1:0.12); if(Math.abs(target-rot)<0.05){rot=target;target=null;} }
        else if(Math.abs(vel)>0.02){ rot+=vel; vel*=0.94; }
        else if(vel!==0){ vel=0; target=nearest()*-STEP; }
        else if(!reduce && now-idleT>4000){ rot-=0.06; }
      }
      render(); requestAnimationFrame(tick);
    }
    stage.addEventListener('pointerdown',function(e){ dragging=true; moved=0; lastX=e.clientX; vel=0; target=null; stage.classList.add('dragging'); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove',function(e){ if(!dragging)return; var dx=e.clientX-lastX; lastX=e.clientX; moved+=Math.abs(dx); var d=dx*0.35; rot+=d; vel=d; });
    function end(){ if(!dragging)return; dragging=false; idleT=performance.now(); stage.classList.remove('dragging'); if(Math.abs(vel)<0.3){vel=0;target=nearest()*-STEP;} }
    stage.addEventListener('pointerup',end); stage.addEventListener('pointercancel',end);
    stage.addEventListener('keydown',function(e){ if(e.key==='ArrowLeft'){goTo(current-1);e.preventDefault();} if(e.key==='ArrowRight'){goTo(current+1);e.preventDefault();} if(e.key==='Enter')cards[current].click(); });
    document.getElementById('ringPrev').onclick=function(){goTo(current-1);};
    document.getElementById('ringNext').onclick=function(){goTo(current+1);};
    function closeLb(){lb.classList.remove('open');}
    document.getElementById('lbClose').onclick=closeLb;
    lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
    document.addEventListener('keydown',function(e){if(e.key==='Escape')closeLb();});
    window.addEventListener('resize',layout);
    layout(); render(); requestAnimationFrame(tick);
  })();
