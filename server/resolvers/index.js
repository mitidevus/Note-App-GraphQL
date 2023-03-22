// Resolvers là các hàm thực thi các truy vấn đến các field trong schema
// Mỗi resolver trong GraphQL có 2 tham số: parent (parent là kết quả trả về của resolver trước đó) và args (args truyền từ client)
import fakeData from "../fakeData/index.js";
import { AuthorModel, FolderModel } from "../models/index.js";

export const resolvers = {
    Query: {
        // Truy vấn đến field folders của Query trong schema
        folders: async (parent, args, context) => {
            const folders = await FolderModel.find({
                authorId: context.uid,
            }).sort({updatedAt: 'desc'});
            console.log({ context });
            return folders;
        },
        // Truy vấn đến field folder của Query trong schema
        folder: async (parent, args) => {
            const folderId = args.folderId; // Dùng args để lấy giá trị của tham số folderId truyền từ client
            console.log({ folderId });
            const foundFolder = await FolderModel.findOne({
                _id: folderId,
            });
            return foundFolder; // Là parent của resolver Folder
        },
        // Truy vấn đến field note của Query trong schema
        note: (parent, args) => {
            const noteId = args.noteId;
            console.log({ noteId });
            return fakeData.notes.find((note) => note.id === noteId);
        },
    },
    Folder: {
        // Truy vấn đến field author của Folder trong schema
        author: async (parent, args) => {
            const authorId = parent.authorId; // Dùng parent để lấy giá trị của field authorId của Folder
            const author = await AuthorModel.findOne({ uid: authorId });
            return author;
        },
        // Truy vấn đến field notes của Folder trong schema
        notes: (parent, args) => {
            const folderId = parent.id;
            return fakeData.notes.filter((note) => note.folderId === folderId);
        },
    },
    // Mutation là các thao tác thêm, sửa, xóa
    Mutation: {
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({ ...args, authorId: context.uid });
            await newFolder.save();
            return newFolder;
        },
        register: async (parent, args) => {
            const foundUser = await AuthorModel.findOne({ uid: args.uid });

            if (!foundUser) {
                const newUser = new AuthorModel(args);
                await newUser.save();
                return newUser;
            }

            return foundUser;
        },
    },
};
