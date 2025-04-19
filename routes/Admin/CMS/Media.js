const express = require("express");
const Controller = require("../../../controllers/Admin/CMS/Media");
const router = express.Router();
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/create/folder", Controller.createFolder);
router.put("/rename/folder/:folderId", Controller.renameFolder);
router.delete("/delete/folder/:folderId", Controller.deleteFolder);
router.put("/move/file/:fileId", Controller.moveFileToFolder);
router.post("/upload/file", upload.single("file"), Controller.uploadFile);

module.exports = router;
