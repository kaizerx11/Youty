import mongoose , { isValidObjectId} from "mongoose"
import {Video} from "../models/video.model"
import {User} from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { uploadOnCloudinary } from "../utils/cloudinary"

const getAllVideos = asyncHandler(async(req , res)=>{
    //get all videos based on querry , sort and pagination
})