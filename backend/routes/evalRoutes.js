const express = require("express");
const router = express.Router();
const { addEval, getAllEvals,deleteEvals, getEvalsByEtabId } = require("../controllers/evalController");
const protect  = require("../middleware/auth");

// Route to add a new evaluation
router.post("/",protect, addEval);

// Route to get all evaluations
router.get("/", getAllEvals);
router.delete("/delete/:id", deleteEvals);

// Route to get evaluations by establishment ID
router.get("/:idEtab", getEvalsByEtabId);

module.exports = router;
