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

    // Función para actualizar la interfaz de autenticación
    function updateAuthUI(isLoggedIn) {
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        const logoutButton = document.getElementById('logoutButton');

        if (isLoggedIn) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            logoutButton.style.display = 'none';
        }
    }

    // Función para cerrar sesión
    function logout() {
        clearUserSession();
        updateAuthUI(false);
        console.log('Sesión cerrada');
    }

    // Verificar sesión al cargar la página
    if (checkUserSession()) {
        updateAuthUI(true);
    } else {
        updateAuthUI(false);
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
                return JSON.parse(storedUsers);
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

    // Funciones de autenticación
    function saveUserSession(user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('sessionTimestamp', new Date().getTime().toString());
        localStorage.setItem('lastActive', new Date().getTime().toString());
    }

    function clearUserSession() {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('sessionTimestamp');
        localStorage.removeItem('lastActive');
    }

    function checkUserSession() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const sessionTimestamp = localStorage.getItem('sessionTimestamp');
        const lastActive = localStorage.getItem('lastActive');
        
        if (isLoggedIn && currentUser && sessionTimestamp) {
            // Verificar si la sesión es válida (menos de 24 horas)
            const currentTime = new Date().getTime();
            const sessionAge = currentTime - parseInt(sessionTimestamp);
            const maxSessionAge = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

            if (sessionAge < maxSessionAge) {
                // Actualizar último tiempo activo
                localStorage.setItem('lastActive', currentTime.toString());
                
                // Solo mostrar contenido educativo
                document.getElementById('educational-content').style.display = 'block';
                return true;
            } else {
                // Si la sesión es muy antigua, la limpiamos
                clearUserSession();
            }
        }
        return false;
    }

    // Manejar inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log('Formulario de login enviado');
            
            const email = loginForm.email.value;
            const password = loginForm.password.value;
            
            console.log('Email:', email);
            console.log('Password:', password);

            if (!email || !password) {
                showError('Por favor, completa todos los campos');
                return;
            }

            // Obtener usuarios actuales del localStorage
            const currentUsers = getUsers();
            console.log('Usuarios en localStorage al momento del login:', currentUsers);

            // Verificar credenciales
            if (currentUsers[email] && currentUsers[email] === password) {
                showSuccess('¡Inicio de sesión exitoso!');
                
                // Guardar sesión activa
                saveUserSession({ email });
            } else {
                showError('Correo o contraseña incorrectos');
                console.log('Intento de login fallido. Usuario:', email);
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
            
            // Si es el ejercicio 1, mostrar el ejercicio 2
            if (exerciseNumber === '1') {
                setTimeout(() => {
                    const exercisesContainer = document.querySelector('.exercises');
                    const exercise2 = document.createElement('div');
                    exercise2.className = 'exercise';
                    exercise2.innerHTML = `
                        <p>2. Deriva la función: $f(x) = x√x</p>
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
                            <p>La solución es: $f'(x) = \\frac{3}{2}\\sqrt{x}$</p>
                        </div>
                    `;
                    exercisesContainer.appendChild(exercise2);
                    
                    // Forzar a MathJax a reprocesar el contenido nuevo
                    if (window.MathJax) {
                        MathJax.typesetPromise([exercise2]).catch((err) => console.log('Error al procesar MathJax:', err));
                    }
                    
                    // Reiniciar el contador de intentos para el ejercicio 2
                    attempts = MAX_ATTEMPTS;
                    updateAttemptsCounter();
                    
                    // Agregar el evento de verificación al nuevo botón
                    const newCheckButton = exercise2.querySelector('.check-answer');
                    newCheckButton.addEventListener('click', checkAnswer);
                    
                    // Agregar eventos a las teclas del nuevo teclado virtual
                    const newKeyboard = exercise2.querySelector('.virtual-keyboard');
                    newKeyboard.querySelectorAll('.key').forEach(key => {
                        key.addEventListener('click', () => {
                            const newInput = exercise2.querySelector('.exercise-input');
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
            }
        } else {
            attempts--;
            updateAttemptsCounter();
            if (attempts <= 0) {
                showNoAttemptsMessage();
            } else {
                showError('Incorrecto. Intenta de nuevo.');
            }
        }
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
        initializeStepNavigation();
    });
});
