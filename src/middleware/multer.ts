// middleware/multer.ts
import multer from 'multer';

// Cấu hình lưu trữ file trong bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage });

export { upload };
