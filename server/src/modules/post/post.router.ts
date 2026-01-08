import express, { Router } from "express";
import { PostControler } from "./post.controller";
import authMiddleware, { UserRole } from "../../middleware/authMiddleware";

const router = express.Router();

router.post(
    "/",
    authMiddleware(UserRole.USER),
    PostControler.createPost
)

export const postRouter: Router = router