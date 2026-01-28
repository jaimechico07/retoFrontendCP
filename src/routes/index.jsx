import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Dulceria from "../pages/Dulceria/Dulceria";


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
    }
]);

export default router;