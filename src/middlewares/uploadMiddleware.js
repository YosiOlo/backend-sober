const multer = require('multer');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const storage_customer = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/customers');
    },
    filename: (req, file, callback) => {
        callback(null, uuidv4()+ path.extname(file.originalname).split('.')[1] + path.extname(file.originalname))
    }
});

const upload = multer({ 
    storage: storage_customer,
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    },
    limits: {
        fileSize: 1024 * 1024
    }
     });

const singleUpload = (req, res, next) => {
    const uploadSingle = upload.single('image');
    uploadSingle(req, res, (err) => {
        if(err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
}

const multipleUpload = (req, res, next) => {
    const uploadMultiple = upload.array('images', 10);
    uploadMultiple(req, res, (err) => {
        if(err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
}

module.exports = {
    singleUpload,
    multipleUpload
}
