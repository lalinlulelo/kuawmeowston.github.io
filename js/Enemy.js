/*Clase para los objetos Enemigo*/

function Enemy(n_life, src_sprite, src_bullet, src_damaged, src_killed, bulletSpeed) {
    
    //Sprites
    this.sprite = new Image();
    this.sprite.src = src_sprite;
    this.killed = new Image();
    this.killed.src = src_killed;
    this.damaged = new Image();
    this.damaged.src = src_damaged;
    this.src_bullet = src_bullet;

    this.life = n_life;
    this.dead = false;
    this.bullets = [];
    this.bullet;
    this.bulletY = 524;
    this.bulletSpeed = bulletSpeed;
    this.speed = 5;
    this.shots = 100;
    this.carril = {
        x: 171.43,
        y: 120
    };
    this.zindex = 0;

    //Ubicacion
    this.settings = {
        marginBottom: 60,
        defaultHeight: 66
    }
    this.posX = 860;
    this.posY = 474;

    var that = this;
    this.src_sprite = src_sprite;

    //Disparar y cambiar de carril cada x segundos (aleatorio)
    setInterval(function (){
        that.Shoot();
        var random_carril = that.GetRandomNumber(0, 2);
        that.Cambio_carril(random_carril);
    }, that.GetRandomNumber(500, 1500));
    
    //that.GetRandomNumber(500, 1500)
}
   

/*** ACCIONES ENEMIGO ****/

//Disparo
Enemy.prototype.Shoot = function () {
    if (this.life > 0) {
        //Crear bala
        bullet = new Bullet(this.src_bullet, this.posX + 20, this.posY, this.bulletSpeed, this.bullets.length, this.carril.x*1.3, this.carril.y*1.3, this.zindex);
        //Meter en array
        this.bullets.push(bullet);
    }
}

Enemy.prototype.Cambio_carril = function (carril) {
    switch (carril) {
        case 0:            
            this.carril.x = 171.43;
            this.carril.y = 120;
            this.zindex = 0;
            break;
        case 1:
            this.carril.x = 133.3;
            this.carril.y = 85.71;
            this.zindex = 1;
            break;
        case 2:
            this.carril.x = 92.3;
            this.carril.y = 54.54;
            this.zindex = 2;
            break;
    }
}

//Golpe
Enemy.prototype.Hit = function () {
    console.log("ENEMY HIT");
    this.life -= 1;
    this.sprite.src = this.damaged.src; //poner sprite dañado
    var that = this;
    //Comprobar si ha muerto
    if (this.life <= 0) this.Kill();
    else {
        //Volver a poner el sprite normal
        setTimeout(function () {
            that.sprite.src = that.src_sprite;
        }, 250);
    }    
}

//Morir
Enemy.prototype.Kill = function () {
    console.log("muere el enemigo1");
    this.sprite.src = this.killed.src;
    var that = this;
    setTimeout(function () {
        that.dead = true;
    }, 750);
};


/*** Auxiliares ***/
Enemy.prototype.GetRandomNumber = function (range_min, range_max) {
    return Math.floor(Math.random() * (range_max - range_min + 1)) + range_min;
}


//Borrar disparo del array
Enemy.prototype.DeleteShot = function (idendificador) {
    ArrayRemove(this.bullets, idendificador);

    function ArrayRemove(array, from) {
        var rest = array.slice((from) + 1 || array.length);
        array.length = from < 0 ? array.length + from : from;
        return array.push.apply(array, rest);
    }
};






