// Aetherion website interactions and lightweight Three.js village preview.
const launchButton = document.querySelector('#launchGame');
const placeholder = document.querySelector('#gamePlaceholder');
const mount = document.querySelector('#gameMount');

launchButton?.addEventListener('click', async () => {
  launchButton.disabled = true;
  launchButton.textContent = 'LOADING ELARIS...';
  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
    startVillagePreview(THREE);
    placeholder.style.display = 'none';
    mount.style.display = 'block';
  } catch (error) {
    launchButton.disabled = false;
    launchButton.textContent = 'TRY AGAIN';
    alert('The 3D preview needs an internet connection to load Three.js. Please try again while online.');
    console.error(error);
  }
});

function startVillagePreview(THREE) {
  if (mount.dataset.started) return;
  mount.dataset.started = 'true';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9bc9ee);
  scene.fog = new THREE.Fog(0x9bc9ee, 28, 90);
  const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 200);
  camera.position.set(0, 5, 12);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(mount.clientWidth, mount.clientHeight);
  renderer.shadowMap.enabled = true;
  mount.appendChild(renderer.domElement);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x52644d, 2));
  const sun = new THREE.DirectionalLight(0xffe6b2, 2.4); sun.position.set(-8, 15, 10); sun.castShadow = true; scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({color:0x477c4c})); ground.rotation.x=-Math.PI/2; ground.receiveShadow=true; scene.add(ground);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(7, 100), new THREE.MeshStandardMaterial({color:0xb69a70})); path.rotation.x=-Math.PI/2; path.position.y=.02; path.receiveShadow=true; scene.add(path);
  function house(x,z,color){const group=new THREE.Group();const base=new THREE.Mesh(new THREE.BoxGeometry(5,3.4,4),new THREE.MeshStandardMaterial({color}));base.position.y=1.7;base.castShadow=true;group.add(base);const roof=new THREE.Mesh(new THREE.ConeGeometry(3.7,2.2,4),new THREE.MeshStandardMaterial({color:0x54354a}));roof.position.y=4.5;roof.rotation.y=Math.PI/4;roof.castShadow=true;group.add(roof);const door=new THREE.Mesh(new THREE.BoxGeometry(.9,1.8,.12),new THREE.MeshStandardMaterial({color:0x34251f}));door.position.set(0,.9,2.06);group.add(door);group.position.set(x,0,z);scene.add(group);}
  house(-9,-8,0xd8b58a); house(10,-15,0xc6a4a0); house(-12,10,0xcbbd8c); house(12,13,0xd6bd91);
  for(let i=0;i<24;i++){const x=(Math.random()-.5)*55,z=(Math.random()-.5)*65;if(Math.abs(x)<5)continue;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.4,2,7),new THREE.MeshStandardMaterial({color:0x65442c}));trunk.position.set(x,1,z);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.SphereGeometry(1.7,9,8),new THREE.MeshStandardMaterial({color:0x28613d}));crown.position.set(x,3,z);crown.castShadow=true;scene.add(crown);}
  const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(1.1),new THREE.MeshStandardMaterial({color:0x67caff,emissive:0x1766cc,emissiveIntensity:1.4,metalness:.25,roughness:.2}));crystal.position.set(0,2.2,-12);scene.add(crystal);
  const kael=new THREE.Group();const body=new THREE.Mesh(new THREE.CapsuleGeometry(.55,1.1,4,8),new THREE.MeshStandardMaterial({color:0x17182b}));body.position.y=1.2;kael.add(body);const head=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12),new THREE.MeshStandardMaterial({color:0xe0b99d}));head.position.y=2.25;kael.add(head);const hair=new THREE.Mesh(new THREE.SphereGeometry(.46,12,8),new THREE.MeshStandardMaterial({color:0x101323}));hair.scale.set(1.1,.55,1.05);hair.position.y=2.55;kael.add(hair);kael.position.set(0,0,4);scene.add(kael);
  let angle=0;let dragging=false,lastX=0;renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;renderer.domElement.setPointerCapture(e.pointerId)});renderer.domElement.addEventListener('pointerup',()=>dragging=false);renderer.domElement.addEventListener('pointermove',e=>{if(dragging){angle+=(e.clientX-lastX)*.008;lastX=e.clientX}});
  const resize=()=>{const w=mount.clientWidth,h=mount.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)};new ResizeObserver(resize).observe(mount);
  function animate(t){requestAnimationFrame(animate);crystal.rotation.y=t*.0006;crystal.position.y=2.2+Math.sin(t*.0015)*.25;camera.position.x=Math.sin(angle)*13;camera.position.z=4+Math.cos(angle)*13;camera.lookAt(0,1,-3);renderer.render(scene,camera)}animate(0);
}
