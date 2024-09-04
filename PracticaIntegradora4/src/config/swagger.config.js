import { __dirname } from "../utils.js"
import swaggerJsdoc from "swagger-jsdoc"

const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentación del ECommerce",
            description:"Documentación sobre la API del Ecommerce, proyecto para el curso de BackEnd de Coderhouse"
        }
    },
    apis:[`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsdoc(swaggerOptions)

export default specs