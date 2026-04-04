import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import logo from "../assets/logo.png";
import { theme } from "../theme";

function Navbar({ usuario }) {
  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div style={navWrap}>
      <div style={nav}>
        <Link to={usuario ? "/criar" : "/"} style={brand}>
          <img src={logo} alt="QR Care" style={logoStyle} />
          <div>
            <div style={brandTitle}>QR Care</div>
            <div style={brandSubtitle}>Informacoes essenciais ao alcance do QR</div>
          </div>
        </Link>

        <div style={right}>
          <Link style={link} to="/criar">Criar QR</Link>
          <Link style={link} to="/meus">Meus QR Codes</Link>
          {usuario && <span style={pill}>Conectado</span>}
          {usuario && <button onClick={logout} style={btn}>Sair</button>}
        </div>
      </div>
    </div>
  );
}

const navWrap = {
  position: "relative",
  zIndex: 1,
  padding: "18px 18px 0"
};

const nav = {
  maxWidth: theme.layout.contentWidth,
  margin: "0 auto",
  minHeight: 82,
  background: "rgba(13, 27, 82, 0.92)",
  backdropFilter: "blur(12px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "14px 22px",
  borderRadius: 22,
  boxShadow: "0 18px 50px rgba(9, 18, 54, 0.22)"
};

const brand = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  textDecoration: "none",
  minWidth: 0
};

const logoStyle = {
  height: 56,
  width: 56,
  objectFit: "contain",
  borderRadius: 16,
  background: "rgba(255,255,255,0.08)",
  padding: 6
};

const brandTitle = {
  color: "#FFFFFF",
  fontWeight: 800,
  fontSize: 18
};

const brandSubtitle = {
  color: "rgba(255,255,255,0.76)",
  fontSize: 12
};

const right = {
  display: "flex",
  gap: 14,
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "flex-end"
};

const link = {
  color: "#FFFFFF",
  textDecoration: "none",
  fontWeight: 600,
  padding: "10px 14px",
  borderRadius: 999,
  background: "rgba(255,255,255,0.06)"
};

const pill = {
  color: "#D8FFF5",
  background: "rgba(19, 138, 90, 0.24)",
  padding: "8px 12px",
  borderRadius: 999,
  fontWeight: 700,
  fontSize: 12
};

const btn = {
  background: "#FF6B6B",
  border: "none",
  padding: "10px 16px",
  color: "white",
  borderRadius: 999,
  cursor: "pointer",
  fontWeight: 700
};

export default Navbar;
