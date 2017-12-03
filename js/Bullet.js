/*Clase para los objetos Bala*/

function Bullet(src_sprite, x, y, speed, id, w, h, z) {
    
    //Variables
    this.sprite = new Image();
    this.sprite.src = src_sprite;
    this.posX = x;
    this.posY = y;
    this.zindex = z;
    this.speed = speed;
    this.identifier = id;
    this.w = w;
    this.h = h;
}