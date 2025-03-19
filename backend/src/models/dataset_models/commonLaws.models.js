import mongoose from 'mongoose';

const commonLawsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

const CommonLaws = mongoose.model('Common_Laws_Info', commonLawsSchema);

export default CommonLaws;
