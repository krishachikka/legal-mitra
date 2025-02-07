import mongoose from 'mongoose';

// Define the schema for each question-answer pair
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
    _id: false,  // Disable creating an _id for each embedded question-answer document
});

// Define the schema for the main document (Hiring a new worker)
const hiringWorkerSchema = new mongoose.Schema({
    Title: {
        type: String,
        required: true,
    },
    documents: [qaSchema],  // Array of question-answer objects
}, {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const WorkerLaw = mongoose.model('Worker_Law', hiringWorkerSchema);

export default WorkerLaw;
