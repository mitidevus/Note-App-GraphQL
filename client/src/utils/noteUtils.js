import { graphQLRequest } from "./request";

// Mục đích: Lấy dữ liệu từ phía back-end về và trả về cho component
export const notesLoader = async ({ params: { folderId } }) => {
    const query = `query Folder($folderId: String!) {
    folder(folderId: $folderId) {
      id
      name
      notes {
        id
        content
      }
    }
  }`;

    const data = await graphQLRequest({
        query,
        variables: {
            folderId,
        },
    });
    return data;
};

export const noteLoader = async ({ params: { noteId } }) => {
    const query = `query Note($noteId: String) {
    note(noteId: $noteId) {
      content
      id
    }
  }`;

    const data = await graphQLRequest({
        query,
        variables: {
            noteId,
        },
    });
    return data;
};
