import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getSuggestConnections = async(req, res) =>{
    try {
        const getCurrentUser = await User.findById(req.user._id).select("connections");

        const suggestUser = await User.find({
            _id:{
                $ne:req.user._id,
                $nin:getCurrentUser.connections
            },
        })
        .select("name username profilePicture headline")
        .limit(3);

        res.json(suggestUser);

    } catch (error) {
        console.error("Error in getSuggestedConnection controller: ", error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const getPublicProfile = async(req, res) =>{
    try {
        const user = await User.findOne({username:req.params.username}).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        res.json(user);
    } catch (error) {
        console.error("Error in getPublicProfile controller: ",error);
        res.status(500).json({message:"Internal server error"});
    }
    
}

export const updateProfile = async(req, res) =>{
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ];

        const upadatedData = {};

        for(const field of allowedFields){
            if(req.body[field]){
                upadatedData[field] = req.body[field];
            }
        }

        

        if(req.body.propilePicture){
            const result = await cloudinary.uploader.upload(req.body.profilePicture);
            upadatedData.profilePicture = result.secure_url;
        }

        if(req.body.bannerImg){
            const result = await cloudinary.uploader.upload(req.body.bannerImg);
            upadatedData.bannerImg = result.secure_url;
        }
        
        
        const user = await User.findByIdAndUpdate(req.user._id, {$set:upadatedData}, {new:true}).select("-password");
        res.json(user);
    } catch (error) {
        console.error("Error in updating controller: ",error);
        res.status(500).json({message:"Internal server error"});
    }
    
}