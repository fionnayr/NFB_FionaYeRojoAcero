//GH
//Muestra botón que dirige a la página Report
import React from "react";
import { navigate } from "@reach/router"; 


export function NavReport() {
  function goToReport() {
    navigate("/report") //Función navigate de la librería @reach/router que redirige al user a la pag final de Report
  }

  return (
    <nav className="card">
      <button onClick={goToReport} className="card-btn">
        Final Report
      </button>
    </nav>
  );
}