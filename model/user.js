const mongoose=require('mongoose');
const crypto=require('crypto');

const userSchema=new mongoose.Schema({
    fullName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    salt:{type:String},
    profileImageUrl:{type:String,default:"/images/blank-profile-picture-973460_640.png"},
    role:{type:String,enum:["USER","ADMIN"],default:"USER"}
});

userSchema.pre('save',function(next){
    if(!this.isModified('password'))return next();
    const salt=crypto.randomBytes(16).toString('hex');
    const hash=crypto.createHash('sha256');
    hash.update(this.password+salt);
    this.salt=salt;
    this.password=hash.digest('hex');
    next();
});

const user=mongoose.model("user",userSchema);

module.exports=user;