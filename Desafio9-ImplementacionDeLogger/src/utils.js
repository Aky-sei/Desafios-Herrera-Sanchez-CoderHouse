import { fileURLToPath } from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import {faker} from '@faker-js/faker'
import winston from 'winston'

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

// Configuración del Logger
const customLevelOptions = {
    levels: {
        debug: 5,
        http: 4,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0
    },
    colors: {
        debug: 'white',
        http: 'green',
        info: 'blue',
        warning: 'yellow',
        error: 'magenta',
        fatal: 'red'
    }
}

const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.printf((info) => {
            const log = `${info.level}: ${info.message}`;
            return info.stack
            ? `${log}\n${info.stack}
             `
            : log;
        })
    ),
    transports: [
        new winston.transports.Console({
            level:"debug",
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:"error",
            format: winston.format.simple()
        })
    ]
})

const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.printf((info) => {
            const log = `${info.level}: ${info.message}`;
            return info.stack
            ? `${log}\n${info.stack}
             `
            : log;
        })
    ),
    transports: [
        new winston.transports.Console({
            level:"info",
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.colorize({ colors: customLevelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename:'./errors.log',
            level:"error",
            format: winston.format.simple()
        })
    ]
})

// Se crea la logica para poder cambiar de un lgger a otro con una variable de entorno o con un parametro en linea de comandos
// En este caso, sin embargo, se fuerza que se ejecute como su fuera un entorno de desarrollo
let logger 
const enviroment = 'development'
switch (enviroment) {
    case 'development':
        logger = developmentLogger
        break;
    case 'production':
        logger = productionLogger
        break;
}

export const loggerMiddleware = (req,res,next) => {
    req.logger = logger
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
} 

// Custom Responses 
export function generateCustomResponses(req,res,next) {
    res.sendSuccess = payload => res.json({status:"success",payload})
    res.sendServerError = (errorMessage,error) => {
        req.logger.error(error)
        res.status(500).json({status:"error",errorMessage})
    }
    res.sendUserError = errorMessage => {
        req.logger.info(errorMessage)
        res.status(400).json({status:"error",errorMessage})
    }
    next()
}
