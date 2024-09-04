import supertest from 'supertest'
import * as chai from "chai"
import {faker} from '@faker-js/faker'

const expect = chai.expect
const requester =  supertest('http://localhost:8080/api')

describe('Test de Sessions', () => {
    let cookie = {}
    describe('Test de Register', () => {
        it('El endpoint debe crear correctamente al usuario en la base de datos', async () => {
            const userMock = {
                fullName: faker.person.fullName(),
                email: faker.internet.email(),
                age: faker.number.int(18,80),
                // Para propositos del test, la contraseña y el role son predefinidos
                password: "123",
                role: "USER"
            }
            const {
                statusCode,
                ok,
                _body
            } = await requester.post('/sessions/register').send(userMock)
            expect(_body.payload).to.have.property('_id')
        })
    })
    describe('Test de Login', () => {
        it('El endpoint debe devolver una cookie al logear al usuario', async () => {
            const userMock = {
                // Usuario definido apra asegurar que exista
                email: 'degozix@gmail.com',
                password: '1234'
            }
            const result = await requester.post('/sessions/login').send(userMock)
            const cookieResult = result.headers['set-cookie'][0]
            expect(cookieResult).to.be.ok
            cookie = {
                name: cookieResult.split('=')[0],
                value: cookieResult.split('=')[1]
            }
            expect(cookie.name).to.be.ok.and.eql('coderCookieToken')
            expect(cookie.value).to.be.ok
        })
    })
    describe('Test de Current', () => {
        it('El endpoint devulve los datos del usuario al recibir un token', async () => {
            const {_body} = await requester.get('/sessions/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
            expect(_body.payload.email).to.be.eql('degozix@gmail.com')
        })
    })
})