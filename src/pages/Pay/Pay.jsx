import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { processFullPayment } from './services/paymentService';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const paymentSchema = z.object({
    fullName: z.string().min(3, "Ingresa tu nombre completo"),
    email: z.string().email("Correo electrónico no válido"),
    cardNumber: z.string().length(16, "Deben ser 16 dígitos").regex(/^\d+$/, "Solo números"),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato MM/YY"),
    cvv: z.string().length(3, "Deben ser 3 dígitos").regex(/^\d+$/, "Solo números"),
    docType: z.enum(["DNI", "CE"]),
    docNumber: z.string().min(8, "Mínimo 8 dígitos").max(12, "Máximo 12 dígitos").regex(/^\d+$/, "Solo números"),
});

const Pay = () => {
    const { user, cart, getTotal, clearCart } = useStore();
    const navigate = useNavigate();

    const fullNameFromUser = user ? [user.name, user.lastName].filter(Boolean).join(" ") : "";
    const initialName = (user && user.name !== "Invitado") ? fullNameFromUser : "";

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(paymentSchema),
        defaultValues: {
            fullName: initialName,
            email: user?.email || "",
            docType: "DNI",
            docNumber: ""
        }
    });

    const onSubmit = async (data) => {
        try {
            Swal.fire({
                title: 'Procesando Transacción...',
                text: 'Estamos validando tus datos con PayU',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            const result = await processFullPayment(data, getTotal());

            Swal.fire({
                icon: 'success',
                title: '¡Compra Correcta!',
                text: 'Tu pedido en dulcería ha sido procesado con éxito.',
                confirmButtonColor: '#003399',
                confirmButtonText: 'Finalizar'
            }).then(() => {
                clearCart();
                navigate('/success');
            });

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error en el pago',
                text: error.message,
                confirmButtonColor: '#d33'
            });
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-8">
            <form onSubmit={handleSubmit(onSubmit)} className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-black mb-6 text-blue-900 uppercase">Detalles del Pago</h2>

                <div className="space-y-5">
                    {/* Nombre y Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre en Tarjeta</label>
                            <input
                                {...register("fullName")}
                                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="Juan Pérez"
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input
                                {...register("email")}
                                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.email ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="correo@ejemplo.com"
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Tarjeta */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Número de Tarjeta</label>
                        <input
                            {...register("cardNumber")}
                            maxLength={16}
                            className={`w-full p-3 border rounded-xl tracking-[0.2em] font-mono ${errors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                            placeholder="0000000000000000"
                        />
                        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>}
                    </div>

                    {/* Expiración y CVV */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Vencimiento</label>
                            <input
                                {...register("expiryDate")}
                                placeholder="MM/YY"
                                className={`w-full p-3 border rounded-xl ${errors.expiryDate ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate.message}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">CVV</label>
                            <input
                                {...register("cvv")}
                                maxLength={3}
                                placeholder="123"
                                className={`w-full p-3 border rounded-xl ${errors.cvv ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv.message}</p>}
                        </div>
                    </div>

                    {/* Documento */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Tipo</label>
                            <select {...register("docType")} className="w-full p-3 border border-gray-200 rounded-xl bg-white">
                                <option value="DNI">DNI</option>
                                <option value="CE">CE</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Número Documento</label>
                            <input
                                {...register("docNumber")}
                                className={`w-full p-3 border rounded-xl ${errors.docNumber ? 'border-red-500' : 'border-gray-200'}`}
                            />
                            {errors.docNumber && <p className="text-red-500 text-xs mt-1">{errors.docNumber.message}</p>}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#003399] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-200 mt-4"
                    >
                        FINALIZAR PAGO S/ {getTotal().toFixed(2)}
                    </button>
                </div>
            </form>

            {/* RESUMEN LATERAL */}
            <div className="w-full md:w-80 h-fit bg-gray-50 p-6 rounded-3xl border border-gray-200 sticky top-24">
                <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest mb-4">Tu pedido</h3>
                <div className="space-y-3 mb-6">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600 font-medium">{item.quantity}x {item.name}</span>
                            <span className="font-bold text-gray-900">S/ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-dashed border-gray-300 pt-4 flex justify-between items-center font-black text-xl text-[#003399]">
                    <span>Total</span>
                    <span>S/ {getTotal().toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
}

export default Pay;