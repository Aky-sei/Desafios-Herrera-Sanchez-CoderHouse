import supertest from 'supertest'
import * as chai from "chai"
import {faker} from '@faker-js/faker'

const expect = chai.expect
const requester =  supertest('http://localhost:8080/api')

describe('Test de Products', () => {
    let cookie
    // Previo a los test, logeamos a un usuario con el rol admin para poder realizar los test sin limitaciones
    before(async () => {
        const userMock = {
            email: 'degozix@gmail.com',
            password: '1234'
        }
        const result = await requester.post('/sessions/login').send(userMock)
        cookie = result.headers['set-cookie'][0]
    })
    describe('Test de Get', () => {
        it('El endpoint devuelve un array con los productos', async () => {
            // Para este test, se usa el endpoint /mockingproducts para asegurarnos de tener una respuesta significativa
            const {_body} = await requester.get('/products/mockingproducts').set('Cookie', [cookie])
            expect(_body.payload).to.be.an('array')
        })
    })
    // Definimos una variable para usar el mismo producto en ambos tests
    let productId
    describe('Test de Post', () => {
        it('El endpoint añade un produtco a la base de datos', async () => {
            const {_body} = await requester.post('/products').set('Cookie', [cookie]).send({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                code: JSON.stringify(faker.number.int(500)),
                price: faker.commerce.price(),
                status: true,
                stock: faker.number.int(1000),
                category: faker.commerce.productAdjective(),
                thumbnail: []
            })
            expect(_body.payload).to.have.property('_id')
            productId = _body.payload._id
        })
    })
    describe('Test de Delete', () => {
        it('El endpoint elimina el producto indicado', async () => {
            await requester.delete(`/products/${productId}`).set('Cookie', [cookie])
            const {_body} = await requester.get(`/products/${productId}`).set('Cookie', [cookie])
            expect(_body.payload).to.be.undefined
        })
    })
})