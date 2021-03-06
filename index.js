import express from 'express';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/user.js'
import productRoutes from './routes/product.js'
import commentRoutes from './routes/comment.js'
import preferenceRoutes from './routes/preference.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'
import messageRoutes from './routes/messages.js'
import adminRoutes from './adminRoutes/home.js'

const app = express();

app.use(bodyparser.json({ limit: "100mb", extended: true }));
app.use(bodyparser.urlencoded({ limit: "100mb", extended: true }));

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://zen-rosalind-30f7a7.netlify.app', 'https://adoring-ride-5bf57d.netlify.app'],
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200
}));
app.options('*', cors())

const CONNECTION_URL = 'mongodb+srv://wallflourbakehouse:JINlamfQDoLCB6h3@cluster0.dfab7.mongodb.net/WallFlourBakeHouseDb?retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000;

app.use('/user', userRoutes)
app.use('/product', productRoutes)
app.use('/comment', commentRoutes)
app.use('/preference', preferenceRoutes)
app.use('/cart', cartRoutes)
app.use('/order', orderRoutes)
app.use('/message', messageRoutes)

app.use('/admin', adminRoutes)


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(()=>{
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch((error)=>{
        console.log(error.message);
    })