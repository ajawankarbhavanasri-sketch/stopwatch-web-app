let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;
let lapData = [];

const display = document.getElementById("display");
const laps = document.getElementById("laps");

function updateTime(){

  const time = Date.now() - startTime + elapsedTime;

  let ms = Math.floor(time % 1000);
  let sec = Math.floor((time / 1000) % 60);
  let min = Math.floor((time / (1000 * 60)) % 60);
  let hr = Math.floor(time / (1000 * 60 * 60));

  display.innerHTML =
    `${String(hr).padStart(2,'0')}:`+
    `${String(min).padStart(2,'0')}:`+
    `${String(sec).padStart(2,'0')}:`+
    `${String(ms).padStart(3,'0')}`;
}

function startWatch(){

  if(running) return;

  running = true;

  startTime = Date.now();

  timerInterval = setInterval(updateTime,10);
}

function pauseWatch(){

  if(!running) return;

  running = false;

  clearInterval(timerInterval);

  elapsedTime += Date.now() - startTime;
}

function resetWatch(){

  running = false;

  clearInterval(timerInterval);

  startTime = 0;
  elapsedTime = 0;

  display.innerHTML = "00:00:00:000";

  laps.innerHTML = "";

  lapData = [];

  updateStats();
}

function addLap(){

  if(!running) return;

  const current = display.innerHTML;

  lapData.push(current);

  const li = document.createElement("li");

  li.innerHTML = `
    <span>Lap ${lapData.length}</span>
    <strong>${current}</strong>
  `;

  laps.prepend(li);

  updateStats();

  saveSession();
}

function updateStats(){

  document.getElementById("lapCount").innerText =
    lapData.length;

  if(lapData.length === 0) return;

  document.getElementById("bestLap").innerText =
    lapData[0];

  document.getElementById("avgLap").innerText =
    lapData[Math.floor(lapData.length/2)];
}

function saveSession(){

  localStorage.setItem(
    "eliteLaps",
    JSON.stringify(lapData)
  );
}

function loadSession(){

  const saved =
    JSON.parse(localStorage.getItem("eliteLaps"));

  if(saved){

    lapData = saved;

    lapData.forEach((lap,index)=>{

      const li = document.createElement("li");

      li.innerHTML = `
        <span>Lap ${index+1}</span>
        <strong>${lap}</strong>
      `;

      laps.prepend(li);

    });

    updateStats();
  }
}

document.getElementById("startBtn")
.addEventListener("click",startWatch);

document.getElementById("pauseBtn")
.addEventListener("click",pauseWatch);

document.getElementById("resetBtn")
.addEventListener("click",resetWatch);

document.getElementById("lapBtn")
.addEventListener("click",addLap);

document.getElementById("clearBtn")
.addEventListener("click",()=>{

  laps.innerHTML = "";
  lapData = [];
  updateStats();

});

document.getElementById("exportBtn")
.addEventListener("click",()=>{

  const blob = new Blob(
    [lapData.join("\n")],
    {type:"text/plain"}
  );

  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);

  a.download = "laps.txt";

  a.click();
});

document.getElementById("themeBtn")
.addEventListener("click",()=>{

  document.body.classList.toggle("light");
});

document.getElementById("fullscreenBtn")
.addEventListener("click",()=>{

  if(!document.fullscreenElement){
    document.documentElement.requestFullscreen();
  }else{
    document.exitFullscreen();
  }

});

function updateClock(){

  document.getElementById("clock")
  .innerHTML =
  new Date().toLocaleString();
}

setInterval(updateClock,1000);

document.addEventListener("keydown",(e)=>{

  if(e.code==="Space"){
    startWatch();
  }

  if(e.key==="l"){
    addLap();
  }

  if(e.key==="r"){
    resetWatch();
  }

});

loadSession();