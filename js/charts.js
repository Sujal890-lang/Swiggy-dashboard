/* ============================================================
   charts.js — Chart.js visualizations (re-render on filter)
   ============================================================ */
(function(){
  const charts={};
  const O='#FC8019', OG='rgba(252,128,25,.6)';
  Chart.defaults.color='#aaa'; Chart.defaults.borderColor='rgba(255,255,255,.08)';

  document.addEventListener('filtered', e=>render(e.detail));

  function grpCount(d,key){const m={};d.forEach(r=>{const k=r[key];m[k]=(m[k]||0)+1;});return m;}
  function topN(obj,n){return Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,n);}
  function mk(id,cfg){ if(charts[id])charts[id].destroy();
    const c=document.getElementById(id); if(c) charts[id]=new Chart(c,cfg);}

  function render(d){
    // Top 10 cities
    const cities=topN(grpCount(d,'city'),10);
    mk('chartCities',{type:'bar',data:{labels:cities.map(c=>c[0]),
      datasets:[{data:cities.map(c=>c[1]),backgroundColor:OG,borderColor:O,borderWidth:1,borderRadius:8}]},
      options:opt()});

    // Cuisine distribution (donut)
    const cui=topN(grpCount({map:0,...d}?d.reduce?d:{}:{},'')||{}, 0); // guard
    const cuisineCount={}; d.forEach(r=>r.cuisines.forEach(c=>cuisineCount[c]=(cuisineCount[c]||0)+1));
    const topCui=topN(cuisineCount,8);
    mk('chartCuisine',{type:'doughnut',data:{labels:topCui.map(c=>c[0]),
      datasets:[{data:topCui.map(c=>c[1]),backgroundColor:palette(topCui.length)}]},
      options:{plugins:{legend:{position:'right'}}}});

    // Rating distribution (histogram-ish)
    const bins={'<3':0,'3-3.5':0,'3.5-4':0,'4-4.5':0,'4.5+':0};
    d.forEach(r=>{const x=r.rating;
      if(x<3)bins['<3']++;else if(x<3.5)bins['3-3.5']++;else if(x<4)bins['3.5-4']++;
      else if(x<4.5)bins['4-4.5']++;else bins['4.5+']++;});
    mk('chartRating',{type:'bar',data:{labels:Object.keys(bins),
      datasets:[{data:Object.values(bins),backgroundColor:OG,borderColor:O,borderRadius:8}]},options:opt()});

    // Scatter cost vs rating
    mk('chartScatter',{type:'scatter',data:{datasets:[{
      data:d.map(r=>({x:r.price,y:r.rating})),backgroundColor:OG}]},
      options:{scales:{x:{title:{display:true,text:'Cost ₹'}},y:{title:{display:true,text:'Rating'},min:2,max:5}},
        plugins:{legend:{display:false}}}});

    // Avg cost by city (top 8)
    const cCost={},cN={}; d.forEach(r=>{cCost[r.city]=(cCost[r.city]||0)+r.price;cN[r.city]=(cN[r.city]||0)+1;});
    const avgCost=topN(Object.fromEntries(Object.keys(cCost).map(k=>[k,cCost[k]/cN[k]])),8);
    mk('chartCostCity',{type:'line',data:{labels:avgCost.map(c=>c[0]),
      datasets:[{data:avgCost.map(c=>Math.round(c[1])),borderColor:O,backgroundColor:OG,fill:true,tension:.4}]},options:opt()});

    // Radar delivery time by top 6 cities
    const cT={},ct={}; d.forEach(r=>{cT[r.city]=(cT[r.city]||0)+r.time;ct[r.city]=(ct[r.city]||0)+1;});
    const rad=topN(grpCount(d,'city'),6).map(c=>[c[0],cT[c[0]]/ct[c[0]]]);
    mk('chartRadar',{type:'radar',data:{labels:rad.map(c=>c[0]),
      datasets:[{data:rad.map(c=>Math.round(c[1])),borderColor:O,backgroundColor:'rgba(252,128,25,.25)'}]},
      options:{plugins:{legend:{display:false}}}});
  }

  function opt(){return{plugins:{legend:{display:false}},scales:{x:{grid:{display:false}}}};}
  function palette(n){const base=['#FC8019','#ff9d4d','#ffb877','#d95f00','#ffc899','#e57200','#ffdcb3','#b34d00'];
    return Array.from({length:n},(_, i)=>base[i%base.length]);}
})();