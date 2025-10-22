// Função para registrar usuário
function registrarUsuario(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const telefone = document.getElementById("phone").value;
    const senha = document.getElementById("password").value;
    const confirmarSenha = document.getElementById("confirm-password").value;

    if (senha !== confirmarSenha) {
        alert("As senhas não coincidem. Tente novamente!");
        return;
    }

    // Guardar os dados no navegador (LocalStorage)
    localStorage.setItem("usuarioTelefone", telefone);
    localStorage.setItem("usuarioSenha", senha);

    alert("Conta criada com sucesso!");
    window.location.href = "login.html"; // Vai para a página de login
}

// Função para login
function loginUsuario(event) {
    event.preventDefault();

    const telefoneDigitado = document.getElementById("login-phone").value;
    const senhaDigitada = document.getElementById("login-password").value;

    const telefoneGuardado = localStorage.getItem("usuarioTelefone");
    const senhaGuardada = localStorage.getItem("usuarioSenha");

    if (telefoneDigitado === telefoneGuardado && senhaDigitada === senhaGuardada) {
        alert("Login efetuado com sucesso!");
        window.location.href = "index.html"; // Redirecionar para o painel futuro
    } else {
        alert("Telefone ou senha incorretos!");
    }
      }
