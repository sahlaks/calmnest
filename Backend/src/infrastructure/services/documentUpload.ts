import multer from 'multer';

const documentStorage = multer.memoryStorage();
const uploadDocument = multer({ 
    storage: documentStorage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'application/msword' || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Not a document! Please upload a PDF or Word file.'));
        }
    }
}).single('document'); 

export default uploadDocument;
