import cloudinary from "cloudinary"
import express from 'express'
import multer from 'multer'
import fs from 'fs'
import { protect } from "../middlewares/authMiddleware.js"
const router = express.Router()



cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret
})
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
var upload = multer({ storage: storage })



async function uploadToCloudinary(locaFilePath) {


    var mainFolderName = "main"

    var filePathOnCloudinary = mainFolderName + "/" + locaFilePath

    return cloudinary.uploader.upload(locaFilePath, { "public_id": filePathOnCloudinary })
        .then((result) => {

            fs.unlinkSync(locaFilePath)

            return {
                message: "Success",
                url: result.url
            };
        }).catch((error) => {
            // Remove file from local uploads folder 
            fs.unlinkSync(locaFilePath)
            return { message: "Fail", };
        });
}


router.post('/upload',protect, upload.single('file'), async (req, res, next) => {
    var locaFilePath = req.file.path
    var result = await uploadToCloudinary(locaFilePath)
    res.json({
        url:result.url,
        public_id:result.public_id
    })
})

router.delete('/delete', protect, async (req, res) => {
  try {
    const publicId = req.body.publicId;

    // Delete the video by URL
    const result = await cloudinary.v2.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.status(200).json({ message: 'Video deleted successfully' });
    } else {
      res.status(400).json({ message: 'Failed to delete the video' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



export default router