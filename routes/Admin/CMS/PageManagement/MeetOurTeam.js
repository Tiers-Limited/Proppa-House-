const express = require("express");
const Controller = require("../../../../controllers/Admin/CMS/PageManagement/MeetOurTeam");

const router = express.Router();

router.post("/add/member", Controller.addTeamMember);
router.put("/update/member/:id", Controller.editTeamMember);
router.delete("/delete/member/:id", Controller.deleteTeamMember);
router.get("/get/team", Controller.getAllTeamMembers);

module.exports = router;
