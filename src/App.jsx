import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase.js";

const LOGO_URL = "https://i.imgur.com/placeholder.png";

const DARK = {
  bg:"#0f1117",surface:"#181c27",card:"#1e2333",border:"#2a3045",
  accent:"#c084fc",accentSoft:"rgba(192,132,252,0.12)",accentGlow:"rgba(192,132,252,0.3)",
  green:"#22c55e",red:"#ef4444",yellow:"#f59e0b",blue:"#3b82f6",
  text:"#e8ecf4",muted:"#7a8099",dim:"#4a5068",purple:"#a855f7",
  inputBg:"#181c27",navActive:"rgba(192,132,252,0.12)",isDark:true,
};
const LIGHT = {
  bg:"#f8f5ff",surface:"#ffffff",card:"#ffffff",border:"#e5d9f9",
  accent:"#9333ea",accentSoft:"rgba(147,51,234,0.08)",accentGlow:"rgba(147,51,234,0.25)",
  green:"#16a34a",red:"#dc2626",yellow:"#d97706",blue:"#2563eb",
  text:"#1e1b4b",muted:"#6b7280",dim:"#9ca3af",purple:"#7c3aed",
  inputBg:"#f3eeff",navActive:"rgba(147,51,234,0.08)",isDark:false,
};

const brl = (v) => Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const nowDate = () => new Date().toLocaleDateString("pt-BR");

const IC = {
  home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  cube:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  tag:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
  dollar:"M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  chart:"M18 20V10 M12 20V4 M6 20v-6",
  settings:"M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
  plus:"M12 5v14 M5 12h14",
  x:"M18 6L6 18 M6 6l12 12",
  trash:"M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check:"M20 6L9 17l-5-5",
  zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  logout:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  printer:"M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z",
  camera:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  box:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  sun:"M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",
  moon:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  key:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
};

const Icon = ({d,size=18,color="currentColor",stroke=1.8}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

// ── UI COMPONENTS ──────────────────────────────────────────────────────────
const Btn = ({children,onClick,variant="primary",size="md",icon,full,disabled,loading,C}) => {
  const sizes = {sm:{padding:"6px 14px",fontSize:13},md:{padding:"10px 20px",fontSize:14},lg:{padding:"14px 28px",fontSize:15}};
  const variants = {
    primary:{background:C.accent,color:"#fff",boxShadow:`0 4px 20px ${C.accentGlow}`},
    ghost:{background:"transparent",color:C.muted,border:`1px solid ${C.border}`},
    danger:{background:"rgba(239,68,68,0.12)",color:C.red,border:"1px solid rgba(239,68,68,0.3)"},
  };
  return (
    <button onClick={onClick} disabled={disabled||loading}
      style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"inherit",fontWeight:600,
        cursor:(disabled||loading)?"not-allowed":"pointer",border:"none",borderRadius:10,
        transition:"all .18s",opacity:(disabled||loading)?0.6:1,
        width:full?"100%":undefined,justifyContent:full?"center":undefined,
        ...sizes[size],...variants[variant]}}>
      {icon&&!loading&&<Icon d={IC[icon]} size={15}/>}
      {loading?"Aguarde...":children}
    </button>
  );
};

const Inp = ({label,value,onChange,type="text",placeholder,suffix,prefix,help,readOnly,C}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</label>}
    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
      {prefix&&<span style={{position:"absolute",left:12,fontSize:13,color:C.muted}}>{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
        style={{width:"100%",background:readOnly?C.surface:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,
          padding:prefix?"10px 12px 10px 28px":suffix?"10px 36px 10px 12px":"10px 12px",
          color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
        onFocus={e=>{if(!readOnly)e.target.style.borderColor=C.accent}}
        onBlur={e=>e.target.style.borderColor=C.border}/>
      {suffix&&<span style={{position:"absolute",right:12,fontSize:13,color:C.muted}}>{suffix}</span>}
    </div>
    {help&&<span style={{fontSize:11,color:C.dim}}>{help}</span>}
  </div>
);

const Sel = ({label,value,onChange,options,C}) => (
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)}
      style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:14,fontFamily:"inherit",outline:"none"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({children,style,C}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,...style}}>{children}</div>
);

const Badge = ({children,color,C}) => {
  const col=color||C.accent;
  return <span style={{background:`${col}22`,color:col,fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6}}>{children}</span>;
};

const Modal = ({title,onClose,children,wide,wider,C}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
    onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,width:"100%",maxWidth:wider?900:wide?680:480,maxHeight:"92vh",overflowY:"auto",padding:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:C.text}}>{title}</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer"}}><Icon d={IC.x} size={20}/></button>
      </div>
      {children}
    </div>
  </div>
);

const StatCard = ({label,value,sub,color,icon,C}) => {
  const col=color||C.accent;
  return (
    <Card C={C}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{label}</div>
          <div style={{fontSize:26,fontWeight:800,color:col,letterSpacing:"-.02em"}}>{value}</div>
          {sub&&<div style={{fontSize:12,color:C.dim,marginTop:4}}>{sub}</div>}
        </div>
        <div style={{background:`${col}18`,borderRadius:10,padding:10}}><Icon d={IC[icon]} size={20} color={col}/></div>
      </div>
    </Card>
  );
};

// ── AUTH ───────────────────────────────────────────────────────────────────
const AuthScreen = ({C,logoB64}) => {
  const [mode,setMode]=useState("login");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState({text:"",ok:false});
  const [showPass,setShowPass]=useState(false);

  const handle=async()=>{
    setLoading(true); setMsg({text:"",ok:false});
    try {
      if(mode==="login"){
        const {error}=await supabase.auth.signInWithPassword({email,password});
        if(error) throw error;
      } else if(mode==="cadastro"){
        const {error}=await supabase.auth.signUp({email,password});
        if(error) throw error;
        setMsg({text:"Conta criada! Verifique seu email.",ok:true});
        setMode("login"); setLoading(false); return;
      } else {
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
        if(error) throw error;
        setMsg({text:"Email de recuperação enviado!",ok:true});
        setLoading(false); return;
      }
    } catch(e){setMsg({text:e.message||"Erro ao autenticar",ok:false});}
    setLoading(false);
  };

  return (
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:420,padding:20}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          {logoB64&&<img src={logoB64} alt="Itsuki Lab" style={{width:110,height:110,objectFit:"contain",marginBottom:12}}/>}
          <h1 style={{color:C.text,fontSize:26,fontWeight:900,margin:0}}>Itsuki Lab</h1>
          <p style={{color:C.muted,marginTop:4,fontSize:14}}>Materializando sua imaginação</p>
        </div>
        <Card C={C}>
          {mode!=="recuperar"&&(
            <div style={{display:"flex",gap:8,marginBottom:24}}>
              {["login","cadastro"].map(m=>(
                <button key={m} onClick={()=>setMode(m)}
                  style={{flex:1,padding:"10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,background:mode===m?C.accent:C.inputBg,color:mode===m?"#fff":C.muted}}>
                  {m==="login"?"Entrar":"Criar conta"}
                </button>
              ))}
            </div>
          )}
          {mode==="recuperar"&&(
            <div style={{marginBottom:20}}>
              <h3 style={{color:C.text,margin:"0 0 6px",fontSize:16}}>Recuperar senha</h3>
              <p style={{color:C.muted,fontSize:13,margin:0}}>Digite seu email para receber o link de recuperação</p>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Inp C={C} label="Email" value={email} onChange={setEmail} type="email" placeholder="seu@email.com"/>
            {mode!=="recuperar"&&(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>Senha</label>
                <div style={{position:"relative"}}>
                  <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="mínimo 6 caracteres"
                    style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 40px 10px 12px",color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
                    onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/>
                  <button onClick={()=>setShowPass(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer"}}>
                    <Icon d={IC.eye} size={16}/>
                  </button>
                </div>
              </div>
            )}
            {msg.text&&<div style={{background:msg.ok?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:msg.ok?C.green:C.red,padding:12,borderRadius:8,fontSize:13}}>{msg.text}</div>}
            <Btn C={C} onClick={handle} loading={loading} full size="lg">
              {mode==="login"?"Entrar":mode==="cadastro"?"Criar conta":"Enviar email de recuperação"}
            </Btn>
            {mode==="login"&&(
              <button onClick={()=>setMode("recuperar")} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontFamily:"inherit",textAlign:"center",padding:"4px 0"}}>
                Esqueci minha senha
              </button>
            )}
            {mode==="recuperar"&&(
              <button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",textAlign:"center",padding:"4px 0"}}>
                ← Voltar ao login
              </button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

// ── SIDEBAR ────────────────────────────────────────────────────────────────
const NAV=[
  {id:"dashboard",label:"Dashboard",icon:"home"},
  {id:"catalogo",label:"Catálogo",icon:"box"},
  {id:"orcamento",label:"Precificação",icon:"tag"},
  {id:"filamentos",label:"Filamentos",icon:"cube"},
  {id:"pedidos",label:"Pedidos",icon:"printer"},
  {id:"clientes",label:"Clientes",icon:"users"},
  {id:"financeiro",label:"Financeiro",icon:"dollar"},
  {id:"configs",label:"Configurações",icon:"settings"},
];

const Sidebar = ({active,setActive,user,onLogout,darkMode,setDarkMode,C,logoB64}) => (
  <aside style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,height:"100vh",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,zIndex:100,transition:"background .2s"}}>
    <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${C.border}`,textAlign:"center"}}>
      {logoB64&&<img src={logoB64} alt="Itsuki Lab" style={{width:52,height:52,objectFit:"contain",display:"block",margin:"0 auto 8px"}}/>}
      <div style={{fontWeight:800,fontSize:14,color:C.text}}>Itsuki Lab</div>
      <div style={{fontSize:10,color:C.muted}}>Materializando sua imaginação</div>
    </div>
    <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
      {NAV.map(item=>(
        <button key={item.id} onClick={()=>setActive(item.id)}
          style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",marginBottom:2,fontFamily:"inherit",fontWeight:active===item.id?700:500,fontSize:14,textAlign:"left",background:active===item.id?C.navActive:"transparent",color:active===item.id?C.accent:C.muted,borderLeft:active===item.id?`3px solid ${C.accent}`:"3px solid transparent",transition:"all .15s"}}>
          <Icon d={IC[item.icon]} size={17} color={active===item.id?C.accent:C.muted}/>{item.label}
        </button>
      ))}
    </nav>
    <div style={{padding:"14px 16px",borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={()=>setDarkMode(d=>!d)} style={{display:"flex",alignItems:"center",gap:8,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",color:C.muted,fontFamily:"inherit",fontSize:13,width:"100%"}}>
        <Icon d={darkMode?IC.sun:IC.moon} size={15}/>{darkMode?"Modo Claro":"Modo Escuro"}
      </button>
      <div style={{fontSize:11,color:C.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
      <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
        <Icon d={IC.logout} size={15}/>Sair
      </button>
    </div>
  </aside>
);

// ── DASHBOARD ──────────────────────────────────────────────────────────────
const Dashboard = ({filamentos,pedidos,clientes,catalogo,C}) => {
  const ativos=pedidos.filter(p=>p.status!=="entregue"&&p.status!=="cancelado").length;
  const receita=pedidos.filter(p=>p.status==="pago"||p.status==="entregue").reduce((s,p)=>s+(p.total||0),0);
  const filLivre=filamentos.reduce((s,f)=>s+(((f.peso_atual||f.peso_total)-(f.peso_carretel||0))),0);
  const itensEstoque=catalogo.filter(c=>c.em_estoque).reduce((s,c)=>s+(c.qtd_estoque||0),0);
  return (
    <div>
      <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Dashboard</h1>
      <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Visão geral do Itsuki Lab</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:28}}>
        <StatCard C={C} label="Pedidos Ativos" value={ativos} color={C.accent} icon="printer"/>
        <StatCard C={C} label="Receita Total" value={brl(receita)} color={C.green} icon="dollar"/>
        <StatCard C={C} label="Clientes" value={clientes.length} color={C.blue} icon="users"/>
        <StatCard C={C} label="Filamento Livre" value={`${filLivre.toFixed(0)}g`} color={C.yellow} icon="cube"/>
        <StatCard C={C} label="Itens Catalogados" value={catalogo.length} sub={`${itensEstoque} em estoque`} color={C.purple} icon="box"/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card C={C}>
          <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:C.text}}>Pedidos Recentes</h3>
          {pedidos.length===0?<p style={{color:C.dim,fontSize:13}}>Nenhum pedido ainda</p>
            :pedidos.slice(0,5).map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:C.text}}>Pedido #{p.numero||"—"}</div>
                  <div style={{fontSize:12,color:C.muted}}>{p.cliente_nome||"—"} · {p.data}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:700,color:C.accent}}>{brl(p.total)}</div>
                  <Badge C={C} color={p.status==="entregue"?C.green:p.status==="pago"?C.blue:C.yellow}>{p.status}</Badge>
                </div>
              </div>
            ))}
        </Card>
        <Card C={C}>
          <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:C.text}}>Catálogo em Destaque</h3>
          {catalogo.length===0?<p style={{color:C.dim,fontSize:13}}>Nenhum produto catalogado</p>
            :catalogo.slice(0,5).map(p=>(
              <div key={p.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
                {p.foto_url?<img src={p.foto_url} alt={p.nome} style={{width:38,height:38,borderRadius:8,objectFit:"cover"}}/>
                  :<div style={{width:38,height:38,borderRadius:8,background:C.inputBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={IC.box} size={16} color={C.dim}/></div>}
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.nome}</div>
                  <div style={{fontSize:12,color:C.muted}}>{brl(p.preco_venda)}</div>
                </div>
                <Badge C={C} color={p.em_estoque?C.green:C.yellow}>{p.em_estoque?`${p.qtd_estoque||0} un`:"Sob pedido"}</Badge>
              </div>
            ))}
        </Card>
      </div>
    </div>
  );
};

// ── CATÁLOGO ───────────────────────────────────────────────────────────────
const Catalogo = ({catalogo,filamentos,configs,onAdd,onUpd,onDel,C}) => {
  const [modal,setModal]=useState(false);
  const [editando,setEditando]=useState(null);
  const [busca,setBusca]=useState("");
  const [fotoPreview,setFotoPreview]=useState(null);
  const [fotoFile,setFotoFile]=useState(null);
  const [loading,setLoading]=useState(false);
  const empty={nome:"",filamento_id:"",consumo_g:"",preco_venda:"",em_estoque:false,qtd_estoque:0,descricao:"",foto_url:""};
  const [form,setForm]=useState(empty);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));

  const fil=filamentos.find(x=>x.id===form.filamento_id);
  const pesoUtil=fil?((fil.peso_atual||fil.peso_total)-(fil.peso_carretel||0)):0;
  const custog=(fil&&pesoUtil>0)?fil.valor_pago/pesoUtil:0;
  const custoFil=(parseFloat(form.consumo_g)||0)*custog;
  const horasEst=(parseFloat(form.consumo_g)||0)/50;
  const custoEnergia=horasEst*0.2*(configs?.energia_kwh||0.85);
  const custoMao=horasEst*(configs?.custo_hora||15);
  const custoTotal=custoFil+custoEnergia+custoMao;

  const abrir=(item=null)=>{
    setEditando(item);
    setForm(item?{nome:item.nome||"",filamento_id:item.filamento_id||"",consumo_g:item.consumo_g||"",preco_venda:item.preco_venda||"",em_estoque:item.em_estoque||false,qtd_estoque:item.qtd_estoque||0,descricao:item.descricao||"",foto_url:item.foto_url||""}:empty);
    setFotoPreview(item?.foto_url||null); setFotoFile(null); setModal(true);
  };

  const handleFoto=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    setFotoFile(file);
    const reader=new FileReader();
    reader.onload=ev=>setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const salvar=async()=>{
    if(!form.nome) return alert("Preencha o nome.");
    setLoading(true);
    let foto_url=form.foto_url;
    if(fotoFile){
      const ext=fotoFile.name.split(".").pop();
      const path=`catalogo/${Date.now()}.${ext}`;
      const {error:upErr}=await supabase.storage.from("fotos").upload(path,fotoFile,{upsert:true});
      if(!upErr){const {data}=supabase.storage.from("fotos").getPublicUrl(path);foto_url=data.publicUrl;}
    }
    const payload={...form,foto_url,consumo_g:parseFloat(form.consumo_g)||0,preco_venda:parseFloat(form.preco_venda)||0,qtd_estoque:parseInt(form.qtd_estoque)||0,custo_producao:custoTotal};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false); setLoading(false);
  };

  const filtrados=catalogo.filter(p=>p.nome?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Catálogo</h1>
          <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Produtos com foto, custo e estoque</p></div>
        <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Produto</Btn>
      </div>
      <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar produto..."/></div>
      {filtrados.length===0?(
        <Card C={C} style={{textAlign:"center",padding:60}}>
          <Icon d={IC.box} size={48} color={C.dim}/>
          <p style={{color:C.dim,marginTop:12}}>Nenhum produto cadastrado</p>
          <div style={{marginTop:16}}><Btn C={C} onClick={()=>abrir()} icon="plus" size="sm">Adicionar primeiro produto</Btn></div>
        </Card>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
          {filtrados.map(p=>(
            <Card C={C} key={p.id} style={{padding:0,overflow:"hidden"}}>
              <div style={{position:"relative"}}>
                {p.foto_url?<img src={p.foto_url} alt={p.nome} style={{width:"100%",height:180,objectFit:"cover"}}/>
                  :<div style={{width:"100%",height:180,background:C.inputBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={IC.camera} size={40} color={C.dim}/></div>}
                <div style={{position:"absolute",top:10,right:10,display:"flex",gap:6}}>
                  <button onClick={()=>abrir(p)} style={{background:"rgba(0,0,0,.6)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"#fff"}}><Icon d={IC.edit} size={14}/></button>
                  <button onClick={()=>{if(window.confirm("Excluir?"))onDel(p.id);}} style={{background:"rgba(239,68,68,.7)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"#fff"}}><Icon d={IC.trash} size={14}/></button>
                </div>
                <div style={{position:"absolute",top:10,left:10}}>
                  <Badge C={C} color={p.em_estoque?C.green:C.yellow}>{p.em_estoque?`${p.qtd_estoque||0} em estoque`:"Sob pedido"}</Badge>
                </div>
              </div>
              <div style={{padding:16}}>
                <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>{p.nome}</div>
                {p.descricao&&<div style={{fontSize:12,color:C.muted,marginBottom:10}}>{p.descricao}</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                  <div style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>Custo</div><div style={{fontWeight:700,color:C.text}}>{brl(p.custo_producao)}</div></div>
                  <div style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>Preço venda</div><div style={{fontWeight:700,color:C.accent}}>{brl(p.preco_venda)}</div></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      {modal&&(
        <Modal C={C} title={editando?"Editar Produto":"Novo Produto"} onClose={()=>setModal(false)} wide>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>Foto do Produto</label>
              <label style={{display:"block",cursor:"pointer"}}>
                <input type="file" accept="image/*" capture="environment" onChange={handleFoto} style={{display:"none"}}/>
                {fotoPreview?<img src={fotoPreview} alt="preview" style={{width:"100%",height:200,objectFit:"cover",borderRadius:12,border:`2px solid ${C.accent}`}}/>
                  :<div style={{width:"100%",height:200,background:C.inputBg,border:`2px dashed ${C.border}`,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,color:C.muted}}>
                    <Icon d={IC.camera} size={32} color={C.muted}/>
                    <span style={{fontSize:13}}>Tirar foto ou escolher imagem</span>
                  </div>}
              </label>
              {fotoPreview&&<button onClick={()=>{setFotoPreview(null);setFotoFile(null);sf("foto_url","");}} style={{marginTop:8,background:"none",border:"none",color:C.red,fontSize:12,cursor:"pointer"}}>Remover foto</button>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Inp C={C} label="Nome do produto" value={form.nome} onChange={v=>sf("nome",v)} placeholder="Ex: Vaso decorativo..."/>
              <Inp C={C} label="Descrição (opcional)" value={form.descricao} onChange={v=>sf("descricao",v)} placeholder="Detalhes..."/>
              <div style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0"}}>
                <input type="checkbox" id="estoque" checked={form.em_estoque} onChange={e=>sf("em_estoque",e.target.checked)} style={{accentColor:C.accent,width:16,height:16}}/>
                <label htmlFor="estoque" style={{color:C.text,fontSize:14,cursor:"pointer",fontWeight:600}}>Em estoque</label>
              </div>
              {form.em_estoque&&<Inp C={C} label="Quantidade em estoque" value={form.qtd_estoque} onChange={v=>sf("qtd_estoque",v)} type="number" suffix="un"/>}
            </div>
          </div>
          <div style={{marginTop:20,padding:16,background:C.inputBg,borderRadius:12}}>
            <div style={{fontSize:13,fontWeight:700,color:C.accent,marginBottom:14}}>📊 Cálculo de Custo Automático</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Sel C={C} label="Filamento usado" value={form.filamento_id} onChange={v=>sf("filamento_id",v)}
                options={[{value:"",label:"— Selecionar —"},...filamentos.map(f=>({value:f.id,label:`${f.marca} ${f.material} ${f.cor?"("+f.cor+")":""}`}))]}/>
              <Inp C={C} label="Consumo de filamento" value={form.consumo_g} onChange={v=>sf("consumo_g",v)} type="number" suffix="g"/>
            </div>
            {(form.filamento_id&&form.consumo_g)&&(
              <div style={{marginTop:14,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
                {[["Filamento",custoFil,false],["Energia",custoEnergia,false],["Mão de obra",custoMao,false],["Total",custoTotal,true]].map(([l,v,bold])=>(
                  <div key={l} style={{background:bold?C.accentSoft:C.card,border:`1px solid ${bold?C.accentGlow:C.border}`,borderRadius:8,padding:10,textAlign:"center"}}>
                    <div style={{fontSize:11,color:bold?C.accent:C.muted,marginBottom:4}}>{l}</div>
                    <div style={{fontSize:14,fontWeight:700,color:bold?C.accent:C.text}}>{brl(v)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{marginTop:16}}>
            <Inp C={C} label="Preço de venda" value={form.preco_venda} onChange={v=>sf("preco_venda",v)} type="number" prefix="R$" placeholder="0,00"/>
            {form.preco_venda&&custoTotal>0&&parseFloat(form.preco_venda)>0&&(
              <div style={{marginTop:8,padding:10,background:"rgba(34,197,94,0.08)",borderRadius:8,fontSize:12,color:C.green}}>
                Lucro: {brl(parseFloat(form.preco_venda)-custoTotal)} · Margem: {((parseFloat(form.preco_venda)-custoTotal)/parseFloat(form.preco_venda)*100).toFixed(1)}%
              </div>
            )}
          </div>
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar alterações":"Adicionar ao catálogo"}</Btn>
            <Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── FILAMENTOS ─────────────────────────────────────────────────────────────
const MATERIAIS=["PLA","PETG","ABS","TPU","ASA","Nylon","PLA+","PETG-CF","Resina","Outro"];

const Filamentos = ({filamentos,onAdd,onUpd,onDel,C}) => {
  const [modal,setModal]=useState(false);
  const [editando,setEditando]=useState(null);
  const [loading,setLoading]=useState(false);
  const empty={marca:"",material:"PLA",cor:"",peso_total:1000,peso_atual:"",peso_carretel:200,valor_pago:""};
  const [form,setForm]=useState(empty);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const pesoUtil=parseFloat(form.peso_atual||form.peso_total||0)-parseFloat(form.peso_carretel||0);

  const abrir=(item=null)=>{
    setEditando(item);
    setForm(item?{marca:item.marca||"",material:item.material||"PLA",cor:item.cor||"",peso_total:item.peso_total||1000,peso_atual:item.peso_atual||"",peso_carretel:item.peso_carretel??200,valor_pago:item.valor_pago||""}:empty);
    setModal(true);
  };

  const salvar=async()=>{
    if(!form.marca||!form.valor_pago) return alert("Preencha marca e valor.");
    setLoading(true);
    const payload={...form,peso_total:parseFloat(form.peso_total),peso_atual:parseFloat(form.peso_atual)||parseFloat(form.peso_total),peso_carretel:parseFloat(form.peso_carretel)||0,valor_pago:parseFloat(form.valor_pago)};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false); setLoading(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Filamentos</h1>
          <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Gerencie seu estoque de filamentos</p></div>
        <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Filamento</Btn>
      </div>
      {filamentos.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><Icon d={IC.cube} size={48} color={C.dim}/><p style={{color:C.dim,marginTop:12}}>Nenhum filamento cadastrado</p></Card>:(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
          {filamentos.map(f=>{
            const pa=f.peso_atual||f.peso_total; const car=f.peso_carretel||0;
            const util=pa-car; const pct=Math.max(0,Math.min(100,(util/f.peso_total)*100));
            const custog=util>0?f.valor_pago/util:0;
            return (
              <Card C={C} key={f.id}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
                  <div><div style={{fontWeight:700,color:C.text,fontSize:15}}>{f.marca}</div>
                    <div style={{display:"flex",gap:6,marginTop:4}}><Badge C={C} color={C.blue}>{f.material}</Badge>{f.cor&&<Badge C={C} color={C.muted}>{f.cor}</Badge>}</div></div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>abrir(f)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={14}/></button>
                    <button onClick={()=>{if(window.confirm("Excluir?"))onDel(f.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={14}/></button>
                  </div>
                </div>
                <div style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginBottom:6}}>
                    <span>Útil: <strong style={{color:util>100?C.green:util>0?C.yellow:C.red}}>{util.toFixed(0)}g</strong></span>
                    <span>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{height:8,background:C.inputBg,borderRadius:4}}>
                    <div style={{height:"100%",width:`${pct}%`,background:pct>50?C.green:pct>20?C.yellow:C.red,borderRadius:4}}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12}}>
                  {[["Peso total",f.peso_total+"g"],["Carretel",car+"g"],["Custo/g",brl(custog)]].map(([l,v])=>(
                    <div key={l} style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>{l}</div><div style={{fontWeight:700,color:C.text}}>{v}</div></div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {modal&&(
        <Modal C={C} title={editando?"Editar Filamento":"Novo Filamento"} onClose={()=>setModal(false)}>
          <div style={{display:"grid",gap:14}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Inp C={C} label="Marca" value={form.marca} onChange={v=>sf("marca",v)} placeholder="Ex: Esun, Bambu..."/>
              <Sel C={C} label="Material" value={form.material} onChange={v=>sf("material",v)} options={MATERIAIS.map(m=>({value:m,label:m}))}/>
            </div>
            <Inp C={C} label="Cor" value={form.cor} onChange={v=>sf("cor",v)} placeholder="Ex: Branco, Preto..."/>
            <div style={{padding:14,background:C.inputBg,borderRadius:10}}>
              <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:12}}>⚖️ Pesos</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <Inp C={C} label="Peso total (rolo novo)" value={form.peso_total} onChange={v=>sf("peso_total",v)} type="number" suffix="g"/>
                <Inp C={C} label="Peso atual (com carretel)" value={form.peso_atual} onChange={v=>sf("peso_atual",v)} type="number" suffix="g" help="Pese agora"/>
                <Inp C={C} label="Peso carretel vazio" value={form.peso_carretel} onChange={v=>sf("peso_carretel",v)} type="number" suffix="g"/>
              </div>
              <div style={{marginTop:10,padding:10,background:C.card,borderRadius:8,fontSize:13}}>
                <span style={{color:C.muted}}>Filamento útil: </span>
                <strong style={{color:pesoUtil>0?C.green:C.red}}>{pesoUtil.toFixed(0)}g</strong>
              </div>
            </div>
            <Inp C={C} label="Valor pago pelo rolo" value={form.valor_pago} onChange={v=>sf("valor_pago",v)} type="number" prefix="R$"/>
            <div style={{display:"flex",gap:10,marginTop:6}}>
              <Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Adicionar"}</Btn>
              <Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── PRECIFICAÇÃO ───────────────────────────────────────────────────────────
const Orcamento = ({filamentos,configs,onSaveConfigs,C}) => {
  const [nome,setNome]=useState("");
  const [filId,setFilId]=useState(""); const [consumoG,setConsumoG]=useState("");
  const [tempH,setTempH]=useState(0); const [tempM,setTempM]=useState(0);
  const [tempoMao,setTempoMao]=useState(0); const [retrabalho,setRetrabalho]=useState(0); const [urgencia,setUrgencia]=useState(0);
  const [margem,setMargem]=useState(configs?.margem_lucro||50);
  const [resultado,setResultado]=useState(null);
  const [cfgForm,setCfgForm]=useState({custo_hora:configs?.custo_hora||15,energia_kwh:configs?.energia_kwh||0.85,margem_lucro:configs?.margem_lucro||50,marketplace:configs?.marketplace||0,cartao:configs?.cartao||0,nf:configs?.nf||0});
  const [savingCfg,setSavingCfg]=useState(false);

  const saveCfg=async()=>{setSavingCfg(true);await onSaveConfigs(cfgForm);setSavingCfg(false);alert("Configurações salvas!");};

  const calcular=()=>{
    const fil=filamentos.find(f=>f.id===filId);
    const util=fil?((fil.peso_atual||fil.peso_total)-(fil.peso_carretel||0)):0;
    const custog=(fil&&util>0)?fil.valor_pago/util:0;
    const custoFil=(parseFloat(consumoG)||0)*custog;
    const mins=(parseFloat(tempH)||0)*60+(parseFloat(tempM)||0);
    const ch=cfgForm.custo_hora||15;
    const custoPrint=(mins/60)*ch;
    const custoEnergia=(mins/60)*0.2*(cfgForm.energia_kwh||0.85);
    const custoMao=(parseFloat(tempoMao)||0)/60*ch;
    const custoProducao=custoFil+custoPrint+custoEnergia+custoMao;
    const custoRetrab=custoProducao*((parseFloat(retrabalho)||0)/100);
    const custoTotal=custoProducao+custoRetrab;
    const base=custoTotal*(1+(parseFloat(urgencia)||0)/100+(cfgForm.marketplace||0)/100+(cfgForm.cartao||0)/100+(cfgForm.nf||0)/100);
    const mg=parseFloat(margem)||0;
    const preco=mg<100?base/(1-mg/100):base*2;
    setResultado({custoFil,custoPrint,custoEnergia,custoMao,custoTotal,preco,lucro:preco-base});
  };

  return (
    <div>
      <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Precificação</h1>
      <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Calcule o custo de fabricação e defina seus parâmetros</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <Card C={C}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>📦 Dados do Produto</h3>
            <Inp C={C} label="Nome do produto" value={nome} onChange={setNome} placeholder="Ex: Suporte de parede..."/>
          </Card>
          <Card C={C}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>⚙️ Custos Operacionais</h3>
              <Btn C={C} onClick={saveCfg} loading={savingCfg} size="sm" icon="check">Salvar</Btn>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Inp C={C} label="Custo por hora" value={cfgForm.custo_hora} onChange={v=>setCfgForm(f=>({...f,custo_hora:parseFloat(v)||0}))} type="number" prefix="R$" suffix="/h"/>
              <Inp C={C} label="Energia elétrica" value={cfgForm.energia_kwh} onChange={v=>setCfgForm(f=>({...f,energia_kwh:parseFloat(v)||0}))} type="number" prefix="R$" suffix="/kWh"/>
            </div>
          </Card>
          <Card C={C}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>📊 Margens e Taxas</h3>
              <Btn C={C} onClick={saveCfg} loading={savingCfg} size="sm" icon="check">Salvar</Btn>
            </div>
            <div style={{display:"grid",gap:12}}>
              <Inp C={C} label="Margem de lucro padrão" value={cfgForm.margem_lucro} onChange={v=>setCfgForm(f=>({...f,margem_lucro:parseFloat(v)||0}))} type="number" suffix="%"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
                <Inp C={C} label="Marketplace %" value={cfgForm.marketplace} onChange={v=>setCfgForm(f=>({...f,marketplace:parseFloat(v)||0}))} type="number" suffix="%"/>
                <Inp C={C} label="Cartão %" value={cfgForm.cartao} onChange={v=>setCfgForm(f=>({...f,cartao:parseFloat(v)||0}))} type="number" suffix="%"/>
                <Inp C={C} label="Nota Fiscal %" value={cfgForm.nf} onChange={v=>setCfgForm(f=>({...f,nf:parseFloat(v)||0}))} type="number" suffix="%"/>
              </div>
            </div>
          </Card>
          <Card C={C}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>🧵 Filamento</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Sel C={C} label="Filamento" value={filId} onChange={setFilId} options={[{value:"",label:"— Selecionar —"},...filamentos.map(f=>({value:f.id,label:`${f.marca} ${f.material} ${f.cor?"("+f.cor+")":""}`}))]}/>
              <Inp C={C} label="Consumo estimado" value={consumoG} onChange={setConsumoG} type="number" suffix="g"/>
            </div>
          </Card>
          <Card C={C}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>⏱ Tempo e Mão de Obra</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Inp C={C} label="Horas de impressão" value={tempH} onChange={setTempH} type="number" suffix="h"/>
              <Inp C={C} label="Minutos" value={tempM} onChange={setTempM} type="number" suffix="min"/>
              <Inp C={C} label="Pós-impressão" value={tempoMao} onChange={setTempoMao} type="number" suffix="min"/>
            </div>
          </Card>
          <Card C={C}>
            <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>💡 Custos Extras</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Inp C={C} label="Retrabalho" value={retrabalho} onChange={setRetrabalho} type="number" suffix="%"/>
              <Inp C={C} label="Urgência" value={urgencia} onChange={setUrgencia} type="number" suffix="%"/>
            </div>
          </Card>
          <Btn C={C} onClick={calcular} icon="zap" full size="lg">Calcular Custo de Fabricação</Btn>
        </div>
        <div>
          <Card C={C} style={{position:"sticky",top:20}}>
            <h3 style={{margin:"0 0 18px",fontSize:15,fontWeight:700,color:C.text}}>📊 Resultado</h3>
            {resultado?(
              <>
                {[["Filamento",resultado.custoFil],["Máquina",resultado.custoPrint],["Energia",resultado.custoEnergia],["Mão de obra",resultado.custoMao]].map(([l,v])=>(
                  <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}>
                    <span style={{color:C.muted}}>{l}</span><span style={{color:C.text}}>{brl(v)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,fontWeight:700}}>
                  <span style={{color:C.text}}>Custo total</span><span style={{color:C.accent}}>{brl(resultado.custoTotal)}</span>
                </div>
                <div style={{margin:"14px 0 10px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{fontSize:13,color:C.muted,fontWeight:600}}>Margem de lucro</span>
                    <Badge C={C} color={C.green}>{margem}%</Badge>
                  </div>
                  <input type="range" min={0} max={200} value={margem} onChange={e=>setMargem(+e.target.value)} style={{width:"100%",accentColor:C.accent}}/>
                </div>
                <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:12,padding:16,textAlign:"center",marginTop:16}}>
                  <div style={{fontSize:12,color:C.accent,fontWeight:600,marginBottom:4}}>PREÇO SUGERIDO</div>
                  <div style={{fontSize:32,fontWeight:900,color:C.accent}}>{brl(resultado.preco)}</div>
                  <div style={{fontSize:12,color:C.green,marginTop:4}}>Lucro: {brl(resultado.lucro)}</div>
                </div>
              </>
            ):(
              <div style={{textAlign:"center",padding:40,color:C.dim}}>
                <Icon d={IC.tag} size={40} color={C.dim}/>
                <p style={{marginTop:12,fontSize:13}}>Preencha e clique em "Calcular"</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ── PEDIDOS ────────────────────────────────────────────────────────────────
const STATUS=["pendente","em produção","pronto","entregue","pago","cancelado"];
const PAGAMENTO=["pix","dinheiro","cartão de crédito","cartão de débito"];

const NotaPedido = ({pedido,cliente,itens,onClose,C,logoB64}) => {
  const gerarPDF=()=>window.print();
  return (
    <Modal C={C} title={`Nota do Pedido #${pedido.numero}`} onClose={onClose} wide>
      <div>
        <div style={{textAlign:"center",marginBottom:20,paddingBottom:16,borderBottom:`2px solid ${C.border}`}}>
          {logoB64&&<img src={logoB64} alt="Itsuki Lab" style={{width:60,height:60,objectFit:"contain"}}/>}
          <h2 style={{color:C.text,margin:"8px 0 4px"}}>Itsuki Lab</h2>
          <p style={{color:C.muted,fontSize:12,margin:0}}>Materializando sua imaginação</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:4}}>PEDIDO</div>
            <div style={{fontSize:20,fontWeight:800,color:C.accent}}>#{pedido.numero}</div>
            <div style={{fontSize:12,color:C.muted,marginTop:4}}>Data: {pedido.data}</div>
            <div style={{fontSize:12,color:C.muted}}>Pagamento: {pedido.forma_pagamento||"—"}</div>
          </div>
          <div>
            <div style={{fontSize:11,color:C.muted,fontWeight:700,marginBottom:4}}>CLIENTE</div>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{cliente?.nome||pedido.cliente_nome||"—"}</div>
            {cliente?.tel&&<div style={{fontSize:12,color:C.muted}}>{cliente.tel}</div>}
            {cliente?.email&&<div style={{fontSize:12,color:C.muted}}>{cliente.email}</div>}
          </div>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}>
          <thead><tr style={{background:C.inputBg}}>
            {["Produto","Qtd","Preço unit.","Subtotal"].map(h=>(
              <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:12,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {itens.map((item,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"10px 12px",color:C.text}}>{item.nome}</td>
                <td style={{padding:"10px 12px",color:C.text}}>{item.quantidade}</td>
                <td style={{padding:"10px 12px",color:C.text}}>{brl(item.preco_unit)}</td>
                <td style={{padding:"10px 12px",color:C.accent,fontWeight:700}}>{brl(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{display:"flex",justifyContent:"flex-end"}}>
          <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:12,padding:"14px 24px",textAlign:"right"}}>
            <div style={{fontSize:12,color:C.muted}}>Total do Pedido</div>
            <div style={{fontSize:28,fontWeight:900,color:C.accent}}>{brl(pedido.total)}</div>
          </div>
        </div>
        <div style={{marginTop:20,padding:12,background:C.inputBg,borderRadius:8,fontSize:12,color:C.muted,textAlign:"center"}}>
          Obrigada pela preferência! ✨ Itsuki Lab — Materializando sua imaginação
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20}}>
        <Btn C={C} onClick={gerarPDF} icon="download" full>Imprimir / Salvar PDF</Btn>
        <Btn C={C} onClick={onClose} variant="ghost" full>Fechar</Btn>
      </div>
    </Modal>
  );
};

const Pedidos = ({pedidos,clientes,catalogo,onAdd,onUpd,onDel,onUpdEstoque,C,logoB64}) => {
  const [modal,setModal]=useState(false);
  const [notaModal,setNotaModal]=useState(null);
  const [busca,setBusca]=useState("");
  const [carrinho,setCarrinho]=useState([]);
  const [clienteId,setClienteId]=useState("");
  const [formPag,setFormPag]=useState("pix");
  const [obs,setObs]=useState("");
  const [loading,setLoading]=useState(false);
  const [prodSel,setProdSel]=useState("");
  const [qtdSel,setQtdSel]=useState(1);

  const proximoNumero=(pedidos.length>0?Math.max(...pedidos.map(p=>p.numero||0)):0)+1;
  const totalCarrinho=carrinho.reduce((s,i)=>s+i.subtotal,0);

  const addCarrinho=()=>{
    const prod=catalogo.find(p=>p.id===prodSel);
    if(!prod) return;
    const qtd=parseInt(qtdSel)||1;
    setCarrinho(c=>{
      const ex=c.find(x=>x.produto_id===prodSel);
      if(ex) return c.map(x=>x.produto_id===prodSel?{...x,quantidade:x.quantidade+qtd,subtotal:(x.quantidade+qtd)*x.preco_unit}:x);
      return [...c,{produto_id:prodSel,nome:prod.nome,quantidade:qtd,preco_unit:prod.preco_venda,subtotal:qtd*prod.preco_venda}];
    });
    setProdSel(""); setQtdSel(1);
  };

  const remItem=(pid)=>setCarrinho(c=>c.filter(x=>x.produto_id!==pid));
  const updQtd=(pid,q)=>setCarrinho(c=>c.map(x=>x.produto_id===pid?{...x,quantidade:parseInt(q)||1,subtotal:(parseInt(q)||1)*x.preco_unit}:x));

  const criarPedido=async()=>{
    if(carrinho.length===0) return alert("Adicione pelo menos um produto.");
    setLoading(true);
    const cliente=clientes.find(c=>c.id===clienteId);
    const pedido={numero:proximoNumero,cliente_id:clienteId||null,cliente_nome:cliente?.nome||"—",total:totalCarrinho,forma_pagamento:formPag,obs,status:"pendente",data:nowDate(),itens:JSON.stringify(carrinho)};
    await onAdd(pedido);
    for(const item of carrinho){
      const prod=catalogo.find(p=>p.id===item.produto_id);
      if(prod&&prod.em_estoque){
        const novaQtd=Math.max(0,(prod.qtd_estoque||0)-item.quantidade);
        await onUpdEstoque(item.produto_id,novaQtd);
      }
    }
    setModal(false); setCarrinho([]); setClienteId(""); setObs(""); setLoading(false);
  };

  const filtrados=pedidos.filter(p=>String(p.numero||"").includes(busca)||(p.cliente_nome||"").toLowerCase().includes(busca.toLowerCase()));
  const scColor={pendente:C.yellow,"em produção":C.blue,pronto:C.accent,entregue:C.green,pago:C.green,cancelado:C.red};

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Pedidos</h1>
          <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Gerencie e acompanhe seus pedidos</p></div>
        <Btn C={C} onClick={()=>setModal(true)} icon="plus">Novo Pedido</Btn>
      </div>
      <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar por número ou cliente..."/></div>
      {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><Icon d={IC.printer} size={48} color={C.dim}/><p style={{color:C.dim,marginTop:12}}>Nenhum pedido</p></Card>:(
        <Card C={C} style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.inputBg}}>{["Nº","Cliente","Data","Total","Pagamento","Status",""].map(h=>(
              <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{h}</th>
            ))}</tr></thead>
            <tbody>{filtrados.map((p,i)=>{
              const sc=scColor[p.status]||C.accent;
              return (
                <tr key={p.id} style={{borderTop:`1px solid ${C.border}`,background:i%2===0?"transparent":"rgba(0,0,0,.02)"}}>
                  <td style={{padding:"14px 16px",color:C.accent,fontWeight:800}}>#{p.numero}</td>
                  <td style={{padding:"14px 16px",color:C.text,fontWeight:600}}>{p.cliente_nome||"—"}</td>
                  <td style={{padding:"14px 16px",color:C.muted,fontSize:13}}>{p.data}</td>
                  <td style={{padding:"14px 16px",color:C.accent,fontWeight:700}}>{brl(p.total)}</td>
                  <td style={{padding:"14px 16px",color:C.muted,fontSize:13}}>{p.forma_pagamento||"—"}</td>
                  <td style={{padding:"14px 16px"}}>
                    <select value={p.status} onChange={e=>onUpd(p.id,{status:e.target.value})}
                      style={{background:`${sc}22`,color:sc,border:"none",borderRadius:6,padding:"4px 8px",fontSize:12,fontWeight:700,fontFamily:"inherit",cursor:"pointer"}}>
                      {STATUS.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{padding:"14px 16px"}}>
                    <div style={{display:"flex",gap:6}}>
                      <button onClick={()=>setNotaModal(p)} style={{background:C.accentSoft,border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.accent}}><Icon d={IC.download} size={14}/></button>
                      <button onClick={()=>{if(window.confirm("Excluir?"))onDel(p.id);}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer"}}><Icon d={IC.trash} size={15}/></button>
                    </div>
                  </td>
                </tr>
              );
            })}</tbody>
          </table>
        </Card>
      )}

      {notaModal&&(()=>{
        const itens=JSON.parse(notaModal.itens||"[]");
        const cliente=clientes.find(c=>c.id===notaModal.cliente_id);
        return <NotaPedido C={C} logoB64={logoB64} pedido={notaModal} cliente={cliente} itens={itens} onClose={()=>setNotaModal(null)}/>;
      })()}

      {modal&&(
        <Modal C={C} title={`Novo Pedido #${proximoNumero}`} onClose={()=>setModal(false)} wider>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Número do Pedido</div>
                <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:10,padding:"12px 16px",fontSize:22,fontWeight:900,color:C.accent}}>
                  #{proximoNumero}
                </div>
              </div>
              <Sel C={C} label="Cliente" value={clienteId} onChange={setClienteId}
                options={[{value:"",label:"— Sem cliente —"},...clientes.map(c=>({value:c.id,label:c.nome}))]}/>
              <Sel C={C} label="Forma de Pagamento" value={formPag} onChange={setFormPag}
                options={PAGAMENTO.map(p=>({value:p,label:p.charAt(0).toUpperCase()+p.slice(1)}))}/>
              <Inp C={C} label="Observações" value={obs} onChange={setObs} placeholder="Alguma observação..."/>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div style={{fontSize:13,fontWeight:700,color:C.accent}}>🛒 Itens do Pedido</div>
              <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
                <div style={{flex:1}}>
                  <Sel C={C} label="Produto do catálogo" value={prodSel} onChange={setProdSel}
                    options={[{value:"",label:"— Selecionar —"},...catalogo.filter(p=>p.em_estoque&&(p.qtd_estoque||0)>0).map(p=>({value:p.id,label:`${p.nome} (${p.qtd_estoque} un)`}))]}/>
                </div>
                <div style={{width:70}}>
                  <Inp C={C} label="Qtd" value={qtdSel} onChange={setQtdSel} type="number"/>
                </div>
                <Btn C={C} onClick={addCarrinho} icon="plus" disabled={!prodSel}>Add</Btn>
              </div>
              {carrinho.length===0?<div style={{textAlign:"center",padding:24,color:C.dim,background:C.inputBg,borderRadius:10,fontSize:13}}>Nenhum item adicionado</div>:(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {carrinho.map(item=>(
                    <div key={item.produto_id} style={{display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:10,padding:"10px 14px"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{item.nome}</div>
                        <div style={{fontSize:12,color:C.muted}}>{brl(item.preco_unit)} /un</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6}}>
                        <button onClick={()=>updQtd(item.produto_id,Math.max(1,item.quantidade-1))} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.text,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                        <span style={{minWidth:24,textAlign:"center",fontWeight:700,color:C.text}}>{item.quantidade}</span>
                        <button onClick={()=>updQtd(item.produto_id,item.quantidade+1)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.text,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                      </div>
                      <div style={{minWidth:70,textAlign:"right",fontWeight:700,color:C.accent}}>{brl(item.subtotal)}</div>
                      <button onClick={()=>remItem(item.produto_id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer"}}><Icon d={IC.trash} size={14}/></button>
                    </div>
                  ))}
                  <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:C.accentSoft,borderRadius:10,marginTop:4}}>
                    <span style={{fontWeight:700,color:C.text}}>Total</span>
                    <span style={{fontWeight:900,color:C.accent,fontSize:18}}>{brl(totalCarrinho)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:20}}>
            <Btn C={C} onClick={criarPedido} loading={loading} full icon="check">Criar Pedido #{proximoNumero}</Btn>
            <Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── CLIENTES ───────────────────────────────────────────────────────────────
const Clientes = ({clientes,pedidos,onAdd,onUpd,onDel,C}) => {
  const [modal,setModal]=useState(false);
  const [editando,setEditando]=useState(null);
  const [detalhe,setDetalhe]=useState(null);
  const [busca,setBusca]=useState("");
  const [loading,setLoading]=useState(false);
  const empty={nome:"",email:"",tel:"",cidade:"",obs:""};
  const [form,setForm]=useState(empty);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));

  const abrir=(item=null)=>{
    setEditando(item);
    setForm(item?{nome:item.nome||"",email:item.email||"",tel:item.tel||"",cidade:item.cidade||"",obs:item.obs||""}:empty);
    setModal(true);
  };

  const salvar=async()=>{
    if(!form.nome) return;
    setLoading(true);
    editando?await onUpd(editando.id,form):await onAdd(form);
    setModal(false); setLoading(false);
  };

  const filtrados=clientes.filter(c=>c.nome?.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Clientes</h1>
          <p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Gerencie sua base de clientes</p></div>
        <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Cliente</Btn>
      </div>
      <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar cliente..."/></div>
      {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><Icon d={IC.users} size={48} color={C.dim}/><p style={{color:C.dim,marginTop:12}}>Nenhum cliente</p></Card>:(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
          {filtrados.map(c=>{
            const ps=pedidos.filter(p=>p.cliente_id===c.id);
            const totalGasto=ps.reduce((s,p)=>s+(p.total||0),0);
            return (
              <Card C={C} key={c.id} style={{cursor:"pointer"}} onClick={()=>setDetalhe(c)}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <div style={{background:C.accentSoft,color:C.accent,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18}}>{c.nome[0].toUpperCase()}</div>
                  <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                    <button onClick={()=>abrir(c)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={14}/></button>
                    <button onClick={()=>{if(window.confirm("Excluir cliente?"))onDel(c.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={14}/></button>
                  </div>
                </div>
                <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>{c.nome}</div>
                {c.email&&<div style={{fontSize:12,color:C.muted}}>{c.email}</div>}
                {c.tel&&<div style={{fontSize:12,color:C.muted}}>{c.tel}</div>}
                {c.cidade&&<div style={{fontSize:12,color:C.muted}}>{c.cidade}</div>}
                {c.obs&&<div style={{fontSize:12,color:C.yellow,marginTop:6,padding:"6px 8px",background:"rgba(245,158,11,0.08)",borderRadius:6}}>📝 {c.obs}</div>}
                <div style={{display:"flex",gap:8,marginTop:10}}>
                        <Badge C={C} color={C.blue}>{ps.length} pedido{ps.length!==1?"s":""}</Badge>
                  <Badge C={C} color={C.green}>{brl(totalGasto)}</Badge>
                </div>
                <div style={{fontSize:11,color:C.dim,marginTop:6}}>Clique para ver histórico completo</div>
              </Card>
            );
          })}
        </div>
      )}

      {detalhe&&(()=>{
        const ps=pedidos.filter(p=>p.cliente_id===detalhe.id);
        const total=ps.reduce((s,p)=>s+(p.total||0),0);
        return (
          <Modal C={C} title={`Histórico — ${detalhe.nome}`} onClose={()=>setDetalhe(null)} wide>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
              {[["Pedidos",ps.length,C.accent],["Total gasto",brl(total),C.green],["Ticket médio",brl(ps.length>0?total/ps.length:0),C.blue]].map(([l,v,col])=>(
                <div key={l} style={{background:C.inputBg,borderRadius:10,padding:14,textAlign:"center"}}>
                  <div style={{fontSize:11,color:C.muted,marginBottom:4}}>{l}</div>
                  <div style={{fontSize:20,fontWeight:800,color:col}}>{v}</div>
                </div>
              ))}
            </div>
            {ps.length===0?<p style={{color:C.dim,fontSize:13,textAlign:"center"}}>Nenhum pedido ainda</p>:(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {ps.map(p=>{
                  const itens=JSON.parse(p.itens||"[]");
                  return (
                    <div key={p.id} style={{background:C.inputBg,borderRadius:12,padding:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <div>
                          <span style={{fontWeight:800,color:C.accent}}>#{p.numero}</span>
                          <span style={{fontSize:12,color:C.muted,marginLeft:8}}>{p.data}</span>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center"}}>
                          <Badge C={C} color={p.status==="pago"||p.status==="entregue"?C.green:C.yellow}>{p.status}</Badge>
                          <span style={{fontWeight:700,color:C.accent}}>{brl(p.total)}</span>
                        </div>
                      </div>
                      {itens.length>0&&(
                        <div style={{fontSize:12,color:C.muted}}>
                          {itens.map((it,i)=><span key={i}>{it.nome} x{it.quantidade}{i<itens.length-1?", ":""}</span>)}
                        </div>
                      )}
                      {p.forma_pagamento&&<div style={{fontSize:11,color:C.dim,marginTop:4}}>Pagamento: {p.forma_pagamento}</div>}
                      {p.obs&&<div style={{fontSize:11,color:C.dim,marginTop:2}}>Obs: {p.obs}</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </Modal>
        );
      })()}

      {modal&&(
        <Modal C={C} title={editando?"Editar Cliente":"Novo Cliente"} onClose={()=>setModal(false)}>
          <div style={{display:"grid",gap:14}}>
            <Inp C={C} label="Nome completo" value={form.nome} onChange={v=>sf("nome",v)}/>
            <Inp C={C} label="Email" value={form.email} onChange={v=>sf("email",v)} type="email"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <Inp C={C} label="Telefone" value={form.tel} onChange={v=>sf("tel",v)}/>
              <Inp C={C} label="Cidade" value={form.cidade} onChange={v=>sf("cidade",v)}/>
            </div>
            <Inp C={C} label="Observações sobre o cliente" value={form.obs} onChange={v=>sf("obs",v)} placeholder="Ex: prefere pagamento via Pix..."/>
            <div style={{display:"flex",gap:10}}>
              <Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Cadastrar"}</Btn>
              <Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ── FINANCEIRO ─────────────────────────────────────────────────────────────
const Financeiro = ({pedidos,C}) => {
  const pagos=pedidos.filter(p=>p.status==="pago"||p.status==="entregue");
  const receita=pagos.reduce((s,p)=>s+(p.total||0),0);
  return (
    <div>
      <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Financeiro</h1>
      <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Saúde financeira do negócio</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
        <StatCard C={C} label="Receita Total" value={brl(receita)} color={C.green} icon="dollar"/>
        <StatCard C={C} label="Pedidos Pagos" value={pagos.length} color={C.blue} icon="printer"/>
        <StatCard C={C} label="Ticket Médio" value={brl(pagos.length>0?receita/pagos.length:0)} color={C.accent} icon="chart"/>
      </div>
      <Card C={C}>
        <h3 style={{margin:"0 0 18px",fontSize:15,fontWeight:700,color:C.text}}>Pedidos Finalizados</h3>
        {pagos.length===0?<p style={{color:C.dim,fontSize:13}}>Nenhum pedido finalizado</p>:(
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr>{["#","Cliente","Data","Pagamento","Total"].map(h=>(
              <th key={h} style={{padding:"10px 0",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>
            ))}</tr></thead>
            <tbody>{pagos.map(p=>(
              <tr key={p.id} style={{borderBottom:`1px solid ${C.border}`}}>
                <td style={{padding:"12px 0",color:C.accent,fontWeight:700}}>#{p.numero}</td>
                <td style={{padding:"12px 0",color:C.text,fontWeight:600}}>{p.cliente_nome||"—"}</td>
                <td style={{padding:"12px 0",color:C.muted,fontSize:13}}>{p.data}</td>
                <td style={{padding:"12px 0",color:C.muted,fontSize:13}}>{p.forma_pagamento||"—"}</td>
                <td style={{padding:"12px 0",color:C.accent,fontWeight:700}}>{brl(p.total)}</td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

// ── CONFIGURAÇÕES ──────────────────────────────────────────────────────────
const Configs = ({user,C}) => {
  const [nome,setNome]=useState(user?.user_metadata?.nome||"");
  const [cel,setCel]=useState(user?.user_metadata?.cel||"");
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState({text:"",ok:false});

  const salvar=async()=>{
    setLoading(true);
    const {error}=await supabase.auth.updateUser({data:{nome,cel}});
    setMsg({text:error?"Erro ao salvar.":"Dados salvos com sucesso!",ok:!error});
    setLoading(false);
  };

  const recuperarSenha=async()=>{
    const {error}=await supabase.auth.resetPasswordForEmail(user.email,{redirectTo:window.location.origin});
    setMsg({text:error?"Erro ao enviar email.":"Email de recuperação enviado!",ok:!error});
  };

  return (
    <div>
      <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Configurações</h1>
      <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Dados da sua conta</p>
      <div style={{display:"grid",gap:16,maxWidth:520}}>
        <Card C={C}>
          <h3 style={{margin:"0 0 18px",fontSize:14,fontWeight:700,color:C.accent}}>👤 Seus Dados</h3>
          <div style={{display:"grid",gap:14}}>
            <Inp C={C} label="Nome" value={nome} onChange={setNome} placeholder="Seu nome completo"/>
            <Inp C={C} label="Celular" value={cel} onChange={setCel} placeholder="(00) 00000-0000"/>
            <Inp C={C} label="Email (não editável)" value={user?.email||""} readOnly/>
          </div>
          {msg.text&&<div style={{marginTop:12,background:msg.ok?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:msg.ok?C.green:C.red,padding:10,borderRadius:8,fontSize:13}}>{msg.text}</div>}
          <div style={{marginTop:16}}>
            <Btn C={C} onClick={salvar} loading={loading} icon="check" full>Salvar dados</Btn>
          </div>
        </Card>
        <Card C={C}>
          <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:C.accent}}>🔑 Segurança</h3>
          <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Clique abaixo para receber um email com o link de redefinição de senha.</p>
          <Btn C={C} onClick={recuperarSenha} variant="ghost" icon="key" full>Enviar email de recuperação de senha</Btn>
        </Card>
      </div>
    </div>
  );
};

// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App() {
  const [darkMode,setDarkMode]=useState(true);
  const [user,setUser]=useState(null);
  const [appLoading,setAppLoading]=useState(true);
  const [page,setPage]=useState("dashboard");
  const [filamentos,setFilamentos]=useState([]);
  const [clientes,setClientes]=useState([]);
  const [pedidos,setPedidos]=useState([]);
  const [catalogo,setCatalogo]=useState([]);
  const [configs,setConfigs]=useState(null);
  const [logoB64,setLogoB64]=useState(null);

  const C=darkMode?DARK:LIGHT;

  useEffect(()=>{
    fetch("/logo.png").then(r=>r.blob()).then(blob=>{
      const reader=new FileReader();
      reader.onload=e=>setLogoB64(e.target.result);
      reader.readAsDataURL(blob);
    }).catch(()=>{});
  },[]);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAppLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setUser(s?.user??null));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!user) return;
    (async()=>{
      const [f,c,p,cat,cfg]=await Promise.all([
        supabase.from("filamentos").select("*").order("created_at",{ascending:false}),
        supabase.from("clientes").select("*").order("created_at",{ascending:false}),
        supabase.from("pedidos").select("*").order("numero",{ascending:false}),
        supabase.from("catalogo").select("*").order("created_at",{ascending:false}),
        supabase.from("configs").select("*").eq("user_id",user.id).single(),
      ]);
      if(f.data)setFilamentos(f.data);
      if(c.data)setClientes(c.data);
      if(p.data)setPedidos(p.data);
      if(cat.data)setCatalogo(cat.data);
      if(cfg.data)setConfigs(cfg.data);
    })();
  },[user]);

  const logout=()=>supabase.auth.signOut();

  const addF=async(d)=>{const {data:r}=await supabase.from("filamentos").insert({...d,user_id:user.id}).select().single();if(r)setFilamentos(p=>[r,...p]);};
  const updF=async(id,d)=>{await supabase.from("filamentos").update(d).eq("id",id);setFilamentos(p=>p.map(f=>f.id===id?{...f,...d}:f));};
  const delF=async(id)=>{await supabase.from("filamentos").delete().eq("id",id);setFilamentos(p=>p.filter(f=>f.id!==id));};

  const addC=async(d)=>{const {data:r}=await supabase.from("clientes").insert({...d,user_id:user.id}).select().single();if(r)setClientes(p=>[r,...p]);};
  const updC=async(id,d)=>{await supabase.from("clientes").update(d).eq("id",id);setClientes(p=>p.map(c=>c.id===id?{...c,...d}:c));};
  const delC=async(id)=>{await supabase.from("clientes").delete().eq("id",id);setClientes(p=>p.filter(c=>c.id!==id));};

  const addP=async(d)=>{const {data:r}=await supabase.from("pedidos").insert({...d,user_id:user.id}).select().single();if(r)setPedidos(p=>[r,...p]);};
  const updP=async(id,d)=>{await supabase.from("pedidos").update(d).eq("id",id);setPedidos(p=>p.map(x=>x.id===id?{...x,...d}:x));};
  const delP=async(id)=>{await supabase.from("pedidos").delete().eq("id",id);setPedidos(p=>p.filter(x=>x.id!==id));};

  const addCat=async(d)=>{const {data:r}=await supabase.from("catalogo").insert({...d,user_id:user.id}).select().single();if(r)setCatalogo(p=>[r,...p]);};
  const updCat=async(id,d)=>{await supabase.from("catalogo").update(d).eq("id",id);setCatalogo(p=>p.map(x=>x.id===id?{...x,...d}:x));};
  const delCat=async(id)=>{await supabase.from("catalogo").delete().eq("id",id);setCatalogo(p=>p.filter(x=>x.id!==id));};
  const updEstoque=async(id,novaQtd)=>{await supabase.from("catalogo").update({qtd_estoque:novaQtd}).eq("id",id);setCatalogo(p=>p.map(x=>x.id===id?{...x,qtd_estoque:novaQtd}:x));};

  const saveCfg=async(d)=>{const {data:r}=await supabase.from("configs").upsert({...d,user_id:user.id},{onConflict:"user_id"}).select().single();if(r)setConfigs(r);};

  if(appLoading) return <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,fontFamily:"sans-serif"}}>Carregando...</div>;

  if(!user) return <AuthScreen C={C} logoB64={logoB64}/>;

  const pages={
    dashboard:<Dashboard C={C} filamentos={filamentos} pedidos={pedidos} clientes={clientes} catalogo={catalogo}/>,
    catalogo:<Catalogo C={C} catalogo={catalogo} filamentos={filamentos} configs={configs} onAdd={addCat} onUpd={updCat} onDel={delCat}/>,
    orcamento:<Orcamento C={C} filamentos={filamentos} configs={configs} onSaveConfigs={saveCfg}/>,
    filamentos:<Filamentos C={C} filamentos={filamentos} onAdd={addF} onUpd={updF} onDel={delF}/>,
    pedidos:<Pedidos C={C} logoB64={logoB64} pedidos={pedidos} clientes={clientes} catalogo={catalogo} onAdd={addP} onUpd={updP} onDel={delP} onUpdEstoque={updEstoque}/>,
    clientes:<Clientes C={C} clientes={clientes} pedidos={pedidos} onAdd={addC} onUpd={updC} onDel={delC}/>,
    financeiro:<Financeiro C={C} pedidos={pedidos}/>,
    configs:<Configs C={C} user={user}/>,
  };

  return (
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",transition:"background .2s"}}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea { color-scheme: ${darkMode?"dark":"light"}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${C.surface}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        @media print { aside { display: none !important; } main { margin-left: 0 !important; } }
      `}</style>
      <Sidebar C={C} logoB64={logoB64} active={page} setActive={setPage} user={user} onLogout={logout} darkMode={darkMode} setDarkMode={setDarkMode}/>
      <main style={{flex:1,marginLeft:220,padding:"32px 36px",maxWidth:"100%",overflowX:"hidden"}}>{pages[page]}</main>
    </div>
  );
}
