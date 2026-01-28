import NavBar from '../../components/NavBar.jsx';
import { CANDYSTORE_MOCK } from '../../mocks/candystore.js';
import { useStore } from '../../store/useStore';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const Dulceria = () => {
    const { user, cart, addToCart, getTotal, decreaseQuantity } = useStore();
    const navigate = useNavigate();

    const handleAddToCart = (item) => {
        if (!user) {
            Swal.fire({
                title: '¡Identifícate primero!',
                text: 'Para añadir productos al carrito debes iniciar sesión o entrar como invitado.',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#F0B100',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ir al Login',
                cancelButtonText: 'Seguir viendo'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        addToCart(item);

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `${item.name} añadido`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
        <div className="max-w-7xl mx-auto p-4 ">
            <NavBar />
            <h1 className="text-3xl font-black text-gray-900 mb-6 uppercase">Dulcería</h1>
            <div className="flex flex-col lg:flex-row gap-8">

                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {CANDYSTORE_MOCK.map((item) => (
                            <div key={item.id} className="flex flex-col bg-white p-4 rounded-3xl justify-between gap-2 shadow-md border border-gray-200">
                                <img src={item.image} alt={item.name} className="sm:w-full object-cover rounded-xl mb-4 max-w-[300px] m-auto" />
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-gray-500 text-sm">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-xl font-bold">S/ {item.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-4 py-2 rounded-lg font-bold"
                                    >
                                        + Añadir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className="w-full lg:w-96">
                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 sticky top-28">
                        <h2 className="text-xl font-bold mb-6">🛒 Resumen</h2>

                        {cart.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 italic">
                                {user ? "Tu carrito está vacío" : "Inicia sesión para comprar"}
                            </div>
                        ) : (
                            <>
                                <div className="space-y-4 mb-6">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex justify-between bg-white p-3 rounded-xl items-center border border-gray-100">
                                            <span className="text-sm font-medium">{item.name}</span>
                                            <span className="font-bold text-blue-800">S/ {(item.price * item.quantity).toFixed(2)}</span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => decreaseQuantity(item.id)}
                                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-red-200"
                                                >
                                                    -
                                                </button>

                                                <span className="font-bold">{item.quantity}</span>

                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="px-2 py-1 bg-gray-200 rounded hover:bg-green-200"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                    ))}
                                </div>

                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-6">
                                        <span className="text-gray-600">Total:</span>
                                        <span className="text-2xl font-black text-[#003399]">S/ {getTotal().toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate("/pay")}
                                        className="w-full bg-[#003399] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800"
                                    >
                                        Continuar al Pago
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dulceria;