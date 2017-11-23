/*
    Script de la seccion de Game Over
    
    Gestiona las puntuaciones del juego en funcion de la duracion del jugador contra los distintos enemigos
    que hay a lo largo de la part9da

    Autores:
        - Marta Fernandez de la Mela Salcedo
        - Adrian David Morilla Marco
        - Zhonghao Lin Chen
        - Salvador Nieto Garrido
        - Guillermo Melendez Morales
*/

//Antes que nada, oculta la parte de los rankings
visibilidad('rank');

var win = localStorage.getItem("win");
console.log("win: "+win);
var eng = 0; //0 español, 1 ingles
//eng = localStorage.getItem("idioma");
console.log("eng: " + eng);
var points = localStorage.getItem("puntos");
console.log("Puntos: " + points);

//Cambiar mensaje si ha perdido, dejarlo como estaba si ha ganado
if (win == 1 && eng!=1) {
    document.getElementById("txt").innerHTML = "¡Has ganado! Felicidades :D <br> Puntos: " + points;
} else if (win == 0 && eng == 0) {
    document.getElementById("txt").innerHTML = "¡Has perdido! Seguro que tienes más suerte la próxima vez. <br> Puntos: " + points;
} else if (win == 0 && eng == 1) {
    document.getElementById("txt").innerHTML = "You lose! You'll be luckier next time.  <br> Score: " + points;
    document.getElementById("cont").innerHTML = "Continue";       
} else if(win == 1 && eng ==1) {
    document.getElementById("txt").innerHTML = "You win! Congratulations :D  <br> Score: " + points;
    document.getElementById("cont").innerHTML = "Continue";     
}

//Cuando se pulsa el boton de continuar, ocultar parte del msg, mostrar la del ranking
function cont() {    
    visibilidad('msg');
    visibilidad('rank'); 
    
    //gestion de rankings
    rankings();
};

function visibilidad(id) {
    var x = document.getElementById(id);
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
};

function rankings() {
    var ranking = {};
    // inicializacion
    ranking[0] = { id: 1, nombre: 'Galletero', puntuacion: 20 };
    ranking[1] = { id: 2, nombre: 'Clara', puntuacion: 100 };
    ranking[2] = { id: 3, nombre: 'Nahikari', puntuacion: 320 };
    ranking[3] = { id: 4, nombre: 'Salva', puntuacion: 550 };
    ranking[4] = { id: 5, nombre: 'Susi', puntuacion: 770 };
    ranking[5] = { id: 6, nombre: 'Agus', puntuacion: 230 };
    ranking[6] = { id: 7, nombre: 'Sergio', puntuacion: 300 };
    ranking[7] = { id: 8, nombre: 'Adri', puntuacion: 310 };
    ranking[8] = { id: 9, nombre: 'Marta', puntuacion: 150 };
    ranking[9] = { id: 10, nombre: 'Guille', puntuacion: 268 };
    // recopila los datos de las partidas anteriores
    if (localStorage.getItem("nombre_0") != null) {
        ranking[0] = { id: 1, nombre: localStorage.getItem("nombre_0"), puntuacion: localStorage.getItem("puntos_0") };
        ranking[1] = { id: 2, nombre: localStorage.getItem("nombre_1"), puntuacion: localStorage.getItem("puntos_1") };
        ranking[2] = { id: 3, nombre: localStorage.getItem("nombre_2"), puntuacion: localStorage.getItem("puntos_2") };
        ranking[3] = { id: 4, nombre: localStorage.getItem("nombre_3"), puntuacion: localStorage.getItem("puntos_3") };
        ranking[4] = { id: 5, nombre: localStorage.getItem("nombre_4"), puntuacion: localStorage.getItem("puntos_4") };
        ranking[5] = { id: 6, nombre: localStorage.getItem("nombre_5"), puntuacion: localStorage.getItem("puntos_5") };
        ranking[6] = { id: 7, nombre: localStorage.getItem("nombre_6"), puntuacion: localStorage.getItem("puntos_6") };
        ranking[7] = { id: 8, nombre: localStorage.getItem("nombre_7"), puntuacion: localStorage.getItem("puntos_7") };
        ranking[8] = { id: 9, nombre: localStorage.getItem("nombre_8"), puntuacion: localStorage.getItem("puntos_8") };
        ranking[9] = { id: 10, nombre: localStorage.getItem("nombre_9"), puntuacion: localStorage.getItem("puntos_9") };
    }
        
    // solicitamos el nombre
    var name = prompt("Please enter your name", "Godofredo");
    while (name == null || name == "") {
        alert("incorrect name");
        name = prompt("Please enter your name", "Godofredo");
    }
   
    console.log(points);
    // se actualiza la tabla de puntuaciones
    comprobarRanking(name, points);
    console.log(ranking[0].puntuacion);
    console.log(ranking[1].puntuacion);
    console.log(ranking[2].puntuacion);
    console.log(ranking[3].puntuacion);
    console.log(ranking[4].puntuacion);
    console.log(ranking[5].puntuacion);
    console.log(ranking[6].puntuacion);
    console.log(ranking[7].puntuacion);
    console.log(ranking[8].puntuacion);
    console.log(ranking[9].puntuacion);
    // se muestra por pantalla la puntuacion
    showBestScores();
    // se sube a la nube las puntuaciones
    localStorage.setItem("nombre_0", ranking[0].nombre);
    localStorage.setItem("nombre_1", ranking[1].nombre);
    localStorage.setItem("nombre_2", ranking[2].nombre);
    localStorage.setItem("nombre_3", ranking[3].nombre);
    localStorage.setItem("nombre_4", ranking[4].nombre);
    localStorage.setItem("nombre_5", ranking[5].nombre);
    localStorage.setItem("nombre_6", ranking[6].nombre);
    localStorage.setItem("nombre_7", ranking[7].nombre);
    localStorage.setItem("nombre_8", ranking[8].nombre);
    localStorage.setItem("nombre_9", ranking[9].nombre);
    localStorage.setItem("puntos_0", ranking[0].puntuacion);
    localStorage.setItem("puntos_1", ranking[1].puntuacion);
    localStorage.setItem("puntos_2", ranking[2].puntuacion);
    localStorage.setItem("puntos_3", ranking[3].puntuacion);
    localStorage.setItem("puntos_4", ranking[4].puntuacion);
    localStorage.setItem("puntos_5", ranking[5].puntuacion);
    localStorage.setItem("puntos_6", ranking[6].puntuacion);
    localStorage.setItem("puntos_7", ranking[7].puntuacion);
    localStorage.setItem("puntos_8", ranking[8].puntuacion);
    localStorage.setItem("puntos_9", ranking[9].puntuacion);

    // funcion que actualiza las puntuaciones
    function comprobarRanking(name, points) {
        if (points < ranking[0].puntuacion) {
            ranking[0].puntuacion = points;
            ranking[0].nombre = name;
            return true;
        }
        if (points < ranking[1].puntuacion) {
            ranking[1].puntuacion = points;
            ranking[1].nombre = name;
            return true;
        }
        if (points < ranking[2].puntuacion) {
            ranking[2].puntuacion = points;
            ranking[2].nombre = name;
            return true;
        }
        if (points < ranking[3].puntuacion) {
            ranking[3].puntuacion = points;
            ranking[3].nombre = name;
            return true;
        }
        if (points < ranking[4].puntuacion) {
            ranking[4].puntuacion = points;
            ranking[4].nombre = name;
            return true;
        }
        if (points < ranking[5].puntuacion) {
            ranking[5].puntuacion = points;
            ranking[5].nombre = name;
            return true;
        }
        if (points < ranking[6].puntuacion) {
            ranking[6].puntuacion = points;
            ranking[6].nombre = name;
            return true;
        }
        if (points < ranking[7].puntuacion) {
            ranking[7].puntuacion = points;
            ranking[7].nombre = name;
            return true;
        }
        if (points < ranking[8].puntuacion) {
            ranking[8].puntuacion = points;
            ranking[8].nombre = name;
            return true;
        }
        if (points < ranking[9].puntuacion) {
            ranking[9].puntuacion = points;
            ranking[9].nombre = name;
            return true;
        }
    }
    // funcion que imprime por pantalla las puntuaciones
    function showBestScores() {
        var cadena_id = "";
        var cadena_nombre = "";
        var cadena_puntuacion = "";
        for (var i = 0; i < 10; i++) {
            cadena_id += ranking[i].id + "<br>";
        }
        for (var i = 0; i < 10; i++) {
            cadena_nombre += ranking[i].nombre + "<br>";
        }
        for (var i = 0; i < 10; i++) {
            cadena_puntuacion += ranking[i].puntuacion + "<br>";
        }
        var ids = document.getElementById("ids");
        ids.innerHTML = "<p1>" + cadena_id + "</p1>";
        var nombres = document.getElementById("nombres");
        nombres.innerHTML = "<p2>" + cadena_nombre + "</p2>";
        var puntuaciones = document.getElementById("puntuaciones");
        puntuaciones.innerHTML = "<p3>" + cadena_puntuacion + "</p3>";
    };
    
    if (eng == 1) {
        document.getElementById("tituloPuntuaciones").innerHTML = "Best scores";        
        document.getElementById("salida").innerHTML = "Press enter to go back to the menu";       
    }
};
