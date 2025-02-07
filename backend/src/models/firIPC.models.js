import mongoose from 'mongoose';

const ipcSectionSchema = new mongoose.Schema({
    URL: {
        type: String,
        required: true,
    },
    Description: {
        type: String,
        required: true,
    },
    Offense: {
        type: String,
        required: true,
    },
    Punishment: {
        type: String,
        required: true,
    },
    Cognizable: {
        type: String,
        required: true,
    },
    Bailable: {
        type: String,
        required: true,
    },
    Court: {
        type: String,
        required: true,
    }
}, {
    timestamps: true, // Optional: adds createdAt and updatedAt fields
});

const firIPC = mongoose.model('Fir_IPC', ipcSectionSchema);

export default firIPC;
