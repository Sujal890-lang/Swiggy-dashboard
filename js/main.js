/* ============================================================
   main.js — loader, theme, cursor glow, AOS, tilt, nav scroll
   ============================================================ */
window.addEventListener('load',()=>{
  setTimeout(()=>{const l=document.getElementById('loader');l.style.opacity=0;
    setTimeout(()=>l.style.display='none',800);},1900);
  AOS.init({duration:800,once:true,offset:80});
});

/* Theme toggle */
const tt=document.getElementById('themeToggle');
tt.onclick=()=>{const h=document.documentElement;
  const dark=h.getAttribute('data-theme')==='dark';
  h.setAttribute('data-theme',dark?'light':'dark');
  tt.innerHTML=dark?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';};

/* Cursor glow */
const cg=document.getElementById('cursor-glow');
addEventListener('mousemove',e=>{cg.style.transform=`translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;});

/* Tilt on glass cards */
document.addEventListener('mousemove',e=>{
  document.querySelectorAll('.glass-card').forEach(c=>{
    const r=c.getBoundingClientRect();
    if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){c.style.transform='';return;}
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    c.style.transform=`rotateY(${x*6}deg) rotateX(${-y*6}deg) translateY(-4px)`;
  });
});

/* Smooth nav highlight */
document.querySelectorAll('a[href^="#"]').forEach(a=>a.onclick=e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'});}
});

/* Contact form */
document.getElementById('contactForm').onsubmit=e=>{e.preventDefault();
  alert('Thanks! Your message has been received.');e.target.reset();};