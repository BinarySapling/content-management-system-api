import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/")
    },
    filename: (req,file,cb)=>{
        const uniqueName = Date.now()+ "-" + (Math.random()*1e9)

        cb(null,uniqueName + path.extname(file.originalname))
    }
})


const filefilter = (req,file,cb)=>{
    if(
        file.mime.startsWith("image/") || file.mimetype === "application/pdf"
    ){
        cb(null,true)
    }else{
        cb(new Error("Only image or PDFs allowed"),false)
    }
}


export const upload = multer({
    storage,
    filefilter,
    limits:{
        fileSize:5*1024*1024
    }
})