const multer=require('multer');
const blog=require('../model/blog');
const express=require('express');
const router=express.Router();
const user=require('../model/user');
const comment=require('../model/comment');
const mongoose=require('mongoose');


const storage=multer.diskStorage({
  destination:function(req,file,cb){
      cb(null,'./public/images/uploads');
  },
  filename:function(req,file,cb){
      cb(null,`${Date.now()}-${file.originalname}`);
  }
});

const upload=multer({storage:storage});

router.get('/add',(req,res)=>{
  res.render("add-blog.ejs",{user:req.user});
});

router.get('/all',async(req,res)=>{
    const blogs=await blog.find({});
    res.render("allBlogs.ejs",{blogs:blogs});
});

router.get('/:id',async(req,res)=>{
  const data=await blog.findById(req.params.id).populate('createdBy');
  
  const comments=await comment.find({blogId:req.params.id}).populate('createdBy');
  
  return res.render('blog.ejs',{user:req.user,blog:data,comments});
});

router.post('/',upload.single('coverImage'),async(req,res)=>{
  if(!req.user)return res.status(401).json({msg:"not authenticated"});
   const {title,body}=req.body;
   const newBlog=await blog.create({
      title,
      body,
      coverImage:`/images/uploads/${req.file.filename}`,
      createdBy:req.user.id,
    });

   return res.redirect(`/blog/${newBlog._id}`);
});

router.post('/comment/:blogId',async(req,res)=>{
  if(!req.body.content)return res.json({msg:"content is required!"});
  const blogId =new mongoose.Types.ObjectId(req.params.blogId);
  // i should sign in before commenting
  const new_comment=await comment.create({
    content:req.body.content,
    createdBy:req.user.id,  
    blogId:req.params.blogId,
  });
  return res.redirect(`/blog/${req.params.blogId}`);

});








module.exports=router;