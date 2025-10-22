// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connect, mongoose } = require("./database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar MongoDB
connect();

// MODELS
const UserSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  passwordHash: { type: String, required: true },
  withdrawalPasswordHash: { type: String },
  balance: { type: Number, default: 0 },
  referredBy: { type: String, default: null },
  tasksDoneToday: { type: Number, default: 0 },
  lastMaintenanceDate: { type: Date },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model("User", UserSchema);

const DepositSchema = new mongoose.Schema({
  userPhone: String,
  amount: Number,
  fee: Number,
  net: Number,
  status: { type: String, default: "pending" },
  proofPath: String,
  createdAt: { type: Date, default: Date.now },
  validatedBy: String,
  validatedAt: Date
});
const Deposit = mongoose.model("Deposit", DepositSchema);

// Helpers
const JWT_SECRET = process.env.JWT_SECRET || "token_dev_secret";
function createToken(user) {
  return jwt.sign({ phone: user.phone, id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "7d" });
}
async function hashPassword(pwd) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(pwd, salt);
}

// ROTA - health
app.get("/api/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// ROTA - register
app.post("/api/register", async (req, res) => {
  try {
    const { name, phone, email, password, referral } = req.body;
    if (!phone || !password) return res.status(400).json({ ok:false, message: "phone e password obrigatórios" });

    // Regras senha: >4 incluindo letras e números
    if (password.length <= 4 || !(/[0-9]/.test(password) && /[A-Za-z]/.test(password))) {
      return res.status(400).json({ ok:false, message: "Senha deve ter >4 caracteres e incluir letras e números" });
    }

    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ ok:false, message: "Usuário já existe" });

    const passwordHash = await hashPassword(password);
    const u = new User({
      name: name || "",
      phone,
      email: email || "",
      passwordHash,
      referredBy: referral || null,
      balance: 0
    });
    await u.save();

    // (Opcional) criar registo referral em outra coleção se quiseres — por agora guardamos referredBy
    const token = createToken(u);
    res.json({ ok:true, message: "Registo concluído", token, phone: u.phone, name: u.name });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ ok:false, message: "Erro interno" });
  }
});

// ROTA - login
app.post("/api/login", async (req, res) => {
  try {
    const { phone, password, telefone } = req.body;
    // Allow either phone or telefone field
    const ph = phone || telefone;
    if (!ph || !password) return res.status(400).json({ ok:false, message: "phone e password obrigatórios" });

    const user = await User.findOne({ phone: ph });
    if (!user) return res.status(404).json({ ok:false, message: "Usuário não encontrado" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ ok:false, message: "Senha inválida" });

    const token = createToken(user);
    res.json({ ok:true, token, phone: user.phone, name: user.name, saldo: user.balance });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ ok:false, message: "Erro interno" });
  }
});

// middleware auth
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ ok:false, message: "Token requerido" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ ok:false, message: "Token inválido" });
  }
}

// rota: perfil (protegida)
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.user.phone }).select("-passwordHash -withdrawalPasswordHash");
    if (!user) return res.status(404).json({ ok:false, message: "Usuário não encontrado" });
    res.json({ ok:true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok:false, message: "Erro interno" });
  }
});

// rota: depositos pendentes (admin)
app.get("/api/admin/deposits", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ ok:false, message: "Admin required" });
  const deps = await Deposit.find({ status: "pending" }).sort({ createdAt: -1 });
  res.json({ ok:true, deposits: deps });
});

// rota exemplo: aprovar depósito (admin)
app.post("/api/admin/deposit/approve", authMiddleware, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ ok:false, message: "Admin required" });
  const { depositId } = req.body;
  const dep = await Deposit.findById(depositId);
  if (!dep) return res.status(404).json({ ok:false, message: "Depósito não encontrado" });
  if (dep.status !== "pending") return res.status(400).json({ ok:false, message: "Depósito não pendente" });
  dep.status = "confirmed";
  dep.validatedBy = req.user.phone;
  dep.validatedAt = new Date();
  await dep.save();

  // creditar utilizador
  const u = await User.findOne({ phone: dep.userPhone });
  if (u) {
    u.balance = (u.balance || 0) + (dep.net || 0);
    await u.save();
  }

  res.json({ ok:true, message: "Depósito aprovado" });
});

// Servir frontend estático (caso queiras)
app.use(express.static(path.join(__dirname, "public")));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server rodando na porta ${PORT}`);
});
