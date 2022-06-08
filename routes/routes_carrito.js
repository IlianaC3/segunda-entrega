const express = require('express');
const { Router } = express;
const { carritosDao } = require('../class/index');

const router = new Router();

//Carrito
router.post('/',(req, res, next) => {
    let { id_prod } = req.body;
    
    let nuevoProducto = {
        id_prod
    }
    carritosDao.save(nuevoProducto).then(result => {
        // console.log(result)
        if (result !== undefined) {
            res.status(200).json({
                message: `Nuevo Carrito`,
                result: result
            });
        } else {
            res.status(404).json({
                error: `No se pudo guardar el Carrito`,
            });
        }
    });
});

router.delete('/:id',(req, res, next) => {
    let id = req.params.id;
    carritosDao.deleteById(id).then(result => {
        if (result !== undefined) {
            res.status(200).json({
                message: `Eliminar Carrito ${id}`,
                result: result
            });
        } else {
            res.status(404).json({
                error: `No se pudo eliminar el Carrito`,
            });
        }
    });
});

//Productos carrito
router.get('/:id/productos',(req, res, next) => {
    let id = req.params.id;
    carritosDao.getProductsById(id).then(result => {
        if (result !== undefined) {
            if (result === null) {
                res.status(404).json({
                    error: `Carrito no encontrado para el id ${id}`,
                });
            } else {
                res.status(200).json({
                    message: `Carrito ID: ${id}`,
                    result: result
                });
            }
        } else {
            res.status(404).json({
                error: `El archivo no se puede leer`,
            });
        }
    });
});

router.post('/:id/productos',(req, res, next) => {
    let id = req.params.id;
    let { id_prod } = req.body;
    let editarCarrito = {
        id_prod
    }
    carritosDao.addProductsById(id, editarCarrito).then(result => {
        // console.log(result)
        if (result !== undefined) {
            res.status(200).json({
                message: `Editar Carrito ${id}`,
                result: result
            });
        } else {
            res.status(404).json({
                error: `No se pudo modificar el Carrito`,
            });
        }
    });
});

router.delete('/:id/productos/:id_prod',(req, res, next) => {
    let id = req.params.id;
    let id_prod = req.params.id_prod;
    carritosDao.deleteProductById(id, id_prod).then(result => {
        if (result !== undefined) {
            res.status(200).json({
                message: `Eliminar Producto Carrito ${id}`,
                result: result
            });
        } else {
            res.status(404).json({
                error: `No se pudo eliminar el Producto del Carrito`,
            });
        }
    });
});

router.use((req, res, next) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;
    next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = router;
