import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({})

export const Tweet = mongoose.model("Tweet",tweetSchema)