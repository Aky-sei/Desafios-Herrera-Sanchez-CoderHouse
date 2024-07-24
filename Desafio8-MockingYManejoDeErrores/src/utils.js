import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import {faker} from '@faker-js/faker'

// Exportamos las funciones para trabajar con bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

// Exportamos el directorio
const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

// Configuración de Mocking
export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: JSON.stringify(faker.number.int(500)),
        price: faker.commerce.price(),
        status: true,
        stock: faker.number.int(1000),
        category: faker.commerce.productAdjective(),
        thumbnail: []
    }
}