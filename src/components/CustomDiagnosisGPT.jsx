import React, { useState } from "react";

export default function CustomDiagnosisGPT() {
  const [diagnosis, setDiagnosis] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    setError("");
    try {
      const res = await fetch("/api/gpt-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diagnosis }),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || "API error");
      }
      const data = await res.json();
      setResult(data.response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 32, padding: 24, background: '#f7fafc', borderRadius: 12 }}>
      <h2 style={{ marginBottom: 8 }}>Can't find your diagnosis?</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="text"
          value={diagnosis}
          onChange={e => setDiagnosis(e.target.value)}
          placeholder="Enter your diagnosis"
          style={{ flex: 1, minWidth: 200, padding: 8, borderRadius: 8, border: '1px solid #e2e8f0' }}
          required
        />
        <button
          type="submit"
          disabled={loading || !diagnosis.trim()}
          style={{ padding: '8px 16px', borderRadius: 8, background: '#667eea', color: 'white', border: 'none', fontWeight: 600 }}
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>
      {error && <div style={{ color: '#c53030', marginTop: 12 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 24, background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{result}</pre>
        </div>
      )}
    </div>
  );
} 