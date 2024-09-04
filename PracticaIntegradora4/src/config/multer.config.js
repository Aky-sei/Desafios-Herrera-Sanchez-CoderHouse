import multer from 'multer'
import { __dirname } from '../utils.js'

const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,__dirname+`/public/docs/`)
    },
    filename: function(req,file,cb){
        cb(null,req.params.uid+"--"+file.originalname)
    }
})

const uploader = multer({storage})

export default uploader