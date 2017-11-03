// marca los pulsos del juego
window.requestAnimFrame = (function () {
  return  window.requestAnimationFrame    ||
      window.webkitRequestAnimationFrame  ||
      window.mozRequestAnimationFrame     ||
      window.oRequestAnimationFrame       ||
      window.msRequestAnimationFrame      ||
      function ( /* function */ callback, /* DOMElement */ element) {
          window.setTimeout(callback, 1000 / 60);
      };
})();

arrayRemove = function (array, from) {
  var rest = array.slice((from) + 1 || array.length);
  array.length = from < 0 ? array.length + from : from;
  return array.push.apply(array, rest);
};

// juego
var game = (function () {
  // variables globales de la aplicacion
  var canvas;
  var ctx;
  var buffer;
  var bufferctx;
  var fondo_principal;
  // variables del jugador 1
  var player_1;
  var player_1_life = 3;
  var player_1_bullet;
  var player_1_bullets = [];
  var player_1_killed;
  var player_1_speed = 12;
  var player_1_shoot;
  var player_1_next_shoot;
  var player_1_now = 0;
  var player_1_shoot_delay = 250;
  var player_1_carril = {
    x: 1200,
    y: 600
  }
  var player_1_bullet_x;
  var player_1_bullet_y;
  // variables del jugador 2
  var player_2;  
  var player_2_life = 3;
  var player_2_bullet;
  var player_2_bullets = [];
  var player_2_killed;
  var player_2_speed = 5;
  var player_2_shoot;
  var player_2_next_shoot;
  var player_2_now = 0;
  var player_2_shoot_delay = 250;
  var player_2_carril = {
    x: 1200,
    y: 600
  }
  var player_2_bullet_x;
  var player_2_bullet_y;
  // variables del enemigo 1
  var enemy_1;
  var enemy_1_life = 10;
  var enemy_1_bullet;
  var enemy_1_bullets = [];
  var enemy_1_sprite = {
    //animation = [],
    damaged: new Image (),
    killed: new Image ()
  }
  // variables del enemigo 2
  var enemy_2;
  var enemy_2_life = 20;
  var enemy_2_bullet;
  var enemy_2_bullets = [];
  var enemy_2_sprite = {
    //animation = [],
    damaged: new Image (),
    killed: new Image ()
  }
  // variable de fin de juego malo
  var game_over = false;
  // variable de fin de juego bueno
  var the_end = false;
  // tecla pulsada
  var keyPressed = {};
  // controles
  var keyMap = {
    // jugador 1
    p1_up: 87,      // w
    p1_down: 83,    // s
    p1_left: 65,    // a
    p1_right: 68,   // d
    p1_fire_1: 81,  // q
    p1_fire_2: 69,  // e
    // jugador 2
    p2_up: 104,     // 8
    p2_down: 101,   // 5
    p2_left: 100,   // 4
    p2_right: 102,  // 6
    p2_fire_1: 103, // 7
    p2_fire_2: 105, // 9
    // activar jugador 2
    p2_enable: 
  }
  // gameloop
  function loop () {
    update ();
    draw ();
  }
  // funcion que carga las imagenes
  function preloadImages (){
    // animaciones
    /*
    for(var i = 1; i <= 8; i++){
      var enemy_1_frame = new Image ();
      enemy_1_frame.src = 'images/' + i + '.png';
      enemy_1_sprite.animation [i-1] = enemy_1_frame;

      var enemy_2_frame = new Image ();
      enemy_2_frame.src = 'images/' + i + '.png';
      enemy_2_sprite.animation [i-1] = enemy_2_frame;
    }
    */
    enemy_1_bullet = new Image ();
    enemy_1_bullet.src = 'images/pepino_bullet.png';
    enemy_1_sprite.damaged.src = 'images/pepino_damaged.png'
    enemy_1_sprite.killed.src = 'images/pepino_killed.png'; 

    enemy_2_bullet = new Image ();
    enemy_2_bullet = "";
    enemy_2_sprite.damaged.src = "";
    enemy_2_sprite.killed.src = "";

    player_1_bullet = new Image ();
    player_1_bullet.src = 'images/player_1_bullet.png'

    player_2_bullet = new Image ();
    player_2_bullet.src = 'images/player_2_bullet.png'

    fondo_principal = new Image();
    fondo_principal.src = 'images/fondo_2.png';
    console.log("con exito");
  }

  // inicializacion
  function init (){
    console.log("cargando imagenes ... :")
    preloadImages ();

    console.log("creando pantalla ... :");
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    buffer = document.createElement('canvas');
    buffer.width = canvas.width;
    buffer.height = canvas.height;
    bufferctx = buffer.getContext('2d');
    console.log("con exito");

    console.log("creando al jugador 1 ... :");
    player_1 = new Player_1 (player_1_life, 0);
    player_2 = new Player_2 (player_2_life, 0);
    console.log("con exito");

    console.log("cargando interfaz gráfica ... :");
    showLifeAndScore ();

    console.log("cargando inputs del teclado ... :")
    addListener(document, 'keydown', keyDown);
    addListener(document, 'keyup', keyUp);

    function anim (){
      loop ();
      requestAnimFrame(anim);
    }
    anim ();
  }

  function draw() {
    ctx.drawImage(buffer, 0, 0);
  }

  // interfaz del juego
  function showLifeAndScore () {
    bufferctx.fillStyle="rgb(59,59,59)";
    bufferctx.font="bold 16px Arial";
    //bufferctx.fillText("Puntos: " + (player_1.score + player_2.score), canvas.width - 100, 20);
    bufferctx.fillText("Vidas jugador 1: " + player_1.life, canvas.width - 180,40);
    //bufferctx.fillText("Vidas jugador 2: " + player_2.life, canvas.width - 100,60);
  }

  // devuelve un numero aleatorio
  function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
  }

  // jugador 1
  function Player_1(life, score) {
    var settings = {
        marginBottom : 60,
        defaultHeight : 66
    };
    // carga sprite
    player_1 = new Image();
    player_1.src = 'images/player_1.png';
    player_1.posX = -40;
    player_1.posY = canvas.height - (player_1.height == 0 ? settings.defaultHeight : player_1.height) - settings.marginBottom;
    player_1.life = life;
    player_1.score = score;
    player_1.dead = false;
    player_1.speed = player_1_speed;
    player_1_carril.x = player_1_carril.x/4;
    player_1_carril.y = player_1_carril.y/4;
    // disparo
    var shoot = function () {
      if(player_1_next_shoot < player_1_now || player_1_now == 0){
        p1_bullet_x = player_1_carril.x;
        p1_bullet_y = player_1_carril.y;
        player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY);
        player_1_shoot.x = player_1_carril.x;
        player_1_shoot.y = player_1_carril.y;
        player_1_shoot.add ();
        player_1_now += player_1_shoot_delay;
        player_1_next_shoot = player_1_now + player_1_shoot_delay;
      }else{
        player_1_now = new Date().getTime();
      }
    };
    // acciones del jugador
    player_1.doAnything = function() {
      if (player_1.dead)
          return;
      if (keyPressed.p1_left && (player_1.posX > (-120*player_1.posY + 56850)))
          player_1.posX -= player_1.speed;
      if (keyPressed.p1_right && (player_1.posX < (-120*player_1.posY + 57215)))
          player_1.posX += player_1.speed;
      if(keyPressed.p1_up && (player_1.posY > 473)){
          player_1.posY -= 0.05;
          player_1.posX += 6;
          player_1_carril.x -= 10;
          player_1_carril.y -= 5;
      }
      if(keyPressed.p1_down  && (player_1.posY < 474)){
        player_1.posY += 0.05;
        player_1.posX -= 6;
        player_1_carril.x += 10;
        player_1_carril.y += 5;
      }
      if (keyPressed.p1_fire_1){
          player_1_bullet_x = player_1_carril.x - 10;
          player_1_bullet_y = player_1_carril.y - 10;
          shoot();
      }
    };

    player_1.killPlayer = function() {
      if (this.life > 0) {
          this.dead = true;
          //evilShotsBuffer.splice(0, evilShotsBuffer.length);
          player_1_bullets.splice(0, player_1_bullets.length);
          this.src = player_1_killed.src;
          //createNewEvil();
          setTimeout(function () {
              player_1 = new Player_1(player_1.life - 1, player_1.score);
          }, 500);

      } else {
          //saveFinalScore();
          youLoose = true;
      }
    };
    return player_1;
  }

  // jugador 1
  function Player_2(life, score) {
    var settings = {
        marginBottom : 60,
        defaultHeight : 66
    };
    // carga sprite
    player_2 = new Image();
    player_2.src = 'images/player_2.png';
    player_2.posX = -40;
    player_2.posY = canvas.height - (player_2.height == 0 ? settings.defaultHeight : player_2.height) - settings.marginBottom;
    player_2.life = life;
    player_2.score = score;
    player_2.dead = false;
    player_2.speed = player_2_speed;
    player_2_carril.x = player_2_carril.x/4;
    player_2_carril.y = player_2_carril.y/4;
    // disparo
    var shoot = function () {
      if(player_2_next_shoot < player_2_now || player_2_now == 0){
        p2_bullet_x = player_2_carril.x;
        p2_bullet_y = player_2_carril.y;
        player_2_shoot = new Player_2_Shoot(player_2.posX + 30, player_2.posY);
        player_2_shoot.x = player_2_carril.x;
        player_2_shoot.y = player_2_carril.y;
        player_2_shoot.add ();
        player_2_now += player_2_shoot_delay;
        player_2_next_shoot = player_2_now + player_2_shoot_delay;
      }else{
        player_2_now = new Date().getTime();
      }
    };
    // acciones del jugador
    player_2.doAnything = function() {
      if (player_2.dead)
          return;
      if (keyPressed.p2_left && (player_2.posX > (-120*player_2.posY + 56850)))
          player_2.posX -= player_2.speed;
      if (keyPressed.p2_right && (player_2.posX < (-120*player_2.posY + 57215)))
          player_2.posX += player_2.speed;
      if(keyPressed.p2_up && (player_2.posY > 473)){
          player_2.posY -= 0.05;
          player_2.posX += 6;
          player_2_carril.x -= 10;
          player_2_carril.y -= 5;
      }
      if(keyPressed.p2_down  && (player_2.posY < 474)){
        player_2.posY += 0.05;
        player_2.posX -= 6;
        player_2_carril.x += 10;
        player_2_carril.y += 5;
      }
      if (keyPressed.p2_fire_1){
          player_2_bullet_x = player_2_carril.x - 10;
          player_2_bullet_y = player_2_carril.y - 10;
          shoot();
      }
    };

    player_2.killPlayer = function() {
      if (this.life > 0) {
          this.dead = true;
          //evilShotsBuffer.splice(0, evilShotsBuffer.length);
          player_2_bullets.splice(0, player_2_bullets.length);
          this.src = player_2_killed.src;
          //createNewEvil();
          setTimeout(function () {
              player_2 = new Player_2(player_2.life - 1, player_2.score);
          }, 500);

      } else {
          //saveFinalScore();
          youLoose = true;
      }
    };
    return player_2;
  }

  function playerAction() {
    player_1.doAnything();
    player_2.doAnything();
  }

  function Shoot( x, y, array, img) {
    this.posX = x;
    this.posY = y;
    this.image = img;
    this.speed = 5;
    this.identifier = 0;
    this.add = function () {
        array.push(this);
    };
    this.deleteShot = function (idendificador) {
        arrayRemove(array, idendificador);
    };
  }

  function Player_1_Shoot (x, y, bullet_x, bullet_y) {
    Object.getPrototypeOf(Player_1_Shoot.prototype).constructor.call(this, x, y, player_1_bullets, player_1_bullet);
    console.log(player_1_bullets.length);
    /*
    this.isHittingEvil = function() {
        return (!evil.dead && this.posX >= evil.posX && this.posX <= (evil.posX + evil.image.width) &&
            this.posY >= evil.posY && this.posY <= (evil.posY + evil.image.height));
    };*/
  }
  Player_1_Shoot.prototype = Object.create(Shoot.prototype);
  Player_1_Shoot.prototype.constructor = Player_1_Shoot;

  function Player_2_Shoot (x, y, bullet_x, bullet_y) {
    Object.getPrototypeOf(Player_2_Shoot.prototype).constructor.call(this, x, y, player_2_bullets, player_2_bullet);
    console.log(player_2_bullets.length);
    /*
    this.isHittingEvil = function() {
        return (!evil.dead && this.posX >= evil.posX && this.posX <= (evil.posX + evil.image.width) &&
            this.posY >= evil.posY && this.posY <= (evil.posY + evil.image.height));
    };*/
  }
  Player_2_Shoot.prototype = Object.create(Shoot.prototype);
  Player_2_Shoot.prototype.constructor = Player_2_Shoot;

  // teclado
  function addListener(element, type, expression, bubbling) {
    bubbling = bubbling || false;
    if (window.addEventListener) { // Standard
        element.addEventListener(type, expression, bubbling);
    } else if (window.attachEvent) { // IE
        element.attachEvent('on' + type, expression);
    }
    console.log("input con exito");
  }

  function keyDown(e) {
    var key = (window.event ? e.keyCode : e.which);
    for (var inkey in keyMap) {
        if (key === keyMap[inkey]) {
          console.log("dentro");
            e.preventDefault();
            keyPressed[inkey] = true;
        }
    }
    console.log("keydown con exito");
  }

  function keyUp(e) {
    var key = (window.event ? e.keyCode : e.which);
    for (var inkey in keyMap) {
        if (key === keyMap[inkey]) {
            e.preventDefault();
            keyPressed[inkey] = false;
        }
    }
    console.log("keyup con exito");
  }

  // fin de partida
  function showGameOver() {
    bufferctx.fillStyle="rgb(255,0,0)";
    bufferctx.font="bold 35px Arial";
    bufferctx.fillText("GAME OVER", canvas.width / 2 - 100, canvas.height / 2);
  }
  
  // funcion update
  function update() {
    
    drawBackground();
    
    if (the_end) {
      //showCongratulations();
      return;
    }

    if (game_over) {
      showGameOver();
      return;
    }
    
    bufferctx.drawImage(player_1, player_1.posX, player_1.posY, player_1_carril.x, player_1_carril.y);
    bufferctx.drawImage(player_2, player_2.posX, player_2.posY, player_2_carril.x, player_2_carril.y);
    /*
    bufferctx.drawImage(evil.image, evil.posX, evil.posY);

    updateEvil();
    */
    for (var j = 0; j < player_1_bullets.length; j++) {
      var disparoBueno = player_1_bullets[j];
      console.log(player_1_bullets[j].x, player_1_bullets[j].y);
      updatePlayer_1_Shoot(disparoBueno, j);
    }
    for (var j = 0; j < player_2_bullets.length; j++) {
      var disparoBueno = player_2_bullets[j];
      console.log(player_2_bullets[j].x, player_2_bullets[j].y);
      updatePlayer_2_Shoot(disparoBueno, j);
    }
    /*
    if (isEvilHittingPlayer()) {
      player.killPlayer();
    } else {
      for (var i = 0; i < evilShotsBuffer.length; i++) {
        var evilShot = evilShotsBuffer[i];
        updateEvilShot(evilShot, i);
      }
    }
    */
    showLifeAndScore();

    playerAction();
  }

  function checkCollisions(shot) {
    /*
    if (shot.isHittingEvil()) {
        if (evil.life > 1) {
            evil.life--;
        } else {
            evil.kill();
            player.score += evil.pointsToKill;
        }
        shot.deleteShot(parseInt(shot.identifier));
        return false;
    }*/
    return true;
  }

  function updatePlayer_1_Shoot(player_1_shoot, id) {
    if (player_1_shoot) {
      console.log("updating");
        player_1_shoot.identifier = id;
        if (checkCollisions(player_1_shoot)) {
            if (player_1_shoot.posX < 1200) {
                player_1_shoot.posX += 5;
                bufferctx.drawImage(player_1_shoot.image, player_1_shoot.posX, player_1_shoot.posY, player_1_shoot.x, player_1_shoot.y);            
            } else {
                player_1_shoot.deleteShot(parseInt(player_1_shoot.identifier));
            }
        }
    }
  }

  function updatePlayer_2_Shoot(player_2_shoot, id) {
    if (player_2_shoot) {
      console.log("updating");
        player_2_shoot.identifier = id;
        if (checkCollisions(player_2_shoot)) {
            if (player_2_shoot.posX < 1200) {
                player_2_shoot.posX += 5;
                bufferctx.drawImage(player_2_shoot.image, player_2_shoot.posX, player_2_shoot.posY, player_2_shoot.x, player_2_shoot.y);            
            } else {
                player_2_shoot.deleteShot(parseInt(player_2_shoot.identifier));
            }
        }
    }
  }

  function drawBackground() {
    var background;/*
    if (evil instanceof FinalBoss) {
      background = bgBoss;
    } else {*/
      background = fondo_principal;/*
    }*/
    bufferctx.drawImage(background, 0, 0);
  }


  return {
    init: init
  }
})();
