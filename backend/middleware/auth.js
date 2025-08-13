const jwt = require("jsonwebtoken");
require("dotenv").config()

module.exports = (req, res, next) => {
	const { authorization } = req.headers;
	if(!authorization || !authorization.startsWith("Bearer ")){
		return res.status(401).json({error: "Token não fornecido"});
	}
	const token = authorization.replace("Bearer ","");
	try{
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		next();
	}catch(err){
		return res.status(401).json({error:"Token inválido"})
	}
}