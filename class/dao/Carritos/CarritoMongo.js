const mongoose = require('mongoose')
const Connections = require("../../../config");
const { collCarrito, collProducto } = require('../collecciones')
const { parseJSON , renameField, removeField } = require('../../../utils/fields');

class Contenedor {
    constructor() {
        this.coleccion = collCarrito
    }

    async main() {
        await mongoose.connect(Connections.mongodb.cnxStr, Connections.mongodb.options);
    }

    async findCarrito() {
        try {
            this.main();
            let docs = await this.coleccion.find({}, { __v: 0 }).lean()
            docs = docs.map(parseJSON)
            docs = docs.map(d => renameField(d, '_id', 'id'));
            let result = docs[0]
            return result === undefined ? null : [ result ]
        } catch {
            return "Error al leer archivo";
        }
    }

    async save(product) {
        try {
            this.main();
            const Producto = await collProducto.find({ '_id': product.id_prod }, { __v: 0 })
            let newPr = {
                code: Producto[0].code,
                title: Producto[0].title,
                description: Producto[0].description,
                price: Producto[0].price,
                stock: Producto[0].stock,
                thumbnail: Producto[0].thumbnail,
                timestamp: Producto[0].timestamp,
                id: Producto[0]._id
            }
            let object = {
                timestamp: new Date(),
                productos: [newPr]
            }
            let doc = await this.coleccion.create(object);
            doc = parseJSON(doc)
            renameField(doc, '_id', 'id')
            removeField(doc, '__v')
            return "Carrito guardado con el id " + doc.id
        } catch(error) {
            return "Error al leer archivo" + error;
        }
    }

    async deleteById(id) {
        try {
            this.main();
            const { n, nDeleted } = await this.coleccion.deleteOne({ '_id': id })
            if (n == 0 || nDeleted == 0) {
                return 'Error al borrar: no encontrado'
            } else {
                return `Carrito eliminado con id: ${id}`
            }
        } catch (error) {
            return `Error al borrar: ${error}`
        }
    }

    async getProductsById(id) {
        try {
            this.main();
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 })
            if (docs.length == 0) {
               return 'Error al listar por id: no encontrado'
            } else {
                const result = renameField(parseJSON(docs[0]), '_id', 'id')
                return result.productos
            }
        } catch (error) {
            return `Error al listar por id: ${error}`
        }
    }

    async addProductsById(id, product) {
        try {
            this.main();
            let newArray = [];
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 })
            const Producto = await collProducto.find({ '_id': product.id_prod }, { __v: 0 })
            let newPr = {
                code: Producto[0].code,
                title: Producto[0].title,
                description: Producto[0].description,
                price: Producto[0].price,
                stock: Producto[0].stock,
                thumbnail: Producto[0].thumbnail,
                timestamp: Producto[0].timestamp,
                id: Producto[0]._id
            }
            newArray = docs[0].productos;
            newArray.push(newPr);
            const { n, nModified } = await this.coleccion.replaceOne({ '_id': id }, {'productos': newArray})
            if (n == 0 || nModified == 0) {
                return 'Error al actualizar: no encontrado';
            } else {
                renameField(product, '_id', 'id')
                removeField(product, '__v')
                return `Carrito editado con id: ${id}`
            }
        } catch {
            return "Error al ejecutar acción";
        }
    }

    async deleteProductById(id, id_prod) {
        try {
            this.main();
            let newArray = [];
            const docs = await this.coleccion.find({ '_id': id }, { __v: 0 })
            newArray = docs[0].productos;
            let index = newArray.find(obj => obj.id == id_prod);
            newArray.splice(index, 1);;
            console.log("nuevo array", newArray);
            const { n, nModified } = await this.coleccion.replaceOne({ '_id': id }, {'productos': newArray})
            if (n == 0 || nModified == 0) {
                return 'Error al actualizar: no encontrado';
            } else {
                renameField(product, '_id', 'id')
                removeField(product, '__v')
                return `Carrito editado con id: ${id}`
            }
        } catch {
            return "Error al ejecutar acción";
        }
    }

}

module.exports = Contenedor;