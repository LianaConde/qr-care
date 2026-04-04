import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import { theme } from "../theme";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function QRCodeCreator({ usuario }) {
  const [dados, setDados] = useState({
    nome: "",
    idade: "",
    pcd: "",
    alergias: "",
    medicamentos: "",
    cirurgias: "",
    acalmar: "",
    contato: ""
  });

  const [descricao, setDescricao] = useState("");
  const [sugestaoIA, setSugestaoIA] = useState("");
  const [avisoIA, setAvisoIA] = useState("");
  const [qrData, setQrData] = useState("");
  const [qrLink, setQrLink] = useState("");
  const [gerandoIA, setGerandoIA] = useState(false);
  const [salvandoQR, setSalvandoQR] = useState(false);

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const gerarIA = async () => {
    try {
      if (!descricao.trim()) {
        alert("Digite algo para a IA");
        return;
      }

      setGerandoIA(true);

      const promptCompleto = `
Nome: ${dados.nome}
Idade: ${dados.idade}
PCD: ${dados.pcd}
Alergias: ${dados.alergias}
Medicamentos: ${dados.medicamentos}
Cirurgias: ${dados.cirurgias}
Como acalmar: ${dados.acalmar}
Contato: ${dados.contato}

Descricao adicional: ${descricao}
`.trim();

      const res = await axios.post(`${API_BASE_URL}/ia`, {
        descricao: promptCompleto
      });

      setSugestaoIA(res.data?.texto || "Erro ao gerar resposta");
      setAvisoIA(res.data?.aviso || "");
    } catch (err) {
      console.error("ERRO COMPLETO:", err);

      if (err.response) {
        const erroServidor =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data?.erro || err.response.data?.detalhes || "Erro desconhecido no servidor.";

        alert("Erro do servidor: " + erroServidor);
      } else {
        alert("Nao foi possivel conectar com a IA. Verifique se o comando 'npm start' esta rodando.");
      }
    } finally {
      setGerandoIA(false);
    }
  };

  const gerarQRCode = async () => {
    try {
      if (!usuario?.uid) {
        alert("Faca login antes de salvar e gerar o QR Code.");
        return;
      }

      if (!dados.nome.trim()) {
        alert("Preencha pelo menos o nome do paciente.");
        return;
      }

      setSalvandoQR(true);

      const data = {
        nome: dados.nome,
        idade: dados.idade,
        pcd: dados.pcd,
        alergias: dados.alergias,
        medicamentos: dados.medicamentos,
        cirurgias: dados.cirurgias,
        acalmar: dados.acalmar,
        contato: dados.contato,
        instrucoes: sugestaoIA,
        usuarioId: usuario.uid
      };

      const docRef = await addDoc(collection(db, "qrcodes"), data);
      const linkPublico = `${window.location.origin}/qr/${docRef.id}`;

      setQrLink(linkPublico);
      setQrData(linkPublico);
    } catch (err) {
      console.error(err);

      if (err?.code === "permission-denied") {
        alert("O Firestore bloqueou a gravacao. Verifique as regras do banco.");
      } else {
        alert("Erro ao salvar QR Code.");
      }
    } finally {
      setSalvandoQR(false);
    }
  };

  return (
    <div style={container}>
      <div style={hero}>
        <div>
          <span style={eyebrow}>Painel de criacao</span>
          <h1 style={title}>Monte um QR Code completo, claro e facil de consultar.</h1>
          <p style={description}>
            Reuna dados essenciais do paciente, gere orientacoes com IA e publique uma pagina pronta para leitura em situacoes de emergencia.
          </p>
        </div>
        <div style={statsCard}>
          <p style={statsLabel}>Fluxo sugerido</p>
          <p style={statsValue}>1. Preencha os dados</p>
          <p style={statsItem}>2. Gere a orientacao com IA</p>
          <p style={statsItem}>3. Salve e compartilhe o QR</p>
        </div>
      </div>

      <div style={contentGrid}>
        <div style={card}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Dados do paciente</h2>
            <p style={sectionText}>Esses campos aparecem na pagina que sera aberta ao ler o QR Code.</p>
          </div>

          <div style={gridTwo}>
            <input name="nome" placeholder="Nome completo" onChange={handleChange} style={input} />
            <input name="idade" placeholder="Idade" onChange={handleChange} style={input} />
          </div>
          <input name="pcd" placeholder="PCD ou condicao importante" onChange={handleChange} style={input} />
          <textarea name="alergias" placeholder="Alergias" onChange={handleChange} style={textarea} />
          <textarea name="medicamentos" placeholder="Medicamentos em uso" onChange={handleChange} style={textarea} />
          <textarea name="cirurgias" placeholder="Cirurgias ou historico relevante" onChange={handleChange} style={textarea} />
          <textarea name="acalmar" placeholder="Como acalmar ou abordar a pessoa" onChange={handleChange} style={textarea} />
          <textarea name="contato" placeholder="Contato de emergencia" onChange={handleChange} style={textarea} />

          <div style={iaBox}>
            <div style={sectionHeader}>
              <h2 style={sectionTitle}>Sugestao da IA</h2>
              <p style={sectionText}>Descreva sinais, comportamento ou contexto clinico para gerar instrucoes mais uteis.</p>
            </div>
            <textarea
              placeholder="Ex: pessoa autista, sensivel a barulho, usa medicamento X, pode entrar em crise..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={textareaLarge}
            />
            <button onClick={gerarIA} style={botaoIA(gerandoIA)} disabled={gerandoIA}>
              {gerandoIA ? "Gerando..." : "Gerar sugestao com IA"}
            </button>

            {avisoIA && (
              <div style={warningBox}>
                {avisoIA}
              </div>
            )}

            {sugestaoIA && (
              <div style={resultBox}>
                <strong style={{ color: theme.colors.primaryDark }}>Resposta da IA</strong>
                <p style={{ margin: "10px 0 0", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{sugestaoIA}</p>
              </div>
            )}
          </div>

          <button onClick={gerarQRCode} style={botaoPrincipal(salvandoQR)} disabled={salvandoQR}>
            {salvandoQR ? "Salvando..." : "Gerar QR Code"}
          </button>
        </div>

        <div style={sideColumn}>
          <div style={previewCard}>
            <p style={previewBadge}>Preview</p>
            <h3 style={previewTitle}>{dados.nome || "Paciente sem nome"}</h3>
            <p style={previewText}>Quando o QR for lido, esta sera a porta de entrada para as informacoes organizadas.</p>

            {qrData ? (
              <>
                <QRCodeCanvas value={qrData} size={190} />
                <a href={qrLink} target="_blank" rel="noreferrer" style={publicLink}>
                  {qrLink}
                </a>
              </>
            ) : (
              <div style={placeholderBox}>
                O QR aparecera aqui assim que o cadastro for salvo.
              </div>
            )}
          </div>

          <div style={tipsCard}>
            <h3 style={tipsTitle}>Dicas para um cadastro melhor</h3>
            <ul style={tipsList}>
              <li>Use o nome completo e um contato que realmente atenda rapido.</li>
              <li>Inclua alergias e medicamentos com a maior objetividade possivel.</li>
              <li>Na IA, descreva o contexto que um socorrista precisaria entender em segundos.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

const container = {
  maxWidth: theme.layout.contentWidth,
  margin: "0 auto",
  padding: "26px 18px 48px"
};

const hero = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 20,
  alignItems: "stretch",
  marginBottom: 24
};

const eyebrow = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 999,
  background: theme.colors.accentSoft,
  color: theme.colors.primaryDark,
  fontWeight: 700,
  marginBottom: 16
};

const title = {
  margin: "0 0 12px",
  fontSize: "clamp(2rem, 4vw, 3.3rem)",
  lineHeight: 1.05,
  color: theme.colors.primaryDark
};

const description = {
  margin: 0,
  maxWidth: 720,
  color: theme.colors.textSoft,
  lineHeight: 1.7,
  fontSize: 17
};

const statsCard = {
  background: "linear-gradient(145deg, #10356F 0%, #1B4D9B 100%)",
  color: "#FFFFFF",
  padding: 24,
  borderRadius: theme.radius.lg,
  boxShadow: theme.colors.shadow
};

const statsLabel = {
  margin: 0,
  opacity: 0.8
};

const statsValue = {
  margin: "12px 0 10px",
  fontSize: 24,
  fontWeight: 800
};

const statsItem = {
  margin: "8px 0 0",
  opacity: 0.92
};

const contentGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
  gap: 24,
  alignItems: "start",
  minWidth: 0
};

const card = {
  background: theme.colors.surface,
  padding: 26,
  borderRadius: theme.radius.lg,
  boxShadow: theme.colors.shadow,
  border: `1px solid ${theme.colors.border}`,
  minWidth: 0,
  overflow: "hidden"
};

const sideColumn = {
  display: "grid",
  gap: 20,
  minWidth: 0
};

const sectionHeader = {
  marginBottom: 14
};

const sectionTitle = {
  margin: "0 0 6px",
  color: theme.colors.primaryDark
};

const sectionText = {
  margin: 0,
  color: theme.colors.textSoft,
  lineHeight: 1.6
};

const gridTwo = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 12
};

const input = {
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  padding: 14,
  marginBottom: 12,
  borderRadius: 14,
  border: `1px solid ${theme.colors.border}`,
  background: theme.colors.surfaceSoft
};

const textarea = {
  ...input,
  display: "block",
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  minHeight: 86,
  resize: "vertical"
};

const textareaLarge = {
  ...textarea,
  minHeight: 120
};

const iaBox = {
  marginTop: 6,
  padding: 20,
  borderRadius: theme.radius.md,
  background: theme.colors.surfaceAlt
};

const botaoIA = (gerandoIA) => ({
  width: "100%",
  padding: 14,
  background: `linear-gradient(135deg, ${theme.colors.accent} 0%, ${theme.colors.primary} 100%)`,
  color: "white",
  border: "none",
  borderRadius: 14,
  cursor: gerandoIA ? "not-allowed" : "pointer",
  opacity: gerandoIA ? 0.7 : 1,
  fontWeight: 700
});

const botaoPrincipal = (salvandoQR) => ({
  width: "100%",
  padding: 14,
  background: theme.colors.primaryDark,
  color: "white",
  border: "none",
  borderRadius: 14,
  marginTop: 15,
  cursor: salvandoQR ? "not-allowed" : "pointer",
  fontWeight: "bold",
  opacity: salvandoQR ? 0.7 : 1
});

const resultBox = {
  marginTop: 16,
  background: "#FFFFFF",
  borderRadius: 14,
  border: `1px solid ${theme.colors.border}`,
  padding: 16
};

const warningBox = {
  marginTop: 16,
  background: "#FFF7E8",
  color: "#7A5B14",
  borderRadius: 14,
  border: "1px solid #F1D9A6",
  padding: 14,
  lineHeight: 1.6
};

const previewCard = {
  background: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.colors.shadow,
  border: `1px solid ${theme.colors.border}`,
  padding: 24,
  textAlign: "center"
};

const previewBadge = {
  display: "inline-block",
  margin: 0,
  padding: "7px 12px",
  borderRadius: 999,
  background: theme.colors.surfaceAlt,
  color: theme.colors.primary,
  fontWeight: 700
};

const previewTitle = {
  color: theme.colors.primaryDark,
  marginBottom: 8
};

const previewText = {
  color: theme.colors.textSoft,
  lineHeight: 1.6,
  marginTop: 0,
  marginBottom: 20
};

const publicLink = {
  display: "block",
  marginTop: 16,
  color: theme.colors.primary,
  wordBreak: "break-all",
  textDecoration: "none",
  fontWeight: 700
};

const placeholderBox = {
  borderRadius: 18,
  padding: 26,
  background: theme.colors.surfaceSoft,
  color: theme.colors.textSoft,
  lineHeight: 1.6
};

const tipsCard = {
  background: "linear-gradient(180deg, #EAFBFD 0%, #F7FAFF 100%)",
  borderRadius: theme.radius.lg,
  padding: 24,
  border: `1px solid ${theme.colors.border}`
};

const tipsTitle = {
  marginTop: 0,
  color: theme.colors.primaryDark
};

const tipsList = {
  margin: 0,
  paddingLeft: 20,
  color: theme.colors.textSoft,
  lineHeight: 1.8
};

export default QRCodeCreator;
