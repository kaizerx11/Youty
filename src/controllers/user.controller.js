import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findOne({ _id: userId })

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token")
    }
}

//user registration

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullname, email, password } = req.body
    console.log(username, fullname, email, password)

    if ([username, fullname, email, password].some((field) =>
        field?.trim() === "")) {
        throw new ApiError(400, "all fields are required")
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "user already exists with same email or username")
    }

    //files 

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }



    //avatar validation

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required")
    }

    //uploading coverImage and avatar on cloudinary....

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "avatar is required")
    }

    //user details on db

    const user = await User.create({
        fullname,
        username: username.toLowerCase(),
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        password

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "something went wrong while creating the user..")
    }


    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )

})

//user authentication 

const loginUser = asyncHandler(async (req, res) => {
    //req -->data
    //email or usernname
    //find the user
    //check the password
    //access and refresh token 
    // token send via cookies



    const { username, email, password } = req.body



    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "user did not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid user credentials")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //this option enables that the cookie can only be modified by server not by frontend 

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggedInUser, refreshToken, accessToken
                },
                "user logged in successfully"

            )
        )


})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.body._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true //will return the updated user ..
        }

    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(200, {}, "user logged out successfully..")
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }

        if (incomingRefreshToken != user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { newRefreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "access token refreshed"
                )
            )
    }
    catch (error) {
        throw new ApiError(401, error?.message || "invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;


    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "incorrect password ");
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password is successfully changed")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(200, req.user, "current user fetched successful")
})


const updateAccountDetails = asyncHandler(async (req, res) => {

    const { fullname, email } = req.body;

    if (!fullname || !email) {
        throw new ApiError(400, "all fields are required...")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                fullname,
                email
            }
        },
        { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "user details updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {

    const avatarLocalPath = req.file?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar file is missing..")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if (!avatar.url) {
        throw new ApiError(400, "error while uploading avatar on cloudinary")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        }, { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "avatar updated successfully..")
        )

})

const updateCoverImage = asyncHandler(async (req, res) => {

    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "cover image file is missing..")
    }

    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "error while uploading cover image")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        }, { new: true }
    ).select("-password")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "cover image updated successfully")
        )

})

export { registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar ,updateCoverImage}