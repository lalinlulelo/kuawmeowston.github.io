// --------- Iniciación ---------
	// posiciones del gato en el eje horizontal en funcion del carril 
	var carril_0 = {
		posicion_S : 0,
		posicion_M : 50,
		posicion_L : 100
	};
	var carril_1 = {
		posicion_S : 0,
		posicion_M : 60,
		posicion_L : 110
	};
	var carril_2 = {
		posicion_S : 0,
		posicion_M : 70,
		posicion_L : 120
	};
  // +++++ Variables Player 1 +++++
	var P1 = {
		// controles del jugador 1
		control : {up: '87', down: '83', left: '65', right: '68', atq_normal: '81', atq_especial: '69'},
		// gestiona la posición en vertical
		carril : 0,
		// gestiona el escalado del sprite
		escalado : 1,
		// gestiona el traslado del sprite al escalarlo
		traslacion : 0,
		// gestiona la posicion horizontal
		posicion : 0,
		// direccion url del sprite del jugador
		default_img : document.getElementById("player_1").src,
		// sprite del jugador
		img : document.getElementById("player_1"),
		// sprite del ataque normal
		normal : document.getElementById("bullet_1"),
		// direccion url del sprite del jugador
		normal_img : document.getElementById("bullet_1").src,
		// sprites del jugador en ataque normal y ataque especial
		ataque_normal : 0
	}
	// sprites del jugador en ataque normal y ataque especial
	var imgs = ["https://media.tenor.com/images/dc3c54049161874a5d6a1a83f241a488/tenor.gif", "https://media.tenor.com/images/a3be40f4556c0983d6d6df8737d53e5f/tenor.gif"];
    // tiempo de transición del jugador
    document.getElementById("player_1").style.transition = "all 0.5s";
  // +++++ Variables Player 2 +++++

  // +++++ Variables Pepino +++++
    var Pepino_muerte = 0;

// ----------- Ataques ----------
  // cambia el sprite por el siguiente del array (cuando atacas te cambia al sprite de ataque)
  function changeImage(dir, player) {  
    player.src = imgs[imgs.indexOf(player.src) + (dir || 1)] || imgs[dir ? imgs.length - 1 : 0];
  }
  // pone la imagen por defecto al medio segundo
  function returnImage(player, source){  
    setTimeout(function() {
      document.getElementById(player).setAttribute("src", source);
    }, 500);
  }


// ---------- Teclado  ----------
  document.onkeydown = function(e) {
   e = e || window.event; 
  // +++++++ jugador 1 +++++++
    // ataque normal
      if(e.keyCode == P1.control.atq_normal){
        // evita que se pulse de seguido, solo dejando volver a disparar una vez finalice el disparo anterior
        if(P1.ataque_normal === 0){
          P1.ataque_normal = 1;
          // cambiamos el sprite
          changeImage(1, P1.img);    
          // hacemos que se mueva la bala
          animacion_bala("bullet_1");
          // restablecemos el sprite
          returnImage("player_1", P1.default_img);
        }    
      }
    // ataque especial
      if(e.keyCode == P1.control.atq_especial){
        // se cambia el sprite
        changeImage(-1, P1.img);
        // se restablece el sprite por defecto
        returnImage("player_1", P1.default_img);
      }
    // movimiento hacia el fondo
      if(e.keyCode == P1.control.up){
        // dependiendo del carril hago una transformacion u otra
        switch(P1.carril){
          case 0:
            P1_movimiento(0.8, -20, P1.posicion);
            // guardo las transformaciones para que otros metodos los empleen
            P1.carril = 1;
            P1.escalado = 0.8;
            P1.traslacion = -20;
            break;
          case 1:
            P1_movimiento(0.6, -60, P1.posicion);
            // guardo las transformaciones para que otros metodos los empleen
            P1.carril = 2;
            P1.escalado = 0.6;
            P1.traslacion = -60;
          break;
        }
      }
   // movimiento hacia el frente
      if(e.keyCode == P1.control.down){
        // dependiendo del carril
        switch(P1.carril){
          case 2:
            P1_movimiento(0.8, -20, P1.posicion);
            // guardo las transformaciones para que otros metodos los empleen
            P1.carril = 1;
            P1.escalado = 0.8;
            P1.traslacion = -20;
            break; 
          case 1:
            P1_movimiento(1, 0, P1.posicion); 
            // guardo las transformaciones para que otros metodos los empleen
            P1.carril = 0;
            P1.escalado = 1;
            P1.traslacion = 0;
            break;
        }
      }
   // movimiento hacia la izquierda
      if(e.keyCode == P1.control.left){
        // dependiendo de la posicion en la que se cuentre
        switch(P1.posicion){
          case carril_0.posicion_L:
          case carril_1.posicion_L:
          case carril_2.posicion_L:
            switch (P1.carril){
              case 0:
                P1_movimiento(P1.escalado, P1.traslacion, carril_0.posicion_M);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_0.posicion_M;
                break;
              case 1:
                P1_movimiento(P1.escalado, P1.traslacion, carril_1.posicion_M);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_1.posicion_M;
                break;
              case 2:
                P1_movimiento(P1.escalado, P1.traslacion, carril_2.posicion_M);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_2.posicion_M;
                break;
            }        
            break;
          case carril_0.posicion_M:
          case carril_1.posicion_M:
          case carril_2.posicion_M:
            P1_movimiento(P1.escalado, P1.traslacion, 0);
            // guardo las transformaciones para que otros metodos los empleen
            P1.posicion = 0;
            break; 
        }
      }
   // movimiento hacia la derecha
      if(e.keyCode == P1.control.right){
        // dependiendo de la posicion del jugador
        switch(P1.posicion){
          case 0:
            switch (P1.carril){
              case 0:
                P1_movimiento(P1.escalado, P1.traslacion, carril_0.posicion_M);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_0.posicion_M;
                break;
              case 1:
                P1_movimiento(P1.escalado, P1.traslacion, carril_1.posicion_M);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_1.posicion_M;
                break;
              case 2:
                P1_movimiento(P1.escalado, P1.traslacion, carril_2.posicion_M);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_2.posicion_M;
                break;
            }
            break;
          case carril_0.posicion_M:
          case carril_1.posicion_M:
          case carril_2.posicion_M:
            switch (P1.carril){
              case 0:
                P1_movimiento(P1.escalado, P1.traslacion, carril_0.posicion_L);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_0.posicion_L;
                break;
              case 1:
                P1_movimiento(P1.escalado, P1.traslacion, carril_1.posicion_L);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_1.posicion_L;
                break;
              case 2:
                P1_movimiento(P1.escalado, P1.traslacion, carril_2.posicion_L);
                // guardo las transformaciones para que otros metodos los empleen
                P1.posicion = carril_2.posicion_L;
                break;
            }
            break;  
        }    
      }
  // +++++++ jugador 2 +++++++
};

// -------- Animaciones ---------
  // ++++++ Enemigo disparo +++++++
    function animacion_bala_Pepino (time, carril){
      // indicamos la duracion de las animaciones y volvemos visible la bala
      document.getElementById("Pepino_bullet").style.transition = "transform 2s";
      document.getElementById("Pepino_bullet").style.visibility = "visible"; 
      // dependiendo del carrill se realizara un determinada transformacion
      switch(carril){
        case 0:
          // desplazamos, y escalamos el sprite del pepino para indicar a donde dispara
          // * falta escalar la bala
          // escalado 0, traslacion -200px      
          document.getElementById("Pepino_bullet").style.transform = 'translateX(-470px)';
          document.getElementById("Pepino").style.top = 140 + 'px';
          document.getElementById("Pepino").style.height = 150 + 'px';
          break;
        case 1: 
          // desplazamos, y escalamos el sprite del pepino para indicar a donde dispara
          // * falta escalar la bala
          // escalado medio, traslacion -200px top arriba
          document.getElementById("Pepino_bullet").style.transform = 'translateX(-470px)';
          document.getElementById("Pepino_bullet").style.top = 200 + 'px';
          document.getElementById("Pepino_bullet").style.height = carril_2.posicion_M + 'px';
          document.getElementById("Pepino").style.top = 125 + 'px';
          document.getElementById("Pepino").style.height = 130 + 'px';
          break;
        case 2:
          // desplazamos, y escalamos el sprite del pepino para indicar a donde dispara
          // * falta escalar la bala
          // escañadp alto, traslacion -200px top arriba
          document.getElementById("Pepino_bullet").style.transform = 'translateX(-470px)';
          document.getElementById("Pepino_bullet").style.top = 190 + 'px';
          document.getElementById("Pepino_bullet").style.height = carril_1.posicion_M + 'px';
          document.getElementById("Pepino").style.top = carril_0.posicion_L + 'px';
          document.getElementById("Pepino").style.height = carril_1.posicion_L + 'px';
          break;
      }
      // se restablecen los valores por defecto
      setTimeout(function (){
          document.getElementById("Pepino_bullet").style.transition = "transform 0s";
          document.getElementById("Pepino_bullet").style.transform = 'translateX(470px)';
          document.getElementById("Pepino_bullet").style.top = 220 + 'px';
          document.getElementById("Pepino_bullet").style.height = 80 + 'px';
          document.getElementById("Pepino").style.top = 140 + 'px';
          document.getElementById("Pepino").style.height = 150 + 'px';
      }, 2000);
    }
  // +++++++ Disparo normal +++++++
    function animacion_bala (player){
      var jugador;
      // dependiendo del jugador, empleamos una bala u otra
      switch(player){
        case "bullet_1":
          jugador = P1.carril;
          break;
        case "bullet_2":
          jugador = P2_carril;
          break;
      }
      // se cambia la visibilidad de la bala para que aparezca
      document.getElementById(player).style.visibility = "visible";
      // dependiendo del carril del jugador:
      switch(jugador){
          // dependiendo del carril
        case 0:      
          document.getElementById(player).style.height = 40 +'px';
          document.getElementById(player).style.transition = "transform 2s";
          // dependiendo de la posicion, desplazaremos la bala
          switch(P1.posicion){
            case 0:
              document.getElementById(player).style.left = '0px'; 
              break;
            case carril_0.posicion_M:
            case carril_1.posicion_M:
            case carril_2.posicion_M:
              document.getElementById(player).style.left = carril_0.posicion_M + 'px'; 
              break;
            case carril_0.posicion_L:
            case carril_1.posicion_L:
            case carril_2.posicion_L:
              document.getElementById(player).style.left = carril_0.posicion_L + 'px'; 
              break;
          }      
          document.getElementById(player).style.transform = 'translateX(700px)';
          document.getElementById(player).style['-webkit-transform']  = 'translateX(700px)';
          document.getElementById(player).style['-ms-transform']  = 'translateX(700px)';
          document.getElementById(player).style['-moz-transform'] = 'translateX(700px)';
          break;
        case 1:
          document.getElementById(player).style.height = 25 +'px';
          document.getElementById(player).style.transition = "transform 2s";
          switch(P1.posicion){
            case 0:
              document.getElementById(player).style.left = '0px'; 
              break;
            case carril_0.posicion_M:
            case carril_1.posicion_M:
            case carril_2.posicion_M:
              document.getElementById(player).style.left = carril_1.posicion_M + 'px'; 
              break;
            case carril_0.posicion_L:
            case carril_1.posicion_L:
            case carril_2.posicion_L:
              document.getElementById(player).style.left = carril_1.posicion_L + 'px'; 
              break;
          }
          document.getElementById(player).style.transform = 'translateX(700px)';
          document.getElementById(player).style['-webkit-transform']  = 'translateX(700px)';
          document.getElementById(player).style['-ms-transform']  = 'translateX(700px)';
          document.getElementById(player).style['-moz-transform'] = 'translateX(700px)';
          break;
        case 2:
          document.getElementById(player).style.top = 180 +'px';
          document.getElementById(player).style.height = 20 +'px';
          document.getElementById(player).style.transition = "transform 2s";
          switch(P1.posicion){
            case 0:
              document.getElementById(player).style.left = '0px'; 
              break;
            case carril_0.posicion_M:
            case carril_1.posicion_M:
            case carril_2.posicion_M:
              document.getElementById(player).style.left = carril_2.posicion_M + 'px'; 
              break;
            case carril_0.posicion_L:
            case carril_1.posicion_L:
            case carril_2.posicion_L:
              document.getElementById(player).style.left = carril_2.posicion_L + 'px'; 
              break;
          }
          document.getElementById(player).style.transform = 'translateX(700px)';
          document.getElementById(player).style['-webkit-transform']  = 'translateX(700px)';
          document.getElementById(player).style['-ms-transform']  = 'translateX(700px)';
          document.getElementById(player).style['-moz-transform'] = 'translateX(700px)';
          break;
      }
      // se resetea la bala, para poder ser disparada de nuevo
      setTimeout(function() {
        document.getElementById(player).style.transition = "all 0s";
        document.getElementById(player).style.visibility = 'hidden';
        document.getElementById(player).style.transform = 'scale(1)';
        document.getElementById(player).style.top = 190 +'px';
        document.getElementById(player).style.height = 40 +'px';
        document.getElementById(player).style.left = '0px';
        P1.ataque_normal = 0;
      }, 2000);
    }

  // +++++++ Movimiento +++++++
    function P1_movimiento (valor_1, valor_2, valor_3 ){
        // escalamos, y trasladamos el personaje en funcion del control introducido
        document.getElementById("player_1").style.transform = 'scale(' + valor_1 + ')' + 'translateY(' + (valor_2) + '%)' + 'translateX(' + (valor_3) + 'px)';
        document.getElementById("player_1").style['-webkit-transform'] = 'scale(' + valor_1 + ')' + 'translateY(' + (valor_2) + '%)' + 'translateX(' + (valor_3) + 'px)';
        document.getElementById("player_1").style['-ms-transform'] = 'scale(' + valor_1 + ')' + 'translateY(' + (valor_2) + '%)' + 'translateX(' + (valor_3) + 'px)';
        document.getElementById("player_1").style['-moz-transform'] = 'scale(' + valor_1 + ')' + 'translateY(' + (valor_2) + '%)' + 'translateX(' + (valor_3) + 'px)';
    }

// ---------- Gameloop ---------- 
  // +++++ IA Pepino ++++++
    // cada 3 segundos hacer:
    var Pepino_IA = setInterval(function () {
      // despues de 2 segundos hacer
      setTimeout(function () {
        animacion_bala_Pepino(0, P1.carril);
      }, 2000);
    }, 3000);