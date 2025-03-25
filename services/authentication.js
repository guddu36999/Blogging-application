const jwt=require('jsonwebtoken');
const secret="20aAA20$";

function createToken(user){
    const payload={
        id:user._id,
        email:user.email,
        fullName:user.fullName,
    };
    const token=jwt.sign(payload,secret);
    return token;
}


function verifyToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

module.exports={
    createToken,
    verifyToken
}