import * as THREE from 'three';

const classes = [
  {id:'heli',name:'HELI',label:'HELICOPTER',glyph:'✣',crew:'02'},
  {id:'car',name:'CAR',label:'WEAPONIZED CAR',glyph:'◈',crew:'02'},
  {id:'plane',name:'AIR',label:'WARPLANE',glyph:'✈',crew:'01'},
  {id:'tank',name:'TANK',label:'MAIN BATTLE TANK',glyph:'▰',crew:'04'},
  {id:'mlrs',name:'MLRS',label:'ROCKET ARTILLERY',glyph:'▥',crew:'03'},
  {id:'apc',name:'APC',label:'ARMORED CARRIER',glyph:'▱',crew:'08'},
  {id:'ship',name:'SHIP',label:'WARSHIP',glyph:'⚓',crew:'80'}
];
const vehicles = [
  {id:'falcon',name:'FALCON H-6',class:'heli',sub:'ATTACK HELICOPTER',speed:76,armor:62,color:0x777e50},
  {id:'viper',name:'VIPER AH-1',class:'heli',sub:'LIGHT GUNSHIP',speed:105,armor:48,color:0x696b48},
  {id:'atlas',name:'ATLAS K-90',class:'heli',sub:'HEAVY LIFTER',speed:64,armor:84,color:0x6e7659},
  {id:'ranger',name:'RANGER 4X4',class:'car',sub:'RECON PATROL',speed:138,armor:35,color:0x858052},
  {id:'nomad',name:'NOMAD MRAP',class:'car',sub:'ARMORED SCOUT',speed:112,armor:67,color:0x777d58},
  {id:'jackal',name:'JACKAL R-7',class:'car',sub:'STRIKE BUGGY',speed:154,armor:31,color:0x81764c},
  {id:'spectre',name:'SPECTRE F-22',class:'plane',sub:'AIR SUPERIORITY',speed:680,armor:47,color:0x666d6a},
  {id:'thunder',name:'THUNDER A-10',class:'plane',sub:'GROUND SUPPORT',speed:530,armor:83,color:0x737652},
  {id:'arrow',name:'ARROW J-11',class:'plane',sub:'MULTIROLE FIGHTER',speed:745,armor:42,color:0x788087},
  {id:'abrams',name:'M1A2 ABRAMS',class:'tank',sub:'MAIN BATTLE TANK',speed:68,armor:96,color:0x777e4e},
  {id:'leopard',name:'LEOPARD 2A7',class:'tank',sub:'MAIN BATTLE TANK',speed:72,armor:92,color:0x8a855d},
  {id:'challenger',name:'CHALLENGER X',class:'tank',sub:'HEAVY ARMOR',speed:59,armor:99,color:0x68734d},
  {id:'storm',name:'STORM M270',class:'mlrs',sub:'ROCKET ARTILLERY',speed:58,armor:71,color:0x656e4c},
  {id:'volcano',name:'VOLCANO TOS-1',class:'mlrs',sub:'SALVO LAUNCHER',speed:51,armor:79,color:0x807550},
  {id:'thunderer',name:'THUNDERER K9',class:'mlrs',sub:'FIELD ARTILLERY',speed:63,armor:72,color:0x707959},
  {id:'guardian',name:'GUARDIAN APC',class:'apc',sub:'ARMORED TRANSPORT',speed:82,armor:86,color:0x69734d},
  {id:'stryker',name:'STRYKER M12',class:'apc',sub:'WHEELED CARRIER',speed:98,armor:75,color:0x777e5a},
  {id:'bison',name:'BISON IFV',class:'apc',sub:'INFANTRY FIGHTING',speed:76,armor:88,color:0x777c50},
  {id:'tide',name:'TIDE BREAKER',class:'ship',sub:'COASTAL PATROL',speed:72,armor:64,color:0x66736d},
  {id:'trident',name:'TRIDENT DDG',class:'ship',sub:'MISSILE DESTROYER',speed:58,armor:87,color:0x697574},
  {id:'leviathan',name:'LEVIATHAN',class:'ship',sub:'HEAVY FRIGATE',speed:48,armor:94,color:0x5c696b}
];
const maps = [
  {name:'DUSTLINE DESERT',short:'DUSTLINE',title:'DESERT',coord:"34° 12' N / 39° 48' E",desc:'An open expanse of sun-baked terrain. Long sightlines, hard cover, and shifting dunes.',weather:'CLEAR · 31°C',sky:0xb8a77c,fog:0xb4a078,ground:0x82744d,accent:'#827450',top:'radial-gradient(ellipse at 68% 46%,#827450 0,#716c49 22%,#5f6746 44%,#414d3d 73%,#303b32 100%)'},
  {name:'FROSTFALL RIDGE',short:'FROSTFALL',title:'RIDGE',coord:"62° 43' N / 18° 21' E",desc:'A high-altitude mountain pass of frozen rock and pine forest. Keep your footing.',weather:'OVERCAST · −8°C',sky:0x81919b,fog:0x9ba5a2,ground:0x69766f,accent:'#788887',top:'radial-gradient(ellipse at 66% 42%,#98aaa8 0,#738985 25%,#4c6057 51%,#35483f 78%,#27362f 100%)'},
  {name:'BROKEN COAST',short:'BROKEN',title:'COAST',coord:"12° 08' N / 127° 33' E",desc:'A scattered island chain in contested waters. The tide is turning; stay alert.',weather:'HUMID · 27°C',sky:0x8ba9a5,fog:0x77938b,ground:0x697952,accent:'#557e78',top:'radial-gradient(ellipse at 68% 44%,#6b8a78 0,#526f65 24%,#40594d 49%,#35483f 75%,#293a32 100%)'}
];
const $ = s => document.querySelector(s);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(54, innerWidth/innerHeight,.1,900);
const renderer = new THREE.WebGLRenderer({canvas:$('#world'),antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.7)); renderer.setSize(innerWidth,innerHeight); renderer.shadowMap.enabled=true; renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.15;
scene.add(new THREE.HemisphereLight(0xdce5d2,0x353c2d,2.1));
const sun=new THREE.DirectionalLight(0xffe6bd,3.2); sun.position.set(-45,70,30);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-100;sun.shadow.camera.right=100;sun.shadow.camera.top=100;sun.shadow.camera.bottom=-100;scene.add(sun);
let currentMap=0,currentClass='tank',selected=vehicles[9],mode='menu',worldGroup=null,vehicleRoot=null,vehicleModel=null,clock=new THREE.Clock();
let targets=[],projectiles=[],effects=[],held=new Set(),touchHeld=new Set(),elapsed=0,health=100,score=0,toastTimer=0,menuSpin=0,paused=false;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const mat=(color,roughness=.82,metalness=.1)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const oliveMat=()=>mat(0x5e6946,.75,.22),darkMat=()=>mat(0x252c25,.95,.1),glassMat=()=>new THREE.MeshStandardMaterial({color:0x637773,metalness:.6,roughness:.28,transparent:true,opacity:.75});
function mesh(geometry,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m}
function box(parent,x,y,z,sx,sy,sz,material){return mesh(new THREE.BoxGeometry(sx,sy,sz),material,parent,x,y,z)}
function cylinder(parent,x,y,z,r1,r2,h,material,segments=12){const m=mesh(new THREE.CylinderGeometry(r1,r2,h,segments),material,parent,x,y,z);return m}
function addVehicle(type,preview=false){
  const g=new THREE.Group(), paint=mat(type.color,.72,.26), dark=darkMat(), glass=glassMat(), rubber=mat(0x1d211e,1,0), metal=mat(0x495044,.58,.55);
  const wheel=(x,y,z,r=.34)=>{const w=mesh(new THREE.CylinderGeometry(r,r,.2,12),dark,g,x,y,z);w.rotation.z=Math.PI/2;return w};
  if(type.class==='tank'||type.class==='mlrs'||type.class==='apc'){
    const width=type.class==='apc'?1.5:1.75, length=type.class==='mlrs'?3.2:3.55;
    box(g,0,.68,0,width,.62,length,paint);box(g,0,.37,0,width+.14,.26,length-.15,dark);
    for(const side of [-1,1]){
      box(g,side*(width/2+.04),.35,0,.14,.42,length-.23,metal);
      for(let i=0;i<6;i++)wheel(side*(width/2+.11),.33,-1.28+i*.5,.27);
      for(let i=0;i<5;i++)cylinder(g,side*(width/2+.13),.34,-1.06+i*.53,.043,.043,.035,mat(0xa6a386),8).rotation.z=Math.PI/2;
    }
    if(type.class==='mlrs'){
      box(g,0,1.12,-.27,1.05,.5,1.65,paint).rotation.x=-.26;
      for(let row=0;row<3;row++)for(let col=0;col<4;col++){
        const tube=cylinder(g,-.39+col*.26,1.34+row*.13,.43,.105,.105,.94,metal,10);tube.rotation.x=Math.PI/2-.28;
        cylinder(g,-.39+col*.26,1.34+row*.13,.92,.11,.11,.035,dark,10).rotation.x=Math.PI/2-.28;
      }
    } else if(type.class==='apc'){
      box(g,0,1.14,-.12,1.25,.62,1.95,paint);box(g,0,1.48,-.02,1.04,.12,1.35,glass);box(g,0,1.53,.61,.96,.58,.1,paint);
      const turret=cylinder(g,0,1.63,.18,.48,.5,.24,paint,14);box(g,0,1.78,.57,.11,.12,.8,metal);
    } else {
      cylinder(g,0,1.12,-.15,.66,.72,.44,paint,16);box(g,0,1.35,-.18,.92,.19,1.04,paint);
      const barrel=box(g,0,1.38,.8,.14,.15,1.25,metal);box(g,0,1.38,1.4,.18,.2,.17,dark);
    }
  } else if(type.class==='car'){
    box(g,0,.48,0,1.6,.48,2.9,paint);box(g,0,.9,-.15,1.28,.55,1.35,paint);box(g,0,.98,.12,1.12,.33,.84,glass);
    for(const side of [-1,1])for(const z of [-.93,.98]){wheel(side*.83,.4,z,.37);box(g,side*.88,.63,z,.14,.22,.59,paint)}
    box(g,0,1.28,-.35,.53,.2,.53,dark);box(g,0,1.47,.05,.1,.11,1.3,metal);
    if(type.id==='jackal'){box(g,0,.96,-.95,.16,.12,.7,metal);box(g,0,.96,-1.24,.5,.08,.08,dark)}
    else{box(g,0,1.34,.08,.45,.16,.55,paint);box(g,0,1.43,.5,.1,.11,.78,metal)}
    for(const side of [-1,1])box(g,side*.56,.75,.35,.15,.13,.25,dark);
  } else if(type.class==='heli'){
    const body=mesh(new THREE.SphereGeometry(1,16,12),paint,g,0,.93,-.02);body.scale.set(.67,.53,1.18);
    const cockpit=mesh(new THREE.SphereGeometry(1,14,10),glass,g,0,1.03,.82);cockpit.scale.set(.53,.37,.49);
    box(g,0,.93,-1.42,.16,.16,2.2,paint);mesh(new THREE.SphereGeometry(.18,10,8),paint,g,0,.93,-2.52).scale.set(.7,.7,1);
    const fin=box(g,0,1.1,-2.08,.72,.08,.34,paint);fin.rotation.z=.1;
    const mast=cylinder(g,0,1.53,-.05,.055,.055,.52,metal,10);
    const rotor=new THREE.Group();rotor.position.set(0,1.82,-.05);g.add(rotor);
    for(let i=0;i<4;i++){const blade=box(rotor,0,0,1.56,.14,.055,2.8,dark);blade.rotation.y=i*Math.PI/2}
    box(g,.75,.68,.05,.56,.14,.25,metal);box(g,-.75,.68,.05,.56,.14,.25,metal);
    const skid1=box(g,-.42,.34,.05,.08,.08,2.1,dark);const skid2=box(g,.42,.34,.05,.08,.08,2.1,dark);
    for(const x of [-.42,.42]){const strut=box(g,x,.5,.5,.07,.45,.07,metal);strut.rotation.x=-.2;const strut2=box(g,x,.5,-.4,.07,.45,.07,metal);strut2.rotation.x=.2}
    g.userData.rotor=rotor;
  } else if(type.class==='plane'){
    const fus=mesh(new THREE.CylinderGeometry(.28,.38,3.65,12),paint,g,0,.56,0);fus.rotation.x=Math.PI/2;
    mesh(new THREE.SphereGeometry(.31,12,8),glass,g,0,.59,.78).scale.set(1,.7,.95);
    box(g,0,.53,.04,5.25,.13,.9,paint);box(g,0,.55,-1.48,2.15,.11,.6,paint);
    box(g,0,.74,-1.66,.15,.72,.22,paint);
    for(const side of [-1,1]){const pod=cylinder(g,side*.94,.3,.28,.13,.15,1.25,metal,10);pod.rotation.x=Math.PI/2;box(g,side*1.35,.39,.39,.08,.08,.7,dark)}
    box(g,0,.43,-1.63,1.08,.12,.45,paint);
  } else if(type.class==='ship'){
    const hull=box(g,0,.55,0,2.1,.72,4.5,paint);hull.scale.x=1;box(g,0,.94,-.44,1.52,.62,2.07,paint);box(g,0,1.35,.08,1.05,.56,.87,paint);
    box(g,0,1.43,.48,.82,.22,.08,glass);box(g,0,1.78,-.38,.08,.8,.08,metal);box(g,0,2.12,-.38,.06,.04,.06,dark);
    for(const z of [-1.25,.9]){cylinder(g,0,1.2,z,.33,.39,.28,metal,12);box(g,0,1.34,z+.23,.08,.08,.52,dark)}
    box(g,0,.2,-.25,1.8,.22,3.9,dark);
  }
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
  return g;
}
function addTerrain(index){
  if(worldGroup){scene.remove(worldGroup);worldGroup.traverse(o=>{if(o.geometry)o.geometry.dispose()});}
  worldGroup=new THREE.Group();scene.add(worldGroup);const map=maps[index];scene.background=new THREE.Color(map.sky);scene.fog=new THREE.Fog(map.fog,55,210);
  const sea=index===2;
  const groundMat=mat(map.ground,.98,0);groundMat.vertexColors=true;
  const size=220,segments=104,geo=new THREE.PlaneGeometry(size,size,segments,segments);geo.rotateX(-Math.PI/2);
  const pos=geo.attributes.position,colors=[];const c1=new THREE.Color(map.ground),c2=new THREE.Color(index===0?0x9a8658:index===1?0x9aa9a2:0x637b50),c3=new THREE.Color(index===0?0x574e38:index===1?0x435248:0x344c3c);
  for(let i=0;i<pos.count;i++){
    const x=pos.getX(i),z=pos.getZ(i),r=Math.sqrt(x*x+z*z);let h=0;
    if(index===0)h=Math.sin(x*.065+Math.sin(z*.04))*1.8+Math.cos(z*.092+x*.025)*1.25+Math.sin((x+z)*.034)*1.2;
    if(index===1)h=Math.max(0,Math.sin((x+z)*.022)*6+Math.cos(x*.037-z*.016)*4+Math.sin(z*.055)*2.1);
    if(index===2){h=Math.max(0,(22-r)*.47)+Math.sin(x*.13)*.75+Math.cos(z*.17)*.55;if(r>24)h=-.4;}
    pos.setY(i,h);
    const detail=(Math.sin(x*.7)*Math.cos(z*.63)+Math.sin((x+z)*.23))*.09;const cc=(h+detail>1.3)?c2:(h+detail<-.4?c3:c1);colors.push(cc.r,cc.g,cc.b);
  }
  geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.computeVertexNormals();
  const terrain=mesh(geo,groundMat,worldGroup,0,0,0);terrain.receiveShadow=true;
  if(sea){const water=mesh(new THREE.PlaneGeometry(700,700),new THREE.MeshStandardMaterial({color:0x315e67,roughness:.32,metalness:.18,transparent:true,opacity:.9}),worldGroup,0,-.7,0);water.rotation.x=-Math.PI/2;water.position.y=-.72;}
  // scattered rocks, ridge formations and sparse cover make the horizon legible
  const rng=(n)=>{const x=Math.sin(n*127.1+index*73.9)*43758.5453;return x-Math.floor(x)};
  for(let i=0;i<86;i++){
    const x=(rng(i+3)-.5)*175,z=(rng(i+151)-.5)*175;if(Math.abs(x)<8&&Math.abs(z)<12)continue;
    let y=index===1?Math.max(0,Math.sin((x+z)*.022)*6+Math.cos(x*.037-z*.016)*4+Math.sin(z*.055)*2.1):index===2?Math.max(0,(22-Math.hypot(x,z))*.47):0;
    const color=index===0?[0x766c4e,0x5f5a41,0x8b7b55][i%3]:index===1?[0x536159,0x718078,0x46534a][i%3]:[0x4c5e45,0x666c4c,0x8a8060][i%3];
    if(index===2&&Math.hypot(x,z)>25)continue;
    const rock=mesh(new THREE.DodecahedronGeometry(.6+rng(i+255)*1.1,0),mat(color,.96),worldGroup,x,y+.25,z);rock.scale.set(1+rng(i+433),.35+rng(i+5)*.8,1+rng(i+72));rock.rotation.y=rng(i+28)*6;
  }
  if(index===1){for(let i=0;i<20;i++){const x=(rng(i+800)-.5)*95,z=(rng(i+900)-.5)*95;if(Math.abs(x)<10&&Math.abs(z)<12)continue;const trunk=cylinder(worldGroup,x,.6,z,.11,.18,1.2,mat(0x514638),7);const crown=mesh(new THREE.ConeGeometry(.8,2.8,7),mat(0x34483d),worldGroup,x,2.1,z);crown.rotation.z=(rng(i+4)-.5)*.1;}}
  // low concrete cover and navigation beacons
  for(let i=0;i<9;i++){const x=(rng(i+32)-.5)*90,z=(rng(i+64)-.5)*90;if(Math.abs(x)<12&&Math.abs(z)<15)continue;const b=box(worldGroup,x,.4,z,2.4,.8,1.1,mat(index===0?0x756d56:index===1?0x59645f:0x606950));b.rotation.y=rng(i+212)*Math.PI;}
}
function setMapVisual(){
  const map=maps[currentMap];$('#map-visual').style.background=map.top;$('#map-index').textContent=`THEATER 0${currentMap+1} / 03`;
  $('#map-name').innerHTML=`${map.short}<br><em>${map.title}</em>`;$('#map-desc').textContent=map.desc;$('#map-coord').textContent=map.coord;$('#weather').textContent=map.weather;
  $('#map-dots').innerHTML=maps.map((m,i)=>`<button class="map-dot ${i===currentMap?'active':''}" aria-label="${m.name}" data-map="${i}"></button>`).join('');
  $('#map-dots').querySelectorAll('button').forEach(b=>b.onclick=()=>chooseMap(+b.dataset.map));$('#game-map-name').textContent=map.name;
}
function chooseMap(i){currentMap=(i+maps.length)%maps.length;setMapVisual();addTerrain(currentMap);setupMenuShowcase();}
function renderClasses(){
  $('#class-tabs').innerHTML=classes.map(c=>`<button class="class-tab ${c.id===currentClass?'active':''}" role="tab" aria-selected="${c.id===currentClass}" data-class="${c.id}"><span class="class-glyph">${c.glyph}</span><small>${c.name}</small></button>`).join('');
  $('#class-tabs').querySelectorAll('button').forEach(b=>b.onclick=()=>chooseClass(b.dataset.class));
  const list=vehicles.filter(v=>v.class===currentClass);$('#vehicle-count').textContent=`${list.length} UNITS`;$('#vehicle-grid').innerHTML=list.map((v,i)=>`<button class="vehicle-card ${v.id===selected.id?'selected':''}" data-id="${v.id}"><span class="card-top"><span>UNIT 0${i+1}</span><span class="card-mark">${classes.find(c=>c.id===v.class).glyph}</span></span><strong>${v.name}</strong><small>${v.sub}</small><span class="selected-check">✓</span></button>`).join('');
  $('#vehicle-grid').querySelectorAll('button').forEach(b=>b.onclick=()=>selectVehicle(vehicles.find(v=>v.id===b.dataset.id)));
}
function chooseClass(id){currentClass=id;const first=vehicles.find(v=>v.class===id);if(first)selected=first;renderClasses();updateSelected();setupMenuShowcase();}
function selectVehicle(v){selected=v;currentClass=v.class;renderClasses();updateSelected();setupMenuShowcase();}
function updateSelected(){const info=classes.find(c=>c.id===selected.class);$('#selected-name').textContent=selected.name;$('#selected-crew').innerHTML=`${info.crew} <span>PERSONNEL</span>`;}
function setupMenuShowcase(){
  if(vehicleRoot){scene.remove(vehicleRoot);vehicleRoot=null;}
  if(mode!=='menu')return;
  const stand=new THREE.Group();stand.position.set(6,0,0);worldGroup.add(stand);
  const plinth=cylinder(stand,0,.1,0,3.8,4.1,.28,mat(0x252d24,.55,.42),48);
  const ring=mesh(new THREE.TorusGeometry(3.55,.035,6,64),mat(0xb9c45e,.4,.55),stand,0,.27,0);ring.rotation.x=Math.PI/2;
  const model=addVehicle(selected,true);model.position.set(6,.28,0);stand.add(model);vehicleRoot=stand;vehicleRoot.userData.model=model;
}
function setupTargets(){
  targets=[];
  const positions=[[-5,0,18],[-1.8,0,24],[2.5,0,28],[7,0,34],[-9,0,39]];
  positions.forEach((p,i)=>{
    const group=new THREE.Group();group.position.set(...p);worldGroup.add(group);
    const post=box(group,0,.85,0,.12,1.7,.12,mat(0x555c48));
    const board=box(group,0,1.65,0,1.15,.85,.16,mat(i%2?0xa9a080:0xc2b286));
    const disc=mesh(new THREE.CircleGeometry(.27,24),mat(0x9a5c43),group,0,1.65,.095);disc.scale.set(1,1,1);
    const bull=mesh(new THREE.CircleGeometry(.11,20),mat(0xd8d0b1),group,0,1.65,.105);
    const cap=box(group,0,2.19,0,.2,.08,.2,mat(0x72795e));
    group.userData={alive:true,phase:i*1.6,index:i};targets.push(group);
  });
  updateTargetCount();
}
function updateTargetCount(){const n=targets.filter(t=>t.userData.alive).length;$('#target-count').textContent=n?`· ${n} targets remaining`:'· sector clear';}
function clearTransient(){for(const p of projectiles)scene.remove(p.mesh);for(const e of effects)scene.remove(e.mesh);projectiles=[];effects=[];}
function startGame(){
  mode='game';paused=false;$('#menu').classList.add('hidden');$('#game-ui').classList.remove('hidden');$('#pause-overlay').classList.add('hidden');$('#loading-overlay').classList.remove('hidden');
  setTimeout(()=>{
    addTerrain(currentMap);clearTransient();setupTargets();health=100;score=0;elapsed=0;
    $('#hud-vehicle').textContent=selected.name;$('#hud-class').textContent=classes.find(c=>c.id===selected.class).label;$('#health-value').textContent='100%';$('#health-bar').style.width='100%';$('#game-map-name').textContent=maps[currentMap].name;$('#speed-value').textContent='000';
    vehicleRoot=new THREE.Group();worldGroup.add(vehicleRoot);vehicleRoot.position.set(0,0,0);vehicleModel=addVehicle(selected);vehicleRoot.add(vehicleModel);
    if(selected.class==='heli'||selected.class==='plane')vehicleRoot.position.y=selected.class==='plane'?8:4.2;
    camera.position.set(0,6,-12);camera.lookAt(0,1,4);$('#loading-overlay').classList.add('hidden');$('#back-button').focus();
  },420);
}
function returnToMenu(){mode='menu';paused=false;held.clear();touchHeld.clear();$('#game-ui').classList.add('hidden');$('#pause-overlay').classList.add('hidden');$('#menu').classList.remove('hidden');clearTransient();addTerrain(currentMap);setupMenuShowcase();camera.position.set(0,16,30);camera.lookAt(4,1,0);}
let velocity=0,fireCooldown=0,turn=0;
function fire(){
  if(mode!=='game'||paused||fireCooldown>0)return;fireCooldown=selected.class==='mlrs'?.75:.22;
  const origin=vehicleRoot.position.clone().add(new THREE.Vector3(0,selected.class==='plane'?1.1:1.55,0));origin.add(new THREE.Vector3(Math.sin(vehicleRoot.rotation.y)*1.6,0,Math.cos(vehicleRoot.rotation.y)*1.6));
  let direction=new THREE.Vector3(Math.sin(vehicleRoot.rotation.y),selected.class==='plane'?.02:0,Math.cos(vehicleRoot.rotation.y));
  let candidate=null,best=.55;
  for(const t of targets){if(!t.userData.alive)continue;const point=t.position.clone().add(new THREE.Vector3(0,1.65,0)),to=point.sub(origin),distance=to.length(),angle=direction.angleTo(to.clone().normalize());if(angle<best&&distance<72){best=angle;candidate=to.normalize();}}
  if(candidate)direction=candidate;
  const bullet=mesh(new THREE.SphereGeometry(selected.class==='mlrs'?.2:.095,8,6),new THREE.MeshBasicMaterial({color:selected.class==='mlrs'?0xffa35c:0xffe6a3}),scene,origin.x,origin.y,origin.z);
  bullet.material.color.setHex(selected.class==='mlrs'?0xff8c45:0xffe5a0);
  projectiles.push({mesh:bullet,velocity:direction.multiplyScalar(selected.class==='mlrs'?43:72),life:2.1});
  if(selected.class==='heli'&&vehicleModel?.userData.rotor)vehicleModel.userData.rotor.rotation.y+=Math.random()*.2;
}
function showToast(){const el=$('#target-toast');el.classList.add('show');toastTimer=1.6;}
function destroyTarget(target){target.userData.alive=false;target.visible=false;score+=100;updateTargetCount();showToast();
  const boom=mesh(new THREE.SphereGeometry(.22,12,8),new THREE.MeshBasicMaterial({color:0xffc477,transparent:true,opacity:.9}),scene,target.position.x,target.position.y+1,target.position.z);effects.push({mesh:boom,life:.42});
  if(targets.every(t=>!t.userData.alive)){ $('#target-toast').innerHTML='<span>✦</span> SECTOR CLEARED <b>+500</b>';score+=500;}
}
function setPaused(value){if(mode!=='game')return;paused=value;$('#pause-overlay').classList.toggle('hidden',!paused);held.clear();}
$('#play-button').addEventListener('click',startGame);
$('#prev-map').addEventListener('click',()=>chooseMap(currentMap-1));$('#next-map').addEventListener('click',()=>chooseMap(currentMap+1));$('#map-select').addEventListener('click',()=>chooseMap(currentMap+1));
$('#back-button').addEventListener('click',()=>setPaused(true));$('#resume-button').addEventListener('click',()=>setPaused(false));$('#pause-base').addEventListener('click',returnToMenu);
$('#fire-button').addEventListener('click',fire);$('#touch-fire').addEventListener('pointerdown',e=>{e.preventDefault();fire()});
window.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if([' ','arrowup','arrowdown','arrowleft','arrowright'].includes(key))e.preventDefault();if(key==='escape'||key==='p'){if(mode==='game')setPaused(!paused);return;}held.add(key);if(key===' '||key==='enter'&&mode==='game')fire();});
window.addEventListener('keyup',e=>held.delete(e.key.toLowerCase()));
window.addEventListener('blur',()=>held.clear());
document.querySelectorAll('[data-control]').forEach(button=>{
  const keyMap={forward:'w',back:'s',left:'a',right:'d'};const control=keyMap[button.dataset.control];
  button.addEventListener('pointerdown',e=>{e.preventDefault();button.setPointerCapture(e.pointerId);touchHeld.add(control)});
  ['pointerup','pointercancel','lostpointercapture'].forEach(ev=>button.addEventListener(ev,()=>touchHeld.delete(control)));
});
function isDown(...keys){return keys.some(k=>held.has(k)||touchHeld.has(k))}
function updateGame(dt){
  if(paused)return;
  elapsed+=dt;fireCooldown=Math.max(0,fireCooldown-dt);$('#mission-clock').textContent=`${String(Math.floor(elapsed/60)).padStart(2,'0')}:${String(Math.floor(elapsed%60)).padStart(2,'0')}`;
  const forward=isDown('w','arrowup'),back=isDown('s','arrowdown'),left=isDown('a','arrowleft'),right=isDown('d','arrowright'),boost=isDown('shift');
  const factor=selected.class==='plane'?1.9:selected.class==='heli'?1.2:selected.class==='ship'?.72:1;
  const max=selected.speed/3.6*(boost?1.38:1)*factor;
  velocity+=(forward?max*1.65:back?-max*.9:0)*dt;velocity*=Math.pow(forward||back?.985:.91,dt*60);velocity=clamp(velocity,-max*.48,max);
  const turnRate=(selected.class==='plane'?.74:selected.class==='ship'?.46:1.12)*(0.35+Math.min(1,Math.abs(velocity)/(max||1))*.65);
  if(left)vehicleRoot.rotation.y+=turnRate*dt;if(right)vehicleRoot.rotation.y-=turnRate*dt;
  const dx=Math.sin(vehicleRoot.rotation.y)*velocity*dt,dz=Math.cos(vehicleRoot.rotation.y)*velocity*dt;
  vehicleRoot.position.x=clamp(vehicleRoot.position.x+dx,-95,95);vehicleRoot.position.z=clamp(vehicleRoot.position.z+dz,-95,95);
  const flying=selected.class==='heli'||selected.class==='plane';
  if(flying){const aim=isDown('arrowup'),down=isDown('arrowdown');if(aim)vehicleRoot.position.y+=dt*(selected.class==='plane'?8:4);if(down)vehicleRoot.position.y-=dt*(selected.class==='plane'?8:4);vehicleRoot.position.y=clamp(vehicleRoot.position.y,selected.class==='plane'?3:1.5,selected.class==='plane'?22:13);}
  if(vehicleModel){vehicleModel.rotation.z=THREE.MathUtils.damp(vehicleModel.rotation.z,(left?.16:right?-.16:0),4,dt);if(vehicleModel.userData.rotor)vehicleModel.userData.rotor.rotation.y+=dt*16;}
  // soft chase camera, with map-appropriate horizon and a readable driving view
  const chaseDistance=selected.class==='plane'?15:selected.class==='ship'?16:12;
  const desired=new THREE.Vector3(vehicleRoot.position.x-Math.sin(vehicleRoot.rotation.y)*chaseDistance,vehicleRoot.position.y+(flying?5:5.5),vehicleRoot.position.z-Math.cos(vehicleRoot.rotation.y)*chaseDistance);
  camera.position.lerp(desired,1-Math.exp(-4.2*dt));const look=new THREE.Vector3(vehicleRoot.position.x,vehicleRoot.position.y+(flying?-.7:1.2),vehicleRoot.position.z+7);camera.lookAt(look);
  $('#speed-value').textContent=String(Math.round(Math.abs(velocity)*3.6)).padStart(3,'0');$('#heading').textContent=`${String(Math.round((vehicleRoot.rotation.y*180/Math.PI+360)%360)).padStart(3,'0')}°`;
  for(const target of targets){if(target.userData.alive)target.position.y=Math.sin(elapsed*.65+target.userData.phase)*.08;}
  for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];p.mesh.position.addScaledVector(p.velocity,dt);p.life-=dt;let hit=null;for(const t of targets){if(t.userData.alive&&p.mesh.position.distanceTo(t.position.clone().add(new THREE.Vector3(0,1.65,0)))<1){hit=t;break;}}
    if(hit){destroyTarget(hit);scene.remove(p.mesh);projectiles.splice(i,1);continue;}if(p.life<=0){scene.remove(p.mesh);projectiles.splice(i,1);}}
  for(let i=effects.length-1;i>=0;i--){const e=effects[i];e.life-=dt;e.mesh.scale.multiplyScalar(1+dt*4);e.mesh.material.opacity=Math.max(0,e.life*2);if(e.life<=0){scene.remove(e.mesh);effects.splice(i,1);}}
  if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0){$('#target-toast').classList.remove('show');$('#target-toast').innerHTML='<span>✦</span> TARGET NEUTRALIZED <b>+100</b>';}}
}
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.05);
  if(mode==='game')updateGame(dt);else if(vehicleRoot){menuSpin+=dt;vehicleRoot.rotation.y=Math.sin(menuSpin*.35)*.16;vehicleRoot.userData.model.rotation.y+=dt*.32;}
  renderer.render(scene,camera);
}
function resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));}
window.addEventListener('resize',resize);
// Initial staging and UI state
renderClasses();updateSelected();setMapVisual();addTerrain(currentMap);setupMenuShowcase();camera.position.set(0,16,30);camera.lookAt(4,1,0);animate();
