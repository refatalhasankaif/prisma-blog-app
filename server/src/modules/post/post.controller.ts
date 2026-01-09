import { Request, Response } from "express";
import { PostService } from "./post.service";

const createPost = async (req: Request, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            return res.status(400).json({
                error: "Unauthorized!",
            })
        }
        const result = await PostService.createPost(req.body, user.id)
        res.status(201).json(result)
    } catch (err) {
        res.status(400).json({
            error: "Post creation failed",
            details: err
        })
    }
}

const getAllPost = async (req: Request, res: Response) => {
    try {
        const result = await PostService.getAllPost()
        res.status(200).json(result)

    } catch (err) {
        res.status(400).json({
            error: "Post creation failed",
            details: err
        })
    }
}

export const PostControler = {
    createPost,
    getAllPost
}