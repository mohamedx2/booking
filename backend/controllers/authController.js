const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Etablissement = require('../models/Etablissement');
const eval = require('../models/eval');

const path =require ("path");
const {cloudinaryRemoveImage,cloudinaryUploadImage}=require("../utils/cloudinary")
const fs=require('fs');




const register = async (req, res) => {
  

  const { nom, prenom, date_de_naissance,gender,phone,email, mot_passe, role } = req.body;
  console.log('Received data:', req.body); // Log the received data

  try {
      // Check if user already exists
      let user1 = await User.findOne({ email: req.body.email });
      if (user1) {
        return res.status(400).json({ message: 'User already exists' });
      }  
    const user = new User({ nom, prenom, email,date_de_naissance, mot_passe, role,gender,phone });
    console.log('New user object:', user); // Log the user object before saving
    await user.save();
    const _id=user._id
    const token = jwt.sign({ id: user._id, date_de_naissance:user.date_de_naissance,role: user.role,gender:user.gender,phone:user.phone }, process.env.JWT_SECRET);
    res.status(201).json({ token ,_id});
    
  } catch (error) {
    console.error('Registration error:', error); // Log any errors that occur during registration
    res.status(500).json({ error: error.message });
  }
};



const login = async (req, res) => {
  const { email, mot_passe } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(mot_passe))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    const _id=user._id
    res.status(200).json({ token , _id});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};








const getUserProfileCtrl=async (req,res)=>{
  const user = await User.findById(req.params.id).select("-password");
  if (!user){
    return res.status(404).json({message : "user not found"});
  }
  
  res.status(200).json(user)
}



const getUserAllUser=async (req,res)=>{
  try{
  if(req.user.role=="admin"){
  const users = await User.find().select("-password");
  
  res.status(200).json(users)}
  else{
    res.status(403).json({message : "you are not authorized to access this route"})
}  }
catch(error){
  res.status(500).json({error : error.message})
}





}
const getUserAllUserNonValidate=async (req,res)=>{
  try{
  if(req.user.role=="admin"){
  const users = await User.find({verife:false}).select("-password");
  
  res.status(200).json(users)}
  else{
    res.status(403).json({message : "you are not authorized to access this route"})
}  }
catch(error){
  res.status(500).json({error : error.message})
}


}









const profilePhotoUploadCtrl=async (req,res)=>{
  
  //1.validation
  if (!req.file){
    return res.status(400).json({message : "no file provided "});
  }
  
  //2.GET the path to image 
  const imagePath = path.join(__dirname,`../images/${req.file.filename}`);

  //3.upload to cloudinary 
  const result=await cloudinaryUploadImage(imagePath);
  console.log(result);

  //4.Get the user from DB
  const user = await User.findById(req.user.id);

  //5. delete the old photo if exist 
  if (user.profilePhoto.publicId !==null){
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  //6.change the photo field in db
  user.profilePhoto={
    url:  result.secure_url,
    publicId: result.public_id,
  }
  await user.save();

  //7.send response to client 
  res.status(200).json({
    message : "your photo uploaded successfully ",
    profilePhoto:{ 
      url: result.secure_url,
      publicId : result.public_id 
  }})
  

  //8.Remove image from the images  server 
  fs.unlinkSync(imagePath)


};






















const updateUser = async (req, res) => {
  const userId = req.user.id;
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Find and delete all establishments owned by the user
    const establishments = await Etablissement.deleteMany({ idProp: user._id });
    const Eval = await eval.deleteMany({ idClient: user._id });
    
    res.status(200).json({ message: 'User and all associated establishments deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const ValidateUser = async (req, res) => {
  const userId = req.params.id;
  const isAdmin=req.user.role
  
  try {
    if(isAdmin=="admin"){
    const user = await User.findByIdAndUpdate(userId, {verife:req.body.verife}, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  }
else{
  return res.status(404).json({message:"only admin valide le compte"})
}

} catch (error) {
    res.status(500).json({ error: error.message });
  }
};







const getUsersCountCtrl = async (req, res) => {
  try {
    // Count the total number of User documents
    const userCount = await User.countDocuments();
    
    // Send the count as a JSON response
    res.status(200).json(userCount);
  } catch (error) {
    // Handle potential errors
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      console.error('Error after headers sent:', error);
    }
  }
};







const getUsersCountCtrlAdmin = async (req, res) => {
  try {
    // Count documents where role is 'admin'
    const adminUserCount = await User.countDocuments({ role: 'admin' });
    
    // Send the count as a JSON response
    res.status(200).json(adminUserCount);
  } catch (error) {
    // Handle potential errors
    if (!res.headersSent) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      console.error('Error after headers sent:', error);
    }
  }
};





module.exports = {ValidateUser,getUserAllUserNonValidate,getUserAllUser,getUsersCountCtrl,getUsersCountCtrlAdmin, register, login, updateUser, profilePhotoUploadCtrl,getUserProfileCtrl,deleteUser };
