import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const C = {
  bg: "#0f1117", surface: "#181c27", card: "#1e2333", border: "#2a3045",
  accent: "#ff6b2b", accentSoft: "rgba(255,107,43,0.12)", accentGlow: "rgba(255,107,43,0.3)",
  green: "#22c55e", red: "#ef4444", yellow: "#f59e0b", blue: "#3b82f6",
  text: "#e8ecf4", muted: "#7a8099", dim: "#4a5068", purple: "#a855f7",
};

const brl = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const nowDate = () => new Date().toLocaleDateString("pt-BR");

const Icon = ({ d, size = 18, color = "currentColor", stroke = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cube: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  dollar: "M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  chart: "M18 20V10 M12 20V4 M6 20v-6",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  plus: "M12 5v14 M5 12h14",
  x: "M18 6L6 18 M6 6l12 12",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  printer: "M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z",
  camera: "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  box: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
};

const Btn = ({ children, onClick, variant = "primary", size = "md", icon, full, disabled, loading }) => {
  const sizes = { sm: { padding: "6px 14px", fontSize: 13 }, md: { padding: "10px 20px", fontSize: 14 }, lg: { padding: "14px 28px", fontSize: 15 } };
  const variants = {
    primary: { background: C.accent, color: "#fff", boxShadow: `0 4px 20px ${C.accentGlow}` },
    ghost: { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
    danger: { background: "rgba(239,68,68,0.12)", color: C.red, border: `1px solid rgba(239,68,68,0.3)` },
  };
  return (
    <button onClick={onClick} disabled={disabled || loading}
      style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "inherit", fontWeight: 600, cursor: (disabled || loading) ? "not-allowed" : "pointer", border: "none", borderRadius: 10, transition: "all .18s", opacity: (disabled || loading) ? 0.6 : 1, width: full ? "100%" : undefined, justifyContent: full ? "center" : undefined, ...sizes[size], ...variants[variant] }}>
      {icon && !loading && <Icon d={icons[icon]} size={15} />}
      {loading ? "Aguarde..." : children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = "text", placeholder, suffix, prefix, help }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
      {prefix && <span style={{ position: "absolute", left: 12, fontSize: 13, color: C.muted }}>{prefix}</span>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: prefix ? "10px 12px 10px 28px" : suffix ? "10px 36px 10px 12px" : "10px 12px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }}
        onFocus={e => e.target.style.borderColor = C.accent} onBlur={e => e.target.style.borderColor = C.border} />
      {suffix && <span style={{ position: "absolute", right: 12, fontSize: 13, color: C.muted }}>{suffix}</span>}
    </div>
    {help && <span style={{ fontSize: 11, color: C.dim }}>{help}</span>}
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>{label}</label>}
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 12px", color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none" }}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20, ...style }}>{children}</div>
);

const Badge = ({ children, color = C.accent }) => (
  <span style={{ background: `${color}22`, color, fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 6 }}>{children}</span>
);

const Modal = ({ title, onClose, children, wide }) => (
  <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    onClick={e => e.target === e.currentTarget && onClose()}>
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, width: "100%", maxWidth: wide ? 700 : 480, maxHeight: "90vh", overflowY: "auto", padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h2>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}><Icon d={icons.x} size={20} /></button>
      </div>
      {children}
    </div>
  </div>
);

const StatCard = ({ label, value, sub, color = C.accent, icon }) => (
  <Card>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div>
        <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 800, color, letterSpacing: "-.02em" }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{sub}</div>}
      </div>
      <div style={{ background: `${color}18`, borderRadius: 10, padding: 10 }}>
        <Icon d={icons[icon]} size={20} color={color} />
      </div>
    </div>
  </Card>
);

// ── AUTH ───────────────────────────────────────────────────────────────────
const AuthScreen = () => {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handle = async () => {
    setLoading(true); setMsg("");
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg("Conta criada! Verifique seu email."); setMode("login"); setLoading(false); return;
      }
    } catch (e) { setMsg(e.message || "Erro ao autenticar"); }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ width: "100%", maxWidth: 400, padding: 20 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ background: C.accent, borderRadius: 16, padding: 14, display: "inline-flex", marginBottom: 16 }}><Icon d={icons.cube} size={28} color="#fff" /></div>
          <h1 style={{ color: C.text, fontSize: 28, fontWeight: 900, margin: 0 }}>Print3D Manager</h1>
          <p style={{ color: C.muted, marginTop: 6, fontSize: 14 }}>Gestão completa para impressão 3D</p>
        </div>
        <Card>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["login", "cadastro"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, fontSize: 14, background: mode === m ? C.accent : C.surface, color: mode === m ? "#fff" : C.muted }}>
                {m === "login" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="seu@email.com" />
            <Input label="Senha" value={password} onChange={setPassword} type="password" placeholder="mínimo 6 caracteres" />
            {msg && <div style={{ background: msg.includes("criada") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: msg.includes("criada") ? C.green : C.red, padding: 12, borderRadius: 8, fontSize: 13 }}>{msg}</div>}
            <Btn onClick={handle} loading={loading} full size="lg">{mode === "login" ? "Entrar" : "Criar conta"}</Btn>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── SIDEBAR ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "catalogo", label: "Catálogo", icon: "box" },
  { id: "orcamento", label: "Precificação", icon: "tag" },
  { id: "filamentos", label: "Filamentos", icon: "cube" },
  { id: "pedidos", label: "Pedidos", icon: "printer" },
  { id: "clientes", label: "Clientes", icon: "users" },
  { id: "financeiro", label: "Financeiro", icon: "dollar" },
  { id: "configs", label: "Configurações", icon: "settings" },
];

const Sidebar = ({ active, setActive, user, onLogout }) => (
  <aside style={{ width: 220, background: C.surface, borderRight: `1px solid ${C.border}`, height: "100vh", display: "flex", flexDirection: "column", position: "fixed", top: 0, left: 0, zIndex: 100 }}>
    <div style={{ padding: "24px 20px 18px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ background: C.accent, borderRadius: 10, padding: 8, display: "flex" }}><Icon d={icons.cube} size={18} color="#fff" /></div>
        <div><div style={{ fontWeight: 800, fontSize: 14, color: C.text }}>Print3D</div><div style={{ fontSize: 11, color: C.muted }}>Manager</div></div>
      </div>
    </div>
    <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
      {NAV.map(item => (
        <button key={item.id} onClick={() => setActive(item.id)}
          style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 2, fontFamily: "inherit", fontWeight: active === item.id ? 700 : 500, fontSize: 14, textAlign: "left", background: active === item.id ? C.accentSoft : "transparent", color: active === item.id ? C.accent : C.muted, borderLeft: active === item.id ? `3px solid ${C.accent}` : "3px solid transparent" }}>
          <Icon d={icons[item.icon]} size={17} color={active === item.id ? C.accent : C.muted} />{item.label}
        </button>
      ))}
    </nav>
    <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ fontSize: 11, color: C.dim, marginBottom: 8, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email}</div>
      <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
        <Icon d={icons.logout} size={15} /> Sair
      </button>
    </div>
  </aside>
);

// ── DASHBOARD ──────────────────────────────────────────────────────────────
const Dashboard = ({ filamentos, pedidos, clientes, catalogo }) => {
  const ativos = pedidos.filter(p => p.status !== "entregue" && p.status !== "cancelado").length;
  const receita = pedidos.filter(p => p.status === "pago" || p.status === "entregue").reduce((s, p) => s + (p.preco_final || 0), 0);
  const filLivre = filamentos.reduce((s, f) => s + (((f.peso_atual || f.peso_total) - (f.peso_carretel || 0))), 0);
  const itensEstoque = catalogo.filter(c => c.em_estoque).reduce((s, c) => s + (c.qtd_estoque || 0), 0);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Dashboard</h1>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>Visão geral do seu negócio</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
        <StatCard label="Pedidos Ativos" value={ativos} color={C.accent} icon="printer" />
        <StatCard label="Receita Total" value={brl(receita)} color={C.green} icon="dollar" />
        <StatCard label="Clientes" value={clientes.length} color={C.blue} icon="users" />
        <StatCard label="Filamento Livre" value={`${filLivre.toFixed(0)}g`} color={C.yellow} icon="cube" />
        <StatCard label="Itens Catalogados" value={catalogo.length} sub={`${itensEstoque} em estoque`} color={C.purple} icon="box" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>Pedidos Recentes</h3>
          {pedidos.length === 0 ? <p style={{ color: C.dim, fontSize: 13 }}>Nenhum pedido ainda</p>
            : pedidos.slice(0, 5).map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.nome}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{p.cliente} · {p.data}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{brl(p.preco_final)}</div>
                  <Badge color={p.status === "entregue" ? C.green : p.status === "pago" ? C.blue : C.yellow}>{p.status}</Badge>
                </div>
              </div>
            ))}
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: C.text }}>Catálogo em Destaque</h3>
          {catalogo.length === 0 ? <p style={{ color: C.dim, fontSize: 13 }}>Nenhum produto catalogado</p>
            : catalogo.slice(0, 5).map(p => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
                {p.foto_url
                  ? <img src={p.foto_url} alt={p.nome} style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }} />
                  : <div style={{ width: 38, height: 38, borderRadius: 8, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={icons.box} size={16} color={C.dim} /></div>}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{p.nome}</div>
                  <div style={{ fontSize: 12, color: C.muted }}>{brl(p.preco_venda)}</div>
                </div>
                <Badge color={p.em_estoque ? C.green : C.yellow}>{p.em_estoque ? `${p.qtd_estoque || 0} un` : "Sob pedido"}</Badge>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
};

// ── CATÁLOGO ───────────────────────────────────────────────────────────────
const Catalogo = ({ catalogo, filamentos, configs, onAdd, onUpd, onDel }) => {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busca, setBusca] = useState("");
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoFile, setFotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const empty = { nome: "", filamento_id: "", consumo_g: "", preco_venda: "", em_estoque: false, qtd_estoque: 0, descricao: "", foto_url: "" };
  const [form, setForm] = useState(empty);
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const fil = filamentos.find(x => x.id === form.filamento_id);
  const pesoUtil = fil ? ((fil.peso_atual || fil.peso_total) - (fil.peso_carretel || 0)) : 0;
  const custog = (fil && pesoUtil > 0) ? fil.valor_pago / pesoUtil : 0;
  const custoFil = (parseFloat(form.consumo_g) || 0) * custog;
  const g = parseFloat(form.consumo_g) || 0;
  const horasEst = g / 50;
  const custoEnergia = horasEst * 0.2 * (configs?.energia_kwh || 0.85);
  const custoMao = horasEst * (configs?.custo_hora || 15);
  const custoTotal = custoFil + custoEnergia + custoMao;

  const abrir = (item = null) => {
    setEditando(item);
    setForm(item ? { nome: item.nome || "", filamento_id: item.filamento_id || "", consumo_g: item.consumo_g || "", preco_venda: item.preco_venda || "", em_estoque: item.em_estoque || false, qtd_estoque: item.qtd_estoque || 0, descricao: item.descricao || "", foto_url: item.foto_url || "" } : empty);
    setFotoPreview(item?.foto_url || null);
    setFotoFile(null);
    setModal(true);
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const salvar = async () => {
    if (!form.nome) return alert("Preencha o nome do produto.");
    setLoading(true);
    let foto_url = form.foto_url;
    if (fotoFile) {
      const ext = fotoFile.name.split(".").pop();
      const path = `catalogo/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("fotos").upload(path, fotoFile, { upsert: true });
      if (!upErr) { const { data } = supabase.storage.from("fotos").getPublicUrl(path); foto_url = data.publicUrl; }
    }
    const payload = { ...form, foto_url, consumo_g: parseFloat(form.consumo_g) || 0, preco_venda: parseFloat(form.preco_venda) || 0, qtd_estoque: parseInt(form.qtd_estoque) || 0, custo_producao: custoTotal };
    editando ? await onUpd(editando.id, payload) : await onAdd(payload);
    setModal(false); setLoading(false);
  };

  const filtrados = catalogo.filter(p => p.nome?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Catálogo de Produtos</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: "4px 0 0" }}>Produtos com foto, custo e controle de estoque</p></div>
        <Btn onClick={() => abrir()} icon="plus">Novo Produto</Btn>
      </div>
      <div style={{ marginBottom: 16 }}><Input value={busca} onChange={setBusca} placeholder="🔍  Buscar produto..." /></div>
      {filtrados.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 60 }}>
          <Icon d={icons.box} size={48} color={C.dim} />
          <p style={{ color: C.dim, marginTop: 12 }}>Nenhum produto cadastrado</p>
          <div style={{ marginTop: 16 }}><Btn onClick={() => abrir()} icon="plus" size="sm">Adicionar primeiro produto</Btn></div>
        </Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
          {filtrados.map(p => (
            <Card key={p.id} style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                {p.foto_url
                  ? <img src={p.foto_url} alt={p.nome} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                  : <div style={{ width: "100%", height: 180, background: C.surface, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={icons.camera} size={40} color={C.dim} /></div>}
                <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 6 }}>
                  <button onClick={() => abrir(p)} style={{ background: "rgba(30,35,51,.9)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: C.text }}><Icon d={icons.edit} size={14} /></button>
                  <button onClick={() => { if (confirm("Excluir este produto?")) onDel(p.id); }} style={{ background: "rgba(239,68,68,.2)", border: "none", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: C.red }}><Icon d={icons.trash} size={14} /></button>
                </div>
                <div style={{ position: "absolute", top: 10, left: 10 }}>
                  <Badge color={p.em_estoque ? C.green : C.yellow}>{p.em_estoque ? `${p.qtd_estoque || 0} em estoque` : "Sob pedido"}</Badge>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 4 }}>{p.nome}</div>
                {p.descricao && <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{p.descricao}</div>}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Custo</div><div style={{ fontWeight: 700, color: C.text }}>{brl(p.custo_producao)}</div></div>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Preço venda</div><div style={{ fontWeight: 700, color: C.accent }}>{brl(p.preco_venda)}</div></div>
                </div>
                {p.consumo_g > 0 && <div style={{ fontSize: 11, color: C.dim, marginTop: 8 }}>Filamento: {p.consumo_g}g</div>}
              </div>
            </Card>
          ))}
        </div>
      )}

      {modal && (
        <Modal title={editando ? "Editar Produto" : "Novo Produto"} onClose={() => setModal(false)} wide>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em", display: "block", marginBottom: 8 }}>Foto do Produto</label>
              <label style={{ display: "block", cursor: "pointer" }}>
                <input type="file" accept="image/*" capture="environment" onChange={handleFoto} style={{ display: "none" }} />
                {fotoPreview
                  ? <img src={fotoPreview} alt="preview" style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 12, border: `2px solid ${C.accent}` }} />
                  : <div style={{ width: "100%", height: 200, background: C.surface, border: `2px dashed ${C.border}`, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: C.muted }}>
                    <Icon d={icons.camera} size={32} color={C.muted} />
                    <span style={{ fontSize: 13 }}>Tirar foto ou escolher imagem</span>
                    <span style={{ fontSize: 11, color: C.dim }}>Toque para selecionar</span>
                  </div>}
              </label>
              {fotoPreview && <button onClick={() => { setFotoPreview(null); setFotoFile(null); sf("foto_url", ""); }} style={{ marginTop: 8, background: "none", border: "none", color: C.red, fontSize: 12, cursor: "pointer" }}>Remover foto</button>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Input label="Nome do produto" value={form.nome} onChange={v => sf("nome", v)} placeholder="Ex: Vaso decorativo..." />
              <Input label="Descrição (opcional)" value={form.descricao} onChange={v => sf("descricao", v)} placeholder="Detalhes do produto..." />
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0" }}>
                <input type="checkbox" id="estoque" checked={form.em_estoque} onChange={e => sf("em_estoque", e.target.checked)} style={{ accentColor: C.accent, width: 16, height: 16 }} />
                <label htmlFor="estoque" style={{ color: C.text, fontSize: 14, cursor: "pointer", fontWeight: 600 }}>Em estoque</label>
              </div>
              {form.em_estoque && <Input label="Quantidade em estoque" value={form.qtd_estoque} onChange={v => sf("qtd_estoque", v)} type="number" suffix="un" />}
            </div>
          </div>

          <div style={{ marginTop: 20, padding: 16, background: C.surface, borderRadius: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.accent, marginBottom: 14 }}>📊 Cálculo de Custo Automático</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Select label="Filamento usado" value={form.filamento_id} onChange={v => sf("filamento_id", v)}
                options={[{ value: "", label: "— Selecionar —" }, ...filamentos.map(f => ({ value: f.id, label: `${f.marca} ${f.material} ${f.cor ? "("+f.cor+")" : ""}` }))]} />
              <Input label="Consumo de filamento" value={form.consumo_g} onChange={v => sf("consumo_g", v)} type="number" suffix="g" />
            </div>
            {(form.filamento_id && form.consumo_g) && (
              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                {[["Filamento", custoFil, false], ["Energia", custoEnergia, false], ["Mão de obra", custoMao, false], ["Total", custoTotal, true]].map(([l, v, bold]) => (
                  <div key={l} style={{ background: bold ? C.accentSoft : C.card, border: `1px solid ${bold ? C.accentGlow : C.border}`, borderRadius: 8, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 11, color: bold ? C.accent : C.muted, marginBottom: 4 }}>{l}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: bold ? C.accent : C.text }}>{brl(v)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: 16 }}>
            <Input label="Preço de venda" value={form.preco_venda} onChange={v => sf("preco_venda", v)} type="number" prefix="R$" placeholder="0,00" />
            {form.preco_venda && custoTotal > 0 && parseFloat(form.preco_venda) > 0 && (
              <div style={{ marginTop: 8, padding: 10, background: "rgba(34,197,94,0.08)", borderRadius: 8, fontSize: 12, color: C.green }}>
                Lucro: {brl(parseFloat(form.preco_venda) - custoTotal)} · Margem: {((parseFloat(form.preco_venda) - custoTotal) / parseFloat(form.preco_venda) * 100).toFixed(1)}%
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Btn onClick={salvar} loading={loading} full>{editando ? "Salvar alterações" : "Adicionar ao catálogo"}</Btn>
            <Btn onClick={() => setModal(false)} variant="ghost" full>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── FILAMENTOS ─────────────────────────────────────────────────────────────
const MATERIAIS = ["PLA", "PETG", "ABS", "TPU", "ASA", "Nylon", "PLA+", "PETG-CF", "Resina", "Outro"];

const Filamentos = ({ filamentos, onAdd, onUpd, onDel }) => {
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const empty = { marca: "", material: "PLA", cor: "", peso_total: 1000, peso_atual: "", peso_carretel: 200, valor_pago: "" };
  const [form, setForm] = useState(empty);
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pesoUtil = parseFloat(form.peso_atual || form.peso_total || 0) - parseFloat(form.peso_carretel || 0);

  const abrir = (item = null) => {
    setEditando(item);
    setForm(item ? { marca: item.marca || "", material: item.material || "PLA", cor: item.cor || "", peso_total: item.peso_total || 1000, peso_atual: item.peso_atual || "", peso_carretel: item.peso_carretel ?? 200, valor_pago: item.valor_pago || "" } : empty);
    setModal(true);
  };

  const salvar = async () => {
    if (!form.marca || !form.valor_pago) return alert("Preencha marca e valor.");
    setLoading(true);
    const payload = { ...form, peso_total: parseFloat(form.peso_total), peso_atual: parseFloat(form.peso_atual) || parseFloat(form.peso_total), peso_carretel: parseFloat(form.peso_carretel) || 0, valor_pago: parseFloat(form.valor_pago) };
    editando ? await onUpd(editando.id, payload) : await onAdd(payload);
    setModal(false); setLoading(false);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Filamentos</h1>
          <p style={{ color: C.muted, fontSize: 14, margin: "4px 0 0" }}>Gerencie seu estoque de filamentos</p></div>
        <Btn onClick={() => abrir()} icon="plus">Novo Filamento</Btn>
      </div>
      {filamentos.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 60 }}><Icon d={icons.cube} size={48} color={C.dim} /><p style={{ color: C.dim, marginTop: 12 }}>Nenhum filamento cadastrado</p></Card>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 16 }}>
          {filamentos.map(f => {
            const pesoAtual = f.peso_atual || f.peso_total;
            const carretel = f.peso_carretel || 0;
            const util = pesoAtual - carretel;
            const pct = Math.max(0, Math.min(100, (util / f.peso_total) * 100));
            const custog = util > 0 ? f.valor_pago / util : 0;
            return (
              <Card key={f.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 15 }}>{f.marca}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                      <Badge color={C.blue}>{f.material}</Badge>
                      {f.cor && <Badge color={C.muted}>{f.cor}</Badge>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => abrir(f)} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: C.text }}><Icon d={icons.edit} size={14} /></button>
                    <button onClick={() => { if (confirm("Excluir este filamento?")) onDel(f.id); }} style={{ background: "rgba(239,68,68,.1)", border: `1px solid rgba(239,68,68,.3)`, borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: C.red }}><Icon d={icons.trash} size={14} /></button>
                  </div>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.muted, marginBottom: 6 }}>
                    <span>Filamento útil: <strong style={{ color: util > 100 ? C.green : util > 0 ? C.yellow : C.red }}>{util.toFixed(0)}g</strong></span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: 8, background: C.surface, borderRadius: 4 }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: pct > 50 ? C.green : pct > 20 ? C.yellow : C.red, borderRadius: 4 }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Peso total</div><div style={{ fontWeight: 700, color: C.text }}>{f.peso_total}g</div></div>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Carretel</div><div style={{ fontWeight: 700, color: C.text }}>{carretel}g</div></div>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Custo/g</div><div style={{ fontWeight: 700, color: C.accent }}>{brl(custog)}</div></div>
                </div>
                <div style={{ marginTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Peso atual (c/ carretel)</div><div style={{ fontWeight: 700, color: C.text }}>{pesoAtual}g</div></div>
                  <div style={{ background: C.surface, borderRadius: 8, padding: 8 }}><div style={{ color: C.muted }}>Valor pago</div><div style={{ fontWeight: 700, color: C.text }}>{brl(f.valor_pago)}</div></div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {modal && (
        <Modal title={editando ? "Editar Filamento" : "Novo Filamento"} onClose={() => setModal(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Marca" value={form.marca} onChange={v => sf("marca", v)} placeholder="Ex: Esun, Bambu..." />
              <Select label="Material" value={form.material} onChange={v => sf("material", v)} options={MATERIAIS.map(m => ({ value: m, label: m }))} />
            </div>
            <Input label="Cor" value={form.cor} onChange={v => sf("cor", v)} placeholder="Ex: Branco, Preto..." />
            <div style={{ padding: 14, background: C.surface, borderRadius: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.accent, marginBottom: 12 }}>⚖️ Pesos do Filamento</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <Input label="Peso total (rolo novo)" value={form.peso_total} onChange={v => sf("peso_total", v)} type="number" suffix="g" help="Ex: 1000g" />
                <Input label="Peso atual (com carretel)" value={form.peso_atual} onChange={v => sf("peso_atual", v)} type="number" suffix="g" help="Pese agora na balança" />
                <Input label="Peso carretel vazio" value={form.peso_carretel} onChange={v => sf("peso_carretel", v)} type="number" suffix="g" help="Ex: 200g" />
              </div>
              <div style={{ marginTop: 10, padding: 10, background: C.card, borderRadius: 8, fontSize: 13 }}>
                <span style={{ color: C.muted }}>Filamento útil disponível: </span>
                <strong style={{ color: pesoUtil > 0 ? C.green : C.red }}>{pesoUtil.toFixed(0)}g</strong>
                <span style={{ color: C.dim, fontSize: 11, marginLeft: 8 }}>({form.peso_atual || form.peso_total}g − {form.peso_carretel || 0}g carretel)</span>
              </div>
            </div>
            <Input label="Valor pago pelo rolo" value={form.valor_pago} onChange={v => sf("valor_pago", v)} type="number" prefix="R$" placeholder="0,00" />
            <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
              <Btn onClick={salvar} loading={loading} full>{editando ? "Salvar alterações" : "Adicionar filamento"}</Btn>
              <Btn onClick={() => setModal(false)} variant="ghost" full>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PRECIFICAÇÃO ───────────────────────────────────────────────────────────
const Orcamento = ({ filamentos, clientes, configs, onAddPedido }) => {
  const [nome, setNome] = useState(""); const [filId, setFilId] = useState(""); const [consumoG, setConsumoG] = useState("");
  const [tempH, setTempH] = useState(0); const [tempM, setTempM] = useState(0); const [tempoMao, setTempoMao] = useState(0);
  const [modelagem, setModelagem] = useState(0); const [retrabalho, setRetrabalho] = useState(0); const [urgencia, setUrgencia] = useState(0);
  const [clienteId, setClienteId] = useState(""); const [margem, setMargem] = useState(configs?.margem_lucro || 50); const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const fil = filamentos.find(f => f.id === filId);
    const util = fil ? ((fil.peso_atual || fil.peso_total) - (fil.peso_carretel || 0)) : 0;
    const custog = (fil && util > 0) ? fil.valor_pago / util : 0;
    const custoFil = (parseFloat(consumoG) || 0) * custog;
    const mins = (parseFloat(tempH) || 0) * 60 + (parseFloat(tempM) || 0);
    const ch = configs?.custo_hora || 15;
    const custoPrint = (mins / 60) * ch;
    const custoEnergia = (mins / 60) * 0.2 * (configs?.energia_kwh || 0.85);
    const custoMao = (parseFloat(tempoMao) || 0) / 60 * ch;
    const custoMod = parseFloat(modelagem) || 0;
    const custoProducao = custoFil + custoPrint + custoEnergia + custoMao + custoMod;
    const custoRetrab = custoProducao * ((parseFloat(retrabalho) || 0) / 100);
    const custoTotal = custoProducao + custoRetrab;
    const base = custoTotal * (1 + (parseFloat(urgencia) || 0) / 100 + (configs?.marketplace || 0) / 100 + (configs?.cartao || 0) / 100 + (configs?.nf || 0) / 100);
    const preco = margem < 100 ? base / (1 - margem / 100) : base * 2;
    setResultado({ custoFil, custoPrint, custoEnergia, custoMao, custoMod, custoTotal, preco, lucro: preco - base });
  };

  const salvar = async () => {
    if (!resultado || !nome) return alert("Preencha o nome e calcule primeiro.");
    const cliente = clientes.find(c => c.id === clienteId);
    await onAddPedido({ nome, cliente: cliente?.nome || "—", cliente_id: clienteId || null, preco_final: resultado.preco, custo_total: resultado.custoTotal, lucro: resultado.lucro, status: "pendente", data: nowDate() });
    alert("Pedido criado!");
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Precificação</h1>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>Calcule o preço ideal automaticamente</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: C.accent }}>📋 Dados do Pedido</h3>
            <div style={{ display: "grid", gap: 14 }}>
              <Input label="Nome do produto" value={nome} onChange={setNome} placeholder="Ex: Suporte de parede..." />
              <Select label="Cliente" value={clienteId} onChange={setClienteId} options={[{ value: "", label: "— Sem cliente —" }, ...clientes.map(c => ({ value: c.id, label: c.nome }))]} />
            </div>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: C.accent }}>🧵 Filamento</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Select label="Filamento" value={filId} onChange={setFilId} options={[{ value: "", label: "— Selecionar —" }, ...filamentos.map(f => ({ value: f.id, label: `${f.marca} ${f.material} ${f.cor ? "("+f.cor+")" : ""}` }))]} />
              <Input label="Consumo estimado" value={consumoG} onChange={setConsumoG} type="number" suffix="g" />
            </div>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: C.accent }}>⏱ Tempo e Mão de Obra</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Horas de impressão" value={tempH} onChange={setTempH} type="number" suffix="h" />
              <Input label="Minutos" value={tempM} onChange={setTempM} type="number" suffix="min" />
              <Input label="Pós-impressão" value={tempoMao} onChange={setTempoMao} type="number" suffix="min" />
              <Input label="Modelagem 3D" value={modelagem} onChange={setModelagem} type="number" prefix="R$" />
            </div>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 700, color: C.accent }}>💡 Custos Extras</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Retrabalho" value={retrabalho} onChange={setRetrabalho} type="number" suffix="%" />
              <Input label="Urgência" value={urgencia} onChange={setUrgencia} type="number" suffix="%" />
            </div>
          </Card>
          <Btn onClick={calcular} icon="zap" full size="lg">Calcular Preço</Btn>
        </div>
        <div>
          <Card style={{ position: "sticky", top: 20 }}>
            <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: C.text }}>📊 Resultado</h3>
            {resultado ? (
              <>
                {[["Filamento", resultado.custoFil], ["Máquina", resultado.custoPrint], ["Energia", resultado.custoEnergia], ["Mão de obra", resultado.custoMao], ["Modelagem", resultado.custoMod]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>
                    <span style={{ color: C.muted }}>{l}</span><span style={{ color: C.text }}>{brl(v)}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontSize: 15, fontWeight: 700 }}>
                  <span style={{ color: C.text }}>Custo total</span><span style={{ color: C.accent }}>{brl(resultado.custoTotal)}</span>
                </div>
                <div style={{ margin: "14px 0 10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Margem de lucro</span>
                    <Badge color={C.green}>{margem}%</Badge>
                  </div>
                  <input type="range" min={0} max={200} value={margem} onChange={e => setMargem(+e.target.value)} style={{ width: "100%", accentColor: C.accent }} />
                </div>
                <div style={{ background: C.accentSoft, border: `1px solid ${C.accentGlow}`, borderRadius: 12, padding: 16, textAlign: "center", marginTop: 16 }}>
                  <div style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 4 }}>PREÇO CALCULADO</div>
                  <div style={{ fontSize: 32, fontWeight: 900, color: C.accent }}>{brl(resultado.preco)}</div>
                  <div style={{ fontSize: 12, color: C.green, marginTop: 4 }}>Lucro: {brl(resultado.lucro)}</div>
                </div>
                <div style={{ marginTop: 14 }}><Btn onClick={salvar} icon="plus" full>Criar Pedido</Btn></div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: C.dim }}>
                <Icon d={icons.tag} size={40} color={C.dim} />
                <p style={{ marginTop: 12, fontSize: 13 }}>Preencha e clique em "Calcular Preço"</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ── PEDIDOS ────────────────────────────────────────────────────────────────
const STATUS = ["pendente", "em produção", "pronto", "entregue", "pago", "cancelado"];
const statusColor = { pendente: C.yellow, "em produção": C.blue, pronto: C.accent, entregue: C.green, pago: C.green, cancelado: C.red };

const Pedidos = ({ pedidos, clientes, onAdd, onUpd, onDel }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: "", cliente_id: "", preco_final: "", status: "pendente", obs: "" });
  const [busca, setBusca] = useState("");
  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const add = async () => {
    if (!form.nome) return;
    const cl = clientes.find(c => c.id === form.cliente_id);
    await onAdd({ ...form, cliente: cl?.nome || "—", preco_final: parseFloat(form.preco_final) || 0, data: nowDate() });
    setModal(false); setForm({ nome: "", cliente_id: "", preco_final: "", status: "pendente", obs: "" });
  };

  const filtrados = pedidos.filter(p => p.nome?.toLowerCase().includes(busca.toLowerCase()) || p.cliente?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Pedidos</h1><p style={{ color: C.muted, fontSize: 14, margin: "4px 0 0" }}>Gerencie seus pedidos</p></div>
        <Btn onClick={() => setModal(true)} icon="plus">Novo Pedido</Btn>
      </div>
      <div style={{ marginBottom: 16 }}><Input value={busca} onChange={setBusca} placeholder="🔍  Buscar pedido..." /></div>
      {filtrados.length === 0 ? (
        <Card style={{ textAlign: "center", padding: 60 }}><Icon d={icons.printer} size={48} color={C.dim} /><p style={{ color: C.dim, marginTop: 12 }}>Nenhum pedido encontrado</p></Card>
      ) : (
        <Card style={{ padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: C.surface }}>{["Produto", "Cliente", "Data", "Preço", "Status", ""].map(h => (
              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: ".06em" }}>{h}</th>
            ))}</tr></thead>
            <tbody>{filtrados.map((p, i) => (
              <tr key={p.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.01)" }}>
                <td style={{ padding: "14px 16px", color: C.text, fontWeight: 600 }}>{p.nome}</td>
                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 13 }}>{p.cliente || "—"}</td>
                <td style={{ padding: "14px 16px", color: C.muted, fontSize: 13 }}>{p.data}</td>
                <td style={{ padding: "14px 16px", color: C.accent, fontWeight: 700 }}>{brl(p.preco_final)}</td>
                <td style={{ padding: "14px 16px" }}>
                  <select value={p.status} onChange={e => onUpd(p.id, { status: e.target.value })}
                    style={{ background: `${statusColor[p.status] || C.accent}22`, color: statusColor[p.status] || C.accent, border: "none", borderRadius: 6, padding: "4px 8px", fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}>
                    {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button onClick={() => { if (confirm("Excluir este pedido?")) onDel(p.id); }} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer" }}><Icon d={icons.trash} size={15} /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
      {modal && (
        <Modal title="Novo Pedido" onClose={() => setModal(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Nome do produto" value={form.nome} onChange={v => sf("nome", v)} />
            <Select label="Cliente" value={form.cliente_id} onChange={v => sf("cliente_id", v)} options={[{ value: "", label: "— Sem cliente —" }, ...clientes.map(c => ({ value: c.id, label: c.nome }))]} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Preço de venda" value={form.preco_final} onChange={v => sf("preco_final", v)} type="number" prefix="R$" />
              <Select label="Status" value={form.status} onChange={v => sf("status", v)} options={STATUS.map(s => ({ value: s, label: s }))} />
            </div>
            <Input label="Observações" value={form.obs} onChange={v => sf("obs", v)} />
            <div style={{ display: "flex", gap: 10 }}>
              <Btn onClick={add} full>Criar Pedido</Btn>
              <Btn onClick={() => setModal(false)} variant="ghost" full>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── CLIENTES ───────────────────────────────────────────────────────────────
const Clientes = ({ clientes, pedidos, onAdd, onDel }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", tel: "", cidade: "" });
  const [busca, setBusca] = useState("");
  const add = async () => { if (!form.nome) return; await onAdd(form); setModal(false); setForm({ nome: "", email: "", tel: "", cidade: "" }); };
  const filtrados = clientes.filter(c => c.nome?.toLowerCase().includes(busca.toLowerCase()));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div><h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, margin: 0 }}>Clientes</h1><p style={{ color: C.muted, fontSize: 14, margin: "4px 0 0" }}>Base de clientes</p></div>
        <Btn onClick={() => setModal(true)} icon="plus">Novo Cliente</Btn>
      </div>
      <div style={{ marginBottom: 16 }}><Input value={busca} onChange={setBusca} placeholder="🔍  Buscar cliente..." /></div>
      {filtrados.length === 0 ? <Card style={{ textAlign: "center", padding: 60 }}><Icon d={icons.users} size={48} color={C.dim} /><p style={{ color: C.dim, marginTop: 12 }}>Nenhum cliente</p></Card>
        : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {filtrados.map(c => {
            const ps = pedidos.filter(p => p.cliente_id === c.id);
            return (
              <Card key={c.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ background: C.accentSoft, color: C.accent, borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16 }}>{c.nome[0].toUpperCase()}</div>
                  <button onClick={() => { if (confirm("Excluir cliente?")) onDel(c.id); }} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer" }}><Icon d={icons.trash} size={15} /></button>
                </div>
                <div style={{ fontWeight: 700, color: C.text, fontSize: 15, marginBottom: 4 }}>{c.nome}</div>
                {c.email && <div style={{ fontSize: 12, color: C.muted }}>{c.email}</div>}
                {c.tel && <div style={{ fontSize: 12, color: C.muted }}>{c.tel}</div>}
                {c.cidade && <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>{c.cidade}</div>}
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <Badge color={C.blue}>{ps.length} pedido{ps.length !== 1 ? "s" : ""}</Badge>
                  <Badge color={C.green}>{brl(ps.reduce((s, p) => s + (p.preco_final || 0), 0))}</Badge>
                </div>
              </Card>
            );
          })}
        </div>}
      {modal && (
        <Modal title="Novo Cliente" onClose={() => setModal(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Nome completo" value={form.nome} onChange={v => setForm(f => ({ ...f, nome: v }))} />
            <Input label="Email" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Telefone" value={form.tel} onChange={v => setForm(f => ({ ...f, tel: v }))} />
              <Input label="Cidade" value={form.cidade} onChange={v => setForm(f => ({ ...f, cidade: v }))} />
            </div>
            <div style={{ display: "flex", gap: 10 }}><Btn onClick={add} full>Cadastrar</Btn><Btn onClick={() => setModal(false)} variant="ghost" full>Cancelar</Btn></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── FINANCEIRO ─────────────────────────────────────────────────────────────
const Financeiro = ({ pedidos }) => {
  const pagos = pedidos.filter(p => p.status === "pago" || p.status === "entregue");
  const receita = pagos.reduce((s, p) => s + (p.preco_final || 0), 0);
  const custos = pagos.reduce((s, p) => s + (p.custo_total || 0), 0);
  const lucro = receita - custos;
  const mg = receita > 0 ? (lucro / receita * 100).toFixed(1) : 0;
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Financeiro</h1>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>Saúde financeira do negócio</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 24 }}>
        <StatCard label="Receita Total" value={brl(receita)} color={C.green} icon="dollar" />
        <StatCard label="Custo Total" value={brl(custos)} color={C.red} icon="tag" />
        <StatCard label="Lucro Líquido" value={brl(lucro)} sub={`margem ${mg}%`} color={C.accent} icon="chart" />
      </div>
      <Card>
        <h3 style={{ margin: "0 0 18px", fontSize: 15, fontWeight: 700, color: C.text }}>Pedidos Finalizados</h3>
        {pagos.length === 0 ? <p style={{ color: C.dim, fontSize: 13 }}>Nenhum pedido finalizado</p>
          : <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>{["Produto", "Cliente", "Data", "Custo", "Preço", "Lucro"].map(h => (
              <th key={h} style={{ padding: "10px 0", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{h}</th>
            ))}</tr></thead>
            <tbody>{pagos.map(p => (
              <tr key={p.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ padding: "12px 0", color: C.text, fontWeight: 600 }}>{p.nome}</td>
                <td style={{ padding: "12px 0", color: C.muted, fontSize: 13 }}>{p.cliente || "—"}</td>
                <td style={{ padding: "12px 0", color: C.muted, fontSize: 13 }}>{p.data}</td>
                <td style={{ padding: "12px 0", color: C.red }}>{brl(p.custo_total)}</td>
                <td style={{ padding: "12px 0", color: C.text, fontWeight: 600 }}>{brl(p.preco_final)}</td>
                <td style={{ padding: "12px 0", color: (p.preco_final - (p.custo_total || 0)) >= 0 ? C.green : C.red, fontWeight: 700 }}>{brl(p.preco_final - (p.custo_total || 0))}</td>
              </tr>
            ))}</tbody>
          </table>}
      </Card>
    </div>
  );
};

// ── CONFIGS ────────────────────────────────────────────────────────────────
const Configs = ({ configs, onSave }) => {
  const [form, setForm] = useState({ custo_hora: 15, energia_kwh: 0.85, margem_lucro: 50, marketplace: 0, cartao: 0, nf: 0, ...configs });
  const [loading, setLoading] = useState(false);
  const sf = (k, v) => setForm(f => ({ ...f, [k]: parseFloat(v) || 0 }));
  const save = async () => { setLoading(true); await onSave(form); setLoading(false); alert("Configurações salvas!"); };
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 6 }}>Configurações</h1>
      <p style={{ color: C.muted, marginBottom: 24, fontSize: 14 }}>Parâmetros usados na precificação</p>
      <div style={{ display: "grid", gap: 16, maxWidth: 600 }}>
        <Card>
          <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 700, color: C.accent }}>⚙️ Custos de Operação</h3>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Custo por hora (máquina + mão de obra)" value={form.custo_hora} onChange={v => sf("custo_hora", v)} type="number" prefix="R$" suffix="/h" help="Valor cobrado por hora de impressão" />
            <Input label="Energia elétrica" value={form.energia_kwh} onChange={v => sf("energia_kwh", v)} type="number" prefix="R$" suffix="/kWh" help="Tarifa de energia da sua cidade" />
          </div>
        </Card>
        <Card>
          <h3 style={{ margin: "0 0 18px", fontSize: 14, fontWeight: 700, color: C.accent }}>📊 Margens e Taxas</h3>
          <div style={{ display: "grid", gap: 14 }}>
            <Input label="Margem de lucro padrão" value={form.margem_lucro} onChange={v => sf("margem_lucro", v)} type="number" suffix="%" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Input label="Marketplace (%)" value={form.marketplace} onChange={v => sf("marketplace", v)} type="number" suffix="%" help="Mercado Livre, Shopee..." />
              <Input label="Cartão (%)" value={form.cartao} onChange={v => sf("cartao", v)} type="number" suffix="%" />
            </div>
            <Input label="Nota Fiscal (%)" value={form.nf} onChange={v => sf("nf", v)} type="number" suffix="%" />
          </div>
        </Card>
        <Btn onClick={save} loading={loading} icon="check" size="lg">Salvar Configurações</Btn>
      </div>
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [filamentos, setFilamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [configs, setConfigs] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setUser(session?.user ?? null); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [f, c, p, cat, cfg] = await Promise.all([
        supabase.from("filamentos").select("*").order("created_at", { ascending: false }),
        supabase.from("clientes").select("*").order("created_at", { ascending: false }),
        supabase.from("pedidos").select("*").order("created_at", { ascending: false }),
        supabase.from("catalogo").select("*").order("created_at", { ascending: false }),
        supabase.from("configs").select("*").eq("user_id", user.id).single(),
      ]);
      if (f.data) setFilamentos(f.data);
      if (c.data) setClientes(c.data);
      if (p.data) setPedidos(p.data);
      if (cat.data) setCatalogo(cat.data);
      if (cfg.data) setConfigs(cfg.data);
    })();
  }, [user]);

  const logout = () => supabase.auth.signOut();

  const addF = async (d) => { const { data: r } = await supabase.from("filamentos").insert({ ...d, user_id: user.id }).select().single(); if (r) setFilamentos(p => [r, ...p]); };
  const updF = async (id, d) => { await supabase.from("filamentos").update(d).eq("id", id); setFilamentos(p => p.map(f => f.id === id ? { ...f, ...d } : f)); };
  const delF = async (id) => { await supabase.from("filamentos").delete().eq("id", id); setFilamentos(p => p.filter(f => f.id !== id)); };

  const addC = async (d) => { const { data: r } = await supabase.from("clientes").insert({ ...d, user_id: user.id }).select().single(); if (r) setClientes(p => [r, ...p]); };
  const delC = async (id) => { await supabase.from("clientes").delete().eq("id", id); setClientes(p => p.filter(c => c.id !== id)); };

  const addP = async (d) => { const { data: r } = await supabase.from("pedidos").insert({ ...d, user_id: user.id }).select().single(); if (r) setPedidos(p => [r, ...p]); };
  const updP = async (id, d) => { await supabase.from("pedidos").update(d).eq("id", id); setPedidos(p => p.map(x => x.id === id ? { ...x, ...d } : x)); };
  const delP = async (id) => { await supabase.from("pedidos").delete().eq("id", id); setPedidos(p => p.filter(x => x.id !== id)); };

  const addCat = async (d) => { const { data: r } = await supabase.from("catalogo").insert({ ...d, user_id: user.id }).select().single(); if (r) setCatalogo(p => [r, ...p]); };
  const updCat = async (id, d) => { await supabase.from("catalogo").update(d).eq("id", id); setCatalogo(p => p.map(x => x.id === id ? { ...x, ...d } : x)); };
  const delCat = async (id) => { await supabase.from("catalogo").delete().eq("id", id); setCatalogo(p => p.filter(x => x.id !== id)); };

  const saveCfg = async (d) => { const { data: r } = await supabase.from("configs").upsert({ ...d, user_id: user.id }, { onConflict: "user_id" }).select().single(); if (r) setConfigs(r); };

  if (loading) return <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", color: C.muted, fontFamily: "sans-serif" }}>Carregando...</div>;
  if (!user) return <AuthScreen />;

  const pages = {
    dashboard: <Dashboard filamentos={filamentos} pedidos={pedidos} clientes={clientes} catalogo={catalogo} />,
    catalogo: <Catalogo catalogo={catalogo} filamentos={filamentos} configs={configs} onAdd={addCat} onUpd={updCat} onDel={delCat} />,
    orcamento: <Orcamento filamentos={filamentos} clientes={clientes} configs={configs} onAddPedido={addP} />,
    filamentos: <Filamentos filamentos={filamentos} onAdd={addF} onUpd={updF} onDel={delF} />,
    pedidos: <Pedidos pedidos={pedidos} clientes={clientes} onAdd={addP} onUpd={updP} onDel={delP} />,
    clientes: <Clientes clientes={clientes} pedidos={pedidos} onAdd={addC} onDel={delC} />,
    financeiro: <Financeiro pedidos={pedidos} />,
    configs: <Configs configs={configs} onSave={saveCfg} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: C.bg, color: C.text, minHeight: "100vh", display: "flex" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } input, select { color-scheme: dark; } ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: ${C.surface}; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }`}</style>
      <Sidebar active={page} setActive={setPage} user={user} onLogout={logout} />
      <main style={{ flex: 1, marginLeft: 220, padding: "32px 36px", maxWidth: "100%", overflowX: "hidden" }}>{pages[page]}</main>
    </div>
  );
}
