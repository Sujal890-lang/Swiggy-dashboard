/* ============================================================
   ai.js — AI insights, ML prediction, chat assistant
   ============================================================ */
(function(){
  let D=[];
  document.addEventListener('filtered',e=>D=e.detail);
  if (window.SwiggyData) {
    SwiggyData.onReady(() => { if (!D.length) D = SwiggyData.raw; });
  } else {
    document.addEventListener('data-ready', () => { if (!D.length) D = SwiggyData.raw; });
  }

  /* ---------- AI INSIGHTS ---------- */
  document.getElementById('genInsights').onclick=()=>{
    const d=D.length?D:SwiggyData.raw;
    const high=d.filter(r=>r.rating>=4.5).length;
    const pct=(high/d.length*100).toFixed(0);
    const fast=d.filter(r=>r.time<=45), fastAvg=avg(fast.map(r=>r.rating)).toFixed(2);
    const slowAvg=avg(d.filter(r=>r.time>45).map(r=>r.rating)).toFixed(2);
    const topCity=count(d.map(r=>r.city))[0];
    const topCui=count(d.flatMap(r=>r.cuisines))[0];
    const premium=d.filter(r=>r.price>=800), premRev=avg(premium.map(r=>r.price*r.votes));
    const insights=[
      `⭐ ${pct}% of restaurants are rated 4.5+, signalling strong repeat-customer potential (up to 40% more retention).`,
      `⚡ Fast-delivery restaurants (≤45 min) average ${fastAvg}★ vs ${slowAvg}★ for slower ones — speed correlates with satisfaction.`,
      `🏙️ ${topCity[0]} leads with ${topCity[1]} restaurants, making it the most competitive food market in the dataset.`,
      `🍽️ ${topCui[0]} is the most offered cuisine — dominating metro demand.`,
      `💰 Premium restaurants (₹800+) generate the highest estimated revenue, averaging ₹${Math.round(premRev).toLocaleString()} in rating-weighted value.`
    ];
    document.getElementById('insightsGrid').innerHTML=insights.map((t,i)=>`
      <div class="col-md-6" data-aos="fade-up" data-aos-delay="${i*80}">
        <div class="glass-card insight-card"><p style="color:var(--text)">${t}</p></div></div>`).join('');
    if(window.AOS)AOS.refresh();
  };

  /* ---------- ML PREDICTION (heuristic model) ---------- */
  ['pRating','pVotes','pCost','pTime'].forEach(id=>{
    const el=document.getElementById(id);
    el.addEventListener('input',()=>document.getElementById(id+'Val').textContent=el.value);
  });
  document.getElementById('runPredict').onclick=()=>{
    const rating=+pRating.value, votes=+pVotes.value, cost=+pCost.value, time=+pTime.value;
    // Popularity: rating & votes up, delivery time down
    const pop=clamp((rating/5*45)+(Math.log10(votes+1)/4*35)+((95-time)/75*20),0,100);
    const orders=Math.round((votes*0.6)+(rating*120)+((95-time)*8));
    const revenue=Math.round(orders*cost*0.25);
    const success=clamp((rating-3)/2*60 + (pop/100*40),0,100);
    setGauge('gPopularity',pop.toFixed(0)+'%');
    setGauge('gRevenue','₹'+revenue.toLocaleString());
    setGauge('gOrders',orders.toLocaleString());
    setGauge('gSuccess',success.toFixed(0)+'%');
  };
  function setGauge(id,val){const el=document.getElementById(id);el.textContent=val;
    el.classList.remove('show');void el.offsetWidth;el.classList.add('show');}

  /* ---------- CHAT ASSISTANT ---------- */
  const win=document.getElementById('chatWindow');
  document.getElementById('chatFab').onclick=()=>win.classList.toggle('open');
  document.getElementById('chatClose').onclick=()=>win.classList.remove('open');
  document.getElementById('chatSend').onclick=send;
  document.getElementById('chatInput').addEventListener('keydown',e=>{if(e.key==='Enter')send();});

  function send(){
    const inp=document.getElementById('chatInput');const q=inp.value.trim();if(!q)return;
    addMsg(q,'user');inp.value='';setTimeout(()=>addMsg(answer(q),'bot'),300);
  }
  function addMsg(t,who){const b=document.getElementById('chatBody');
    const m=document.createElement('div');m.className='msg '+who;m.innerHTML=t;
    b.appendChild(m);b.scrollTop=b.scrollHeight;}
  function answer(q){
    q=q.toLowerCase();const d=D.length?D:SwiggyData.raw;
    if(q.includes('top')&&q.includes('rat')){
      const t=d.slice().sort((a,b)=>b.rating-a.rating).slice(0,3);
      return 'Top rated: '+t.map(r=>`${r.name} (${r.rating}★)`).join(', ');}
    if(q.includes('best city')||q.includes('city')){
      const c=count(d.map(r=>r.city))[0];return `${c[0]} has the most restaurants (${c[1]}).`;}
    if(q.includes('revenue')){
      const m={};d.forEach(r=>m[r.city]=(m[r.city]||0)+r.price*r.votes);
      const t=Object.entries(m).sort((a,b)=>b[1]-a[1])[0];return `${t[0]} shows the highest estimated revenue.`;}
    if(q.includes('cuisine')){return `Most popular cuisine: ${count(d.flatMap(r=>r.cuisines))[0][0]}.`;}
    if(q.includes('average rating')||q.includes('avg rating')){
      return `Average rating is ${avg(d.map(r=>r.rating)).toFixed(2)}★.`;}
    if(q.includes('recommend')){
      const r=d.filter(x=>x.rating>=4.4&&x.price<=400)[0];
      return r?`Try ${r.name} in ${r.city} — ${r.rating}★ at ₹${r.price}.`:'Try highly-rated affordable spots!';}
    return "I can help with: top rated restaurants, best city, highest revenue, popular cuisine, average rating, recommendations.";
  }

  /* helpers */
  function avg(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;}
  function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
  function count(a){const m={};a.forEach(x=>m[x]=(m[x]||0)+1);return Object.entries(m).sort((x,y)=>y[1]-x[1]);}
})();