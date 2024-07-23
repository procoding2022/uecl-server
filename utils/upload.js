import multer from 'multer';
import path from 'path';

// Define storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({ storage: storage });

export default upload;