require('dotenv').config();
const express=require('express');
const ejs=require('ejs');
const mongoose=require('mongoose');
const app=express();
const port =process.env.PORT || 3003;

app.set('view engine',ejs);
const blog=require('./model/blog');


async function ConnectDatabase(url){
    try{
       mongoose.connect(url);   
    }
    catch(err){
        console.log(err);
    }
}

ConnectDatabase(process.env.MONGO_URL);



//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const cookieparser=require('cookie-parser');
app.use(cookieparser());

//middlewares
const {checkForAuthenticationCookie}=require('./middlewares/authentication');
app.use(checkForAuthenticationCookie("token"));
app.use(express.static('public'));

//routes
const userRoutes=require('./routes/user');
app.use('/user',userRoutes);
const blogRoutes=require('./routes/blog');
app.use('/blog',blogRoutes);

app.get('/',async(req,res)=>{
    const allBlogs=await blog.find({}).sort({createdAt:-1});
    return res.render("home.ejs",{user:req.user,blogs:allBlogs});
});


app.listen(port,(error)=>{
    if(error)console.error(`SERVER ERROR:${error}`);
    else console.log(`server running successfully at port:${port}.`);
});