// Rundenuhr im Hero: zählt 3 Minuten runter, pulsiert bei Rundenende
document.getElementById('roundTime') && (function(){
  const total = 180, C = 2*Math.PI*90;
  let remaining = total;
  const timeEl = document.getElementById('roundTime');
  const ring = document.getElementById('ringProgress');
  const wrap = document.getElementById('roundTimer');
  ring.style.strokeDasharray = C;
  function tick(){
    remaining--;
    if(remaining < 0){
      remaining = total;
      wrap.classList.add('pulse');
      setTimeout(()=>wrap.classList.remove('pulse'), 650);
    }
    const m = String(Math.floor(remaining/60)).padStart(2,'0');
    const s = String(remaining%60).padStart(2,'0');
    timeEl.textContent = m+':'+s;
    ring.style.strokeDashoffset = C * (1 - remaining/total);
  }
  ring.style.strokeDashoffset = 0;
  setInterval(tick, 1000);
})();

// Live-Status Geöffnet/Geschlossen — Lun–Vie: 2 Franjas · Sáb–Dom: 8-11 Uhr · Festivos: cerrado (keine automatische Feiertagserkennung)
function getWindows(day){
  return (day>=1 && day<=5) ? [[6,10],[15,20]] : [[8,11]];
}
function formatHour(h){
  const suffix = h>=12 ? 'p.m.' : 'a.m.';
  let h12 = h%12; if(h12===0) h12=12;
  return h12+':00 '+suffix;
}
function getStatus(){
  const now = new Date();
  const day = now.getDay();
  const hrs = now.getHours() + now.getMinutes()/60;
  const windows = getWindows(day);
  for(const [start,end] of windows){
    if(hrs>=start && hrs<end) return {open:true, day, closesAt: formatHour(end)};
  }
  for(const [start] of windows){
    if(hrs<start) return {open:false, day, opensAt: formatHour(start), opensToday:true};
  }
  const nextDay = (day+1)%7;
  const nextWindows = getWindows(nextDay);
  return {open:false, day, opensAt: formatHour(nextWindows[0][0]), opensToday:false};
}
(function applyStatus(){
  const s = getStatus();
  const pill = document.getElementById('statusPill');
  const headline = document.getElementById('statusHeadline');
  const sub = document.getElementById('statusSub');
  const heroDot = document.getElementById('heroLiveDot');
  const heroText = document.getElementById('heroLiveText');
  const opensPhrase = s.open ? '' : (s.opensToday ? ('Abrimos a las ' + s.opensAt) : ('Abrimos mañana a las ' + s.opensAt));
  const opensPhraseShort = s.open ? '' : (s.opensToday ? ('abre ' + s.opensAt) : ('abre mañana ' + s.opensAt));
  if(pill){
    if(s.open){
      pill.textContent = 'Abierto ahora'; pill.className = 'pill open';
      headline.textContent = 'Cerramos a las ' + s.closesAt;
    } else {
      pill.textContent = 'Cerrado'; pill.className = 'pill closed';
      headline.textContent = opensPhrase;
    }
    sub.textContent = 'Según la hora de tu dispositivo. Festivos: cerrado.';
  }
  if(heroText){
    heroText.textContent = s.open ? ('Abierto ahora · cierra ' + s.closesAt) : ('Cerrado · ' + opensPhraseShort);
    if(!s.open) heroDot.classList.add('closed');
  }
  document.querySelectorAll('.schedule-row').forEach(row=>{
    const daysAttr = row.getAttribute('data-days');
    if(!daysAttr) return;
    const days = daysAttr.split(',').map(Number);
    if(days.includes(s.day)){
      row.classList.add('is-today');
      const tag = document.createElement('span');
      tag.className = 'tag'; tag.textContent = 'HOY';
      row.querySelector('.day').appendChild(tag);
    }
  });
})();

// Ankündigungsleiste: einmal weggeklickt, bleibt sie für diesen Termin weg.
// Steht kein Termin an, fehlt das Element und der Block macht nichts.
(function(){
  const barra = document.getElementById('avisoBarra');
  if(!barra) return;
  const clave = 'gfc-aviso-' + barra.dataset.aviso;
  let cerrado = false;
  // localStorage wirft im privaten Modus mancher Browser
  try{ cerrado = localStorage.getItem(clave) === 'cerrado'; }catch(e){}
  if(!cerrado) barra.hidden = false;
  const boton = document.getElementById('avisoCerrar');
  boton && boton.addEventListener('click', ()=>{
    barra.hidden = true;
    try{ localStorage.setItem(clave, 'cerrado'); }catch(e){}
  });
})();

// Mobiles Menü (Burger)
const menuToggle = document.getElementById('menuToggle');
const menuIcon = document.getElementById('menuIcon');
menuToggle && menuToggle.addEventListener('click', ()=>{
  const open = document.body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', open);
  menuIcon.innerHTML = open ? '<path d="M6 6l12 12M18 6L6 18"/>' : '<path d="M3 6h18M3 12h18M3 18h18"/>';
});
document.querySelectorAll('#mobileMenu a[data-nav]').forEach(a=>{
  a.addEventListener('click', ()=>{
    document.body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', false);
    menuIcon.innerHTML = '<path d="M3 6h18M3 12h18M3 18h18"/>';
  });
});

// Laufband "Valores": läuft per CSS-Animation, wird außerhalb des Sichtbereichs pausiert (Performance)
(function(){
  const band = document.querySelector('.values-band');
  if(!band) return;
  const tracks = [...band.querySelectorAll('.mq-track')];
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      tracks.forEach(t=> t.style.animationPlayState = e.isIntersecting ? 'running' : 'paused');
    });
  }, {rootMargin:'200px 0px 200px 0px'});
  io.observe(band);
})();

// Sticky Header + "Nach oben"-Button
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('scrolled', window.scrollY > 8);
  document.getElementById('toTop').classList.toggle('show', window.scrollY > window.innerHeight*0.8);
}, {passive:true});

document.getElementById('toTop').addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
});

// Aktiven Nav-Link je nach sichtbarer Sektion markieren
const navLinks = document.querySelectorAll('a[data-nav]');
const sections = [...document.querySelectorAll('section[id]')];
const navObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#'+id));
    }
  });
}, {rootMargin:'-45% 0px -50% 0px', threshold:0});
sections.forEach(s=>navObserver.observe(s));

// Reveal-Animation beim Scrollen
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:0.12});
document.querySelectorAll('[data-reveal]').forEach(el=>revealObserver.observe(el));

// Tabs bei Planes
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>{b.classList.remove('is-active');b.setAttribute('aria-selected','false');});
    btn.classList.add('is-active'); btn.setAttribute('aria-selected','true');
    const target = btn.getAttribute('data-tab');
    document.querySelectorAll('.plan-panel').forEach(p=>p.classList.toggle('is-active', p.getAttribute('data-panel')===target));
  });
});

// Galerie-Lightbox: Fotos lassen sich durchblättern (Pfeile, Pfeiltasten,
// Wischen), ohne die Ansicht zwischendurch zu schließen
const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxCap = document.getElementById('lightboxCap');
const lightboxCount = document.getElementById('lightboxCount');
const tiles = [...document.querySelectorAll('.gallery-tile')];
let li = 0, tileAbierta = null;

const reducedMotionLb = matchMedia('(prefers-reduced-motion: reduce)');

function mostrarFoto(i){
  li = (i + tiles.length) % tiles.length;
  const tile = tiles[li];
  const fuenteVideo = tile.getAttribute('data-video');
  const img = tile.querySelector('img');
  lightboxMedia.style.background = '';
  if(fuenteVideo){
    // Video-Kachel: echter Player mit Bedienleiste statt Standbild.
    // Der Klick auf die Kachel zählt als Nutzeraktion, deshalb darf die
    // Wiedergabe hier mit Ton starten -- reduzierte Bewegung respektiert.
    const video = document.createElement('video');
    video.src = fuenteVideo;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    if(img) video.poster = img.src;
    lightboxMedia.replaceChildren(video);
    if(!reducedMotionLb.matches) video.play().catch(()=>{});
  } else if(img){
    const grande = document.createElement('img');
    grande.src = img.src;
    grande.alt = img.alt;
    lightboxMedia.replaceChildren(grande);
  } else {
    lightboxMedia.replaceChildren();
    lightboxMedia.style.background = getComputedStyle(tile).background;
  }
  lightboxCap.textContent = tile.getAttribute('data-caption');
  lightboxCount.textContent = (li + 1) + ' / ' + tiles.length;
}

function abrirLightbox(i){
  tileAbierta = tiles[i];
  mostrarFoto(i);
  lightbox.classList.add('is-open');
  document.getElementById('lightboxClose').focus();
}
function closeLightbox(){
  lightbox.classList.remove('is-open');
  // Inhalt leeren, sonst läuft ein Video unsichtbar weiter -- man hört es
  lightboxMedia.replaceChildren();
  // Fokus zurück auf die Kachel, von der aus geöffnet wurde
  if(tileAbierta){ tileAbierta.focus(); tileAbierta = null; }
}

tiles.forEach((tile, i)=> tile.addEventListener('click', ()=>abrirLightbox(i)));
document.getElementById('lightboxPrev').addEventListener('click', ()=>mostrarFoto(li-1));
document.getElementById('lightboxNext').addEventListener('click', ()=>mostrarFoto(li+1));
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{
  if(!lightbox.classList.contains('is-open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') mostrarFoto(li-1);
  if(e.key === 'ArrowRight') mostrarFoto(li+1);
});

// Wischen auf dem Handy
let xIni = null;
lightbox.addEventListener('touchstart', (e)=>{ xIni = e.changedTouches[0].clientX; }, {passive:true});
lightbox.addEventListener('touchend', (e)=>{
  if(xIni === null) return;
  const dx = e.changedTouches[0].clientX - xIni;
  if(Math.abs(dx) > 45) mostrarFoto(dx < 0 ? li+1 : li-1);
  xIni = null;
}, {passive:true});

// Das Reseñas-Karussell ist raus: die Sektion verweist jetzt direkt auf
// Google, weil es erst zwei echte Bewertungen gibt. Der Code dazu steht in
// der Git-Historie (bis Commit ff39d61), falls er zurückkommen soll.

// Nosotros-Karussell: 3 Fotos + 1 Video. Die Fotos wechseln alle 5s, der
// Video-Slide bleibt stehen, bis das Video einmal komplett gelaufen ist.
(function(){
  const track = document.getElementById('historyTrack');
  if(!track) return;
  const slides = track.children;
  const dotsWrap = document.getElementById('historyDots');
  const wrap = document.querySelector('.history-wrap');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const vid = track.querySelector('video');
  const videoIndex = [...slides].findIndex(s => s.querySelector('video'));
  let hi = 0, auto;
  let held = false;     // Maus oder Tastaturfokus im Karussell
  let visible = true;   // Karussell im sichtbaren Bereich

  // Video nur abspielen, wenn es auch jemand sehen kann
  function mayPlay(){ return visible && !reducedMotion.matches; }
  // Automatisch weiterschalten zusätzlich nur ohne Maus/Fokus im Karussell
  function mayAdvance(){ return mayPlay() && !held; }

  for(let i=0;i<slides.length;i++){
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i===0 ? ' is-active' : '');
    d.setAttribute('aria-label', 'Ir a la foto '+(i+1));
    d.addEventListener('click', ()=>goTo(i));
    dotsWrap.appendChild(d);
  }

  function goTo(i){
    hi = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-'+(hi*100)+'%)';
    [...dotsWrap.children].forEach((d,idx)=>d.classList.toggle('is-active', idx===hi));
    syncVideo();
    start();
  }

  // Das Video läuft nur auf seinem eigenen Slide und immer von vorn
  function syncVideo(){
    if(!vid) return;
    if(hi === videoIndex){
      if(vid.readyState > 0) vid.currentTime = 0;
      if(mayPlay()) vid.play().catch(()=>{});
    }else{
      vid.pause();
      if(vid.readyState > 0) vid.currentTime = 0;
      // Ein Slide vorher komplett vorladen, damit das Video sofort anläuft
      if(hi === videoIndex - 1 && vid.preload !== 'auto'){
        vid.preload = 'auto';
        vid.load();
      }
    }
  }

  function start(){
    stop();
    if(!mayAdvance()) return;
    // Auf dem Video-Slide schaltet erst das 'ended'-Ereignis weiter
    if(hi === videoIndex) return;
    auto = setInterval(()=>goTo(hi+1), 5000);
  }
  function stop(){ clearInterval(auto); }

  // Nach Pause (Hover, Fokus, außerhalb des Bildschirms) da weitermachen,
  // wo das Karussell stehengeblieben ist
  function resume(){
    if(vid && hi === videoIndex){
      if(vid.ended && mayAdvance()){ goTo(hi+1); return; }
      if(!vid.ended && mayPlay()) vid.play().catch(()=>{});
      return;
    }
    start();
  }

  document.getElementById('historyPrev').addEventListener('click', ()=>goTo(hi-1));
  document.getElementById('historyNext').addEventListener('click', ()=>goTo(hi+1));
  wrap.addEventListener('mouseenter', ()=>{ held = true; stop(); });
  wrap.addEventListener('mouseleave', ()=>{ held = false; resume(); });
  wrap.addEventListener('focusin', ()=>{ held = true; stop(); });
  wrap.addEventListener('focusout', ()=>{ held = false; resume(); });

  // Karussell und Video pausieren, solange die Sektion nicht im Bild ist —
  // sonst wäre das Video vorbei, bevor der Nutzer überhaupt hinscrollt
  if('IntersectionObserver' in window){
    new IntersectionObserver((entries)=>{
      visible = entries[0].isIntersecting;
      if(visible){ resume(); }
      else { stop(); if(vid) vid.pause(); }
    }, {threshold: 0.35}).observe(wrap);
  }

  // Kein natives autoplay-Attribut und kein loop am <video> (siehe index.html):
  // so respektiert die Wiedergabe reduzierte Bewegung genau wie der Foto-
  // Wechsel, und 'ended' kann das Karussell weiterschalten.
  if(vid){
    vid.addEventListener('ended', ()=>{ if(mayAdvance()) goTo(hi+1); });
  }

  const muteBtn = document.getElementById('historyMute');
  if(muteBtn && vid){
    muteBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      vid.muted = !vid.muted;
      muteBtn.setAttribute('aria-pressed', String(!vid.muted));
      muteBtn.querySelector('.ic-off').style.display = vid.muted ? '' : 'none';
      muteBtn.querySelector('.ic-on').style.display = vid.muted ? 'none' : '';
    });
  }

  start();
})();
