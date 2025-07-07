<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ config('app.name') }} - Autenticação</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="<KEY>" crossorigin="anonymous">

    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <main class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
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
                <!-- Navegação das abas --><!-- Navegação das abas com Bootstrap -->
                <ul class="nav nav-tabs mb-4" id="formTabs" role="tablist">
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link active tab-button"
                            data-tab="login"
                            type="button"
                            role="tab"
                        >
                            <i class="fas fa-sign-in-alt me-1"></i> Login
                        </button>
                    </li>
                    <li class="nav-item" role="presentation">
                        <button
                            class="nav-link tab-button"
                            data-tab="register"
                            type="button"
                            role="tab"
                        >
                            <i class="fas fa-user-plus me-1"></i> Cadastrar
                        </button>
                    </li>
                </ul>


                <!-- Conteúdo das abas -->
                <div class="tab-content">
                    <!-- Aba Login -->
                    <div class="container mt-5" id="login-tab">
                        <div class="row justify-content-center">
                            <div class="col-md-6 col-lg-5">
                                <h2 class="text-center mb-4">Entrar na plataforma</h2>
                                <form id="login-form">
                                    <div class="mb-3">
                                        <label for="login-email" class="form-label">Email</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                            <input
                                                type="email"
                                                class="form-control"
                                                id="login-email"
                                                name="email"
                                                placeholder="seu@email.com"
                                                required
                                            >
                                        </div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="login-password" class="form-label">Senha</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                            <input
                                                type="password"
                                                class="form-control"
                                                id="login-password"
                                                name="password"
                                                placeholder="Sua senha"
                                                required
                                            >
                                        </div>
                                    </div>

                                    <div class="d-flex justify-content-between align-items-center mb-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" id="remember-me" name="remember">
                                            <label class="form-check-label" for="remember-me">Lembrar-me</label>
                                        </div>
                                        <a href="#" class="small text-decoration-none">Esqueceu a senha?</a>
                                    </div>

                                    <div class="d-grid">
                                        <button type="submit" id="submit-btn" class="btn btn-primary">
                                            <i class="fas fa-sign-in-alt me-2"></i>Entrar
                                        </button>
                                    </div>

                                    <div id="login-error" class="mt-3 text-danger text-center small"></div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <!-- Aba Registro -->
                    <div id="register-tab" class="tab-pane d-none">
                        <div class="container mt-4">
                            <div class="row justify-content-center">
                                <div class="col-md-6 col-lg-5">
                                    <h3 class="text-center mb-4">Criar Conta</h3>
                                    <form id="register-form">
                                        <div class="mb-3">
                                            <label for="register-name" class="form-label">Nome completo</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fas fa-user"></i></span>
                                                <input type="text" class="form-control" id="register-name" name="name" placeholder="Seu nome" required>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label for="register-email" class="form-label">Email</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                                                <input type="email" class="form-control" id="register-email" name="email" placeholder="seu@email.com" required>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label for="register-cpf" class="form-label">CPF</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fas fa-id-card"></i></span>
                                                <input
                                                    type="text"
                                                    class="form-control"
                                                    id="register-cpf"
                                                    name="cpf"
                                                    placeholder="000.000.000-00"
                                                    required
                                                >
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label for="register-password" class="form-label">Senha</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                                <input type="password" class="form-control" id="register-password" name="password" placeholder="Mínimo 8 caracteres" required>
                                            </div>
                                        </div>

                                        <div class="mb-3">
                                            <label for="register-password-confirmation" class="form-label">Confirmar senha</label>
                                            <div class="input-group">
                                                <span class="input-group-text"><i class="fas fa-lock"></i></span>
                                                <input type="password" class="form-control" id="register-password-confirmation" name="password_confirmation" placeholder="Confirme a senha" required>
                                            </div>
                                        </div>

                                        <div class="d-grid">
                                            <button type="submit" class="btn btn-success">
                                                <i class="fas fa-user-plus me-2"></i>Criar conta
                                            </button>
                                        </div>

                                        <div id="register-error" class="text-danger text-center mt-3 small"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        window.ENV = {
            API_BASE_URL: "{{ url('/api') }}"
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.0/axios.min.js"></script>
    @vite(['resources/js/User.js'])
</body>
</html>
