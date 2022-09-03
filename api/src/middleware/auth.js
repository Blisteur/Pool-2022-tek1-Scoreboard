const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

async function verifyAuth(req, res, next)
{
    let token = req.headers.authorization;
    if (token)
        token = token.split(' ')[1];

    if (token === undefined)
        return (res.status(403).json({ "msg": "No token, authorization denied" }));

    //verify token
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return (res.status(403).json({ "msg": "Token is not valid" }));
        else
            next();
    });
}

module.exports = {
    verifyAuth
}