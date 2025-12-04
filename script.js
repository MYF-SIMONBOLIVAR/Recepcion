document.addEventListener('DOMContentLoaded', () => {
    const registroForm = document.getElementById('registroForm');
    const fechaHoraInput = document.getElementById('fechaHora');
    const mensajeDiv = document.getElementById('mensaje');

    // Función para obtener la fecha y hora actual
    const getFormattedDateTime = () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return now.toLocaleString('es-ES', options);
    };

    // Establecer la fecha y hora por defecto al cargar la página
    fechaHoraInput.value = getFormattedDateTime();

    // Actualizar la fecha y hora cada segundo 
    setInterval(() => {
        fechaHoraInput.value = getFormattedDateTime();
    }, 1000);


    registroForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevenir el envío de formulario por defecto

        mensajeDiv.textContent = ''; // Limpiar mensajes anteriores
        mensajeDiv.className = 'mensaje'; // Limpiar clases de mensaje

        const proveedor = document.getElementById('proveedor').value;
        const factura = document.getElementById('factura').value;
        const ordenCompra = document.getElementById('ordenCompra').value;

        // Validar que se haya seleccionado un proveedor
        if (!proveedor) {
            mensajeDiv.classList.add('error');
            mensajeDiv.textContent = 'Por favor, selecciona un proveedor.';
            return;
        }

        try {
            
            const docRef = await window.addDoc(window.collection(window.db, "mercancia"), {
                proveedor: proveedor,
                factura: factura,
                ordenCompra: ordenCompra,
                fechaLlegada: window.serverTimestamp(), //  guarda la fecha del servidor, más precisa
                fechaLlegadaLocal: fechaHoraInput.value // Guardamos la fecha local visible también
            });

            console.log("Documento escrito con ID: ", docRef.id);
            mensajeDiv.classList.add('success');
            mensajeDiv.textContent = '¡Mercancía registrada con éxito!';

            // Opcional: Limpiar el formulario después del envío exitoso
            registroForm.reset();
            fechaHoraInput.value = getFormattedDateTime(); // Volver a poner la fecha actual

        } catch (e) {
            console.error("Error al añadir documento: ", e);
            mensajeDiv.classList.add('error');
            mensajeDiv.textContent = 'Error al registrar la mercancía. Inténtalo de nuevo.';
        }
    });
});
