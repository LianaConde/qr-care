import React, { useState } from "react";
import Cadastro from "./Cadastro";
import QRCodeCreator from "./QRCodeCreator";

function CriarQR() {
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <Cadastro setUsuario={setUsuario} />;
  }

  return <QRCodeCreator usuario={usuario} />;
}

export default CriarQR;