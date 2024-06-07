import React from "react";
import instrPic from './instructions.png';
import { navigate } from "@reach/router"; 

export function NavInstructions() {
  function goToInstructions() {
    navigate("/pageInstructions");
  }

  return (
    <nav className="card-instructions">
      <button onClick={goToInstructions} className="card-btn-instr">
        Instructions page
        <p></p>
        <img src={instrPic} style={{ width: '75px', height: '60px' }}></img>
      </button>
    </nav>
  );
}
