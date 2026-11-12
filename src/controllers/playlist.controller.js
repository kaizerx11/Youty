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

const addVideoToPlaylist = asyncHandler((req,res)=>{
    //add video to playlist (how u gonna do it ??)
})

const removeVideoFromPlaylist = asyncHandler((req,res)=>{
    //remove video from playlist.
})

const deletePlaylist = asyncHandler((req , res)=>{
    //delete playlist from database ..
})

const updatePlaylist = asyncHandler((req, res)=>{
    //update playlist ..
})