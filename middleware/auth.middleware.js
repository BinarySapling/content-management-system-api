import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
    try{
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
        if(!token) {
            return res.status(401).json({
                success : false,
                message: 'Authentication token is required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // {id: user._id, email: user.email}
        next();
    }catch(err) {
        return res.status(401).json({
            success : false,
            message: 'Invalid or Expired Token'
        });
    }

};