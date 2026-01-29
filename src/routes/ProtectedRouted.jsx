import { Navigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth0 } from "@auth0/auth0-react";

export const ProtectedRoute = ({ children }) => {
    const { user, cart } = useStore();
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) return <div>Cargando...</div>;

    const isLogged = isAuthenticated || (user && user.name !== "");

    const hasItems = cart.length > 0;

    if (!isLogged) {
        return <Navigate to="/login" replace />;
    }

    if (!hasItems) {
        return <Navigate to="/dulceria" replace />;
    }
    return children;
};