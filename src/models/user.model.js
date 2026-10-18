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
    if(!this.isModified("password")) return;

this.password =  await bcrypt.hash(this.password,10);
});

userSchema.methods.isPasswordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign({
        _id : this._id,
        username : this.username,
        fullname : this.fullname,
        email : this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn : process.env.ACCESS_TOKEN_EXPIRY
    }

)
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign({
        _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn : process.env.REFRESH_TOKEN_EXPIRY
    }
)
}

export const User = mongoose.model("User",userSchema)