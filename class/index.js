const express = require('express');
let productosDao
let carritosDao

let dataB = 'firebase'

switch (dataB) {
    case 'json':
        const ProductosFS = require('./dao/Productos/ProductosFS')
        const CarritoFS = require('./dao/Carritos/CarritoFS')
        productosDao = new ProductosFS('productos.json')
        carritosDao = new CarritoFS('carrito.json')
        break
    case 'firebase':
        const ProductosFirebase = require('./dao/Productos/ProductosFirebase')
        const CarritosFirebase = require('./dao/Carritos/CarritoFirebase')

        productosDao = new ProductosFirebase()
        carritosDao = new CarritosFirebase()
        break
    case 'mongodb':
        const ProductosMongo = require('./dao/Productos/ProductosMongo')
        const CarritosMongo = require('./dao/Carritos/CarritoMongo')

        productosDao = new ProductosMongo()
        carritosDao = new CarritosMongo()
        break
    default:
        const ProductosM = require('./dao/Productos/ProductosM')
        const CarritosM = require('./dao/Carritos/CarritoM')
        productosDao = new ProductosM()
        carritosDao = new CarritosM()
        break
}

module.exports = { productosDao, carritosDao }