// UI
const elRoot = document.querySelector(':root')
const elGameGrid = document.querySelector('.game-grid')
const elPaintButtons = document.querySelectorAll('.btn-p')
const elBtnBlackWhite = document.querySelector('.btn-bw')
const elBtnRainbow = document.querySelector('.btn-rainbow')
const elBtnShader = document.querySelector('.btn-shader')
const elBtnEraser = document.querySelector('.btn-eraser')
const elBtnClearGrid = document.querySelector('.btn-clear')
const elSliderInput = document.getElementById('gridRange')
const elSliderOutput = document.querySelector('.slider-output')

let currentGameMode = 'black'

// Prevent mouse events that occur outside the grid from being unregistered
let isMouseDown = false
elRoot.addEventListener('mousedown', () => {
  isMouseDown = true
})
elRoot.addEventListener('mouseup', () => {
  isMouseDown = false
})

// Create Game Grid
function createGrid(multiplier) {
  const gridDefineRowsAndCols = `repeat(${multiplier}, ${500 / multiplier}px)` // 500 is grid size in px

  elGameGrid.style.gridTemplateColumns = gridDefineRowsAndCols
  elGameGrid.style.gridTemplateRows = gridDefineRowsAndCols

  const gridDocFragment = document.createDocumentFragment()

  for (let i = 0; i < (multiplier ** 2); i++) {
    const div = document.createElement('div')
    div.classList.add('grid-cell')
    gridDocFragment.appendChild(div)
  }

  elGameGrid.appendChild(gridDocFragment)
}

function clearGrid() {
  const elGridCells = document.querySelectorAll('.grid-cell')
  elGridCells.forEach((cell) => {
    cell.style.backgroundColor = ''
    cell.style.filter = ''
    cell.classList.remove('painted')
  })
}

function createRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}


function paintCell(cell, color, currentBrightness, type = null) {
  if (!type) {
    cell.style.backgroundColor = (typeof color === 'function') ? color() : color
    if (color === 'white') { // Erase cells when 'white' is passed to the function
      cell.classList.remove('painted')
      cell.style.filter = ''
    } else {
      cell.classList.add('painted')
    }
  } else if (currentBrightness > 0 && cell.classList.contains('painted')) {
      currentBrightness -= 10
      cell.style.filter = `brightness(${currentBrightness}%)`
  }
}

function paintGrid(color) {
  const elGridCells = document.querySelectorAll('.grid-cell')

  // Paint each cell the mouse hovers
  elGridCells.forEach((cell) => {
    cell.onmouseover = () => {
      if (isMouseDown) {
        paintCell(cell, color)
      }
    }
  })
  // Paint current cell
  elGridCells.forEach((cell) => {
    cell.onmousedown = () => {
      paintCell(cell, color)
    }
  })
}

function shadeGrid() {
  const elGridCells = document.querySelectorAll('.grid-cell')

  elGridCells.forEach((cell) => {
    let currentBrightness = 100
    cell.onmouseover = () => {
      if (isMouseDown  && cell.style.backgroundColor) {
        currentBrightness -= 10
        paintCell(cell, 'white', currentBrightness, 'shader')
        console.log(cell.style.backgroundColor);
      }
      cell.onmousedown = () => { }
    }
  })
}

function setChosenButtonStyle(element) {
  elPaintButtons.forEach((btn) => {
    btn.classList.remove('active-btn')
  })
  element.classList.add('active-btn')
}

function game() {
  // Initialize Grid And Choose Color
  createGrid(16)
  paintGrid(currentGameMode)

  // Control Buttons
  elBtnBlackWhite.onclick = function () {

    currentGameMode = 'black'
    paintGrid('black')
    setChosenButtonStyle(this)
  }
  elBtnRainbow.onclick = function () {
    currentGameMode = createRandomColor
    paintGrid(createRandomColor)
    setChosenButtonStyle(this)
  }
  elBtnShader.onclick = function () {
    currentGameMode = 'shader'
    shadeGrid()
    setChosenButtonStyle(this)
  }
  elBtnEraser.onclick = function () {
    currentGameMode = 'white'
    paintGrid('white')
    setChosenButtonStyle(this)
  }

  //Clear Button
  elBtnClearGrid.addEventListener('click', () => {
    clearGrid()
  })

  // Slider Functionality
  /* Divided to optimise slider speed and to keep the script
   from creating new DOM nodes every slider range step while sliding */
  elSliderInput.oninput = function () {
    elSliderOutput.innerHTML = `${this.value} x ${this.value}`
  }
  elSliderInput.onchange = function () {
    elGameGrid.textContent = ''
    createGrid(this.value)
    paintGrid(currentGameMode)
  }
}

game()
