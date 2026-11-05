import mongoose ,{isValidObjectId} from "mongoose";
import {Tweet} from "../models/tweet.model"
import {User} from "../models/user.model"
import {ApiError} from "../utils/ApiError"
import {ApiResonse} from "../utils/ApiResponse"
import {asyncHandler} from "../utils/asyncHandler"

const createTweet = asyncHandler((req,res)=>{
    //create tweet
})

const getUserTweet = asyncHandler((req,res)=>{
    //get tweet and send to frontend
})

const updateUserTweet = asyncHandler((req,res)=>{
    //find user by req.user and update 
})

const deleteTweet = asyncHandler((req,res)=>{
    //delete the particular tweet from database..
})

export{createTweet,getUserTweet,updateUserTweet,deleteTweet}
