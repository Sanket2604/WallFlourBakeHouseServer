import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    role: { type: String, default: "customer" },
    dp: { type: String, default: ""},
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    countryCode: { type: Number, required: true },
    phoneNumber: { type: Number, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    billingAddress: {
        address: { type: String, required: true },
        landmark: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        state: { type: String, required: true },
    },
    shippingAddress: [
        {   
            name: {type: String, required: true },
            countryCode: {type: Number, default: 91},
            phoneNumber: {type: Number, required: true},
            address: { type: String , required: true },
            landmark: { type: String , required: true},
            city: { type: String , required: true},
            pincode: { type: String , required: true},
            state: { type: String, required: true}
        }
    ],
    lastActive: { type: String, default: '' },
    preference: [],
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    comments: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' } ]
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;