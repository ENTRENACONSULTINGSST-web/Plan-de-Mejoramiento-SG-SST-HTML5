// Estado inicial
let acciones = [];

// Cargar datos guardados al iniciar
function cargarDatos() {
    const datosGuardados = localStorage.getItem('planMejoramiento');
    if (datosGuardados) {
        acciones = JSON.parse(datosGuardados);
    } else {
        // Datos de ejemplo
        acciones = [
            { id: 1, accion: 'Capacitación en seguridad', responsable: 'Juan Pérez', fecha: '2026-08-15', estado: 'Pendiente' },
            { id: 2, accion: 'Inspección de equipos', responsable: 'María Gómez', fecha: '2026-08-20', estado: 'En progreso' }
        ];
    }
    renderizarTabla();
}

// Guardar en localStorage
function guardarDatos() {
    localStorage.setItem('planMejoramiento', JSON.stringify(acciones));
}

// Renderizar la tabla
function renderizarTabla() {
    const tablaContainer = document.getElementById('tabla-container');
    if (!tablaContainer) return;

    if (acciones.length === 0) {
        tablaContainer.innerHTML = '<p class="no-actions">No hay acciones registradas. ¡Agrega una nueva!</p>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Acción</th>
                    <th>Responsable</th>
                    <th>Fecha límite</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
    `;

    acciones.forEach((accion, index) => {
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${accion.accion}</td>
                <td>${accion.responsable}</td>
                <td>${accion.fecha}</td>
                <td>
                    <span class="estado ${accion.estado.toLowerCase().replace(' ', '-')}">
                        ${accion.estado}
                    </span>
                </td>
                <td>
                    <button onclick="cambiarEstado(${accion.id})" class="btn-estado">
                        ${accion.estado === 'Completado' ? 'Reabrir' : 'Completar'}
                    </button>
                    <button onclick="eliminarAccion(${accion.id})" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    tablaContainer.innerHTML = html;
}

// Agregar nueva acción
function agregarAccion() {
    const accionInput = document.getElementById('accion-input');
    const responsableInput = document.getElementById('responsable-input');
    const fechaInput = document.getElementById('fecha-input');

    const accion = accionInput.value.trim();
    const responsable = responsableInput.value.trim();
    const fecha = fechaInput.value;

    if (!accion || !responsable || !fecha) {
        alert('Por favor, completa todos los campos');
        return;
    }

    const nuevaAccion = {
        id: Date.now(),
        accion,
        responsable,
        fecha,
        estado: 'Pendiente'
    };

    acciones.push(nuevaAccion);
    guardarDatos();
    renderizarTabla();

    // Limpiar formulario
    accionInput.value = '';
    responsableInput.value = '';
    fechaInput.value = '';
}

// Cambiar estado de una acción
function cambiarEstado(id) {
    const accion = acciones.find(a => a.id === id);
    if (accion) {
        accion.estado = accion.estado === 'Completado' ? 'Pendiente' : 'Completado';
        guardarDatos();
        renderizarTabla();
    }
}

// Eliminar una acción
function eliminarAccion(id) {
    if (confirm('¿Estás seguro de eliminar esta acción?')) {
        acciones = acciones.filter(a => a.id !== id);
        guardarDatos();
        renderizarTabla();
    }
}

// Inicializar la aplicación cuando la página esté cargada
document.addEventListener('DOMContentLoaded', cargarDatos);
