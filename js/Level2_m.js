/* Segundo nivel del juego (laser) */

// marca los pulsos del juego
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function Level2() {

    //Comprobar si es firefox o movil
    var  FIREFOX = /Firefox/i.test(navigator.userAgent);
    // si es smartphone
    SMARTPHONE = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (SMARTPHONE.Android() || SMARTPHONE.BlackBerry() || SMARTPHONE.iOS() || SMARTPHONE.Opera() || SMARTPHONE.Windows());
        }
    };

   
    //VARIABLES
    //Canvas y contexto
    var canvas;
    var ctx;
    //Buffer y su contexto
    var buffer;
    var bufferctx;

    //Jugadores y enemigo
    var player_1;
    var enemy_2;

    //Imagen del fondo
    var fondo_principal = new Image();
    fondo_principal.src = 'images/fondo_2.png';

    //Carriles   
    var carril_0 = 474;     // limite cercano a la pantalla
    var carril_1 = 473.63;  // limite entre carril 0 y carril 1
    var carril_2 = 473.2;   // limite entre carril 1 y carril 2
    var carril_3 = 472.98;

    // indice de enemigo
    var enemy_id = 0;
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
        p2_fire_2: 105  // 9
    };     

    //Obtener fecha actual para la puntuacion
    var fecha = new Date();
    var segundos_0 = fecha.getTime() / 1000;

    //Para movil
    document.addEventListener("touchstart", touchHandler);
    document.addEventListener("mouseup", touchHandler);
    var posicion = 2;
    var button_attack;
    var button_down;
    var button_left;
    var button_right;
    var button_up;

    Init();

    //Funcion de inicializacion de variables, personajes, interfaz, etc.
    function Init () {

        //Inicializar canvas
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        //Buffer
        buffer = document.createElement('canvas');
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        bufferctx = buffer.getContext('2d');

        //Botones movil
        button_left = new Image();
        button_left.src = "images/button_left.png";
        button_down = new Image();
        button_down.src = "images/button_down.png";
        button_right = new Image();
        button_right.src = "images/button_right.png";
        button_up = new Image();
        button_up.src = "images/button_up.png";
        button_attack = new Image();
        button_attack.src = "images/button_attack.png";
        
        // resize de la pantalla
        window.addEventListener('resize', ResizeCanvas, false);

        //Inicializar jugador 1
        player_1 = new Player(3, 'images/player_1.png', 'images/player_1_bullet.png', 'images/player_1_killed.png', 'images/player_1_1_lifes.png', canvas);
        //Inicializar enemigo
        enemy_2 = new Enemy(15, 'images/laser.png', 'images/laser_bullet.png', 'images/laser_damaged.png', 'images/laser_killed.png', 7);

        //Inicializar interfaz  
        ShowLife();
        ShowButtons();

        //Funcion para inicializar el gameloop
        function anim() {
            Loop();
            requestAnimFrame(anim);
        }
        anim();   
    }

    //Gameloop
    function Loop() {
        Update();
        ResizeCanvas();
    }

    //Funcion update, se llama en cada frame
    function Update() {            

        //Pintar fondo
        DrawBackground();        

        //Comprobar si hay game over 
        if (player_1.dead) {
            game_over = true;
            localStorage.setItem("win", 0);
            window.location.href = "game_over.html"; //carga pantalla game over
            return;
        } 
        //Si no, comprobar si se ha vencido al enemigo
        else if (enemy_2.dead) {
            the_end = true;
            SaveScore(); //calcular y guardar puntuaciones
            window.location.href = "level3_m.html"; //cargar siguiente nivel
            return;
        }

        //Antes de dibujar, calculamos el z-index (carril) de los jugadores
        player_1.zindex = player_carril_n(player_1);
        
        //Dibujar personajes, balas y ui
        DrawChars();
        DrawBullets();
        ShowLife();

        //Colisiones
        CheckCollisions(player_1, enemy_2); //colisiones del enemigo con las balas del jugador 1
        CheckCollisions(enemy_2, player_1); //colisiones del jugador 1 con las balas del enemigo
       
    }

    /*** FUNCIONES DE PINTADO ***/

    //Pinta las capas en el canvas final, en orden de atras (2) adelante (0)
    function Draw() {
        ctx.drawImage(buffer, 0, 0, window.innerWidth, window.innerHeight);        
        ShowButtons();
    }

    //Fondo
    function DrawBackground() {
        var background;
        background = fondo_principal;
        bufferctx.drawImage(background, 0, 0);
    }

    //Personajes
    function DrawChars() {
        //Jugador1
        bufferctx.drawImage(player_1.sprite, player_1.posX, player_1.posY, player_1.carril.x, player_1.carril.y);
        //Enemigo
        if (!enemy_2.dead) {
            bufferctx.drawImage(enemy_2.sprite, enemy_2.posX, enemy_2.posY, enemy_2.carril.x, enemy_2.carril.y);
        }       
    }

    //Recorre el array de balas de cada pje y llama a la funcion de pintado de balas individual
    function DrawBullets () {
        for (var j = 0; j < player_1.bullets.length; j++) {
            var disparoBueno = player_1.bullets[j];
            Update_Player_Bullet(disparoBueno, j, player_1);
        }        

        if (enemy_2.life > 0) {
            for (var i = 0; i < enemy_2.bullets.length; i++) {
                var disparoMalo = enemy_2.bullets[i];
                Update_Enemy_Bullet(disparoMalo, i);
            }
        }
    }
        
    //Mover y pintar bala jugador
    function Update_Player_Bullet (bullet, id, player) {
        if (bullet) {
            bullet.identifier = id;
            if (bullet.posX < 1200) {
                bullet.posX += 5;                
                bufferctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
             } else {
                player.DeleteShot(parseInt(bullet.identifier));
            }
        }
    }

    //Mover y pintar balas enemigos
    function Update_Enemy_Bullet(bullet, id) {
        if (bullet) {
            bullet.identifier = id;            
            if (bullet.posX >= 0) {
                bullet.posX -= bullet.speed;
                bufferctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
            } else {
                enemy_2.DeleteShot(parseInt(bullet.identifier));
            }            
        }
    }

    //Vidas jugador(es)
    function ShowLife() {
        switch (player_1.life) {
            case 3:
                bufferctx.drawImage(player_1.life_sprite, 0, 10, 35, 35);
                bufferctx.drawImage(player_1.life_sprite, 40, 10, 35, 35);
                bufferctx.drawImage(player_1.life_sprite, 80, 10, 35, 35);
                break;
            case 2:
                bufferctx.drawImage(player_1.life_sprite, 0, 10, 35, 35);
                bufferctx.drawImage(player_1.life_sprite, 40, 10, 35, 35);
                break;
            case 1:
                bufferctx.drawImage(player_1.life_sprite, 0, 10, 35, 35);
                break;
            case 0:
                break;
        }        
    }

    //Botones del movil
    function ShowButtons() {
        ctx.drawImage(button_left, 50, 50, 75, 75);
        ctx.drawImage(button_right, 170, 50, 75, 75);
        ctx.drawImage(button_up, 110, 20, 75, 75);
        ctx.drawImage(button_down, 110, 80, 75, 75);
        ctx.drawImage(button_attack, 460, 50, 75, 75);
    }

    /*** COLISIONES ***/
    
    function CheckCollisions(shooter, target) {
        //Recorrer array de balas del shooter, comprobando si la posicion del alguna coincide con la del target
        for (var i = 0; i < shooter.bullets.length; i++) {
            var b = shooter.bullets[i];
            //Primero comprobamos si tienen el mismo zindex (estan en el mismo carril)
            if (b.zindex == target.zindex) {
                //Despues comparamos sus posiciones en x (dentro de un rango)
                if ((b.posX >= target.posX - 3) && (b.posX <= target.posX + 2)) {
                    target.Hit(); //reducir vida y cambiar sprite
                    //Eliminar la bala del array
                    shooter.DeleteShot(b.identifier);
                }
            }
        }
    }    

    /*** PUNTUACIONES ***/
    function SaveScore() {
        //Obtener en segundos el tiempo que ha pasado desde el inicio del juego
        fecha = new Date();
        var segundos_f = fecha.getTime() / 1000;
        var segundos = segundos_f - segundos_0;

        //Calcular puntos segun el tiempo y el numero de enemigos --> Segundo enemigo: /0.3
        var puntos = parseInt(segundos / 0.3);
        var pant = localStorage.getItem("puntos");
        if (pant != null && pant != 0) puntos += parseInt(pant);
        //Guardar en memoria
        localStorage.setItem("puntos", puntos);
        the_end = false;
        game_over = false;
    }

    /*------- AUXILIARES -------*/

    //Devuelve el carril del jugador (CHROME)
    function player_carril_n(objeto) {
        //console.log(objeto.posX + ", " + objeto.posY);
        if ((objeto.posY <= carril_0) && (objeto.posY > carril_1)) {
            return 0;
        }
        if ((objeto.posY <= carril_1) && (objeto.posY > carril_2)) {
            return 1;
        }
        if ((objeto.posY <= carril_2) && (objeto.posY > carril_3)) {
            return 2;
        }
    }  

    //Devuelve un numero aleatorio
    function GetRandomNumber (range_min, range_max) {
        return Math.floor(Math.random() * (range_max - range_min + 1)) + range_min;
    }

    //Elimina un elemento de un array
    function ArrayRemove (array, from) {
        var rest = array.slice((from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    };

    //Resize del canvas
    function ResizeCanvas() {       

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;        

        Draw();
    }


    /*** CONTROLES MOVIL ***/
    function touchHandler(e) {
        if (e.touches) {
            var touchX = e.changedTouches[0].pageX;
            var touchY = e.changedTouches[0].pageY;
            e.preventDefault();
        }
        
        //Acciones segun boton
        //Moverse hacia arriba
        if ((touchX <= 170) && (touchX >= 110) && (touchY <= 75) && (touchY >= 20)) {
            if (posicion > 0) {
                posicion -= 1;                
                for (var i = 0; i < 9; i++) {
                    player_1.Up_CH();
                }                
            }
        }
        //Moverse hacia abajo
        if ((touchX <= 175) && (touchX >= 114) && (touchY <= 140) && (touchY >= 85)) {
            if (posicion < 2) {
                posicion += 1;                
                for (var i = 0; i < 9; i++) {
                    player_1.Down_CH();
                }                
            }
        }
        //Moverse hacia la izquierda
        if ((touchX <= 109) && (touchX >= 55) && (touchY <= 107) && (touchY >= 54)) {
            player_1.Left_CH();
        }
        //Moverse hacia la derecha
        if ((touchX <= 230) && (touchX >= 175) && (touchY <= 107) && (touchY >= 54)) {
            player_1.Right_CH();
        }
        //Disparar
        if ((touchX <= 520) && (touchX >= 465) && (touchY <= 110) && (touchY >= 55)) {
            player_1.Shoot();
        }
    }
}



