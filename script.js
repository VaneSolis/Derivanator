document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada');
    
    // Inicializar la navegación de pasos
    initializeStepNavigation();
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const educationalContent = document.getElementById('educational-content');
    const introductionSection = document.getElementById('introduction');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const closeButtons = document.getElementsByClassName('close');

    // Funciones para mostrar/ocultar modales
    function showModal(modal) {
        modal.style.display = 'block';
        modal.classList.remove('closing');
    }

    function hideModal(modal) {
        modal.classList.add('closing');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('closing');
        }, 300);
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
            const modal = button.closest('.modal');
            if (modal) {
                hideModal(modal);
            }
        });
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });

    // Función para mostrar mensajes de éxito
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        if (loginForm) {
            const previousMessages = loginForm.querySelectorAll('.success-message, .error-message');
            previousMessages.forEach(msg => msg.remove());
            
            loginForm.insertBefore(successDiv, loginForm.firstChild);
            
            if (message === '¡Inicio de sesión exitoso!') {
                setTimeout(() => {
                    hideModal(loginModal);
                    showEducationalContent();
                }, 1500);
            }
        }
    }

    // Función para mostrar/ocultar secciones principales
    function showEducationalContent() {
        if (educationalContent) {
            educationalContent.style.display = 'block';
        }
    }

    function hideEducationalContent() {
        if (educationalContent) {
            educationalContent.style.display = 'none';
        }
    }

    // Funciones globales de autenticación
    function clearUserSession() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('sessionTimestamp');
        localStorage.removeItem('lastActive');
        localStorage.removeItem('activeSession');
        console.log('Sesión limpiada correctamente');
    }

    function updateAuthUI(isLoggedIn) {
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const logoutButton = document.getElementById('logoutButton');

        console.log('Actualizando UI de autenticación:', isLoggedIn);

        if (isLoggedIn) {
            if (loginLink) {
                loginLink.style.display = 'none';
                console.log('Ocultando botón de inicio de sesión');
            }
            if (registerLink) {
                registerLink.style.display = 'none';
                console.log('Ocultando botón de registro');
            }
            if (logoutButton) {
                logoutButton.style.display = 'block';
                console.log('Mostrando botón de cierre de sesión');
            }
        } else {
            if (loginLink) {
                loginLink.style.display = 'block';
                console.log('Mostrando botón de inicio de sesión');
            }
            if (registerLink) {
                registerLink.style.display = 'block';
                console.log('Mostrando botón de registro');
            }
            if (logoutButton) {
                logoutButton.style.display = 'none';
                console.log('Ocultando botón de cierre de sesión');
            }
        }
    }

    // Función global de logout
    window.logout = function() {
        console.log('Función logout llamada');
        clearUserSession();
        updateAuthUI(false);
        // Forzar recarga de la página para asegurar que todo se actualice
        window.location.reload();
    };

    function checkUserSession() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = localStorage.getItem('currentUser');
        
        // Si no hay usuario pero está marcado como logueado, limpiamos la sesión
        if (isLoggedIn && !currentUser) {
            clearUserSession();
            updateAuthUI(false);
            return false;
        }
        
        updateAuthUI(isLoggedIn);
        return isLoggedIn;
    }

    // Verificar sesión al cargar la página
    const isLoggedIn = checkUserSession();
    console.log('Estado de sesión al cargar:', isLoggedIn);

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
                const users = JSON.parse(storedUsers);
                console.log('Usuarios parseados:', users);
                return users;
            }
            return {};
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            return {};
        }
    }

    // Variables globales
    let attempts = 3; // Inicializamos con 3 intentos
    const MAX_ATTEMPTS = 3;

    // Función para actualizar el contador de intentos
    function updateAttemptsCounter() {
        const attemptsSpan = document.getElementById('attemptsCount');
        if (attemptsSpan) {
            attemptsSpan.textContent = attempts;
        }
    }

    // Función para reiniciar el ejercicio
    function resetExercise() {
        attempts = MAX_ATTEMPTS;
        updateAttemptsCounter();
        const input = document.querySelector('.exercise-input');
        if (input) {
            input.value = '';
        }
        const solution = document.querySelector('.exercise-solution');
        if (solution) {
            solution.style.display = 'none';
        }
    }

    // Función para mostrar mensaje de sin intentos
    function showNoAttemptsMessage() {
        const message = "Parece que te quedaste sin intentos, ¿comenzamos de nuevo?";
        if (confirm(message)) {
            resetExercise();
        }
    }

    // Función para mostrar mensajes de error
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Si estamos en el modal de login, lo insertamos ahí
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            // Limpiar mensajes anteriores
            const previousMessages = loginForm.querySelectorAll('.success-message, .error-message');
            previousMessages.forEach(msg => msg.remove());
            
            loginForm.insertBefore(errorDiv, loginForm.firstChild);
        }
    }

    // Función para cambiar entre secciones
    function showSection(sectionToShow, sectionToHide) {
        sectionToShow.style.display = 'block';
        sectionToHide.style.display = 'none';
    }

    // Función para guardar usuarios
    function saveUsers(users) {
        try {
            console.log('Guardando usuarios:', users);
            localStorage.setItem('users', JSON.stringify(users));
            
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
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Sesión activa guardada:', sessionData);
        updateAuthUI(true);
    }

    // Funciones de autenticación
    function saveUserSession(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Sesión de usuario guardada:', user);
        updateAuthUI(true);
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
                hideModal(registerModal);
                showModal(loginModal);
                // Rellenar el formulario de login con el correo
                document.getElementById('email').value = newEmail;
                return;
            }

            // Guardar nuevo usuario
            currentUsers[newEmail] = newPassword;
            saveUsers(currentUsers);
            
            showSuccess('Usuario registrado exitosamente. Por favor, inicia sesión.');
            hideModal(registerModal);
            showModal(loginModal);
            registerForm.reset();
        });
    }

    // Manejar inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;

            console.log('Intento de inicio de sesión:', { email, password });

            // Verificar credenciales
            const users = getUsers();
            console.log('Usuarios en localStorage:', users);

            if (users[email] === password) {
                console.log('Inicio de sesión exitoso');
                showSuccess('¡Inicio de sesión exitoso!');
                saveUserSession({ email, password });
                if (rememberMe) {
                    saveActiveSession(email);
                }
                hideModal(loginModal);
            } else {
                console.log('Error de credenciales');
                showError('Correo o contraseña incorrectos');
            }
        });
    }

    // Manejar el cierre de la pestaña
    window.addEventListener('beforeunload', (event) => {
        // Actualizar último tiempo activo antes de que se cierre la pestaña
        if (localStorage.getItem('isLoggedIn') === 'true') {
            localStorage.setItem('lastActive', new Date().getTime().toString());
        }
    });

    // Actualizar último tiempo activo cada 5 minutos mientras la pestaña está abierta
    setInterval(() => {
        if (localStorage.getItem('isLoggedIn') === 'true') {
            localStorage.setItem('lastActive', new Date().getTime().toString());
        }
    }, 5 * 60 * 1000);

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
                    checkAnswer();
                    break;
                default:
                    input.value += value;
            }
        });
    });

    // Agregar evento de verificación a los botones de verificar respuesta
    document.querySelectorAll('.check-answer').forEach(button => {
        button.addEventListener('click', checkAnswer);
    });

    // Función para verificar la respuesta
    function checkAnswer() {
        const input = document.querySelector('.exercise-input');
        const solution = document.querySelector('.exercise-solution');
        const currentExercise = document.querySelector('.exercise');
        const answer = input.value.trim();
        
        // Respuestas correctas para cada ejercicio
        const correctAnswers = {
            1: [
                'f\'(x) = 6x^5 + 16x^3 + 8x',
                '6x^5 + 16x^3 + 8x',
                'f\'(x)=6x^5+16x^3+8x',
                '6x^5+16x^3+8x'
            ],
            2: [
                'x^(3/2)', 
                'x^3/2', 
                'x 3/2', 
                'x3/2', 
                'f\'(x)=x^(3/2)',
                'f\'(x)=x^3/2'
            ],
            3: [
                'f\'(x) = 2x + 3',
                '2x + 3',
                'f\'(x)=2x+3',
                '2x+3'
            ],
            4: [
                'f\'(x) = 3x^2 - 2x + 1',
                '3x^2 - 2x + 1',
                'f\'(x)=3x^2-2x+1',
                '3x^2-2x+1'
            ],
            5: [
                'f\'(x) = 4x^3 + 6x^2 - 2x',
                '4x^3 + 6x^2 - 2x',
                'f\'(x)=4x^3+6x^2-2x',
                '4x^3+6x^2-2x'
            ],
            6: [
                'f\'(x) = 5x^4 - 3x^2 + 2',
                '5x^4 - 3x^2 + 2',
                'f\'(x)=5x^4-3x^2+2',
                '5x^4-3x^2+2'
            ],
            7: [
                'f\'(x) = 2x + 1',
                '2x + 1',
                'f\'(x)=2x+1',
                '2x+1'
            ],
            8: [
                'f\'(x) = 3x^2 + 2x - 1',
                '3x^2 + 2x - 1',
                'f\'(x)=3x^2+2x-1',
                '3x^2+2x-1'
            ],
            9: [
                'f\'(x) = 5x^4 - 4x^2 + 3x^2 - 2',
                '5x^4 - 4x^2 + 3x^2 - 2',
                'f\'(x)=5x^4-4x^2+3x^2-2',
                '5x^4-4x^2+3x^2-2'
            ],
            10: [
                'f\'(x) = 5x^4 + 6x^3 - 3x^2 - 2x',
                '5x^4 + 6x^3 - 3x^2 - 2x',
                'f\'(x)=5x^4+6x^3-3x^2-2x',
                '5x^4+6x^3-3x^2-2x'
            ],
            11: [
                'f\'(x) = 6x^5 + 12x^4 + 3x^3 - 6x',
                '6x^5 + 12x^4 + 3x^3 - 6x',
                'f\'(x)=6x^5+12x^4+3x^3-6x',
                '6x^5+12x^4+3x^3-6x'
            ],
            12: [
                'f\'(x) = 8x^7 - 3x^5 + 6x^3 - 2x',
                '8x^7 - 3x^5 + 6x^3 - 2x',
                'f\'(x)=8x^7-3x^5+6x^3-2x',
                '8x^7-3x^5+6x^3-2x'
            ],
            13: [
                'f\'(x) = 6x(x^2 + 1)^2',
                '6x(x^2 + 1)^2',
                'f\'(x)=6x(x^2+1)^2',
                '6x(x^2+1)^2'
            ],
            14: [
                'f\'(x) = 6x^2(x^3 - 2)',
                '6x^2(x^3 - 2)',
                'f\'(x)=6x^2(x^3-2)',
                '6x^2(x^3-2)'
            ],
            15: [
                'f\'(x) = 8x^3(x^4 + 3)',
                '8x^3(x^4 + 3)',
                'f\'(x)=8x^3(x^4+3)',
                '8x^3(x^4+3)'
            ],
            16: [
                'f\'(x) = 8x(x^2 - 1)^3',
                '8x(x^2 - 1)^3',
                'f\'(x)=8x(x^2-1)^3',
                '8x(x^2-1)^3'
            ]
        };

        // Obtener el número de ejercicio actual
        const exerciseNumber = currentExercise.querySelector('p').textContent.split('.')[0];
        
        // Normalizar la respuesta del usuario y las respuestas correctas
        const normalizedAnswer = answer.replace(/\s+/g, '').toLowerCase();
        const isCorrect = correctAnswers[exerciseNumber].some(correctAns => 
            correctAns.replace(/\s+/g, '').toLowerCase() === normalizedAnswer
        );
        
        if (isCorrect) {
            showSuccess('¡Correcto!');
            solution.style.display = 'block';
            
            // Esperar un momento antes de mostrar el siguiente ejercicio
            setTimeout(() => {
                const exercisesContainer = document.querySelector('.exercises');
                const nextExerciseNumber = parseInt(exerciseNumber) + 1;
                
                // Si no hay más ejercicios, mostrar mensaje de finalización
                if (!correctAnswers[nextExerciseNumber]) {
                    const completionMessage = document.createElement('div');
                    completionMessage.className = 'completion-message';
                    completionMessage.innerHTML = `
                        <h3>¡Felicitaciones!</h3>
                        <p>Has completado todos los ejercicios de derivadas.</p>
                        <button onclick="resetExercises()" class="btn-primary">Comenzar de nuevo</button>
                    `;
                    exercisesContainer.innerHTML = '';
                    exercisesContainer.appendChild(completionMessage);
                    return;
                }

                // Crear el siguiente ejercicio
                const nextExercise = document.createElement('div');
                nextExercise.className = 'exercise';
                nextExercise.innerHTML = `
                    <p>${nextExerciseNumber}. Deriva la función: $f(x) = ${getExerciseFunction(nextExerciseNumber)}</p>
                    <div class="input-group">
                        <input type="text" class="exercise-input" placeholder="Escribe tu respuesta">
                    </div>
                    <div class="attempts-counter">
                        Intentos restantes: <span id="attemptsCount">3</span>
                    </div>
                    <div class="virtual-keyboard">
                        <div class="keyboard-row">
                            <button class="key">7</button>
                            <button class="key">8</button>
                            <button class="key">9</button>
                            <button class="key">/</button>
                            <button class="key">(</button>
                            <button class="key">)</button>
                            <button class="key">'</button>
                        </div>
                        <div class="keyboard-row">
                            <button class="key">4</button>
                            <button class="key">5</button>
                            <button class="key">6</button>
                            <button class="key">*</button>
                            <button class="key">x</button>
                            <button class="key">^</button>
                            <button class="key">√</button>
                        </div>
                        <div class="keyboard-row">
                            <button class="key">1</button>
                            <button class="key">2</button>
                            <button class="key">3</button>
                            <button class="key">-</button>
                            <button class="key">+</button>
                            <button class="key">.</button>
                        </div>
                        <div class="keyboard-row">
                            <button class="key">0</button>
                            <button class="key">C</button>
                            <button class="key">←</button>
                            <button class="key">=</button>
                        </div>
                    </div>
                    <button class="check-answer">Verificar Respuesta</button>
                    <div class="exercise-solution" style="display: none;">
                        <p>La solución es: $f'(x) = ${getExerciseSolution(nextExerciseNumber)}$</p>
                    </div>
                `;
                
                // Reemplazar el ejercicio actual con el siguiente
                currentExercise.replaceWith(nextExercise);
                
                // Forzar a MathJax a reprocesar el contenido nuevo
                if (window.MathJax) {
                    MathJax.typesetPromise([nextExercise]).catch((err) => console.log('Error al procesar MathJax:', err));
                }
                
                // Reiniciar el contador de intentos
                attempts = MAX_ATTEMPTS;
                updateAttemptsCounter();
                
                // Agregar el evento de verificación al nuevo botón
                const newCheckButton = nextExercise.querySelector('.check-answer');
                newCheckButton.addEventListener('click', checkAnswer);
                
                // Agregar eventos a las teclas del nuevo teclado virtual
                const newKeyboard = nextExercise.querySelector('.virtual-keyboard');
                newKeyboard.querySelectorAll('.key').forEach(key => {
                    key.addEventListener('click', () => {
                        const newInput = nextExercise.querySelector('.exercise-input');
                        if (key.textContent === 'C') {
                            newInput.value = '';
                        } else if (key.textContent === '←') {
                            newInput.value = newInput.value.slice(0, -1);
                        } else if (key.textContent === '=') {
                            checkAnswer();
                        } else {
                            newInput.value += key.textContent;
                        }
                    });
                });
            }, 1500);
        } else {
            attempts--;
            updateAttemptsCounter();
            if (attempts <= 0) {
                // En lugar de mostrar mensaje de sin intentos, mostrar un nuevo ejercicio
                const exercisesContainer = document.querySelector('.exercises');
                const newExercise = createNewExercise();
                currentExercise.replaceWith(newExercise);
                attempts = MAX_ATTEMPTS;
                updateAttemptsCounter();
            } else {
                showError('Incorrecto. Intenta de nuevo.');
            }
        }
    }

    // Función para obtener la función a derivar según el número de ejercicio
    function getExerciseFunction(exerciseNumber) {
        const functions = {
            1: 'x^6 + 4x^4 + 4x^2', // Regla de potencias
            2: 'x√x', // Regla de potencias con raíz
            3: 'x^2 + 3x + 1', // Regla de potencias y suma
            4: 'x^3 - x^2 + x', // Regla de potencias y resta
            5: 'x^4 + 2x^3 - x^2', // Regla de potencias y operaciones combinadas
            6: 'x^5 - x^3 + 2x', // Regla de potencias y operaciones combinadas
            7: 'x^2 + x + 1', // Regla de potencias y suma
            8: 'x^3 + x^2 - x', // Regla de potencias y resta
            9: '(x^2 + 1)(x^3 - 2x)', // Regla del producto
            10: '(x^3 - x)(x^2 + 2)', // Regla del producto
            11: '(x^2 + 3x)(x^4 - 2)', // Regla del producto
            12: '(x^5 + 2)(x^3 - x)', // Regla del producto
            13: '(x^2 + 1)^3', // Regla de la cadena
            14: '(x^3 - 2)^2', // Regla de la cadena
            15: '(x^4 + 3)^2', // Regla de la cadena
            16: '(x^2 - 1)^4' // Regla de la cadena
        };
        return functions[exerciseNumber] || 'x^2';
    }

    // Función para obtener la solución según el número de ejercicio
    function getExerciseSolution(exerciseNumber) {
        const solutions = {
            1: '6x^5 + 16x^3 + 8x',
            2: '\\frac{3}{2}\\sqrt{x}',
            3: '2x + 3',
            4: '3x^2 - 2x + 1',
            5: '4x^3 + 6x^2 - 2x',
            6: '5x^4 - 3x^2 + 2',
            7: '2x + 1',
            8: '3x^2 + 2x - 1',
            9: '5x^4 - 4x^2 + 3x^2 - 2', // Regla del producto
            10: '5x^4 + 6x^3 - 3x^2 - 2x', // Regla del producto
            11: '6x^5 + 12x^4 + 3x^3 - 6x', // Regla del producto
            12: '8x^7 - 3x^5 + 6x^3 - 2x', // Regla del producto
            13: '6x(x^2 + 1)^2', // Regla de la cadena
            14: '6x^2(x^3 - 2)', // Regla de la cadena
            15: '8x^3(x^4 + 3)', // Regla de la cadena
            16: '8x(x^2 - 1)^3' // Regla de la cadena
        };
        return solutions[exerciseNumber] || '2x';
    }

    // Función para crear un nuevo ejercicio aleatorio
    function createNewExercise() {
        const exerciseNumber = Math.floor(Math.random() * 16) + 1; // Cambiado de 8 a 16
        const newExercise = document.createElement('div');
        newExercise.className = 'exercise';
        newExercise.innerHTML = `
            <p>Nuevo ejercicio. Deriva la función: $f(x) = ${getExerciseFunction(exerciseNumber)}</p>
            <div class="input-group">
                <input type="text" class="exercise-input" placeholder="Escribe tu respuesta">
            </div>
            <div class="attempts-counter">
                Intentos restantes: <span id="attemptsCount">3</span>
            </div>
            <div class="virtual-keyboard">
                <div class="keyboard-row">
                    <button class="key">7</button>
                    <button class="key">8</button>
                    <button class="key">9</button>
                    <button class="key">/</button>
                    <button class="key">(</button>
                    <button class="key">)</button>
                    <button class="key">'</button>
                </div>
                <div class="keyboard-row">
                    <button class="key">4</button>
                    <button class="key">5</button>
                    <button class="key">6</button>
                    <button class="key">*</button>
                    <button class="key">x</button>
                    <button class="key">^</button>
                    <button class="key">√</button>
                </div>
                <div class="keyboard-row">
                    <button class="key">1</button>
                    <button class="key">2</button>
                    <button class="key">3</button>
                    <button class="key">-</button>
                    <button class="key">+</button>
                    <button class="key">.</button>
                </div>
                <div class="keyboard-row">
                    <button class="key">0</button>
                    <button class="key">C</button>
                    <button class="key">←</button>
                    <button class="key">=</button>
                </div>
            </div>
            <button class="check-answer">Verificar Respuesta</button>
            <div class="exercise-solution" style="display: none;">
                <p>La solución es: $f'(x) = ${getExerciseSolution(exerciseNumber)}$</p>
            </div>
        `;

        // Agregar eventos
        const checkButton = newExercise.querySelector('.check-answer');
        checkButton.addEventListener('click', checkAnswer);

        const keyboard = newExercise.querySelector('.virtual-keyboard');
        keyboard.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => {
                const input = newExercise.querySelector('.exercise-input');
                if (key.textContent === 'C') {
                    input.value = '';
                } else if (key.textContent === '←') {
                    input.value = input.value.slice(0, -1);
                } else if (key.textContent === '=') {
                    checkAnswer();
                } else {
                    input.value += key.textContent;
                }
            });
        });

        return newExercise;
    }

    // Función global para reiniciar los ejercicios
    window.resetExercises = function() {
        const exercisesContainer = document.querySelector('.exercises');
        exercisesContainer.innerHTML = '';
        
        // Crear el primer ejercicio
        const firstExercise = createNewExercise();
        exercisesContainer.appendChild(firstExercise);
        
        // Reiniciar el contador de intentos
        attempts = MAX_ATTEMPTS;
        updateAttemptsCounter();
    };

    // Funciones para la navegación de pasos
    function initializeStepNavigation() {
        const examples = document.querySelectorAll('.example');
        
        examples.forEach(example => {
            const prevBtn = example.querySelector('.prev-step');
            const nextBtn = example.querySelector('.next-step');
            const steps = example.querySelectorAll('.step');
            const contents = example.querySelectorAll('.step-content');
            let currentStep = 0;

            function updateNavigation() {
                // Actualizar botones
                prevBtn.disabled = currentStep === 0;
                nextBtn.disabled = currentStep === steps.length - 1;

                // Actualizar indicadores
                steps.forEach((step, index) => {
                    step.classList.toggle('active', index === currentStep);
                });

                // Actualizar contenido
                contents.forEach((content, index) => {
                    content.classList.toggle('active', index === currentStep);
                });
            }

            prevBtn.addEventListener('click', () => {
                if (currentStep > 0) {
                    currentStep--;
                    updateNavigation();
                }
            });

            nextBtn.addEventListener('click', () => {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    updateNavigation();
                }
            });
        });
    }

    // Inicializar la navegación de pasos cuando el DOM esté listo
    document.addEventListener('DOMContentLoaded', () => {
        initializeStepNavigation();
    });
});
