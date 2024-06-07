//GH
//Muestra botón que dirige a la página Home o Report
import React from "react";
import { navigate } from "@reach/router";
import casita from './casita.png'; 
import graph from './graph.png'

export function Navhomereport() {
  function goToHome() {
    navigate("/home") //Función navigate de la librería @reach/router que redirige al user a la pag de home
  }
  
  function goToReport() {
    navigate("/report") //Función navigate de la librería @reach/router que redirige al user a la pag final de Report
  }

  return (
    <nav className="card-homereport">
      <button onClick={goToHome} className="card-btn-homereporthome">
          Home 
          <p></p>
          <img src={casita} style={{ width: '30px', height: '30px' }}></img>
      </button>
      <button onClick={goToReport} className="card-btn-homereportreport">
        Final Report
        <p></p>
        <img src={graph} style={{ width: '30px', height: '30px' }}></img>
      </button>
    </nav>
  );
}