import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile_no: { type: String, required: true },
    email: { type: String, required: true },
    ratings: { type: Number, required: true },
    image: { type: String, required: true },
    cases_solved: {
        total_cases: { type: Number, required: true },
        top_cases: [
            {
                case_name: { type: String, required: true },
                rating: { type: Number, required: true }
            }
        ]
    },
    experience: { type: String, required: true },
    location: { type: String, required: true }
});

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

export default Lawyer;
