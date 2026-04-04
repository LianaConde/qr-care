import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { theme } from "../theme";

function QRPublicView() {
  const { id } = useParams();
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const ref = doc(db, "qrcodes", id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          setErro("QR Code nao encontrado.");
          return;
        }

        setDados(snapshot.data());
      } catch (err) {
        console.error(err);
        setErro("Nao foi possivel carregar as informacoes deste QR Code.");
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [id]);

  if (carregando) {
    return <div style={page}><div style={card}>Carregando informacoes...</div></div>;
  }

  if (erro) {
    return <div style={page}><div style={card}>{erro}</div></div>;
  }

  return (
    <div style={page}>
      <div style={card}>
        <p style={eyebrow}>QR Care</p>
        <h1 style={title}>{dados.nome || "Paciente"}</h1>
        <p style={subtitle}>Informacoes de apoio para atendimento rapido e seguro.</p>

        <div style={heroPanel}>
          <div style={heroItem}>
            <span style={heroLabel}>Contato</span>
            <strong>{dados.contato || "Nao informado"}</strong>
          </div>
          <div style={heroItem}>
            <span style={heroLabel}>PCD</span>
            <strong>{dados.pcd || "Nao informado"}</strong>
          </div>
        </div>

        <div style={section}>
          <h2 style={sectionTitle}>Dados principais</h2>
          <p><strong>Idade:</strong> {dados.idade || "Nao informada"}</p>
          <p><strong>PCD:</strong> {dados.pcd || "Nao informado"}</p>
          <p><strong>Contato de emergencia:</strong> {dados.contato || "Nao informado"}</p>
        </div>

        <div style={section}>
          <h2 style={sectionTitle}>Historico importante</h2>
          <p><strong>Alergias:</strong> {dados.alergias || "Nao informado"}</p>
          <p><strong>Medicamentos:</strong> {dados.medicamentos || "Nao informado"}</p>
          <p><strong>Cirurgias:</strong> {dados.cirurgias || "Nao informado"}</p>
          <p><strong>Como acalmar:</strong> {dados.acalmar || "Nao informado"}</p>
        </div>

        <div style={highlight}>
          <h2 style={sectionTitle}>Orientacao gerada pela IA</h2>
          <p style={preWrap}>{dados.instrucoes || "Nenhuma orientacao foi gerada."}</p>
        </div>
      </div>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  padding: "40px 16px",
  background: `linear-gradient(180deg, ${theme.colors.bgGradientStart} 0%, ${theme.colors.bgGradientEnd} 100%)`,
  display: "flex",
  justifyContent: "center"
};

const card = {
  width: "100%",
  maxWidth: 760,
  background: theme.colors.surface,
  borderRadius: 24,
  padding: 28,
  boxShadow: "0 20px 60px rgba(0,0,0,0.25)"
};

const eyebrow = {
  margin: 0,
  color: "#3EC1D3",
  fontWeight: "bold",
  letterSpacing: 1
};

const title = {
  margin: "8px 0 6px",
  color: theme.colors.primaryDark
};

const subtitle = {
  marginTop: 0,
  color: "#4A4A68"
};

const heroPanel = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 14,
  marginTop: 22
};

const heroItem = {
  background: "#F7FAFF",
  borderRadius: 16,
  padding: 16,
  border: `1px solid ${theme.colors.border}`
};

const heroLabel = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  color: theme.colors.textSoft,
  marginBottom: 6
};

const section = {
  marginTop: 24,
  padding: 18,
  background: "#F6F8FF",
  borderRadius: 16
};

const highlight = {
  marginTop: 24,
  padding: 18,
  background: "#EAFBFD",
  borderRadius: 16,
  border: "1px solid #BCEBF2"
};

const sectionTitle = {
  marginTop: 0,
  color: theme.colors.primaryDark
};

const preWrap = {
  marginBottom: 0,
  whiteSpace: "pre-wrap",
  lineHeight: 1.6
};

export default QRPublicView;
