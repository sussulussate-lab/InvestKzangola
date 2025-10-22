
/* ======================= */
/* TELA DE LOGIN E REGISTRO */
/* ======================= */

.auth-body {
  background: linear-gradient(to bottom, var(--preto) 50%, var(--vermelho) 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.auth-container {
  background: var(--branco);
  width: 100%;
  max-width: 380px;
  border-radius: 8px;
  box-shadow: 0 4px 8px var(--sombra);
  padding: 20px;
  text-align: center;
}

.auth-header .logo {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
}

.auth-form {
  margin-top: 15px;
  text-align: left;
}

.auth-form label {
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
  color: var(--preto);
}

.auth-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid var(--cinza-escuro);
  border-radius: 4px;
}

.auth-message {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}

.auth-footer {
  margin-top: 15px;
  font-size: 14px;
}

.link-dourado {
  color: var(--dourado);
  font-weight: bold;
}

.link-voltar {
  display: inline-block;
  margin-top: 10px;
  color: var(--vermelho);
  text-decoration: none;
}

.link-voltar:hover {
  text-decoration: underline;
}
