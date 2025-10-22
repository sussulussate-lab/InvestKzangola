// ===============================
// ARQUIVO: auth.js
// Responsável pelo login e registro
// ===============================

// IMPORTAR URL DO BACKEND
// (vem do arquivo config.js)
console.log("✅ auth.js conectado com sucesso!");

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginMsg.textContent = "🔄 Validando...";
      loginMsg.style.color = "black";

      const telefone = document.getElementById("telefone").value;
      const senha = document.getElementById("senha").value;

      try {
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ telefone, senha })
        });

        const data = await response.json();

        if (response.ok) {
          loginMsg.textContent = "✅ Login bem-sucedido! Redirecionando...";
          loginMsg.style.color = "green";

          // Salvar dados no navegador
          localStorage.setItem("token", data.token);
          localStorage.setItem("nome", data.nome);
          localStorage.setItem("saldo", data.saldo);
          localStorage.setItem("telefone", telefone);

          // Redirecionar para o painel
          setTimeout(() => {
            window.location.href = "dashboard.html";
          }, 1500);
        } else {
          loginMsg.textContent = data.message || "❌ Telefone ou senha incorretos";
          loginMsg.style.color = "red";
        }
      } catch (error) {
        console.error(error);
        loginMsg.textContent = "❌ Erro de conexão com o servidor";
        loginMsg.style.color = "red";
      }
    });
  }
});
