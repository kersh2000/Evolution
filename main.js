function drawGridPattern(color){
  var cnv = document.getElementById("grid-pattern");
  var ctx = cnv.getContext("2d");

  //drawing small squares
  for(let i = 0; i <= 500; i += 10){

    ctx.lineWidth = 1;

    //vertical lines
    ctx.moveTo(i, 0);
    ctx.lineTo(i, 500);

    //horizontal lines
    ctx.moveTo(0, i);
    ctx.lineTo(500, i);

    ctx.strokeStyle = color;
    ctx.stroke();

  }
}
drawGridPattern("#000000");

const objectDiv = document.querySelector('.objects');
const numOfObjects = 250;
const stepsPerGen = 100;
const gridDim = 50;
const activationCodon = "TAT";
const geneticRule = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 55, 59, 62, 65, 66, 69, 77];
const genomeLength = geneticRule[geneticRule.length - 1];
const mutationRate = genomeLength * 4;
const geneticDescriptor = [
  "P1Mov - Promoter of 1st Movements", 
  "1MovU - 1st Movement Up", 
  "1MovR - 1st Movement Right", 
  "1MovD - 1st Movement Down", 
  "1MovL - 1st Movement Left", 
  "1MovN - 1st Movement None", 
  "P2Mov - Promoter of 2nd Movements", 
  "2MovU - 2nd Movement Up", 
  "2MovR - 2nd Movement Right", 
  "2MovD - 2nd Movement Down", 
  "2MovL - 2nd Movement Left", 
  "2MovN - 2nd Movement None", 
  "PMovX - Promoter of Movement X", 
  "MovXC - Movement X Co-ordinate", 
  "PMovY - Promoter of Movement Y", 
  "MovYC - Movement Y Co-ordinate" ,
  "RepR - Replicase Receptor", 
  "RepC - Replicase Chance", 
  "RepS - Replicase Substrate",
  "Rand - Random Identifier",
];

const genomeKeys = {
  "P1Mov": {
    "description": "Promoter of 1st Movements",
    "type": "promoter",
    "start": 0,
    "end": 4,
    "summary": `This is the promoter of the 1st Movement category of genes responsible for activating the first set of movements.`,
    "colour": "#99b3ff"
  },
  "1MovU": {
    "description": "1st Movement Up",
    "type": "movement",
    "start": 4,
    "end": 8,
    "summary": "This gene allows the object to move upwards.",
    "colour": "#99d7ff"
  },
  "1MovR": {
    "description": "1st Movement Right",
    "type": "movement",
    "start": 8,
    "end": 12,
    "summary": "This gene allows the object to move to the right.",
    "colour": "#99b3ff"
  },
  "1MovD": {
    "description": "1st Movement Down",
    "type": "movement",
    "start": 12,
    "end": 16,
    "summary": "This gene allows the object to move downwards.",
    "colour": "#99d7ff"
  },
  "1MovL": {
    "description": "1st Movement Left",
    "type": "movement",
    "start": 16,
    "end": 20,
    "summary": "This gene allows the object to move to the left.",
    "colour": "#99b3ff"
  },
  "1MovN": {
    "description": "1st Movement None",
    "type": "movement",
    "start": 20,
    "end": 24,
    "summary": "This gene allows the object to remain stationary.",
    "colour": "#99d7ff"
  },
  "P2Mov": {
    "description": "Promoter of 2nd Movements",
    "type": "promoter",
    "start": 24,
    "end": 28,
    "summary": "This section of the genome activates the second set of movements.",
    "colour": "#aaffba"
  },
  "2MovU": {
    "description": "2nd Movement Up",
    "type": "movement",
    "start": 28,
    "end": 32,
    "summary": "This gene allows the object to move upwards in the second set of movements.",
    "colour": "#cdffaa"
  },
  "2MovR": {
    "description": "2nd Movement Right",
    "type": "movement",
    "start": 32,
    "end": 36,
    "summary": "This gene allows the object to move to the right in the second set of movements.",
    "colour": "#aaffba"
  },
  "2MovD": {
    "description": "2nd Movement Down",
    "type": "movement",
    "start": 36,
    "end": 40,
    "summary": "This gene allows the object to move downwards in the second set of movements.",
    "colour": "#cdffaa"
  },
  "2MovL": {
    "description": "2nd Movement Left",
    "type": "movement",
    "start": 40,
    "end": 44,
    "summary": "This gene allows the object to move to the left in the second set of movements.",
    "colour": "#aaffba"
  },
  "2MovN": {
    "description": "2nd Movement None",
    "type": "movement",
    "start": 44,
    "end": 48,
    "summary": "This gene allows the object to remain stationary in the second set of movements.",
    "colour": "#cdffaa"
  },
  "PMovX": {
    "description": "Promoter of Movement X",
    "type": "promoter",
    "start": 48,
    "end": 52,
    "summary": "This section of the genome activates movements along the X-axis.",
    "colour": "#ffbbaa"
  },
  "MovXC": {
    "description": "Movement X Co-ordinate",
    "type": "coordinate",
    "start": 52,
    "end": 55,
    "summary": "This gene determines the co-ordinate for movement along the X-axis.",
    "colour": "#ffd9aa"
  },
  "PMovY": {
    "description": "Promoter of Movement Y",
    "type": "promoter",
    "start": 55,
    "end": 59,
    "summary": "This section of the genome activates movements along the Y-axis.",
    "colour": "#ffbbaa"
  },
  "MovYC": {
    "description": "Movement Y Co-ordinate",
    "type": "coordinate",
    "start": 59,
    "end": 62,
    "summary": "This gene determines the co-ordinate for movement along the Y-axis.",
    "colour": "#ffd9aa"
  },
  "RepR": {
    "description": "Replicase Receptor",
    "type": "receptor",
    "start": 62,
    "end": 65,
    "summary": "This gene encodes a receptor for the replicase function, and binds to an object's RepS (substrate) section through DNA invesrion / binding.",
    "colour": "#c0aaff"
  },
  "RepC": {
    "description": "Replicase Chance",
    "type": "chance",
    "start": 65,
    "end": 66,
    "summary": "This gene determines the chance of replicase activity, and becomes active is the value is below 2.",
    "colour": "#e5aaff"
  },
  "RepS": {
    "description": "Replicase Substrate",
    "type": "substrate",
    "start": 66,
    "end": 69,
    "summary": "This gene encodes a substrate for the replicase function, and is found by an object's RepR (receptor) section through DNA invesrion / binding.",
    "colour": "#c0aaff"
  },
  "Rand": {
    "description": "Random Identifier",
    "type": "identifier",
    "start": 69,
    "end": 77,
    "summary": "This gene serves as a random identifier for the object and has no functional role within its activity.",
    "colour": "#e7e7e7"
  }
};

for (let i = 0; i < geneticDescriptor.length; i++){
  let ending = ` (${geneticRule[i]} - ${geneticRule[i + 1]})`;
  geneticDescriptor[i] += ending;
}

var objects = [];
var killZone = [0, 44, 0, 49];
var isKill = true;
var survivalRate = [];
var genomeicFrequencies = [];
const nucleotides = ['A', 'C', 'G', 'T'];
var lineGraph, pieChart, pieLab, pieData;

//create object
class Blocks {
  constructor(genomeLength){
    this.xcor;
    this.ycor;
    this.genomeLength = genomeLength;
    this.genome = "";
    this.color;

    for (let i = 0; i < this.genomeLength; i++){
      let randChar = nucleotides[Math.floor(Math.random() * nucleotides.length)];
      this.genome += randChar;
    }

    this.color = this.setColor();
  }

  setColor(){
    let colNum = dnaToNum(this.genome) / ((nucleotides.length ** this.genomeLength) - 1);
    return "#" + Math.floor(colNum * 16777215).toString(16);
  }
}

//create all objects
function createObjects(){
  for (let i = 0; i < numOfObjects; i++){
    objects.push(new Blocks(genomeLength));
  }
  genRandomCords();
}

//randomly generate object's co-ordinates
function genRandomCords(){
  let xcors = [];
  let ycors = [];
  let run;
  for (let i = 0; i < numOfObjects; i++){
    do{
      run = false;
      var xcorRand = Math.round(Math.random() * (gridDim - 1));
      var ycorRand = Math.round(Math.random() * (gridDim - 1));

      for (let j = 0; j < xcors.length; j++){
        if ((xcorRand === xcors[j]) && (ycorRand === ycors[j])){
          run = true;
          break;
        }
      }

      if(!run){
        objects[i].xcor = xcorRand;
        objects[i].ycor = ycorRand;
        xcors.push(xcorRand);
        ycors.push(ycorRand);
      }
    } while(run);
  }
}

//get all cords from objects
function getCurrentCords(){
  let cords = [];
  for (let i = 0; i < objects.length; i++){
    cords.push([objects[i].xcor, objects[i].ycor]);
  }
  return cords;
}

//check new cords are new and in bound
function checkCords(newX, newY, cords){
  for (let i = 0; i < cords.length; i++){
    if((newX === cords[i][0]) && (newY === cords[i][1])){
      return false;
    }
  }
  if(newY > (gridDim - 1) || newY < 0 || newX > (gridDim - 1) || newX < 0){
    return false;
  }
  return true;
}

//move objects
function moveObjects(){
  let cords = getCurrentCords();
    for(let j = 0; j < objects.length; j++){
      //update last object's cords
      if (j !== 0){
        cords[j - 1] = [objects[j - 1].xcor, objects[j - 1].ycor];
      }
      let moved = false;

      new Pol3(objects[j], cords, moved);
      if(!moved){
        new Pol1(objects[j], cords, moved);
        if(!moved){
          new Pol2(objects[j], cords, moved);
        }
      }
    }
  }

//Pol1 class
class Pol1{
  constructor(curObject, cords, moved){
    this.object = curObject;
    this.genome = this.object.genome;
    this.cords = cords;
    this.moved = moved;
    this.getPrimaryMov();
  }
  
  getPrimaryMov(){
    const genes = [this.genome.slice(geneticRule[0], geneticRule[1]), this.genome.slice(geneticRule[1], geneticRule[6])];

    if(genes[0].includes(activationCodon)){
      new Movements(this.object, this.cords, this.moved, genes[1]);
    }
  }
}

//Pol2 class
class Pol2{
  constructor(curObject, cords, moved){
    this.object = curObject;
    this.genome = this.object.genome;
    this.cords = cords;
    this.moved = moved;
    this.getSecondaryMov();
  }

  getSecondaryMov(){
    let genes = [this.genome.slice(geneticRule[6], geneticRule[7]), this.genome.slice(geneticRule[7], geneticRule[12])];

    if(genes[0].includes(activationCodon)){
      new Movements(this.object, this.cords, this.moved, genes[1]);
    }
  }
}

//Pol3 class
class Pol3{
  constructor(curObject, cords, moved){
    this.object = curObject;
    this.genome = this.object.genome;
    this.cords = cords;
    this.moved = moved;
    this.getSpecificMov();
  }

  getSpecificMov(){
    let genes = [this.genome.slice(geneticRule[12], geneticRule[13]), 
    this.genome.slice(geneticRule[13], geneticRule[14]), 
    this.genome.slice(geneticRule[14], geneticRule[15]), 
    this.genome.slice(geneticRule[15], geneticRule[16])];

    let targetX = dnaToNum(genes[1]);
    let targetY = dnaToNum(genes[3]);
    let xActive = genes[0].includes(activationCodon);
    let yActive = genes[2].includes(activationCodon);
    let xMov, yMov = undefined;

    if(!(xActive || yActive)){
      return undefined;
    }

    if(xActive){
      if(targetX > (gridDim - 1)){
        targetX = Math.round(Math.random() * (gridDim - 1));
      }
      if(this.object.xcor > targetX){
        xMov = "AAAAAAAAAAAATTTTAAAA";
      }else if(this.object.xcor < targetX){
        xMov = "AAAATTTTAAAAAAAAAAAA";
      }else{
        xMov = "AAAAAAAAAAAAAAAATTTT";
      }
    }
    if(yActive){
      if(targetY > (gridDim - 1)){
        targetY = Math.round(Math.random() * (gridDim - 1));
      }
      if(this.object.ycor > targetY){
        yMov = "TTTTAAAAAAAAAAAAAAAA";
      }else if(this.object.ycor < targetY){
        yMov = "AAAAAAAATTTTAAAAAAAA";
      }else{
        yMov = "AAAAAAAAAAAAAAAATTTT";
      }
    }

    if(xActive && yActive){
      if(Math.abs(this.object.xcor - targetX) > Math.abs(this.object.ycor - targetY)){
        new Movements(this.object, this.cords, this.moved, xMov);
      }else if(Math.abs(this.object.xcor - targetX) < Math.abs(this.object.ycor - targetY)){
        new Movements(this.object, this.cords, this.moved, yMov);
      }else{
        if(Math.random() < 0.5){
          new Movements(this.object, this.cords, this.moved, xMov);
        }else{
          new Movements(this.object, this.cords, this.moved, yMov);
        }
      }
    }else if(xActive){
      new Movements(this.object, this.cords, this.moved, xMov);
    }else if(yActive){
      new Movements(this.object, this.cords, this.moved, yMov);
    }
  }
}

//Replicase1 class
class Replicase1{
  constructor(genome, objects, op){
    this.genome = genome;
    this.objects = objects;
    this.op = op;
  }

  findMate(){
    let genes = [this.genome.slice(geneticRule[16], geneticRule[17]),
    this.genome.slice(geneticRule[17], geneticRule[18]),
    this.genome.slice(geneticRule[18], geneticRule[19])];
    let chance = dnaToNum(genes[2]);
    let recSeq = genes[0];

    if(chance > 1){
      return Math.round(Math.random() * (this.op.length - 1));
    }

    let matches = [];
    for (let i = 0; i < this.op.length; i++){
      if (recSeq === (invertDNA(this.objects[this.op[i]].genome.slice(66, 69)))){
        matches.push(i);
      }
    }

    if(matches.length !== 0){
      return matches[Math.round(Math.random() * (matches.length - 1))];
    }else{
      return Math.round(Math.random() * (this.op.length - 1));
    }
  }
}

function invertDNA(dna){
  let inverted = "";
  for (let i = 0; i < dna.length; i++){
    switch(dna[i]){
      case 'A':
        inverted += 'T';
        break;
      case 'T':
        inverted += 'A';
        break;
      case 'C':
        inverted += 'G';
        break;
      case 'G':
        inverted += 'C';
        break;
      default:
        inverted += dna[i];
    }
  }
  return inverted;
}

//Movements class
class Movements {

  constructor(object, cords, moved, gene){
    this.object = object;
    this.cords = cords;
    this.moved = moved;
    this.gene = gene;

    this.mov = this.getMovement(this.gene);
    this.mov(this.object, this.cords, this.moved);
  }

  //getMovement
  getMovement(gene){
    let genes = [];
    for (let i = 0; i <= 16; i += 4){
      let temp = gene.slice(i, i + 4);
      genes.push(dnaToNum(temp));
    }

    let sum = 0;
    for (let i = 0; i < genes.length; i++){
      sum += genes[i];
    }

    let rand = Math.random() * sum;
    if (rand < genes[0]){
      console.log();
      return this.stepUp;
    }else if (rand < (genes[0] + genes[1])){
      return this.stepRight;
    }else if (rand < (genes[0] + genes[1] + genes[2])){
      return this.stepDown;
    }else if (rand < (genes[0] + genes[1] + genes[2] + genes[3])){
      return this.stepLeft;
    }else{
      return this.stepNone;
    }
  }

  //stepUp
  stepUp(ob, cords, moved){
    let newY = ob.ycor - 1;
    if(checkCords(ob.xcor, newY, cords)){
      ob.ycor = newY;
      moved = true;
    }
  }

  //stepRight
  stepRight(ob, cords, moved){
    let newX = ob.xcor + 1;
    if(checkCords(newX, ob.ycor, cords)){
      ob.xcor = newX;
      moved = true;
    }
  }

  //stepDown
  stepDown(ob, cords, moved){
    let newY = ob.ycor + 1;
    if(checkCords(ob.xcor, newY, cords)){
      ob.ycor = newY;
      moved = true;
    }
  }

  //stepLeft
  stepLeft(ob, cords, moved){
    let newX = ob.xcor - 1;
    if(checkCords(newX, ob.ycor, cords)){
      ob.xcor = newX;
      moved = true;
    }
  }

  //stepNone
  stepNone(ob, cords, moved){
    moved = false;
  }
}


//draw my object
function drawObjects(){
  for (let i = 0; i < numOfObjects; i++){
    const object = document.createElement('div');
    object.classList.add(`object`);
    object.id = `obj-${i}`;
    objectDiv.appendChild(object);
  }
}

//kill
function kill(){
  let indicies = [];
  let condition;
  for (let i = 0; i < objects.length; i++){
    if(isKill){
      condition = 
      ((killZone[0] <= objects[i].xcor) &&
      (objects[i].xcor <= killZone[1])) &&
      ((killZone[2] <= objects[i].ycor) &&
      (objects[i].ycor <= killZone[3]))
      ;
    }else{
      condition = !(
        ((killZone[0] <= objects[i].xcor) &&
        (objects[i].xcor <= killZone[1])) &&
        ((killZone[2] <= objects[i].ycor) &&
        (objects[i].ycor <= killZone[3]))
      );
    }
    if(condition){
      objects[i].xcor = -1;
      indicies.push(i);
    }
  }
  survivalRate.push(Math.round((100 - ((indicies.length/numOfObjects)*100)) * 10) / 10);
  return indicies;
}

//duplicate
function duplicate(indicies){
  let numOfDeaths = indicies.length;

  if(numOfDeaths === numOfObjects){
    objects = [];
    createObjects();
    console.log("All objects died...");
    return undefined;
  }

  let op = [];
  let counter = 0;
  for (let i = 0; i < numOfObjects; i++){
    if(indicies[counter] !== i){
      op.push(i);
    }else{
      counter++;
    }
  }
  let copy = op.slice();

  for(let i = 0; i < numOfDeaths; i++){
    if(op.length === 0){
      op = copy.slice();
    }

    let rand1 = Math.round(Math.random() * (op.length - 1));

    let rep = new Replicase1(objects[op[rand1]].genome, objects, op);
    let rand2 = rep.findMate();


    //console.log("op = ", op, "\nrand1 = ", rand1, "rep = ", rep, "rand2 = ", rand2);


    objects[indicies[i]].genome = recombinator(
      objects[op[rand1]].genome, objects[op[rand2]].genome
    );
    objects[indicies[i]].color = objects[indicies[i]].setColor();

    if(rand1 === rand2){
      op.splice(rand1, 1);
    }else{
      if(rand1 > rand2){
        op.splice(rand1, 1);
        op.splice(rand2, 1);
      }else{
        op.splice(rand2, 1);
        op.splice(rand1, 1);
      }
    }
  }
}

//recombinator
function recombinator(genome1, genome2){
  let newGenome = ""; 
  for (let i = 0; i < geneticRule.length - 1; i++){
    if(Math.random() < 0.5){
      newGenome += genome1.slice(geneticRule[i], geneticRule[i + 1]);
    }else{
      newGenome += genome2.slice(geneticRule[i], geneticRule[i + 1]);
    }
  }
  return newGenome;
}

//mutate
function mutate(){
  for (let i = 0; i < objects.length; i++){
    let newGenome = "";
    for (let j = 0; j < genomeLength; j++){
      let mutates = (Math.floor(Math.random() * mutationRate)) === 0;
      let chr = objects[i].genome.slice(j, j + 1);
      if(mutates){
        let randChar = chr;
        while (randChar === chr) {
          randChar = nucleotides[Math.floor(Math.random() * nucleotides.length)];
        }
        newGenome += randChar;
      }else{
        newGenome += chr;
      }
    }
    objects[i].genome = newGenome;
  }
}

function updateObjects(){
  for (let i = 0; i < numOfObjects; i++){
    const object = document.querySelectorAll('.object');
    object[i].style.left = (objects[i].xcor * 10) + 'px';
    object[i].style.top = (objects[i].ycor * 10) + 'px';
    object[i].style.backgroundColor = objects[i].color;
  }
}

function nextGeneration(){
  let indicies = kill();
  duplicate(indicies);
  mutate();
  genRandomCords();
  return indicies.length;
}

function moveButton(){
  const button = document.querySelector('.move-button');
  button.disabled = true;
  button.style.opacity = 0.5;
  document.querySelector('.myBar').style.width = "0%";
  let track = 0;
  let width = 0;
  const elem = document.querySelector('.myBar');
  elem.style.width = "0%";
  let myInterval = setInterval(frame, 3000/stepsPerGen);
  function frame(){
    moveObjects();
    updateObjects();
    track ++;
    if(track === stepsPerGen){
      document.querySelector('.myBar').style.width = "0%";
      clearInterval(myInterval);
      button.disabled = false;
      button.style.opacity = 1;
    }else{
      width += (100/stepsPerGen);
      elem.style.width = width + "%";
    }
  }
}

function nextButton(){
  document.querySelector('.myBar').style.width = "0%";
  nextGeneration();
  updateObjects();
}

function skipButton(){
  const skipValue = document.getElementById("skip-value");
  if(skipValue.value === "" || isNaN(parseInt(skipValue.value)) || parseInt(skipValue.value) <= 0){
    alert("Please enter a valid skip value greater than 0.");
    return;
  }
  const skipButton = document.querySelector('#skip-button');
  skipButton.disabled = true;
  skipButton.style.opacity = 0.5;
  document.querySelector('.myBar').style.width = "0%";
  let skips = parseInt(document.getElementById("skip-value").value);
  let track = 0;
  let width = 0;
  const elem = document.querySelector('.myBar');
  let myInterval2 = setInterval(frame, 100/skips);
  function frame(){
    for (let j = 0; j < stepsPerGen; j++){
      moveObjects();
    }
    nextGeneration();
    track ++;
    if(track === skips){
      updateObjects();
      document.querySelector('.myBar').style.width = "0%";
      clearInterval(myInterval2);
      skipButton.disabled = false;
      skipButton.style.opacity = 1;
    }else{
      width += (100/skips);
      elem.style.width = width + "%";
    }
  }
}

function printGenomeFrequencies(){
  genomeicFrequencies = [];
  for (let i = 0; i < geneticDescriptor.length; i++){
    const keys = []
    const values = [];
    for (let j = 0; j < objects.length; j++){
      let key = [objects[j].genome.slice(geneticRule[i], geneticRule[i + 1])];
      let old = false;
      for (let k = 0; k < keys.length; k++){
        if(String(keys[k]).valueOf() === String(key).valueOf()){
          old = true;
          values[k] += 1;
          break;
        }
      }
      if(!old){
        keys.push(key);
        values.push(1);
      }
    }
    var keys2 = keys.slice(0);
    function byValues(a,b){
      return values[keys.indexOf(b)] - values[keys.indexOf(a)];
    }
    keys2.sort(byValues);
    values.sort(function(a, b){return b - a});
    genomeicFrequencies.push(keys2, values);
  }
}

function printFreq(){
  for (let i = 0; i < genomeicFrequencies.length / 2; i++){
    console.log(geneticDescriptor[i]);
    for (let j = 0; j < genomeicFrequencies[i * 2].length; j++){
      console.log(genomeicFrequencies[i * 2][j], ": ", genomeicFrequencies[(i * 2) + 1][j]);
    }
  }
}

function printButton(){
  for (let i = 0; i < objects.length; i++){
    console.log(objects[i].genome);
  }
  printGenomeFrequencies();
  data();
}

function data(){
  if(lineGraph !== undefined){
    lineGraph.destroy();
  }
  if(pieChart !== undefined){
    pieChart.destroy();
  }

  let myChart = document.getElementById('survival-rate-chart').getContext('2d');
  let gens = [];
  for(let i = 0; i < survivalRate.length; i++){
    gens.push(i + 1);
  }

  lineGraph = new Chart(myChart, {
    type:'line',
    data: {
      labels:gens,
      datasets:[{
        label:'Survival Rate',
        data: survivalRate,
        borderColor: '#ff0000',
      }]
    },
    options: {}
  });



  let pir = document.getElementById('P1Mov-pie-chart').getContext('2d');

  pieLab = genomeicFrequencies[0];
  pieData = genomeicFrequencies[1];

  pieChart = new Chart(pir, {
    type:'doughnut',
    data: {
      labels:pieLab,
      datasets:[{
        label:'P1Mov',
        data: pieData,
        borderColor: '#ff0000',
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

function selectButton(){
  var cnv = document.getElementById("grid-pattern");
  var ctx = cnv.getContext("2d");
  if (ctx.strokeStyle === "#000000"){
    drawGridPattern("#ffffff");
  } else {
    drawGridPattern("#000000");
  }
}

function killButton(){
  let x1 = parseInt(document.getElementById("x1-value").value);
  let x2 = parseInt(document.getElementById("x2-value").value);
  let y1 = parseInt(document.getElementById("y1-value").value);
  let y2 = parseInt(document.getElementById("y2-value").value);
  let safeCheckBox = document.getElementById("safe-box").checked;

  killZone = [x1, x2, y1, y2];
  isKill = !(safeCheckBox);
}

function resetButton(){
  survivalRate = [];
  objects = [];
  killZone = [0, 44, 0, 49];
  isKill = true;
  createObjects();
  drawObjects();
  updateObjects();
  if(lineGraph !== undefined){
    lineGraph.destroy();
  }
  if(pieChart !== undefined){
    pieChart.destroy();
  }
  document.querySelector('.genome-descriptor').innerHTML = `
  <h3 id="object-name"></h3>
  <div id="genome"></div>
  <div id="genes"></div>
  `;
}

function addOptions(){
  var select = document.getElementById('pie-chart-gene-options');
  for(let i = 0; i < geneticDescriptor.length; i++){
    var opt = document.createElement('option');
    opt.value = i;
    opt.innerHTML = geneticDescriptor[i];
    select.appendChild(opt);
  }
}

function optionsChanged(){
  let i = parseInt(document.getElementById('pie-chart-gene-options').value);
  pieLab = genomeicFrequencies[i * 2];
  pieData = genomeicFrequencies[(i * 2) + 1];
  pieChart.data.datasets[0].data = pieData;
  pieChart.data.labels = pieLab;
  pieChart.update();
}

function pickButton(){
  const children = document.querySelector('.objects').children;
  for (let i = 0; i < children.length; i++){
    const child = children[i];
    child.addEventListener('click', () => {printObjectsDetail(i)});
    child.style.borderColor = 'white';
  }
  document.querySelector('#genes').innerHTML = '';
}

function clearOnClick() {
  const children = document.querySelector('.objects').children;
  for (let i = 0; i < children.length; i++){
    const child = children[i];
    child.style.borderColor = 'black';
    child.replaceWith(child.cloneNode(true));
  }
}

function printObjectsDetail(id) {
  const genome = objects[id].genome;
  const colour = objects[id].color;

  const genomeName = document.querySelector('#object-name');
  genomeName.textContent = `Object ${id + 1}`;
  genomeName.style.color = getContrastYIQ(colour);
  genomeName.style.backgroundColor = colour;

  const genomeComponent = document.querySelector('#genome');
  genomeComponent.innerHTML = '';

  let counter = 0;
  Object.keys(genomeKeys).forEach(key => {
    const descriptor = genomeKeys[key];
    const start = descriptor.start;
    const end = descriptor.end;
    const value = genome.slice(start, end);
    const highlightColour = descriptor.colour;
    
    const marker = document.createElement('mark');
    marker.style.backgroundColor = highlightColour;
    marker.textContent = value;
    marker.className = 'genome-marker';
    if (descriptor.type === 'promoter') {
      marker.classList.add('promoter');
      if (value.includes(activationCodon)) {
        marker.classList.add('active-prom');
      } else {
        marker.classList.add('inactive-prom');
      }
    }

    const label = document.createElement('span');
    label.textContent = `${key} - ${descriptor.description}`;
    label.className = 'genome-label';

    marker.appendChild(label);

    marker.addEventListener('click', () => {
      pickGene(genome, key);
    });
    genomeComponent.appendChild(marker);
    counter ++;
  });


  clearOnClick();
}

function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");

  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);

  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  return yiq >= 128 ? "black" : "white";
}

function pickGene(genome, geneKey) {
  const geneComponent = document.querySelector('#genes');
  geneComponent.innerHTML = '';
  let movementsIncluded = false;
  let movementValues = [];
  let title = "";
  let geneList = [];

  // First movement category
  if (geneKey.includes("1") && geneKey.includes("Mov")) {
    title = "1st Movement Category";
    geneList = ["P1Mov", "1MovU", "1MovR", "1MovD", "1MovL", "1MovN"];
  }
  // Second movement category
  else if (geneKey.includes("2") && geneKey.includes("Mov")) {
    title = "2nd Movement Category";
    geneList = ["P2Mov", "2MovU", "2MovR", "2MovD", "2MovL", "2MovN"];
  }
  // Specific movements
  else if (geneKey.includes("MovX") || geneKey.includes("MovY")) {
    title = "Specific Movement Category";
    geneList = ["PMovX", "MovXC", "PMovY", "MovYC"];
  }
  // Replicase genes
  else if (geneKey.includes("Rep")) {
    title = "Replicase Genes";
    geneList = ["RepR", "RepC", "RepS"];
  }
  // Random identifier
  else if (geneKey.includes("Rand")) {
    title = "Random Identifier";
    geneList = ["Rand"];
  }

  const categoryHeading = document.createElement('h2');
  categoryHeading.textContent = title;
  categoryHeading.className = 'category';
  geneComponent.appendChild(categoryHeading);

    geneList.forEach(gene => {
      const info = genomeKeys[gene];
      const start = info.start;
      const end = info.end;
      const value = genome.slice(start, end);
      const summary = info.summary;
      const highlightColour = info.colour;

      const geneElement = document.createElement('div');
      const geneName = document.createElement('h3');
      geneName.textContent = `${gene} -  ${info.description}`;
      geneName.style.fontStyle = 'italic';
      geneName.style.textDecoration = 'underline';

      const marker = document.createElement('mark');
      marker.style.backgroundColor = highlightColour;
      marker.textContent = value;
      marker.className = 'genome-marker-copy';

      const geneSummary = document.createElement('p');
      geneSummary.textContent = summary;

      geneElement.append(geneName, marker, geneSummary);

      if (info.type === 'promoter') {
        const promInfo = document.createElement('p');
        promInfo.textContent = `A promoter must contain the activation codon "${activationCodon}" to be active. For this promoter, it is ${value.includes(activationCodon) ? 'active' : 'inactive'}.`;
        geneElement.appendChild(promInfo);
      } else if (info.type === 'movement') {R
        movementsIncluded = true;
        const descriptions = document.createElement('div');

        const movementInfo = document.createElement('p');
        movementInfo.textContent = `This gene allows the object to move in the specified direction using probability by converting the nucleotides into numbers by using the bases as a 4-base number system, starting from lowest to highest value: A, C, G, T (alphabetical).`;

        const movementCalc = document.createElement('p');
        const movVal =  dnaToNum(value);
        movementValues.push(movVal);
        movementCalc.textContent = `The value of this gene is ${movVal} out of a maximum of ${dnaToNum('T'.repeat(end - start))}.`;

        const movementExplanation = document.createElement('p');
        movementExplanation.textContent = `*The value itself does not directly determine the movement, but rather the probability of moving in that direction when compared to the other values of the other movement genes within the same category. A random number is picked within the range of the sum of all the values, which determines the chance of movement. The higher the value, the higher the chance.`;

        descriptions.append(movementInfo, movementCalc, movementExplanation);
        geneElement.appendChild(descriptions);
      } else if (info.type === 'coordinate') {
        const coordValue = dnaToNum(value);
        const coordInfo = document.createElement('p');
        coordInfo.textContent = `This gene determines the co-ordinate for movement along the ${gene.includes('X') ? 'X' : 'Y'}-axis. The value is ${coordValue} out of a maximum of ${dnaToNum('T'.repeat(end - start))}. A value above ${gridDim - 1} will cause a random direction, and a value below 0 will be capped to 0, but if the value is equal to the object's current co-ordinate, it will not change the object's position.`;

        geneElement.appendChild(coordInfo);
      } else if (info.type === 'receptor') {
        const receptorInfo = document.createElement('p');
        receptorInfo.textContent = `The target substrate for receptor ${value} is ${invertDNA(value)}. The number of objects which contain this substrate is ${objects.filter(obj => obj.genome.slice(geneticRule[18], geneticRule[19]).includes(invertDNA(value))).length}.`;

        geneElement.appendChild(receptorInfo);
      } else if (info.type === 'chance') {
        const chanceValue = dnaToNum(value);
        const chanceInfo = document.createElement('p');
        chanceInfo.textContent = `The genes value is ${chanceValue}, so it is ${(chanceValue < 2 ? 'active' : 'inactive')}.`;

        geneElement.appendChild(chanceInfo);
      } else if (info.type === 'substrate') {
        const substrateInfo = document.createElement('p');
        substrateInfo.textContent = `The target receptor for substrate ${value} is ${invertDNA(value)}. The number of objects which contain this receptor is ${objects.filter(obj => obj.genome.slice(geneticRule[18], geneticRule[19]).includes(invertDNA(value))).length}.`;

        geneElement.appendChild(substrateInfo);
      }
      geneComponent.appendChild(geneElement);
    });

    if (movementsIncluded) {
      const movementTitle = document.createElement('h3');
      movementTitle.textContent = "Movement Calculations";
      movementTitle.style.textDecoration = 'underline';

      const movementSummary = document.createElement('p');
      movementSummary.textContent = `The values for the movements in this category are: Up: ${movementValues[0]}, Right: ${movementValues[1]}, Down: ${movementValues[2]}, Left: ${movementValues[3]}, None: ${movementValues[4]}.`;

      const movementProbs = document.createElement('p');
      const movTotal = movementValues.reduce((a, b) => a + b, 0);
      const movementProbsValues = movementValues.map(value => (value / movTotal * 100).toFixed(2) + '%');
      movementProbs.textContent = `Movement probabilities: Up: ${movementProbsValues[0]}, Right: ${movementProbsValues[1]}, Down: ${movementProbsValues[2]}, Left: ${movementProbsValues[3]}, None: ${movementProbsValues[4]}.`;

      geneComponent.append(movementTitle, movementSummary, movementProbs);
    }
}

function printObject(id) {
  console.log(objects[id].genome);
  clearOnClick();
}

function dnaToNum(dna) {
  let decimal = 0;
  let counter = 0;
  for (let digit of dna) {
    counter ++;
    decimal += (nucleotides.length ** (dna.length - counter)) * nucleotides.indexOf(digit.toUpperCase());
  }
  return decimal;
}

createObjects();
drawObjects();
updateObjects();
addOptions();

document.querySelector('.move-button').addEventListener("click", moveButton);
document.querySelector('.next-button').addEventListener("click", nextButton);
document.querySelector('.select-button').addEventListener("click", selectButton);
document.querySelector('.print-button').addEventListener("click", printButton);
document.querySelector('.reset-button').addEventListener("click", resetButton);
document.getElementById("skip-button").addEventListener("click", skipButton);
document.getElementById("kill-button").addEventListener("click", killButton);
document.getElementById('pie-chart-gene-options').addEventListener("change", optionsChanged);
document.querySelector('.pick-button').addEventListener('click', pickButton);

// objectDiv.addEventListener('click', e => {
//   for (let i = 0; i < numOfObjects; i++){
//     if (e.target.classList.contains(object[i])) {
//       console.log(object[i].value);
//     }
//   }
// });