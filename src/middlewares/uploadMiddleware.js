const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const {v4: uuidv4} = require('uuid');

//dynamic destination
const storage = (destination) => {
    return multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, destination);
        },
        filename: (req, file, callback) => {
            callback(null, uuidv4()+ path.extname(file.originalname).split('.')[1] + path.extname(file.originalname))
        },
        
    });
}

const upload = multer({
    storage: storage('./public/customers'),
    limits: {
        fileSize: 1024 * 1024 * 5 //5MB
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    }
});

const stores = multer({
    storage: storage('./public/stores'),
    limits: {
        fileSize: 1024 * 1024 * 5 //5MB
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
    }
});

const reviews = multer({
    storage: storage('./public/reviews'),
    limits: {
        fileSize: 1024 * 1024 * 2 //2MB
    },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'));
        }
        callback(null, true);
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

//multiple field upload
const multipleFieldUpload = (req, res, next) => {
    const uploadMultiple = upload.fields([{name: 'ktp', maxCount: 1}, {name: 'logo', maxCount: 1}, {name: 'cover', maxCount: 1}]);
    uploadMultiple(req, res, (err) => {
        if(err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
}

const backgroundUpload = (req, res, next) => {
    const uploadSingle = stores.single('background');
    uploadSingle(req, res, (err) => {
        if(err) {
            return res.status(400).json({
                message: err.message
            });
        }
        next();
    });
}

const reviewUpload = (req, res, next) => {
    const uploadSingle = reviews.single('image');
    uploadSingle(req, res, (err) => {
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
    multipleUpload,
    multipleFieldUpload,
    backgroundUpload,
    reviewUpload
}
