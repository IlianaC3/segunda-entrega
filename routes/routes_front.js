const express = require('express');
const app = express();

const { carritosDao, productosDao } = require('../class/index');

let arrayProd = [];
let arrayCar = [];

const functionProd = async function() {
   const productos = await productosDao.getAll();
   arrayProd = productos === null ? [] : productos;
}

const functionCar = async function () {
   const carritos = await carritosDao.findCarrito();
   arrayCar = carritos === null ? [] : carritos;
}

functionProd();
functionCar();

app.set('view engine', 'ejs');
app.set('views', './public');

app.get('/', (req, res) => {
   functionProd();
   functionCar();
   res.render('index', {data: arrayProd, dataCar: arrayCar});
});

app.get('/carrito', (req, res) => {
   functionCar();
   res.render('carrito', {data: arrayCar});
});

app.get('/administrador', (req, res) => {
   if (req.query.admin) {
      functionProd();
      res.render('admin', {data: arrayProd});
   } else {
      res.render('unauthorized', {data:{
         error : -1,
         descripcion: 'Ruta /admin método vista no autorizada'
      }})
   }
 });
 
 app.get('/agregar', (req, res) => {
   if (req.query.admin) {
      res.render('agregar');
   } else {
      res.render('unauthorized', {data:{
         error : -1,
         descripcion: 'Ruta /agregar método agregar no autorizada'
      }})
   }
 });
 
 app.get('/editar/:id', (req, res) => {
   if (req.query.admin) {
      functionProd();
      let index = arrayProd.findIndex(obj => obj.id == req.params.id)
      res.render('editar', {data: arrayProd[index]});
   } else {
      res.render('unauthorized', {data:{
         error : -1,
         descripcion: 'Ruta /editar método editar no autorizada'
      }})
   }
 });

 app.get(/^\/[A-Za-z0-9.-_/*]/, (req, res) => {
      res.render('error')
 });

 module.exports = app;