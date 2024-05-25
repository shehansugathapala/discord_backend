const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const postLogin = async(req,res) =>{

    try{
        const {mail,password,isAdmin} = req.body;

       const user = await User.findOne({ mail: mail.toLowerCase() });


        if(user && (await bcrypt.compare(password,user.password))){
              //send new token
              const token = jwt.sign({
                userId: user._id, 
                mail
               }, 
               process.env.TOKEN_KEY,{
                 expiresIn:"24h", 
               }
               );

             return res.status(200).json({
                userDetails:user.mail,
                token:token,
                username:user.username,
             
                isAdmin: user.isAdmin // Include isAdmin in the response

             },
             )};
            

        return res.status(400).send('Invalid credintials.please try again');
    }catch(err){
        return res.status(500).send('smething went wrong.please try again');
    }
    res.send("login route");
};
module.exports =postLogin;