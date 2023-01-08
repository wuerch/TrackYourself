const jwt = require("jsonwebtoken");

function verifyToken(req, res){
    const token = req.cookies['x-auth-cookie'];
    var userData;
    if (token == null){
        return res.json({status: 401})
    }
    jwt.verify(token , `${process.env.JWT_KEY}`, async (err, user) => {

        if(err){
        return res.json({status: 403})
        }
        //console.log(user)
        userData = user
    })
    return userData
}

module.exports = {verifyToken}