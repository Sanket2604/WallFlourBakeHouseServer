import jwt from 'jsonwebtoken';
import User from '../models/user.js'

export const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        let decodedData = jwt.verify(token, 'AWorldFullOfLove')

        req.userId = decodedData?.id;

        next();
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: 'Authentication Failed'})
    }
}

export const admin_auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];

        let decodedData = jwt.verify(token, 'AWorldFullOfLove')

        req.userId = decodedData?.id;

        const userId = decodedData?.id

        const user = await User.findOne({ '_id': userId });

        if(user.role!=="admin") return res.status(400).json({ message: "Access Denied" })

        next();
    } catch (error) {
        console.log(error)
    }
}


