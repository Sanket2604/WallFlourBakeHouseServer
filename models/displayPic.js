import mongoose from 'mongoose';

const dpSchema = mongoose.Schema({
    dp: { type: String, required: true },
},{
    timestamps: true,
})

const DP = mongoose.model("DP", dpSchema);

export default DP;