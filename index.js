//Invocar Canvas
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const cover = document.querySelector('header')
//Declarar variables vacías
let frames = 0
let interval
//Elementos que se generan en canvas
let asteroids = []
let lasers = []
//Puntos de vida
let ironmanHP = []
let thanosHP = []
//Sonidos
let sounds = {
  shootSound: './Audio/blast',
  backgroundSound: './Audio/cumbia'
}
let shoot = new Audio()
shoot.src = sounds.shootSound
let cumbia = new Audio()
cumbia.src = sounds.backgroundSound
cumbia.volume = 0.1

//Generar Background
class Background {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = canvas.width
    this.height = canvas.height
    this.img = new Image()
    this.img.src = './Backgrounds/background'
    this.img.onload = () => {
      this.draw()
    }
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
}
const background = new Background()
//Generar Personaje Principal
class IronMan {
  //Descripción posión, tamaño e imagen y carga inicial
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speedX = 0
    this.speedY = 0
    this.width = 75
    this.height = 75
    this.img = new Image()
    this.img.src = './Personajes/ironman'
    this.hp = 200
    this.img.onload = () => {
      this.draw()
    }
  } //Puntos de vida
  drawHP() {
    ctx.fillStyle = 'darkred'
    ctx.fillRect(20, 20, this.hp, 20)
  } //Función dibujar personaje
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  //Actualización de posición y límites en el Gameboard
  newPos() {
    this.x += this.speedX
    if (this.x < 0) {
      this.x = 0
    } else if (this.x > 950) {
      this.x = 900
    }
    this.y += this.speedY
    if (this.y < 0) {
      this.y = 20
    } else if (this.y > 450) {
      this.y = 400
    }
  } //Funcion para determinar si choca con obstaculos (asteroides)
  checkIfTouch(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    )
  }
}
const ironman = new IronMan(50, 50)
//Generar Enemigo
class Thanos {
  //Descripción posión, tamaño e imagen y carga inicial
  constructor(x, y) {
    this.x = x
    this.y = y
    this.speedX = 0
    this.speedY = 0
    this.width = 100
    this.height = 100
    this.img = new Image()
    this.img.src = './Personajes/thanos'
    this.hp = 600
    this.img.onload = () => {
      this.draw()
    }
  }
  //Puntos de vida
  drawHP() {
    ctx.fillStyle = 'purple'
    ctx.fillRect(400, 20, this.hp, 20)
  }
  //Función dibujar enemigo
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height)
  }
  //Actualización de posición y límites en el Gameboard
  newPos() {
    this.x += this.speedX
    this.y += this.speedY
  }
  //Funcion para determinar si choca con obstaculos (asteroides)
  checkIfTouch(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    )
  }
}
const thanos = new Thanos(850, 250)
//Generar Obstáculo
class asteroid {
  //Descripción posión, tamaño e imagen
  constructor(y, width, height) {
    this.x = canvas.width
    this.y = y
    this.width = width
    this.height = height
    this.imgTop = new Image()
    this.imgTop.src = './Obstaculos/asteroide'
  }
  //Función dibujar obstáculo
  draw() {
    this.x--
    ctx.drawImage(this.imgTop, this.x, this.y, this.width, this.height)
  }
}

function generateasteroids() {
  if (frames % 100 === 0) {
    asteroids.push(new asteroid(Math.floor(Math.random() * 500), 100, 100))
  }
}

function drawasteroids() {
  asteroids.forEach(asteroid => {
    asteroid.draw()
  })
}
//Generar Láser
class Laser {
  //Descripción posión, tamaño e imagen y carga inicial
  constructor(width, height) {
    this.x = ironman.x + 25
    this.y = ironman.y
    this.width = width
    this.height = height
    this.imgLaser = new Image()
    this.imgLaser.src = './Obstaculos/laser'
  }
  //Función dibujar Láser
  draw() {
    this.x += this.width
    ctx.drawImage(this.imgLaser, this.x, this.y, this.width, this.height)
  }
}

function generateLaser() {
  lasers.push(new Laser(40, 10))
}

function drawLaser() {
  lasers.forEach(laser => {
    laser.draw()
  })
}
//Funciones Principales

function start() {
  interval = setInterval(update, 1000 / 60)
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  if (didGameEnd()) {
    return gameOver()
  }
  frames++
  background.draw()
  ironman.newPos()
  ironman.draw()
  ironman.drawHP()
  asteroidCollition()
  thanos.newPos()
  thanos.drawHP()
  thanos.draw()
  laserCollition()
  generateasteroids()
  drawasteroids()
  drawLaser()
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function didGameEnd() {
  if (ironman.hp <= 0 || thanos.hp <= 0) {
    return true
  }
}

function gameOver() {
  if (ironman.hp <= 0) {
    youLose()
  } else if (thanos.hp <= 0) {
    youWin()
  }
}

function youWin() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let win = new Image()
  win.src = './Mensajes/youwin'
  ctx.drawImage(win, 250, 0, 500, 500)
}

function youLose() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  let win2 = new Image()
  win2.src = './Mensajes/youlose'
  ctx.drawImage(win2, 0, 0, canvas.width, canvas.height)
  ctx.font = "50px 'Major Mono Display'"
  ctx.fillStyle = '#ffff'
  ctx.textAlign = 'center'
  ctx.fillText('Part of the journey is the end.', 500, 166)
  ctx.fillText('You Lose!  Thanos has got the Time Stone', 500, 333)
}

function asteroidCollition() {
  asteroids.forEach((asteroid, index) => {
    if (ironman.checkIfTouch(asteroid)) {
      asteroids.splice(index, 1)
      ironman.hp -= 20
    }
  })
}

function laserCollition() {
  lasers.forEach((laser, index) => {
    if (thanos.checkIfTouch(laser)) {
      lasers.splice(index, 1)
      thanos.hp -= 10
    }
  })
}

//Comandos en el teclado cuando presionas
document.onkeydown = e => {
  switch (e.keyCode) {
    case 38:
      ironman.speedY -= 1
      break
    case 40:
      ironman.speedY += 1
      break
    case 37:
      ironman.speedX -= 1
      break
    case 39:
      ironman.speedX += 1
      break
    case 13:
      cover.style.display = 'none'
      canvas.style.display = 'block'
      cumbia.play()
      if (interval) break
      start()
      break
    default:
      break
  }
}
//Comandos en el teclado cuando sueltas
document.onkeyup = e => {
  switch (e.keyCode) {
    case 32:
      generateLaser()
      shoot.play()
      break
    default:
      break
  }
}
