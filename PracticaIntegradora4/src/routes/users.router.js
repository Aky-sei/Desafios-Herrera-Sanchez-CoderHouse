import CustomRouter from './router.js'
import usersController from '../controllers/users.controller.js'
import uploader from '../config/multer.config.js'

export default class UsersRouter extends CustomRouter{
    init() {
        this.post('/premium/:uid',["USER", "PREMIUM"], usersController.changeUserRole)

        this.post('/:uid/documents',["USER", "PREMIUM", "ADMIN"], uploader.array('file'), usersController.uploadFileToUser)
    }
}