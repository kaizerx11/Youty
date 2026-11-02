import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model"
import { User } from "../models/user.model"
import { ApiError } from "../utils/ApiError"
import { ApiResponse } from "../utils/ApiResponse"
import { asyncHandler } from "../utils/asyncHandler"
import { uploadOnCloudinary } from "../utils/cloudinary"

const getAllVideos = asyncHandler(async (req, res) => {
    //get all videos based on querry , sort and pagination
})

const publishVideo = asyncHandler(async (req, res) => {
    // get video , upload to cloudinary and create video
})

const getVideoById = asyncHandler((req, res) => {
    //get video by id
})

const updateVideo = asyncHandler((req, res) => {
    //update video details like title , description and thumbnail
})

const deleteVideo = asyncHandler((req, res) => {
    //delete video
})

const togglePublicStatus = asyncHandler((req, res) => {
    //take video id from params and use it to toggle public status
})

export { getAllVideos, getVideoById, publishVideo, updateVideo, deleteVideo, togglePublicStatus }