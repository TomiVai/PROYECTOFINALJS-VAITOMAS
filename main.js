let usuarioActual = null;

// elementos del html
let botonIniciarSesion = document.getElementById('logueate');
let botonRegistrarse = document.getElementById('registrate');
let formularioInicio = document.getElementById('usuario-container');
let nota = document.getElementById('tarea');
let botonGuardarNota = document.getElementById('guardarNota');
let botonMostrarNotas = document.getElementById('mostrarNotas');
let listaNotas = document.getElementById('verNotas');
let tituloUsuario = document.getElementById('nombre-usuario');
let botonBorrarNotas = document.getElementById('borrarNotas');

// Event Listeners
botonIniciarSesion.addEventListener('click', iniciarSesion);
botonRegistrarse.addEventListener('click', registrarUsuario);
botonGuardarNota.addEventListener('click', agregarTarea);

function mostrarElementosDespuesInicioSesion() {
    document.getElementById('notas-guardadas').style.display = 'block';
    ocultarFormularioInicio();
}

function usuarioExiste(nombreUsuario) {
    return localStorage.getItem(nombreUsuario) !== null;
}

// SweetAlert2 con función personalizada
function mostrarAlert(mensaje, tipo) {
    Swal.fire({
        title: tipo === 'error' ? 'Error' : 'Éxito',
        text: mensaje,
        icon: tipo,
        confirmButtonText: 'Aceptar'
    });
}

// iniciar sesion con un usuario ya registrado y de lo contrario mostrar SweetAlert2 con un error avisando
function iniciarSesion() {
    const entradaUsuario = document.getElementById('usuario');
    const nombreUsuario = entradaUsuario.value.trim();

    if (nombreUsuario === '') {
        mostrarAlert('Por favor, ingresa un nombre de usuario válido.', 'error');
        return;
    }

    if (usuarioExiste(nombreUsuario)) {
        usuarioActual = nombreUsuario;
        tituloUsuario.innerText = usuarioActual;
        mostrarNotas();
        mostrarElementosDespuesInicioSesion();
    } else {
        mostrarAlert('El usuario no existe. Intenta registrarte.', 'error');
    }
}

function mostrarFormularioInicio() {
    formularioInicio.style.display = 'block';
    document.getElementById('todo-container').style.display = 'none';
}

function ocultarFormularioInicio() {
    formularioInicio.style.display = 'none';
    document.getElementById('todo-container').style.display = 'block';
}

// registrar usuario en caso de no tener uno y confirmar exito con SweetAlert2
function registrarUsuario() {
    formularioInicio.innerHTML = `<input type="text" placeholder="escribi tu nombre de usuario" id="nuevoUsuario"></br>
        <button type="submit" id="guardarUsuario">Crea tu usuario</button>`;

    let botonGuardarUsuario = document.getElementById('guardarUsuario');
    botonGuardarUsuario.addEventListener('click', function () {
        let entradaUsuario = document.getElementById('nuevoUsuario');
        let nombreUsuario = entradaUsuario.value;

        if (nombreUsuario === '') {
            mostrarAlert('Por favor, ingresa un nombre de usuario válido.', 'error');
            return;
        }

        if (usuarioExiste(nombreUsuario)) {
            mostrarAlert('El usuario ya existe. Intenta iniciar sesión.', 'error');
        } else {
            usuarioActual = nombreUsuario;

            formularioInicio.innerHTML = `<label for="usuario">Nombre de usuario:</label>
                <input type="text" id="usuario">
                <button id="logueate">Iniciar sesión</button>
                <button id="registrate">Registrarse</button>`;

            tituloUsuario.innerText = usuarioActual || '';

            // Aquí iniciamos sesión después del registro exitoso
            iniciarSesion();

            // Y ahora mostramos la alerta de registro exitoso
            mostrarAlert('¡Registro exitoso! Ahora inicia sesión con el usuario registrado.', 'success');
        }
    });
}

// almacenar notas por usuarios
function agregarTarea() {
    const entradaTarea = document.getElementById('tarea');
    const tarea = entradaTarea.value.trim();

    if (tarea === '') {
        mostrarAlert('Por favor, ingresa una tarea válida.', 'error');
        return;
    }

    const tareasUsuario = localStorage.getItem(usuarioActual) ? JSON.parse(localStorage.getItem(usuarioActual)) : [];
    tareasUsuario.push(tarea);
    localStorage.setItem(usuarioActual, JSON.stringify(tareasUsuario));

    mostrarNotas();
}

function mostrarNotas() {
    const listaTareas = document.getElementById('verNotas');
    listaTareas.innerHTML = '';

    const tareasUsuario = localStorage.getItem(usuarioActual) ? JSON.parse(localStorage.getItem(usuarioActual)) : [];

    tareasUsuario.forEach(tarea => {
        const elementoLista = document.createElement('li');
        elementoLista.textContent = tarea;
        listaTareas.appendChild(elementoLista);
    });
}

botonMostrarNotas.addEventListener('click', toggleNotasGuardadas);

function toggleNotasGuardadas() {
    const listaNotas = document.getElementById('verNotas');

    listaNotas.style.display = listaNotas.style.display === 'none' ? 'block' : 'none';
}

// SweetAlert2 en lugar de confirm
botonBorrarNotas.addEventListener('click', () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que deseas borrar todas las notas? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, borrar todo'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem(usuarioActual);
            mostrarNotas();
            mostrarAlert('Todas las notas han sido borradas.', 'success');
        }
    });
});

// api del clima, muestra el clima actual y la temperatura segun el momento en el que el usuario esta escribiendo la nota, por si le influye en algo
function obtenerClima() {
    const apiKey = 'e13e42a3f13c04fdd16f5c4100927131';
    const ciudad = 'La Plata, Ar';

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const contenedorClima = document.getElementById('clima-container');
            contenedorClima.innerHTML = `<h2>Clima actual:</h2>
          <p id="clima-info">Clima: ${data.weather[0].description}, Temperatura: ${data.main.temp}°C</p>`;
        })
        .catch(error => {
            console.error('Error al obtener el clima:', error);
        });
}

obtenerClima();
