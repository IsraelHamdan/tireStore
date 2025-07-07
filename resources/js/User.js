const API_BASE_URL = window.ENV?.API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Faz o login
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const errorDiv = document.getElementById('login-error');

    // Segurança extra: checar se elementos existem
    if (loginForm && submitBtn) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Impede o submit tradicional

            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            try {
                const response = await api.post('/auth/login', { email, password });

                const token = response.data.token;
                document.cookie = `auth_token=${token}; path=/`;

                window.location.href = '/welcome';
            } catch (error) {
                console.error(error);

                if (error.response?.data?.message) {
                    errorDiv.textContent = error.response.data.message;
                } else {
                    errorDiv.textContent = 'Erro ao fazer login. Verifique os dados e tente novamente.';
                }
            }
        });
    } else {
        console.warn("Formulário ou botão de submit não encontrado.");
    }
});

// cria o usuário
document.addEventListener('DOMContentLoaded', async (e) => {
    e.preventDefault();
    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');
    const cpfInput = document.getElementById('register-cpf');

    // Aplicar máscara ao CPF
    aplicarMascaraCPF(cpfInput);

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const cpf = cpfInput.value.replace(/\D/g, ''); // remove a pontuação
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-password-confirmation').value;

            if (password !== confirmPassword) {
                errorDiv.textContent = "As senhas não coincidem.";
                return;
            }
            if (!/^\d{11}$/.test(cpf)) {
                errorDiv.textContent = "O CPF deve conter exatamente 11 dígitos numéricos.";
                return;
            }

            const payload = {
                name: name,
                email: email,
                password: password,
                cpf: cpf,
            }

            await doRequestRegister(payload)


        });
    }

});

// muda o formulário conforme a seleção
document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault()
    const tabButtons = document.querySelectorAll('.tab-button');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.getAttribute('data-tab');

            // Alterna visualmente as abas
            if (target === 'login') {
                loginTab.classList.remove('d-none');
                loginTab.classList.add('d-block');
                registerTab.classList.remove('d-block');
                registerTab.classList.add('d-none');
            } else if (target === 'register') {
                registerTab.classList.remove('d-none');
                registerTab.classList.add('d-block');
                loginTab.classList.remove('d-block');
                loginTab.classList.add('d-none');
            }

            // Alterna visualmente os botões ativos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
});


function aplicarMascaraCPF(campo) {
    campo.addEventListener('input', () => {
        let valor = campo.value.replace(/\D/g, '');

        if (valor.length > 11) valor = valor.slice(0, 11);

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        campo.value = valor;
    });
}

async  function doRequestRegister(payload) {
    try {
        console.log(payload);
        const response = await api.post('/user/create', {
            name:payload.name,
            email:payload.email,
            cpf:payload.cpf,
            password:payload.password,
        });
        console.log(`Status da requisição ${response.status}`);
        if(response.status === 201){
            window.location.href = '/';
        }

    } catch (error) {
        console.error(error);
        if (error.response?.data?.message) {
            console.error(error.response.data.message)
        } else if (error.response?.data?.errors) {
            const firstError = Object.values(error.response.data.errors)[0][0];
            console.error(firstError)
        } else {
            console.error("Erro ao criar conta. Tente novamente.") ;
        }
    }

}


