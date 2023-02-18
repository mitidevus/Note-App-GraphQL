import { createBrowserRouter, Outlet } from "react-router-dom";
import AuthProvider from "../context/AuthProvider";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import NoteList from "../components/NoteList";
import Note from "../components/Note";

const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    );
};

export default createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                element: <Login />,
                path: "/login",
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <Home />,
                        path: "/",
                        loader: async () => {
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
                        },
                        children: [
                            {
                                element: <NoteList />,
                                path: `folders/:folderId`,
                                children: [
                                    {
                                        element: <Note />,
                                        path: `notes/:noteId`,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);
