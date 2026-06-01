import React, { useState, useRef, useEffect } from 'react';
import { useBudgetStore } from '../../store/useBudgetStore';
import { Upload, Terminal, Play, Save, CheckCircle2, AlertCircle, Download, FileJson, ArrowRight, Database, Trash2, Search, RefreshCw } from 'lucide-react';
import ChartContainer from '../ChartContainer';

export default function AdminDashboard() {
  const { masterData, setMasterData, updateMasterDataField } = useBudgetStore();
  
  // Local state management
  const [activeTab, setActiveTab] = useState('ingestion'); // 'ingestion' or 'vectors'
  const [chunks, setChunks] = useState([]);
  const [chunksLoading, setChunksLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [logs, setLogs] = useState([
    "[SYSTEM] BharatBudget Ingestion Engine stand-by.",
    "[SYSTEM] Awaiting document upload pipeline..."
  ]);
  const [parsedResult, setParsedResult] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  const addLog = (message) => {
    setLogs((prev) => [...prev, message]);
    // Scroll terminal to bottom
    setTimeout(() => {
      if (terminalEndRef.current) {
        terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const processFile = async (file) => {
    if (!file.name.endsWith(".pdf")) {
      setErrorMsg("Error: Ingestion pipeline only supports official Parliamentary PDF documents.");
      addLog("[ERROR] Rejected invalid file format. Target must be a PDF.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setSuccessMsg("");
    setParsedResult(null);
    addLog(`[SYSTEM] Received file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
    addLog("[SYSTEM] Initiating asynchronous OCR / Text-extraction pipeline...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Append all backend processing logs
        if (result.logs) {
          result.logs.forEach(logLine => addLog(logLine));
        }
        
        setParsedResult(result);
        addLog(`[SYSTEM] Extraction complete. Identified Schema: [${result.pdf_type.toUpperCase()}]`);
        setSuccessMsg(`Successfully parsed ${file.name}! Review and apply values below.`);
      } else {
        addLog(`[ERROR] Processing failed: ${result.error}`);
        setErrorMsg(result.error || "Failed to parse document.");
      }
    } catch (err) {
      addLog(`[ERROR] Backend connection failed: ${err.message}`);
      addLog("[SYSTEM] Fallback: Simulating matching rule compiler locally...");
      
      // Simulated fallback parsed results in case backend endpoint is not compiled locally
      simulateLocalParsing(file);
    } finally {
      setUploading(false);
    }
  };

  const simulateLocalParsing = (file) => {
    setTimeout(() => {
      const fn = file.name.toLowerCase();
      let detectedType = "deficit";
      let mockData = {};
      
      if (fn.includes("liab") || fn.includes("debt")) {
        detectedType = "liabilities";
        mockData = [
          {"year": "2024-25", "internal_debt": 16821914, "total_internal_liabilities": 18124901, "external_liabilities": 512944, "total_liabilities": 18637845},
          {"year": "2025-26", "internal_debt": 17552202, "total_internal_liabilities": 19412550, "external_liabilities": 564639, "total_liabilities": 19977189},
          {"year": "2026-27 BE", "internal_debt": 18942100, "total_internal_liabilities": 20492100, "external_liabilities": 612400, "total_liabilities": 21104500}
        ];
        addLog("[SIMULATOR] Match category found: Liabilities PDF");
      } else if (fn.includes("scheme") || fn.includes("outlay")) {
        detectedType = "schemes";
        mockData = [
          {"id": "5", "name": "Samagra Shiksha", "val_24_25": 36288, "val_25_26_be": 41250, "val_25_26_re": 38000, "val_26_27_be": 45500},
          {"id": "6", "name": "Jal Jeevan Mission", "val_24_25": 62000, "val_25_26_be": 70000, "val_25_26_re": 69000, "val_26_27_be": 72000},
          {"id": "7", "name": "PM Awas Yojana (PMAY)", "val_24_25": 54000, "val_25_26_be": 80000, "val_25_26_re": 79000, "val_26_27_be": 82000}
        ];
        addLog("[SIMULATOR] Match category found: Outlays PDF");
      } else {
        detectedType = "deficit";
        mockData = {
          "fiscal_deficit": {"values": [1574431, 1568936, 1558492, 1850000], "gdp_pct": [4.8, 4.4, 4.4, 4.5]},
          "revenue_deficit": {"values": [564296, 523846, 526764, 620000], "gdp_pct": [1.7, 1.5, 1.5, 1.6]},
          "primary_deficit": {"values": [458856, 292598, 284154, 310000], "gdp_pct": [1.4, 0.8, 0.8, 0.8]}
        };
        addLog("[SIMULATOR] Match category found: Deficits PDF");
      }

      setParsedResult({
        pdf_type: detectedType,
        extracted_data: mockData
      });
      setSuccessMsg(`[SIMULATION] Finished parsing ${file.name} locally!`);
      addLog("[SIMULATOR] Local pipeline execution completed successfully.");
    }, 1500);
  };

  const handleFieldChange = (key, index, subkey, newVal) => {
    if (!parsedResult) return;
    
    const updatedData = JSON.parse(JSON.stringify(parsedResult.extracted_data));
    
    if (Array.isArray(updatedData)) {
      if (subkey) {
        updatedData[index][subkey] = subkey.includes("year") || subkey.includes("name") ? newVal : parseFloat(newVal) || 0;
      } else {
        updatedData[index] = parseFloat(newVal) || 0;
      }
    } else {
      // Object style (e.g. deficits)
      if (subkey === "value") {
        updatedData[key].values[index] = parseFloat(newVal) || 0;
      } else if (subkey === "gdp") {
        updatedData[key].gdp_pct[index] = parseFloat(newVal) || 0;
      }
    }

    setParsedResult({
      ...parsedResult,
      extracted_data: updatedData
    });
  };

  const applyToStore = () => {
    if (!parsedResult) return;
    
    try {
      const type = parsedResult.pdf_type;
      const data = parsedResult.extracted_data;
      
      let updatedMaster = { ...masterData };

      if (type === "deficit") {
        updatedMaster.deficit_stats = data;
        addLog("[STORE] Ingested new Deficit Statistics dataset.");
      } else if (type === "receipts") {
        updatedMaster.receipt_stats = data;
        addLog("[STORE] Ingested new Tax Receipt Statistics dataset.");
      } else if (type === "expenditure") {
        updatedMaster.expenditure_stats = data;
        addLog("[STORE] Ingested new Expenditure Allocation dataset.");
      } else if (type === "schemes") {
        updatedMaster.all_schemes = data;
        addLog("[STORE] Ingested new Outlay on Major Schemes dataset.");
      } else if (type === "liabilities") {
        updatedMaster.union_liabilities = data;
        addLog("[STORE] Ingested new Outstanding liabilities dataset.");
      } else if (type === "dbt_scores") {
        updatedMaster.state_dbt_scores = data;
        addLog("[STORE] Ingested new DBT Scores dataset.");
      }

      setMasterData(updatedMaster);
      setSuccessMsg("Success! Parsed parameters have been applied to your active live dashboards.");
      addLog("[STORE] Applied updates successfully. Live UI elements re-rendered.");
    } catch (err) {
      setErrorMsg(`Failed to apply updates to store: ${err.message}`);
    }
  };

  const downloadCompiledJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(masterData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "budget_master.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog("[SYSTEM] Compiled budget_master.json payload compiled and downloaded.");
  };

  const triggerUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const fetchChunks = async () => {
    setChunksLoading(true);
    try {
      const response = await fetch('/api/chunks');
      if (!response.ok) throw new Error("Backend server offline");
      const data = await response.json();
      setChunks(data.chunks || []);
    } catch (err) {
      addLog(`[ERROR] Vector load failed: ${err.message}. Loading local preseeded chunks fallback.`);
      setChunks([
        {
          text: "The Union Budget of India for the fiscal year 2026-27 (FY27) projects a total estimated outlay of INR 53,47,315 Crores (53.47 Lakh Crores). This represents a direct progressive increase in sovereign capital expenditure outlays to anchor national infrastructure and service debt interests.",
          source: "Local Preseeded Cache",
          page: 1,
          type: "overview"
        },
        {
          text: "The Fiscal Deficit target for FY27 is estimated at 4.3% of GDP, amounting to INR 16,95,768 Crores. The revised estimate (RE) for FY26 settled at 4.4% of GDP. Primary Deficit is projected to fall to 0.7% of GDP (INR 2,91,796 Crores) indicating high fiscal stability.",
          source: "Local Preseeded Cache",
          page: 1,
          type: "deficit"
        }
      ]);
    } finally {
      setChunksLoading(false);
    }
  };

  const deleteChunk = async (chunkText) => {
    try {
      const response = await fetch('/api/chunks/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: chunkText })
      });
      const res = await response.json();
      if (res.success) {
        addLog(`[SYSTEM] Purged chunk vector index.`);
        setChunks(prev => prev.filter(c => c.text !== chunkText));
      } else {
        addLog(`[ERROR] Purge command failed: ${res.message}`);
      }
    } catch (err) {
      addLog(`[ERROR] Purge connection failed: ${err.message}`);
      setChunks(prev => prev.filter(c => c.text !== chunkText));
    }
  };

  useEffect(() => {
    if (activeTab === 'vectors') {
      fetchChunks();
    }
  }, [activeTab]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      {/* Dynamic Tab Switcher */}
      <div style={{
        display: 'flex',
        gap: '12px',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '12px',
        alignItems: 'center'
      }}>
        <button
          onClick={() => setActiveTab('ingestion')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'ingestion' ? 'var(--border-glass-active)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'ingestion' ? 'var(--saffron)' : 'transparent',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: activeTab === 'ingestion' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Upload size={14} color="var(--saffron)" />
          <span>Ingestion Dropzone</span>
        </button>

        <button
          onClick={() => setActiveTab('vectors')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'vectors' ? 'var(--border-glass-active)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'vectors' ? 'var(--emerald)' : 'transparent',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 600,
            color: activeTab === 'vectors' ? 'var(--text-primary)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Database size={14} color="var(--emerald)" />
          <span>Vector Chunk Inspector</span>
          <span style={{
            fontSize: '9px',
            background: 'var(--emerald)',
            color: '#fff',
            borderRadius: '10px',
            padding: '1px 5px',
            marginLeft: '4px'
          }}>
            {chunks.length || 0}
          </span>
        </button>
      </div>

      {activeTab === 'ingestion' ? (
        <div className="animate-fade-in dashboard-grid col-12" style={{ gap: '16px' }}>
          
          {/* Column 1: Upload Dropzone & System Terminal */}
          <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--saffron)' }}>
              <Upload size={18} /> Official Budget PDF Ingestion dropzone
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
              Upload official parliamentary PDFs to dynamically scan, parse, and hot-reload target allocations across every active dashboard view.
            </p>

            {/* Drag and Drop Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerUploadClick}
              style={{
                border: dragActive ? '2px dashed var(--saffron)' : '2px dashed var(--border-glass)',
                borderRadius: '12px',
                background: dragActive ? 'rgba(234, 88, 12, 0.05)' : 'rgba(255, 255, 255, 0.01)',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-glass)',
                  color: uploading ? 'var(--saffron)' : 'var(--text-secondary)'
                }}>
                  <Upload size={24} className={uploading ? "pulse-slow" : ""} />
                </div>

                {uploading ? (
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)' }}>Processing PDF Ingestion...</strong>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Extracting table grids and text tokens</span>
                  </div>
                ) : (
                  <div>
                    <strong style={{ display: 'block', fontSize: '14px', color: 'var(--text-primary)' }}>Drag & Drop Parliamentary PDF here</strong>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                      or click to browse local files
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '8px' }}>
                      Supports Deficit Statistics, Outlays, Receipts & DBT Performance Reports
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Retro Logging Terminal */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '220px' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                <Terminal size={14} /> Ingestion Compiler Logging Terminal
              </h4>
              <div style={{
                flex: 1,
                background: '#040814',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '12px',
                fontFamily: 'Consolas, Monaco, monospace',
                fontSize: '11.5px',
                color: '#10b981',
                overflowY: 'auto',
                maxHeight: '220px',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
              }}>
                {logs.map((log, idx) => {
                  let color = '#10b981';
                  if (log.includes("[ERROR]")) color = '#ef4444';
                  if (log.includes("[SYSTEM]")) color = '#3b82f6';
                  if (log.includes("[DETECTOR]")) color = '#a855f7';
                  if (log.includes("[PARSER]")) color = '#fb923c';
                  return (
                    <div key={idx} style={{ marginBottom: '4px', lineHeight: '1.4', color }}>
                      {log}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>
            </div>
          </div>

          {/* Column 2: Ingestion Verification & Action panel */}
          <div className="glass-panel col-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '450px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)' }}>
              <CheckCircle2 size={18} /> Verified Ledger Ingestion Grid
            </h3>
            
            {/* Alerts */}
            {errorMsg && (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '12px', borderRadius: '8px', color: '#fca5a5', fontSize: '12px' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '8px', color: '#a7f3d0', fontSize: '12px' }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Parsed Ledger Grid Workspace */}
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '280px', border: '1px solid var(--border-glass)', borderRadius: '10px', background: 'rgba(0,0,0,0.1)' }}>
              {!parsedResult ? (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '12px', padding: '40px 0' }}>
                  <ArrowRight size={28} className="pulse-slow" style={{ transform: 'rotate(90deg)' }} />
                  <span style={{ fontSize: '13px' }}>Awaiting PDF parser execution to populate verified fields...</span>
                </div>
              ) : (
                <div style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Parsed Category:</span>
                    <strong style={{ color: 'var(--saffron)', fontSize: '12px' }}>{parsedResult.pdf_type.toUpperCase()}</strong>
                  </div>

                  {/* Render dynamic tables based on PDF Type */}
                  {parsedResult.pdf_type === "deficit" && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {Object.keys(parsedResult.extracted_data).map((key) => {
                        const item = parsedResult.extracted_data[key];
                        return (
                          <div key={key} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '10px' }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '12.5px', color: 'var(--text-primary)' }}>{key.replace("_", " ").toUpperCase()}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                              {item.values.map((val, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <label style={{ fontSize: '9px', color: 'var(--text-secondary)' }}>FY {24 + idx}-{25 + idx} (₹ Cr)</label>
                                  <input 
                                    type="number" 
                                    value={val} 
                                    onChange={(e) => handleFieldChange(key, idx, "value", e.target.value)}
                                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '4px', fontSize: '11px', color: 'var(--text-primary)', width: '100%' }}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {parsedResult.pdf_type === "schemes" && (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px', color: 'var(--text-primary)' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-glass)', textAlign: 'left' }}>
                          <th style={{ padding: '6px' }}>Scheme Name</th>
                          <th style={{ padding: '6px' }}>FY25 (₹ Cr)</th>
                          <th style={{ padding: '6px' }}>FY26 BE (₹ Cr)</th>
                          <th style={{ padding: '6px' }}>FY27 BE (₹ Cr)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedResult.extracted_data.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                            <td style={{ padding: '6px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</td>
                            <td style={{ padding: '6px' }}>
                              <input 
                                type="number" 
                                value={item.val_24_25}
                                onChange={(e) => handleFieldChange(null, idx, "val_24_25", e.target.value)}
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '3px', fontSize: '10.5px', color: 'var(--text-primary)', width: '70px' }}
                              />
                            </td>
                            <td style={{ padding: '6px' }}>
                              <input 
                                type="number" 
                                value={item.val_25_26_be}
                                onChange={(e) => handleFieldChange(null, idx, "val_25_26_be", e.target.value)}
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '3px', fontSize: '10.5px', color: 'var(--text-primary)', width: '70px' }}
                              />
                            </td>
                            <td style={{ padding: '6px' }}>
                              <input 
                                type="number" 
                                value={item.val_26_27_be}
                                onChange={(e) => handleFieldChange(null, idx, "val_26_27_be", e.target.value)}
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '3px', fontSize: '10.5px', color: 'var(--text-primary)', width: '70px' }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* Receipts, Expenditures and other models list structure */}
                  {(parsedResult.pdf_type === "receipts" || parsedResult.pdf_type === "expenditure") && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {Object.keys(parsedResult.extracted_data).map((key) => {
                        const vals = parsedResult.extracted_data[key];
                        return (
                          <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.03)', padding: '6px' }}>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{key.replace("_", " ")}</span>
                            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FY27 BE:</span>
                              <input 
                                type="number" 
                                value={vals[3]} 
                                onChange={(e) => handleFieldChange(key, 3, "value", e.target.value)}
                                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '4px', padding: '4px', fontSize: '11px', color: 'var(--text-primary)', width: '90px', textAlign: 'right' }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Dashboard Operation Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button 
                disabled={!parsedResult}
                onClick={applyToStore}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  background: parsedResult ? 'var(--emerald)' : 'rgba(255,255,255,0.02)',
                  border: parsedResult ? 'none' : '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  color: parsedResult ? '#fff' : 'var(--text-muted)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: parsedResult ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <Play size={16} /> Apply to Active Session
              </button>
              
              <button 
                onClick={downloadCompiledJson}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: 'var(--border-glass)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                <FileJson size={16} /> Export JSON
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel col-12 animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '480px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', margin: 0 }}>
                <Database size={18} /> Ingested RAG Vector Chunk Repository
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
                Query, filter, inspect, and purge parsed sliding-window text indices inside the semantic database.
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search vector corpus..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-glass-active)',
                    borderRadius: '6px',
                    padding: '6px 12px 6px 30px',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none',
                    width: '200px'
                  }}
                />
                <Search size={12} color="var(--text-secondary)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
              
              <button
                onClick={fetchChunks}
                disabled={chunksLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'var(--border-glass)',
                  border: '1px solid var(--border-glass-active)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <RefreshCw size={12} className={chunksLoading ? "pulse-slow" : ""} />
                <span>Reload</span>
              </button>
            </div>
          </div>

          {chunksLoading ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '8px', padding: '60px 0' }}>
              <RefreshCw size={32} className="pulse-slow" style={{ animation: 'spin 1.5s linear infinite' }} />
              <span style={{ fontSize: '13px' }}>Loading semantic vectors...</span>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '420px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px', padding: '4px' }}>
              {chunks
                .filter(c => c.text.toLowerCase().includes(searchTerm.toLowerCase()) || c.source.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((chunk, idx) => (
                  <div
                    key={idx}
                    className="glass-panel"
                    style={{
                      padding: '14px',
                      background: 'rgba(255,255,255,0.01)',
                      border: '1px solid var(--border-glass-active)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      position: 'relative',
                      boxShadow: 'none',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.borderColor = 'var(--border-glass-active)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{
                          fontSize: '8px',
                          textTransform: 'uppercase',
                          fontWeight: 'bold',
                          color: '#fff',
                          background: chunk.type === 'deficit' ? 'var(--saffron)' : chunk.type === 'schemes' ? 'var(--emerald)' : 'var(--ashoka-blue)',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          display: 'inline-block'
                        }}>
                          {chunk.type}
                        </span>
                        <strong style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                          📄 {chunk.source}
                        </strong>
                      </div>
                      
                      <button
                        onClick={() => deleteChunk(chunk.text)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'rgba(239, 68, 68, 0.5)',
                          cursor: 'pointer',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(239, 68, 68, 0.5)'}
                        title="Purge chunk from corpus"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{
                      flex: 1,
                      fontFamily: 'monospace',
                      fontSize: '10.5px',
                      lineHeight: '1.5',
                      color: 'var(--text-primary)',
                      background: 'rgba(0,0,0,0.15)',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255,255,255,0.03)',
                      maxHeight: '100px',
                      overflowY: 'auto',
                      whiteSpace: 'pre-wrap'
                    }}>
                      {chunk.text}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-secondary)' }}>
                      <span>Size: **{chunk.text.split(' ').length}** words</span>
                      <span>Page index: **{chunk.page}**</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
