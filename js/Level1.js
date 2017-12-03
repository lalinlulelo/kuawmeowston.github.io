/* Primer nivel del juego (pepino) */

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

function Level1() {

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
    //Canvas y contexto por capas
    var capa0; //Mas cercana a la pantalla
    var capa0ctx
    var capa1; //Intermedia
    var capa1ctx;
    var capa2; //Mas lejana a la pantalla
    var capa2ctx;

    //Jugadores y enemigo
    var player_1;
    var player_2;
    var enemy_1;

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

    // variable que determina el numero de jugadores a jugar
    var Jugadores = localStorage.getItem("jugadores");
    //var Jugadores = 2;

    //Obtener fecha actual para la puntuacion
    var fecha = new Date();
    var segundos_0 = fecha.getTime() / 1000;

    Init();

    //Funcion de inicializacion de variables, personajes, interfaz, etc.
    function Init () {

        //Inicializar canvas
        canvas = document.getElementById('canvas');
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


        full_screen = localStorage.getItem("full_screen");

        // resize de la pantalla
        window.addEventListener('resize', ResizeCanvas, false);

        //Inicializar jugador 1
        player_1 = new Player(3, 'images/player_1.png', 'images/player_1_bullet.png', 'images/player_1_killed.png', 'images/player_1_1_lifes.png', canvas);
        //Inicializar jugador 2 si procede
        if (Jugadores == 2) {
            player_2 = new Player(3, 'images/player_2.png', 'images/player_2_bullet.png', 'images/player_2_killed.png', 'images/player_2_1_lifes.png', canvas);
        }
        //Inicializar enemigo
        enemy_1 = new Enemy(10, 'images/pepino.png', 'images/pepino_bullet.png', 'images/pepino_damaged.png', 'images/pepino_killed.png', 5);

        //Inicializar interfaz  
        ShowLife();

        //Inicializar teclado
        AddListener(document, 'keydown', KeyDown);
        AddListener(document, 'keyup', KeyUp)

        //Aqui iria lo de refrescar si se necesita

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

        //Limpiar las capas
        capa0ctx.clearRect(0, 0, canvas.width, canvas.height);
        capa1ctx.clearRect(0, 0, canvas.width, canvas.height);
        capa2ctx.clearRect(0, 0, canvas.width, canvas.height);       

        DrawBackground();        

        //Comprobar si hay game over 
        if (player_1.dead) {
            console.log("GAME OVER por player1");
            game_over = true;
            localStorage.setItem("win", 0);
            //Perder en el primer enemigo no puntua
            localStorage.setItem("puntos", 0);
            window.location.href = "game_over.html"; //carga pantalla game over
            return;
        } else if (player_2 != null && player_2.dead) {
            console.log("GAME OVER por player 2");
            game_over = true;
            localStorage.setItem("win", 0);
            //Perder en el primer enemigo no puntua
            localStorage.setItem("puntos", 0);
            window.location.href = "game_over.html"; //carga pantalla game over
        }
        //Si no, comprobar si se ha vencido al enemigo
        else if (enemy_1.dead) {
            console.log("THE END");
            the_end = true;
            SaveScore(); //calcular y guardar puntuaciones
            window.location.href = "level2.html"; //cargar siguiente nivel
            return;
        }

        //Antes de dibujar, calculamos el z-index (carril) de los jugadores
        player_1.zindex = player_carril_n(player_1);
        if (Jugadores == 2) {
            player_2.zindex = player_carril_n(player_2);
        }        
        
        //Dibujar personajes, balas y ui
        DrawChars();
        DrawBullets();
        ShowLife();

        //Colisiones
        CheckCollisions(player_1, enemy_1); //colisiones del enemigo con las balas del jugador 1
        CheckCollisions(enemy_1, player_1); //colisiones del jugador 1 con las balas del enemigo
        if (Jugadores == 2) {
            CheckCollisions(player_2, enemy_1); //colisiones del enemigo con las balas del jugador 2
            CheckCollisions(enemy_1, player_2); //colisiones del jugador 2 con las balas del enemigo
        }
        
        //Obtener accion del jugador por teclado
        PlayerAction();
    }

    /*** FUNCIONES DE PINTADO ***/

    //Pinta las capas en el canvas final, en orden de atras (2) adelante (0)
    function Draw() {
        //Limpiar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(capa2, 0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(capa1, 0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(capa0, 0, 0, window.innerWidth, window.innerHeight);
    }

    //Fondo
    function DrawBackground() {
        var background;
        background = fondo_principal;
        capa2ctx.drawImage(background, 0, 0);
    }

    //Personajes
    function DrawChars() {

        //obtener el carril en el que esta
        var carril = player_1.zindex;
        //Segun el carril, pintarlo en una capa u otra
        switch (carril) {
            case 0: capa0ctx.drawImage(player_1.sprite, player_1.posX, player_1.posY, player_1.carril.x, player_1.carril.y);
                break;
            case 1: capa1ctx.drawImage(player_1.sprite, player_1.posX, player_1.posY, player_1.carril.x, player_1.carril.y);
                break;
            case 2: capa2ctx.drawImage(player_1.sprite, player_1.posX, player_1.posY, player_1.carril.x, player_1.carril.y);
                break;
        }

        if (Jugadores == 2) {
            //obtener el carril en el que esta
            var carril = player_2.zindex;
            //Segun el carril, pintarlo en una capa u otra
            switch (carril) {
                case 0: capa0ctx.drawImage(player_2.sprite, player_2.posX, player_2.posY, player_2.carril.x, player_2.carril.y);
                    break;
                case 1: capa1ctx.drawImage(player_2.sprite, player_2.posX, player_2.posY, player_2.carril.x, player_2.carril.y);
                    break;
                case 2: capa2ctx.drawImage(player_2.sprite, player_2.posX, player_2.posY, player_2.carril.x, player_2.carril.y);
                    break;
            }
        }

        if (!enemy_1.dead) {
            //obtener el carril en el que esta
            var carril = enemy_1.zindex;
            //Segun el carril, pintarlo en una capa u otra
            switch (carril) {
                case 0: capa0ctx.drawImage(enemy_1.sprite, enemy_1.posX, enemy_1.posY, enemy_1.carril.x, enemy_1.carril.y);
                    break;
                case 1: capa1ctx.drawImage(enemy_1.sprite, enemy_1.posX, enemy_1.posY, enemy_1.carril.x, enemy_1.carril.y);
                    break;
                case 2: capa2ctx.drawImage(enemy_1.sprite, enemy_1.posX, enemy_1.posY, enemy_1.carril.x, enemy_1.carril.y);
                    break;
            }
        }       
    }

    function DrawBullets () {
        for (var j = 0; j < player_1.bullets.length; j++) {
            var disparoBueno = player_1.bullets[j];
            Update_Player_Bullet(disparoBueno, j, player_1);
        }

        if (Jugadores == 2) {
            for (var j = 0; j < player_2.bullets.length; j++) {
                var disparoBueno = player_2.bullets[j];
                Update_Player_Bullet(disparoBueno, j, player_2);
            }
        }

        if (enemy_1.life > 0) {
            for (var i = 0; i < enemy_1.bullets.length; i++) {
                var disparoMalo = enemy_1.bullets[i];
                Update_Enemy_Bullet(disparoMalo, i);
            }
        }
    }
        
    //Mover y pintar bala jugador 1
    function Update_Player_Bullet (bullet, id, player) {
        if (bullet) {
            bullet.identifier = id;
            if (bullet.posX < 1200) {
                bullet.posX += 5;
                //Obtener carril de la bala               
                var carril = bullet.zindex;
                //Segun el carril, pintarlo en una capa u otra
                switch (carril) {
                    case 0: capa0ctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
                        break;
                    case 1: capa1ctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
                        break;
                    case 2: capa2ctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
                        break;
                }
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
                //Obtener carril de la bala                
                var carril = bullet.zindex;               
                //Segun el carril, pintarlo en una capa u otra
                switch (carril) {
                    case 0: capa0ctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
                        break;
                    case 1: capa1ctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
                        break;
                    case 2: capa2ctx.drawImage(bullet.sprite, bullet.posX, bullet.posY, bullet.w, bullet.h);
                       break;
                }
            } else {
                enemy_1.DeleteShot(parseInt(bullet.identifier));
            }            
        }
    }

    function ShowLife() {
        switch (player_1.life) {
            case 3:
                capa0ctx.drawImage(player_1.life_sprite, 0, 10, 35, 35);
                capa0ctx.drawImage(player_1.life_sprite, 40, 10, 35, 35);
                capa0ctx.drawImage(player_1.life_sprite, 80, 10, 35, 35);
                break;
            case 2:
                capa0ctx.drawImage(player_1.life_sprite, 0, 10, 35, 35);
                capa0ctx.drawImage(player_1.life_sprite, 40, 10, 35, 35);
                break;
            case 1:
                capa0ctx.drawImage(player_1.life_sprite, 0, 10, 35, 35);
                break;
            case 0:
                break;
        }
        if (Jugadores == 2) {
            switch (player_2.life) {
                case 3:
                    capa0ctx.drawImage(player_2.life_sprite, 0, 50, 35, 35);
                    capa0ctx.drawImage(player_2.life_sprite, 40, 50, 35, 35);
                    capa0ctx.drawImage(player_2.life_sprite, 80, 50, 35, 35);
                    break;
                case 2:
                    capa0ctx.drawImage(player_2.life_sprite, 0, 50, 35, 35);
                    capa0ctx.drawImage(player_2.life_sprite, 40, 50, 35, 35);
                    break;
                case 1:
                    capa0ctx.drawImage(player_2.life_sprite, 0, 50, 35, 35);
                    break;
                case 0:
                    break;
            }
        }
    }

    /*** COLISIONES ***/
    
    function CheckCollisions(shooter, target) {
        //Recorrer array de balas del shooter, comprobando si la posicion del alguna coincide con la del target
        for (var i = 0; i < shooter.bullets.length; i++) {
            var b = shooter.bullets[i];
            //Primero comprobamos si tienen el mismo zindex (estan en el mismo carril)
            if (b.zindex == target.zindex) {
                console.log("target: " + target.posX + ", b: " + b.posX);
                //Despues comparamos sus posiciones en x (dentro de un rango)
                if ((b.posX >= target.posX - 3) && (b.posX <= target.posX + 2)) {
                    target.Hit(); //reducir vida y cambiar sprite
                    //Eliminar la bala del array
                    shooter.DeleteShot(b.identifier);
                }
            }
        }
    }    
    

    /*** TECLADO ***/
    function AddListener(element, type, expression, bubbling) {
        bubbling = bubbling || false;
        if (window.addEventListener) { // Standard
            element.addEventListener(type, expression, bubbling);
        } else if (window.attachEvent) { // IE
            element.attachEvent('on' + type, expression);
        }
    }

    // tecla pulsada
    function KeyDown (e) {
        var key = (window.event ? e.keyCode : e.which);
        for (var inkey in keyMap) {
            if (key === keyMap[inkey]) {
                e.preventDefault();
                keyPressed[inkey] = true;
            }
        }
    }

    // tecla soltada
    function KeyUp (e) {
        var key = (window.event ? e.keyCode : e.which);
        for (var inkey in keyMap) {
            if (key === keyMap[inkey]) {
                e.preventDefault();
                keyPressed[inkey] = false;
            }
        }
    }

    //Accion segun tecla
    function PlayerAction() {
        //Jugador 1
        if (keyPressed.p1_left)
            player_1.Left_CH();
        if (keyPressed.p1_right)
            player_1.Right_CH();
        if (keyPressed.p1_up)
            player_1.Up_CH();
        if (keyPressed.p1_down)
            player_1.Down_CH();

        if (keyPressed.p1_fire_1) {
            player_1.Shoot();
        }
        //Jugador 2
        if (keyPressed.p2_left)
            player_2.Left_CH();
        if (keyPressed.p2_right)
            player_2.Right_CH();
        if (keyPressed.p2_up)
            player_2.Up_CH();
        if (keyPressed.p2_down)
            player_2.Down_CH();

        if (keyPressed.p2_fire_1) {
            player_2.Shoot();
        }
    }

    /*** PUNTUACIONES ***/
    function SaveScore() {
        //Obtener en segundos el tiempo que ha pasado desde el inicio del juego
        fecha = new Date();
        var segundos_f = fecha.getTime() / 1000;
        var segundos = segundos_f - segundos_0;

        //Calcular puntos segun el tiempo y el numero de enemigos --> Primer enemigo: /0.5
        var puntos = parseInt(segundos / 0.5);
        console.log("ptos: " + puntos);
        //Guardar en memoria
        localStorage.setItem("puntos", puntos);
        the_end = false;
        game_over = false;
    }

    /*------- Funciones auxiliares -------*/

    //Devuelve el carril del jugador (CHROME)
    function player_carril_n(objeto) {        
        if ((objeto.posY <= carril_0) && (objeto.posY > carril_1)) {
            //console.log("carril 0");
            return 0;
        }
        if ((objeto.posY <= carril_1) && (objeto.posY > carril_2)) {
            //console.log("carril 1");
            return 1;
        }
        if ((objeto.posY <= carril_2) && (objeto.posY > carril_3)) {
            //console.log("carril 2");
            return 2;
        }
    }

    //Devuelve el carril del jugador (FIREFOX)
    function player_carril_n_2(objeto) {
        //console.log(objeto.posY);
        if ((objeto.posY <= carril_0 - 285) && (objeto.posY > carril_1 - 285)) {
            //console.log("carril 0");
            return 0;
        }
        if ((objeto.posY <= carril_1 - 285) && (objeto.posY > carril_2 - 285)) {
            //console.log("carril 1");
            return 1;
        }
        if ((objeto.posY <= carril_2 - 285) && (objeto.posY > carril_3 - 285)) {
            //console.log("carril 2");
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
        //Limpiar las capas
        /*capa0ctx.clearRect(0, 0, canvas.width, canvas.height);
        capa1ctx.clearRect(0, 0, canvas.width, canvas.height);
        capa2ctx.clearRect(0, 0, canvas.width, canvas.height);*/
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;        

        Draw();
    }
}



