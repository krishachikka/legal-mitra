import mongoose from 'mongoose';

const unionArticlesSchema = new mongoose.Schema({
    Articles: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const IndianConstitution = mongoose.model('Indian_Constitution', unionArticlesSchema);

export default IndianConstitution;
