import mongoose, {isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.model"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist = asyncHandler((req , res)=>{
    //create playlist..
})

const getUserPlaylist = asyncHandler((req, res)=>{
    //get user playlist using userid from req.params
})