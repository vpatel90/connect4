(function(){

var ROWS = 6;
var COLUMNS = 7;
var SIZE = 64;
var canvases = [];
var drawingSurfaces =[];
var cells = [];

var output = document.querySelector("#output");

var gameOver = false;

var turn =
{
  one: 1,
  two: 2,

  state: 2
};
var cell =
{
  IMAGE: "spritesheet.png",
  SIZE: 64,
  COLUMNS: 3,

  //States
  empty: 0,
  red: 1,
  blue: 2,

  state: 0
};

/*Building the grid for the game
 ver1 each cell is going to be its own canvas no animation
 each cell is also going to be its own object

*/

var image = new Image();
image.addEventListener("load", loadHandler, false);
image.src = "../images/" + cell.IMAGE;

function loadHandler()
{
  buildTable();
  render();
}

function buildTable()
{
  for(var row = 0; row < ROWS; row++)
  {
    for(var col = 0; col < COLUMNS; col++)
    {
      var newCell = Object.create(cell);
      cells.push(newCell);

      var canvas = document.createElement("canvas");
      canvas.setAttribute("width", SIZE);
      canvas.setAttribute("height", SIZE);
      canvas.setAttribute("style", "border: 1px dashed black");
      stage.appendChild(canvas);
      canvas.style.position = "absolute";
      canvas.style.top = row * (SIZE + 5) + 50 + "px";
      canvas.style.left = col * (SIZE + 5) + 50 + "px";
      //console.log("canvas.style.left:" + canvas.style.left);
      canvas.addEventListener("mousedown", mousedownHandler, false);
      canvases.push(canvas);

      var drawingSurface = canvas.getContext("2d");
      drawingSurfaces.push(drawingSurface);
    }
  }
}

function mousedownHandler(event)
{
  clickedCanvas = event.target;

  for(var i = 0; canvases.length; i++)
  {
    if(canvases[i] === clickedCanvas)
    {
      var col = i % 7;
      checkBelow(col)
      break;
    }
  }
}

function checkBelow(cellId)
{
  var thisCell = cells[cellId];

  if(thisCell.state === 0){
    var cellId = cellId + 7;
    if(cellId > 41){
      var cellId = cellId - 7;
      changeState(cellId)
    }
    else{
      checkBelow(cellId)
    }
  }
  else{
    if (cellId < 7) {
      render()
    }
    else{
    var cellId = cellId - 7;
    changeState(cellId)
    }
  }
}

function changeState(cellId)
{
  if(turn.state === 1)
  {
    cells[cellId].state = cell.red;
  }
  else{
    cells[cellId].state = cell.blue;
  }

  checkConnected(cellId)
  render()
}

function checkConnected(cellId)
{
  var thisCell = cells[cellId];

  var thisCellState = thisCell.state;
  var connected = 1;
  if(cellId < 35){
  checkUpDown(connected,cellId)
  }

  checkLeftRight(connected,cellId)
  checkTlBr(connected,cellId)
  checkTrBl(connected,cellId)
}

function checkUpDown(connected, cellId)
{
  if(connected === 4)
  {
    endGame()
  }

  var thisCell = cells[cellId];
  var thisCellState = thisCell.state;
  var newId = cellId + 7;
  if(newId > 41){
    return;
  }
  var nextCell = cells[newId];
  //console.log(connected + "hi");

  if(thisCell.state === nextCell.state)
  {
    connected++;
    //console.log(connected + "hi again");
    checkUpDown(connected,newId)
  }

}

function checkLeftRight(connected, cellId)
{
  var mod = cellId % 7;
  var rowStart = cellId - mod;
  var thisRow = []
  for(var i = 0; i < 7; i++)
  {
    thisRow.push(cells[rowStart + i]);
  }
  for(var i = 0; i < thisRow.length; i++)
  {
    if(thisRow[i].state === 0)
    {
      connected = 1;
    }
    else if ((i === 0)) {
      connected = 1;
    }
    else if ((i !== 0) && (thisRow[i].state === thisRow[i-1].state)) {
      connected++;
      console.log(connected);
      if(connected === 4)
      {
        endGame()
        break;
      }
    }
    else{
      connected = 1;
    }

  }
}

function checkTlBr(connected, cellId)
{
  var mod = cellId % 7;
  //console.log("reporting in" + mod);
  while ((mod > 0)&&(cellId > 6)) {
    var mod = mod - 1;
    var cellId = cellId - 8;
  }
  var topLeft = cellId;
  var thisDiag = [];
  var oldMod = 0;
  var newMod = 1;

  while ((newMod > oldMod) && (cellId < 42)) {
    oldMod = cellId % 7;
    thisDiag.push(cells[cellId]);

    var cellId = cellId + 8;
    newMod = cellId % 7;
  }

  if(thisDiag.length < 4){
    return;
  }
  for(var i = 0; i < thisDiag.length; i++)
  {
    if(thisDiag[i].state === 0)
    {
      connected = 1;
    }
    else if ((i === 0)) {
      connected++;
    }
    else if ((i !== 0) && (thisDiag[i].state === thisDiag[i-1].state)) {
      connected++;
      console.log(connected);
      if(connected === 4)
      {
        endGame()
        break;
      }
    }
    else{
      connected = 1;
    }

  }
}

function checkTrBl(connected, cellId)
{
  var mod = cellId % 7;

  while ((mod < 6)&&(cellId > 6)) {

    var mod = mod + 1;
    var cellId = cellId - 6;
    //console.log("reporting in" + cellId);
  }
  var topRight = cellId;
  var thisDiag = [];
  var oldMod = 1;
  var newMod = 0;

  while ((newMod < oldMod) && (cellId < 42)) {
    oldMod = cellId % 7;
    thisDiag.push(cells[cellId]);
    //console.log("reporting in" + cellId);
    var cellId = cellId + 6;
    newMod = cellId % 7;
  }

  if(thisDiag.length < 4){
    return;
  }
  for(var i = 0; i < thisDiag.length; i++)
  {
    if(thisDiag[i].state === 0)
    {
      connected = 1;
    }
    else if ((i === 0)) {
      connected++;
    }
    else if ((i !== 0) && (thisDiag[i].state === thisDiag[i-1].state)) {
      connected++;
      if(connected === 4)
      {
        endGame()
        break;
      }
    }
    else{
      connected = 1;
    }

  }
}

function endGame()
{
  //console.log("you win");
  gameOver = true;
  for(var i=0; i < canvases.length; i++)
  {
    var canvas = canvases[i];
    canvas.removeEventListener("mousedown", mousedownHandler, false);
  }
}


function render()
{
  for(var i = 0; i < drawingSurfaces.length; i++)
  {
    var cell = cells[i];
    var drawingSurface = drawingSurfaces[i];
    drawingSurface.clearRect(0, 0, SIZE, SIZE);

    switch(cell.state)
    {
      case cell.empty:
        drawingSurface.drawImage
        (
          image,
          0,0,64,64,
          0,0,64,64
        );
        break;

      case cell.red:
        drawingSurface.drawImage
        (
          image,
          64,0,64,64,
          0,0,64,64
        );
        break;

      case cell.blue:
        drawingSurface.drawImage
        (
          image,
          128,0,64,64,
          0,0,64,64
        );
        break;
      }
  }

  if(gameOver){
    output.innerHTML
    = "Player " + turn.state +", Wins"
  }
  else{
    switch(turn.state)
    {
      case turn.one:
        turn.state = turn.two;
        break;
      case turn.two:
        turn.state = turn.one;
        break;
    }
  output.innerHTML
  = "Player " + turn.state +", Make Your Move!"
  }

}

}());
