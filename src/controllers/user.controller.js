import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler(async(req,res)=>{
const {username , fullname , email , password} = req.body
console.log(username, fullname, email , password)

if([username,fullname,email,password].some((field)=>
    field?.trim() ==="")){
        throw new ApiError(400,"all fields are required")
    }
const existedUser = await User.findOne({
    $or:[{username},{email}]
})

if(existedUser){
    throw new ApiError(409,"user already exists with same email or username")
}

//files 

const avatarLocalPath = req.files?.avatar[0]?.path;
//const coverImageLocalPath = req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
    coverImageLocalPath = req.files.coverImage[0].path
}



//avatar validation

if(!avatarLocalPath){
    throw new ApiError(400,"avatar is required")
}

//uploading coverImage and avatar on cloudinary....

const avatar = await uploadOnCloudinary(avatarLocalPath);
const coverImage =  await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new ApiError(400,"avatar is required")
}

//user details on db

 const user = await User.create({
fullname,
username : username.toLowerCase(),
email,
avatar : avatar.url,
coverImage : coverImage?.url || "",
password

})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if(!createdUser){
    throw new ApiError(500,"something went wrong while creating the user..")
}


return res.status(201).json(
    new ApiResponse(200,createdUser,"user registered successfully")
)

})


export {registerUser}