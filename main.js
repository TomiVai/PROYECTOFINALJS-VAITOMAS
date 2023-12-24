// Consignas del proyecto final, en mi caso un to do list

// Objetos y Arrays. Métodos de Arrays.
// Funciones y condicionales.
// Generación del DOM de forma dinámica. Eventos.
// Sintaxis avanzada.
// Al menos una librería de uso relevante para el proyecto.
// Manejo de promesas con fetch. 
// Carga de datos desde un JSON local o desde una API externa.

// Del html necesito un input, un boton para guardar el mismo, puedo agregar una opcion para loguearse, cosa de que las notas de una persona no sean las mismas que del resto, lo cual tambien seria un input, luego, boton de guardado de notas y boton para que se muestren las notas previamente guardadas y un div que muestre nuestras notas guardadas, el mismo debe estar vacio y la idea es que se le inserten cosas desde js.

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
// iniciar sesion con un usuario ya registrado y de lo contrario tirar alert con error avisando
function iniciarSesion() {
    const entradaUsuario = document.getElementById('usuario');
    const nombreUsuario = entradaUsuario.value.trim();

    if (nombreUsuario === '') {
        alert('Por favor, ingresa un nombre de usuario válido.');
        return;
    }

    if (usuarioExiste(nombreUsuario)) {
        usuarioActual = nombreUsuario;
        tituloUsuario.innerText = usuarioActual;
        mostrarNotas();
        mostrarElementosDespuesInicioSesion();
    } else {
        alert('El usuario no existe. Intenta registrarte.');
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
// registrar usuario en caso de no tener uno y confirmar exito con alert
function registrarUsuario() {
    formularioInicio.innerHTML = `<input type="text" placeholder="escribi tu nombre de usuario" id="nuevoUsuario"></br>
        <button type="submit" id="guardarUsuario">Crea tu usuario</button>`;

    let botonGuardarUsuario = document.getElementById('guardarUsuario');
    botonGuardarUsuario.addEventListener('click', function () {
        let entradaUsuario = document.getElementById('nuevoUsuario');
        let nombreUsuario = entradaUsuario.value;

        if (nombreUsuario === '') {
            alert('Por favor, ingresa un nombre de usuario válido.');
            return;
        }

        if (usuarioExiste(nombreUsuario)) {
            alert('El usuario ya existe. Intenta iniciar sesión.');
        } else {
            usuarioActual = nombreUsuario;

            formularioInicio.innerHTML = `<label for="usuario">Nombre de usuario:</label>
                <input type="text" id="usuario">
                <button id="logueate">Iniciar sesión</button>
                <button id="registrate">Registrarse</button>`;

            tituloUsuario.innerText = usuarioActual || '';

            alert('¡Registro exitoso! Ahora inicia sesión con el usuario registrado.');

            iniciarSesion();
        }
    });
}
// almacenar notas por usuarios
function agregarTarea() {
    const entradaTarea = document.getElementById('tarea');
    const tarea = entradaTarea.value.trim();

    if (tarea === '') {
        alert('Por favor, ingresa una tarea válida.');
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

botonBorrarNotas.addEventListener('click', borrarTodasLasNotas);

function borrarTodasLasNotas() {
    const confirmacion = confirm('¿Estás seguro de que deseas borrar todas las notas? Esta acción no se puede deshacer.');

    if (confirmacion) {
        localStorage.removeItem(usuarioActual);
        mostrarNotas();
    }
}
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


