/* ============================================================
   three-scene.js — particle background + hero 3D delivery box
   ============================================================ */
(function(){
  /* ---- Particle background ---- */
  const bg=document.getElementById('bg-canvas');
  const rB=new THREE.WebGLRenderer({canvas:bg,alpha:true,antialias:true});
  rB.setSize(innerWidth,innerHeight);
  const sB=new THREE.Scene(), cB=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,1000);
  cB.position.z=5;
  const geo=new THREE.BufferGeometry();
  const N=900, pos=new Float32Array(N*3);
  for(let i=0;i<N*3;i++)pos[i]=(Math.random()-.5)*18;
  geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const mat=new THREE.PointsMaterial({color:0xFC8019,size:.03,transparent:true,opacity:.7});
  const pts=new THREE.Points(geo,mat); sB.add(pts);

  /* ---- Hero rotating box ---- */
  const host=document.getElementById('hero-3d');
  const rH=new THREE.WebGLRenderer({alpha:true,antialias:true});
  rH.setSize(host.clientWidth,host.clientHeight); host.appendChild(rH.domElement);
  const sH=new THREE.Scene(), cH=new THREE.PerspectiveCamera(60,host.clientWidth/host.clientHeight,.1,100);
  cH.position.z=6;
  const box=new THREE.Mesh(new THREE.BoxGeometry(2.2,2.2,2.2),
    new THREE.MeshStandardMaterial({color:0xFC8019,metalness:.4,roughness:.25,emissive:0x521f00}));
  const wire=new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry),
    new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.3}));
  box.add(wire); sH.add(box);
  sH.add(new THREE.AmbientLight(0xffffff,.6));
  const dl=new THREE.DirectionalLight(0xffffff,1.2); dl.position.set(5,5,5); sH.add(dl);
  // floating spheres (food items)
  const orbs=[];
  for(let i=0;i<6;i++){
    const o=new THREE.Mesh(new THREE.SphereGeometry(.28,24,24),
      new THREE.MeshStandardMaterial({color:0xff9d4d,emissive:0x3a1500}));
    o.position.set(Math.cos(i)*3,Math.sin(i*1.3)*2,Math.sin(i)*2); sH.add(o); orbs.push(o);
  }

  let mx=0,my=0;
  addEventListener('mousemove',e=>{mx=(e.clientX/innerWidth-.5);my=(e.clientY/innerHeight-.5);});

  (function loop(t){
    requestAnimationFrame(loop); t*=0.001;
    pts.rotation.y=t*0.05; pts.rotation.x=my*0.3;
    box.rotation.y=t*0.6; box.rotation.x=t*0.3+my*0.4;
    cH.position.x+= (mx*2-cH.position.x)*0.05;
    orbs.forEach((o,i)=>{o.position.y=Math.sin(t+i)*1.8; o.rotation.y=t;});
    rB.render(sB,cB); rH.render(sH,cH);
  })(0);

  addEventListener('resize',()=>{
    rB.setSize(innerWidth,innerHeight); cB.aspect=innerWidth/innerHeight; cB.updateProjectionMatrix();
    rH.setSize(host.clientWidth,host.clientHeight); cH.aspect=host.clientWidth/host.clientHeight; cH.updateProjectionMatrix();
  });
})();