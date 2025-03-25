const user=require('../model/user');
const crypto=require('crypto');
const {Router}=require('express');
const router=Router();
const {createToken}=require('../services/authentication');

router.get('/signin',(req,res)=>{
    return res.render("signin.ejs");
});

router.get('/signup',(req,res)=>{
    return res.render("signup.ejs");
});

router.post('/signup',async(req,res)=>{
    const {fullName,email,password}=req.body;
    await user.create({
         fullName,
         email,
         password,
    });
    return res.redirect('/user/signin');
});

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body;
    const  USER=await user.findOne({email});
    if(!USER)return res.redirect('/user/signup');
    const hash=crypto.createHash('sha256');
    hash.update(password+USER.salt);
    const hashedpassword=hash.digest('hex');
    if(USER.password===hashedpassword){
        const token=createToken(USER);
        return res.cookie("token",token).redirect('/');
    }
    else return res.render("signin.ejs",{msg:"either email or password is incorrect!"});
});

router.get('/logout',(req,res)=>{
    res.clearCookie("token").redirect('/user/signin');
});


module.exports=router;