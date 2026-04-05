import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { QRCodeCanvas } from "qrcode.react";
import { theme } from "../theme";

function MeuQRs({ usuario }) {
  const [qrs, setQrs] = useState([]);
  const [apagandoId, setApagandoId] = useState("");

  useEffect(() => {
    if (!usuario) return;

    const buscarQrs = async () => {
      const q = query(
        collection(db, "qrcodes"),
        where("usuarioId", "==", usuario.uid)
      );

      const snapshot = await getDocs(q);
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setQrs(lista);
    };

    buscarQrs();
  }, [usuario]);

  const apagarQr = async (id) => {
    const confirmar = window.confirm("Tem certeza que deseja apagar este QR Code?");

    if (!confirmar) {
      return;
    }

    try {
      setApagandoId(id);
      await deleteDoc(doc(db, "qrcodes", id));
      setQrs((listaAtual) => listaAtual.filter((qr) => qr.id !== id));
    } catch (err) {
      console.error(err);
      alert("Nao foi possivel apagar o QR Code.");
    } finally {
      setApagandoId("");
    }
  };

  return (
    <div style={container}>
      <div style={header}>
        <div>
          <span style={badge}>Biblioteca</span>
          <h1 style={title}>Meus QR Codes</h1>
          <p style={subtitle}>Acompanhe os cadastros criados e abra a visualizacao publica de cada paciente.</p>
        </div>
      </div>

      {qrs.length === 0 ? (
        <div style={emptyState}>
          Nenhum QR Code foi salvo ainda. Crie o primeiro cadastro para ver tudo organizado aqui.
        </div>
      ) : (
        <div style={grid}>
          {qrs.map((qr) => (
            <div key={qr.id} style={card}>
              <div>
                <p style={name}><strong>{qr.nome}</strong></p>
                <p style={meta}>Contato: {qr.contato || "Nao informado"}</p>
              </div>
              <div style={canvasWrap}>
                <QRCodeCanvas value={`${window.location.origin}/qr/${qr.id}`} size={130} />
              </div>
              <a
                href={`${window.location.origin}/qr/${qr.id}`}
                target="_blank"
                rel="noreferrer"
                style={link}
              >
                Abrir visualizacao
              </a>
              <button
                type="button"
                onClick={() => apagarQr(qr.id)}
                style={deleteButton(apagandoId === qr.id)}
                disabled={apagandoId === qr.id}
              >
                {apagandoId === qr.id ? "Apagando..." : "Apagar QR Code"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const container = {
  maxWidth: theme.layout.contentWidth,
  margin: "0 auto",
  padding: "26px 18px 48px"
};

const header = {
  marginBottom: 22
};

const badge = {
  display: "inline-block",
  padding: "8px 14px",
  borderRadius: 999,
  background: theme.colors.accentSoft,
  color: theme.colors.primaryDark,
  fontWeight: 700,
  marginBottom: 12
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

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: 20
};

const card = {
  background: theme.colors.surface,
  padding: 20,
  borderRadius: theme.radius.md,
  boxShadow: theme.colors.shadow,
  border: `1px solid ${theme.colors.border}`,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};

const name = {
  marginBottom: 6,
  color: theme.colors.primaryDark
};

const meta = {
  marginTop: 0,
  color: theme.colors.textSoft
};

const canvasWrap = {
  background: theme.colors.surfaceSoft,
  padding: 18,
  borderRadius: 18,
  margin: "10px 0 16px"
};

const link = {
  display: "block",
  width: "100%",
  marginTop: "auto",
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: "bold",
  background: theme.colors.primary,
  padding: "12px 14px",
  borderRadius: 12
};

const deleteButton = (apagando) => ({
  width: "100%",
  marginTop: 10,
  border: "none",
  borderRadius: 12,
  padding: "12px 14px",
  background: apagando ? "#D8A1A1" : "#FF6B6B",
  color: "#FFFFFF",
  fontWeight: "bold",
  cursor: apagando ? "not-allowed" : "pointer",
  opacity: apagando ? 0.8 : 1
});

const emptyState = {
  background: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: 28,
  color: theme.colors.textSoft,
  boxShadow: theme.colors.shadow
};

export default MeuQRs;
