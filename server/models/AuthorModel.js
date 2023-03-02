import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const AuthorModel = mongoose.model("Author", authorSchema);
export default AuthorModel;

// timestamps: true sẽ tự động thêm 2 field createdAt và updatedAt vào schema
