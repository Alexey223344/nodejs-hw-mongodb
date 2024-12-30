import multer from "multer";
import { TEMP_UPLOAD_DIR } from "../constants/constants.js";

const storageData = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const unique = Date.now();
    cb(null, `${unique}_${file.originalname}`);
  },
});

export const download = multer({ storageData });
