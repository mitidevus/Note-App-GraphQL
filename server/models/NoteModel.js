import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
        },
        folderId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const NoteModel = mongoose.model("Note", noteSchema);
export default NoteModel;

// timestamps: true sẽ tự động thêm 2 field createdAt và updatedAt vào schema
