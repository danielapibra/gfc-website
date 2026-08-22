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

// Live-Status Geöffnet/Geschlossen — Lun–Vie: 2 Franjas · Sáb–Dom: 1 Franja · Festivos: cerrado (keine automatische Feiertagserkennung)
function getWindows(day){
  return (day>=1 && day<=5) ? [[6,10],[15,20]] : [[8,23]];
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

// Galerie-Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxMedia = document.getElementById('lightboxMedia');
const lightboxCap = document.getElementById('lightboxCap');
document.querySelectorAll('.gallery-tile').forEach(tile=>{
  tile.addEventListener('click', ()=>{
    const img = tile.querySelector('img');
    if(img){
      lightboxMedia.style.background = 'none';
      lightboxMedia.innerHTML = '<img src="'+img.src+'" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">';
    } else {
      lightboxMedia.innerHTML = '';
      lightboxMedia.style.background = getComputedStyle(tile).background;
    }
    lightboxCap.textContent = tile.getAttribute('data-caption');
    lightbox.classList.add('is-open');
  });
});
function closeLightbox(){ lightbox.classList.remove('is-open'); }
document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

// Reseñas-Karussell
const testiTrack = document.getElementById('testiTrack');
const testiSlides = testiTrack.children;
const testiDotsWrap = document.getElementById('testiDots');
let ti = 0, testiAutoplay;
for(let i=0;i<testiSlides.length;i++){
  const d = document.createElement('button');
  d.className = 'testi-dot' + (i===0 ? ' is-active' : '');
  d.setAttribute('aria-label', 'Ir a la reseña '+(i+1));
  d.addEventListener('click', ()=>goToTesti(i));
  testiDotsWrap.appendChild(d);
}
function goToTesti(i){
  ti = (i + testiSlides.length) % testiSlides.length;
  testiTrack.style.transform = 'translateX(-'+(ti*100)+'%)';
  [...testiDotsWrap.children].forEach((d,idx)=>d.classList.toggle('is-active', idx===ti));
}
document.getElementById('testiPrev').addEventListener('click', ()=>goToTesti(ti-1));
document.getElementById('testiNext').addEventListener('click', ()=>goToTesti(ti+1));
function startTestiAutoplay(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  testiAutoplay = setInterval(()=>goToTesti(ti+1), 6000);
}
function stopTestiAutoplay(){ clearInterval(testiAutoplay); }
startTestiAutoplay();
document.querySelector('.testi-wrap').addEventListener('mouseenter', stopTestiAutoplay);
document.querySelector('.testi-wrap').addEventListener('mouseleave', startTestiAutoplay);
document.querySelector('.testi-wrap').addEventListener('focusin', stopTestiAutoplay);
document.querySelector('.testi-wrap').addEventListener('focusout', startTestiAutoplay);

// Nosotros-Karussell: 3 Fotos + 1 Video, wechselt automatisch alle 5s, manuell jederzeit änderbar
(function(){
  const track = document.getElementById('historyTrack');
  if(!track) return;
  const slides = track.children;
  const dotsWrap = document.getElementById('historyDots');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let hi = 0, auto;

  for(let i=0;i<slides.length;i++){
    const d = document.createElement('button');
    d.className = 'testi-dot' + (i===0 ? ' is-active' : '');
    d.setAttribute('aria-label', 'Ir a la foto '+(i+1));
    d.addEventListener('click', ()=>{ goTo(i); reset(); });
    dotsWrap.appendChild(d);
  }
  function goTo(i){
    hi = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-'+(hi*100)+'%)';
    [...dotsWrap.children].forEach((d,idx)=>d.classList.toggle('is-active', idx===hi));
  }
  function start(){
    if(reducedMotion.matches) return;
    const currentSlide = slides[hi];
    // Beim Video-Slide kein automatisches Weiterschalten — der Nutzer steuert selbst
    if(currentSlide.querySelector('video')){
      stop();
      return;
    }
    auto = setInterval(()=>goTo(hi+1), 5000);
  }
  function stop(){ clearInterval(auto); }
  function reset(){ stop(); start(); }

  document.getElementById('historyPrev').addEventListener('click', ()=>{ goTo(hi-1); reset(); });
  document.getElementById('historyNext').addEventListener('click', ()=>{ goTo(hi+1); reset(); });
  const wrap = document.querySelector('.history-wrap');
  wrap.addEventListener('mouseenter', stop);
  wrap.addEventListener('mouseleave', start);
  wrap.addEventListener('focusin', stop);
  wrap.addEventListener('focusout', start);
  start();

  // Kein natives autoplay-Attribut am <video> (siehe index.html) -- so respektiert
  // die Wiedergabe reduzierte Bewegung genau wie der Foto-Wechsel oben.
  const vid = track.querySelector('video');
  if(vid && !reducedMotion.matches){
    vid.play().catch(()=>{});
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
})();
