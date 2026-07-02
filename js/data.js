/* ============================================================
   data.js — loads & cleans the Swiggy dataset
   ============================================================ */
window.SwiggyData = {
  raw: [],        // cleaned records
  cities: [],
  cuisines: [],
  ready: false,
  callbacks: [],
  onReady(cb){ this.ready ? cb() : this.callbacks.push(cb); }
};

/* CSV columns: ID,Area,City,Restaurant,Price,Avg ratings,Total ratings,Food type,Address,Delivery time */
function cleanRecord(r){
  const price = parseFloat(r['Price']) || 0;
  const rating = parseFloat(r['Avg ratings']) || 0;
  const votes = parseInt(r['Total ratings']) || 0;
  const time = parseInt(r['Delivery time']) || 0;
  // cuisines can be comma or double-space separated
  let cuisines = (r['Food type']||'').split(/,|\s{2,}/).map(c=>c.trim()).filter(Boolean);
  return {
    id:r['ID'], area:r['Area'], city:(r['City']||'').trim(),
    name:(r['Restaurant']||'').trim(), price, rating, votes,
    cuisines, primaryCuisine: cuisines[0]||'Other',
    address:r['Address'], time,
    'Restaurant':(r['Restaurant']||'').trim(),
    'City':(r['City']||'').trim(),
    'Food type':(r['Food type']||''),
    'Avg ratings':rating,'Total ratings':votes,'Price':price,'Delivery time':time
  };
}

function loadData(){
  Papa.parse('data/swiggy.csv', {
    download:true, header:true, skipEmptyLines:true,
    complete(res){
      const clean = res.data
        .filter(r=>r['Restaurant'] && parseFloat(r['Price'])>0)
        .map(cleanRecord)
        .filter(r=>r.rating>0);
      SwiggyData.raw = clean;
      SwiggyData.cities = [...new Set(clean.map(r=>r.city))].sort();
      SwiggyData.cuisines = [...new Set(clean.flatMap(r=>r.cuisines))].sort();
      SwiggyData.ready = true;
      SwiggyData.callbacks.forEach(cb=>cb());
      document.dispatchEvent(new Event('data-ready'));
    },
    error(){ console.error('CSV load failed — falling back to embedded sample.'); }
  });
}
loadData();