const API_BASE_URL = window.ENV?.API_BASE_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Aguarda o DOM carregar totalmente
document.addEventListener('DOMContentLoaded', () => {
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
