// Schema định nghĩa các trường của document trong collection
export const typeDefs = `#graphql
  scalar Date

  type Folder {
    id: String!,
    name: String,
    createdAt: String,
    author: Author,
    notes: [Note]
  }
  type Note {
    id: String!,
    content: String,
    updatedAt: Date
  }
  type Author {
    uid: String!,
    name: String!
  }
  type Query {
    folders: [Folder],
    folder(folderId: String!): Folder,
    note(noteId: String): Note,
  }
  type Mutation {
    addFolder(name: String!): Folder,
    addNote(content: String!, folderId: ID!): Note,
    updateNote(id: String!, content: String!): Note,
    register(uid: String!, name: String!): Author,
    pushNotification(content: String): Message
  }
  type Message {
    message: String
  }
  type Subscription {
    folderCreated: Message,
    notification: Message
  }
`;
// GraphQL đọc schema, sau đó build nên dữ liệu 
// String! là kiểu dữ liệu bắt buộc phải có
// Tạo kiểu dữ liệu custom là dùng scalar