import cloudinary from "../lib/cloudinary.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import dotenv from "dotenv";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";

dotenv.config();


export const getFeedPosts = async(req, res) =>{
    try {
        const post = await Post.find({author:{$in:[...req.user.connections, req.user._id]}})
        .populate("author","name username profilePicture headline")
        .populate("comments.user","name profilePicture")
        .sort( {createdAt: -1});

        res.status(200).json(post);
    }catch(error){
        console.error("Error in getFeedPosts controller: ",error);
        res.status(500).json("Internal server error")
    }
};

export const createPost = async(req, res) =>{
    try {
        const {content, image} = req.body;

        let newPost;

        if(image){
            const result = await cloudinary.uploader.upload(image);
            newPost = new Post({
                author:req.user._id,
                content,
                image:result.secure_url,
            });
        }else{
            newPost = new Post({
                author:req.user._id,
                content,
            });
        }

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller: ",error);
        res.status(500).json("Internal server error")
    }
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// check if the current user is the author of the post
		if (post.author.toString() !== userId.toString()) {
			return res.status(403).json({ message: "You are not authorized to delete this post" });
		}

		// delete the image from cloudinary as well!
		if (post.image) {
			await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
		}

		await Post.findByIdAndDelete(postId);

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in delete post controller", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

export const getPostById = async(req, res) =>{
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        .populate("author","name username profilePicture headline")
        .populate("comments.user","name profilePicture username headline")

        res.status(200).json(post);
    } catch (error) {
        console.error("Error in getting post by id",error);
        res.status(500).json("Internal server error");
    }       
    
};

export const createComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const { content } = req.body;
        const userId = req.user._id;

        const post = await Post.findByIdAndUpdate(
            postId,
            {
                $push: { comments: { user: userId, content } },
            },
            { new: true }
        ).populate("author", "name email username profilePicture headline");

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Create a notification if the comment owner is not the post owner
        if (post.author._id.toString() !== userId.toString()) {
            const newNotification = new Notification({
                recipient: post.author,
                type: "comment",
                relatedUser: userId,
                relatedPost: postId,
            });

            await newNotification.save();

            // Send email notification
            try {
                const postUrl = `${process.env.CLIENT_URL}/post/${postId}`;
                await sendCommentNotificationEmail(
                    post.author.email,
                    post.author.name,
                    req.user.name,
                    postUrl,
                    content
                );
            } catch (error) {
                console.error("Error in sending comment notification email:", error);
            }
        }

        res.status(201).json(post);
    } catch (error) {
        console.error("Error in creating comment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const likePost = async(req, res) =>{
    try {
        const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if(post.likes.includes(userId)){
        //unlike
        post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    }else{
        //like
        post.likes.push(userId);
        if(post.author.toString() !== userId.toString()){
            const newNotification = new Notification({
                recipient:post.author,
                type:"like",
                relatedUser:userId,
                relatedPost:postId,
            });
            await newNotification.save();
        }
    }

    await post.save();
    res.status(200).json(post);
    } catch (error) {
        console.error("Error in likePost controller",error);
        res.status(500).json("Internal server error")
    }
};