/* Clase para los objetos Jugador*/
function Player(n_life, src_sprite, src_bullet, src_killed, src_life, canvas) {
    
    //Sprites
    this.sprite = new Image();
    this.sprite.src = src_sprite;
    this.life_sprite = new Image();
    this.life_sprite.src = src_life;
    this.killed = new Image();
    this.killed.src = src_killed;
    this.src_bullet = src_bullet;

    //Sonido
    this.myMusic = new Sound("sound/golpe_al_gatini.wav");

    this.canvas = canvas;

    this.life = n_life;
    this.dead = false;
    this.bullets = [];
    this.bullet;
    this.speed = 12;
    this.next_shoot;
    this.now = 0;
    this.shoot_delay = 250;
    this.carril = {
        x: 1200/4,
        y: 600/4
    };
    this.zindex = 0;

    //Ubicacion
    this.settings = {
        marginBottom: 60,
        defaultHeight: 66
    };
    this.posX = 0; 
    this.posY = 474;
    
}

/*** ACCIONES JUGADOR ****/

//Disparar
Player.prototype.Shoot = function () {
    if (this.next_shoot < this.now || this.now == 0) {
        //Crear bala
        this.bullet = new Bullet(this.src_bullet, this.posX + 20, this.posY, 5, this.bullets.length, this.carril.x, this.carril.y, this.zindex);
        //Meter en array
        this.bullets.push(this.bullet);
        //Retardo disparo
        this.now += this.shoot_delay;
        this.next_shoot = this.now + this.shoot_delay;
    } else {
        this.now = new Date().getTime();
    }
}

//Movimiento chrome
Player.prototype.Left_CH = function () {
    if (this.posX > (-120 * this.posY + 56850))
        this.posX -= this.speed;
}

Player.prototype.Right_CH = function () {
    if (this.posX < (-120 * this.posY + 57215))
        this.posX += this.speed;
}

Player.prototype.Up_CH = function () {
    if (this.posY > 473) {
        this.posY -= 0.05;
        this.posX += 6;
        this.carril.x -= 10;
        this.carril.y -= 5;
    }
}

Player.prototype.Down_CH = function () {
    if (this.posY < 474) {
        this.posY += 0.05;
        this.posX -= 6;
        this.carril.x += 10;
        this.carril.y += 5;
    }
}

//Golpe
Player.prototype.Hit = function () {
    console.log("PLAYER HIT");
    //Sonido
    this.myMusic.play();
    this.life -= 1;
    if (this.life <= 0) {
        this.dead = true;
        this.sprite.src = this.killed.src;
    }
    
}

/*** AUXILIARES **/
//Elimina un elemento de un array
//Borrar disparo del array
Player.prototype.DeleteShot = function (idendificador) {
    ArrayRemove(this.bullets, idendificador);

    function ArrayRemove (array, from) {
        var rest = array.slice((from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    };
};
