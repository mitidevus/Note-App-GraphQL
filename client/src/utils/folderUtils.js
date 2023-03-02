export const foldersLoader = async () => {
    // Loader là khi một component được render ra màn hình, loader sẽ được thực thi
    // Lấy dữ liệu phía back-end về và trả về cho component
    // Sau đó component mới được render ra màn hình
    const query = `query Query {
        folders {
            id
            name
            createdAt
        }
    }`;

    const res = await fetch("http://localhost:4000/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query,
        }),
    });

    const { data } = await res.json();
    console.log(data);
    return data;
};
