let mode = 'math';
let scene, camera, renderer, mesh;

// ---------------- MODE ----------------
function setMode(m){
    mode = m;
    document.getElementById('buttonsContainer').innerHTML='';
    document.getElementById('physicsContainer').innerHTML='';
    document.getElementById('threeContainer').innerHTML='';
    document.getElementById('result').innerText='';

    renderButtons();

    if(mode==='puzzle') generatePuzzle();
}

// ---------------- BUTTONS ----------------
function renderButtons(){
    let c = document.getElementById('buttonsContainer');

    if(mode==='math'){
        ['+','-','×','÷','^','sin(','cos(','tan(','π','e']
        .forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>insert(b);
            c.appendChild(btn);
        });
    }

    if(mode==='physics'){
        ['F=ma','v=d/t','KE','PE','Heat']
        .forEach(b=>{
            let btn=document.createElement('button');
            btn.innerText=b;
            btn.onclick=()=>setupPhysics(b);
            c.appendChild(btn);
        });
    }

    if(mode==='shapes'){
        ['Cube','Sphere','Cylinder']
        .forEach(s=>{
            let btn=document.createElement('button');
            btn.innerText=s;
            btn.onclick=()=>drawShape(s);
            c.appendChild(btn);
        });
    }
}

// ---------------- INPUT ----------------
function insert(v){
    document.getElementById('calcInput').value += v;
}

// ---------------- CALCULATE ----------------
function calculate(){
    let input = document.getElementById('calcInput').value;

    try{
        let expr = input
        .replace(/×/g,'*')
        .replace(/÷/g,'/')
        .replace(/π/g,Math.PI)
        .replace(/e/g,Math.E)
        .replace(/\^/g,'**');

        let result = eval(expr);

        document.getElementById('result').innerText = result;
        document.getElementById('steps').innerText = input+" → "+result;

    }catch{
        document.getElementById('result').innerText = "Error";
    }
}

// ---------------- PHYSICS ----------------
function setupPhysics(type){
    let c = document.getElementById('physicsContainer');
    c.innerHTML='';

    function inputField(id, placeholder){
        let inp=document.createElement('input');
        inp.id=id;
        inp.placeholder=placeholder;
        c.appendChild(inp);
    }

    if(type==='F=ma'){
        inputField('m','mass');
        inputField('a','acceleration');
    }

    if(type==='v=d/t'){
        inputField('d','distance');
        inputField('t','time');
    }

    if(type==='KE'){
        inputField('m','mass');
        inputField('v','velocity');
    }

    if(type==='PE'){
        inputField('m','mass');
        inputField('h','height');
    }

    if(type==='Heat'){
        inputField('m','mass');
        inputField('c','specific heat');
        inputField('t','temp change');
    }

    let btn=document.createElement('button');
    btn.innerText='Solve';
    btn.onclick=solvePhysics;
    c.appendChild(btn);
}

function solvePhysics(){
    let m = val('m');
    let a = val('a');
    let v = val('v');
    let d = val('d');
    let t = val('t');
    let h = val('h');
    let c = val('c');

    let res='';

    if(m && a) res = m*a;
    else if(d && t) res = d/t;
    else if(m && v) res = 0.5*m*v*v;
    else if(m && h) res = m*9.8*h;
    else if(m && c && t) res = m*c*t;

    document.getElementById('result').innerText = res;
}

function val(id){
    let e=document.getElementById(id);
    return e?parseFloat(e.value):null;
}

// ---------------- 3D ----------------
function drawShape(type){
    let size = prompt("Enter size:");
    let container = document.getElementById('threeContainer');
    container.innerHTML='';

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75,1,0.1,1000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(300,200);
    container.appendChild(renderer.domElement);

    let geo;
    if(type==='Cube') geo = new THREE.BoxGeometry(size,size,size);
    if(type==='Sphere') geo = new THREE.SphereGeometry(size,32,32);
    if(type==='Cylinder') geo = new THREE.CylinderGeometry(size,size,size*2);

    let mat = new THREE.MeshNormalMaterial();
    mesh = new THREE.Mesh(geo,mat);
    scene.add(mesh);

    camera.position.z=5;

    function animate(){
        requestAnimationFrame(animate);
        mesh.rotation.x+=0.01;
        mesh.rotation.y+=0.01;
        renderer.render(scene,camera);
    }
    animate();
}

// ---------------- PUZZLE ----------------
function generatePuzzle(){
    let a=Math.floor(Math.random()*10);
    let b=Math.floor(Math.random()*10);
    let ans=a+b;

    document.getElementById('calcInput').value = `${a}+${b}`;

    let opts=[ans,ans+1,ans-1,ans+2].sort(()=>Math.random()-0.5);

    let c=document.getElementById('buttonsContainer');
    c.innerHTML='';

    opts.forEach(o=>{
        let btn=document.createElement('button');
        btn.innerText=o;
        btn.onclick=()=>{
            if(o===ans) alert("Correct ✅");
            else alert("Wrong ❌");
        };
        c.appendChild(btn);
    });
}

// ---------------- START ----------------
setMode('math');
