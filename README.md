🚀 Cine: Módulo de Pagos y Dulcería
Este proyecto es una aplicación de compra de productos de dulcería integrada con la pasarela de pagos de PayU Latam (modo Sandbox). Permite el flujo completo desde la selección de productos hasta la validación de tarjetas y confirmación de transacciones.

🛠️ Tecnologías y Librerías Utilizadas
Para este proyecto se integraron las siguientes herramientas:

- React.js: Biblioteca principal para la interfaz de usuario.

- React Router Dom v6: Gestión de rutas protegidas y navegación.

- Zustand: Manejo de estado global (Carrito de compras y sesión de usuario).

- React Hook Form: Gestión eficiente de formularios y captura de datos.

- Zod: Esquemas de validación de datos para asegurar formatos correctos (DNI, Tarjetas, Emails).

- CryptoJS: Generación de firmas digitales MD5 requeridas por la seguridad de PayU.

- SweetAlert2: Alertas visuales interactivas para estados de éxito y errores de pago.

- Tailwind CSS: Framework de utilidades para un diseño moderno y responsivo.

📋 Características Principales
- Validación de Formulario: Uso de zodResolver para validar en tiempo real que el número de tarjeta tenga 16 dígitos, el CVV tenga 3 y la fecha de expiración tenga el formato MM/YY.

- Seguridad de Transacción: Implementación de firmas MD5 dinámicas basadas en merchantId, referenceCode y amount.

- Manejo de Errores de Pasarela: Captura de códigos específicos de PayU (como EXPIRED_CARD, INVALID_CARD) para mostrar mensajes amigables al usuario.

- Flujo de Invitado: Permite el acceso al pago tanto para usuarios logueados como para invitados, manteniendo la persistencia del carrito.

- Persistencia: Sincronización con localStorage para no perder la compra al recargar la página.

🚀 Instalación y Configuración
1. Clonar el repositorio:
Bash
git clone [(https://github.com/jaimechico07/retoFrontendCP.git)]
cd [retoFrontendCP]

2. Instalar dependencias:
Bash
npm install

3. Librerías añadidas manualmente para el reto: Si estás empezando desde cero, estas son las librerías instaladas:

Bash
npm install react-router-dom zustand react-hook-form @hookform/resolvers zod crypto-js sweetalert2

4. Variables de Entorno (Configuración PayU): Asegúrate de que en paymentService.js las credenciales de Sandbox sean las correctas:

API_KEY: 4Vj8eK4rloUd2...

MERCHANT_ID: 508029

URL_PAYU: https://sandbox.api.payulatam.com/payments-api/4.0/service.cgi

📸 Flujo de Pago
- Selección: El usuario agrega productos en /dulceria.

- Validación: El formulario de /pay valida que los datos sean coherentes.

- Procesamiento: Se genera la firma MD5 y se envía a PayU.

- Respuesta: Se capturan errores del banco o éxito de la transacción.

- Finalización: Se limpia el carrito y se muestra el comprobante.