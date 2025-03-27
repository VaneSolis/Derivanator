// Variables globales al inicio del archivo
const MAX_ATTEMPTS = 3;
let attempts = MAX_ATTEMPTS;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Página cargada');
    
    // Verificar sesión al cargar la página
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    console.log('Estado inicial de la sesión:', isLoggedIn);
    
    // Si el usuario está logueado y estamos en la página de ejercicios, mostrar el primer ejercicio
    const exerciseContainer = document.querySelector('.exercise-container');
    const loginMessage = document.getElementById('login-message');
    
    if (isLoggedIn && exerciseContainer) {
        console.log('Usuario logueado y en página de ejercicios, mostrando ejercicios...');
        exerciseContainer.style.display = 'block';
        if (loginMessage) loginMessage.style.display = 'none';
        
        if (!exerciseContainer.querySelector('.exercise')) {
            console.log('Creando primer ejercicio...');
            const firstExercise = createNewExercise(1);
            if (firstExercise) {
                exerciseContainer.innerHTML = '';
                exerciseContainer.appendChild(firstExercise);
                attempts = MAX_ATTEMPTS;
                updateAttemptsCounter();
            }
        }
    } else if (exerciseContainer) {
        console.log('Usuario no logueado, ocultando ejercicios');
        exerciseContainer.style.display = 'none';
        if (loginMessage) loginMessage.style.display = 'block';
    }
    
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
        
        const currentExercise = document.querySelector('.exercise');
        if (currentExercise) {
            // Limpiar mensajes anteriores
            const previousMessages = currentExercise.querySelectorAll('.success-message, .error-message');
            previousMessages.forEach(msg => msg.remove());
            
            // Insertar el nuevo mensaje antes del input
            const inputGroup = currentExercise.querySelector('.input-group');
            if (inputGroup) {
                currentExercise.insertBefore(successDiv, inputGroup);
            } else {
                currentExercise.appendChild(successDiv);
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
        const exerciseContainer = document.querySelector('.exercise-container');
        const loginMessage = document.getElementById('login-message');

        console.log('Actualizando UI de autenticación:', isLoggedIn);

        if (isLoggedIn) {
            // Ocultar botones de login/registro y mostrar logout
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';
            
            // Si estamos en la página de ejercicios
            if (exerciseContainer) {
                exerciseContainer.style.display = 'block';
                if (loginMessage) loginMessage.style.display = 'none';
                
                if (!exerciseContainer.querySelector('.exercise')) {
                    console.log('Creando primer ejercicio desde updateAuthUI...');
                    const firstExercise = createNewExercise(1);
                    if (firstExercise) {
                        exerciseContainer.innerHTML = '';
                        exerciseContainer.appendChild(firstExercise);
                        attempts = MAX_ATTEMPTS;
                        updateAttemptsCounter();
                    }
                }
            }
        } else {
            // Mostrar botones de login/registro y ocultar logout
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            
            // Si estamos en la página de ejercicios, ocultar el contenedor
            if (exerciseContainer) {
                exerciseContainer.style.display = 'none';
            }
            if (loginMessage) loginMessage.style.display = 'block';
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
        
        console.log('Verificando sesión:', { isLoggedIn, currentUser });
        
        // Si no hay usuario pero está marcado como logueado, limpiamos la sesión
        if (isLoggedIn && !currentUser) {
            clearUserSession();
            updateAuthUI(false);
            return false;
        }
        
        // Actualizar la UI basada en el estado de la sesión
        updateAuthUI(isLoggedIn);
        return isLoggedIn;
    }

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

    // Función para actualizar el contador de intentos
    function updateAttemptsCounter() {
        console.log('Actualizando contador de intentos:', attempts);
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

    // Función para mostrar mensajes de error
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        const currentExercise = document.querySelector('.exercise');
        if (currentExercise) {
            // Limpiar mensajes anteriores
            const previousMessages = currentExercise.querySelectorAll('.success-message, .error-message');
            previousMessages.forEach(msg => msg.remove());
            
            // Insertar el nuevo mensaje antes del input
            const inputGroup = currentExercise.querySelector('.input-group');
            if (inputGroup) {
                currentExercise.insertBefore(errorDiv, inputGroup);
            } else {
                currentExercise.appendChild(errorDiv);
            }
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

            console.log('Intento de inicio de sesión:', { email });

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
                
                // Actualizar UI y crear ejercicio
                updateAuthUI(true);
                
                // Recargar la página después de un breve retraso
                setTimeout(() => {
                    window.location.reload();
                }, 500);
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
    function initializeKeyboardEvents() {
        console.log('Inicializando eventos del teclado virtual...');
        
        // Primero, remover eventos existentes
        const existingKeys = document.querySelectorAll('.key');
        existingKeys.forEach(key => {
            key.replaceWith(key.cloneNode(true));
        });
        
        // Agregar nuevos eventos
        const keys = document.querySelectorAll('.key');
        console.log('Teclas encontradas:', keys.length);
        
        keys.forEach(key => {
            key.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Tecla clickeada:', this.textContent);
                
                const exercise = this.closest('.exercise');
                if (!exercise) {
                    console.error('No se encontró el ejercicio');
                    return;
                }
                
                const input = exercise.querySelector('.exercise-input');
                if (!input) {
                    console.error('No se encontró el input');
                    return;
                }
                
                const value = this.textContent;
                
                switch(value) {
                    case 'C':
                        input.value = '';
                        break;
                    case '←':
                        input.value = input.value.slice(0, -1);
                        break;
                    case '=':
                        const checkButton = exercise.querySelector('.check-answer');
                        if (checkButton) {
                            checkButton.click();
                        }
                        break;
                    default:
                        input.value += value;
                }
                
                // Forzar el foco en el input después de cada click
                input.focus();
            });
        });
    }

    // Agregar evento de verificación a los botones de verificar respuesta
    function initializeCheckButtons() {
        const buttons = document.querySelectorAll('.check-answer');
        console.log('Inicializando botones de verificación. Botones encontrados:', buttons.length);
        
        buttons.forEach(button => {
            button.onclick = function() {
                console.log('Botón de verificar clickeado');
                checkAnswer();
            };
        });
    }

    // Función para verificar la respuesta
    function checkAnswer() {
        console.log('Función checkAnswer llamada');
        const currentExercise = document.querySelector('.exercise');
        if (!currentExercise) {
            console.error('No se encontró el ejercicio actual');
            return;
        }

        const input = currentExercise.querySelector('.exercise-input');
        const solution = currentExercise.querySelector('.exercise-solution');
        
        if (!input || !solution) {
            console.error('No se encontraron los elementos necesarios');
            return;
        }
        
        const answer = input.value.trim();
        console.log('Respuesta ingresada:', answer);
        
        // Obtener el nivel actual del ejercicio
        const levelText = currentExercise.querySelector('p').textContent;
        const level = parseInt(levelText.split('Nivel ')[1]) || 1;
        console.log('Nivel actual:', level);
        
        // Respuestas correctas para cada nivel
        const correctAnswers = {
            1: ['2x', 'f\'(x)=2x', 'f\'(x) = 2x'],
            2: ['(3x^2 + 2)(x^2 - 1) - (x^3 + 2x)(2x)/(x^2 - 1)^2'],
            3: ['(4x^3 + 6x)(x^3 - x) - (x^4 + 3x^2)(3x^2 - 1)/(x^3 - x)^2'],
            4: ['3(x^2 + 1)^2 * 2x * (x^3 - 2x) + (x^2 + 1)^3 * (3x^2 - 2)'],
            5: ['2(x^3 - x)(3x^2 - 1)(x^2 + 2x) + (x^3 - x)^2(2x + 2)']
        };
        
        // Normalizar la respuesta del usuario y las respuestas correctas
        const normalizedAnswer = answer.replace(/\s+/g, '').toLowerCase();
        const isCorrect = correctAnswers[level].some(correctAns => 
            correctAns.replace(/\s+/g, '').toLowerCase() === normalizedAnswer
        );
        
        console.log('¿Es correcta la respuesta?', isCorrect);
        
        if (isCorrect) {
            showSuccess('¡Correcto!');
            solution.style.display = 'block';
            
            // Esperar un momento antes de mostrar el siguiente nivel
            setTimeout(() => {
                const nextLevel = level + 1;
                if (nextLevel > 5) {
                    const completionMessage = document.createElement('div');
                    completionMessage.className = 'completion-message';
                    completionMessage.innerHTML = `
                        <h3>¡Felicitaciones!</h3>
                        <p>Has completado todos los niveles de derivadas.</p>
                        <button onclick="resetExercise()" class="btn-primary">Comenzar de nuevo</button>
                    `;
                    currentExercise.replaceWith(completionMessage);
                    return;
                }

                createNewExercise(nextLevel);
            }, 1500);
        } else {
            attempts--;
            updateAttemptsCounter();
            if (attempts <= 0) {
                showNoAttemptsMessage();
                createNewExercise(level);
            } else {
                showError('Incorrecto. Intenta de nuevo.');
            }
        }
    }

    // Función para mostrar mensaje de sin intentos
    function showNoAttemptsMessage() {
        const message = "Parece que te quedaste sin intentos, ¿comenzamos de nuevo?";
        if (confirm(message)) {
            resetExercise();
        }
    }

    // Función para obtener la función a derivar según el nivel
    function getExerciseFunction(level) {
        const functions = {
            1: 'x^2', // Nivel 1: Primera derivada simple
            2: '(x^3 + 2x)/(x^2 - 1)', // Nivel 2: Regla del cociente
            3: '(x^4 + 3x^2)/(x^3 - x)', // Nivel 3: Regla del cociente más compleja
            4: '(x^2 + 1)^3 * (x^3 - 2x)', // Nivel 4: Regla del producto y cadena
            5: '(x^3 - x)^2 * (x^2 + 2x)', // Nivel 5: Regla del producto y cadena
            6: '(x^4 + x^2)/(x^3 - 2x) * (x^2 + 1)', // Nivel 6: Combinación de cociente y producto
            7: '((x^2 + 1)^3)/(x^2 - 4)', // Nivel 7: Cociente con regla de la cadena
            8: '(x^3 + 2x) * (x^2 - 1)^3', // Nivel 8: Producto con regla de la cadena
            9: '((x^2 + 2x)^3)/(x^3 - x) * (x^2 + 1)', // Nivel 9: Combinación de todas las reglas
            10: '((x^3 + 1)^2 * (x^2 - x))/(x^2 + 2)' // Nivel 10: Combinación compleja de todas las reglas
        };
        return functions[level] || 'x^2';
    }

    // Función para obtener la solución según el nivel
    function getExerciseSolution(level) {
        const solutions = {
            1: '2x', // Primera derivada simple
            2: '(3x^2 + 2)(x^2 - 1) - (x^3 + 2x)(2x)/(x^2 - 1)^2', // Regla del cociente
            3: '(4x^3 + 6x)(x^3 - x) - (x^4 + 3x^2)(3x^2 - 1)/(x^3 - x)^2', // Regla del cociente más compleja
            4: '3(x^2 + 1)^2 * 2x * (x^3 - 2x) + (x^2 + 1)^3 * (3x^2 - 2)', // Regla del producto y cadena
            5: '2(x^3 - x)(3x^2 - 1)(x^2 + 2x) + (x^3 - x)^2(2x + 2)', // Regla del producto y cadena
            6: '((4x^3 + 2x)(x^3 - 2x) - (x^4 + x^2)(3x^2 - 2))/(x^3 - 2x)^2 * (x^2 + 1) + (x^4 + x^2)/(x^3 - 2x) * 2x', // Combinación de cociente y producto
            7: '3(x^2 + 1)^2 * 2x * (x^2 - 4) - ((x^2 + 1)^3) * 2x/(x^2 - 4)^2', // Cociente con regla de la cadena
            8: '(3x^2 + 2)(x^2 - 1)^3 + (x^3 + 2x) * 3(x^2 - 1)^2 * 2x', // Producto con regla de la cadena
            9: '(3(x^2 + 2x)^2(2x + 2)(x^3 - x) - (x^2 + 2x)^3(3x^2 - 1))/(x^3 - x)^2 * (x^2 + 1) + ((x^2 + 2x)^3)/(x^3 - x) * 2x', // Combinación de todas las reglas
            10: '((2(x^3 + 1)(3x^2)(x^2 - x) + (x^3 + 1)^2(2x - 1))(x^2 + 2) - (x^3 + 1)^2(x^2 - x)(2x))/(x^2 + 2)^2' // Combinación compleja de todas las reglas
        };
        return solutions[level] || '2x';
    }

    // Función para crear un nuevo ejercicio
    function createNewExercise(level = 1) {
        console.log('Creando nuevo ejercicio para nivel:', level);
        attempts = MAX_ATTEMPTS; // Reiniciar intentos al crear nuevo ejercicio
        
        const exerciseContainer = document.querySelector('.exercise-container');
        if (!exerciseContainer) {
            console.error('No se encontró el contenedor de ejercicios');
            return null;
        }

        // Crear el nuevo ejercicio
        const newExercise = document.createElement('div');
        newExercise.className = 'exercise';
        newExercise.innerHTML = `
            <p>Nivel ${level}. Deriva la función: \[f(x) = ${getExerciseFunction(level)}\]</p>
            <div class="input-group">
                <input type="text" class="exercise-input" placeholder="Escribe tu respuesta">
            </div>
            <div class="attempts-counter">
                Intentos restantes: <span id="attemptsCount">${MAX_ATTEMPTS}</span>
            </div>
            <div class="virtual-keyboard">
                <div class="keyboard-row">
                    <button type="button" class="key" data-value="7">7</button>
                    <button type="button" class="key" data-value="8">8</button>
                    <button type="button" class="key" data-value="9">9</button>
                    <button type="button" class="key" data-value="/">/</button>
                    <button type="button" class="key" data-value="(">(</button>
                    <button type="button" class="key" data-value=")">)</button>
                    <button type="button" class="key" data-value="'">'</button>
                </div>
                <div class="keyboard-row">
                    <button type="button" class="key" data-value="4">4</button>
                    <button type="button" class="key" data-value="5">5</button>
                    <button type="button" class="key" data-value="6">6</button>
                    <button type="button" class="key" data-value="*">*</button>
                    <button type="button" class="key" data-value="x">x</button>
                    <button type="button" class="key" data-value="^">^</button>
                    <button type="button" class="key" data-value="√">√</button>
                </div>
                <div class="keyboard-row">
                    <button type="button" class="key" data-value="1">1</button>
                    <button type="button" class="key" data-value="2">2</button>
                    <button type="button" class="key" data-value="3">3</button>
                    <button type="button" class="key" data-value="-">-</button>
                    <button type="button" class="key" data-value="+">+</button>
                    <button type="button" class="key" data-value=".">.</button>
                </div>
                <div class="keyboard-row">
                    <button type="button" class="key" data-value="0">0</button>
                    <button type="button" class="key" data-value="C">C</button>
                    <button type="button" class="key" data-value="←">←</button>
                    <button type="button" class="key" data-value="=">=</button>
                </div>
            </div>
            <button type="button" class="check-answer">Verificar Respuesta</button>
            <div class="exercise-solution" style="display: none;">
                <p>La solución es: \[f'(x) = ${getExerciseSolution(level)}\]</p>
            </div>
        `;

        // Limpiar el contenedor antes de agregar el nuevo ejercicio
        exerciseContainer.innerHTML = '';
        exerciseContainer.appendChild(newExercise);

        // Procesar MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([newExercise]).catch((err) => console.log('Error al procesar MathJax:', err));
        }

        console.log('Inicializando eventos para el nuevo ejercicio...');
        
        // Configurar eventos del teclado virtual
        const keys = newExercise.querySelectorAll('.key');
        const input = newExercise.querySelector('.exercise-input');
        const checkButton = newExercise.querySelector('.check-answer');

        console.log('Elementos encontrados:', {
            keysCount: keys.length,
            hasInput: !!input,
            hasCheckButton: !!checkButton
        });

        // Configurar eventos para cada tecla
        keys.forEach(key => {
            key.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                const value = this.getAttribute('data-value');
                console.log('Tecla presionada:', value);
                
                if (!input) {
                    console.error('No se encontró el campo de entrada');
                    return;
                }

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
                
                input.focus();
            });
        });

        // Configurar evento del botón de verificar
        if (checkButton) {
            checkButton.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Botón de verificar clickeado');
                checkAnswer();
            });
        }

        updateAttemptsCounter();
        return newExercise;
    }

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
        console.log('DOM cargado, inicializando...');
        initializeStepNavigation();
        
        // Crear el primer ejercicio si estamos en la página de práctica
        const exerciseContainer = document.querySelector('.exercise-container');
        if (exerciseContainer) {
            console.log('Creando primer ejercicio...');
            const firstExercise = createNewExercise();
            exerciseContainer.appendChild(firstExercise);
            attempts = MAX_ATTEMPTS;
            updateAttemptsCounter();
            
            // Inicializar eventos después de crear el primer ejercicio
            initializeKeyboardEvents();
            initializeCheckButtons();
        }
    });
});
