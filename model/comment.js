const mongoose=require('mongoose');

const commentSchema=new mongoose.Schema({
    content:{type:String,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    blogId:{type:mongoose.Schema.Types.ObjectId,ref:'blog'},
});

const comment=mongoose.model('comment',commentSchema);

module.exports=comment;