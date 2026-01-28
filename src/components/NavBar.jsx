import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useStore } from '../store/useStore';
import { useAuth0 } from "@auth0/auth0-react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { RiLogoutBoxLine } from "react-icons/ri";
import Swal from 'sweetalert2';

const NavBar = () => {
    const navigate = useNavigate();
    const { user, logout: logoutStore } = useStore();
    const { logout: logoutAuth0 } = useAuth0();
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleLogout = () => {
        Swal.fire({
            title: '¡Hasta luego!',
            text: 'Has cerrado tu sesión correctamente. ¡Vuelve pronto!',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
        }).then(() => {

            logoutStore();
            setIsOpen(false);
            logoutAuth0({
                logoutParams: { returnTo: window.location.origin }
            });
        });
    }

    const linkStyles = ({ isActive }) =>
        `relative py-1 transition-colors duration-300 hover:text-yellow-400 ${isActive ? 'text-yellow-400 font-bold after:content-[""] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-yellow-400' : 'text-white'
        }`;

    return (
        <nav className="bg-gray-800 text-white sticky top-0 z-50 shadow-md mb-4">
            <div className="flex justify-between items-center p-4 max-w-7xl mx-auto">
                <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
                    CinePlanet<span className="text-[#ffcc00]">Reto</span>
                </div>

                {/* BOTÓN HAMBURGUESA (Solo Mobile) */}
                <div className="md:hidden text-3xl cursor-pointer text-yellow-400" onClick={toggleMenu}>
                    {isOpen ? <HiX /> : <HiMenuAlt3 />}
                </div>

                {/* MENÚ DESKTOP */}
                <ul className="hidden md:flex gap-8 items-center">
                    <li><NavLink to="/" className={linkStyles}>Home</NavLink></li>
                    <li><NavLink to="/dulceria" className={linkStyles}>Dulcería</NavLink></li>

                    {user ? (
                        <li className="flex items-center gap-4">
                            <span className="text-sm opacity-80 italic">Hola, {user.name}</span>
                            <RiLogoutBoxLine className=" text-white" onClick={handleLogout} />
                        </li>
                    ) : (
                        <li>
                            <NavLink to="/login" className={({ isActive }) =>
                                `px-4 py-2 rounded font-bold transition-all ${isActive ? 'bg-white text-[#003399]' : 'bg-yellow-400 text-[#003399] hover:bg-yellow-500'
                                }`
                            }>
                                Login
                            </NavLink>
                        </li>
                    )}
                </ul>
            </div>

            {/* MENÚ MOBILE (Overlay) */}
            <div className={`md:hidden fixed inset-0 bg-gray-900 bg-opacity-95 z-40 transform ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full p-8">
                    <div className="flex justify-end mb-8" onClick={toggleMenu}>
                        <HiX className="text-4xl text-yellow-400 cursor-pointer" />
                    </div>

                    <ul className="flex flex-col gap-6 text-2xl font-semibold">
                        <li>
                            <NavLink to="/" onClick={toggleMenu} className={linkStyles}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to="/dulceria" onClick={toggleMenu} className={linkStyles}>Dulcería</NavLink>
                        </li>
                        <hr className="border-gray-700" />
                        {user ? (
                            <div className="space-y-4">
                                <p className="text-lg italic text-yellow-400">Hola, {user.name}</p>
                                <RiLogoutBoxLine className=" text-red-400" onClick={handleLogout} />
                            </div>
                        ) : (
                            <li>
                                <NavLink to="/login" onClick={toggleMenu} className="text-yellow-400">Login</NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;