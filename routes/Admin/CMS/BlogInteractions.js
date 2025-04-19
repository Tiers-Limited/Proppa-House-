const express = require("express");
const Controller = require("../../../controllers/Admin/CMS/BlogInteractions");

const router = express.Router();

router.put("/like/:id", Controller.toggleLike);
router.post("/comment/:id", Controller.postComment);
router.delete("/deleteComment/:blogId/:commentId", Controller.deleteComment);
router.put("/flagComment/:blogId/:commentId", Controller.flagComment);

module.exports = router;
