document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const educationalContent = document.getElementById('educational-content');
    const loginSection = document.getElementById('login');
    const registerSection = document.getElementById('register');

    // Verificar si localStorage está disponible
    if (typeof(Storage) !== "undefined") {
        console.log('localStorage está disponible');
    } else {
        console.error('localStorage no está disponible');
    }

    // Función para obtener usuarios del localStorage
    function getUsers() {
        try {
            const storedUsers = localStorage.getItem('users');
            console.log('Datos raw del localStorage:', storedUsers);
            if (storedUsers) {
                return JSON.parse(storedUsers);
            }
            return {};
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            return {};
        }
    }

    // Variables globales
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    // Función para mostrar mensajes de error
    function showError(message) {
        alert('Error: ' + message);
        console.error(message);
    }

    // Función para mostrar mensajes de éxito
    function showSuccess(message) {
        alert(message);
        console.log(message);
    }

    // Función para cambiar entre secciones
    function showSection(sectionToShow, sectionToHide) {
        sectionToShow.style.display = 'block';
        sectionToHide.style.display = 'none';
    }

    // Función para guardar usuarios
    function saveUsers(users) {
        try {
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Usuarios guardados en localStorage:', users);
            
            // Verificar que se guardó correctamente
            const savedUsers = localStorage.getItem('users');
            const parsedUsers = JSON.parse(savedUsers);
            console.log('Verificación de guardado:', parsedUsers);
            
            if (JSON.stringify(parsedUsers) !== JSON.stringify(users)) {
                throw new Error('Los datos no se guardaron correctamente');
            }
        } catch (error) {
            console.error('Error al guardar usuarios:', error);
            showError('Error al guardar los datos');
        }
    }

    // Función para guardar sesión activa
    function saveActiveSession(email) {
        const sessionData = {
            email: email,
            timestamp: new Date().getTime()
        };
        localStorage.setItem('activeSession', JSON.stringify(sessionData));
        console.log('Sesión activa guardada:', sessionData);
    }

    // Función para cerrar sesión
    function logout() {
        localStorage.removeItem('activeSession');
        showSection(loginSection, educationalContent);
        showSection(registerSection, educationalContent);
        loginForm.reset();
        console.log('Sesión cerrada');
    }

    // Verificar si hay una sesión activa
    const activeSession = localStorage.getItem('activeSession');
    if (activeSession) {
        const sessionData = JSON.parse(activeSession);
        console.log('Sesión activa encontrada:', sessionData);
        showSection(educationalContent, loginSection);
        showSection(educationalContent, registerSection);
    }

    // Verificar que los elementos existen
    console.log('Login form:', loginForm);
    console.log('Register form:', registerForm);
    console.log('Password field:', document.getElementById('password'));
    console.log('New password field:', document.getElementById('newPassword'));

    // Manejar inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Formulario de login enviado');
            
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
            console.log('Email:', email);
            console.log('Password:', password);
            console.log('Remember me:', rememberMe);

            if (!email || !password) {
                showError('Por favor, completa todos los campos');
                return;
            }

            // Obtener usuarios actuales del localStorage
            const currentUsers = getUsers();
            console.log('Usuarios en localStorage al momento del login:', currentUsers);

            // Verificar credenciales
            if (currentUsers[email] && currentUsers[email] === password) {
                showSuccess('Inicio de sesión exitoso');
                showSection(educationalContent, loginSection);
                showSection(educationalContent, registerSection);
                
                // Guardar sesión activa si se marcó "Mantener sesión iniciada"
                if (rememberMe) {
                    saveActiveSession(email);
                }
            } else {
                showError('Correo o contraseña incorrectos');
                console.log('Intento de login fallido. Usuario:', email);
                console.log('Contraseña ingresada:', password);
                console.log('Contraseña almacenada:', currentUsers[email]);
            }
        });
    }

    // Manejar registro
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Formulario de registro enviado');
            
            const newEmail = document.getElementById('newEmail').value;
            const newPassword = document.getElementById('newPassword').value;
            
            console.log('New Email:', newEmail);
            console.log('New Password:', newPassword);

            if (!newEmail || !newPassword) {
                showError('Por favor, completa todos los campos');
                return;
            }

            // Obtener usuarios actuales del localStorage
            const currentUsers = getUsers();
            console.log('Usuarios en localStorage al momento del registro:', currentUsers);

            // Verificar si el usuario ya existe
            if (currentUsers[newEmail]) {
                showError('Este correo ya está registrado. Por favor, inicia sesión.');
                showSection(loginSection, registerSection);
                // Rellenar el formulario de login con el correo
                document.getElementById('email').value = newEmail;
                return;
            }

            // Guardar nuevo usuario
            currentUsers[newEmail] = newPassword;
            saveUsers(currentUsers);
            
            showSuccess('Usuario registrado exitosamente. Por favor, inicia sesión.');
            showSection(loginSection, registerSection);
            registerForm.reset();
        });
    }

    // Manejar mostrar soluciones
    document.querySelectorAll('.show-solution').forEach(button => {
        button.addEventListener('click', () => {
            const solution = button.nextElementSibling;
            solution.style.display = solution.style.display === 'none' ? 'block' : 'none';
        });
    });

    // Función para normalizar una expresión matemática
    function normalizeExpression(expr) {
        return expr
            .replace(/\s+/g, '') // Eliminar espacios
            .replace(/\*/g, '') // Eliminar asteriscos
            .replace(/\(/g, '') // Eliminar paréntesis de apertura
            .replace(/\)/g, '') // Eliminar paréntesis de cierre
            .toLowerCase(); // Convertir a minúsculas
    }

    // Función para verificar si dos expresiones son equivalentes
    function areExpressionsEquivalent(expr1, expr2) {
        const normalized1 = normalizeExpression(expr1);
        const normalized2 = normalizeExpression(expr2);
        console.log('Expresión 1 normalizada:', normalized1);
        console.log('Expresión 2 normalizada:', normalized2);
        return normalized1 === normalized2;
    }

    // Manejar verificación de respuestas
    document.querySelectorAll('.check-answer').forEach(button => {
        button.addEventListener('click', () => {
            const exercise = button.closest('.exercise');
            const input = exercise.querySelector('.exercise-input');
            const solution = exercise.querySelector('.exercise-solution');
            const userAnswer = input.value.trim();
            const correctAnswer = '2(x^3 + 2x)(3x^2 + 2)';

            console.log('Respuesta del usuario:', userAnswer);
            console.log('Respuesta correcta:', correctAnswer);

            if (areExpressionsEquivalent(userAnswer, correctAnswer)) {
                showSuccess('¡Correcto!');
                solution.style.display = 'block';
            } else {
                showError('Incorrecto. Intenta de nuevo.');
                console.log('Las expresiones no son equivalentes');
            }
        });
    });

    // Manejar teclado virtual
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            const input = key.closest('.exercise').querySelector('.exercise-input');
            const value = key.textContent;
            
            switch(value) {
                case 'C':
                    input.value = '';
                    break;
                case '←':
                    input.value = input.value.slice(0, -1);
                    break;
                case '=':
                    // Verificar la respuesta cuando se presiona =
                    const exercise = key.closest('.exercise');
                    const solution = exercise.querySelector('.exercise-solution');
                    const userAnswer = input.value.trim();
                    const correctAnswer = '2(x^3 + 2x)(3x^2 + 2)';

                    console.log('Respuesta del usuario:', userAnswer);
                    console.log('Respuesta correcta:', correctAnswer);

                    if (areExpressionsEquivalent(userAnswer, correctAnswer)) {
                        showSuccess('¡Correcto!');
                        solution.style.display = 'block';
                    } else {
                        showError('Incorrecto. Intenta de nuevo.');
                        console.log('Las expresiones no son equivalentes');
                    }
                    break;
                default:
                    input.value += value;
            }
        });
    });

    // Funciones adicionales para manejar la interactividad de las explicaciones y ejercicios
    // Por ejemplo, mostrar soluciones al hacer clic y guardar el progreso del usuario

    // Elementos del DOM
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const closeButtons = document.getElementsByClassName('close');

    // Funciones para mostrar/ocultar modales
    function showModal(modal) {
        modal.style.display = 'block';
    }

    function hideModal(modal) {
        modal.style.display = 'none';
    }

    // Event listeners para los enlaces de navegación
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(loginModal);
    });

    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(registerModal);
    });

    // Event listeners para cerrar modales
    Array.from(closeButtons).forEach(button => {
        button.addEventListener('click', () => {
            hideModal(loginModal);
            hideModal(registerModal);
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) hideModal(loginModal);
        if (e.target === registerModal) hideModal(registerModal);
    });

    // Funciones de autenticación
    function saveUserSession(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
    }

    function clearUserSession() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
    }

    function checkUserSession() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (isLoggedIn && currentUser) {
            document.getElementById('educational-content').style.display = 'block';
            document.getElementById('introduction').style.display = 'none';
        }
    }

    // Verificar sesión al cargar la página
    checkUserSession();
});
