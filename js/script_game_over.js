var ranking = {};
var init = false;
// inicialization
ranking[0] = {id:1, nombre: 'Galletero', puntuacion: 20};
ranking[1] = {id:2, nombre: 'Clara', puntuacion: 100};
ranking[2] = {id:3, nombre: 'Nahikari', puntuacion: 320};
ranking[3] = {id:4, nombre: 'Salva', puntuacion: 550};
ranking[4] = {id:5, nombre: 'Susi', puntuacion: 770};
ranking[5] = {id:6, nombre: 'Agus', puntuacion: 975};
ranking[6] = {id:7, nombre: 'Sergio', puntuacion: 1000};
ranking[7] = {id:8, nombre: 'Adri', puntuacion: 1310};
ranking[8] = {id:9, nombre: 'Marta', puntuacion: 1550};
ranking[9] = {id:10, nombre: 'Guille', puntuacion: 1758};
if(localStorage.getItem("nombre_0") != null){
    ranking[0] = {id:1, nombre: localStorage.getItem("nombre_0"), puntuacion: localStorage.getItem("puntos_0")};
    ranking[1] = {id:2, nombre: localStorage.getItem("nombre_1"), puntuacion: localStorage.getItem("puntos_1")};
    ranking[2] = {id:3, nombre: localStorage.getItem("nombre_2"), puntuacion: localStorage.getItem("puntos_2")};
    ranking[3] = {id:4, nombre: localStorage.getItem("nombre_3"), puntuacion: localStorage.getItem("puntos_3")};
    ranking[4] = {id:5, nombre: localStorage.getItem("nombre_4"), puntuacion: localStorage.getItem("puntos_4")};
    ranking[5] = {id:6, nombre: localStorage.getItem("nombre_5"), puntuacion: localStorage.getItem("puntos_5")};
    ranking[6] = {id:7, nombre: localStorage.getItem("nombre_6"), puntuacion: localStorage.getItem("puntos_6")};
    ranking[7] = {id:8, nombre: localStorage.getItem("nombre_7"), puntuacion: localStorage.getItem("puntos_7")};
    ranking[8] = {id:9, nombre: localStorage.getItem("nombre_8"), puntuacion: localStorage.getItem("puntos_8")};
    ranking[9] = {id:10, nombre: localStorage.getItem("nombre_9"), puntuacion: localStorage.getItem("puntos_9")};
}

// toma de datos
var txt;
var minutos_0 = localStorage.getItem("minutos_0");
var segundos_0 = localStorage.getItem("segundos_0");
var minutos_f = localStorage.getItem("minutos_f");
var segundos_f = localStorage.getItem("segundos_f");
var enemigos = localStorage.getItem("enemigos")
console.log("minutos: " + minutos_0 + " segundos " + segundos_0 + " enemigos " + enemigos);
console.log("minutos: " + minutos_f + " segundos: " + segundos_f + "enemigos: " + enemigos);
var minutos = parseInt(minutos_f) - parseInt(minutos_0);
var segundos = (parseInt(segundos_f) + minutos*60) - parseInt(segundos_0);
console.log(segundos);
var name = prompt("Please enter your name", "Godofredo");
//name = "HAO"
while(name == null || name == ""){
    alert("incorrect name");
    name = prompt("Please enter your name", "Godofredo");
}
//var points = localStorage.getItem("puntos");
switch(parseInt(enemigos)){
    case 0:
        var points = segundos * 1000;
        break;
    case 1:
        var points = segundos * 3;
}
//var points = 2 * segundos * (1 / ((parseInt(enemigos)+1)*2))
console.log(points);
//points = 30;
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
showBestScores();
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

function comprobarRanking (name, points){
    if(points < ranking[0].puntuacion){
        ranking[0].puntuacion = points;
        ranking[0].nombre = name;
        return true;
    }
    if(points < ranking[1].puntuacion){
        ranking[1].puntuacion = points;
        ranking[1].nombre = name;
        return true;
    }
    if(points < ranking[2].puntuacion){
        ranking[2].puntuacion = points;
        ranking[2].nombre = name;
        return true;
    }
    if(points < ranking[3].puntuacion){
        ranking[3].puntuacion = points;
        ranking[3].nombre = name;
        return true;
    }
    if(points < ranking[4].puntuacion){
        ranking[4].puntuacion = points;
        ranking[4].nombre = name;
        return true;
    }
    if(points < ranking[5].puntuacion){
        ranking[5].puntuacion = points;
        ranking[5].nombre = name;
        return true;
    }
    if(points < ranking[6].puntuacion){
        ranking[6].puntuacion = points;
        ranking[6].nombre = name;
        return true;
    }
    if(points < ranking[7].puntuacion){
        ranking[7].puntuacion = points;
        ranking[7].nombre = name;
        return true;
    }
    if(points < ranking[8].puntuacion){
        ranking[8].puntuacion = points;
        ranking[8].nombre = name;
        return true;
    }
    if(points < ranking[9].puntuacion){
        ranking[9].puntuacion = points;
        ranking[9].nombre = name;
        return true;
    }
}
function showBestScores (){
    var cadena_id = "";
    var cadena_nombre = "";
    var cadena_puntuacion = "";
    for(var i = 0; i < 10; i++){
        cadena_id += ranking[i].id + "<br>"; 
    }
    for(var i = 0; i < 10; i++){
        cadena_nombre += ranking[i].nombre + "<br>"; 
    }
    for(var i = 0; i < 10; i++){
        cadena_puntuacion += ranking[i].puntuacion + "<br>"; 
    }
    //document.getElementById('numeros').innerHTML = "";
    var ids = document.getElementById("ids");
    ids.innerHTML = "<p1>" + cadena_id + "</p1>";
    var nombres = document.getElementById("nombres");
    nombres.innerHTML = "<p2>" + cadena_nombre + "</p2>";
    var puntuaciones = document.getElementById("puntuaciones");
    puntuaciones.innerHTML = "<p3>" + cadena_puntuacion + "</p3>";
    
}