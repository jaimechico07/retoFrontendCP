import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dulceria from "../pages/Dulceria/Dulceria";
import Pay from "../pages/Pay/Pay";


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
        element: <Pay />,
    },


]);

export default router;