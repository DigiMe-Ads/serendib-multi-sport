(function(){
  // slide files, in deck order — add, remove or reorder slides here
  var SLIDES=[
    "01-cover","02-main-idea","03-learning-from-goa","04-big-launch",
    "05-race-the-island","06-build-hype","07-made-of-more","08-race-week",
    "09-partner-content-series","10-partner-content-engine","11-content-pillars",
    "12-rollout","13-how-we-work","14-measuring-success","15-next-steps","16-main-message"
  ];
  var stage=document.getElementById('stage');
  Promise.all(SLIDES.map(function(f){
    return fetch('slides/'+f+'.html').then(function(r){
      if(!r.ok)throw new Error(f+': '+r.status);
      return r.text();
    });
  })).then(function(parts){
    stage.innerHTML=parts.join('');
    init();
  }).catch(function(err){
    stage.innerHTML='<div class="slide on"><div class="inner"><p class="sec">Could not load slides</p><p>'+err.message+'</p><p class="muted">If you opened index.html directly from disk, serve the folder instead (e.g. <code>npx serve</code>).</p></div></div>';
  });

function init(){
  // sponsor ownership
  var owns=[
    ["Hydration","Fuel Stops","Hydration tips for racing in Colombo heat, aid-station prep, athletes' fluid routines.","Tip reels · carousels · race-day aid-station stories","Dec–Aug"],
    ["Bank / payment","Tap In","Step-by-step registration walkthroughs, deadline countdowns, cashless race-village moments.","Story links · countdown reels · live race-village stories","Jun–Aug"],
    ["Airline","Arrivals","International athletes flying in, bike-box travel tips, “flying in for Colombo” athlete POVs.","Athlete POV reels · collab posts · airport arrival stories","Apr–Aug"],
    ["Hotel","Race Week Stay","Race-ready stays, pre-race dinners and rest days as “Race the Island” episodes.","Room-tour reels · carousels · creator stays","Apr–Aug"],
    ["Telco","Live from the Course","Athlete-tracker explainers, live splits and real-time race-day updates.","Live streams · story updates · tracker how-to reels","Jul–Aug"],
    ["Auto","Behind the Convoy","Course set-up, support vehicles and logistics behind the scenes.","BTS reels · time-lapses · race-morning stories","Jul–Aug"],
    ["Wellness","Recovery Room","Recovery routines, expert Q&As and the post-race recovery zone.","Expert reels · Q&A lives · recovery-zone stories","Dec–Aug"]
  ];
  var ol=document.getElementById('ownList'), od=document.getElementById('ownDetail');
  function pickOwn(i){
    Array.prototype.forEach.call(ol.children,function(b,j){b.setAttribute('aria-selected',j===i)});
    var o=owns[i];od.innerHTML='<p class="muted" style="margin-bottom:8px">'+o[0]+' partner series</p><div class="what">'+o[1]+'</div><p style="margin-top:16px">'+o[2]+'</p><div class="chips"><span>'+o[3].split(' · ').join('</span><span>')+'</span></div><p class="muted" style="margin-top:14px">Runs '+o[4]+'</p>';
  }
  owns.forEach(function(o,i){var b=document.createElement('button');b.setAttribute('role','tab');b.innerHTML=o[0]+'<span>›</span>';b.onclick=function(){pickOwn(i)};ol.appendChild(b)});
  pickOwn(0);

  // rollout phases
  var ph=[
    ["Oct–Nov 2026","Big Bang",["Hero comeback film","Strong launch creative","PR announcement","Athlete ambassador reveals","Sponsor teasers","Colombo-based visuals","Push the line: Sri Lanka Is Back on the IRONMAN Map"]],
    ["Dec 2026–Mar 2027","Build Community",["Club partnerships","Training content","Athlete journeys","Community and UGC"]],
    ["Apr–May 2027","Build Desire",["Colombo / Sri Lanka destination content","International athlete marketing","Course storytelling","Athlete reveals"]],
    ["Jun–Jul 2027","Push Registrations",["Registration urgency","Travel and hotel planning","Sponsor activation reveals","Countdown content","Stronger calls to action"]],
    ["Aug 2027","Own the Month",["Daily content","Athlete arrivals","Expo and race village","Behind-the-scenes","Live event coverage","Sponsor visibility","Spectator content","Post-race celebration and recap"]]
  ];
  var pl=document.getElementById('phaseList'), pb=document.getElementById('phaseBody');
  function pickPh(i){
    Array.prototype.forEach.call(pl.children,function(b,j){b.setAttribute('aria-selected',j===i)});
    pb.innerHTML='<p class="muted" style="margin-bottom:6px">'+ph[i][0]+'</p><h3>'+ph[i][1]+'</h3><div class="chips">'+ph[i][2].map(function(x){return '<span>'+x+'</span>'}).join('')+'</div>';
  }
  ph.forEach(function(p,i){var b=document.createElement('button');b.className='phase';b.setAttribute('role','tab');b.innerHTML='<small>'+p[0]+'</small><b>'+p[1]+'</b>';b.onclick=function(){pickPh(i)};pl.appendChild(b)});
  pickPh(0);

  // deck navigation
  var slides=document.querySelectorAll('.slide'), n=slides.length, idx=0;
  var cur=document.getElementById('cur'), fill=document.getElementById('fill');
  document.getElementById('tot').textContent=String(n).padStart(2,'0');
  function go(i){
    if(i<0||i>=n)return;
    slides.forEach(function(s,j){s.classList.toggle('on',j===i);s.classList.toggle('back',j<i);s.setAttribute('aria-hidden',j!==i)});
    idx=i; cur.textContent=String(i+1).padStart(2,'0');
    fill.style.width=((i)/(n-1)*100)+'%';
    document.getElementById('prev').disabled=i===0;
    document.getElementById('next').disabled=i===n-1;
    slides[i].scrollTop=0;
    try{history.replaceState(null,'','#'+(i+1))}catch(e){}
  }
  document.getElementById('prev').onclick=function(){go(idx-1)};
  document.getElementById('next').onclick=function(){go(idx+1)};
  document.addEventListener('keydown',function(e){
    if(e.target.closest&&e.target.closest('[role=tablist]')&&(e.key==='ArrowLeft'||e.key==='ArrowRight'))return;
    if(e.key==='ArrowRight'||e.key==='PageDown'){go(idx+1)}
    if(e.key==='ArrowLeft'||e.key==='PageUp'){go(idx-1)}
    if(e.key==='Home')go(0); if(e.key==='End')go(n-1);
  });
  var sx=null,sy=null;
  document.getElementById('stage').addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
  document.getElementById('stage').addEventListener('touchend',function(e){
    if(sx===null)return; var dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(idx+(dx<0?1:-1)); sx=null;
  },{passive:true});
  var h=parseInt((location.hash||'').slice(1),10); go(h>0&&h<=n?h-1:0);

  // theme toggle
  var root=document.documentElement;
  try{var t=localStorage.getItem('theme'); if(t)root.setAttribute('data-theme',t)}catch(e){}
  document.getElementById('theme').onclick=function(){
    var dark=root.getAttribute('data-theme')?root.getAttribute('data-theme')==='dark':!matchMedia('(prefers-color-scheme: light)').matches;
    var nt=dark?'light':'dark'; root.setAttribute('data-theme',nt);
    try{localStorage.setItem('theme',nt)}catch(e){}
  };
}
})();
