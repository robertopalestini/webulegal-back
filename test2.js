var moment = require('moment'); // require
const date = require("date-and-time");


var fechaDB = "2022-08-11T19:36:21.548Z";
var trial_days = 15;

var fechaActual = date.format(new Date(), "YYYY-MM-DD");
var fechaCreacion = new Date(fechaDB);
fechaCreacion.setDate(fechaCreacion.getDate() + trial_days);
fechaCreacion = date.format(fechaCreacion, "YYYY-MM-DD");

var test = moment(fechaActual).isAfter(fechaCreacion, 'day');

if(test) {
    console.log('cobrar')
} else {
    console.log('no cobrrar');
}
 console.log(test,'fecha actual',fechaActual,'Fecha de creacion del usuario',fechaCreacion);













 