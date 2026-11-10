import mongoose, {isValidObjectId} from "mongoose";
import {Playlist} from "../models/playlist.model"
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";

const createPlaylist = asyncHandler((req , res)=>{
    //create playlist..
})

const getUserPlaylists = asyncHandler((req, res)=>{
    //get user playlist using userid from req.params
})

const getPlaylistById = asyncHandler((req ,res)=>{
    //get playlist by playlist id
})