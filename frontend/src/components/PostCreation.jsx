import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {Image, Loader} from "lucide-react"

const PostCreation = ({ user }) => {
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const queryClient = useQueryClient();

    const { mutate: createPostMutation, isPending} = useMutation({
        mutationFn: async (postData) => {
            const res = await axiosInstance.post('/posts/create', postData, {
                headers: { 'Content-Type': 'application/json' },
            });
            return res.data;
        },
        onSuccess: () => {
            toast.success('Post created successfully');
            queryClient.invalidateQueries(['posts']); // Refresh posts after new post
            resetForm();
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Failed to create post');
        },
    });

    const handlePostCreation = async() => {
        
        try {
            const postData = { content };
        if (image) {
            postData.image = await readFileAsDataURL(image);
        }
        createPostMutation(postData);
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    const resetForm = () => {
        setContent('');
        setImage(null);
        setImagePreview(null);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) {
            readFileAsDataURL(file).then(setImagePreview);
        } else {
            setImagePreview(null);
        }
    };

    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    return (
        <div className="bg-secondary rounded-lg shadow mb-4 p-4">
            <div className="flex space-x-3">
                <img src={user.profilePicture || '/avatar.png'} alt={user.name} className="size-12 rounded-full" />
                <textarea
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
                />
            </div>

            {imagePreview && (
                <div className="mt-4">
                    <img src={imagePreview} alt="Selected" className="w-full h-auto rounded-lg" />
                </div>
            )}

            <div className="flex justify-between mt-4 items-center">
                <div className="flex space-x-3">
                    <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
                        <Image size={20} className="mr-2" />
                        <span>Photo</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                </div>
                <button
                    onClick={handlePostCreation}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition duration-200"
                    disabled={isPending}
                >
                    {isPending ? <Loader className="size-5 animate-spin" /> :"Share"}
                </button>
            </div>
        </div>
    );
};

export default PostCreation;
