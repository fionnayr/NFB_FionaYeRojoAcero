//GH
//AUTENTICACIÓN. El objetivo de esta página es mostrar el formulario de inicio de sesión (src/components/LoginForm.js).
//La función setError agrega una validación del formulario.
//La ejecución de la función de login() es un Efecto Secundario que sincroniza email y password con los accesorios recibidos en la pagina. Llamamos a esta función si no hay una sesión de autenticación, si hay una instancia de Neurosity en el estado y si el usuario ha enviado un email y contraseña
//USER: objeto que contiene la sesión de autenticación de SDK Neurosity

import React, { useState, useEffect } from "react"; //Autenticación
import { navigate } from "@reach/router";
import useEffectOnce from "react-use/lib/useEffectOnce";
import { LoginForm } from "../components/LoginForm"; //Autenticación
import { Footer } from "../components/Footer";
import { notion, useNotion } from "../services/notion";
import "./Login.css";
import logo1 from './logoUC3M.png'; //Logo de la Universidad Carlos III de Madrid
import logo2 from './logoCajal.png' //Logo del Instituto Cajal
import logo3 from './CSIC.png';

export function Login() {
  const { user, lastSelectedDeviceId, setSelectedDevice } = useNotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffectOnce(() => {
    if (user) {
      navigate("/");
    }
  });

  useEffect(() => {
    if (email && password) {
      login();
    }

    async function login() {
      setIsLoggingIn(true);
      const auth = await notion.login({ email, password }).catch((error) => {
          setError(error.message);
        });

      if (auth) {
        resetForm();

        if (lastSelectedDeviceId) {
          navigate("/");
        } else {
          navigate("/devices");
        }
      }
      setIsLoggingIn(false);
    }
  }, [email, password, setError, lastSelectedDeviceId, setSelectedDevice]);

  //Autenticación
  function onLogin({ email, password }) {
    if (email && password) {
      setError("");
      setEmail(email);
      setPassword(password);
    } else {
      setError("Rellene el Formulario");
    }
  }

  function resetForm() {
    setError("");
    setEmail("");
    setPassword("");
  }

  //Autenticación
  return (
    <main className="main-container-login">
      <div className="footer-images">
        <img src={logo1} alt="Logo 1" className="footer-image-uc3m" />
        <img src={logo3} alt="Logo 3" className="footer-image-csic" />
      </div>
      <LoginForm onLogin={onLogin} error={error} loading={isLoggingIn} footerComponent={<Footer />} //Renderiza la Componente LoginForm y le pasa esas Propiedades
      />
    </main>
  );
}