import React, { useEffect, useState } from "react";
import { NavHome } from "../components/NavHome";
import Plot from "react-plotly.js";
import "./Report.css";

export function Report() {
  const [calibrationData, setCalibrationData] = useState([]);
  const [neurofeedbackData, setNeurofeedbackData] = useState([]);
  const [calibrationAverage, setCalibrationAverage] = useState(0);
  const [neurofeedbackAverage, setNeurofeedbackAverage] = useState(0);

  useEffect(() => {
    // Fetch data from local storage when component mounts
    const storedCalibrationData = JSON.parse(localStorage.getItem('calibrationData'));
    const storedNeurofeedbackData = JSON.parse(localStorage.getItem('neurofeedbackData'));
    setCalibrationData(interpolateData(storedCalibrationData || []));
    setNeurofeedbackData(interpolateData(storedNeurofeedbackData || []));
  }, []);

  useEffect(() => {
    // Calculate average for calibration data
    const calibrationSum = calibrationData.reduce((acc, data) => acc + data.alpha, 0);
    const calibrationAvg = calibrationData.length > 0 ? calibrationSum / calibrationData.length : 0;
    setCalibrationAverage(calibrationAvg);
  }, [calibrationData]);

  useEffect(() => {
    // Calculate average for neurofeedback data
    const neurofeedbackSum = neurofeedbackData.reduce((acc, data) => acc + data.alpha, 0);
    const neurofeedbackAvg = neurofeedbackData.length > 0 ? neurofeedbackSum / neurofeedbackData.length : 0;
    setNeurofeedbackAverage(neurofeedbackAvg);
  }, [neurofeedbackData]);

  // Function to interpolate data to have points every 0.25 seconds
  const interpolateData = (data) => {
    const interpolatedData = [];
    for (let i = 0; i < data.length - 1; i++) {
      interpolatedData.push(data[i]);
      const timeDiff = data[i + 1].second - data[i].second;
      const steps = Math.ceil(timeDiff / 0.25);
      const alphaStep = (data[i + 1].alpha - data[i].alpha) / steps;
      for (let j = 1; j <= steps - 1; j++) {
        interpolatedData.push({
          second: data[i].second + (j * 0.25),
          alpha: data[i].alpha + (j * alphaStep)
        });
      }
    }
    interpolatedData.push(data[data.length - 1]);
    // Keep only the first data point for each second
    const filteredData = interpolatedData.filter((data, index, self) => {
      return index === 0 || data.second !== self[index - 1].second;
    });
    return filteredData;
  };

  return (
    <div className="main">
      <h1>Final Report</h1>
      
      {calibrationData && calibrationData.length > 0 ? (
        <>
          <h2>Calibration Data</h2>

          <Plot 
            data={[
              {
                x: calibrationData.map(data => data.second),
                y: calibrationData.map(data => data.alpha),
                type: "scatter",
                mode: "lines",
                line: { color: "blue", shape: "spline" }, 
              },
            ]}
            layout={{ 
              title: "Calibration Data Plot",
              xaxis: { title: "Time (seconds)" },
              yaxis: { title: "Alpha power (μV^2)" },
              shapes: [
                {
                  type: 'line',
                  xref: 'paper',
                  x0: 0,
                  x1: 1,
                  y0: calibrationAverage,
                  y1: calibrationAverage,
                  line: {
                    color: 'red',
                    width: 2,
                    dash: 'dashdot',
                  }
                }
              ]
            }}
          />
          <p>Average: {calibrationAverage} μV^2 </p>
        </>
      ) : (
        <h2>No calibration data available</h2>
      )}

      {neurofeedbackData && neurofeedbackData.length > 0 ? (
        <>
          <h2>Neurofeedback Data</h2>
          <Plot 
            data={[
              {
                x: neurofeedbackData.map(data => data.second),
                y: neurofeedbackData.map(data => data.alpha),
                type: "scatter",
                mode: "lines",
                line: { color: "green", shape:"spline" }, // SPLINE SHAPE ALLOWS SMOOTHING THE LINE
              },
            ]}
            layout={{ 
              title: "Neurofeedback Data Plot",
              xaxis: { title: "Time (seconds)" },
              yaxis: { title: "Alpha power (μV^2)" },
              shapes: [
                {
                  type: 'line',
                  xref: 'paper',
                  x0: 0,
                  x1: 1,
                  y0: neurofeedbackAverage,
                  y1: neurofeedbackAverage,
                  line: {
                    color: 'orange',
                    width: 2,
                    dash: 'dashdot',
                  }
                }
              ]
            }}
          />
          <p>Average: {neurofeedbackAverage} μV^2</p>
        </>
      ) : (
        <h2>No neurofeedback data available</h2>
      )}

      <div className="card-home">
        <NavHome/>
      </div>
    </div>
  );
}
