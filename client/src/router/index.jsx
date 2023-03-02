import { createBrowserRouter, Outlet } from "react-router-dom";
import AuthProvider from "../context/AuthProvider";
import Home from "../pages/Home";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import NoteList from "../components/NoteList";
import Note from "../components/Note";
import { noteLoader, notesLoader } from "../utils/noteUtils";
import { foldersLoader } from "../utils/folderUtils";

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
                        loader: foldersLoader,
                        children: [
                            {
                                element: <NoteList />,
                                path: `folders/:folderId`,
                                loader: notesLoader,
                                children: [
                                    {
                                        element: <Note />,
                                        path: `notes/:noteId`,
                                        // Vẫn có thể lấy dữ liệu từ loader ở trên nhưng do thực hành làm quen react-router-dom nên tạo loader mới
                                        loader: noteLoader,
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
