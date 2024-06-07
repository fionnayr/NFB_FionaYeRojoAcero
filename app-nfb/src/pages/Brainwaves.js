//ESTADO. La instancia de Neurosity y User se sincronizan con un Efecto Secundario creando una suscripción a la API de Calm

import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { notion, useNotion } from "../services/notion";
import { Navhomereport } from "../components/Navhomereport";
import "./Brainwaves.css";
import calmPic from './calmpic.jpg';

export function Brainwaves() {
  const { user } = useNotion();
  const [alphaChM, setAlphaChM] = useState(0);
  const [blurAmount, setBlurAmount] = useState(0);
  const [alert, setAlert] = useState("");
  const [calibrationFinished, setCalibrationFinished] = useState(false);
  const [neurofeedbackFinished, setNeurofeedbackFinished] = useState(false);
  const [timerSecCalibration, setTimerSecCalibration] = useState(15); // en segundos 
  const [timerSecNeurofeedback, setTimerSecNeurofeedback] = useState(timerSecCalibration + (15)); // en segundos
  const [calibrationData, setCalibrationData] = useState([]);
  const [neurofeedbackData, setNeurofeedbackData] = useState([]);
  const [calculatedValues, setCalculatedValues] = useState(null);
  const [showPixelatedImage, setShowPixelatedImage] = useState(false);
  const [showTimerCalibration, setShowTimerCalibration] = useState(true);
  const [showTimerNeurofeedback, setShowTimerNeurofeedback] = useState(false);
  const [showAlphaValues] = useState(true);

  // LOGIN
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user]);

  // MIDE ALPHA - CALIBRACIÓN
  useEffect(() => {
    if (!user) {
      return;
    }

    const subscription = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
      const alphaCh1 = brainwaves.data.alpha[4]; //PO3
      const alphaCh2 = brainwaves.data.alpha[5]; //PO4
      const alphaChMe = (alphaCh1 + alphaCh2) / 2; // average of PO3 and PO4
      setAlphaChM(alphaChMe);

      if (!calibrationFinished) {
        setCalibrationData((prevData) => [
          ...prevData,
          { alpha: parseFloat(alphaChMe.toFixed(3)), second: 15 - timerSecCalibration }
        ]);
      }
      
      setAlert("");
    });

    if (timerSecCalibration === 0) {
      setAlert(<strong>¡Calibracion!</strong>);
      subscription.unsubscribe();
      setCalibrationFinished(true);

      return;
    }

    return () => {
      subscription.unsubscribe();
    };
  }, [user, calibrationFinished, timerSecCalibration]);

 // MIDE ALPHA - NEUROFEEDBACK
  useEffect(() => {
    if (!user || !calibrationFinished) {
      return;
    }

    const subscriptionN = notion.brainwaves("powerByBand").subscribe((brainwaves) => {
      const alphaCh1 = brainwaves.data.alpha[4]; //PO3
      const alphaCh2 = brainwaves.data.alpha[5]; //PO4
      const alphaChMe = (alphaCh1 + alphaCh2) / 2; // average of PO3 and PO4
      setAlphaChM(alphaChMe);

      if (!neurofeedbackFinished) {
        setNeurofeedbackData((prevData) => [
          ...prevData,
          { alpha: parseFloat(alphaChMe.toFixed(3)), second: 15 - timerSecNeurofeedback }
        ]);
        setBlurAmount(3);
      }
      
      setAlert("");
    });

    if (timerSecNeurofeedback === 0) {
      setAlert(<strong> Thank you! </strong>);
      subscriptionN.unsubscribe();
      setNeurofeedbackFinished(true);
    }

    return () => {
      subscriptionN.unsubscribe();
    };
  }, [calibrationFinished, neurofeedbackFinished, timerSecNeurofeedback]);

  // TIMER - CALIBRATION
  useEffect(() => {
    if (!user) {
      return;
    }
    const timer = setInterval(() => {
      setTimerSecCalibration((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (timerSecCalibration === 0) {
      clearInterval(timer); 
      setShowTimerCalibration(false);
      setShowTimerNeurofeedback(true);
      setShowPixelatedImage(true);
      setCalibrationFinished(true);
      setNeurofeedbackFinished(false);

    }
    return () => {
      clearInterval(timer);
    };
  }, [user, timerSecCalibration]);

  // TIMER - NEUROFEEDBACK
  useEffect(() => {
    if (!user) {
      return;
    }
    const timer = setInterval(() => {
      setTimerSecNeurofeedback((prevSeconds) => prevSeconds - 1);
    }, 1000);

    if (timerSecNeurofeedback === 0) {
      clearInterval(timer);
      setShowTimerNeurofeedback(true);
      setShowPixelatedImage(true);
      setNeurofeedbackFinished(true);
    }
    return () => {
      clearInterval(timer);
    };
  }, [user, timerSecNeurofeedback]);

  // SAVE DATA TO CSV - CALIBRATION
  useEffect(() => {
    if (calibrationFinished) {
      setCalibrationData(calibrationData);
      localStorage.setItem('calibrationData', JSON.stringify(calibrationData));
      appendDataToCSV(calibrationData, `calibration-${getCurrentDateTime()}.csv`);
    }
  }, [calibrationFinished, calibrationData]);

  // SAVE DATA TO CSV - NEUROFEEDBACK
  useEffect(() => {
    if (neurofeedbackFinished) {
      setNeurofeedbackData(neurofeedbackData);
      localStorage.setItem('neurofeedbackData', JSON.stringify(neurofeedbackData));
      appendDataToCSV(neurofeedbackData, `neurofeedback-${getCurrentDateTime()}.csv`);
    }
  }, [neurofeedbackFinished, neurofeedbackData]);

  // CALCULA VALORES DE LA CALIBRACION
  useEffect(() => {
    if (calculatedValues) {
      console.log("Max Value:", calculatedValues.maxValue);
      console.log("Min Value:", calculatedValues.minValue);
    }
  }, [calculatedValues]);

  return (
    <main className="main-container">
      
      <div className="card-bw">
        <Navhomereport/>
      </div>

      <h1></h1>
  
      {showTimerCalibration && (
        <div className="timer-container">
          <div className="timer">{formatTime(timerSecCalibration)}</div>
        </div>
      )}

      <h1></h1> 

      {showTimerNeurofeedback && (
        <div className="timer-container">
          <div className="timer">{formatTime(timerSecNeurofeedback)}</div>
        </div>
      )}
  
      {showAlphaValues && (
        <div className="brainwaves-container">
          <div className="brainwaves-label">Alpha Power (PO3 y PO4)</div>
          <div className={`brainwaves-score`}>{alphaChM.toFixed(2)}</div>
        </div>
      )}
  
      {alert && <div className="alert">{alert}</div>}

      {!showPixelatedImage && !calibrationFinished && (
        <div className="calm-image">
          <img src={calmPic} alt="Imagen Calma" />
          {showTimerCalibration && <div className="timer-message">Fixed process image</div>}
        </div>
      )}
  
      {showPixelatedImage && (
        <div className="calm-image">
          <img src={calmPic} alt="Imagen Calma" style={{ filter: `blur(${blurAmount}px)` }} />
          <div className="timer-message">Pixel image process</div>
        </div>
      )}
  
      {calibrationFinished && <div className="test-finished-text">Test completed</div>}

    </main>
  );
}

function appendDataToCSV(data, filename) {
  const csvData = data.map(row => `${row.second},${row.alpha}`).join('\n');
  const csvContent = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;

  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', filename);
  link.click();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const formattedSeconds = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${formattedSeconds}`;
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}-${hours}${minutes}`;
}

