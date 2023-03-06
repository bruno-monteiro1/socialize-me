import { response, Response } from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";

interface ICreatePostRequest {
  body: {
    userId: string;
    description: string;
    picturePath: string;
  };
}

interface IGetUserPostsRequest {
  params: {
    userId: string;
  };
}

interface ILikePostRequest {
  params: {
    id: string;
  };
  body: {
    userId: string;
  };
}

/* CREATE */
export const createPost = async (req: ICreatePostRequest, res: Response) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      location: user?.location,
      description,
      userPicturePath: user?.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const posts = await Post.find();

    res.status(201).json(posts);
  } catch (e: any) {
    res.status(409).json({ message: e.message });
  }
};

/* READ */
export const getFeedPosts = async (_: any, res: Response) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};

export const getUserPosts = async (
  req: IGetUserPostsRequest,
  res: Response
) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ userId });
    res.status(200).json(posts);
  } catch (e: any) {
    res.status(404).json({ message: e.message });
  }
};

/* UPDATE */

export const likePost = async (req: ILikePostRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post?.likes?.get(userId);

    if (isLiked) {
      post?.likes?.delete(userId);
    } else {
      post?.likes?.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post?.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
};
