import mongoose from 'mongoose';

const caseJudgementSchema = new mongoose.Schema({
    diary_no: { type: String, required: true },
    Judgement_type: { type: String, required: true },
    case_no: { type: String, required: true },
    pet: { type: String, required: true },
    res: { type: String, required: true },
    pet_adv: { type: String, required: true },
    bench: { type: String, required: true },
    judgement_by: { type: String, required: true },
    judgment_dates: { type: Date, required: true },
    temp_link: { type: String, required: true },
});

const CaseJudgement = mongoose.model('Case_Judgement', caseJudgementSchema);

export default CaseJudgement;