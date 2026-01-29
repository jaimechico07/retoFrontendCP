
import { useAuth0 } from "@auth0/auth0-react";
import { useStore } from "../../store/useStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Login = () => {
    const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
    const setUser = useStore((state) => state.setUser);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            setUser({
                name: user.name,
                email: user.email,
                picture: user.picture,
                isGuest: false
            });

            Swal.fire({
                title: `¡Bienvenido, ${user.name}!`,
                text: 'Has iniciado sesión correctamente.',
                icon: 'success',
                confirmButtonText: 'Ir a la Dulcería',
                confirmButtonColor: '#003399',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed || result.isDismissed) {
                    navigate('/dulceria');
                }
            });
        }
    }, [isAuthenticated, user, isLoading, setUser, navigate]);

    if (isLoading) return <div className="text-center mt-10">Cargando sesión...</div>;

    const handleGuestLogin = () => {
        setUser({ name: "Invitado", email: null, isGuest: true });
        navigate('/dulceria');
    };

    return (
        <div className="flex flex-col items-center justify-center h-[80vh] gap-6">
            <h1 className="text-3xl font-bold text-gray-800">Inicia Sesión</h1>

            <button
                onClick={() => loginWithRedirect({
                    authorizationParams: {
                        connection: 'google-oauth2',
                        prompt: 'select_account'
                    }
                })}
                className="bg-white border-2 border-gray-200 px-6 py-3 rounded-full flex items-center gap-3 hover:shadow-lg transition-all font-semibold text-gray-700 cursor-pointer"
            >
                <img src="https://www.google.com/favicon.ico" className="w-5" alt="Google" />
                Continuar con Google
            </button>

            <div className="flex items-center gap-4 w-64">
                <hr className="flex-1" />
                <span className="text-gray-400">o</span>
                <hr className="flex-1" />
            </div>

            <button
                onClick={handleGuestLogin}
                className="text-[#003399] font-bold hover:underline text-lg cursor-pointer"
            >
                Ingresar como Invitado
            </button>
        </div>
    );
};

export default Login;