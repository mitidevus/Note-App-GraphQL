import { graphQLRequest } from "./request";

// Mục đích: Lấy dữ liệu từ phía back-end về và trả về cho component
export const foldersLoader = async () => {
    // Loader là khi một component được render ra màn hình, loader sẽ được thực thi
    // Lấy dữ liệu phía back-end về và trả về cho component
    // Sau đó component mới được render ra màn hình
    const query = `query Folders {
    folders {
      id
      name
      createdAt
    }
  }`;

    const data = await graphQLRequest({ query });
    return data;
};
