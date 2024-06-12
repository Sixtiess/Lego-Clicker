document.getElementById("clicker").addEventListener("click",function() {
  game.totalClicks++;
  game.addToLegos(game.clickValue);
  })

var display = {
  updateLegos: function(){
    document.getElementById("legos").innerHTML = game.displayLegosAmt(game.legos).toFixed(2) + game.displayLegoLetter(game.legos);
    document.getElementById("legospersecond").innerHTML = game.displayLegosAmt(game.getLegosPerSecond()).toFixed(2) + game.displayLegoLetter(game.getLegosPerSecond())
    document.title = game.displayLegosAmt(game.legos).toFixed(2) + game.displayLegoLetter(game.legos)+" Legos - Lego Clicker";
  },

  updateShop: function(){
    document.getElementById("shopContainer").innerHTML = "";
    for(let i = 0; i< building.name.length; i++){
      document.getElementById("shopContainer").innerHTML += '<table class= "shopButton unselectable" onclick="building.purchase('+i+')"<tr><td id = "image"><img src = '+building.image[i]+'></td><td id = "nameAndCost"><p>'+building.name[i]+'</p><p><span>'+building.displayCost(building.cost[i])+building.displayCostLetter(building.cost[i])+'</span> legos</p></td><td id = "amount"><span>'+building.count[i]+'</span></td></tr></table>';
    }
  },

  updateUpgrades: function(){
   /*problem line(s?)*/ document.getElementById("upgradeContainer").innerHTML = "";
    for(let i = 0; i< upgrade.name.length; i++){
      if(!upgrade.purchased[i]){
        if(upgrade.type[i] == "building" && building.count[upgrade.buildingIndex[i]] >= upgrade.requirement[i]){

          document.getElementById("upgradeContainer").innerHTML += '<img src="'+upgrade.image[i]+'" title ="'+upgrade.name[i]+': '+upgrade.description[i]+'; Costs '+upgrade.cost[i]+'" " onclick ="upgrade.purchase('+i+')">'

          //document.getElementById("hide").innerHTML += '<p>'upgrade.name[i]'</p>'
            
        } else if(upgrade.type[i] == "click" && game.totalClicks >= upgrade.requirement[i]){
          
            document.getElementById("upgradeContainer").innerHTML += '<img src="'+upgrade.image[i]+'" title ="'+upgrade.name[i]+': '+upgrade.description[i]+'; Costs '+upgrade.cost[i]+'" " onclick ="upgrade.purchase('+i+')">'
          
          console.log('updateUpgrades else-if ran properly')
        }
      }
    }
  }
}

var game = {
  legos: 0,
  totalLegos: 0,
  totalClicks: 0,
  clickValue: 1,
  version:0.2,

  addToLegos: function (amount){
    this.legos += amount;
    this.totalLegos += amount;
    display.updateLegos();
  },

  getLegosPerSecond: function (){
    var legosPerSecond = 0;
    for(let i = 0; i < building.name.length; i++){
      legosPerSecond += building.income[i] * building.count[i]
    }
    return legosPerSecond;
  },
  
  displayLegoLetter: function(num){
    let index = 0;
    let letterArr = ['','k','M','B','T']
    while(num / 1000 >= 1){
      num /= 1000;
      index++;
    }
    return letterArr[index];
  },

  displayLegosAmt: function(num){
    while(num / 1000 >= 1){
      num /= 1000;
    }
    return num;
  },

}


var building = {
  name: [
    "Dot",
    "Tube",
    "Brick",
    "Plate",
    "Tile",
    "Grill",
    "Minifigure",
    "Car",
    "Plane"
  ],
  image: [
    "images/dot.png",
    "images/tube.png",
    "images/bric.png",
    "images/plate.png",
    "images/tile.png",
    "images/grill.png",
    "images/minifig.png",
    "images/legocar.png",
    "images/plen.png"
  ],
  count:[0,0,0,0,0,0,0,0,0],
  income:[
    1,
    5,
    50,
    200,
    1000,
    10000,
    1000000,
    25000000,
    500000000,
  ],
  cost:[
    15,
    300,
    5000,
    40000,
    200000,
    5000000,
    50000000,
    1000000000,
    300000000000
  ],

  displayCostLetter: function(num){
    let index = 0;
    let letterArr = ['','k','M','B','T']
    while(num / 1000 >= 1){
      num /= 1000;
      index++;
    }
    return letterArr[index];
  },

  displayCost: function(num){
    while(num / 1000 >= 1){
      num /= 1000;
    }
    num = num.toFixed(2)
    return num;
  },
    
  purchase: function(index){
    if(game.legos >= this.cost[index]){
      game.legos -= this.cost[index];
      this.count[index]++;
      this.cost[index] = Math.ceil((this.cost[index] * 1.1).toFixed(2));
      display.updateLegos();
      display.updateShop();
      display.updateUpgrades();
    }
  }
}

var upgrade = {
  name: [
    "Red Dots",
    "Better Cursor",
    "Red Tube",
    "Red Bricks"
  ],
  image: [
    "images/dot.png",
    "images/cursor.png",
    "images/tube.png",
    "images/bric.png"
  ],
  description: [
    "Dots give you twice as many legos",
    "Clicking gives you twice as many legos",
    "Tubes give you twice as many legos",
    "Bricks give you twice as many legos"
  ],
  type: [
    "building",
    "click",
    "building",
    "building"
  ],
  cost: [
    200,
    1000,
    4000,
    50000
  ],
  buildingIndex: [
    0,
    -1,
    1,
    2
  ],
  requirement: [
    5,
    50,
    5,
    5
  ],
  bonus: [
    2,
    2,
    2,
    2
  ],
  purchased: [false,false,false,false],

  purchase: function(index){
    if(!this.purchased[index] && game.legos >= this.cost[index]){
      if(this.type[index] == "building" && building.count[this.buildingIndex[index]] >= this.requirement[index]){
        game.legos -= this.cost[index];
        building.income[this.buildingIndex[index]] *= this.bonus[index];
        this.purchased[index] = true;

        display.updateUpgrades();
        display.updateLegos();
        
      } else if(this.type[index] == "click" && game.totalClicks >= this.requirement[index]){
        game.legos -= this.cost[index];
        this.clickValue *= this.bonus[index];
        this.purchased[index] = true;

        display.updateUpgrades();
        display.updateLegos();
      }
    }
  }
}


function saveGame(){
  var gameSave = {
    legos: game.legos,
    totalLegos: game.totalLegos,
    totalClicks: game.totalClicks,
    clickValue: game.clickValue,
    version: game.version,
    buildingCount: building.count,
    buildingIncome: building.income,
    buildingCost: building.cost,
    upgradePurchased: upgrade.purchased
  }
  localStorage.setItem("gameSave",JSON.stringify(gameSave));
  
}

function loadGame(){
  var savedGame = JSON.parse(localStorage.getItem("gameSave"));
  if(localStorage.getItem("gameSave") !== null){
    if(typeof savedGame.legos !== "undefined") game.legos = savedGame.legos;
    if(typeof savedGame.totalLegos !== "undefined") game.totalLegos = savedGame.totalLegos;
    if(typeof savedGame.totalClicks !== "undefined") game.totalClicks = savedGame.totalClicks;
    if(typeof savedGame.clickValue !== "undefined") game.clickValue = savedGame.clickValue;
    if(typeof savedGame.version !== "undefined") game.version = savedGame.version;
    if(typeof savedGame.buildingCount !== "undefined"){
      for(let i = 0; i < savedGame.buildingCount.length; i++){
        building.count[i] = savedGame.buildingCount[i];
      }
    }
    if(typeof savedGame.buildingIncome !== "undefined"){
      for(let i = 0; i < savedGame.buildingIncome.length; i++){
        building.income[i] = savedGame.buildingIncome[i];
      }
    }
    if(typeof savedGame.buildingCost !== "undefined"){
      for(let i = 0; i < savedGame.buildingCost.length; i++){
        building.cost[i] = savedGame.buildingCost[i];
      }
    }
    if(typeof savedGame.upgradePurchased !== "undefined"){
      for(let i = 0; i < savedGame.upgradePurchased.length; i++){
        upgrade.purchased[i] = savedGame.upgradePurchased[i];
      }
    }
  }
}

function resetGame(){
  if(confirm('Are you sure you want to reset all data?')){
    var gameSave = {};
    localStorage.setItem("gameSave",JSON.stringify(gameSave));
    location.reload();
  }
}

window.onload = function(){
    loadGame()
    display.updateLegos();
    display.updateUpgrades();
    display.updateShop();
   // console.log('window.onload ran properly')
  }

setInterval(function(){
  game.legos += game.getLegosPerSecond();
  game.totalLegos += game.getLegosPerSecond();
  display.updateLegos();
},1000)//1000 ms; 1 second

setInterval(function(){
  display.updateUpgrades();
  display.updateLegos();
},1000)


setInterval(function(){
      saveGame();
    },30000)//30000 ms; 30 seconds

document.addEventListener('keydown',function(event){
  if(event.ctrlKey && event.key == 's'){
    event.preventDefault();
    saveGame();
  }
},false)