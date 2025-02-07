import mongoose from 'mongoose';

const qaSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const QuesAndAnswer = mongoose.model('Ques_and_Answer', qaSchema);

export default QuesAndAnswer;
