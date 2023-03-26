// Resolvers là các hàm thực thi các truy vấn đến các field trong schema
// Mỗi resolver trong GraphQL có 2 tham số: parent (parent là kết quả trả về của resolver trước đó) và args (args truyền từ client)
import { AuthorModel, FolderModel, NoteModel, NotificationModel } from "../models/index.js";
import { GraphQLScalarType } from "graphql";
import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub(); // Pubsub để publish các sự kiện

export const resolvers = {
    // Tạo kiểu dữ liệu Date
    Date: new GraphQLScalarType({
        name: "Date",
        parseValue(value) {
            // Giá trị truyền từ client, ví dụ: "2021-08-01T08:00:00.000Z"
            return new Date(value);
        },
        serialize(value) {
            // Giá trị trả về cho client, ví dụ: "2021-08-01T08:00:00.000Z"
            return value.toISOString();
        },
    }),
    Query: {
        // Truy vấn đến field folders của Query trong schema
        folders: async (parent, args, context) => {
            const folders = await FolderModel.find({
                authorId: context.uid,
            }).sort({ updatedAt: "desc" });
            console.log({ context });
            return folders;
        },
        // Truy vấn đến field folder của Query trong schema
        folder: async (parent, args) => {
            const folderId = args.folderId; // Dùng args để lấy giá trị của tham số folderId truyền từ client
            console.log({ folderId });
            const foundFolder = await FolderModel.findById(folderId);
            return foundFolder; // Là parent của resolver Folder
        },
        // Truy vấn đến field note của Query trong schema
        note: async (parent, args) => {
            const noteId = args.noteId;
            const note = await NoteModel.findById(noteId);
            return note;
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
        notes: async (parent, args) => {
            const notes = await NoteModel.find({ folderId: parent.id }).sort({ updatedAt: "desc" });
            console.log({ notes });
            return notes;
        },
    },
    // Mutation là các thao tác thêm, sửa, xóa
    Mutation: {
        addNote: async (parent, args) => {
            const newNote = new NoteModel(args);
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const noteId = args.id;
            const note = await NoteModel.findByIdAndUpdate(noteId, args);
            return note;
        },
        addFolder: async (parent, args, context) => {
            const newFolder = new FolderModel({ ...args, authorId: context.uid });
            pubsub.publish("FOLDER_CREATED", {
                folderCreated: {
                    message: "A new folder created",
                },
            }); // Tham số thứ nhất là tên event, tham số thứ 2 là dữ liệu truyền cho client (người subscribe)
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
        pushNotification: async (parent, args) => {
            const newNotification = new NotificationModel({ args });
            pubsub.publish("PUSH_NOTIFICATION", {
                notification: {
                    message: args.content,
                },
            });

            await newNotification.save();
            return { message: "SUCCESS" };
        },
    },
    Subscription: {
        // Dưới đây là các event mà client có thể subscribe
        folderCreated: {
            subscribe: () => pubsub.asyncIterator(["FOLDER_CREATED", "NOTE_CREATED"]),
        },
        notification: {
            subscribe: () => pubsub.asyncIterator(["PUSH_NOTIFICATION"]),
        },
    },
};
