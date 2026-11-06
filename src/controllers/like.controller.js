import mongoose from "mongoose";
import {Like} from "../models/like.model"
import {ApiError} from "../utils/ApiError"
import {ApiResponse} from "../utils/ApiResponse"
import {asyncHandler} from "../utils/asyncHandler"

const toggleVideoLike = asyncHandler((req , res)=>{
    const {videoId} = req.params;
    //toggle like on video
})

const toggleCommentLike = asyncHandler((req , res)=>{
    const {commentId} = req.params;
    //toggle comment like..
})