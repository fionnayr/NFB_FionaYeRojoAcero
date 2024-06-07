//GH
import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { notion, useNotion } from "../services/notion";

export function Devices() {
  const { user, lastSelectedDeviceId } = useNotion();
  const [devices, setDevices] = useState([]); //useState inicializa el valor a cero 
  const [draftDeviceId, setDraftDeviceId] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || submitting) {
      return;
    }

    setLoading(true);

    notion
      .getDevices()
      .then((devices) => {
        setDevices(devices);
        if (devices.length) {
          setDraftDeviceId(
            lastSelectedDeviceId
              ? lastSelectedDeviceId
              : devices[0].deviceId
          );
        }
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, lastSelectedDeviceId, submitting]);

  function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    notion
      .selectDevice((devices) =>
        devices.find((device) => device.deviceId === draftDeviceId)
      )
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  return (
    <main className="main-container-devices">
      <form className="card-login-form-devices" onSubmit={onSubmit}>
        <h3 className="card-heading">Devices</h3>
        {!!error ? <h4 className="card-error">{error}</h4> : null}
        <div className="row-devices">
          <label>Select a device from the list</label>
          <select
            name="deviceSelect"
            value={draftDeviceId}
            disabled={loading}
            onChange={(e) => setDraftDeviceId(e.target.value)}
          >
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.deviceNickname || device.modelName}
              </option>
            ))}
          </select>
        </div>
        <div className="row-devices">
          <button type="submit" className="card-btn" disabled={loading}>
            {loading ? "Loading devices..." : "Select"}
          </button>
        </div>
      </form>
    </main>
  );
}
