import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "./components/Navbar";
import Cadastro from "./pages/Cadastro";
import QRCodeCreator from "./pages/QRCodeCreator";
import MeuQRs from "./pages/MeuQRs";
import QRPublicView from "./pages/QRPublicView";

function App() {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
  }, []);

  return (
    <BrowserRouter>
      <Navbar usuario={usuario} />

      <Routes>
        <Route path="/qr/:id" element={<QRPublicView />} />
        <Route
          path="/"
          element={usuario ? <QRCodeCreator usuario={usuario} /> : <Cadastro setUsuario={setUsuario} />}
        />
        <Route
          path="/criar"
          element={usuario ? <QRCodeCreator usuario={usuario} /> : <Cadastro setUsuario={setUsuario} />}
        />
        <Route
          path="/meus"
          element={usuario ? <MeuQRs usuario={usuario} /> : <Cadastro setUsuario={setUsuario} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
