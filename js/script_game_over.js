var ranking = {};
// inicialization
ranking[0] = {id:1, nombre: '', puntuacion: 0};
ranking[1] = {id:2, nombre: '', puntuacion: 0};
ranking[2] = {id:3, nombre: '', puntuacion: 0};
ranking[3] = {id:4, nombre: '', puntuacion: 0};
ranking[4] = {id:5, nombre: '', puntuacion: 0};
ranking[5] = {id:6, nombre: '', puntuacion: 0};
ranking[6] = {id:7, nombre: '', puntuacion: 0};
ranking[7] = {id:8, nombre: '', puntuacion: 0};
ranking[8] = {id:9, nombre: '', puntuacion: 0};
ranking[9] = {id:10, nombre: '', puntuacion: 0};
// toma de datos
var txt;
var persona = prompt("Please enter your name", "Godofredo");
while(persona == null || persona == ""){
    alert("incorrect name");
    persona = prompt("Please enter your name", "Godofredo");
}
var points = localStorage.getItem("puntos");
comprobarRanking(puntos);


function comprobarRanking (points){
    if(points < ranking[0].puntuacion){
        ranking[0].puntuacion = points;
        return true;
    }
    if(points < ranking[1].puntuacion){
        ranking[1].puntuacion = points;
        return true;
    }
    if(points < ranking[2].puntuacion){
        ranking[2].puntuacion = points;
        return true;
    }
    if(points < ranking[3].puntuacion){
        ranking[3].puntuacion = points;
        return true;
    }
    if(points < ranking[4].puntuacion){
        ranking[4].puntuacion = points;
        return true;
    }
    if(points < ranking[5].puntuacion){
        ranking[5].puntuacion = points;
        return true;
    }
    if(points < ranking[6].puntuacion){
        ranking[6].puntuacion = points;
        return true;
    }
    if(points < ranking[7].puntuacion){
        ranking[7].puntuacion = points;
        return true;
    }
    if(points < ranking[8].puntuacion){
        ranking[8].puntuacion = points;
        return true;
    }
    if(points < ranking[9].puntuacion){
        ranking[9].puntuacion = points;
        return true;
    }
}
