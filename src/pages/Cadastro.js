import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { theme } from "../theme";

function Cadastro({ setUsuario }) {
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");

  const traduzirErro = (codigo) => {
    const mapa = {
      "auth/invalid-credential": "Email ou senha invalidos.",
      "auth/email-already-in-use": "Este email ja esta em uso.",
      "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
      "auth/invalid-email": "Digite um email valido."
    };

    return mapa[codigo] || "Nao foi possivel concluir a operacao.";
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const user = await signInWithEmailAndPassword(auth, email, senha);

      if (!user.user.emailVerified) {
        setMensagem("Verifique seu email antes de entrar.");
        return;
      }

      setUsuario(user.user);
    } catch (err) {
      console.error("ERRO REAL:", err.message);
      setErro(traduzirErro(err.code));
    }
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      await setDoc(doc(db, "usuarios", user.uid), {
        nome,
        cpf,
        telefone,
        email
      });

      await sendEmailVerification(user);

      setMensagem("Cadastro realizado. Verifique seu email.");
      setModo("login");
    } catch (err) {
      setErro(traduzirErro(err.code));
      console.error(err);
    }
  };

  const resetSenha = async () => {
    if (!email) {
      alert("Digite o email");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("Email de recuperacao enviado.");
    } catch (err) {
      setErro(traduzirErro(err.code));
    }
  };

  return (
    <div style={page}>
      <div style={hero}>
        <span style={heroBadge}>Emergencia com contexto</span>
        <h1 style={heroTitle}>Crie QR Codes com informacoes essenciais e orientacoes da IA.</h1>
        <p style={heroText}>
          Organize dados do paciente, gere instrucoes claras para atendimento e compartilhe tudo por meio de um QR Code simples de ler.
        </p>
      </div>

      <form onSubmit={modo === "login" ? handleLogin : handleCadastro} style={card}>
        <div style={header}>
          <span style={formBadge}>{modo === "login" ? "Acesso" : "Nova conta"}</span>
          <h2 style={title}>{modo === "login" ? "Entrar na plataforma" : "Criar conta"}</h2>
          <p style={subtitle}>Use seu email para gerenciar os QR Codes e acompanhar tudo em um so lugar.</p>
        </div>

        {modo === "cadastro" && (
          <>
            <input placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} style={input} />
            <input placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} style={input} />
            <input placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} style={input} />
          </>
        )}

        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
        <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} style={input} />

        <button style={button}>
          {modo === "login" ? "Entrar" : "Cadastrar"}
        </button>

        <p onClick={() => setModo(modo === "login" ? "cadastro" : "login")} style={toggle}>
          {modo === "login" ? "Criar nova conta" : "Ja tenho conta"}
        </p>

        {modo === "login" && (
          <p onClick={resetSenha} style={resetLink}>
            Esqueci minha senha
          </p>
        )}

        {erro && <p style={errorText}>{erro}</p>}
        {mensagem && <p style={successText}>{mensagem}</p>}
      </form>
    </div>
  );
}

const page = {
  minHeight: "calc(100vh - 120px)",
  maxWidth: theme.layout.contentWidth,
  margin: "0 auto",
  padding: "32px 18px 48px",
  display: "grid",
  gridTemplateColumns: "1.1fr 0.9fr",
  gap: 28,
  alignItems: "center"
};

const hero = {
  color: theme.colors.text
};

const heroBadge = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 999,
  background: theme.colors.accentSoft,
  color: theme.colors.primaryDark,
  fontWeight: 700,
  marginBottom: 16
};

const heroTitle = {
  fontSize: "clamp(2rem, 4vw, 3.6rem)",
  lineHeight: 1.05,
  margin: "0 0 16px",
  color: theme.colors.primaryDark
};

const heroText = {
  maxWidth: 560,
  fontSize: 18,
  lineHeight: 1.7,
  color: theme.colors.textSoft
};

const card = {
  background: theme.colors.surface,
  padding: 30,
  borderRadius: theme.radius.lg,
  width: "100%",
  boxShadow: theme.colors.shadow,
  border: `1px solid ${theme.colors.border}`
};

const header = {
  marginBottom: 18
};

const formBadge = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 999,
  background: theme.colors.surfaceAlt,
  color: theme.colors.primary,
  fontWeight: 700,
  marginBottom: 10
};

const title = {
  margin: "0 0 8px",
  color: theme.colors.primaryDark
};

const subtitle = {
  margin: 0,
  color: theme.colors.textSoft,
  lineHeight: 1.6
};

const input = {
  width: "100%",
  padding: 14,
  marginBottom: 12,
  borderRadius: 14,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.surfaceSoft
};

const button = {
  width: "100%",
  padding: 14,
  background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
  color: "#FFFFFF",
  border: "none",
  borderRadius: 14,
  fontWeight: 700,
  cursor: "pointer",
  marginTop: 6
};

const toggle = {
  textAlign: "center",
  marginTop: 16,
  cursor: "pointer",
  color: theme.colors.primary,
  fontWeight: 700
};

const resetLink = {
  textAlign: "center",
  cursor: "pointer",
  fontSize: 14,
  color: theme.colors.textSoft
};

const errorText = {
  color: theme.colors.danger,
  background: "#FFF1F1",
  padding: 12,
  borderRadius: 12,
  marginBottom: 0
};

const successText = {
  color: theme.colors.success,
  background: "#EDF9F3",
  padding: 12,
  borderRadius: 12,
  marginBottom: 0
};

export default Cadastro;
