const multer = require("multer");
// const {GridFsStorage} = require("multer-gridfs-storage");

// const { DATABASE_URI } = process.env

// const storage = new GridFsStorage({
//     url: DATABASE_URI,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//         const match = ["image/png", "image/jpeg"];

//         if (match.indexOf(file.mimetype) === -1) {
//             const filename = `${Date.now()}-any-name-${file.originalname}`;
//             return filename;
//         }

//         return {
//             bucketName: "photos",
//             filename: `${Date.now()}-any-name-${file.originalname}`,
//         };
//     },
// });

const storage = multer.memoryStorage();

module.exports = multer({ storage });
