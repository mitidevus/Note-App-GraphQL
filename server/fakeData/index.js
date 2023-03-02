export default {
    authors: [
        {
            id: 123,
            name: "Minh Tri",
        },
        {
            id: 999,
            name: "Chi Hien",
        },
    ],
    folders: [
        {
            id: "1",
            name: "Home",
            createdAt: "2022-11-18T03:42:13Z",
            authorId: 123,
        },
        {
            id: "2",
            name: "New Folder",
            createdAt: "2022-10-18T03:42:13Z",
            authorId: 999,
        },
        {
            id: "3",
            name: "Work",
            createdAt: "2022-09-18T03:42:13Z",
            authorId: 123,
        },
    ],
    notes: [
        {
            id: "123",
            content: "<p>Go to store</p>",
            folderId: "1",
        },
        {
            id: "234",
            content: "<p>Go to school</p>",
            folderId: "2",
        },
        {
            id: "345",
            content: "<p>Go to park</p>",
            folderId: "3",
        },
        {
            id: "456",
            content: "<p>Do homework</p>",
            folderId: "1",
        },
    ],
};
