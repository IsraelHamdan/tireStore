<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - Autenticação</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
<div class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
        <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                {{ config('app.name') }}
            </h2>
            <p class="mt-2 text-center text-sm text-gray-600">
                Faça login ou crie sua conta
            </p>
        </div>

        <!-- Container das abas -->
        <div class="bg-white rounded-lg shadow-lg p-6">
            <!-- Navegação das abas -->
            <div class="flex border-b border-gray-200 mb-6">
                <button
                    class="tab-button px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 focus:outline-none transition-colors active"
                    data-tab="login"
                >
                    <i class="fas fa-sign-in-alt mr-2"></i>Login
                </button>
                <button
                    class="tab-button px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 border-transparent hover:text-indigo-600 hover:border-indigo-600 focus:outline-none transition-colors ml-4"
                    data-tab="register"
                >
                    <i class="fas fa-user-plus mr-2"></i>Cadastrar
                </button>
            </div>

            <!-- Conteúdo das abas -->
            <div class="tab-content">
                <!-- Aba Login -->
                <div id="login-tab" class="tab-pane active">
                    <form id="login-form" action="{{ route('auth.login') }}" method="POST">
                        @csrf
                        <div class="space-y-4">
                            <div>
                                <label for="login-email" class="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div class="mt-1 relative">
                                    <input
                                        id="login-email"
                                        name="email"
                                        type="email"
                                        autocomplete="email"
                                        required
                                        value="{{ old('email') }}"
                                        class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="seu@email.com"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-envelope text-gray-400"></i>
                                    </div>
                                </div>
                                @error('email')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="login-password" class="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <div class="mt-1 relative">
                                    <input
                                        id="login-password"
                                        name="password"
                                        type="password"
                                        autocomplete="current-password"
                                        required
                                        class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Sua senha"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-lock text-gray-400"></i>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember"
                                        type="checkbox"
                                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    >
                                    <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                                        Lembrar de mim
                                    </label>
                                </div>

                                <div class="text-sm">
                                    <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                                        Esqueceu sua senha?
                                    </a>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                >
                                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                            <i class="fas fa-sign-in-alt text-indigo-500 group-hover:text-indigo-400"></i>
                                        </span>
                                    Entrar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Aba Registro -->
                <div id="register-tab" class="tab-pane hidden">
                    <form id="register-form" action="{{ route('user.create') }}" method="POST">
                        @csrf
                        <div class="space-y-4">
                            <div>
                                <label for="register-name" class="block text-sm font-medium text-gray-700">
                                    Nome completo
                                </label>
                                <div class="mt-1 relative">
                                    <input
                                        id="register-name"
                                        name="name"
                                        type="text"
                                        autocomplete="name"
                                        required
                                        value="{{ old('name') }}"
                                        class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Seu nome completo"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-user text-gray-400"></i>
                                    </div>
                                </div>
                                @error('name')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="register-email" class="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div class="mt-1 relative">
                                    <input
                                        id="register-email"
                                        name="email"
                                        type="email"
                                        autocomplete="email"
                                        required
                                        value="{{ old('email') }}"
                                        class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="seu@email.com"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-envelope text-gray-400"></i>
                                    </div>
                                </div>
                                @error('email')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="register-password" class="block text-sm font-medium text-gray-700">
                                    Senha
                                </label>
                                <div class="mt-1 relative">
                                    <input
                                        id="register-password"
                                        name="password"
                                        type="password"
                                        autocomplete="new-password"
                                        required
                                        class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Mínimo 8 caracteres"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-lock text-gray-400"></i>
                                    </div>
                                </div>
                                @error('password')
                                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                                @enderror
                            </div>

                            <div>
                                <label for="register-password-confirmation" class="block text-sm font-medium text-gray-700">
                                    Confirmar senha
                                </label>
                                <div class="mt-1 relative">
                                    <input
                                        id="register-password-confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        autocomplete="new-password"
                                        required
                                        class="appearance-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Confirme sua senha"
                                    >
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <i class="fas fa-lock text-gray-400"></i>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                >
                                        <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                            <i class="fas fa-user-plus text-green-500 group-hover:text-green-400"></i>
                                        </span>
                                    Criar conta
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Loading overlay -->
<div id="loading-overlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
    <div class="bg-white p-6 rounded-lg">
        <div class="flex items-center space-x-3">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span class="text-gray-700">Processando...</span>
        </div>
    </div>
</div>

<script>
    // Configuração do CSRF token
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Controle das abas
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active', 'text-indigo-600', 'border-indigo-600'));
            tabPanes.forEach(pane => pane.classList.add('hidden'));

            // Add active class to clicked button
            button.classList.add('active', 'text-indigo-600', 'border-indigo-600');

            // Show corresponding pane
            document.getElementById(targetTab + '-tab').classList.remove('hidden');
        });
    });

    // Intercepta os formulários para mostrar loading
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', () => {
            document.getElementById('loading-overlay').classList.remove('hidden');
        });
    });

    // Oculta loading se houver erros
    @if($errors->any())
    document.getElementById('loading-overlay').classList.add('hidden');
    @endif

    // Alterna para a aba de registro se houver erros específicos
    @if($errors->has('name') || $errors->has('password_confirmation'))
    document.querySelector('[data-tab="register"]').click();
    @endif
</script>
</body>
</html>
