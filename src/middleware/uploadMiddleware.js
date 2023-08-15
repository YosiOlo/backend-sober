const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'public/images');
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
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

module.exports.singleUpload = singleUpload;
module.exports.multipleUpload = multipleUpload;
