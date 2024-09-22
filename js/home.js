/*INIT*/
var body = document.querySelector("body")
var nebulaBackground = document.querySelector("#nebulaBackdrop")
var forest = document.querySelector("#forest")
var maxFactor = Math.max(body.clientWidth,body.getBoundingClientRect().width)
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
body.addEventListener("click", function(ev){
  generateUniverse()
})
//body.onresize = generateUniverse
generateUniverse()
/*END INIT*/
const mobileMenu = document.getElementById('mobile-menu');
const navList = document.querySelector('.nav-list');

mobileMenu.addEventListener('click', () => {
    navList.classList.toggle('active');
});

function generateUniverse(){
  [...body.querySelectorAll(".planetContainer")].forEach(p=>p.remove())
  maxFactor = Math.max(body.clientWidth,body.getBoundingClientRect().width)
  let opt = {}
  let setColors = (opt)=>{//random color generator function used to reset colors between generating the planets and moons.
    if(opt.className=="moon"){
      let s = getRandomInt(0,255)
      opt.r = getRandomInt(s-50,s+50)
      opt.g = getRandomInt(s-50,s+50)
      opt.b = getRandomInt(s-50,s+50)
    } else {
      opt.r = getRandomInt(0,255)
      opt.g = getRandomInt(0,255)
      opt.b = getRandomInt(0,255)
    }
  }

  opt.className="planet"
  setColors(opt)//set the colors used for first planet here (forest uses these colors also)
  
  //shooting star/comet
  document.querySelector('#comet').style.display = chance(.7) ? "none" : "block";
  document.querySelector('#comet').style.left = `${getRandomInt(0,100)}%`
  document.querySelector('#comet').style.top = `${getRandomInt(0,100)}%`
  document.querySelector('#comet').style.transform = `rotate(${getRandomInt(0,360)}deg)`
  document.querySelector('#comet').style.border = `1px solid transparent`
  let cometColor = chance()?"blue":`rgb(${getRandomInt(0,255)},${getRandomInt(0,255)},${getRandomInt(0,255)})`
  document.querySelector('#comet').style.filter = `drop-shadow(1px 1px 1px ${cometColor})`
  let cometLen = getRandomInt(10,120)
  document.querySelector('#comet').style.borderRight = `${cometLen}px solid white`;
  
  //distant home star
  document.querySelector('#star').style.display = chance(.7) ? "none" : "block";
  document.querySelector('#star').style.left = `${getRandomInt(0,100)}%`
  document.querySelector('#star').style.top = `${getRandomInt(0,100)}%`
  
  //ufo
  document.querySelector('#ufo').style.left = `${getRandomInt(0,100)}%`
  document.querySelector('#ufo').style.top = `${getRandomInt(0,100)}%`
  document.querySelector('#ufo').style.transform = `rotate(${getRandomInt(-45,45)}deg)`
  document.querySelector('#ufo').style.filter = `hue-rotate(${getRandomInt(0,360)}deg)`
  document.querySelector('#ufo').style.display = chance(.8) ? "none" : "block";
  
  
  //they like "Go Forrest Run Forrest, run Forrest, go Forrest"
  let mountains = chance()
  if(chance(.85)) { //either display trees or mountains, most of the time
    forest.style.display = "block"
    let horizonEffect = chance() ? `drop-shadow(0 0 ${getRandomInt(50,200)}px rgb(${opt.r}, ${opt.g}, ${opt.b})) ` : " "
    let hueRotation = horizonEffect != "" ? getRandomInt(-20,20) : getRandomInt(0,300);//if using horizon effect keep the color closer to the planet color
    forest.style.filter = `brightness(${getRandomFloat(2,15)}%)` + horizonEffect +  `hue-rotate(${hueRotation}deg)`
    
    let wid = Math.max(document.documentElement.clientWidth, body.clientWidth)
    let density = Math.floor(wid*getRandomFloat(.05,.3));
    console.log(`Tree mode: detected ${wid}px client width, using tree density ${density}`)
    forest.innerHTML = "";
    let min = -20;/*x-axis coord min*/
    let max = 120;/*x-axis coord max*/
    let treeMin = isMobile ? 5 : 10
    let treeMax = getRandomInt(treeMin,isMobile?50:80)
    let branchCurvature = getRandomInt(5,20)
    for (let i = 0; i < density; i++) {
      let pos = getRandomInt(min,max)
      let hei = getRandomInt(treeMin, treeMax)
      if(mountains) {     
        forest.appendChild(generateMountain(hei, pos));
      } else {
        forest.appendChild(generateTree(hei, pos, branchCurvature));
      } 
    }
  } else {
    forest.style.display = "none"
  }
 
  //setting star-field filters and nebula properties
  body.style.backdropFilter=chance()?"url(#distort)":"";
  document.querySelector('#distortRadius').radius = `${getRandomFloat(0,2)} ${getRandomFloat(0,2)}`
  body.style.backgroundImage = generateStarField(isDistort=body.style.backdropFilter!="", isNebula=false);
  if(chance(.75)){
    nebulaBackground.style.backgroundImage = generateStarField(isDistort=false,isNebula=true)
  } else {
    //no nebula effect, but maybe use two star-fields
    nebulaBackground.style.backgroundImage = chance() ? "" : generateStarField(isDistort=chance(),isNebula=false)
  }
  nebulaBackground.style.filter = `opacity(${Math.random()*.7}) invert(${chance(.8)?100:0}%)`
  
  let onlyStars = chance(.1)
  if(onlyStars) return true;

  //set global options and those for the big planet
  opt.rotateZ = getRandomInt(0,180)
  opt.min = 500
  opt.max = maxFactor
  opt.w = getRandomInt(opt.min, opt.max)
  opt.h = opt.w
  
  createPlanet(opt)//big planet
  
  //first rocky svg filter
  let s = getRandomInt(0,360)//color seed
  let variation = 50;//moon color variation
  let moonColor = `rgba(${getRandomInt(s-variation,s+variation)},${getRandomInt(s-variation,s+variation)},${getRandomInt(s-variation,s+variation)},.8)`
  document.querySelector("#rocky .lighting").setAttribute("lighting-color", moonColor);
  let baseFreq = getRandomFloat(.03,1)
  let baseFreq2= getRandomFloat(baseFreq-.1,baseFreq+.1)
  document.querySelector("#rocky .turbs").setAttribute("baseFrequency", `${baseFreq} ${baseFreq2}`)
  document.querySelector("#rocky .lighting").setAttribute("surfaceScale", getRandomFloat(1,2));
  document.querySelector("#rocky .elevation").setAttribute("elevation", getRandomInt(60,100));
  document.querySelector("#rocky .turbs").setAttribute("numOctaves", getRandomInt(5,100))

  //create first moon
  opt.className = chance() ? "moon" : "planetoid"//make some "moons" like little planets (rings, more color)
  setColors(opt) 
  opt.min = 10
  opt.max = 180
  opt.w = getRandomInt(opt.min, opt.max)
  opt.h = opt.w
  chance(.45)&&createPlanet(opt)
  
  //second rocky svg filter
  s = getRandomInt(0,360)//color seed
  moonColor = `rgba(${getRandomInt(s-variation,s+variation)},${getRandomInt(s-variation,s+variation)},${getRandomInt(s-variation,s+variation)},.8)`
  document.querySelector("#rocky2 .lighting").setAttribute("lighting-color", moonColor);
  baseFreq = getRandomFloat(.03,1)
  baseFreq2= getRandomFloat(baseFreq-.1,baseFreq+.1)
  document.querySelector("#rocky2 .turbs").setAttribute("baseFrequency", `${baseFreq} ${baseFreq2}`)
  document.querySelector("#rocky2 .lighting").setAttribute("surfaceScale", getRandomFloat(1,2));
  document.querySelector("#rocky2 .elevation").setAttribute("elevation", getRandomInt(60,100));
  document.querySelector("#rocky2 .turbs").setAttribute("numOctaves", getRandomInt(5,100))

  //create second moon maybe
  opt.className = chance() ? "moon" : "planetoid"
  setColors(opt)
  opt.w = getRandomInt(opt.min, opt.max)
  opt.h = opt.w
  chance(.45)&&createPlanet(opt)
}

function createPlanet(opt) {  
  
  //create elements
  var container = document.createElement("div")
  container.className = "planetContainer"
  var div = document.createElement("div");
  container.appendChild(div)

  div.className = opt.className
  var inner = document.createElement("div");
  inner.className = "inner"
  div.appendChild(inner)

  //size
  let w = opt.w
  let h = opt.h
  div.style.width = w+"px"
  div.style.height = h+"px"
  inner.style.width = w+"px";
  inner.style.height = h+"px";
  
  //position
  let t = getRandomInt(10,90);
  let l = getRandomInt(10,90);  
  div.style.top = `${t}%`
  div.style.left = `${l}%`
  container.style.top = `${t}%`
  container.style.left = `${l}%`

  inner.style.width = w+"px";
  inner.style.height = h+"px";
  div.style.borderRadius = "50%";
  inner.style.borderRadius = "50%";
  
  //rocky texture svg filter moons
  if(div.className=="moon") {
    inner.style.filter = `url(${pick(["#rocky", "#rocky2"])}) blur(1px)`
  }
  
  //inner gradient - closer to solid color look
  if(div.className!="moon" && chance(.35)) {
    var innerOpacity = getRandomFloat(.5,1)
    inner.style.backgroundSize =  `${w}px ${h}px`
    inner.style.backgroundRepeat = "no-repeat"
    inner.style.backgroundImage = `radial-gradient(ellipse at center, rgba(${opt.r}, ${opt.g}, ${opt.b}, ${innerOpacity}) ${0}%, transparent 100%)`
  }  
  
  
  //BOX SHADOW (ATMOSPHERE AND COLOR)
  let boxOpt = {}
  let atmosphereColorRange = chance() ? 50 : 180;
  boxOpt.atmosColor = `rgba(${opt.r+getRandomInt(-atmosphereColorRange,atmosphereColorRange)}, ${opt.g+getRandomInt(-atmosphereColorRange,atmosphereColorRange)}, ${opt.b+getRandomInt(-atmosphereColorRange,atmosphereColorRange)}, ${getRandomFloat(.2,.4)})`
  boxOpt.atmosWidth = div.className == "moon"? getRandomInt(0,1) : getRandomInt(0,5);
  let saturnAscends = div.className != "moon" && chance()
  boxOpt.outerBlur = div.className == "moon" ? getRandomInt(0,5) : (saturnAscends || div.className=="planetoid" || chance()) ? getRandomInt(5,30) : getRandomInt(30,2000)
  boxOpt.innerBlur = div.className=="moon" ? getRandomInt(10,w*.2) : getRandomInt(10,w*.55)
  boxOpt.innerSize = div.className=="moon"? 1 : getRandomInt(5,w*.5)
  boxOpt.alpha = div.className == "moon" ? getRandomFloat(.2,.5) : getRandomFloat(.3,1)
  boxOpt.r = opt.r
  boxOpt.g = opt.g
  boxOpt.b = opt.b
  boxOpt.w = opt.w
  boxOpt.a = div.className == "moon" ? getRandomFloat(.2,.5) : getRandomFloat(.3,1)
  boxOpt.className = div.className
  boxOpt.left =  div.className == "moon" ? getRandomFloat(5,w*.3) : getRandomFloat(10,w*.5)
  boxOpt.up =  0; /*using rotation now*/
  inner.style.boxShadow = getBoxShadow(boxOpt)
 
  /*((((0))))  RINGS */
  let rotation = (div.className!="planetoid"||!saturnAscends) ? opt.rotateZ : getRandomInt(0,180)//don't have rings be the same rotation if they are present
  container.style.transform = `rotateZ(${rotation}deg)`
  body.appendChild(container)//put container in DOM so we can append to it.
 
  if(saturnAscends){

    const TILT = 90;
    let width = getRandomInt(1,w)
    let moveRingsOut = getRandomInt(5,w*2)
    let colorDistance = getRandomInt(1,360)
    let numRings = getRandomInt(1,25)
    for(let i=1; i < numRings; i++){
      let ring = document.createElement("div")
      let color = Math.floor((colorDistance*i)%255)
      ring.style.height = w+moveRingsOut+"px"
      ring.style.width = w+moveRingsOut+"px"
      ring.className = "ring"
      ring.style.top = `calc(${t}% - ${moveRingsOut/2}px)`
      ring.style.left = `calc(${l}% - ${moveRingsOut/2}px)`
      let boxShadow = chance()?`0 0 ${5}px ${width/i}px rgba(${getRandomInt(0,255)},${getRandomInt(0,255)},${getRandomInt(0,255)},${Math.random()*.75})`
      :`0 0 ${5}px ${width/i}px rgba(${color},${color},${color},${Math.random()*.5})`
      ring.style.boxShadow = boxShadow
 
      ring.style.transform = ` rotateX(${TILT}deg)`
      container.style.transform = `translateZ(-${getRandomInt(0,1200)}px) rotateZ(${rotation}deg)`
      container.appendChild(ring)
    }
    
  }
}

function getBoxShadow(opt){
  if(opt.className=="moon") return `inset ${opt.left}px ${opt.up}px ${opt.innerBlur}px ${opt.innerSize}px rgba(${opt.r}, ${opt.g}, ${opt.b}, ${opt.a})`
  let bigPlanet = opt.className=="planet" ? `,inset ${opt.left}px ${opt.up}px ${opt.innerBlur}px ${opt.innerSize}px rgba(${opt.r}, ${opt.g}, ${opt.b}, ${opt.a})` : ""
  return `0px 0px ${opt.outerBlur}px ${opt.className=="moon"?0:opt.atmosWidth}px ${opt.atmosColor},
        0px 0px 7px ${opt.atmosWidth}px ${opt.atmosColor},           
        inset 0px 0px ${getRandomInt(opt.w*.25,opt.w)}px ${getRandomInt(20,30)}px ${opt.atmosColor} ${bigPlanet}`
}

function generateStarField(isDistort, isNebula){
  let greenMin = getRandomInt(0,256)
  let blueMin = getRandomInt(0,256)
  let redMin = getRandomInt(0,256)
  let redMax = getRandomInt(redMin,256)
  let blueMax = getRandomInt(blueMin,256)
  let greenMax = getRandomInt(greenMin,256)
  let bigRatio = Math.random()*.015
  let s = ``
  let nebMin = getRandomFloat(50,100)
  let nebMax = getRandomFloat(100,250)
  let density = isMobile? pick([200,400,600,800,1000]) : pick([1000,2000,3000,4000,5000])
  for(let i = 0; i<density; i++){
    let r = getRandomInt(redMin,redMax) 
    let g = getRandomInt(greenMin,greenMax) 
    let b = getRandomInt(blueMin,blueMax)
    let isBigStar = chance(bigRatio)
    let size = isNebula ? getRandomFloat(nebMin,nebMax) : isDistort ? getRandomFloat(.3,2) : isBigStar ? getRandomFloat(2,4) : getRandomFloat(.1,2)
    let posX = getRandomFloat(0,100)
    let posY = getRandomFloat(0,100)
    if(isBigStar) {
      s+=`radial-gradient(${size}px circle at ${posX}% ${posY}%, rgb(${r},${g},${b}) 0%, transparent 100%),radial-gradient(${size/2}px circle at ${posX}% ${posY}%, white 2px, transparent 100%),`
    } else {
      s+=`radial-gradient(${size}px circle at ${posX}% ${posY}%, rgb(${r},${g},${b}) 0%, transparent 100%),`
    }
  }
  return s.replace(/,$/, "")
}

function generateTree(height, position, branchCurve) {
  
  let tan = "#a7ac5c";
  let green2 = "#878822";
  let brown = "#211610";
  let brightgreen = "#4a560c";
  let graygreen= "#303b2b";
  let template = `      
    <div class="tree__1"></div>
    <div class="tree__2"></div>
    <div class="tree__3"></div>
    <div class="tree__4"></div>
    <div class="tree__5 trunk"></div>
    `;
  let el = document.createElement("div");
  el.setAttribute("class", "tree");
  el.style.left = `${position}%`;
  el.innerHTML = template;
  let base = getRandomInt(height/2,height*2)
  let segmentDistance = getRandomFloat(1,1.2)
  
  el.querySelector('.tree__1').style.border = `${base*.3}px solid transparent`
  el.querySelector('.tree__1').style.borderBottom = `${base*.55*segmentDistance}px solid ${tan}`
  el.querySelector('.tree__1').style.borderRadius = `${branchCurve}%`
  
  el.querySelector('.tree__2').style.border = `${base*.45}px solid transparent`
  el.querySelector('.tree__2').style.borderBottom = `${base*.65}px solid ${green2}`
  el.querySelector('.tree__2').style.marginTop = `-${base*.7*segmentDistance}px`//*this brings down the element above*/
  el.querySelector('.tree__2').style.borderRadius = `${branchCurve}%`
  
  el.querySelector('.tree__3').style.border = `${base*.65}px solid transparent`
  el.querySelector('.tree__3').style.borderBottom = `${base*.75*segmentDistance}px solid ${brightgreen}`
  el.querySelector('.tree__3').style.marginTop = `-${base}px`
  el.querySelector('.tree__3').style.borderRadius = `${branchCurve}%`
  
  el.querySelector('.tree__4').style.border = `${base}px solid transparent`
  el.querySelector('.tree__4').style.borderBottom = `${base}px solid ${graygreen}`
  el.querySelector('.tree__4').style.marginTop = `-${base*1.4*segmentDistance}px`
  el.querySelector('.tree__4').style.borderRadius = `${branchCurve}%`
  
  //trunk
  el.querySelector('.tree__5').style.width = `${base*.15}px`
  el.querySelector('.tree__5').style.height = `${getRandomInt(10,120)}px`
  el.querySelector('.tree__5').style.background = `hsl(${getRandomInt(30,40)},${getRandomInt(75,100)}%,${getRandomInt(15,20)}%)`;
 
  
  el.style.zIndex = Math.floor(Math.random() * 10);
  el.style.transform = `skewX(${getRandomFloat(-5,5)}deg) skewY(${getRandomFloat(-5,5)}deg) scale(${1})`
  //el.style.animation = `sway ${getRandomFloat(4,8)}s alternate infinite`
  
  return el;
}

function generateMountain(height, position) {
  //hacked tree method
  let template = `      
    <div class="mtn__1"></div>
    <div class="mtn__2"></div>
    `;
  let el = document.createElement("div");
  el.setAttribute("class", "mountain");
  el.style.left = `${position}%`;
  el.innerHTML = template;
  let base = getRandomInt(10,200)
  let slightlyVariable = getRandomFloat(1.1,1.2)
  let colorVariation = 5;
  
  el.querySelector('.mtn__1').style.border = `${base*.4}px solid transparent`
  el.querySelector('.mtn__1').style.borderBottom = `${base*.45*slightlyVariable}px solid white`

  let mtnBg = getRandomInt(0,70);
  el.querySelector('.mtn__2').style.border = `${base*.7}px solid transparent`
  el.querySelector('.mtn__2').style.borderBottom = `${base*.65}px solid rgb(${getRandomInt(mtnBg-colorVariation, mtnBg+colorVariation)},${getRandomInt(mtnBg-colorVariation, mtnBg+colorVariation)},${getRandomInt(mtnBg-colorVariation, mtnBg+colorVariation)})`
  el.querySelector('.mtn__2').style.marginTop = `-${base*slightlyVariable}px`//*this brings down the element above*/ 
  
  el.style.zIndex = Math.floor(Math.random() * 10);
  el.style.transform = `skewX(${getRandomFloat(-5,5)}deg) skewY(${getRandomFloat(-5,5)}deg) scale(${1})`
  
  return el;
}

/*utility*/
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function chance(limit = .5) {
  return Math.random() < limit;
}
