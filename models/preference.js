import mongoose from 'mongoose';

const preferenceSchema = mongoose.Schema({
    preferenceName: { type: String, required: true },
    image: { type: String, required: true }
},{
    timestamps: true,
})

const Preference = mongoose.model("Preference", preferenceSchema);

export default Preference;