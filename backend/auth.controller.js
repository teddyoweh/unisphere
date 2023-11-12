const bcrypt = require("bcrypt");
const User = require("./user.model");
const jwt = require("jsonwebtoken");
const config = require("./config");
async function logincontroller(req,res){
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(400).json({
            message: "Email or password missing"
        })
    }
    try{
        const user = await User.findOne({email:email});
        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Incorrect password"
            })
        }
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload,config.jwtSecret,{
            expiresIn: 3600
        },(err,token)=>{
            if(err) throw err;
            res.json({token,user:user});
        })
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            message: "Server error"
        })
    }
}
async function registercontroller(req,res){
    const {firstname,lastname,username,email,password} = req.body;
    if(!firstname || !lastname || !username || !email || !password){
        return res.status(400).json({
            message: "All fields are required"
        })
    }
    try{
        let user = await User.findOne({email:email});
        if(user){
            return res.status(400).json({
                message: "User already exists"
            })
        }
        user = new User({
            firstname,
            lastname,
            username,
            email,
            password
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);
        await user.save();
        const payload = {
            user:{
                id: user.id
            }
        }
        jwt.sign(payload,config.jwtSecret,{
            expiresIn: 3600
        },(err,token)=>{
            if(err) throw err;
            res.json({token,user:user});
        })
    }catch(err){
        console.log(err.message);
        res.status(500).json({
            message: "Server error"
        })
    }
}

module.exports ={ logincontroller,registercontroller}