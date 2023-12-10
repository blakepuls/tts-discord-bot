"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [languageCode, setLanguageCode] = useState("en-US");
  const [name, setName] = useState("");
  const [pitch, setPitch] = useState(0);
  const [speakingRate, setSpeakingRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [gender, setGender] = useState("FEMALE");
  const [availableVoices, setAvailableVoices] = useState<any>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/voices").then((response) => response.json()),
      fetch("/api/config").then((response) => response.json()),
    ])
      .then(([voicesData, configData]) => {
        setAvailableVoices(voicesData);
        setLanguageCode(configData.languageCode);
        setName(configData.name);
        setPitch(configData.pitch);
        setSpeakingRate(configData.speakingRate);
        setGender(configData.ssmlGender);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredVoiceOptions = availableVoices.filter(
    (voice: any) =>
      voice.languageCodes.includes(languageCode) && voice.ssmlGender === gender
  );

  useEffect(() => {
    // Whenever gender or languageCode changes, reset the name
    if (
      filteredVoiceOptions.length > 0 &&
      !filteredVoiceOptions.some((voice: any) => voice.name === name)
    ) {
      setName(filteredVoiceOptions[0].name);
    }
  }, [gender, languageCode, filteredVoiceOptions, name]);

  const handleSave = async () => {
    setIsSaving(true);
    const response = await fetch("/api/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        languageCode,
        name,
        pitch,
        speakingRate,
        ssmlGender: gender,
      }),
    });

    setIsSaving(false);
    if (response.ok) {
      console.log("Settings saved successfully");
    } else {
      console.error("Failed to save settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div>
        <div className="flex justify-center gap-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Gender</span>
            </label>
            <select
              className="select select-bordered w-28"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              disabled={isLoading}
            >
              <option value="FEMALE">Female</option>
              <option value="MALE">Male</option>
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select
              className="select select-bordered w-28"
              value={languageCode}
              onChange={(e) => setLanguageCode(e.target.value)}
              disabled={isLoading}
            >
              {Array.from(
                new Set(
                  availableVoices.map((voice: any) => voice.languageCodes[0])
                )
              )
                .sort()
                .map((code: any) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Voice Name</span>
            </label>
            <select
              className="select select-bordered"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            >
              {filteredVoiceOptions.map((voice: any) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-4 max-w-lg w-full">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Pitch</span>
              <span className="label-text">{pitch}</span>
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              className="range range-primary w-28"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Speed</span>
              <span className="label-text">{speakingRate}</span>
            </label>
            <input
              type="range"
              min="0.25"
              max="4"
              step="0.1"
              className="range range-primary w-28"
              value={speakingRate}
              onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end ml-auto mt-auto">
            <button
              className="btn btn-primary"
              onClick={handleSave}
              disabled={isSaving || isLoading}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
