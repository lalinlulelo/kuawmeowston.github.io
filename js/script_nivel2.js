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

// si es navegador FIREFOX
var FIREFOX = /Firefox/i.test(navigator.userAgent);
// si es smartphone
var SMARTPHONE = {
  Android: function() {
      return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
      return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
      return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
      return navigator.userAgent.match(/IEMobile/i);
  },
  any: function() {
      return (SMARTPHONE.Android() || SMARTPHONE.BlackBerry() || SMARTPHONE.iOS() || SMARTPHONE.Opera() || SMARTPHONE.Windows());
  }
};

// juego
var game = (function () {
  document.addEventListener("touchend", touchHandler);
  document.addEventListener("mouseup", touchHandler);

  function touchHandler(e) {
    if(e.touches) {
      var playerX = e.changedTouches[0].pageX;
      var playerY = e.changedTouches[0].pageY;
      console.log(playerX + " " + playerY);
      e.preventDefault();
    }
    if((playerX <= 220)&&(playerX >= 180)&&(playerY <= 195)&&(playerY >= 170)){
      console.log("arriba")
      if(player_1.posY > 199.1){
        player_1.posY -= 0.05;
        player_1.posX += 6;
        player_1_carril.x -= 10;
        player_1_carril.y -= 5;                  
      }
    }
    if((playerX <= 220)&&(playerX >= 180)&&(playerY <= 260)&&(playerY >= 230)){
      console.log("abajo")
      if(player_1.posY < 474){
        player_1.posY += 0.05;
        player_1.posX -= 6;
        player_1_carril.x += 10;
        player_1_carril.y += 5;
      }
    }
    if((playerX <= 375)&&(playerX >= 332)&&(playerY <= 235)&&(playerY >= 190)){
      player_1_bullet_x = player_1_carril.x - 10;
      player_1_bullet_y = player_1_carril.y - 10;
      shoot();
    }
  }


    // ------------------------------------------------------ Inicializacion de las variables ------------------------------------------------------
    // variables globales de la aplicacion
    var canvas;
    var ctx;
    var buffer;
    var bufferctx;
    var fondo_principal;
    if(FIREFOX){
      var carril_0 = 485.1;     // limite cercano a la pantalla
      var carril_1 = 484.7;  // limite entre carril 0 y carril 1
      var carril_2 = 484.4;   // limite entre carril 1 y carril 2
      var carril_3 = 484;  // limite cercano al fondo
    }else{
      var carril_0 = 474;     // limite cercano a la pantalla
      var carril_1 = 473.63;  // limite entre carril 0 y carril 1
      var carril_2 = 473.2;   // limite entre carril 1 y carril 2
      var carril_3 = 472.98;  // limite cercano al fondo
    }
    // variables del jugador 1
    var player_1;
    var player_1_life_sprite;
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
    // variables del jugador 2
    var player_2;  
    var player_2_life = 3;
    var player_2_life_sprite;
    var player_2_bullet;
    var player_2_bullets = [];
    var player_2_killed;
    var player_2_speed = 12;
    var player_2_shoot;
    var player_2_next_shoot;
    var player_2_now = 0;
    var player_2_shoot_delay = 250;
    var player_2_carril = {
      x: 1200,
      y: 600
    }

    // variables del enemigo 2
    var enemy_2_created = false;
    var enemy_2;
    var enemy_2_life = 15;
    var enemy_2_shoot;
    var enemy_2_bullet;
    var enemy_2_bullets = [];
    var enemy_2_sprite = {
        damaged: new Image(),
        killed: new Image()
    }
    var enemy_2_carril = {
        x: 1200,
        y: 600
    }
   

    // indice de enemigo
    var enemy_id = 1;
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
      // borrar una vez hecho el apaño
      p1_dead_1: 88,
      p1_dead_2: 67,
      p1_dead_3: 86,
      //-------------------------------
      // jugador 2
      p2_up: 104,     // 8
      p2_down: 101,   // 5
      p2_left: 100,   // 4
      p2_right: 102,  // 6
      p2_fire_1: 103, // 7
      p2_fire_2: 105  // 9
    }
    // variable que determina el numero de jugadores a jugar
    var Jugadores = localStorage.getItem("jugadores");
    //console.log("Numero de jugadores " + Jugadores);
    var button_attack;
    var button_down;
    var button_left;
    var button_right;
    var button_up;

    var fecha = new Date();
    var segundos_0 = fecha.getTime()/1000;
 
    // gameloop
    function loop () {
      update ();
      //console.log(player_1.posX);
      // resize de la pantalla
      resizeCanvas();
    }

    // funcion que carga las imagenes
    function preloadImages (){

      // sprites del segundo enemigo
      enemy_2_bullet = new Image();
      enemy_2_bullet.src = "images/laser_bullet.png";
      enemy_2_sprite.damaged.src = "images/laser_damaged.png";
      enemy_2_sprite.killed.src = "images/laser_killed.png";
      enemy_2_bullet.zindex = 0; //profundidad de cada bala  

      // sprites del jugador 1
      player_1_bullet = new Image ();
      player_1_bullet.src = 'images/player_1_bullet.png';
      player_1_life_sprite = new Image ();
      player_1_life_sprite.src = 'images/player_1_1_lifes.png';
      player_1_killed = new Image ();
      player_1_killed.src = 'images/player_1_killed.png';
        
      // sprites del jugador 2
      player_2_bullet = new Image ();
      player_2_bullet.src = 'images/player_2_bullet.png';
      player_2_life_sprite = new Image ();
      player_2_life_sprite.src = 'images/player_2_1_lifes.png';
      player_2_killed = new Image ();
      player_2_killed.src = 'images/player_2_killed.png';

      button_left = new Image ();
      button_left.src = "images/button_left.png";
      button_down = new Image ();
      button_down.src = "images/button_down.png";
      button_right = new Image ();
      button_right.src = "images/button_right.png";
      button_up = new Image ();
      button_up.src = "images/button_up.png";
      button_attack = new Image ();
      button_attack.src = "images/button_attack.png";	

      // sprites del escenario
      fondo_principal = new Image();
      fondo_principal.src = 'images/fondo_2.png';
      //console.log("con exito");
    }

    // funcion de inicializacion
    function init (){
    
      // se cargan los sprites
      //console.log("cargando imagenes ... :");
      preloadImages ();
      //console.log("creando pantalla ... :");
      // se inicializa el canvas
      canvas = document.getElementById('canvas');
      var full_screen = localStorage.getItem("full_screen");
      //console.log("pantalla completa: " + full_screen);
    
      // resize de la pantalla
      window.addEventListener('resize', resizeCanvas, false);
   
      ctx = canvas.getContext('2d');
      //Capa 0, mas cercana a la pantalla
      capa0 = document.createElement('canvas');
      capa0.width = canvas.width;
      capa0.height = canvas.height;
      capa0ctx = capa0.getContext('2d');
      //Capa 1
      capa1 = document.createElement('canvas');
      capa1.width = canvas.width;
      capa1.height = canvas.height;
      capa1ctx = capa1.getContext('2d');
      //Capa 2
      capa2 = document.createElement('canvas');
      capa2.width = canvas.width;
      capa2.height = canvas.height;
      capa2ctx = capa2.getContext('2d');
      //console.log("con exito");


      // se inicializan los jugadores
      //console.log("creando al jugador 1 ... :");
      player_1 = new Player_1 (player_1_life, 0);
      //console.log("con exito");
      if(Jugadores == 2){
        //console.log("creando al jugador 1 ... :");
        player_2 = new Player_2 (player_2_life, 0);
        enemy_2_life = enemy_2_life*2;
        //console.log("con exito");
      }

      enemy_2 = new Enemy_2();

      // se inicializa la interfaz
      //console.log("cargando interfaz gráfica ... :");
      showLifeAndScore ();
      // se inicializa el teclado
      //console.log("cargando inputs del teclado ... :")
      addListener(document, 'keydown', keyDown);
      addListener(document, 'keyup', keyUp);
        
      //Antes de iniciar el gameloop se recarga la página si es firefox
      setTimeout(function () {
          if (FIREFOX && !window.location.hash) {
              window.location = window.location + '#loaded';
              window.location.reload();
          } else if (!window.location.hash) {
              console.log("ajax);
               $.ajax({
                  url: "",
                  context: document.body,
                  success: function(s,x){

                      $('html[manifest=saveappoffline.appcache]').attr('content', '');
                          $(this).html(s);
                  }
              });
              window.location = window.location + '#loaded';
              console.lag("despues de ajax");
              window.location.reload();
          }
      }, 500);

      // se inicializa el bucle
      function anim (){
        loop ();
        requestAnimFrame(anim);
      }

      console.log("antes de anim");

      anim ();
    }  
    // ---------------------------------------------------- Fin inicializacion de las variables ----------------------------------------------------

    // ------------------------------------------------------------ Funciones auxiliares -----------------------------------------------------------
    // cita en que carril se encuentra el objeto
    function player_carril_n (objeto) {
      if((objeto.posY <= carril_0) && (objeto.posY > carril_1)){ 
        return 0;   
      }
      if((objeto.posY <= carril_1) && (objeto.posY > carril_2)){
        return 1;
      }
      if((objeto.posY <= carril_2) && (objeto.posY > carril_3)){
        return 2;
      }
    }

    if(FIREFOX){
      function player_carril_n_2 (objeto) {   
        if((objeto.posY <= carril_0-285) && (objeto.posY  > carril_1-285)){ 
          return 0;   
        }
        if((objeto.posY  <= carril_1-285) && (objeto.posY  > carril_2-285)){
          return 1;
        }
        if((objeto.posY  <= carril_2-285) && (objeto.posY  > carril_3-285)){
          return 2;
        }
      }
    }    

    function enemy_2_carril_n (objeto){    
      if((objeto.x == 171.43) && (objeto.y == 120)){
        return 0;
      }
      if((objeto.x == 171.43*0.8) && (objeto.y == 120*0.8)){
        return 0;
      }
      if((objeto.x == 133.3) && (objeto.y == 85.71)){
        //console.log("enemigo en carril 1")
        return 1;
      }
      if((objeto.x == 133.3*0.8) && (objeto.y == 85.71*0.8)){
        //console.log("enemigo en carril 1")
        return 1;
      }
      if((objeto.x == 92.3) && (objeto.y == 54.54)){
        //console.log("enemigo en carril 2")
        return 2;
      }
      if((objeto.x == 92.3*0.8) && (objeto.y == 54.54*0.8)){
        //console.log("enemigo en carril 2")
        return 2;
      }
    }

    // resize de la pantalla
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      draw();
    }

    // devuelve un numero aleatorio
    function getRandomNumber(range_min, range_max) {
      return Math.floor(Math.random() * (range_max - range_min + 1)) + range_min;
    }

    // elimina un elemento de un array
    arrayRemove = function (array, from) {
      var rest = array.slice((from) + 1 || array.length);
      array.length = from < 0 ? array.length + from : from;
      return array.push.apply(array, rest);
    };
    // ---------------------------------------------------------- Fin funciones auxiliares ---------------------------------------------------------

    // ----------------------------------------------------------------- Jugadores -----------------------------------------------------------------
    // jugador 1
    function Player_1(life, score) {
        console.log("Creando jugador 1");
      // ubicacion del jugador 1
      var settings = {
          marginBottom : 60,
          defaultHeight : 66
      };
      // carga sprite y sus atributos
      player_1 = new Image();
      player_1.src = 'images/player_1.png';
      player_1.posX = -40;
      player_1.posY = canvas.height - (player_1.height == 0 ? settings.defaultHeight : player_1.height) - settings.marginBottom;
      player_1.life = player_1_life;
      player_1.score = score;
      player_1.dead = false;
      player_1.speed = player_1_speed;
      player_1_carril.x = player_1_carril.x/4;
      player_1_carril.y = player_1_carril.y / 4;
      player_1.zindex = 0; //profundidad

      // disparo
      var shoot = function () {
        if (FIREFOX) {
          if (player_1_next_shoot < player_1_now || player_1_now == 0) {
            player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY + 285);
            player_1_shoot.x = player_1_carril.x;
            player_1_shoot.y = player_1_carril.y;
            player_1_shoot.add();
            player_1_now += player_1_shoot_delay;
            player_1_next_shoot = player_1_now + player_1_shoot_delay;
          } else {
            player_1_now = new Date().getTime();
          }
        } else {
          if (player_1_next_shoot < player_1_now || player_1_now == 0) {
            player_1_shoot = new Player_1_Shoot(player_1.posX + 30, player_1.posY);
            player_1_shoot.x = player_1_carril.x;
            player_1_shoot.y = player_1_carril.y;
            player_1_shoot.add();
            player_1_now += player_1_shoot_delay;
            player_1_next_shoot = player_1_now + player_1_shoot_delay;
          } else {
            player_1_now = new Date().getTime();
          }
        }        
      };

      // acciones del jugador
      player_1.doAnything = function() {
        if(FIREFOX) {
          if (player_1.dead)
            return;
          if (keyPressed.p1_left && (player_1.posX > ((player_1.posY - 199.67)/(-0.008333))))
            player_1.posX -= player_1.speed;
          if (keyPressed.p1_right && (player_1.posX < ((player_1.posY - 202.867)/(-0.008333))))
            player_1.posX += player_1.speed;
          if(keyPressed.p1_up && (player_1.posY > 199.1)){
            player_1.posY -= 0.05;
            player_1.posX += 6;
            player_1_carril.x -= 10;
            player_1_carril.y -= 5;                  
          }
          if(keyPressed.p1_down  && (player_1.posY < 200)){
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
          if(keyPressed.p1_dead_1){
            player_1.hit(2);
          }
          if(keyPressed.p1_dead_2){
            player_1.hit(1);
          }
          if(keyPressed.p1_dead_3){
            player_1.hit(0);
          }
        } else {
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
            //console.log("w pulsada");
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
            //console.log("disparar");
            shoot();
          }
          if(keyPressed.p1_dead_1){
            player_1.hit(2);
          }
          if(keyPressed.p1_dead_2){
            player_1.hit(1);
          }
          if(keyPressed.p1_dead_3){
            player_1.hit(0);
          }
        }
      };

      player_1.hit = function (){
        player_1.life -= 1;
        GatoDañado();
        if(player_1.life == 0){
          player_1_life_sprite.src = '';
          player_1.src = player_1_killed.src;
          setTimeout(function (){
            game_over = true;
          }, 1000);            
        }
      }
      return player_1;
    }

    // jugador 2
    function Player_2 (life, score) {
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
      player_2_carril.y = player_2_carril.y / 4;
      player_2.zindex = 0; //profundidad

      // disparo
      var shoot = function () {
        if (FIREFOX) {
          if (player_2_next_shoot < player_2_now || player_2_now == 0) {
            player_2_shoot = new Player_2_Shoot(player_2.posX + 30, player_2.posY + 285);
            player_2_shoot.x = player_2_carril.x;
            player_2_shoot.y = player_2_carril.y;
            player_2_shoot.add();
            player_2_now += player_2_shoot_delay;
            player_2_next_shoot = player_2_now + player_2_shoot_delay;
          } else {
            player_2_now = new Date().getTime();
          }
        } else {
          if (player_2_next_shoot < player_2_now || player_2_now == 0) {
            player_2_shoot = new Player_2_Shoot(player_2.posX + 30, player_2.posY);
            player_2_shoot.x = player_2_carril.x;
            player_2_shoot.y = player_2_carril.y;
            player_2_shoot.add();
            player_2_now += player_2_shoot_delay;
            player_2_next_shoot = player_2_now + player_2_shoot_delay;
          } else {
            player_2_now = new Date().getTime();
          }
        }
      };
      // acciones del jugador
      player_2.doAnything = function() {
        if(FIREFOX) {
          if (player_2.dead)
            return;
          if (keyPressed.p2_left && (player_2.posX > ((player_2.posY - 199.67)/(-0.008333))))
            player_2.posX -= player_2.speed;
          if (keyPressed.p2_right && (player_2.posX < ((player_2.posY - 202.867)/(-0.008333))))
            player_2.posX += player_2.speed;
          if(keyPressed.p2_up && (player_2.posY > 199.1)){
            player_2.posY -= 0.05;
            player_2.posX += 6;
            player_2_carril.x -= 10;
            player_2_carril.y -= 5;
          }
          if(keyPressed.p2_down  && (player_2.posY < 200)){
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
        } else {
          //console.log("teclado2");
          if (player_2.dead)
            return;
          if (keyPressed.p2_left && (player_2.posX > (-120 * player_2.posY + 56850)))
            player_2.posX -= player_2.speed;
          if (keyPressed.p2_right && (player_2.posX < (-120 * player_2.posY + 57215)))
            player_2.posX += player_2.speed;
          if (keyPressed.p2_up && (player_2.posY > 473)) {
            player_2.posY -= 0.05;
            player_2.posX += 6;
            player_2_carril.x -= 10;
            player_2_carril.y -= 5;
          }
          if (keyPressed.p2_down && (player_2.posY < 474)) {
            player_2.posY += 0.05;
            player_2.posX -= 6;
            player_2_carril.x += 10;
            player_2_carril.y += 5;
          }
          if (keyPressed.p2_fire_1) {
            player_2_bullet_x = player_2_carril.x - 10;
            player_2_bullet_y = player_2_carril.y - 10;
            shoot();
          }
        }
      };

      player_2.hit = function (){
        player_2.life -= 1;
        GatoDañado();
        if(player_2.life == 0){
            player_2_life_sprite.src = '';
            player_2.src = player_2_killed.src;
            setTimeout(function (){
              game_over = true;
            }, 1000);
            
        }
      }

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
      if(Jugadores == 2){
        player_2.doAnything();
      }
    }
    // --------------------------------------------------------------- Fin jugadores ---------------------------------------------------------------

    // ------------------------------------------------------------------ Enemigos -----------------------------------------------------------------
    function Enemy_2 () {
      var settings = {
        marginBottom : 60,
        defaultHeight : 66
      }
      enemy_2 = new Image ();
      enemy_2.src = "images/laser.png";
      enemy_2.posX = 860;
      enemy_2.posY = canvas.height - (enemy_2.height == 0 ? settings.defaultHeight : enemy_2.height) - settings.marginBottom;
      enemy_2_carril.x = 171.43;
      enemy_2_carril.y = 120;
      enemy_2.life = enemy_2_life;
      enemy_2.speed = 5;
      enemy_2.shots = 100;
      enemy_2.dead = false;
      enemy_2.bulletY = 524;
      enemy_2.zindex = 0;

      enemy_2.kill = function () {
        console.log("muere el enemigo 2");
        enemy_2.src = enemy_2_sprite.killed.src;
        enemy_2.dead = true;
        setTimeout(function () {
            the_end = true;
        }, 3000);        
      };

      enemy_2.hit = function () {
          console.log("HIT 1");
          enemy_2.src = enemy_2_sprite.damaged.src;
      }
      
      function cambio_carril_2 (carril){
        switch(carril){
          case 0:
            enemy_2.bulletY = 524;
            enemy_2_carril.x = 171.43;
            enemy_2_carril.y = 120;
            break;
          case 1:
            enemy_2.bulletY = 504;
            enemy_2_carril.x = 133.3;
            enemy_2_carril.y = 85.71;
            break;
          case 2: 
            enemy_2.bulletY = 494;
            enemy_2_carril.x = 92.3;
            enemy_2_carril.y = 54.54;
            break;
        }
      }

      function shoot() {
        if(enemy_2_life > 0){
          setTimeout(function (){
            enemy_2_shoot = new Enemy_2_Shoot(enemy_2.posX , enemy_2.bulletY);
            enemy_2_shoot.x = enemy_2_carril.x*0.8;
            enemy_2_shoot.y = enemy_2_carril.y*0.8;
            enemy_2_shoot.add();
            shoot();
            var random_carril = getRandomNumber(0, 2);
            cambio_carril_2(random_carril);
          }, getRandomNumber(500, 1500));
        }
      }
      setTimeout(function() {
        shoot();
      }, 1000 + getRandomNumber(2500));

      return enemy_2; 
    }    

    function Enemigo_2 () {
        Object.getPrototypeOf(Enemigo_2.prototype).constructor.call(this, enemy_2_life, enemy_2_bullet, "images/laser.png");
    }
    Enemigo_2.prototype = Object.create(Enemy_2.prototype);
    Enemigo_2.prototype.constructor = Enemigo_2;
    
    // ---------------------------------------------------------------- Fin enemigos ---------------------------------------------------------------


    // ------------------------------------------------------------------ Disparos -----------------------------------------------------------------
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

    // actualizacion del disparo del jugador 1
    function Player_1_Shoot (x, y, bullet_x, bullet_y) {
      Object.getPrototypeOf(Player_1_Shoot.prototype).constructor.call(this, x, y, player_1_bullets, player_1_bullet);
    }
    Player_1_Shoot.prototype = Object.create(Shoot.prototype);
    Player_1_Shoot.prototype.constructor = Player_1_Shoot;
  
    // actualizacion del disparo del jugador 2
    function Player_2_Shoot (x, y, bullet_x, bullet_y) {
      Object.getPrototypeOf(Player_2_Shoot.prototype).constructor.call(this, x, y, player_2_bullets, player_2_bullet);
    }
    Player_2_Shoot.prototype = Object.create(Shoot.prototype);
    Player_2_Shoot.prototype.constructor = Player_2_Shoot;


    function Enemy_2_Shoot(x, y) {
        Object.getPrototypeOf(Enemy_2_Shoot.prototype).constructor.call(this, x, y, enemy_2_bullets, enemy_2_bullet);
        //console.log("creada la bala");
    }
    Enemy_2_Shoot.prototype = Object.create(Shoot.prototype);
    Enemy_2_Shoot.prototype.constructor = Enemy_2_Shoot;

    // ------------------------- colisiones con el enemigo 2
    function checkCollisions(shot) {                
        if(player_carril_n(shot) == enemy_2_carril_n(enemy_2_carril)){
            if((shot.posX >= enemy_2.posX-3) &&(shot.posX <= enemy_2.posX + 3)){
              enemy_2_life -= 1;
              enemy_2.src = enemy_2_sprite.damaged.src;
              setTimeout(function (){
                enemy_2.src = "images/laser.png";
              },100)
              //console.log(enemy_2_life);
              if(enemy_2_life == 0){
                enemy_2.kill();
              }          
              shot.deleteShot(parseInt(shot.identifier));
              return true;
            } 
          }       
      return true;   
    }

    function checkCollisions_Enemy_2 (shoot){
      if(FIREFOX){
        if(enemy_2_carril_n(shoot) == player_carril_n_2(player_1)){
          if(player_carril_n_2(player_1) == 0){
            if((shoot.posX >= (player_1.posX + 192)) && (shoot.posX <= (player_1.posX + 198))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n_2(player_1) == 1){
            if((shoot.posX >= (player_1.posX + 132)) && (shoot.posX <= (player_1.posX + 138))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n_2(player_1) == 2){
            if((shoot.posX >= (player_1.posX + 52)) && (shoot.posX <= (player_1.posX + 58))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
        }
        if(Jugadores == '2'){
          if(enemy_2_carril_n(shoot) == player_carril_n_2(player_2)){
            if(player_carril_n_2(player_2) == 0){
              if((shoot.posX >= (player_2.posX + 192)) && (shoot.posX <= (player_2.posX + 198))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n_2(player_2) == 1){
              if((shoot.posX >= (player_2.posX + 132)) && (shoot.posX <= (player_2.posX + 138))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n_2(player_2) == 2){
              if((shoot.posX >= (player_2.posX + 52)) && (shoot.posX <= (player_2.posX + 58))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
          }
        }
      }else{
        if(enemy_2_carril_n(shoot) == player_carril_n(player_1)){
          if(player_carril_n(player_1) == 0){
            if((shoot.posX >= (player_1.posX + 192)) && (shoot.posX <= (player_1.posX + 198))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n(player_1) == 1){
            if((shoot.posX >= (player_1.posX + 132)) && (shoot.posX <= (player_1.posX + 138))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
          if(player_carril_n(player_1) == 2){
            if((shoot.posX >= (player_1.posX + 52)) && (shoot.posX <= (player_1.posX + 58))){
              player_1.hit();
              shoot.deleteShot(parseInt(shoot.identifier));
            }
          }
        }
        if(Jugadores == '2'){
          if(enemy_2_carril_n(shoot) == player_carril_n(player_2)){
            if(player_carril_n(player_2) == 0){
              if((shoot.posX >= (player_2.posX + 192)) && (shoot.posX <= (player_2.posX + 198))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n(player_2) == 1){
              if((shoot.posX >= (player_2.posX + 132)) && (shoot.posX <= (player_2.posX + 138))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
            if(player_carril_n(player_2) == 2){
              if((shoot.posX >= (player_2.posX + 52)) && (shoot.posX <= (player_2.posX + 58))){
                player_2.hit();
                shoot.deleteShot(parseInt(shoot.identifier));
              }
            }
          }
        }
      }
      return true;
    }


    function updatePlayer_1_Shoot(player_1_shoot, id) {
      if (player_1_shoot) {
        player_1_shoot.identifier = id;
        if (checkCollisions(player_1_shoot)) {
          if (player_1_shoot.posX < 1200) {
              player_1_shoot.posX += 5;
              //bufferctx.drawImage(player_1_shoot.image, player_1_shoot.posX, player_1_shoot.posY, player_1_shoot.x, player_1_shoot.y); 
              //Obtener carril de la bala
              player_1_shoot.zindex = player_carril_n(player_1_shoot);
              var carril = player_1_shoot.zindex;
              //Segun el carril, pintarlo en una capa u otra
              switch (carril) {
                  case 0: capa0ctx.drawImage(player_1_shoot.image, player_1_shoot.posX, player_1_shoot.posY, player_1_shoot.x, player_1_shoot.y);
                      break;
                  case 1: capa1ctx.drawImage(player_1_shoot.image, player_1_shoot.posX, player_1_shoot.posY, player_1_shoot.x, player_1_shoot.y);
                      break;
                  case 2: capa2ctx.drawImage(player_1_shoot.image, player_1_shoot.posX, player_1_shoot.posY, player_1_shoot.x, player_1_shoot.y);
                      break;
              }
            } else {
            player_1_shoot.deleteShot(parseInt(player_1_shoot.identifier));
          }
        }
      }
    }

    function updatePlayer_2_Shoot(player_2_shoot, id) {
      if (player_2_shoot) {
        player_2_shoot.identifier = id;
        if (checkCollisions(player_2_shoot)) {
          if (player_2_shoot.posX < 1200) {
              player_2_shoot.posX += 5;
              //bufferctx.drawImage(player_2_shoot.image, player_2_shoot.posX, player_2_shoot.posY, player_2_shoot.x, player_2_shoot.y);   
              //Obtener carril de la bala
              player_2_shoot.zindex = player_carril_n(player_2_shoot);
              var carril = player_2_shoot.zindex;
              //Segun el carril, pintarlo en una capa u otra
              switch (carril) {
                  case 0: capa0ctx.drawImage(player_2_shoot.image, player_2_shoot.posX, player_2_shoot.posY, player_2_shoot.x, player_2_shoot.y);
                      console.log("pintar c0");
                      break;
                  case 1: capa1ctx.drawImage(player_2_shoot.image, player_2_shoot.posX, player_2_shoot.posY, player_2_shoot.x, player_2_shoot.y);
                      break;
                  case 2: capa2ctx.drawImage(player_2_shoot.image, player_2_shoot.posX, player_2_shoot.posY, player_2_shoot.x, player_2_shoot.y);
                      break;
              }
           } else {
            player_2_shoot.deleteShot(parseInt(player_2_shoot.identifier));
          }
        }   
      }
    }

    function updateEnemy_2_Shoot(enemy_2_shoot, id) {
      if (enemy_2_shoot) {
        enemy_2_shoot.identifier = id;
        if (checkCollisions_Enemy_2(enemy_2_shoot)) {
          if (enemy_2_shoot.posX >= 0) {
              enemy_2_shoot.posX -= 5;
              //bufferctx.drawImage(enemy_1_shoot.image, enemy_1_shoot.posX, enemy_1_shoot.posY, enemy_1_shoot.x, enemy_1_shoot.y);
              //Obtener carril de la bala
              enemy_2_shoot.zindex = enemy_2_carril_n(enemy_2_shoot);
              var carril = enemy_2_shoot.zindex;
              //Segun el carril, pintarlo en una capa u otra
              switch (carril) {
                  case 0: capa0ctx.drawImage(enemy_2_shoot.image, enemy_2_shoot.posX, enemy_2_shoot.posY, enemy_2_shoot.x, enemy_2_shoot.y);
                      break;
                  case 1: capa1ctx.drawImage(enemy_2_shoot.image, enemy_2_shoot.posX, enemy_2_shoot.posY, enemy_2_shoot.x, enemy_2_shoot.y);
                      break;
                  case 2: capa2ctx.drawImage(enemy_2_shoot.image, enemy_2_shoot.posX, enemy_2_shoot.posY, enemy_2_shoot.x, enemy_2_shoot.y);
                      break;
              }
            } else {
                enemy_2_shoot.deleteShot(parseInt(enemy_2_shoot.identifier));
          }
        }
      }
    }   
    

    // ---------------------------------------------------------------- Fin disparos ---------------------------------------------------------------

    // ------------------------------------------------------------------ Teclado ------------------------------------------------------------------
    // funcion del input
    function addListener(element, type, expression, bubbling) {
      bubbling = bubbling || false;
      if (window.addEventListener) { // Standard
          element.addEventListener(type, expression, bubbling);
      } else if (window.attachEvent) { // IE
          element.attachEvent('on' + type, expression);
      }
      //console.log("input con exito");
    }
    // tecla pulsada
    function keyDown(e) {
      var key = (window.event ? e.keyCode : e.which);
      for (var inkey in keyMap) {
        if (key === keyMap[inkey]) {
          e.preventDefault();
          keyPressed[inkey] = true;
        }
      }
    }
    // tecla soltada
    function keyUp(e) {
      var key = (window.event ? e.keyCode : e.which);
      for (var inkey in keyMap) {
        if (key === keyMap[inkey]) {
            e.preventDefault();
            keyPressed[inkey] = false;
        }
      }
    }
  
    // ---------------------------------------------------------------- Fin teclado ----------------------------------------------------------------
  
    // ------------------------------------------------------------------ Gameloop -----------------------------------------------------------------
    // funcion update
    function update() {
        console.log(player_1.posX + ", " + player_1.posY);
        //Limpiar las capas
        capa0ctx.clearRect(0, 0, canvas.width, canvas.height);
        capa1ctx.clearRect(0, 0, canvas.width, canvas.height);
        capa2ctx.clearRect(0, 0, canvas.width, canvas.height);

       drawBackground();
      

      if (the_end) {            
          saveScore();
          window.location.href = "nivel3.html";
          return;
      }

      if (game_over) {
          localStorage.setItem("win", 0);
          //saveScore(); //si pierde no suma la puntuacion de este enemigo
          window.location.href = "game_over.html";
          return;
      }

      //Antes de dibujar, calculamos el z-index (carril) de los jugadores y del enemigo
      if (FIREFOX) {
          player_1.zindex = player_carril_n_2(player_1);
          if (Jugadores == 2) {
              player_2.zindex = player_carril_n_2(player_2);
          }
          if (enemy_2_life > 0) {
              enemy_2.zindex = enemy_2_carril_n(enemy_2_carril);
          }          
      } else {
          player_1.zindex = player_carril_n(player_1);
          if (Jugadores == 2) {
              player_2.zindex = player_carril_n(player_2);
          }
          if (enemy_2_life > 0) {
              enemy_2.zindex = enemy_2_carril_n(enemy_2_carril);
          }
      }
    
      drawPlayers ();
      drawShoots ();

      showLifeAndScore();

      playerAction();
    }

  
    // ---------------------------------------------------------------- Fin gameloop ---------------------------------------------------------------

    // ------------------------------------------------------------ Funciones de pintado -----------------------------------------------------------
    // pintado del fondo de pantalla
    function drawBackground() {
      var background;
      background = fondo_principal;
      capa2ctx.drawImage(background, 0, 0);
    }

    // pintado de todo aquello presente en la pantalla
    function draw() {
      // coge tambien el tamaño de la ventana del navegador
      //Pintar capas en orden de atras (2) adelante (0) 
      //if(SMARTPHONE.any()){
        ctx.clearRect(0, 0, canvas.width, canvas.height);

      //}
      ctx.drawImage(capa2, 0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(capa1, 0, 0, window.innerWidth, window.innerHeight);
      ctx.drawImage(capa0, 0, 0, window.innerWidth, window.innerHeight);
      if(SMARTPHONE.any()){
        ctx.drawImage(button_left, 200, 400, 150, 150);
        ctx.drawImage(button_right, 440, 400, 150, 150);
        ctx.drawImage(button_up, 320, 340, 150, 150);
        ctx.drawImage(button_down, 320, 460, 150, 150);
        ctx.drawImage(button_attack, 650, 400, 150, 150);
      }
    }

    // pinta los jugadores
    function drawPlayers() {
      if (FIREFOX) {
        //obtener el carril en el que esta
        var carril = player_1.zindex;
        //Segun el carril, pintarlo en una capa u otra
        switch (carril) {
            case 0: capa0ctx.drawImage(player_1, player_1.posX, player_1.posY + 270, player_1_carril.x, player_1_carril.y);
                break;
            case 1: capa1ctx.drawImage(player_1, player_1.posX, player_1.posY + 270, player_1_carril.x, player_1_carril.y);
                break;
            case 2: capa2ctx.drawImage(player_1, player_1.posX, player_1.posY + 270, player_1_carril.x, player_1_carril.y);
                break;
        }
        if (Jugadores == 2) {
            //obtener el carril en el que esta
            var carril = player_2.zindex;
            //Segun el carril, pintarlo en una capa u otra
            switch (carril) {
                case 0: capa0ctx.drawImage(player_2, player_2.posX, player_2.posY + 270, player_2_carril.x, player_2_carril.y);
                    break;
                case 1: capa1ctx.drawImage(player_2, player_2.posX, player_2.posY + 270, player_2_carril.x, player_2_carril.y);
                    break;
                case 2: capa2ctx.drawImage(player_2, player_2.posX, player_2.posY + 270, player_2_carril.x, player_2_carril.y);
                    break;
            }
        }

        if (enemy_2_life > 0) {
            //obtener el carril en el que esta
            var carril = enemy_2.zindex;
            //Segun el carril, pintarlo en una capa u otra
            switch (carril) {
                case 0: capa0ctx.drawImage(enemy_2, enemy_2.posX, enemy_2.posY + 250, enemy_2_carril.x, enemy_2_carril.y);
                    break;
                case 1: capa1ctx.drawImage(enemy_2, enemy_2.posX, enemy_2.posY + 250, enemy_2_carril.x, enemy_2_carril.y);
                    break;
                case 2: capa2ctx.drawImage(enemy_2, enemy_2.posX, enemy_2.posY + 250, enemy_2_carril.x, enemy_2_carril.y);
                    break;
            }
        }     
               
      } else {
        //obtener el carril en el que esta
          var carril = player_1.zindex;
          console.log("carril jugador "+carril);
        //Segun el carril, pintarlo en una capa u otra
        switch (carril) {
            case 0: capa0ctx.drawImage(player_1, player_1.posX, player_1.posY, player_1_carril.x, player_1_carril.y);
                break;
            case 1: capa1ctx.drawImage(player_1, player_1.posX, player_1.posY, player_1_carril.x, player_1_carril.y);
                break;
            case 2: capa2ctx.drawImage(player_1, player_1.posX, player_1.posY, player_1_carril.x, player_1_carril.y);
                break;
        }

        if (Jugadores == 2) {
            //obtener el carril en el que esta
            var carril = player_2.zindex;
            //Segun el carril, pintarlo en una capa u otra
            switch (carril) {
                case 0: capa0ctx.drawImage(player_2, player_2.posX, player_2.posY, player_2_carril.x, player_2_carril.y);
                    break;
                case 1: capa1ctx.drawImage(player_2, player_2.posX, player_2.posY, player_2_carril.x, player_2_carril.y);
                    break;
                case 2: capa2ctx.drawImage(player_2, player_2.posX, player_2.posY, player_2_carril.x, player_2_carril.y);
                    break;
            }
        }
        
        if(enemy_2_life > 0){
            //obtener el carril en el que esta
            var carril = enemy_2.zindex;
            //Segun el carril, pintarlo en una capa u otra
            switch (carril) {
                case 0: capa0ctx.drawImage(enemy_2, enemy_2.posX, enemy_2.posY, enemy_2_carril.x, enemy_2_carril.y);
                    break;
                case 1: capa1ctx.drawImage(enemy_2, enemy_2.posX, enemy_2.posY, enemy_2_carril.x, enemy_2_carril.y);
                    break;
                case 2: capa2ctx.drawImage(enemy_2, enemy_2.posX, enemy_2.posY, enemy_2_carril.x, enemy_2_carril.y);
                    break;
            }
        }              
      }     
    }

    // pinta las balas de los personajes
    function drawShoots (){
      for (var j = 0; j < player_1_bullets.length; j++) {
        var disparoBueno = player_1_bullets[j];
        updatePlayer_1_Shoot(disparoBueno, j);
      }
      for (var j = 0; j < player_2_bullets.length; j++) {
        var disparoBueno = player_2_bullets[j];
        updatePlayer_2_Shoot(disparoBueno, j);
      }
        
      if(enemy_2_life > 0){
        for (var i = 0; i < enemy_2_bullets.length; i++) {
            var disparoMalo = enemy_2_bullets[i];
            updateEnemy_2_Shoot(disparoMalo, i);
        }
      }
    }

    // interfaz del juego
    function showLifeAndScore () {
        capa0ctx.fillStyle = "rgb(256,256,256)";
        capa0ctx.font = "bold 16px Arial";
        if (Jugadores == 2) {
            switch (player_1.life) {
                case 3:
                    capa0ctx.drawImage(player_1_life_sprite, 0, 10, 35, 35);
                    capa0ctx.drawImage(player_1_life_sprite, 40, 10, 35, 35);
                    capa0ctx.drawImage(player_1_life_sprite, 80, 10, 35, 35);
                    break;
                case 2:
                    capa0ctx.drawImage(player_1_life_sprite, 0, 10, 35, 35);
                    capa0ctx.drawImage(player_1_life_sprite, 40, 10, 35, 35);
                    break;
                case 1:
                    capa0ctx.drawImage(player_1_life_sprite, 0, 10, 35, 35);
                    break;
                case 0:
                    break;
            }
            switch (player_2.life) {
                case 3:
                    capa0ctx.drawImage(player_2_life_sprite, 0, 50, 35, 35);
                    capa0ctx.drawImage(player_2_life_sprite, 40, 50, 35, 35);
                    capa0ctx.drawImage(player_2_life_sprite, 80, 50, 35, 35);
                    break;
                case 2:
                    capa0ctx.drawImage(player_2_life_sprite, 0, 50, 35, 35);
                    capa0ctx.drawImage(player_2_life_sprite, 40, 50, 35, 35);
                    break;
                case 1:
                    capa0ctx.drawImage(player_2_life_sprite, 0, 50, 35, 35);
                    break;
                case 0:
                    break;
            }
        } else {
            switch (player_1.life) {
                case 3:
                    capa0ctx.drawImage(player_1_life_sprite, 0, 10, 35, 35);
                    capa0ctx.drawImage(player_1_life_sprite, 40, 10, 35, 35);
                    capa0ctx.drawImage(player_1_life_sprite, 80, 10, 35, 35);
                    break;
                case 2:
                    capa0ctx.drawImage(player_1_life_sprite, 0, 10, 35, 35);
                    capa0ctx.drawImage(player_1_life_sprite, 40, 10, 35, 35);
                    break;
                case 1:
                    capa0ctx.drawImage(player_1_life_sprite, 0, 10, 35, 35);
                    break;
                case 0:
                    break;
            }
        }
    }
    function GatoDañado(){
      myMusic= new sound("sound/golpe_al_gatini_1.wav");
      myMusic.play();
    }
    function sound(src) {
      this.sound = document.createElement("audio");
      this.sound.src = src;
      this.sound.setAttribute("preload", "auto");
      this.sound.setAttribute("controls", "volume");
      this.sound.volume=0.1;
      this.sound.style.display = "none";
      document.body.appendChild(this.sound);
      this.play = function(){
        this.sound.play();
      }
      this.stop = function(){
        this.sound.pause();
      }  
      //Esta funcion cambia el volumen
      this.changeVolume= function(newVolume){
        this.sound.volume=newVolume;
      }  
    }

    // fin de partida: calcular puntuacion
    function saveScore() {
        //Obtener en segundos el tiempo que ha pasado desde el inicio del juego
        fecha = new Date();
        var segundos_f = fecha.getTime()/1000;
        //var minutos_f = fecha.getMinutes();
        //var minutos_m = minutos_f - minutos_0;
        var segundos = segundos_f - segundos_0;

        //Calcular puntos segun el tiempo y el numero de enemigos --> Segundo enemigo: /0.3
        var puntos = parseInt(segundos / 0.3);
        var pant = localStorage.getItem("puntos");
        if (pant != null && pant != 0) puntos += parseInt(pant);
        console.log("ptos: " + puntos);
        //Guardar en memoria
        localStorage.setItem("puntos", puntos);
        the_end = false;
        game_over = false;

        /*
        localStorage.setItem("minutos_0", minutos_0);
        localStorage.setItem("segundos_0", segundos_0);
        localStorage.setItem("segundos_f", segundos_f);
        localStorage.setItem("minutos_f", minutos_f);
        localStorage.setItem("enemigos", enemy_id);       */
    }
    // ------------------------------------------------------- FIn funciones de pintado -------------------------------------------------------
    
  return {
    init: init
  }
})();

