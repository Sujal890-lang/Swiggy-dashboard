/* ============================================================
   dashboard.js — KPIs, filters, table, pagination, export
   ============================================================ */
(function(){
  let filtered = [];
  const state = { page:1, perPage:10, sortKey:null, sortDir:1 };

  if (window.SwiggyData) {
    SwiggyData.onReady(() => setTimeout(init, 0));
  } else {
    document.addEventListener('data-ready', () => setTimeout(init, 0));
  }

  function init(){
    filtered = SwiggyData.raw.slice();
    buildFilterOptions();
    renderKPIs(filtered);
    bindFilters();
    buildTable();
    document.dispatchEvent(new CustomEvent('filtered', {detail:filtered}));
  }

  /* ---------- KPIs ---------- */
  function renderKPIs(d){
    const total = d.length;
    const avgRating = mean(d.map(r=>r.rating));
    const avgCost = mean(d.map(r=>r.price));
    const avgTime = mean(d.map(r=>r.time));
    const topRes = d.slice().sort((a,b)=>b.rating-a.rating)[0]||{};
    const cuisine = topCount(d.flatMap(r=>r.cuisines));
    const city = topCount(d.map(r=>r.city));
    const revCity = topRevenueCity(d);
    const satisfaction = (avgRating/5*100);
    const onlinePct = 92, bookingPct = 68; // representative service metrics

    const kpis = [
      ['fa-store','Total Restaurants',total,''],
      ['fa-star','Average Rating',avgRating.toFixed(2),'★'],
      ['fa-indian-rupee-sign','Average Cost',Math.round(avgCost),'₹'],
      ['fa-clock','Avg Delivery Time',Math.round(avgTime),' min'],
      ['fa-truck-fast','Online Delivery',onlinePct,'%'],
      ['fa-calendar-check','Table Booking',bookingPct,'%'],
      ['fa-trophy','Top Rated',topRes.name||'-',''],
      ['fa-utensils','Popular Cuisine',cuisine||'-',''],
      ['fa-city','Highest Revenue City',revCity||'-',''],
      ['fa-face-smile','Customer Satisfaction',satisfaction.toFixed(0),'%']
    ];
    const grid = document.getElementById('kpiGrid');
    grid.innerHTML = kpis.map(([ic,label,val,suf])=>`
      <div class="col-6 col-md-4 col-lg-2-4" data-aos="zoom-in">
        <div class="glass-card kpi-card">
          <div class="kpi-icon"><i class="fa-solid ${ic}"></i></div>
          <div class="kpi-value" data-count="${typeof val==='number'?val:''}">${typeof val==='number'?'0':val}${typeof val==='number'?suf:''}</div>
          <div class="kpi-label">${label}</div>
        </div>
      </div>`).join('');
    animateCounters();
  }

  function animateCounters(){
    document.querySelectorAll('.kpi-value[data-count]').forEach(el=>{
      const target = parseFloat(el.dataset.count); if(isNaN(target))return;
      const suf = el.textContent.replace(/[0-9.]/g,'');
      let cur=0, step=target/60;
      const t=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(t);}
        el.textContent = (target%1?cur.toFixed(2):Math.round(cur))+suf;},16);
    });
  }

  /* ---------- Filters ---------- */
  function buildFilterOptions(){
    fill('#fCity', SwiggyData.cities,'All Cities');
    fill('#fCuisine', SwiggyData.cuisines,'All Cuisines');
    fill('#pCity', SwiggyData.cities);
    fill('#pCuisine', SwiggyData.cuisines);
  }
  function fill(sel,arr,first){
    const el=document.querySelector(sel);
    el.innerHTML=(first?`<option value="">${first}</option>`:'')+arr.map(v=>`<option>${v}</option>`).join('');
  }
  function bindFilters(){
    ['fSearch','fCity','fCuisine','fRating','fCost'].forEach(id=>{
      document.getElementById(id).addEventListener('input',applyFilters);
    });
    document.getElementById('fRating').addEventListener('input',e=>fRatingVal.textContent=e.target.value);
    document.getElementById('fCost').addEventListener('input',e=>fCostVal.textContent=e.target.value);
    document.getElementById('fReset').addEventListener('click',()=>{
      fSearch.value='';fCity.value='';fCuisine.value='';fRating.value=0;fCost.value=2000;
      fRatingVal.textContent=0;fCostVal.textContent=2000;applyFilters();
    });
  }
  function applyFilters(){
    const q=fSearch.value.toLowerCase(), city=fCity.value, cui=fCuisine.value,
          minR=+fRating.value, maxC=+fCost.value;
    filtered = SwiggyData.raw.filter(r=>
      (!q||r.name.toLowerCase().includes(q)) &&
      (!city||r.city===city) &&
      (!cui||r.cuisines.includes(cui)) &&
      r.rating>=minR && r.price<=maxC);
    renderKPIs(filtered);
    state.page=1; buildTable();
    document.dispatchEvent(new CustomEvent('filtered', {detail:filtered}));
  }

  /* ---------- Table ---------- */
  function buildTable(){
    let data = filtered.slice();
    const q=(document.getElementById('tblSearch').value||'').toLowerCase();
    if(q) data=data.filter(r=>(r.name+r.city+r.cuisines.join()).toLowerCase().includes(q));
    if(state.sortKey) data.sort((a,b)=>{
      const va=a[state.sortKey],vb=b[state.sortKey];
      return (va>vb?1:va<vb?-1:0)*state.sortDir;
    });
    const start=(state.page-1)*state.perPage;
    const pageData=data.slice(start,start+state.perPage);
    document.querySelector('#restaurantTable tbody').innerHTML = pageData.map(r=>`
      <tr>
        <td>${r.name}</td><td>${r.city}</td><td>${r.primaryCuisine}</td>
        <td><span class="text-orange">★ ${r.rating}</span></td>
        <td>${r.votes}</td><td>₹${r.price}</td><td>${r.time} min</td>
      </tr>`).join('');
    renderPagination(data.length);
  }
  function renderPagination(len){
    const pages=Math.ceil(len/state.perPage);
    const bar=document.getElementById('pagination');
    let html=''; const cur=state.page;
    for(let i=1;i<=pages;i++){
      if(i===1||i===pages||Math.abs(i-cur)<=1)
        html+=`<button class="${i===cur?'active':''}" data-p="${i}">${i}</button>`;
      else if(Math.abs(i-cur)===2) html+=`<span>…</span>`;
    }
    bar.innerHTML=html;
    bar.querySelectorAll('button').forEach(b=>b.onclick=()=>{state.page=+b.dataset.p;buildTable();});
  }

  /* Table interactions */
  document.addEventListener('DOMContentLoaded',()=>{
    document.getElementById('tblSearch').addEventListener('input',()=>{state.page=1;buildTable();});
    document.querySelectorAll('#restaurantTable th[data-sort]').forEach(th=>{
      th.onclick=()=>{const k=th.dataset.sort;
        state.sortDir = state.sortKey===k?-state.sortDir:1; state.sortKey=k; buildTable();};
    });
    document.getElementById('exportCsv').onclick=exportCSV;
    document.getElementById('downloadReport').onclick=()=>window.print();
  });
  function exportCSV(){
    const rows=[['Restaurant','City','Cuisine','Rating','Votes','Cost','DeliveryTime'],
      ...filtered.map(r=>[r.name,r.city,r.primaryCuisine,r.rating,r.votes,r.price,r.time])];
    const csv=rows.map(r=>r.map(c=>`"${c}"`).join(',')).join('\n');
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));
    a.download='swiggy_filtered.csv';a.click();
  }

  /* ---------- helpers ---------- */
  function mean(a){return a.length?a.reduce((x,y)=>x+y,0)/a.length:0;}
  function topCount(a){const m={};a.forEach(x=>m[x]=(m[x]||0)+1);
    return Object.entries(m).sort((x,y)=>y[1]-x[1])[0]?.[0];}
  function topRevenueCity(d){const m={};
    d.forEach(r=>m[r.city]=(m[r.city]||0)+r.price*r.votes);
    return Object.entries(m).sort((a,b)=>b[1]-a[1])[0]?.[0];}
})();