import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dulceria from "../pages/Dulceria/Dulceria";
import Pay from "../pages/Pay/Pay";
import { ProtectedRoute } from "./ProtectedRouted";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,

    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/dulceria",
        element: <Dulceria />,
    },
    {
        path: "/pay",
        element:
            <ProtectedRoute>
                <Pay />
            </ProtectedRoute>,

    },


]);

export default router;