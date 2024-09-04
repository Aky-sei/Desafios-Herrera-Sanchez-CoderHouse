import usersService from "../dao/services/users.service.js"
import { __dirname } from '../utils.js'

async function changeUserRole(req,res) {
    try {
        const user = await usersService.getUserById(req.params.uid)
        if (!user) return res.sendUserError("No se encuentrs un usuario con ese ID")
        if (req.user.id != user._id) return res.sendUserError("No se puede alterar el estado de otro usuario")
        if (req.user.role === "USER") {
            if (user.documents.length < 3) return res.sendUserError("Para poder subir de rol, debe enviar los archivos necesarios")
            const logedUser = await usersService.putUserById(req.params.uid, {
                ...user,
                role: "PREMIUM"
            })
            return res.sendSuccess(logedUser)
        }
        const logedUser = await usersService.putUserById(req.params.uid, {
            ...user,
            role: "USER"
        })
        return res.sendSuccess(logedUser)
    } catch (error) {
        res.sendServerError("Error al cambiar el rol del usuario", error)
    }
}

async function uploadFileToUser(req,res) {
    try {
        console.log(req.body)
        if(!req.files) return res.sendUserError("Error al subir el archivo")
        let user = await usersService.getUserById(req.params.uid)
        if(!user) return res.sendUserError("No hay ningun usuario con ese ID")
        req.files.forEach(doc => {
            user.documents.push({
                name: doc.originalname,
                reference: __dirname+`/public/docs/`+req.params.uid+"--"+doc.originalname
            })
        })
        let newUser = await usersService.putUserById(req.params.uid, user)
        res.sendSuccess(newUser)
    } catch (error) {
        res.sendServerError("Error al subir el archivo", error)
    }
}

export default {
    changeUserRole,
    uploadFileToUser
}