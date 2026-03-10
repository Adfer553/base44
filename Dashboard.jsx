import { useState, useEffect, useRef } from "react";
import { Play, Square, SkipForward, RotateCcw, Upload, Users, MessageSquare, Zap, TrendingUp, Activity, ChevronRight, Phone, Bot, Wifi, WifiOff, AlertTriangle, CheckCircle, XCircle, Clock, Settings2, BarChart3, Terminal, Menu, X } from "lucide-react";

const MOCK_LOGS = [
  { nivel: "INFO", msg: "Sistema inicializado com sucesso", time: "10:24:01" },
  { nivel: "OK", msg: "3 templates de mensagens carregados", time: "10:24:02" },
  { nivel: "GPT", msg: "Gemini treinado conectado com sucesso", time: "10:24:05" },
  { nivel: "OK", msg: "WhatsApp Web conectado!", time: "10:24:18" },
  { nivel: "INFO", msg: "[1/120] Empresa ABC | João Silva | 44999887766", time: "10:24:20" },
  { nivel: "OK", msg: "Mensagem enviada com sucesso!", time: "10:24:21" },
  { nivel: "INFO", msg: "[2/120] Tech Solutions | Maria Santos | 11988776655", time: "10:35:45" },
  { nivel: "OK", msg: "Mensagem enviada com sucesso!", time: "10:35:46" },
  { nivel: "AVISO", msg: "[3/120] Sem telefone válido → pulando", time: "10:35:48" },
  { nivel: "INFO", msg: "[4/120] Grupo Inovação | Pedro Lima | 21977665544", time: "10:47:12" },
];

const levelConfig = {
  OK:      { color: "#22c55e", bg: "rgba(34,197,94,0.08)",   icon: CheckCircle,     label: "SUCESSO" },
  ERRO:    { color: "#ef4444", bg: "rgba(239,68,68,0.08)",   icon: XCircle,         label: "ERRO" },
  AVISO:   { color: "#f59e0b", bg: "rgba(245,158,11,0.08)",  icon: AlertTriangle,   label: "AVISO" },
  INFO:    { color: "#3b82f6", bg: "rgba(59,130,246,0.08)",  icon: Activity,        label: "INFO" },
  DEBUG:   { color: "#6b7280", bg: "rgba(107,114,128,0.08)", icon: Terminal,        label: "DEBUG" },
  GPT:     { color: "#a855f7", bg: "rgba(168,85,247,0.08)",  icon: Bot,             label: "AI" },
  MONITOR: { color: "#06b6d4", bg: "rgba(6,182,212,0.08)",   icon: Activity,        label: "MONITOR" },
};

function StatCard({ title, value, color, icon: Icon, subtitle }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #111 0%, #161616 100%)",
      border: "1px solid #1e1e1e",
      borderRadius: 16,
      padding: "20px 24px",
      flex: 1,
      minWidth: 0,
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = color + "40"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "#1e1e1e"}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#666", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{title}</div>
          <div style={{ color, fontSize: 36, fontWeight: 700, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{value}</div>
          {subtitle && <div style={{ color: "#444", fontSize: 11, marginTop: 6 }}>{subtitle}</div>}
        </div>
        <div style={{ background: color + "15", borderRadius: 10, padding: 10 }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ online, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: online ? "rgba(34,197,94,0.08)" : "rgba(107,114,128,0.08)", border: `1px solid ${online ? "rgba(34,197,94,0.2)" : "rgba(107,114,128,0.2)"}`, borderRadius: 20, fontSize: 12, color: online ? "#22c55e" : "#6b7280" }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: online ? "#22c55e" : "#4b5563", boxShadow: online ? "0 0 6px #22c55e" : "none" }} />
      {label}
    </div>
  );
}

function LogLine({ log }) {
  const cfg = levelConfig[log.nivel] || levelConfig.INFO;
  const Icon = cfg.icon;
  return (
    <div style={{ display: "flex", gap: 10, padding: "6px 12px", borderRadius: 6, alignItems: "flex-start", fontFamily: "'JetBrains Mono', 'Consolas', monospace", fontSize: 12 }}>
      <span style={{ color: "#444", minWidth: 60, fontSize: 11, paddingTop: 1 }}>{log.time}</span>
      <span style={{ background: cfg.bg, color: cfg.color, padding: "1px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", minWidth: 54, textAlign: "center", flexShrink: 0, marginTop: 1 }}>{cfg.label}</span>
      <span style={{ color: "#c9d1d9", lineHeight: 1.5 }}>{log.msg}</span>
    </div>
  );
}

export default function Dashboard() {
  const [rodando, setRodando] = useState(false);
  const [vendedor, setVendedor] = useState("");
  const [geminiLink, setGeminiLink] = useState("");
  const [pausaMin, setPausaMin] = useState(600);
  const [pausaMax, setPausaMax] = useState(1020);
  const [arquivoMsg, setArquivoMsg] = useState("");
  const [arquivoLeads, setArquivoLeads] = useState("");
  const [browser, setBrowser] = useState("chrome");
  const [logs, setLogs] = useState(MOCK_LOGS);
  const [numeroManual, setNumeroManual] = useState("");
  const [enviados, setEnviados] = useState(47);
  const [pulados, setPulados] = useState(3);
  const [erros, setErros] = useState(1);
  const [total, setTotal] = useState(120);
  const [progresso, setProgresso] = useState(0.42);
  const [wppOnline, setWppOnline] = useState(true);
  const [geminiOnline, setGeminiOnline] = useState(true);
  const [leadAtual, setLeadAtual] = useState("Maria Oliveira — 11988776655");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const logRef = useRef();

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [logs]);

  const addLog = (nivel, msg) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
    setLogs(prev => [...prev.slice(-200), { nivel, msg, time }]);
  };

  const handleIniciar = () => {
    if (!vendedor) return alert("Informe o nome do vendedor.");
    if (!geminiLink) return alert("Cole o link do Gemini treinado.");
    if (!arquivoMsg) return alert("Selecione o arquivo de mensagens.");
    if (!arquivoLeads) return alert("Selecione a planilha de leads.");
    setRodando(true);
    addLog("INFO", `Campanha iniciada por ${vendedor} via ${browser === "chrome" ? "Google Chrome" : "Microsoft Edge"}`);
    addLog("GPT", "Conectando ao Gemini treinado...");
  };

  const handleParar = () => {
    setRodando(false);
    addLog("AVISO", "Campanha interrompida pelo usuário.");
  };

  const handlePular = () => {
    addLog("AVISO", "Sinal de pulo enviado — encerrando pausa do cliente atual...");
  };

  const handleResetar = () => {
    addLog("INFO", "Checkpoint resetado manualmente.");
    setEnviados(0); setPulados(0); setErros(0); setProgresso(0);
  };

  const handleAssumirManual = () => {
    if (!numeroManual) return addLog("AVISO", "Digite um número antes de assumir.");
    addLog("AVISO", `📲 ${numeroManual} assumido — bot segue para o próximo lead.`);
    setNumeroManual("");
  };

  const inputStyle = {
    background: "#0d0d0d",
    border: "1px solid #252525",
    borderRadius: 8,
    color: "#e2e8f0",
    padding: "9px 13px",
    fontSize: 13,
    width: "100%",
    outline: "none",
    fontFamily: "Inter, sans-serif",
    transition: "border-color 0.2s",
  };

  const labelStyle = { color: "#5a6480", fontSize: 11, fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5, display: "block" };

  const btnPrimary = {
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    border: "none",
    borderRadius: 10,
    color: "#fff",
    fontWeight: 700,
    fontSize: 13,
    padding: "11px 0",
    width: "100%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    letterSpacing: "0.03em",
    boxShadow: "0 4px 20px rgba(22,163,74,0.3)",
    transition: "all 0.2s",
  };

  const btnDanger = {
    background: rodando ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${rodando ? "rgba(239,68,68,0.4)" : "#252525"}`,
    borderRadius: 10,
    color: rodando ? "#ef4444" : "#444",
    fontWeight: 600,
    fontSize: 12,
    padding: "9px 0",
    width: "100%",
    cursor: rodando ? "pointer" : "not-allowed",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    transition: "all 0.2s",
  };

  const btnSecondary = {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid #252525",
    borderRadius: 10,
    color: "#888",
    fontWeight: 600,
    fontSize: 12,
    padding: "9px 0",
    width: "100%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    transition: "all 0.2s",
  };

  const tabs = [
    { id: "dashboard", icon: BarChart3, label: "Dashboard" },
    { id: "campanha", icon: MessageSquare, label: "Campanha" },
    { id: "config", icon: Settings2, label: "Configurações" },
    { id: "logs", icon: Terminal, label: "Logs" },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", background: "#080808", color: "#e2e8f0", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 280 : 0,
        minWidth: sidebarOpen ? 280 : 0,
        background: "#0d0d0d",
        borderRight: "1px solid #161616",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #161616" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #22c55e, #16a34a)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={18} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>David Adryel</div>
              <div style={{ fontSize: 10, color: "#444", letterSpacing: "0.1em", textTransform: "uppercase" }}>SDR Automation</div>
            </div>
            <div style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: rodando ? "#22c55e" : "#374151", boxShadow: rodando ? "0 0 8px #22c55e" : "none" }} />
          </div>
        </div>

        {/* Nav Tabs */}
        <div style={{ padding: "12px 12px 0" }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: activeTab === tab.id ? "rgba(34,197,94,0.08)" : "transparent",
              color: activeTab === tab.id ? "#22c55e" : "#555",
              fontSize: 13, fontWeight: 500, cursor: "pointer",
              marginBottom: 2, transition: "all 0.15s",
              borderLeft: activeTab === tab.id ? "2px solid #22c55e" : "2px solid transparent",
            }}>
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: "16px 16px 0", overflowY: "auto" }}>

          {/* CAMPANHA */}
          {(activeTab === "campanha" || activeTab === "dashboard") && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#333", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, borderBottom: "1px solid #161616", paddingBottom: 8 }}>CAMPANHA</div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Navegador</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["chrome", "edge"].map(b => (
                    <button key={b} onClick={() => setBrowser(b)} style={{
                      flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${browser === b ? (b === "chrome" ? "#22c55e40" : "#3b82f640") : "#252525"}`,
                      background: browser === b ? (b === "chrome" ? "rgba(34,197,94,0.08)" : "rgba(59,130,246,0.08)") : "#0d0d0d",
                      color: browser === b ? (b === "chrome" ? "#22c55e" : "#3b82f6") : "#444",
                      fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: 15 }}>{b === "chrome" ? "🌐" : "🔷"}</span>
                      {b === "chrome" ? "Chrome" : "Edge"}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Vendedor</label>
                <input value={vendedor} onChange={e => setVendedor(e.target.value)} placeholder="Seu nome completo" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#22c55e40"}
                  onBlur={e => e.target.style.borderColor = "#252525"} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Link Gemini Treinado</label>
                <input value={geminiLink} onChange={e => setGeminiLink(e.target.value)} placeholder="https://gemini.google.com/app/..." style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#a855f740"}
                  onBlur={e => e.target.style.borderColor = "#252525"} />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Mensagens (.txt)</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1, background: "#0d0d0d", border: "1px solid #252525", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: arquivoMsg ? "#22c55e" : "#333" }}>
                    {arquivoMsg || "Nenhum arquivo selecionado"}
                  </div>
                  <label style={{ background: "#161616", border: "1px solid #252525", borderRadius: 8, padding: "8px 10px", cursor: "pointer", color: "#666", display: "flex" }}>
                    <Upload size={14} />
                    <input type="file" accept=".txt" style={{ display: "none" }} onChange={e => e.target.files[0] && setArquivoMsg(e.target.files[0].name)} />
                  </label>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Planilha de Leads</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{ flex: 1, background: "#0d0d0d", border: "1px solid #252525", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: arquivoLeads ? "#22c55e" : "#333" }}>
                    {arquivoLeads || "Nenhum arquivo selecionado"}
                  </div>
                  <label style={{ background: "#161616", border: "1px solid #252525", borderRadius: 8, padding: "8px 10px", cursor: "pointer", color: "#666", display: "flex" }}>
                    <Users size={14} />
                    <input type="file" accept=".xlsx,.csv" style={{ display: "none" }} onChange={e => e.target.files[0] && setArquivoLeads(e.target.files[0].name)} />
                  </label>
                </div>
              </div>

              <button onClick={rodando ? handleParar : handleIniciar}
                style={rodando ? { ...btnDanger, cursor: "pointer" } : btnPrimary}>
                {rodando ? <><Square size={14} /> PARAR CAMPANHA</> : <><Play size={14} /> INICIAR CAMPANHA</>}
              </button>

              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={handlePular} disabled={!rodando} style={{ ...btnSecondary, flex: 1, opacity: rodando ? 1 : 0.4 }}>
                  <SkipForward size={13} /> Pular
                </button>
                <button onClick={handleResetar} style={{ ...btnSecondary, flex: 1 }}>
                  <RotateCcw size={13} /> Reset
                </button>
              </div>
            </div>
          )}

          {/* CONFIGURAÇÕES */}
          {(activeTab === "config" || activeTab === "dashboard") && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, color: "#333", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, borderBottom: "1px solid #161616", paddingBottom: 8 }}>CONFIGURAÇÕES</div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
                  <span>Pausa Mínima</span>
                  <span style={{ color: "#22c55e", fontWeight: 700 }}>{pausaMin}s</span>
                </label>
                <input type="range" min={60} max={1800} step={60} value={pausaMin} onChange={e => setPausaMin(+e.target.value)}
                  style={{ width: "100%", accentColor: "#22c55e", cursor: "pointer" }} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ ...labelStyle, display: "flex", justifyContent: "space-between" }}>
                  <span>Pausa Máxima</span>
                  <span style={{ color: "#3b82f6", fontWeight: 700 }}>{pausaMax}s</span>
                </label>
                <input type="range" min={60} max={3600} step={60} value={pausaMax} onChange={e => setPausaMax(+e.target.value)}
                  style={{ width: "100%", accentColor: "#3b82f6", cursor: "pointer" }} />
              </div>
            </div>
          )}

          {/* MANUAL */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#333", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10, borderBottom: "1px solid #161616", paddingBottom: 8 }}>ATENDIMENTO MANUAL</div>
            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Número do Lead</label>
              <input value={numeroManual} onChange={e => setNumeroManual(e.target.value)} placeholder="Ex: 44999887766" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#f59e0b40"}
                onBlur={e => e.target.style.borderColor = "#252525"} />
            </div>
            <button onClick={handleAssumirManual} style={{
              ...btnSecondary,
              borderColor: "#f59e0b30",
              color: "#f59e0b",
              background: "rgba(245,158,11,0.06)",
            }}>
              <Phone size={13} /> Assumir Atendimento
            </button>
          </div>
        </div>

        {/* Status indicators */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #161616", display: "flex", gap: 8, flexDirection: "column" }}>
          <StatusBadge online={wppOnline} label={`WhatsApp (${browser === "chrome" ? "Chrome" : "Edge"})`} />
          <StatusBadge online={geminiOnline} label="Gemini AI" />
          {rodando && (
            <div style={{ fontSize: 11, color: "#555", background: "#111", borderRadius: 6, padding: "6px 10px", marginTop: 2 }}>
              <span style={{ color: "#3b82f6" }}>→</span> {leadAtual}
            </div>
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top bar */}
        <div style={{ height: 52, background: "#0d0d0d", borderBottom: "1px solid #161616", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, flexShrink: 0 }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", display: "flex", padding: 4 }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div style={{ height: 16, width: 1, background: "#1e1e1e" }} />
          <div style={{ fontSize: 13, color: "#333" }}>
            {tabs.find(t => t.id === activeTab)?.label}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            {rodando && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#22c55e" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "pulse 2s infinite" }} />
                Campanha ativa
              </div>
            )}
            <div style={{ fontSize: 11, color: "#333" }}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>

          {/* Stats cards */}
          <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <StatCard title="Enviados" value={enviados} color="#22c55e" icon={CheckCircle} subtitle={`${Math.round(progresso*100)}% concluído`} />
            <StatCard title="Pulados" value={pulados} color="#f59e0b" icon={SkipForward} subtitle="sem telefone válido" />
            <StatCard title="Erros" value={erros} color="#ef4444" icon={XCircle} subtitle="falhas ao enviar" />
            <StatCard title="Total Leads" value={total} color="#3b82f6" icon={Users} subtitle="na planilha" />
          </div>

          {/* Progress */}
          <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 16, padding: "20px 24px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 3 }}>Progresso da Campanha</div>
                <div style={{ fontSize: 12, color: "#444" }}>{enviados + pulados + erros} de {total} leads processados</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#22c55e" }}>{Math.round(progresso * 100)}%</div>
            </div>
            <div style={{ background: "#161616", borderRadius: 999, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${progresso * 100}%`, height: "100%", background: "linear-gradient(90deg, #16a34a, #22c55e)", borderRadius: 999, transition: "width 0.5s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
              {[
                { label: "Taxa de Sucesso", value: `${Math.round((enviados / (enviados + erros || 1)) * 100)}%`, color: "#22c55e" },
                { label: "Pausa Atual", value: `${pausaMin}–${pausaMax}s`, color: "#3b82f6" },
                { label: "Lead Atual", value: rodando ? leadAtual.split(" — ")[0] : "—", color: "#a855f7" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: 10, color: "#333", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 2 }}>{item.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logs */}
          <div style={{ background: "#0d0d0d", border: "1px solid #161616", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #161616", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Terminal size={14} color="#555" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#aaa" }}>Log em Tempo Real</span>
                <span style={{ background: "#161616", color: "#555", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>{logs.length}</span>
              </div>
              <button onClick={() => setLogs([])} style={{ background: "none", border: "1px solid #1e1e1e", borderRadius: 6, color: "#444", fontSize: 11, padding: "4px 10px", cursor: "pointer" }}>Limpar</button>
            </div>
            <div ref={logRef} style={{ height: 320, overflowY: "auto", padding: "8px 0" }}>
              {logs.length === 0 ? (
                <div style={{ textAlign: "center", color: "#333", padding: 40, fontSize: 13 }}>Nenhum log ainda...</div>
              ) : (
                logs.map((log, i) => <LogLine key={i} log={log} />)
              )}
            </div>
          </div>

        </div>

        {/* Status bar */}
        <div style={{ height: 28, background: "#0a6e2e", display: "flex", alignItems: "center", padding: "0 16px", gap: 16, flexShrink: 0 }}>
          <Zap size={11} color="rgba(255,255,255,0.7)" />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>David Adryel SDR v2.0</span>
          <div style={{ width: 1, height: 12, background: "rgba(255,255,255,0.2)" }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{rodando ? "● Rodando" : "○ Aguardando"}</span>
          <div style={{ marginLeft: "auto", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
            Selenium + Gemini AI | Python 3.11
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        input[type=range] {
          -webkit-appearance: none;
          height: 4px;
          border-radius: 2px;
          background: #1e1e1e;
        }
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #22c55e;
          cursor: pointer;
        }
        input::placeholder { color: #2a2a2a; }
      `}</style>
    </div>
  );
}