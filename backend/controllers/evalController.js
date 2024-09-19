const asyncHandler = require("express-async-handler");
const Eval = require("../models/eval");
const User = require("../models/User");

// Controller to add a new evaluation
const addEval = asyncHandler(async (req, res) => {
  const { idEtab, Comment } = req.body;
  const idClient = req.user.id; // Extracting idClient from req.user._id

  try {
    // Create a new evaluation object
    const evaluation = new Eval({ idClient, idEtab, Comment });
    

    // Save the evaluation to the database
    await evaluation.save();

    res.status(201).json(evaluation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Controller to get all evaluations
// Controller to get all evaluations
const getAllEvals = asyncHandler(async (req, res) => {
  try {
    // Retrieve all evaluations from the database
    const evaluations = await Eval.find();

    // Retrieve users for each evaluation
    const userPromises = evaluations.map(evaluation => User.findById(evaluation.idClient));
    const users = await Promise.all(userPromises);

    // Combine evaluations and users into a single response object
    const result = evaluations.map((evaluation, index) => ({
      evaluation,
      user: users[index]
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});







// Controller to get evaluations by establishment ID
const getEvalsByEtabId = asyncHandler(async (req, res) => {
  const { idEtab } = req.params;

  try {
    // Retrieve evaluations for the specified establishment ID
    const evaluations = await Eval.find({ idEtab });

    // Retrieve users for each evaluation
    const userPromises = evaluations.map(evaluation => User.findById(evaluation.idClient));
    const users = await Promise.all(userPromises);

    // Combine evaluations and users into a single response object
    const result = evaluations.map((evaluation, index) => ({
      evaluation,
      user: users[index]
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const deleteEvals = asyncHandler(async (req, res) => {
  const idEval = req.params.id;

  try {
    // Find and delete the evaluation by its ID
    const evaluation = await Eval.findByIdAndDelete(idEval);

    if (!evaluation) {
      return res.status(404).json({ message: 'Evaluation not found' });
    }

    res.status(200).json({ message: 'Evaluation deleted successfully', evaluation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = {
  addEval,
  getAllEvals,
  getEvalsByEtabId,deleteEvals
};
