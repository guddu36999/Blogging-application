const {verifyToken}=require('../services/authentication');

function checkForAuthenticationCookie(cookieName){
   return (req,res,next)=>{
      const token=req.cookies[cookieName];
      if(!token)return next();
      try{
         const payload=verifyToken(token);
         req.user=payload;
      }
      catch(err){}
      next();
   };
};

module.exports={
    checkForAuthenticationCookie
}