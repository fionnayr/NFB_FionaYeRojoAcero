//GH
//Muestra botón que dirige a la página Home
import React from "react";
import { navigate } from "@reach/router"; 
import casita from './casita.png'; 


export function NavHome() {
  function goToHome() {
    navigate("/home") //Función navigate de la librería @reach/router que redirige al user a la pag de home
  }

  return (
    <nav className="card-home">
      <button onClick={goToHome} className="card-btn-home">
        Home
        <p></p>
        <img src={casita} style={{ width: '30px', height: '30px' }}></img>
      </button>
    </nav>
  );
}