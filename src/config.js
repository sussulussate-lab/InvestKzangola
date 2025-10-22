// src/config.js
// No frontend usa esta variável para apontar para o backend real.
// Se estiveres a testar localmente usa http://localhost:3000
const API_BASE_URL = (function() {
  // tenta obter do localStorage (se configuraste) ou usa localhost
  return window.API_BASE_URL || "http://localhost:3000";
})();
console.log("API_BASE_URL:", API_BASE_URL);
