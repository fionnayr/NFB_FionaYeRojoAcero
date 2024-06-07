//GH
//Muestra botón que dirige a la página Brainwaves
import React from "react";
import { navigate } from "@reach/router"; 


export function NavBw() {
  function goToBrainwaves() {
    navigate("/brainwaves") //Función navigate de la librería @reach/router que redirige al user a la pag de brainwaves
  }

  return (
    <nav className="card-bw">
      <button onClick={goToBrainwaves} className="card-btn-bw">
        Start experiment
      </button>
    </nav>
  );
}
