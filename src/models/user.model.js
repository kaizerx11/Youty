import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";

const userSchema = new Schema({
username :{
    type : String,
    required :true,
    lowercase: true,
    unique : true,
    trim : true,
    index : true // to make searching easy in the database we use index('_")
},
email :{
    type : String,
    required :true,
    lowercase: true,
    unique : true,
    trim : true,

},
fullname :{
    type : String,
    required :true,
    trim : true,
    index: true
},
avatar :{
    type : String, //cloudnary url use karenge...
    required : true
},
coverImage :{
    type: String,
},
watchHistory :[{
    type: Schema.Types.ObjectId,
    ref : "video"
}],
password : {
    type : String,
    required : [true,'password is required mah bradah...'],

},
refreshToken : {
    type : String
}

},{
    timestamps : true
}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
this.password = bcrypt.hash(this.password,10)
next()
})

export const User = mongoose.model("User",userSchema)