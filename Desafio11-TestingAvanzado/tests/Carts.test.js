import supertest from 'supertest'
import * as chai from "chai"

const expect = chai.expect
const requester =  supertest('http://localhost:8080/api')

describe('Test de Carts', () => {
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
    // Definimos una variable para usar el mismo carrito a lo largo de todo el test
    let cartId = '66b59d1aadbe6855f562f143'
    describe('Test de Get Carts', () => {
        it('El endpoint devuelve un array con los carritos', async () => {
            const {_body} = await requester.get('/carts').set('Cookie', [cookie])
            expect(_body.payload).to.be.an('array')
        })
    })
    describe('Test de Post Cart', () => {
        it('El endpoint añade los productos enviados al carrito', async () => {
            // Se añade directamente la ID de un producto que se sabe, existe
            await requester.post(`/carts/${cartId}/products/66b57b9e3e686df5f5797ca1`).set('Cookie', [cookie])
            const {_body} = await requester.post(`/carts/${cartId}/products/66b57ba03e686df5f5797ca4`).set('Cookie', [cookie])
            expect(_body.payload[0]).to.have.property('_id')
            expect(_body.payload[1]).to.have.property('_id')
        })
    })
    describe('Test de Empty Cart', () => {
        it('El endpoint devuelve un array vacio', async () => {
            await requester.delete(`/carts/${cartId}`).set('Cookie', [cookie])
            const {_body} = await requester.get(`/carts/${cartId}`).set('Cookie', [cookie])
            expect(_body.payload.products).to.be.empty
        })
    })
})