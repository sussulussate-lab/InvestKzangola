// src/dashboard.js
(async function() {
  const API = window.API_BASE_URL || "http://localhost:3000";
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  async function apiGet(path) {
    const r = await fetch(`${API}${path}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return r;
  }

  try {
    const resp = await apiGet("/api/profile");
    if (!resp.ok) {
      // token inválido ou outro erro — redirecionar para login
      localStorage.removeItem("token");
      window.location.href = "/login.html";
      return;
    }
    const data = await resp.json();
    const user = data.user;
    document.getElementById("userName").innerText = user.name || user.phone;
    document.getElementById("userPhone").innerText = user.phone;
    document.getElementById("saldo").innerText = (user.balance || 0) + " Kz";
    document.getElementById("tarefas").innerText = user.tasksDoneToday || 0;

    // histórico — por enquanto mock (pode ser rota real)
    const historyBody = document.getElementById("historyBody");
    historyBody.innerHTML = "";
    // exemplo de movimentos (vazio)
    const movements = []; // podes popular com rota real
    if (!movements.length) {
      historyBody.innerHTML = "<tr><td colspan='4'>Sem movimentos</td></tr>";
    } else {
      movements.forEach(m => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${new Date(m.date).toLocaleString()}</td><td>${m.desc}</td><td>${m.value}</td><td>${m.status}</td>`;
        historyBody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error(err);
    alert("Erro ao carregar dashboard.");
  }

  window.abrirDeposito = function() {
    alert("Funcionalidade de depósito será adicionada em seguida.");
  };
  window.abrirTarefas = function() {
    alert("Tarefas diárias virão em breve — interface criada.");
  };
})();
