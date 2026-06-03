import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const LOGO = "/logo.png";

const DARK={bg:"#0f1117",surface:"#181c27",card:"#1e2333",border:"#2a3045",accent:"#c084fc",accentSoft:"rgba(192,132,252,0.12)",accentGlow:"rgba(192,132,252,0.3)",green:"#22c55e",red:"#ef4444",yellow:"#f59e0b",blue:"#3b82f6",text:"#e8ecf4",muted:"#7a8099",dim:"#4a5068",purple:"#a855f7",inputBg:"#181c27",navActive:"rgba(192,132,252,0.12)"};
const LIGHT={bg:"#f8f5ff",surface:"#ffffff",card:"#ffffff",border:"#e5d9f9",accent:"#9333ea",accentSoft:"rgba(147,51,234,0.08)",accentGlow:"rgba(147,51,234,0.25)",green:"#16a34a",red:"#dc2626",yellow:"#d97706",blue:"#2563eb",text:"#1e1b4b",muted:"#6b7280",dim:"#9ca3af",purple:"#7c3aed",inputBg:"#f3eeff",navActive:"rgba(147,51,234,0.08)"};

const brl=(v)=>Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const nowDate=()=>new Date().toLocaleDateString("pt-BR");

const STATUS_COLORS={pendente:"#f59e0b","em produção":"#3b82f6",pronto:"#c084fc",entregue:"#22c55e",pago:"#16a34a",cancelado:"#ef4444","aguardando confirmação":"#f59e0b"};
const STATUS=["pendente","em produção","pronto","entregue","pago","cancelado","aguardando confirmação"];
const PAGAMENTO=["pix","dinheiro","cartão de crédito","cartão de débito","a definir"];
const MATERIAIS=["PLA","PETG","ABS","TPU","ASA","Nylon","PLA+","PETG-CF","Resina","Outro"];

const IC={home:"M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",cube:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",tag:"M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",dollar:"M12 1v22 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",chart:"M18 20V10 M12 20V4 M6 20v-6",settings:"M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",plus:"M12 5v14 M5 12h14",x:"M18 6L6 18 M6 6l12 12",trash:"M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",check:"M20 6L9 17l-5-5",zap:"M13 2L3 14h9l-1 8 10-12h-9l1-8z",logout:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",printer:"M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z",camera:"M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",box:"M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",sun:"M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 17a5 5 0 100-10 5 5 0 000 10z",moon:"M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",download:"M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",eye:"M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",eyeoff:"M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19 M1 1l22 22",key:"M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",arrowright:"M5 12h14 M12 5l7 7-7 7",bell:"M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",package:"M16.5 9.4l-9-5.19 M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12"};

const Icon=({d,size=18,color="currentColor",stroke=1.8})=>(<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>);

const Btn=({children,onClick,variant="primary",size="md",icon,full,disabled,loading,C})=>{
  const sz={sm:{padding:"6px 14px",fontSize:13},md:{padding:"10px 20px",fontSize:14},lg:{padding:"14px 28px",fontSize:15}};
  const vr={primary:{background:C.accent,color:"#fff",boxShadow:`0 4px 20px ${C.accentGlow}`},ghost:{background:"transparent",color:C.muted,border:`1px solid ${C.border}`},danger:{background:"rgba(239,68,68,0.12)",color:C.red,border:"1px solid rgba(239,68,68,0.3)"},success:{background:"rgba(34,197,94,0.15)",color:C.green,border:"1px solid rgba(34,197,94,0.4)"}};
  return(<button onClick={onClick} disabled={disabled||loading} style={{display:"inline-flex",alignItems:"center",gap:6,fontFamily:"inherit",fontWeight:600,cursor:(disabled||loading)?"not-allowed":"pointer",border:"none",borderRadius:10,transition:"all .18s",opacity:(disabled||loading)?0.6:1,width:full?"100%":undefined,justifyContent:full?"center":undefined,...sz[size],...vr[variant]}}>{icon&&!loading&&<Icon d={IC[icon]} size={15}/>}{loading?"Aguarde...":children}</button>);
};
const Inp=({label,value,onChange,type="text",placeholder,suffix,prefix,help,readOnly,C})=>(
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</label>}
    <div style={{position:"relative",display:"flex",alignItems:"center"}}>
      {prefix&&<span style={{position:"absolute",left:12,fontSize:13,color:C.muted}}>{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange&&onChange(e.target.value)} placeholder={placeholder} readOnly={readOnly}
        style={{width:"100%",background:readOnly?C.surface:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:prefix?"10px 12px 10px 28px":suffix?"10px 36px 10px 12px":"10px 12px",color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}}
        onFocus={e=>{if(!readOnly)e.target.style.borderColor=C.accent}} onBlur={e=>e.target.style.borderColor=C.border}/>
      {suffix&&<span style={{position:"absolute",right:12,fontSize:13,color:C.muted}}>{suffix}</span>}
    </div>
    {help&&<span style={{fontSize:11,color:C.dim}}>{help}</span>}
  </div>
);
const Sel=({label,value,onChange,options,C})=>(
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{label}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",color:C.text,fontSize:14,fontFamily:"inherit",outline:"none"}}>
      {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);
const Card=({children,style,C,onClick})=>(<div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,...style,cursor:onClick?"pointer":undefined}}>{children}</div>);
const Badge=({children,color,C})=>{const col=color||C.accent;return <span style={{background:col+"22",color:col,fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,display:"inline-block"}}>{children}</span>;};
const Modal=({title,onClose,children,wide,wider,C})=>(
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={e=>e.target===e.currentTarget&&onClose()}>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,width:"100%",maxWidth:wider?960:wide?700:500,maxHeight:"92vh",overflowY:"auto",padding:28}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <h2 style={{margin:0,fontSize:18,fontWeight:700,color:C.text}}>{title}</h2>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer"}}><Icon d={IC.x} size={20}/></button>
      </div>
      {children}
    </div>
  </div>
);
const StatCard=({label,value,sub,color,icon,C,onClick})=>{
  const col=color||C.accent;
  return(<div onClick={onClick} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,cursor:onClick?"pointer":"default",transition:"transform .15s,box-shadow .15s"}}
    onMouseEnter={e=>{if(onClick){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${col}20`;}}}
    onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div><div style={{fontSize:12,color:C.muted,fontWeight:600,textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>{label}</div>
        <div style={{fontSize:26,fontWeight:800,color:col,letterSpacing:"-.02em"}}>{value}</div>
        {sub&&<div style={{fontSize:12,color:C.dim,marginTop:4}}>{sub}</div>}
      </div>
      <div style={{background:col+"18",borderRadius:10,padding:10}}><Icon d={IC[icon]} size={20} color={col}/></div>
    </div>
    {onClick&&<div style={{fontSize:11,color:col,marginTop:10,display:"flex",alignItems:"center",gap:4}}>Ver detalhes <Icon d={IC.arrowright} size={11} color={col}/></div>}
  </div>);
};
const uploadFotos=async(files,pasta)=>{
  const urls=[];
  for(const file of files){
    const ext=file.name.split(".").pop();
    const path=`${pasta}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const {error}=await supabase.storage.from("fotos").upload(path,file,{upsert:true});
    if(!error){const {data}=supabase.storage.from("fotos").getPublicUrl(path);urls.push(data.publicUrl);}
  }
  return urls;
};

// ── AUTH & RECOVERY ────────────────────────────────────────────────────────
const AuthScreen=({C})=>{
  const [mode,setMode]=useState("login");
  const [nome,setNome]=useState(""); const [email,setEmail]=useState(""); const [cel,setCel]=useState("");
  const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState({text:"",ok:false});
  const [sp,setSp]=useState(false);
  const handle=async()=>{
    setLoading(true); setMsg({text:"",ok:false});
    try{
      if(mode==="login"){const {error}=await supabase.auth.signInWithPassword({email,password:pw});if(error)throw error;}
      else if(mode==="cadastro"){
        if(pw!==pw2){setMsg({text:"Senhas não coincidem.",ok:false});setLoading(false);return;}
        if(pw.length<6){setMsg({text:"Mínimo 6 caracteres.",ok:false});setLoading(false);return;}
        const {error}=await supabase.auth.signUp({email,password:pw,options:{data:{nome,cel}}});
        if(error)throw error;
        setMsg({text:"Conta criada! Verifique seu email.",ok:true});setMode("login");setLoading(false);return;
      } else {
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
        if(error)throw error;
        setMsg({text:"Email enviado! Verifique sua caixa.",ok:true});setLoading(false);return;
      }
    }catch(e){setMsg({text:e.message||"Erro",ok:false});}
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:440,padding:20}}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <img src={LOGO} alt="Itsuki Lab" style={{width:120,height:120,objectFit:"contain",marginBottom:12}}/>
          <h1 style={{color:C.text,fontSize:26,fontWeight:900,margin:0}}>Itsuki Lab</h1>
          <p style={{color:C.muted,marginTop:4,fontSize:14}}>Materializando sua imaginação</p>
        </div>
        <Card C={C}>
          {mode!=="recuperar"&&(<div style={{display:"flex",gap:8,marginBottom:24}}>{["login","cadastro"].map(m=>(<button key={m} onClick={()=>setMode(m)} style={{flex:1,padding:"10px",borderRadius:8,border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700,fontSize:14,background:mode===m?C.accent:C.inputBg,color:mode===m?"#fff":C.muted}}>{m==="login"?"Entrar":"Criar conta"}</button>))}</div>)}
          {mode==="recuperar"&&<h3 style={{color:C.text,marginBottom:16,fontSize:16}}>Recuperar senha</h3>}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {mode==="cadastro"&&<Inp C={C} label="Nome completo" value={nome} onChange={setNome}/>}
            <Inp C={C} label="Email" value={email} onChange={setEmail} type="email" placeholder="seu@email.com"/>
            {mode==="cadastro"&&<Inp C={C} label="Celular" value={cel} onChange={setCel} placeholder="(16) 99999-9999"/>}
            {mode!=="recuperar"&&(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>Senha</label>
                <div style={{position:"relative"}}><input type={sp?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)} placeholder="mínimo 6 caracteres" style={{width:"100%",background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 40px 10px 12px",color:C.text,fontSize:14,fontFamily:"inherit",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C.accent} onBlur={e=>e.target.style.borderColor=C.border}/><button onClick={()=>setSp(s=>!s)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.muted,cursor:"pointer"}}><Icon d={sp?IC.eyeoff:IC.eye} size={16}/></button></div>
              </div>
            )}
            {mode==="cadastro"&&<Inp C={C} label="Confirmar Senha" value={pw2} onChange={setPw2} type="password" placeholder="repita a senha"/>}
            {msg.text&&<div style={{background:msg.ok?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:msg.ok?C.green:C.red,padding:12,borderRadius:8,fontSize:13}}>{msg.text}</div>}
            <Btn C={C} onClick={handle} loading={loading} full size="lg">{mode==="login"?"Entrar":mode==="cadastro"?"Criar conta":"Enviar email"}</Btn>
            {mode==="login"&&<button onClick={()=>setMode("recuperar")} style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontFamily:"inherit",textAlign:"center"}}>Esqueci minha senha</button>}
            {mode==="recuperar"&&<button onClick={()=>setMode("login")} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit",textAlign:"center"}}>← Voltar</button>}
          </div>
        </Card>
      </div>
    </div>
  );
};

const RecoveryScreen=({C})=>{
  const [pw,setPw]=useState(""); const [pw2,setPw2]=useState("");
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState({text:"",ok:false});
  const handle=async()=>{
    if(pw!==pw2){setMsg({text:"Senhas não coincidem.",ok:false});return;}
    if(pw.length<6){setMsg({text:"Mínimo 6 caracteres.",ok:false});return;}
    setLoading(true);
    const {error}=await supabase.auth.updateUser({password:pw});
    if(error){setMsg({text:error.message,ok:false});}
    else{setMsg({text:"Senha alterada! Redirecionando...",ok:true});setTimeout(()=>{window.location.href="/";},2000);}
    setLoading(false);
  };
  return(
    <div style={{minHeight:"100vh",background:C.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:400,padding:20}}>
        <div style={{textAlign:"center",marginBottom:32}}><img src={LOGO} style={{width:100,height:100,objectFit:"contain"}}/><h1 style={{color:C.text,fontSize:22,fontWeight:900,margin:"12px 0 0"}}>Nova Senha</h1></div>
        <Card C={C}><div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Inp C={C} label="Nova Senha" value={pw} onChange={setPw} type="password" placeholder="mínimo 6 caracteres"/>
          <Inp C={C} label="Confirmar Nova Senha" value={pw2} onChange={setPw2} type="password" placeholder="repita"/>
          {msg.text&&<div style={{background:msg.ok?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:msg.ok?C.green:C.red,padding:12,borderRadius:8,fontSize:13}}>{msg.text}</div>}
          <Btn C={C} onClick={handle} loading={loading} full size="lg">Salvar nova senha</Btn>
        </div></Card>
      </div>
    </div>
  );
};

// ── SIDEBAR ────────────────────────────────────────────────────────────────
const NAV=[{id:"dashboard",label:"Dashboard",icon:"home"},{id:"catalogo",label:"Catálogo",icon:"box"},{id:"orcamento",label:"Precificação",icon:"tag"},{id:"filamentos",label:"Filamentos",icon:"cube"},{id:"insumos",label:"Insumos",icon:"package"},{id:"pedidos",label:"Pedidos",icon:"printer"},{id:"clientes",label:"Clientes",icon:"users"},{id:"financeiro",label:"Financeiro",icon:"dollar"},{id:"configs",label:"Configurações",icon:"settings"}];

const Sidebar=({active,setActive,user,onLogout,darkMode,setDarkMode,C,badge})=>(
  <aside style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,height:"100vh",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,zIndex:100}}>
    <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${C.border}`,textAlign:"center"}}>
      <img src={LOGO} alt="Itsuki Lab" style={{width:64,height:64,objectFit:"contain",display:"block",margin:"0 auto 8px"}}/>
      <div style={{fontWeight:800,fontSize:14,color:C.text}}>Itsuki Lab</div>
      <div style={{fontSize:10,color:C.muted}}>Materializando sua imaginação</div>
    </div>
    <nav style={{flex:1,padding:"12px 10px",overflowY:"auto"}}>
      {NAV.map(item=>(
        <button key={item.id} onClick={()=>setActive(item.id)} style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",marginBottom:2,fontFamily:"inherit",fontWeight:active===item.id?700:500,fontSize:14,textAlign:"left",background:active===item.id?C.navActive:"transparent",color:active===item.id?C.accent:C.muted,borderLeft:active===item.id?`3px solid ${C.accent}`:"3px solid transparent",transition:"all .15s",position:"relative"}}>
          <Icon d={IC[item.icon]} size={17} color={active===item.id?C.accent:C.muted}/>{item.label}
          {item.id==="pedidos"&&badge>0&&<span style={{position:"absolute",right:8,top:8,background:C.red,color:"#fff",borderRadius:99,fontSize:10,fontWeight:800,padding:"1px 6px",minWidth:18,textAlign:"center"}}>{badge}</span>}
        </button>
      ))}
    </nav>
    <div style={{padding:"14px 16px",borderTop:`1px solid ${C.border}`,display:"flex",flexDirection:"column",gap:10}}>
      <button onClick={()=>setDarkMode(d=>!d)} style={{display:"flex",alignItems:"center",gap:8,background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",color:C.muted,fontFamily:"inherit",fontSize:13,width:"100%"}}><Icon d={darkMode?IC.sun:IC.moon} size={15}/>{darkMode?"Modo Claro":"Modo Escuro"}</button>
      <div style={{fontSize:11,color:C.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user?.email}</div>
      <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}><Icon d={IC.logout} size={15}/>Sair</button>
    </div>
  </aside>
);


// ── DASHBOARD ──────────────────────────────────────────────────────────────
const Dashboard=({filamentos,pedidos,clientes,catalogo,C,setPage})=>{
  const ativos=pedidos.filter(p=>p.status!=="entregue"&&p.status!=="cancelado").length;
  const receita=pedidos.filter(p=>p.status==="pago"||p.status==="entregue").reduce((s,p)=>s+(p.total||0),0);
  const filLivre=filamentos.reduce((s,f)=>s+(((f.peso_atual||f.peso_total)-(f.peso_carretel||0))),0);
  const aguardando=pedidos.filter(p=>p.status==="aguardando confirmação").length;
  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Dashboard</h1>
    <p style={{color:C.muted,marginBottom:20,fontSize:14}}>Bem-vinda, Itsuki Lab! Clique nos cards para navegar.</p>
    {aguardando>0&&(<div onClick={()=>setPage("pedidos")} style={{background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:12,padding:"14px 18px",marginBottom:20,cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
      <Icon d={IC.bell} size={20} color={C.red}/><div><div style={{fontWeight:700,color:C.red,fontSize:14}}>🛍️ {aguardando} novo{aguardando>1?"s":""} pedido{aguardando>1?"s":""} aguardando confirmação!</div><div style={{fontSize:12,color:C.muted}}>Clique para ver</div></div>
    </div>)}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,marginBottom:28}}>
      <StatCard C={C} label="Pedidos Ativos" value={ativos} color={C.accent} icon="printer" onClick={()=>setPage("pedidos")}/>
      <StatCard C={C} label="Receita Total" value={brl(receita)} color={C.green} icon="dollar" onClick={()=>setPage("financeiro")}/>
      <StatCard C={C} label="Clientes" value={clientes.length} color={C.blue} icon="users" onClick={()=>setPage("clientes")}/>
      <StatCard C={C} label="Filamentos" value={filamentos.length} sub={filLivre.toFixed(0)+"g livre"} color={C.yellow} icon="cube" onClick={()=>setPage("filamentos")}/>
      <StatCard C={C} label="Catálogo" value={catalogo.length} sub={catalogo.filter(c=>c.em_estoque).reduce((s,c)=>s+(c.qtd_estoque||0),0)+" em estoque"} color={C.purple} icon="box" onClick={()=>setPage("catalogo")}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card C={C}>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:C.text}}>📋 Pedidos Recentes</h3>
        {pedidos.length===0?<p style={{color:C.dim,fontSize:13}}>Nenhum pedido</p>:pedidos.slice(0,5).map(p=>(
          <div key={p.id} onClick={()=>setPage("pedidos")} style={{display:"flex",justifyContent:"space-between",padding:"10px 8px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",borderRadius:8}} onMouseEnter={e=>e.currentTarget.style.background=C.inputBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div><div style={{fontSize:14,fontWeight:600,color:C.text}}>#{p.numero} {p.cliente_nome||"—"}</div><div style={{fontSize:12,color:C.muted}}>{p.data}</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:C.accent}}>{brl(p.total)}</div><Badge C={C} color={STATUS_COLORS[p.status]||C.yellow}>{p.status}</Badge></div>
          </div>
        ))}
        <button onClick={()=>setPage("pedidos")} style={{marginTop:12,background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>Ver todos <Icon d={IC.arrowright} size={13} color={C.accent}/></button>
      </Card>
      <Card C={C}>
        <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:C.text}}>🛍️ Catálogo</h3>
        {catalogo.slice(0,5).map(p=>{
          let fotos=[];try{fotos=JSON.parse(p.fotos_urls||"[]");}catch{}
          if(fotos.length===0&&p.foto_url)fotos=[p.foto_url];
          return(<div key={p.id} onClick={()=>setPage("catalogo")} style={{display:"flex",alignItems:"center",gap:10,padding:"8px",borderBottom:`1px solid ${C.border}`,cursor:"pointer",borderRadius:8}} onMouseEnter={e=>e.currentTarget.style.background=C.inputBg} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {fotos[0]?<img src={fotos[0]} alt={p.nome} style={{width:38,height:38,borderRadius:8,objectFit:"cover"}}/>:<div style={{width:38,height:38,borderRadius:8,background:C.inputBg,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon d={IC.box} size={16} color={C.dim}/></div>}
            <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.nome}</div><div style={{fontSize:12,color:C.muted}}>{brl(p.preco_venda)}</div></div>
            <Badge C={C} color={p.em_estoque?C.green:C.yellow}>{p.em_estoque?p.qtd_estoque+" un":"Sob pedido"}</Badge>
          </div>);
        })}
        <button onClick={()=>setPage("catalogo")} style={{marginTop:12,background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:13,fontFamily:"inherit",display:"flex",alignItems:"center",gap:4}}>Ver catálogo <Icon d={IC.arrowright} size={13} color={C.accent}/></button>
      </Card>
    </div>
  </div>);
};


// ── CATÁLOGO ───────────────────────────────────────────────────────────────
const Catalogo=({catalogo,filamentos,insumos,configs,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false); const [editando,setEditando]=useState(null);
  const [busca,setBusca]=useState(""); const [novosFotos,setNovosFotos]=useState([]);
  const [loading,setLoading]=useState(false); const [view,setView]=useState("grid");
  const [filUsados,setFilUsados]=useState([{filamento_id:"",consumo_g:""}]);
  const [insUsados,setInsUsados]=useState([]);
  const empty={nome:"",descricao:"",em_estoque:false,qtd_estoque:0,preco_venda:"",fotos_urls:"[]"};
  const [form,setForm]=useState(empty);
  const sf=(k,v)=>setForm(f=>({...f,[k]:v}));

  const calcCusto=()=>{
    const ch=configs?.custo_hora||15; const kwh=configs?.energia_kwh||0.85;
    let cf=0,cg_total=0;
    for(const fu of filUsados){const fil=filamentos.find(x=>x.id===fu.filamento_id);if(fil){const u=(fil.peso_atual||fil.peso_total)-(fil.peso_carretel||0);const cg=u>0?fil.valor_pago/u:0;cf+=cg*(parseFloat(fu.consumo_g)||0);cg_total+=parseFloat(fu.consumo_g)||0;}}
    const hrs=cg_total/50;
    const ce=hrs*0.2*kwh; const cm=hrs*ch;
    let ci=0;
    for(const iu of insUsados){const ins=insumos.find(x=>x.id===iu.insumo_id);if(ins){const u=ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0;ci+=u*(parseFloat(iu.quantidade)||0);}}
    return {cf,ce,cm,ci,total:cf+ce+cm+ci};
  };

  const abrir=(item=null)=>{
    setEditando(item);
    if(item){
      setForm({nome:item.nome||"",descricao:item.descricao||"",em_estoque:item.em_estoque||false,qtd_estoque:item.qtd_estoque||0,preco_venda:item.preco_venda||"",fotos_urls:item.fotos_urls||"[]"});
      try{setFilUsados(JSON.parse(item.filamentos_usados||"[]").length>0?JSON.parse(item.filamentos_usados||"[]"):[{filamento_id:"",consumo_g:""}]);}catch{setFilUsados([{filamento_id:"",consumo_g:""}]);}
      try{setInsUsados(JSON.parse(item.insumos_usados||"[]"));}catch{setInsUsados([]);}
    } else {setForm(empty);setFilUsados([{filamento_id:"",consumo_g:""}]);setInsUsados([]);}
    setNovosFotos([]); setModal(true);
  };

  const salvar=async()=>{
    if(!form.nome)return alert("Preencha o nome.");
    setLoading(true);
    let fotos=[];try{fotos=JSON.parse(form.fotos_urls||"[]");}catch{}
    if(novosFotos.length>0){const novas=await uploadFotos(novosFotos,"catalogo");fotos=[...fotos,...novas];}
    const c=calcCusto();
    const payload={...form,fotos_urls:JSON.stringify(fotos),foto_url:fotos[0]||"",
      filamentos_usados:JSON.stringify(filUsados),insumos_usados:JSON.stringify(insUsados),
      custo_producao:c.total,consumo_g:filUsados.reduce((s,f)=>s+(parseFloat(f.consumo_g)||0),0),
      qtd_estoque:parseInt(form.qtd_estoque)||0,preco_venda:parseFloat(form.preco_venda)||0};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false);setLoading(false);
  };

  const filtrados=catalogo.filter(p=>p.nome?.toLowerCase().includes(busca.toLowerCase()));
  const custo=calcCusto();

  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Catálogo</h1><p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Múltiplas fotos por produto</p></div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setView(v=>v==="grid"?"list":"grid")} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",cursor:"pointer",color:C.muted,fontFamily:"inherit",fontSize:13}}>{view==="grid"?"☰ Lista":"⊞ Grade"}</button>
        <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Produto</Btn>
      </div>
    </div>
    <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar produto..."/></div>
    {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum produto</p><div style={{marginTop:16}}><Btn C={C} onClick={()=>abrir()} icon="plus" size="sm">Adicionar</Btn></div></Card>:(
      view==="grid"?(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
          {filtrados.map(p=>{
            let fotos=[];try{fotos=JSON.parse(p.fotos_urls||"[]");}catch{}
            if(fotos.length===0&&p.foto_url)fotos=[p.foto_url];
            return(<Card C={C} key={p.id} style={{padding:0,overflow:"hidden"}}>
              <div style={{position:"relative"}}>
                {fotos.length>0?<img src={fotos[0]} alt={p.nome} style={{width:"100%",height:180,objectFit:"cover"}}/>:<div style={{width:"100%",height:180,background:C.inputBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>📦</div>}
                {fotos.length>1&&<div style={{position:"absolute",top:8,left:8}}><Badge C={C} color="rgba(0,0,0,0.6)">{fotos.length} fotos</Badge></div>}
                <div style={{position:"absolute",top:8,right:8,display:"flex",gap:6}}>
                  <button onClick={()=>abrir(p)} style={{background:"rgba(0,0,0,.6)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"#fff"}}><Icon d={IC.edit} size={14}/></button>
                  <button onClick={()=>{if(window.confirm("Excluir?"))onDel(p.id);}} style={{background:"rgba(239,68,68,.7)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"#fff"}}><Icon d={IC.trash} size={14}/></button>
                </div>
                <div style={{position:"absolute",bottom:8,left:8}}><Badge C={C} color={p.em_estoque?C.green:C.yellow}>{p.em_estoque?p.qtd_estoque+" un":"Sob pedido"}</Badge></div>
              </div>
              <div style={{padding:16}}>
                <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>{p.nome}</div>
                {p.descricao&&<div style={{fontSize:12,color:C.muted,marginBottom:10,display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{p.descricao}</div>}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:12}}>
                  <div style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>Custo</div><div style={{fontWeight:700,color:C.text}}>{brl(p.custo_producao)}</div></div>
                  <div style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>Venda</div><div style={{fontWeight:700,color:C.accent}}>{brl(p.preco_venda)}</div></div>
                </div>
              </div>
            </Card>);
          })}
        </div>
      ):(
        <Card C={C} style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.inputBg}}>{["Foto","Produto","Estoque","Custo","Venda","Margem",""].map(h=>(<th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>))}</tr></thead>
            <tbody>{filtrados.map(p=>{
              let fotos=[];try{fotos=JSON.parse(p.fotos_urls||"[]");}catch{}
              if(fotos.length===0&&p.foto_url)fotos=[p.foto_url];
              const margem=p.preco_venda>0?((p.preco_venda-p.custo_producao)/p.preco_venda*100).toFixed(0):0;
              return(<tr key={p.id} style={{borderTop:`1px solid ${C.border}`}}>
                <td style={{padding:"10px 14px"}}>{fotos[0]?<img src={fotos[0]} alt={p.nome} style={{width:44,height:44,objectFit:"cover",borderRadius:8}}/>:<div style={{width:44,height:44,background:C.inputBg,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📦</div>}</td>
                <td style={{padding:"10px 14px"}}><div style={{fontWeight:600,color:C.text}}>{p.nome}</div>{p.descricao&&<div style={{fontSize:11,color:C.muted}}>{p.descricao.slice(0,50)}{p.descricao.length>50?"...":""}</div>}</td>
                <td style={{padding:"10px 14px"}}><Badge C={C} color={p.em_estoque?C.green:C.yellow}>{p.em_estoque?p.qtd_estoque+" un":"Sob pedido"}</Badge></td>
                <td style={{padding:"10px 14px",color:C.text,fontWeight:600}}>{brl(p.custo_producao)}</td>
                <td style={{padding:"10px 14px",color:C.accent,fontWeight:700}}>{brl(p.preco_venda)}</td>
                <td style={{padding:"10px 14px"}}><Badge C={C} color={margem>=30?C.green:margem>=10?C.yellow:C.red}>{margem}%</Badge></td>
                <td style={{padding:"10px 14px"}}>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>abrir(p)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={13}/></button>
                    <button onClick={()=>{if(window.confirm("Excluir?"))onDel(p.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={13}/></button>
                  </div>
                </td>
              </tr>);
            })}</tbody>
          </table>
        </Card>
      )
    )}

    {modal&&(<Modal C={C} title={editando?"Editar Produto":"Novo Produto"} onClose={()=>setModal(false)} wider>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>Fotos ({(()=>{let f=[];try{f=JSON.parse(form.fotos_urls||"[]");}catch{}return f.length;})() + novosFotos.length} foto{((()=>{let f=[];try{f=JSON.parse(form.fotos_urls||"[]");}catch{}return f.length;})() + novosFotos.length)!==1?"s":""})</label>
          {(()=>{let ex=[];try{ex=JSON.parse(form.fotos_urls||"[]");}catch{}return ex.length>0&&(
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:8}}>
              {ex.map((url,i)=>(<div key={i} style={{position:"relative"}}>
                <img src={url} style={{width:"100%",height:70,objectFit:"cover",borderRadius:8}}/>
                <button onClick={()=>{let a=[...ex];a.splice(i,1);sf("fotos_urls",JSON.stringify(a));}} style={{position:"absolute",top:2,right:2,background:"rgba(239,68,68,.8)",border:"none",borderRadius:4,color:"#fff",cursor:"pointer",fontSize:10,padding:"1px 4px"}}>✕</button>
              </div>))}
            </div>
          );})()}
          <label style={{display:"block",cursor:"pointer"}}>
            <input type="file" accept="image/*" multiple onChange={e=>setNovosFotos(Array.from(e.target.files))} style={{display:"none"}}/>
            <div style={{background:C.inputBg,border:`2px dashed ${C.border}`,borderRadius:12,padding:"20px",textAlign:"center",color:C.muted}}>
              <Icon d={IC.camera} size={28} color={C.muted}/><div style={{fontSize:13,marginTop:6}}>Selecionar fotos (múltiplas)</div>
              {novosFotos.length>0&&<div style={{fontSize:12,color:C.green,marginTop:4}}>{novosFotos.length} foto(s) nova(s)</div>}
            </div>
          </label>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp C={C} label="Nome do produto" value={form.nome} onChange={v=>sf("nome",v)} placeholder="Ex: Vaso decorativo"/>
          <Inp C={C} label="Descrição (medidas, detalhes)" value={form.descricao} onChange={v=>sf("descricao",v)} placeholder="10x5cm, PLA, personalizado..."/>
          <div style={{display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="est" checked={form.em_estoque} onChange={e=>sf("em_estoque",e.target.checked)} style={{accentColor:C.accent,width:16,height:16}}/><label htmlFor="est" style={{color:C.text,fontSize:14,cursor:"pointer",fontWeight:600}}>Em estoque</label></div>
          {form.em_estoque&&<Inp C={C} label="Quantidade" value={form.qtd_estoque} onChange={v=>sf("qtd_estoque",v)} type="number" suffix="un"/>}
          <Inp C={C} label="Preço de venda" value={form.preco_venda} onChange={v=>sf("preco_venda",v)} type="number" prefix="R$"/>
        </div>
      </div>

      <div style={{marginTop:20,padding:16,background:C.inputBg,borderRadius:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.accent}}>🧵 Filamentos Usados</div>
          <button onClick={()=>setFilUsados(f=>[...f,{filamento_id:"",consumo_g:""}])} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ Filamento</button>
        </div>
        {filUsados.map((fu,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 120px 32px",gap:8,marginBottom:8,alignItems:"end"}}>
            <Sel C={C} label={i===0?"Filamento":""} value={fu.filamento_id} onChange={v=>{const a=[...filUsados];a[i]={...a[i],filamento_id:v};setFilUsados(a);}} options={[{value:"",label:"— Selecionar —"},...filamentos.map(f=>({value:f.id,label:`${f.marca} ${f.material}${f.cor?" ("+f.cor+")":""}`}))]}/>
            <Inp C={C} label={i===0?"g usados":""} value={fu.consumo_g} onChange={v=>{const a=[...filUsados];a[i]={...a[i],consumo_g:v};setFilUsados(a);}} type="number" suffix="g"/>
            {filUsados.length>1&&<button onClick={()=>setFilUsados(f=>f.filter((_,j)=>j!==i))} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,height:38,cursor:"pointer",color:C.red}}>✕</button>}
          </div>
        ))}
      </div>

      {insumos.length>0&&(<div style={{marginTop:12,padding:16,background:C.inputBg,borderRadius:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.accent}}>✨ Insumos</div>
          <button onClick={()=>setInsUsados(f=>[...f,{insumo_id:"",quantidade:""}])} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ Insumo</button>
        </div>
        {insUsados.map((iu,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 120px 32px",gap:8,marginBottom:8,alignItems:"end"}}>
            <Sel C={C} label={i===0?"Insumo":""} value={iu.insumo_id} onChange={v=>{const a=[...insUsados];a[i]={...a[i],insumo_id:v};setInsUsados(a);}} options={[{value:"",label:"— Selecionar —"},...insumos.map(ins=>({value:ins.id,label:`${ins.nome} (${brl(ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0)}/un)`}))]}/>
            <Inp C={C} label={i===0?"Qtd":""} value={iu.quantidade} onChange={v=>{const a=[...insUsados];a[i]={...a[i],quantidade:v};setInsUsados(a);}} type="number" suffix="un"/>
            <button onClick={()=>setInsUsados(f=>f.filter((_,j)=>j!==i))} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,height:38,cursor:"pointer",color:C.red}}>✕</button>
          </div>
        ))}
      </div>)}

      {(filUsados.some(f=>f.filamento_id&&f.consumo_g)||insUsados.some(i=>i.insumo_id))&&(
        <div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8}}>
          {[["Filamento",custo.cf],["Energia",custo.ce],["Mão de obra",custo.cm],["Insumos",custo.ci],["Total",custo.total]].map(([l,v],i)=>(
            <div key={l} style={{background:i===4?C.accentSoft:C.card,border:`1px solid ${i===4?C.accentGlow:C.border}`,borderRadius:8,padding:8,textAlign:"center"}}>
              <div style={{fontSize:10,color:i===4?C.accent:C.muted}}>{l}</div>
              <div style={{fontSize:13,fontWeight:700,color:i===4?C.accent:C.text}}>{brl(v)}</div>
            </div>
          ))}
        </div>
      )}
      {form.preco_venda&&custo.total>0&&(<div style={{marginTop:8,padding:10,background:"rgba(34,197,94,0.08)",borderRadius:8,fontSize:12,color:C.green}}>Lucro: {brl(parseFloat(form.preco_venda)-custo.total)} · Margem: {((parseFloat(form.preco_venda)-custo.total)/parseFloat(form.preco_venda)*100).toFixed(1)}%</div>)}

      <div style={{display:"flex",gap:10,marginTop:20}}>
        <Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar alterações":"Adicionar ao catálogo"}</Btn>
        <Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn>
      </div>
    </Modal>)}
  </div>);
};


// ── FILAMENTOS ─────────────────────────────────────────────────────────────
const Filamentos=({filamentos,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false);const [editando,setEditando]=useState(null);const [loading,setLoading]=useState(false);
  const [fotoPreview,setFotoPreview]=useState(null);const [fotoFile,setFotoFile]=useState(null);
  const empty={marca:"",material:"PLA",cor:"",peso_total:1000,peso_atual:"",peso_carretel:200,valor_pago:"",foto_url:""};
  const [form,setForm]=useState(empty);const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const pesoUtil=parseFloat(form.peso_atual||form.peso_total||0)-parseFloat(form.peso_carretel||0);
  const abrir=(item=null)=>{setEditando(item);setForm(item?{marca:item.marca||"",material:item.material||"PLA",cor:item.cor||"",peso_total:item.peso_total||1000,peso_atual:item.peso_atual||"",peso_carretel:item.peso_carretel??200,valor_pago:item.valor_pago||"",foto_url:item.foto_url||""}:empty);setFotoPreview(item?.foto_url||null);setFotoFile(null);setModal(true);};
  const handleFoto=(e)=>{const file=e.target.files[0];if(!file)return;setFotoFile(file);const r=new FileReader();r.onload=ev=>setFotoPreview(ev.target.result);r.readAsDataURL(file);};
  const salvar=async()=>{
    if(!form.marca||!form.valor_pago)return alert("Preencha marca e valor.");
    setLoading(true);
    let foto_url=form.foto_url;
    if(fotoFile){const ext=fotoFile.name.split(".").pop();const path=`filamentos/${Date.now()}.${ext}`;const {error:upErr}=await supabase.storage.from("fotos").upload(path,fotoFile,{upsert:true});if(!upErr){const {data}=supabase.storage.from("fotos").getPublicUrl(path);foto_url=data.publicUrl;}}
    const payload={...form,foto_url,peso_total:parseFloat(form.peso_total),peso_atual:parseFloat(form.peso_atual)||parseFloat(form.peso_total),peso_carretel:parseFloat(form.peso_carretel)||0,valor_pago:parseFloat(form.valor_pago)};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false);setLoading(false);
  };
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Filamentos</h1></div>
      <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Filamento</Btn>
    </div>
    {filamentos.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum filamento</p></Card>:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {filamentos.map(f=>{
          const pa=f.peso_atual||f.peso_total;const car=f.peso_carretel||0;const util=pa-car;const pct=Math.max(0,Math.min(100,(util/f.peso_total)*100));const custog=util>0?f.valor_pago/util:0;
          return(<Card C={C} key={f.id}>
            {f.foto_url&&(<div style={{margin:"-20px -20px 16px",borderRadius:"14px 14px 0 0",overflow:"hidden",height:150,position:"relative"}}>
              <img src={f.foto_url} alt={f.cor||f.marca} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.5) 100%)"}}/>
              <div style={{position:"absolute",bottom:8,left:10,display:"flex",gap:6}}><Badge C={C} color={C.blue}>{f.material}</Badge>{f.cor&&<Badge C={C} color="rgba(255,255,255,0.9)">{f.cor}</Badge>}</div>
              <div style={{position:"absolute",top:6,right:6,display:"flex",gap:4}}>
                <button onClick={()=>abrir(f)} style={{background:"rgba(0,0,0,.6)",border:"none",borderRadius:6,padding:"4px 7px",cursor:"pointer",color:"#fff"}}><Icon d={IC.edit} size={13}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(f.id);}} style={{background:"rgba(239,68,68,.7)",border:"none",borderRadius:6,padding:"4px 7px",cursor:"pointer",color:"#fff"}}><Icon d={IC.trash} size={13}/></button>
              </div>
            </div>)}
            {!f.foto_url&&(<div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div><div style={{fontWeight:700,color:C.text}}>{f.marca}</div><div style={{display:"flex",gap:4,marginTop:4}}><Badge C={C} color={C.blue}>{f.material}</Badge>{f.cor&&<Badge C={C} color={C.muted}>{f.cor}</Badge>}</div></div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>abrir(f)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 7px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={13}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(f.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:7,padding:"5px 7px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={13}/></button>
              </div>
            </div>)}
            {f.foto_url&&<div style={{fontWeight:700,color:C.text,marginBottom:10}}>{f.marca}</div>}
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginBottom:6}}><span>Útil: <strong style={{color:util>100?C.green:util>0?C.yellow:C.red}}>{util.toFixed(0)}g</strong></span><span>{pct.toFixed(0)}%</span></div>
            <div style={{height:7,background:C.inputBg,borderRadius:4,marginBottom:12}}><div style={{height:"100%",width:`${pct}%`,background:pct>50?C.green:pct>20?C.yellow:C.red,borderRadius:4}}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,fontSize:11}}>
              {[["Total",f.peso_total+"g"],["Carretel",car+"g"],["R$/g",brl(custog)]].map(([l,v])=>(<div key={l} style={{background:C.inputBg,borderRadius:7,padding:7}}><div style={{color:C.muted}}>{l}</div><div style={{fontWeight:700,color:C.text}}>{v}</div></div>))}
            </div>
          </Card>);
        })}
      </div>
    )}
    {modal&&(<Modal C={C} title={editando?"Editar Filamento":"Novo Filamento"} onClose={()=>setModal(false)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:16}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>Foto</label>
          <label style={{display:"block",cursor:"pointer"}}>
            <input type="file" accept="image/*" capture="environment" onChange={handleFoto} style={{display:"none"}}/>
            {fotoPreview?<img src={fotoPreview} style={{width:"100%",height:170,objectFit:"cover",borderRadius:12,border:`2px solid ${C.accent}`}}/>:<div style={{height:170,background:C.inputBg,border:`2px dashed ${C.border}`,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,color:C.muted}}><Icon d={IC.camera} size={26} color={C.muted}/><span style={{fontSize:12}}>Foto do rolo</span></div>}
          </label>
          {fotoPreview&&<button onClick={()=>{setFotoPreview(null);setFotoFile(null);sf("foto_url","");}} style={{marginTop:6,background:"none",border:"none",color:C.red,fontSize:12,cursor:"pointer"}}>Remover</button>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <Inp C={C} label="Marca" value={form.marca} onChange={v=>sf("marca",v)} placeholder="Ex: Esun, Bambu..."/>
          <Sel C={C} label="Material" value={form.material} onChange={v=>sf("material",v)} options={MATERIAIS.map(m=>({value:m,label:m}))}/>
          <Inp C={C} label="Cor" value={form.cor} onChange={v=>sf("cor",v)} placeholder="Ex: Silk Rosa..."/>
        </div>
      </div>
      <div style={{padding:13,background:C.inputBg,borderRadius:10,marginBottom:13}}>
        <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:11}}>⚖️ Pesos</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:11}}>
          <Inp C={C} label="Peso total (novo)" value={form.peso_total} onChange={v=>sf("peso_total",v)} type="number" suffix="g"/>
          <Inp C={C} label="Peso atual" value={form.peso_atual} onChange={v=>sf("peso_atual",v)} type="number" suffix="g" help="Pese agora"/>
          <Inp C={C} label="Carretel vazio" value={form.peso_carretel} onChange={v=>sf("peso_carretel",v)} type="number" suffix="g"/>
        </div>
        <div style={{marginTop:9,padding:9,background:C.card,borderRadius:7,fontSize:13}}><span style={{color:C.muted}}>Útil: </span><strong style={{color:pesoUtil>0?C.green:C.red}}>{pesoUtil.toFixed(0)}g</strong></div>
      </div>
      <Inp C={C} label="Valor pago pelo rolo" value={form.valor_pago} onChange={v=>sf("valor_pago",v)} type="number" prefix="R$"/>
      <div style={{display:"flex",gap:10,marginTop:15}}><Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Adicionar"}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
    </Modal>)}
  </div>);
};

// ── INSUMOS ────────────────────────────────────────────────────────────────
const Insumos=({insumos,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false);const [editando,setEditando]=useState(null);const [loading,setLoading]=useState(false);
  const [fotoPreview,setFotoPreview]=useState(null);const [fotoFile,setFotoFile]=useState(null);
  const empty={nome:"",descricao:"",valor_pago:"",qtd_total:"",foto_url:""};
  const [form,setForm]=useState(empty);const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const abrir=(item=null)=>{setEditando(item);setForm(item?{nome:item.nome||"",descricao:item.descricao||"",valor_pago:item.valor_pago||"",qtd_total:item.qtd_total||"",foto_url:item.foto_url||""}:empty);setFotoPreview(item?.foto_url||null);setFotoFile(null);setModal(true);};
  const handleFoto=(e)=>{const file=e.target.files[0];if(!file)return;setFotoFile(file);const r=new FileReader();r.onload=ev=>setFotoPreview(ev.target.result);r.readAsDataURL(file);};
  const salvar=async()=>{
    if(!form.nome||!form.valor_pago||!form.qtd_total)return alert("Preencha nome, valor e quantidade.");
    setLoading(true);
    let foto_url=form.foto_url;
    if(fotoFile){const ext=fotoFile.name.split(".").pop();const path=`insumos/${Date.now()}.${ext}`;const {error:upErr}=await supabase.storage.from("fotos").upload(path,fotoFile,{upsert:true});if(!upErr){const {data}=supabase.storage.from("fotos").getPublicUrl(path);foto_url=data.publicUrl;}}
    const payload={...form,foto_url,valor_pago:parseFloat(form.valor_pago)||0,qtd_total:parseFloat(form.qtd_total)||0};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false);setLoading(false);
  };
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Insumos</h1><p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Argolas, correntes, imãs e outros itens adicionais</p></div>
      <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Insumo</Btn>
    </div>
    {insumos.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><div style={{fontSize:40,marginBottom:12}}>✨</div><p style={{color:C.dim}}>Cadastre argolas, correntes, imãs...</p><div style={{marginTop:16}}><Btn C={C} onClick={()=>abrir()} icon="plus" size="sm">Adicionar</Btn></div></Card>:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
        {insumos.map(ins=>{const unit=ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0;
          return(<Card C={C} key={ins.id}>
            {ins.foto_url&&<img src={ins.foto_url} alt={ins.nome} style={{width:"100%",height:130,objectFit:"cover",borderRadius:10,marginBottom:12}}/>}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div><div style={{fontWeight:700,color:C.text,fontSize:14}}>{ins.nome}</div>{ins.descricao&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>{ins.descricao}</div>}</div>
              <div style={{display:"flex",gap:4}}>
                <button onClick={()=>abrir(ins)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 7px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={13}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(ins.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:7,padding:"5px 7px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={13}/></button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,fontSize:11}}>
              {[["Valor pago",brl(ins.valor_pago)],["Qtd total",ins.qtd_total+" un"],["Custo/un",brl(unit)]].map(([l,v])=>(<div key={l} style={{background:C.inputBg,borderRadius:7,padding:7}}><div style={{color:C.muted}}>{l}</div><div style={{fontWeight:700,color:C.text}}>{v}</div></div>))}
            </div>
          </Card>);
        })}
      </div>
    )}
    {modal&&(<Modal C={C} title={editando?"Editar Insumo":"Novo Insumo"} onClose={()=>setModal(false)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>Foto</label>
          <label style={{display:"block",cursor:"pointer"}}>
            <input type="file" accept="image/*" capture="environment" onChange={handleFoto} style={{display:"none"}}/>
            {fotoPreview?<img src={fotoPreview} style={{width:"100%",height:170,objectFit:"cover",borderRadius:12,border:`2px solid ${C.accent}`}}/>:<div style={{height:170,background:C.inputBg,border:`2px dashed ${C.border}`,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,color:C.muted}}><Icon d={IC.camera} size={26} color={C.muted}/><span style={{fontSize:12}}>Foto do item</span></div>}
          </label>
          {fotoPreview&&<button onClick={()=>{setFotoPreview(null);setFotoFile(null);sf("foto_url","");}} style={{marginTop:6,background:"none",border:"none",color:C.red,fontSize:12,cursor:"pointer"}}>Remover</button>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:11}}>
          <Inp C={C} label="Nome" value={form.nome} onChange={v=>sf("nome",v)} placeholder="Ex: Argola de chaveiro"/>
          <Inp C={C} label="Descrição" value={form.descricao} onChange={v=>sf("descricao",v)} placeholder="Tamanho, cor..."/>
          <Inp C={C} label="Valor pago (pacote)" value={form.valor_pago} onChange={v=>sf("valor_pago",v)} type="number" prefix="R$"/>
          <Inp C={C} label="Quantidade no pacote" value={form.qtd_total} onChange={v=>sf("qtd_total",v)} type="number" suffix="un"/>
          {form.valor_pago&&form.qtd_total&&(<div style={{padding:9,background:C.accentSoft,borderRadius:8,fontSize:13}}><span style={{color:C.muted}}>Custo unitário: </span><strong style={{color:C.accent}}>{brl(parseFloat(form.valor_pago)/parseFloat(form.qtd_total))}</strong></div>)}
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}><Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Adicionar"}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
    </Modal>)}
  </div>);
};


// ── PRECIFICAÇÃO ── com automação → catálogo ───────────────────────────────
const Orcamento=({filamentos,insumos,configs,onSaveConfigs,onAddCatalogo,C})=>{
  const [nome,setNome]=useState("");
  const [filUsados,setFilUsados]=useState([{filamento_id:"",consumo_g:""}]);
  const [insUsados,setInsUsados]=useState([]);
  const [tempH,setTempH]=useState(0);const [tempM,setTempM]=useState(0);
  const [tempoMao,setTempoMao]=useState(0);const [retrabalho,setRetrabalho]=useState(0);
  const [urgencia,setUrgencia]=useState(0);const [margem,setMargem]=useState(configs?.margem_lucro||50);
  const [resultado,setResultado]=useState(null);
  const [cfgForm,setCfgForm]=useState({custo_hora:configs?.custo_hora||15,energia_kwh:configs?.energia_kwh||0.85,margem_lucro:configs?.margem_lucro||50,marketplace:configs?.marketplace||0,cartao:configs?.cartao||0,nf:configs?.nf||0});
  const [savingCfg,setSavingCfg]=useState(false);
  const [salvarModal,setSalvarModal]=useState(false);
  const [catForm,setCatForm]=useState({preco_venda:"",descricao:"",em_estoque:false,qtd_estoque:0});
  const [savingCat,setSavingCat]=useState(false);

  useEffect(()=>{if(configs)setCfgForm({custo_hora:configs.custo_hora||15,energia_kwh:configs.energia_kwh||0.85,margem_lucro:configs.margem_lucro||50,marketplace:configs.marketplace||0,cartao:configs.cartao||0,nf:configs.nf||0});},[configs]);

  const saveCfg=async()=>{setSavingCfg(true);await onSaveConfigs(cfgForm);setSavingCfg(false);alert("Configurações salvas!");};

  const calcular=()=>{
    const ch=cfgForm.custo_hora||15;const kwh=cfgForm.energia_kwh||0.85;
    let custoFil=0;let consumoTotal=0;
    for(const fu of filUsados){const fil=filamentos.find(f=>f.id===fu.filamento_id);if(fil){const util=(fil.peso_atual||fil.peso_total)-(fil.peso_carretel||0);const cg=util>0?fil.valor_pago/util:0;custoFil+=cg*(parseFloat(fu.consumo_g)||0);consumoTotal+=parseFloat(fu.consumo_g)||0;}}
    const mins=(parseFloat(tempH)||0)*60+(parseFloat(tempM)||0);const hrs=mins/60;
    const custoPrint=hrs*ch;const custoEnergia=hrs*0.2*kwh;const custoMao=(parseFloat(tempoMao)||0)/60*ch;
    let custoInsumos=0;
    for(const iu of insUsados){const ins=insumos.find(x=>x.id===iu.insumo_id);if(ins){const u=ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0;custoInsumos+=u*(parseFloat(iu.quantidade)||0);}}
    const custoProducao=custoFil+custoPrint+custoEnergia+custoMao;
    const custoRetrab=custoProducao*((parseFloat(retrabalho)||0)/100);
    const custoTotal=custoProducao+custoRetrab+custoInsumos;
    const base=custoTotal*(1+(parseFloat(urgencia)||0)/100+(cfgForm.marketplace||0)/100+(cfgForm.cartao||0)/100+(cfgForm.nf||0)/100);
    const mg=parseFloat(margem)||0;const preco=mg<100?base/(1-mg/100):base*2;
    const r={custoFil,custoPrint,custoEnergia,custoMao,custoInsumos,custoTotal,preco,lucro:preco-base};
    setResultado(r);
    setCatForm(f=>({...f,preco_venda:preco.toFixed(2)}));
    return r;
  };

  const recalcular=()=>{if(resultado)calcular();};

  const salvarNoCatalogo=async()=>{
    if(!nome)return alert("Preencha o nome do produto.");
    setSavingCat(true);
    const r=resultado||calcular();
    await onAddCatalogo({
      nome,descricao:catForm.descricao,em_estoque:catForm.em_estoque,qtd_estoque:parseInt(catForm.qtd_estoque)||0,
      preco_venda:parseFloat(catForm.preco_venda)||0,custo_producao:r.custoTotal,
      fotos_urls:"[]",foto_url:"",
      filamentos_usados:JSON.stringify(filUsados),insumos_usados:JSON.stringify(insUsados),
      consumo_g:filUsados.reduce((s,f)=>s+(parseFloat(f.consumo_g)||0),0)
    });
    setSalvarModal(false);
    alert("✅ Produto salvo no catálogo!");
  };

  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Precificação</h1>
    <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Calcule e salve direto no catálogo</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:20}}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <Card C={C}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:C.accent}}>📦 Dados do Produto</h3>
          <Inp C={C} label="Nome do produto" value={nome} onChange={setNome} placeholder="Ex: Chaveiro personalizado..."/>
        </Card>
        <Card C={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>⚙️ Custos Operacionais (fixos)</h3><Btn C={C} onClick={saveCfg} loading={savingCfg} size="sm" icon="check">Salvar</Btn></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp C={C} label="Custo por hora" value={cfgForm.custo_hora} onChange={v=>setCfgForm(f=>({...f,custo_hora:parseFloat(v)||0}))} type="number" prefix="R$" suffix="/h"/>
            <Inp C={C} label="Energia elétrica" value={cfgForm.energia_kwh} onChange={v=>setCfgForm(f=>({...f,energia_kwh:parseFloat(v)||0}))} type="number" prefix="R$" suffix="/kWh"/>
          </div>
        </Card>
        <Card C={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>📊 Margens e Taxas</h3><Btn C={C} onClick={saveCfg} loading={savingCfg} size="sm" icon="check">Salvar</Btn></div>
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>🧵 Filamentos Usados</h3>
            <button onClick={()=>setFilUsados(f=>[...f,{filamento_id:"",consumo_g:""}])} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ Filamento</button>
          </div>
          {filUsados.map((fu,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 110px 32px",gap:8,marginBottom:8,alignItems:"end"}}>
            <Sel C={C} label={i===0?"Filamento":""} value={fu.filamento_id} onChange={v=>{const a=[...filUsados];a[i]={...a[i],filamento_id:v};setFilUsados(a);}} options={[{value:"",label:"— Selecionar —"},...filamentos.map(f=>({value:f.id,label:`${f.marca} ${f.material}${f.cor?" ("+f.cor+")":""}`}))]}/>
            <Inp C={C} label={i===0?"g usados":""} value={fu.consumo_g} onChange={v=>{const a=[...filUsados];a[i]={...a[i],consumo_g:v};setFilUsados(a);}} type="number" suffix="g"/>
            {filUsados.length>1&&<button onClick={()=>setFilUsados(f=>f.filter((_,j)=>j!==i))} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,height:38,cursor:"pointer",color:C.red,fontSize:16}}>✕</button>}
          </div>))}
        </Card>
        {insumos.length>0&&(<Card C={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>✨ Insumos Adicionais</h3>
            <button onClick={()=>setInsUsados(f=>[...f,{insumo_id:"",quantidade:""}])} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ Insumo</button>
          </div>
          {insUsados.map((iu,i)=>(<div key={i} style={{display:"grid",gridTemplateColumns:"1fr 110px 32px",gap:8,marginBottom:8,alignItems:"end"}}>
            <Sel C={C} label={i===0?"Insumo":""} value={iu.insumo_id} onChange={v=>{const a=[...insUsados];a[i]={...a[i],insumo_id:v};setInsUsados(a);}} options={[{value:"",label:"— Selecionar —"},...insumos.map(ins=>({value:ins.id,label:`${ins.nome} (${brl(ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0)}/un)`}))]}/>
            <Inp C={C} label={i===0?"Qtd":""} value={iu.quantidade} onChange={v=>{const a=[...insUsados];a[i]={...a[i],quantidade:v};setInsUsados(a);}} type="number" suffix="un"/>
            <button onClick={()=>setInsUsados(f=>f.filter((_,j)=>j!==i))} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,height:38,cursor:"pointer",color:C.red,fontSize:16}}>✕</button>
          </div>))}
        </Card>)}
        <Card C={C}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:C.accent}}>⏱ Tempo e Mão de Obra</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp C={C} label="Horas impressão" value={tempH} onChange={setTempH} type="number" suffix="h"/>
            <Inp C={C} label="Minutos" value={tempM} onChange={setTempM} type="number" suffix="min"/>
            <Inp C={C} label="Pós-impressão" value={tempoMao} onChange={setTempoMao} type="number" suffix="min"/>
          </div>
        </Card>
        <Card C={C}><h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700,color:C.accent}}>💡 Custos Extras</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp C={C} label="Retrabalho" value={retrabalho} onChange={setRetrabalho} type="number" suffix="%"/>
            <Inp C={C} label="Urgência" value={urgencia} onChange={setUrgencia} type="number" suffix="%"/>
          </div>
        </Card>
        <Btn C={C} onClick={calcular} icon="zap" full size="lg">Calcular Custo de Fabricação</Btn>
      </div>

      <div>
        <Card C={C} style={{position:"sticky",top:20}}>
          <h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:C.text}}>📊 Resultado</h3>
          {resultado?(<>
            {[["Filamento",resultado.custoFil],["Máquina",resultado.custoPrint],["Energia",resultado.custoEnergia],["Mão de obra",resultado.custoMao],["Insumos",resultado.custoInsumos]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.muted}}>{l}</span><span style={{color:C.text}}>{brl(v)}</span></div>))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,fontWeight:700,borderBottom:`1px solid ${C.border}`}}><span style={{color:C.text}}>Custo total</span><span style={{color:C.accent}}>{brl(resultado.custoTotal)}</span></div>
            <div style={{margin:"14px 0 10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:C.muted,fontWeight:600}}>Margem de lucro</span><Badge C={C} color={C.green}>{margem}%</Badge></div>
              <input type="range" min={0} max={200} value={margem} onChange={e=>setMargem(+e.target.value)} onMouseUp={recalcular} onTouchEnd={recalcular} style={{width:"100%",accentColor:C.accent}}/>
            </div>
            <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:12,padding:16,textAlign:"center",marginTop:12}}>
              <div style={{fontSize:11,color:C.accent,fontWeight:600,marginBottom:4}}>PREÇO SUGERIDO</div>
              <div style={{fontSize:30,fontWeight:900,color:C.accent}}>{brl(resultado.preco)}</div>
              <div style={{fontSize:12,color:C.green,marginTop:4}}>Lucro: {brl(resultado.lucro)}</div>
            </div>
            <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:8}}>
              <Btn C={C} onClick={()=>setSalvarModal(true)} icon="box" full variant="success">💾 Salvar no Catálogo</Btn>
            </div>
          </>):(<div style={{textAlign:"center",padding:40,color:C.dim}}><Icon d={IC.tag} size={40} color={C.dim}/><p style={{marginTop:12,fontSize:13}}>Preencha e clique em "Calcular"</p></div>)}
        </Card>
      </div>
    </div>

    {salvarModal&&resultado&&(<Modal C={C} title="Salvar no Catálogo" onClose={()=>setSalvarModal(false)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:10,padding:14,fontSize:13}}>
          <div style={{fontWeight:700,color:C.accent,marginBottom:6}}>📦 {nome||"(sem nome)"}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <div style={{color:C.muted}}>Custo: <strong style={{color:C.text}}>{brl(resultado.custoTotal)}</strong></div>
            <div style={{color:C.muted}}>Margem: <strong style={{color:C.green}}>{margem}%</strong></div>
          </div>
        </div>
        <Inp C={C} label="Preço de venda" value={catForm.preco_venda} onChange={v=>setCatForm(f=>({...f,preco_venda:v}))} type="number" prefix="R$" help="Edite se quiser ajustar o preço sugerido"/>
        <Inp C={C} label="Descrição (medidas, detalhes)" value={catForm.descricao} onChange={v=>setCatForm(f=>({...f,descricao:v}))} placeholder="Ex: 10x5cm, PLA Rosa..."/>
        <div style={{display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="em_est" checked={catForm.em_estoque} onChange={e=>setCatForm(f=>({...f,em_estoque:e.target.checked}))} style={{accentColor:C.accent,width:16,height:16}}/><label htmlFor="em_est" style={{color:C.text,fontSize:14,cursor:"pointer",fontWeight:600}}>Produto em estoque?</label></div>
        {catForm.em_estoque&&<Inp C={C} label="Quantidade em estoque" value={catForm.qtd_estoque} onChange={v=>setCatForm(f=>({...f,qtd_estoque:v}))} type="number" suffix="un"/>}
        <div style={{padding:10,background:"rgba(34,197,94,0.08)",borderRadius:8,fontSize:12,color:C.green}}>
          Lucro: {brl(parseFloat(catForm.preco_venda||0)-resultado.custoTotal)} · Margem real: {catForm.preco_venda>0?((parseFloat(catForm.preco_venda)-resultado.custoTotal)/parseFloat(catForm.preco_venda)*100).toFixed(1):0}%
        </div>
        <div style={{fontSize:11,color:C.muted}}>💡 Você poderá adicionar fotos depois, editando o produto no Catálogo.</div>
        <div style={{display:"flex",gap:10}}>
          <Btn C={C} onClick={salvarNoCatalogo} loading={savingCat} full icon="check">Salvar no Catálogo</Btn>
          <Btn C={C} onClick={()=>setSalvarModal(false)} variant="ghost" full>Cancelar</Btn>
        </div>
      </div>
    </Modal>)}
  </div>);
};


// ── PEDIDOS ────────────────────────────────────────────────────────────────
const Pedidos=({pedidos,clientes,catalogo,onAdd,onUpd,onDel,onUpdEstoque,C,pedidoDetalheInicial,onClearDetalhe})=>{
  const [modal,setModal]=useState(false);const [pedidoVer,setPedidoVer]=useState(pedidoDetalheInicial||null);const [notaModal,setNotaModal]=useState(null);
  const [busca,setBusca]=useState("");const [carrinho,setCarrinho]=useState([]);const [clienteId,setClienteId]=useState("");const [formPag,setFormPag]=useState("pix");const [obs,setObs]=useState("");const [loading,setLoading]=useState(false);const [prodSel,setProdSel]=useState("");const [qtdSel,setQtdSel]=useState(1);
  useEffect(()=>{if(pedidoDetalheInicial){setPedidoVer(pedidoDetalheInicial);onClearDetalhe&&onClearDetalhe();}},[pedidoDetalheInicial]);
  const proximoNumero=(pedidos.length>0?Math.max(...pedidos.map(p=>p.numero||0)):0)+1;
  const totalCarrinho=carrinho.reduce((s,i)=>s+i.subtotal,0);
  const addCarrinho=()=>{const prod=catalogo.find(p=>p.id===prodSel);if(!prod)return;const qtd=parseInt(qtdSel)||1;setCarrinho(c=>{const ex=c.find(x=>x.produto_id===prodSel);if(ex)return c.map(x=>x.produto_id===prodSel?{...x,quantidade:x.quantidade+qtd,subtotal:(x.quantidade+qtd)*x.preco_unit}:x);return[...c,{produto_id:prodSel,nome:prod.nome,quantidade:qtd,preco_unit:prod.preco_venda,subtotal:qtd*prod.preco_venda}];});setProdSel("");setQtdSel(1);};
  const remItem=(pid)=>setCarrinho(c=>c.filter(x=>x.produto_id!==pid));
  const updQtd=(pid,q)=>setCarrinho(c=>c.map(x=>x.produto_id===pid?{...x,quantidade:parseInt(q)||1,subtotal:(parseInt(q)||1)*x.preco_unit}:x));
  const criarPedido=async()=>{if(carrinho.length===0)return alert("Adicione pelo menos um produto.");setLoading(true);const cliente=clientes.find(c=>c.id===clienteId);const pedido={numero:proximoNumero,cliente_id:clienteId||null,cliente_nome:cliente?.nome||"—",total:totalCarrinho,forma_pagamento:formPag,obs,status:"pendente",data:nowDate(),itens:JSON.stringify(carrinho)};await onAdd(pedido);for(const item of carrinho){const prod=catalogo.find(p=>p.id===item.produto_id);if(prod&&prod.em_estoque){await onUpdEstoque(item.produto_id,Math.max(0,(prod.qtd_estoque||0)-item.quantidade));}}setModal(false);setCarrinho([]);setClienteId("");setObs("");setLoading(false);};
  const excluirPedido=async(p)=>{if(!window.confirm("Excluir pedido? Estoque será restaurado."))return;const itens=JSON.parse(p.itens||"[]");for(const item of itens){const prod=catalogo.find(x=>x.id===item.produto_id);if(prod&&prod.em_estoque){await onUpdEstoque(item.produto_id,(prod.qtd_estoque||0)+item.quantidade);}}await onDel(p.id);};
  const filtrados=pedidos.filter(p=>String(p.numero||"").includes(busca)||(p.cliente_nome||"").toLowerCase().includes(busca.toLowerCase()));
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Pedidos</h1></div>
      <Btn C={C} onClick={()=>setModal(true)} icon="plus">Novo Pedido</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar..."/></div>
    {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum pedido</p></Card>:(
      <Card C={C} style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.inputBg}}>{["Nº","Cliente","Data","Total","Pagamento","Status",""].map(h=>(<th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>))}</tr></thead>
          <tbody>{filtrados.map((p,i)=>{const sc=STATUS_COLORS[p.status]||C.accent;return(<tr key={p.id} style={{borderTop:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setPedidoVer(p)} onMouseEnter={e=>e.currentTarget.style.background=C.inputBg} onMouseLeave={e=>e.currentTarget.style.background=""}>
            <td style={{padding:"14px 16px",color:C.accent,fontWeight:800}}>#{p.numero}</td>
            <td style={{padding:"14px 16px",color:C.text,fontWeight:600}}>{p.cliente_nome||"—"}</td>
            <td style={{padding:"14px 16px",color:C.muted,fontSize:13}}>{p.data}</td>
            <td style={{padding:"14px 16px",color:C.accent,fontWeight:700}}>{brl(p.total)}</td>
            <td style={{padding:"14px 16px",color:C.muted,fontSize:13}}>{p.forma_pagamento||"—"}</td>
            <td style={{padding:"14px 16px"}} onClick={e=>e.stopPropagation()}><select value={p.status} onChange={e=>onUpd(p.id,{status:e.target.value})} style={{background:sc+"22",color:sc,border:`1px solid ${sc}44`,borderRadius:6,padding:"4px 8px",fontSize:12,fontWeight:700,fontFamily:"inherit",cursor:"pointer"}}>{STATUS.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
            <td style={{padding:"14px 16px"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:6}}><button onClick={()=>setNotaModal(p)} style={{background:C.accentSoft,border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.accent}}><Icon d={IC.download} size={14}/></button><button onClick={()=>excluirPedido(p)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer"}}><Icon d={IC.trash} size={15}/></button></div></td>
          </tr>);})}
          </tbody>
        </table>
      </Card>
    )}
    {pedidoVer&&(()=>{const itens=JSON.parse(pedidoVer.itens||"[]");const cliente=clientes.find(c=>c.id===pedidoVer.cliente_id);return(<Modal C={C} title={"Pedido #"+pedidoVer.numero} onClose={()=>setPedidoVer(null)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
        <div style={{background:C.inputBg,borderRadius:12,padding:14}}><div style={{fontSize:20,fontWeight:900,color:C.accent,marginBottom:8}}>#{pedidoVer.numero}</div><div style={{fontSize:13,color:C.text}}><span style={{color:C.muted}}>Data: </span>{pedidoVer.data}</div><div style={{fontSize:13,color:C.text}}><span style={{color:C.muted}}>Pagamento: </span>{pedidoVer.forma_pagamento||"—"}</div><div style={{marginTop:8}}><Badge C={C} color={STATUS_COLORS[pedidoVer.status]||C.yellow}>{pedidoVer.status}</Badge></div></div>
        <div style={{background:C.inputBg,borderRadius:12,padding:14}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>{cliente?.nome||pedidoVer.cliente_nome||"—"}</div>{pedidoVer.cliente_whatsapp&&<div style={{fontSize:13,color:C.muted,marginTop:4}}>📱 {pedidoVer.cliente_whatsapp}</div>}{pedidoVer.cliente_email&&<div style={{fontSize:13,color:C.muted}}>📧 {pedidoVer.cliente_email}</div>}</div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}><thead><tr style={{background:C.inputBg}}>{["Produto","Qtd","Preço","Subtotal"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead><tbody>{itens.map((item,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"10px 12px",color:C.text,fontWeight:600}}>{item.nome}</td><td style={{padding:"10px 12px",color:C.text}}>{item.quantidade}</td><td style={{padding:"10px 12px",color:C.text}}>{brl(item.preco_unit)}</td><td style={{padding:"10px 12px",color:C.accent,fontWeight:700}}>{brl(item.subtotal)}</td></tr>))}</tbody></table>
      <div style={{display:"flex",justifyContent:"space-between",padding:14,background:C.accentSoft,borderRadius:12}}><span style={{fontWeight:700,color:C.text}}>Total</span><span style={{fontWeight:900,color:C.accent,fontSize:20}}>{brl(pedidoVer.total)}</span></div>
      {pedidoVer.obs&&<div style={{marginTop:10,padding:10,background:C.inputBg,borderRadius:8,fontSize:13,color:C.muted}}>📝 {pedidoVer.obs}</div>}
      <div style={{display:"flex",gap:10,marginTop:18}}><Btn C={C} onClick={()=>{setNotaModal(pedidoVer);setPedidoVer(null);}} icon="download" full>Gerar Nota</Btn><Btn C={C} onClick={()=>setPedidoVer(null)} variant="ghost" full>Fechar</Btn></div>
    </Modal>);})()}
    {notaModal&&(()=>{const itens=JSON.parse(notaModal.itens||"[]");return(<Modal C={C} title={"Nota #"+notaModal.numero} onClose={()=>setNotaModal(null)} wide>
      <div style={{textAlign:"center",marginBottom:18}}><img src={LOGO} style={{width:56,height:56,objectFit:"contain"}}/><h2 style={{color:C.text,margin:"8px 0 2px"}}>Itsuki Lab</h2></div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:14}}><thead><tr style={{background:C.inputBg}}>{["Produto","Qtd","Preço","Subtotal"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead><tbody>{itens.map((item,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"10px 12px",color:C.text}}>{item.nome}</td><td style={{padding:"10px 12px",color:C.text}}>{item.quantidade}</td><td style={{padding:"10px 12px",color:C.text}}>{brl(item.preco_unit)}</td><td style={{padding:"10px 12px",color:C.accent,fontWeight:700}}>{brl(item.subtotal)}</td></tr>))}</tbody></table>
      <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:12,padding:"12px 20px",textAlign:"right"}}><div style={{fontSize:12,color:C.muted}}>Total</div><div style={{fontSize:26,fontWeight:900,color:C.accent}}>{brl(notaModal.total)}</div></div></div>
      <div style={{display:"flex",gap:10,marginTop:18}}><Btn C={C} onClick={()=>window.print()} icon="download" full>Imprimir / PDF</Btn><Btn C={C} onClick={()=>setNotaModal(null)} variant="ghost" full>Fechar</Btn></div>
    </Modal>);})()}
    {modal&&(<Modal C={C} title={"Novo Pedido #"+proximoNumero} onClose={()=>setModal(false)} wider>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:10,padding:"10px 14px",fontSize:20,fontWeight:900,color:C.accent}}>#{proximoNumero}</div>
          <Sel C={C} label="Cliente" value={clienteId} onChange={setClienteId} options={[{value:"",label:"— Sem cliente —"},...clientes.map(c=>({value:c.id,label:c.nome}))]}/>
          <Sel C={C} label="Forma de Pagamento" value={formPag} onChange={setFormPag} options={PAGAMENTO.map(p=>({value:p,label:p.charAt(0).toUpperCase()+p.slice(1)}))}/>
          <Inp C={C} label="Observações" value={obs} onChange={setObs} placeholder="..."/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontSize:13,fontWeight:700,color:C.accent}}>🛒 Itens</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{flex:1}}><Sel C={C} label="Produto" value={prodSel} onChange={setProdSel} options={[{value:"",label:"— Selecionar —"},...catalogo.filter(p=>p.em_estoque&&(p.qtd_estoque||0)>0).map(p=>({value:p.id,label:p.nome+" ("+p.qtd_estoque+" un)"}))]}/></div>
            <div style={{width:68}}><Inp C={C} label="Qtd" value={qtdSel} onChange={setQtdSel} type="number"/></div>
            <Btn C={C} onClick={addCarrinho} icon="plus" disabled={!prodSel}>Add</Btn>
          </div>
          {carrinho.length===0?<div style={{textAlign:"center",padding:20,color:C.dim,background:C.inputBg,borderRadius:10,fontSize:13}}>Nenhum item</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {carrinho.map(item=>(<div key={item.produto_id} style={{display:"flex",alignItems:"center",gap:8,background:C.inputBg,borderRadius:9,padding:"9px 12px"}}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.text}}>{item.nome}</div><div style={{fontSize:11,color:C.muted}}>{brl(item.preco_unit)}/un</div></div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <button onClick={()=>updQtd(item.produto_id,Math.max(1,item.quantidade-1))} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,width:26,height:26,cursor:"pointer",color:C.text,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{minWidth:22,textAlign:"center",fontWeight:700,color:C.text}}>{item.quantidade}</span>
                  <button onClick={()=>updQtd(item.produto_id,item.quantidade+1)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,width:26,height:26,cursor:"pointer",color:C.text,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                <div style={{minWidth:65,textAlign:"right",fontWeight:700,color:C.accent,fontSize:13}}>{brl(item.subtotal)}</div>
                <button onClick={()=>remItem(item.produto_id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer"}}><Icon d={IC.trash} size={13}/></button>
              </div>))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 12px",background:C.accentSoft,borderRadius:9}}><span style={{fontWeight:700,color:C.text}}>Total</span><span style={{fontWeight:900,color:C.accent,fontSize:17}}>{brl(totalCarrinho)}</span></div>
            </div>
          )}
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:18}}><Btn C={C} onClick={criarPedido} loading={loading} full icon="check">Criar Pedido #{proximoNumero}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
    </Modal>)}
  </div>);
};

// ── CLIENTES ───────────────────────────────────────────────────────────────
const Clientes=({clientes,pedidos,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false);const [editando,setEditando]=useState(null);const [detalhe,setDetalhe]=useState(null);const [busca,setBusca]=useState("");const [loading,setLoading]=useState(false);
  const empty={nome:"",email:"",tel:"",cidade:"",obs:""};const [form,setForm]=useState(empty);const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const abrir=(item=null)=>{setEditando(item);setForm(item?{nome:item.nome||"",email:item.email||"",tel:item.tel||"",cidade:item.cidade||"",obs:item.obs||""}:empty);setModal(true);};
  const salvar=async()=>{if(!form.nome)return;setLoading(true);editando?await onUpd(editando.id,form):await onAdd(form);setModal(false);setLoading(false);};
  const filtrados=clientes.filter(c=>c.nome?.toLowerCase().includes(busca.toLowerCase()));
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Clientes</h1></div>
      <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Cliente</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar..."/></div>
    {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum cliente</p></Card>:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {filtrados.map(c=>{
          const ps=pedidos.filter(p=>p.cliente_id===c.id);const totalGasto=ps.reduce((s,p)=>s+(p.total||0),0);
          return(<Card C={C} key={c.id} onClick={()=>setDetalhe(c)} style={{cursor:"pointer",transition:"transform .15s,box-shadow .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${C.accentGlow}`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{background:C.accentSoft,color:C.accent,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18}}>{c.nome[0].toUpperCase()}</div>
              <div style={{display:"flex",gap:5}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>abrir(c)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 7px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={13}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(c.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:7,padding:"5px 7px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={13}/></button>
              </div>
            </div>
            <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:3}}>{c.nome}</div>
            {c.email&&<div style={{fontSize:12,color:C.muted}}>{c.email}</div>}
            {c.tel&&<div style={{fontSize:12,color:C.muted}}>{c.tel}</div>}
            {c.cidade&&<div style={{fontSize:12,color:C.muted}}>{c.cidade}</div>}
            {c.obs&&<div style={{fontSize:12,color:C.yellow,marginTop:6,padding:"5px 8px",background:"rgba(245,158,11,0.08)",borderRadius:6}}>📝 {c.obs}</div>}
            <div style={{display:"flex",gap:7,marginTop:10,flexWrap:"wrap"}}>
              <Badge C={C} color={C.blue}>{ps.length} pedido{ps.length!==1?"s":""}</Badge>
              <Badge C={C} color={C.green}>{brl(totalGasto)}</Badge>
            </div>
            <div style={{fontSize:11,color:C.accent,marginTop:8,display:"flex",alignItems:"center",gap:4}}>Ver histórico <Icon d={IC.arrowright} size={11} color={C.accent}/></div>
          </Card>);
        })}
      </div>
    )}
    {detalhe&&(()=>{const ps=pedidos.filter(p=>p.cliente_id===detalhe.id);const total=ps.reduce((s,p)=>s+(p.total||0),0);
      return(<Modal C={C} title={"Histórico — "+detalhe.nome} onClose={()=>setDetalhe(null)} wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:18}}>
          {[["Pedidos",ps.length,C.accent],["Total gasto",brl(total),C.green],["Ticket médio",brl(ps.length>0?total/ps.length:0),C.blue]].map(([l,v,col])=>(<div key={l} style={{background:C.inputBg,borderRadius:10,padding:13,textAlign:"center"}}><div style={{fontSize:11,color:C.muted,marginBottom:4}}>{l}</div><div style={{fontSize:19,fontWeight:800,color:col}}>{v}</div></div>))}
        </div>
        {ps.length===0?<p style={{color:C.dim,fontSize:13,textAlign:"center"}}>Nenhum pedido</p>:(
          <div style={{display:"flex",flexDirection:"column",gap:9}}>
            {ps.map(p=>{const itens=JSON.parse(p.itens||"[]");return(<div key={p.id} style={{background:C.inputBg,borderRadius:11,padding:13}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>
                <div><span style={{fontWeight:800,color:C.accent}}>#{p.numero}</span><span style={{fontSize:12,color:C.muted,marginLeft:7}}>{p.data}</span></div>
                <div style={{display:"flex",gap:7,alignItems:"center"}}><Badge C={C} color={STATUS_COLORS[p.status]||C.yellow}>{p.status}</Badge><span style={{fontWeight:700,color:C.accent}}>{brl(p.total)}</span></div>
              </div>
              <div style={{fontSize:12,color:C.muted}}>{itens.map((it,i)=><span key={i}>{it.nome} x{it.quantidade}{i<itens.length-1?", ":""}</span>)}</div>
              <div style={{fontSize:11,color:C.dim,marginTop:3}}>💳 {p.forma_pagamento||"—"}</div>
            </div>);})}
          </div>
        )}
      </Modal>);
    })()}
    {modal&&(<Modal C={C} title={editando?"Editar Cliente":"Novo Cliente"} onClose={()=>setModal(false)}>
      <div style={{display:"grid",gap:13}}>
        <Inp C={C} label="Nome completo" value={form.nome} onChange={v=>sf("nome",v)}/>
        <Inp C={C} label="Email" value={form.email} onChange={v=>sf("email",v)} type="email"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:13}}><Inp C={C} label="Telefone" value={form.tel} onChange={v=>sf("tel",v)}/><Inp C={C} label="Cidade" value={form.cidade} onChange={v=>sf("cidade",v)}/></div>
        <Inp C={C} label="Observações" value={form.obs} onChange={v=>sf("obs",v)} placeholder="Ex: prefere Pix..."/>
        <div style={{display:"flex",gap:10}}><Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Cadastrar"}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
      </div>
    </Modal>)}
  </div>);
};

// ── FINANCEIRO + CONFIGS ───────────────────────────────────────────────────
const Financeiro=({pedidos,C})=>{
  const pagos=pedidos.filter(p=>p.status==="pago"||p.status==="entregue");
  const receita=pagos.reduce((s,p)=>s+(p.total||0),0);
  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:24}}>Financeiro</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:22}}>
      <StatCard C={C} label="Receita Total" value={brl(receita)} color={C.green} icon="dollar"/>
      <StatCard C={C} label="Pedidos Pagos" value={pagos.length} color={C.blue} icon="printer"/>
      <StatCard C={C} label="Ticket Médio" value={brl(pagos.length>0?receita/pagos.length:0)} color={C.accent} icon="chart"/>
    </div>
    <Card C={C}><h3 style={{margin:"0 0 16px",fontSize:15,fontWeight:700,color:C.text}}>Pedidos Finalizados</h3>
      {pagos.length===0?<p style={{color:C.dim,fontSize:13}}>Nenhum</p>:(
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["#","Cliente","Data","Pagamento","Status","Total"].map(h=>(<th key={h} style={{padding:"9px 0",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead>
          <tbody>{pagos.map(p=>(<tr key={p.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"11px 0",color:C.accent,fontWeight:700}}>#{p.numero}</td><td style={{padding:"11px 0",color:C.text,fontWeight:600}}>{p.cliente_nome||"—"}</td><td style={{padding:"11px 0",color:C.muted,fontSize:13}}>{p.data}</td><td style={{padding:"11px 0",color:C.muted,fontSize:13}}>{p.forma_pagamento||"—"}</td><td style={{padding:"11px 0"}}><Badge C={C} color={STATUS_COLORS[p.status]||C.green}>{p.status}</Badge></td><td style={{padding:"11px 0",color:C.accent,fontWeight:700}}>{brl(p.total)}</td></tr>))}</tbody>
        </table>
      )}
    </Card>
  </div>);
};

const Configs=({user,C})=>{
  const [nome,setNome]=useState(user?.user_metadata?.nome||"");const [cel,setCel]=useState(user?.user_metadata?.cel||"");
  const [loading,setLoading]=useState(false);const [msg,setMsg]=useState({text:"",ok:false});
  const salvar=async()=>{setLoading(true);const {error}=await supabase.auth.updateUser({data:{nome,cel}});setMsg({text:error?"Erro.":"Dados salvos!",ok:!error});setLoading(false);};
  const recuperarSenha=async()=>{const {error}=await supabase.auth.resetPasswordForEmail(user.email,{redirectTo:window.location.origin});setMsg({text:error?"Erro.":"Email enviado! Verifique sua caixa.",ok:!error});};
  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:24}}>Configurações</h1>
    <div style={{display:"grid",gap:14,maxWidth:500}}>
      <Card C={C}><h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>👤 Seus Dados</h3>
        <div style={{display:"grid",gap:13}}><Inp C={C} label="Nome" value={nome} onChange={setNome}/><Inp C={C} label="Celular" value={cel} onChange={setCel}/><Inp C={C} label="Email" value={user?.email||""} readOnly/></div>
        {msg.text&&<div style={{marginTop:11,background:msg.ok?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:msg.ok?C.green:C.red,padding:10,borderRadius:8,fontSize:13}}>{msg.text}</div>}
        <div style={{marginTop:14}}><Btn C={C} onClick={salvar} loading={loading} icon="check" full>Salvar</Btn></div>
      </Card>
      <Card C={C}><h3 style={{margin:"0 0 11px",fontSize:14,fontWeight:700,color:C.accent}}>🔑 Segurança</h3>
        <p style={{fontSize:13,color:C.muted,marginBottom:13}}>Receba email para redefinir sua senha.</p>
        <Btn C={C} onClick={recuperarSenha} variant="ghost" icon="key" full>Enviar email de recuperação</Btn>
      </Card>
    </div>
  </div>);
};


// ── FILAMENTOS ─────────────────────────────────────────────────────────────
const Filamentos=({filamentos,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false); const [editando,setEditando]=useState(null);
  const [loading,setLoading]=useState(false); const [fp,setFp]=useState(null); const [ff,setFf]=useState(null);
  const empty={marca:"",material:"PLA",cor:"",peso_total:1000,peso_atual:"",peso_carretel:200,valor_pago:"",foto_url:""};
  const [form,setForm]=useState(empty); const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const pu=parseFloat(form.peso_atual||form.peso_total||0)-parseFloat(form.peso_carretel||0);
  const abrir=(item=null)=>{setEditando(item);setForm(item?{marca:item.marca||"",material:item.material||"PLA",cor:item.cor||"",peso_total:item.peso_total||1000,peso_atual:item.peso_atual||"",peso_carretel:item.peso_carretel??200,valor_pago:item.valor_pago||"",foto_url:item.foto_url||""}:empty);setFp(item?.foto_url||null);setFf(null);setModal(true);};
  const hf=(e)=>{const file=e.target.files[0];if(!file)return;setFf(file);const r=new FileReader();r.onload=ev=>setFp(ev.target.result);r.readAsDataURL(file);};
  const salvar=async()=>{
    if(!form.marca||!form.valor_pago)return alert("Preencha marca e valor.");
    setLoading(true);
    let foto_url=form.foto_url;
    if(ff){const ext=ff.name.split(".").pop();const path=`filamentos/${Date.now()}.${ext}`;const {error}=await supabase.storage.from("fotos").upload(path,ff,{upsert:true});if(!error){const {data}=supabase.storage.from("fotos").getPublicUrl(path);foto_url=data.publicUrl;}}
    const payload={...form,foto_url,peso_total:parseFloat(form.peso_total),peso_atual:parseFloat(form.peso_atual)||parseFloat(form.peso_total),peso_carretel:parseFloat(form.peso_carretel)||0,valor_pago:parseFloat(form.valor_pago)};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false);setLoading(false);
  };
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Filamentos</h1><p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Gerencie seu estoque</p></div>
      <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Filamento</Btn>
    </div>
    {filamentos.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum filamento</p></Card>:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {filamentos.map(f=>{
          const pa=f.peso_atual||f.peso_total; const car=f.peso_carretel||0; const util=pa-car;
          const pct=Math.max(0,Math.min(100,(util/f.peso_total)*100)); const cg=util>0?f.valor_pago/util:0;
          return(<Card C={C} key={f.id}>
            {f.foto_url&&(<div style={{margin:"-20px -20px 16px",borderRadius:"14px 14px 0 0",overflow:"hidden",height:160,position:"relative"}}>
              <img src={f.foto_url} alt={f.cor||f.marca} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(0,0,0,0.5))"}}/>
              <div style={{position:"absolute",bottom:10,left:12,display:"flex",gap:6}}><Badge C={C} color={C.blue}>{f.material}</Badge>{f.cor&&<Badge C={C} color="rgba(255,255,255,0.9)">{f.cor}</Badge>}</div>
              <div style={{position:"absolute",top:8,right:8,display:"flex",gap:6}}>
                <button onClick={()=>abrir(f)} style={{background:"rgba(0,0,0,.6)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"#fff"}}><Icon d={IC.edit} size={14}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(f.id);}} style={{background:"rgba(239,68,68,.7)",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:"#fff"}}><Icon d={IC.trash} size={14}/></button>
              </div>
            </div>)}
            {!f.foto_url&&(<div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
              <div><div style={{fontWeight:700,color:C.text,fontSize:15}}>{f.marca}</div><div style={{display:"flex",gap:6,marginTop:4}}><Badge C={C} color={C.blue}>{f.material}</Badge>{f.cor&&<Badge C={C} color={C.muted}>{f.cor}</Badge>}</div></div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>abrir(f)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={14}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(f.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={14}/></button>
              </div>
            </div>)}
            {f.foto_url&&<div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:12}}>{f.marca}</div>}
            <div style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.muted,marginBottom:6}}><span>Útil: <strong style={{color:util>100?C.green:util>0?C.yellow:C.red}}>{util.toFixed(0)}g</strong></span><span>{pct.toFixed(0)}%</span></div>
              <div style={{height:8,background:C.inputBg,borderRadius:4}}><div style={{height:"100%",width:`${pct}%`,background:pct>50?C.green:pct>20?C.yellow:C.red,borderRadius:4}}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12}}>
              {[["Total",f.peso_total+"g"],["Carretel",car+"g"],["Custo/g",brl(cg)]].map(([l,v])=>(<div key={l} style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>{l}</div><div style={{fontWeight:700,color:C.text}}>{v}</div></div>))}
            </div>
          </Card>);
        })}
      </div>
    )}
    {modal&&(<Modal C={C} title={editando?"Editar Filamento":"Novo Filamento"} onClose={()=>setModal(false)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:16}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>Foto do Filamento</label>
          <label style={{display:"block",cursor:"pointer"}}>
            <input type="file" accept="image/*" capture="environment" onChange={hf} style={{display:"none"}}/>
            {fp?<img src={fp} style={{width:"100%",height:180,objectFit:"cover",borderRadius:12,border:`2px solid ${C.accent}`}}/>:<div style={{width:"100%",height:180,background:C.inputBg,border:`2px dashed ${C.border}`,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,color:C.muted}}><Icon d={IC.camera} size={28} color={C.muted}/><span style={{fontSize:13}}>Foto do rolo</span></div>}
          </label>
          {fp&&<button onClick={()=>{setFp(null);setFf(null);sf("foto_url","");}} style={{marginTop:8,background:"none",border:"none",color:C.red,fontSize:12,cursor:"pointer"}}>Remover</button>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp C={C} label="Marca" value={form.marca} onChange={v=>sf("marca",v)} placeholder="Ex: Esun..."/>
          <Sel C={C} label="Material" value={form.material} onChange={v=>sf("material",v)} options={MATERIAIS.map(m=>({value:m,label:m}))}/>
          <Inp C={C} label="Cor" value={form.cor} onChange={v=>sf("cor",v)} placeholder="Ex: Silk Rosa..."/>
        </div>
      </div>
      <div style={{padding:14,background:C.inputBg,borderRadius:10,marginBottom:14}}>
        <div style={{fontSize:12,fontWeight:700,color:C.accent,marginBottom:12}}>⚖️ Pesos</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <Inp C={C} label="Peso total (novo)" value={form.peso_total} onChange={v=>sf("peso_total",v)} type="number" suffix="g"/>
          <Inp C={C} label="Peso atual" value={form.peso_atual} onChange={v=>sf("peso_atual",v)} type="number" suffix="g" help="Pese agora"/>
          <Inp C={C} label="Carretel vazio" value={form.peso_carretel} onChange={v=>sf("peso_carretel",v)} type="number" suffix="g"/>
        </div>
        <div style={{marginTop:10,padding:10,background:C.card,borderRadius:8,fontSize:13}}><span style={{color:C.muted}}>Útil: </span><strong style={{color:pu>0?C.green:C.red}}>{pu.toFixed(0)}g</strong></div>
      </div>
      <Inp C={C} label="Valor pago pelo rolo" value={form.valor_pago} onChange={v=>sf("valor_pago",v)} type="number" prefix="R$"/>
      <div style={{display:"flex",gap:10,marginTop:16}}><Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Adicionar"}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
    </Modal>)}
  </div>);
};

// ── INSUMOS ────────────────────────────────────────────────────────────────
const Insumos=({insumos,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false); const [editando,setEditando]=useState(null);
  const [loading,setLoading]=useState(false); const [fp,setFp]=useState(null); const [ff,setFf]=useState(null);
  const empty={nome:"",descricao:"",valor_pago:"",qtd_total:"",foto_url:""};
  const [form,setForm]=useState(empty); const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const abrir=(item=null)=>{setEditando(item);setForm(item?{nome:item.nome||"",descricao:item.descricao||"",valor_pago:item.valor_pago||"",qtd_total:item.qtd_total||"",foto_url:item.foto_url||""}:empty);setFp(item?.foto_url||null);setFf(null);setModal(true);};
  const hf=(e)=>{const file=e.target.files[0];if(!file)return;setFf(file);const r=new FileReader();r.onload=ev=>setFp(ev.target.result);r.readAsDataURL(file);};
  const salvar=async()=>{
    if(!form.nome||!form.valor_pago||!form.qtd_total)return alert("Preencha todos os campos.");
    setLoading(true);
    let foto_url=form.foto_url;
    if(ff){const ext=ff.name.split(".").pop();const path=`insumos/${Date.now()}.${ext}`;const {error}=await supabase.storage.from("fotos").upload(path,ff,{upsert:true});if(!error){const {data}=supabase.storage.from("fotos").getPublicUrl(path);foto_url=data.publicUrl;}}
    const payload={...form,foto_url,valor_pago:parseFloat(form.valor_pago)||0,qtd_total:parseFloat(form.qtd_total)||0};
    editando?await onUpd(editando.id,payload):await onAdd(payload);
    setModal(false);setLoading(false);
  };
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Insumos</h1><p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Argolas, imãs, correntes e outros adicionais</p></div>
      <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Insumo</Btn>
    </div>
    {insumos.length===0?(<Card C={C} style={{textAlign:"center",padding:60}}>
      <div style={{fontSize:40,marginBottom:12}}>✨</div>
      <p style={{color:C.dim,marginBottom:16}}>Cadastre argolas, correntes, imãs...</p>
      <Btn C={C} onClick={()=>abrir()} icon="plus" size="sm">Adicionar</Btn>
    </Card>):(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:16}}>
        {insumos.map(ins=>{
          const unit=ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0;
          return(<Card C={C} key={ins.id}>
            {ins.foto_url&&<img src={ins.foto_url} alt={ins.nome} style={{width:"100%",height:140,objectFit:"cover",borderRadius:10,marginBottom:12}}/>}
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
              <div><div style={{fontWeight:700,color:C.text,fontSize:15}}>{ins.nome}</div>{ins.descricao&&<div style={{fontSize:12,color:C.muted,marginTop:2}}>{ins.descricao}</div>}</div>
              <div style={{display:"flex",gap:6}}>
                <button onClick={()=>abrir(ins)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={14}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(ins.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={14}/></button>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:12}}>
              {[["Valor pago",brl(ins.valor_pago)],["Qtd total",ins.qtd_total+" un"],["Custo/un",brl(unit)]].map(([l,v])=>(<div key={l} style={{background:C.inputBg,borderRadius:8,padding:8}}><div style={{color:C.muted}}>{l}</div><div style={{fontWeight:700,color:C.text}}>{v}</div></div>))}
            </div>
          </Card>);
        })}
      </div>
    )}
    {modal&&(<Modal C={C} title={editando?"Editar Insumo":"Novo Insumo"} onClose={()=>setModal(false)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em",display:"block",marginBottom:8}}>Foto</label>
          <label style={{display:"block",cursor:"pointer"}}>
            <input type="file" accept="image/*" capture="environment" onChange={hf} style={{display:"none"}}/>
            {fp?<img src={fp} style={{width:"100%",height:180,objectFit:"cover",borderRadius:12,border:`2px solid ${C.accent}`}}/>:<div style={{width:"100%",height:180,background:C.inputBg,border:`2px dashed ${C.border}`,borderRadius:12,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,color:C.muted}}><Icon d={IC.camera} size={28} color={C.muted}/><span style={{fontSize:13}}>Foto do item</span></div>}
          </label>
          {fp&&<button onClick={()=>{setFp(null);setFf(null);sf("foto_url","");}} style={{marginTop:8,background:"none",border:"none",color:C.red,fontSize:12,cursor:"pointer"}}>Remover</button>}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Inp C={C} label="Nome" value={form.nome} onChange={v=>sf("nome",v)} placeholder="Ex: Argola de chaveiro"/>
          <Inp C={C} label="Descrição" value={form.descricao} onChange={v=>sf("descricao",v)} placeholder="Tamanho, cor..."/>
          <Inp C={C} label="Valor pago (pacote)" value={form.valor_pago} onChange={v=>sf("valor_pago",v)} type="number" prefix="R$"/>
          <Inp C={C} label="Quantidade no pacote" value={form.qtd_total} onChange={v=>sf("qtd_total",v)} type="number" suffix="un"/>
          {form.valor_pago&&form.qtd_total&&(<div style={{padding:10,background:C.accentSoft,borderRadius:8,fontSize:13}}><span style={{color:C.muted}}>Custo unitário: </span><strong style={{color:C.accent}}>{brl(parseFloat(form.valor_pago)/parseFloat(form.qtd_total))}</strong></div>)}
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:16}}><Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Adicionar"}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
    </Modal>)}
  </div>);
};


// ── PRECIFICAÇÃO ───────────────────────────────────────────────────────────
const Orcamento=({filamentos,insumos,configs,onSaveConfigs,onAddCatalogo,C,setPage})=>{
  const [nome,setNome]=useState("");
  const [descricao,setDescricao]=useState("");
  const [filUsados,setFilUsados]=useState([{filamento_id:"",consumo_g:""}]);
  const [insUsados,setInsUsados]=useState([]);
  const [tempH,setTempH]=useState(0); const [tempM,setTempM]=useState(0);
  const [tempoMao,setTempoMao]=useState(0);
  const [retrabalho,setRetrabalho]=useState(0); const [urgencia,setUrgencia]=useState(0);
  const [margem,setMargem]=useState(configs?.margem_lucro||50);
  const [resultado,setResultado]=useState(null);
  const [salvandoCatalogo,setSalvandoCatalogo]=useState(false);
  const [modalCatalogo,setModalCatalogo]=useState(false);
  const [emEstoque,setEmEstoque]=useState(false); const [qtdEstoque,setQtdEstoque]=useState(1);
  const [precoVenda,setPrecoVenda]=useState("");
  const [cfgForm,setCfgForm]=useState({custo_hora:configs?.custo_hora||15,energia_kwh:configs?.energia_kwh||0.85,margem_lucro:configs?.margem_lucro||50,marketplace:configs?.marketplace||0,cartao:configs?.cartao||0,nf:configs?.nf||0});
  const [savingCfg,setSavingCfg]=useState(false);

  useEffect(()=>{if(configs)setCfgForm({custo_hora:configs.custo_hora||15,energia_kwh:configs.energia_kwh||0.85,margem_lucro:configs.margem_lucro||50,marketplace:configs.marketplace||0,cartao:configs.cartao||0,nf:configs.nf||0});},[configs]);

  const saveCfg=async()=>{setSavingCfg(true);await onSaveConfigs(cfgForm);setSavingCfg(false);alert("Configurações salvas!");};

  const calcular=()=>{
    const ch=cfgForm.custo_hora||15; const kwh=cfgForm.energia_kwh||0.85;
    let cf=0,cg_total=0;
    for(const fu of filUsados){const fil=filamentos.find(f=>f.id===fu.filamento_id);if(fil){const u=(fil.peso_atual||fil.peso_total)-(fil.peso_carretel||0);const cg=u>0?fil.valor_pago/u:0;cf+=cg*(parseFloat(fu.consumo_g)||0);cg_total+=parseFloat(fu.consumo_g)||0;}}
    const mins=(parseFloat(tempH)||0)*60+(parseFloat(tempM)||0);
    const hrs=mins/60; const cm_print=hrs*ch; const ce=hrs*0.2*kwh; const cm_mao=(parseFloat(tempoMao)||0)/60*ch;
    let ci=0;
    for(const iu of insUsados){const ins=insumos.find(x=>x.id===iu.insumo_id);if(ins){const u=ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0;ci+=u*(parseFloat(iu.quantidade)||0);}}
    const cp=cf+cm_print+ce+cm_mao;
    const cr=cp*((parseFloat(retrabalho)||0)/100);
    const ct=cp+cr+ci;
    const base=ct*(1+(parseFloat(urgencia)||0)/100+(cfgForm.marketplace||0)/100+(cfgForm.cartao||0)/100+(cfgForm.nf||0)/100);
    const mg=parseFloat(margem)||0; const preco=mg<100?base/(1-mg/100):base*2;
    const res={cf,cm_print,ce,cm_mao,ci,ct,preco,lucro:preco-base};
    setResultado(res);
    setPrecoVenda(preco.toFixed(2));
    return res;
  };

  const calcularComMargem=(m)=>{setMargem(m);};
  const calcularAoSoltar=()=>calcular();

  const salvarNoCatalogo=async()=>{
    if(!nome)return alert("Preencha o nome do produto.");
    setSalvandoCatalogo(true);
    const r=resultado||calcular();
    const payload={
      nome,descricao,em_estoque:emEstoque,qtd_estoque:parseInt(qtdEstoque)||0,
      preco_venda:parseFloat(precoVenda)||r.preco,
      fotos_urls:"[]",foto_url:"",
      filamentos_usados:JSON.stringify(filUsados),
      insumos_usados:JSON.stringify(insUsados),
      custo_producao:r.ct,
      consumo_g:filUsados.reduce((s,f)=>s+(parseFloat(f.consumo_g)||0),0),
    };
    await onAddCatalogo(payload);
    setSalvandoCatalogo(false);
    setModalCatalogo(false);
    alert("Produto salvo no catálogo! Acesse a aba Catálogo para adicionar fotos.");
    setPage("catalogo");
  };

  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:6}}>Precificação</h1>
    <p style={{color:C.muted,marginBottom:24,fontSize:14}}>Calcule custos e envie direto para o catálogo</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:20}}>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>

        <Card C={C}>
          <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>📦 Dados do Produto</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            <Inp C={C} label="Nome do produto" value={nome} onChange={setNome} placeholder="Ex: Chaveiro personalizado..."/>
            <Inp C={C} label="Descrição (medidas, detalhes)" value={descricao} onChange={setDescricao} placeholder="Ex: 5x3cm, PLA, com argola..."/>
          </div>
        </Card>

        <Card C={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>⚙️ Custos Operacionais (fixos)</h3>
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
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>🧵 Filamentos</h3>
            <button onClick={()=>setFilUsados(f=>[...f,{filamento_id:"",consumo_g:""}])} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ Filamento</button>
          </div>
          {filUsados.map((fu,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 120px 32px",gap:8,marginBottom:8,alignItems:"end"}}>
              <Sel C={C} label={i===0?"Filamento":""} value={fu.filamento_id} onChange={v=>{const a=[...filUsados];a[i]={...a[i],filamento_id:v};setFilUsados(a);}} options={[{value:"",label:"— Selecionar —"},...filamentos.map(f=>({value:f.id,label:`${f.marca} ${f.material}${f.cor?" ("+f.cor+")":""}`}))]}/>
              <Inp C={C} label={i===0?"Consumo":""} value={fu.consumo_g} onChange={v=>{const a=[...filUsados];a[i]={...a[i],consumo_g:v};setFilUsados(a);}} type="number" suffix="g"/>
              {filUsados.length>1&&<button onClick={()=>setFilUsados(f=>f.filter((_,j)=>j!==i))} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,height:38,cursor:"pointer",color:C.red}}>✕</button>}
            </div>
          ))}
        </Card>

        {insumos.length>0&&(<Card C={C}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <h3 style={{margin:0,fontSize:14,fontWeight:700,color:C.accent}}>✨ Insumos Adicionais</h3>
            <button onClick={()=>setInsUsados(f=>[...f,{insumo_id:"",quantidade:""}])} style={{background:C.accent,color:"#fff",border:"none",borderRadius:8,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:600}}>+ Insumo</button>
          </div>
          {insUsados.map((iu,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 120px 32px",gap:8,marginBottom:8,alignItems:"end"}}>
              <Sel C={C} label={i===0?"Insumo":""} value={iu.insumo_id} onChange={v=>{const a=[...insUsados];a[i]={...a[i],insumo_id:v};setInsUsados(a);}} options={[{value:"",label:"— Selecionar —"},...insumos.map(ins=>({value:ins.id,label:`${ins.nome} (${brl(ins.qtd_total>0?ins.valor_pago/ins.qtd_total:0)}/un)`}))]}/>
              <Inp C={C} label={i===0?"Qtd":""} value={iu.quantidade} onChange={v=>{const a=[...insUsados];a[i]={...a[i],quantidade:v};setInsUsados(a);}} type="number" suffix="un"/>
              <button onClick={()=>setInsUsados(f=>f.filter((_,j)=>j!==i))} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,height:38,cursor:"pointer",color:C.red}}>✕</button>
            </div>
          ))}
        </Card>)}

        <Card C={C}>
          <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>⏱ Tempo e Mão de Obra</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Inp C={C} label="Horas impressão" value={tempH} onChange={setTempH} type="number" suffix="h"/>
            <Inp C={C} label="Minutos" value={tempM} onChange={setTempM} type="number" suffix="min"/>
            <Inp C={C} label="Pós-impressão" value={tempoMao} onChange={setTempoMao} type="number" suffix="min"/>
          </div>
        </Card>

        <Card C={C}>
          <h3 style={{margin:"0 0 16px",fontSize:14,fontWeight:700,color:C.accent}}>💡 Extras</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <Inp C={C} label="Retrabalho %" value={retrabalho} onChange={setRetrabalho} type="number" suffix="%"/>
            <Inp C={C} label="Urgência %" value={urgencia} onChange={setUrgencia} type="number" suffix="%"/>
          </div>
        </Card>

        <Btn C={C} onClick={calcular} icon="zap" full size="lg">Calcular</Btn>
      </div>

      <div>
        <Card C={C} style={{position:"sticky",top:20}}>
          <h3 style={{margin:"0 0 18px",fontSize:15,fontWeight:700,color:C.text}}>📊 Resultado</h3>
          {resultado?(<>
            {[["Filamento",resultado.cf],["Máquina",resultado.cm_print],["Energia",resultado.ce],["Mão de obra",resultado.cm_mao],["Insumos",resultado.ci]].map(([l,v])=>(<div key={l} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.border}`,fontSize:13}}><span style={{color:C.muted}}>{l}</span><span style={{color:C.text}}>{brl(v)}</span></div>))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",fontSize:15,fontWeight:700}}><span style={{color:C.text}}>Custo total</span><span style={{color:C.accent}}>{brl(resultado.ct)}</span></div>
            <div style={{margin:"14px 0 10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:C.muted,fontWeight:600}}>Margem de lucro</span><Badge C={C} color={C.green}>{margem}%</Badge></div>
              <input type="range" min={0} max={200} value={margem} onChange={e=>calcularComMargem(+e.target.value)} onMouseUp={calcularAoSoltar} onTouchEnd={calcularAoSoltar} style={{width:"100%",accentColor:C.accent}}/>
            </div>
            <div style={{marginBottom:12}}>
              <Inp C={C} label="Preço de venda (editável)" value={precoVenda} onChange={setPrecoVenda} type="number" prefix="R$"/>
            </div>
            <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:12,padding:16,textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:12,color:C.accent,fontWeight:600,marginBottom:4}}>PREÇO SUGERIDO</div>
              <div style={{fontSize:32,fontWeight:900,color:C.accent}}>{brl(parseFloat(precoVenda)||resultado.preco)}</div>
              <div style={{fontSize:12,color:C.green,marginTop:4}}>Lucro: {brl((parseFloat(precoVenda)||resultado.preco)-resultado.ct)}</div>
            </div>
            <Btn C={C} onClick={()=>setModalCatalogo(true)} icon="box" full size="lg">Salvar no Catálogo</Btn>
          </>):(<div style={{textAlign:"center",padding:40,color:C.dim}}><Icon d={IC.tag} size={40} color={C.dim}/><p style={{marginTop:12,fontSize:13}}>Preencha e clique em "Calcular"</p></div>)}
        </Card>
      </div>
    </div>

    {modalCatalogo&&(<Modal C={C} title="Salvar no Catálogo" onClose={()=>setModalCatalogo(false)}>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{background:C.inputBg,borderRadius:10,padding:14}}>
          <div style={{fontWeight:700,color:C.text,fontSize:15}}>{nome||"Produto sem nome"}</div>
          {descricao&&<div style={{fontSize:13,color:C.muted,marginTop:4}}>{descricao}</div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10,fontSize:12}}>
            <div style={{background:C.card,borderRadius:8,padding:8}}><div style={{color:C.muted}}>Custo</div><div style={{fontWeight:700,color:C.text}}>{brl(resultado?.ct)}</div></div>
            <div style={{background:C.card,borderRadius:8,padding:8}}><div style={{color:C.muted}}>Preço venda</div><div style={{fontWeight:700,color:C.accent}}>{brl(parseFloat(precoVenda)||resultado?.preco)}</div></div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}><input type="checkbox" id="est2" checked={emEstoque} onChange={e=>setEmEstoque(e.target.checked)} style={{accentColor:C.accent,width:16,height:16}}/><label htmlFor="est2" style={{color:C.text,fontSize:14,cursor:"pointer",fontWeight:600}}>Em estoque</label></div>
        {emEstoque&&<Inp C={C} label="Quantidade em estoque" value={qtdEstoque} onChange={setQtdEstoque} type="number" suffix="un"/>}
        <p style={{fontSize:12,color:C.muted,background:C.inputBg,padding:10,borderRadius:8}}>💡 O produto será criado no catálogo. Você poderá adicionar fotos depois na aba Catálogo.</p>
        <div style={{display:"flex",gap:10}}>
          <Btn C={C} onClick={salvarNoCatalogo} loading={salvandoCatalogo} full icon="check">Confirmar e salvar</Btn>
          <Btn C={C} onClick={()=>setModalCatalogo(false)} variant="ghost" full>Cancelar</Btn>
        </div>
      </div>
    </Modal>)}
  </div>);
};


// ── PEDIDOS ────────────────────────────────────────────────────────────────
const Pedidos=({pedidos,clientes,catalogo,onAdd,onUpd,onDel,onUpdEstoque,C,pedidoDetalheInicial,onClearDetalhe})=>{
  const [modal,setModal]=useState(false); const [pedidoVer,setPedidoVer]=useState(pedidoDetalheInicial||null);
  const [notaModal,setNotaModal]=useState(null); const [busca,setBusca]=useState("");
  const [carrinho,setCarrinho]=useState([]); const [clienteId,setClienteId]=useState("");
  const [formPag,setFormPag]=useState("pix"); const [obs,setObs]=useState("");
  const [loading,setLoading]=useState(false); const [prodSel,setProdSel]=useState(""); const [qtdSel,setQtdSel]=useState(1);
  useEffect(()=>{if(pedidoDetalheInicial){setPedidoVer(pedidoDetalheInicial);onClearDetalhe&&onClearDetalhe();}},[pedidoDetalheInicial]);
  const prox=(pedidos.length>0?Math.max(...pedidos.map(p=>p.numero||0)):0)+1;
  const totalCarrinho=carrinho.reduce((s,i)=>s+i.subtotal,0);
  const addCarrinho=()=>{const prod=catalogo.find(p=>p.id===prodSel);if(!prod)return;const qtd=parseInt(qtdSel)||1;setCarrinho(c=>{const ex=c.find(x=>x.produto_id===prodSel);if(ex)return c.map(x=>x.produto_id===prodSel?{...x,quantidade:x.quantidade+qtd,subtotal:(x.quantidade+qtd)*x.preco_unit}:x);return[...c,{produto_id:prodSel,nome:prod.nome,quantidade:qtd,preco_unit:prod.preco_venda,subtotal:qtd*prod.preco_venda}];});setProdSel("");setQtdSel(1);};
  const remItem=(pid)=>setCarrinho(c=>c.filter(x=>x.produto_id!==pid));
  const updQtd=(pid,q)=>setCarrinho(c=>c.map(x=>x.produto_id===pid?{...x,quantidade:parseInt(q)||1,subtotal:(parseInt(q)||1)*x.preco_unit}:x));
  const criarPedido=async()=>{
    if(carrinho.length===0)return alert("Adicione pelo menos um produto.");
    setLoading(true);
    const cliente=clientes.find(c=>c.id===clienteId);
    await onAdd({numero:prox,cliente_id:clienteId||null,cliente_nome:cliente?.nome||"—",total:totalCarrinho,forma_pagamento:formPag,obs,status:"pendente",data:nowDate(),itens:JSON.stringify(carrinho)});
    for(const item of carrinho){const prod=catalogo.find(p=>p.id===item.produto_id);if(prod&&prod.em_estoque)await onUpdEstoque(item.produto_id,Math.max(0,(prod.qtd_estoque||0)-item.quantidade));}
    setModal(false);setCarrinho([]);setClienteId("");setObs("");setLoading(false);
  };
  const excluirPedido=async(p)=>{
    if(!window.confirm("Excluir? O estoque será restaurado."))return;
    const itens=JSON.parse(p.itens||"[]");
    for(const item of itens){const prod=catalogo.find(x=>x.id===item.produto_id);if(prod&&prod.em_estoque)await onUpdEstoque(item.produto_id,(prod.qtd_estoque||0)+item.quantidade);}
    await onDel(p.id);
  };
  const filtrados=pedidos.filter(p=>String(p.numero||"").includes(busca)||(p.cliente_nome||"").toLowerCase().includes(busca.toLowerCase()));
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Pedidos</h1><p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Clique no pedido para ver detalhes</p></div>
      <Btn C={C} onClick={()=>setModal(true)} icon="plus">Novo Pedido</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar..."/></div>
    {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum pedido</p></Card>:(
      <Card C={C} style={{padding:0,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr style={{background:C.inputBg}}>{["Nº","Cliente","Data","Total","Pagamento","Status",""].map(h=>(<th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase"}}>{h}</th>))}</tr></thead>
          <tbody>{filtrados.map((p,i)=>{
            const sc=STATUS_COLORS[p.status]||C.accent;
            return(<tr key={p.id} style={{borderTop:`1px solid ${C.border}`,cursor:"pointer"}} onClick={()=>setPedidoVer(p)} onMouseEnter={e=>e.currentTarget.style.background=C.inputBg} onMouseLeave={e=>e.currentTarget.style.background=""}>
              <td style={{padding:"14px 16px",color:C.accent,fontWeight:800}}>#{p.numero}</td>
              <td style={{padding:"14px 16px",color:C.text,fontWeight:600}}>{p.cliente_nome||"—"}</td>
              <td style={{padding:"14px 16px",color:C.muted,fontSize:13}}>{p.data}</td>
              <td style={{padding:"14px 16px",color:C.accent,fontWeight:700}}>{brl(p.total)}</td>
              <td style={{padding:"14px 16px",color:C.muted,fontSize:13}}>{p.forma_pagamento||"—"}</td>
              <td style={{padding:"14px 16px"}} onClick={e=>e.stopPropagation()}><select value={p.status} onChange={e=>onUpd(p.id,{status:e.target.value})} style={{background:sc+"22",color:sc,border:`1px solid ${sc}44`,borderRadius:6,padding:"4px 8px",fontSize:12,fontWeight:700,fontFamily:"inherit",cursor:"pointer"}}>{STATUS.map(s=><option key={s} value={s}>{s}</option>)}</select></td>
              <td style={{padding:"14px 16px"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",gap:6}}><button onClick={()=>setNotaModal(p)} style={{background:C.accentSoft,border:"none",borderRadius:6,padding:"5px 8px",cursor:"pointer",color:C.accent}}><Icon d={IC.download} size={14}/></button><button onClick={()=>excluirPedido(p)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer"}}><Icon d={IC.trash} size={15}/></button></div></td>
            </tr>);
          })}</tbody>
        </table>
      </Card>
    )}
    {pedidoVer&&(()=>{const itens=JSON.parse(pedidoVer.itens||"[]");const cliente=clientes.find(c=>c.id===pedidoVer.cliente_id);return(<Modal C={C} title={"Pedido #"+pedidoVer.numero} onClose={()=>setPedidoVer(null)} wide>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={{background:C.inputBg,borderRadius:12,padding:16}}><div style={{fontSize:22,fontWeight:900,color:C.accent,marginBottom:8}}>#{pedidoVer.numero}</div><div style={{fontSize:13,color:C.text,marginBottom:4}}><span style={{color:C.muted}}>Data: </span>{pedidoVer.data}</div><div style={{fontSize:13,color:C.text,marginBottom:8}}><span style={{color:C.muted}}>Pagamento: </span>{pedidoVer.forma_pagamento||"—"}</div><Badge C={C} color={STATUS_COLORS[pedidoVer.status]||C.yellow}>{pedidoVer.status}</Badge></div>
        <div style={{background:C.inputBg,borderRadius:12,padding:16}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>{cliente?.nome||pedidoVer.cliente_nome||"—"}</div>{pedidoVer.cliente_whatsapp&&<div style={{fontSize:13,color:C.muted,marginTop:4}}>📱 {pedidoVer.cliente_whatsapp}</div>}{pedidoVer.cliente_email&&<div style={{fontSize:13,color:C.muted}}>📧 {pedidoVer.cliente_email}</div>}</div>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}><thead><tr style={{background:C.inputBg}}>{["Produto","Qtd","Preço","Subtotal"].map(h=>(<th key={h} style={{padding:"8px 12px",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead><tbody>{itens.map((item,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"10px 12px",color:C.text,fontWeight:600}}>{item.nome}</td><td style={{padding:"10px 12px",color:C.text}}>{item.quantidade}</td><td style={{padding:"10px 12px",color:C.text}}>{brl(item.preco_unit)}</td><td style={{padding:"10px 12px",color:C.accent,fontWeight:700}}>{brl(item.subtotal)}</td></tr>))}</tbody></table>
      <div style={{display:"flex",justifyContent:"space-between",padding:16,background:C.accentSoft,borderRadius:12}}><span style={{fontWeight:700,color:C.text}}>Total</span><span style={{fontWeight:900,color:C.accent,fontSize:22}}>{brl(pedidoVer.total)}</span></div>
      {pedidoVer.obs&&<div style={{marginTop:12,padding:10,background:C.inputBg,borderRadius:8,fontSize:13,color:C.muted}}>📝 {pedidoVer.obs}</div>}
      <div style={{display:"flex",gap:10,marginTop:20}}><Btn C={C} onClick={()=>{setNotaModal(pedidoVer);setPedidoVer(null);}} icon="download" full>Gerar Nota</Btn><Btn C={C} onClick={()=>setPedidoVer(null)} variant="ghost" full>Fechar</Btn></div>
    </Modal>);})()}
    {notaModal&&(()=>{const itens=JSON.parse(notaModal.itens||"[]");return(<Modal C={C} title={"Nota #"+notaModal.numero} onClose={()=>setNotaModal(null)} wide>
      <div style={{textAlign:"center",marginBottom:16}}><img src={LOGO} style={{width:56,height:56,objectFit:"contain"}}/><h2 style={{color:C.text,margin:"8px 0 2px"}}>Itsuki Lab</h2><p style={{color:C.muted,fontSize:12,margin:0}}>Materializando sua imaginação</p></div>
      <table style={{width:"100%",borderCollapse:"collapse",marginBottom:16}}><thead><tr style={{background:C.inputBg}}>{["Produto","Qtd","Preço","Subtotal"].map(h=>(<th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:12,fontWeight:700,color:C.muted,borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead><tbody>{itens.map((item,i)=>(<tr key={i} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"10px 12px",color:C.text}}>{item.nome}</td><td style={{padding:"10px 12px",color:C.text}}>{item.quantidade}</td><td style={{padding:"10px 12px",color:C.text}}>{brl(item.preco_unit)}</td><td style={{padding:"10px 12px",color:C.accent,fontWeight:700}}>{brl(item.subtotal)}</td></tr>))}</tbody></table>
      <div style={{display:"flex",justifyContent:"flex-end"}}><div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:12,padding:"14px 24px",textAlign:"right"}}><div style={{fontSize:12,color:C.muted}}>Total</div><div style={{fontSize:28,fontWeight:900,color:C.accent}}>{brl(notaModal.total)}</div></div></div>
      <div style={{display:"flex",gap:10,marginTop:20}}><Btn C={C} onClick={()=>window.print()} icon="download" full>Imprimir / PDF</Btn><Btn C={C} onClick={()=>setNotaModal(null)} variant="ghost" full>Fechar</Btn></div>
    </Modal>);})()}
    {modal&&(<Modal C={C} title={"Novo Pedido #"+prox} onClose={()=>setModal(false)} wider>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:C.accentSoft,border:`1px solid ${C.accentGlow}`,borderRadius:10,padding:"12px 16px",fontSize:22,fontWeight:900,color:C.accent}}>#{prox}</div>
          <Sel C={C} label="Cliente" value={clienteId} onChange={setClienteId} options={[{value:"",label:"— Sem cliente —"},...clientes.map(c=>({value:c.id,label:c.nome}))]}/>
          <Sel C={C} label="Pagamento" value={formPag} onChange={setFormPag} options={PAGAMENTO.map(p=>({value:p,label:p.charAt(0).toUpperCase()+p.slice(1)}))}/>
          <Inp C={C} label="Observações" value={obs} onChange={setObs} placeholder="..."/>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.accent}}>🛒 Itens</div>
          <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
            <div style={{flex:1}}><Sel C={C} label="Produto" value={prodSel} onChange={setProdSel} options={[{value:"",label:"— Selecionar —"},...catalogo.filter(p=>p.em_estoque&&(p.qtd_estoque||0)>0).map(p=>({value:p.id,label:p.nome+" ("+p.qtd_estoque+" un)"}))]}/></div>
            <div style={{width:70}}><Inp C={C} label="Qtd" value={qtdSel} onChange={setQtdSel} type="number"/></div>
            <Btn C={C} onClick={addCarrinho} icon="plus" disabled={!prodSel}>Add</Btn>
          </div>
          {carrinho.length===0?<div style={{textAlign:"center",padding:24,color:C.dim,background:C.inputBg,borderRadius:10,fontSize:13}}>Nenhum item</div>:(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {carrinho.map(item=>(<div key={item.produto_id} style={{display:"flex",alignItems:"center",gap:10,background:C.inputBg,borderRadius:10,padding:"10px 14px"}}>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600,color:C.text}}>{item.nome}</div><div style={{fontSize:12,color:C.muted}}>{brl(item.preco_unit)}/un</div></div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <button onClick={()=>updQtd(item.produto_id,Math.max(1,item.quantidade-1))} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.text,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                  <span style={{minWidth:24,textAlign:"center",fontWeight:700,color:C.text}}>{item.quantidade}</span>
                  <button onClick={()=>updQtd(item.produto_id,item.quantidade+1)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,width:28,height:28,cursor:"pointer",color:C.text,fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                </div>
                <div style={{minWidth:70,textAlign:"right",fontWeight:700,color:C.accent}}>{brl(item.subtotal)}</div>
                <button onClick={()=>remItem(item.produto_id)} style={{background:"none",border:"none",color:C.red,cursor:"pointer"}}><Icon d={IC.trash} size={14}/></button>
              </div>))}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 14px",background:C.accentSoft,borderRadius:10}}><span style={{fontWeight:700,color:C.text}}>Total</span><span style={{fontWeight:900,color:C.accent,fontSize:18}}>{brl(totalCarrinho)}</span></div>
            </div>
          )}
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:20}}><Btn C={C} onClick={criarPedido} loading={loading} full icon="check">Criar Pedido #{prox}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
    </Modal>)}
  </div>);
};

// ── CLIENTES ───────────────────────────────────────────────────────────────
const Clientes=({clientes,pedidos,onAdd,onUpd,onDel,C})=>{
  const [modal,setModal]=useState(false); const [editando,setEditando]=useState(null);
  const [detalhe,setDetalhe]=useState(null); const [busca,setBusca]=useState(""); const [loading,setLoading]=useState(false);
  const empty={nome:"",email:"",tel:"",cidade:"",obs:""};
  const [form,setForm]=useState(empty); const sf=(k,v)=>setForm(f=>({...f,[k]:v}));
  const abrir=(item=null)=>{setEditando(item);setForm(item?{nome:item.nome||"",email:item.email||"",tel:item.tel||"",cidade:item.cidade||"",obs:item.obs||""}:empty);setModal(true);};
  const salvar=async()=>{if(!form.nome)return;setLoading(true);editando?await onUpd(editando.id,form):await onAdd(form);setModal(false);setLoading(false);};
  const filtrados=clientes.filter(c=>c.nome?.toLowerCase().includes(busca.toLowerCase()));
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
      <div><h1 style={{fontSize:24,fontWeight:800,color:C.text,margin:0}}>Clientes</h1><p style={{color:C.muted,fontSize:14,margin:"4px 0 0"}}>Clique para ver histórico</p></div>
      <Btn C={C} onClick={()=>abrir()} icon="plus">Novo Cliente</Btn>
    </div>
    <div style={{marginBottom:16}}><Inp C={C} value={busca} onChange={setBusca} placeholder="🔍  Buscar..."/></div>
    {filtrados.length===0?<Card C={C} style={{textAlign:"center",padding:60}}><p style={{color:C.dim}}>Nenhum cliente</p></Card>:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
        {filtrados.map(c=>{
          const ps=pedidos.filter(p=>p.cliente_id===c.id);
          const tg=ps.reduce((s,p)=>s+(p.total||0),0);
          return(<Card C={C} key={c.id} onClick={()=>setDetalhe(c)} style={{cursor:"pointer",transition:"transform .15s,box-shadow .15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow=`0 8px 24px ${C.accentGlow}`;}} onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div style={{background:C.accentSoft,color:C.accent,borderRadius:10,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,flexShrink:0}}>{c.nome[0].toUpperCase()}</div>
              <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                <button onClick={()=>abrir(c)} style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.text}}><Icon d={IC.edit} size={14}/></button>
                <button onClick={()=>{if(window.confirm("Excluir?"))onDel(c.id);}} style={{background:"rgba(239,68,68,.1)",border:"1px solid rgba(239,68,68,.3)",borderRadius:8,padding:"6px 8px",cursor:"pointer",color:C.red}}><Icon d={IC.trash} size={14}/></button>
              </div>
            </div>
            <div style={{fontWeight:700,color:C.text,fontSize:15,marginBottom:4}}>{c.nome}</div>
            {c.email&&<div style={{fontSize:12,color:C.muted}}>{c.email}</div>}
            {c.tel&&<div style={{fontSize:12,color:C.muted}}>{c.tel}</div>}
            {c.cidade&&<div style={{fontSize:12,color:C.muted}}>{c.cidade}</div>}
            {c.obs&&<div style={{fontSize:12,color:C.yellow,marginTop:6,padding:"6px 8px",background:"rgba(245,158,11,0.08)",borderRadius:6}}>📝 {c.obs}</div>}
            <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap",alignItems:"center"}}>
              <Badge C={C} color={C.blue}>{ps.length} pedido{ps.length!==1?"s":""}</Badge>
              <Badge C={C} color={C.green}>{brl(tg)}</Badge>
            </div>
            <div style={{fontSize:11,color:C.accent,marginTop:8,display:"flex",alignItems:"center",gap:4}}>Ver histórico completo <Icon d={IC.arrowright} size={11} color={C.accent}/></div>
          </Card>);
        })}
      </div>
    )}
    {detalhe&&(()=>{
      const ps=pedidos.filter(p=>p.cliente_id===detalhe.id);
      const total=ps.reduce((s,p)=>s+(p.total||0),0);
      return(<Modal C={C} title={"Histórico — "+detalhe.nome} onClose={()=>setDetalhe(null)} wide>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
          {[["Pedidos",ps.length,C.accent],["Total gasto",brl(total),C.green],["Ticket médio",brl(ps.length>0?total/ps.length:0),C.blue]].map(([l,v,col])=>(<div key={l} style={{background:C.inputBg,borderRadius:10,padding:14,textAlign:"center"}}><div style={{fontSize:11,color:C.muted,marginBottom:4}}>{l}</div><div style={{fontSize:20,fontWeight:800,color:col}}>{v}</div></div>))}
        </div>
        {ps.length===0?<p style={{color:C.dim,fontSize:13,textAlign:"center"}}>Nenhum pedido</p>:(
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {ps.map(p=>{const itens=JSON.parse(p.itens||"[]");return(<div key={p.id} style={{background:C.inputBg,borderRadius:12,padding:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div><span style={{fontWeight:800,color:C.accent,fontSize:16}}>#{p.numero}</span><span style={{fontSize:12,color:C.muted,marginLeft:8}}>{p.data}</span></div>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><Badge C={C} color={STATUS_COLORS[p.status]||C.yellow}>{p.status}</Badge><span style={{fontWeight:700,color:C.accent}}>{brl(p.total)}</span></div>
              </div>
              <div style={{fontSize:12,color:C.muted}}>{itens.map((it,i)=><span key={i}>{it.nome} x{it.quantidade}{i<itens.length-1?", ":""}</span>)}</div>
              <div style={{fontSize:11,color:C.dim,marginTop:4}}>💳 {p.forma_pagamento||"—"}</div>
            </div>);})}
          </div>
        )}
      </Modal>);
    })()}
    {modal&&(<Modal C={C} title={editando?"Editar Cliente":"Novo Cliente"} onClose={()=>setModal(false)}>
      <div style={{display:"grid",gap:14}}>
        <Inp C={C} label="Nome completo" value={form.nome} onChange={v=>sf("nome",v)}/>
        <Inp C={C} label="Email" value={form.email} onChange={v=>sf("email",v)} type="email"/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}><Inp C={C} label="Telefone" value={form.tel} onChange={v=>sf("tel",v)}/><Inp C={C} label="Cidade" value={form.cidade} onChange={v=>sf("cidade",v)}/></div>
        <Inp C={C} label="Observações" value={form.obs} onChange={v=>sf("obs",v)} placeholder="Ex: prefere Pix..."/>
        <div style={{display:"flex",gap:10}}><Btn C={C} onClick={salvar} loading={loading} full>{editando?"Salvar":"Cadastrar"}</Btn><Btn C={C} onClick={()=>setModal(false)} variant="ghost" full>Cancelar</Btn></div>
      </div>
    </Modal>)}
  </div>);
};

// ── FINANCEIRO ─────────────────────────────────────────────────────────────
const Financeiro=({pedidos,C})=>{
  const pagos=pedidos.filter(p=>p.status==="pago"||p.status==="entregue");
  const receita=pagos.reduce((s,p)=>s+(p.total||0),0);
  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:24}}>Financeiro</h1>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:24}}>
      <StatCard C={C} label="Receita Total" value={brl(receita)} color={C.green} icon="dollar"/>
      <StatCard C={C} label="Pedidos Pagos" value={pagos.length} color={C.blue} icon="printer"/>
      <StatCard C={C} label="Ticket Médio" value={brl(pagos.length>0?receita/pagos.length:0)} color={C.accent} icon="chart"/>
    </div>
    <Card C={C}><h3 style={{margin:"0 0 18px",fontSize:15,fontWeight:700,color:C.text}}>Pedidos Finalizados</h3>
      {pagos.length===0?<p style={{color:C.dim,fontSize:13}}>Nenhum</p>:(
        <table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr>{["#","Cliente","Data","Pagamento","Status","Total"].map(h=>(<th key={h} style={{padding:"10px 0",textAlign:"left",fontSize:11,fontWeight:700,color:C.muted,textTransform:"uppercase",borderBottom:`1px solid ${C.border}`}}>{h}</th>))}</tr></thead>
        <tbody>{pagos.map(p=>(<tr key={p.id} style={{borderBottom:`1px solid ${C.border}`}}><td style={{padding:"12px 0",color:C.accent,fontWeight:700}}>#{p.numero}</td><td style={{padding:"12px 0",color:C.text}}>{p.cliente_nome||"—"}</td><td style={{padding:"12px 0",color:C.muted,fontSize:13}}>{p.data}</td><td style={{padding:"12px 0",color:C.muted,fontSize:13}}>{p.forma_pagamento||"—"}</td><td style={{padding:"12px 0"}}><Badge C={C} color={STATUS_COLORS[p.status]||C.green}>{p.status}</Badge></td><td style={{padding:"12px 0",color:C.accent,fontWeight:700}}>{brl(p.total)}</td></tr>))}</tbody></table>
      )}
    </Card>
  </div>);
};

// ── CONFIGURAÇÕES ──────────────────────────────────────────────────────────
const Configs=({user,C})=>{
  const [nome,setNome]=useState(user?.user_metadata?.nome||""); const [cel,setCel]=useState(user?.user_metadata?.cel||"");
  const [loading,setLoading]=useState(false); const [msg,setMsg]=useState({text:"",ok:false});
  const salvar=async()=>{setLoading(true);const {error}=await supabase.auth.updateUser({data:{nome,cel}});setMsg({text:error?"Erro.":"Dados salvos!",ok:!error});setLoading(false);};
  const recuperarSenha=async()=>{const {error}=await supabase.auth.resetPasswordForEmail(user.email,{redirectTo:window.location.origin});setMsg({text:error?"Erro.":"Email enviado! Verifique sua caixa.",ok:!error});};
  return(<div>
    <h1 style={{fontSize:24,fontWeight:800,color:C.text,marginBottom:24}}>Configurações</h1>
    <div style={{display:"grid",gap:16,maxWidth:520}}>
      <Card C={C}><h3 style={{margin:"0 0 18px",fontSize:14,fontWeight:700,color:C.accent}}>👤 Seus Dados</h3>
        <div style={{display:"grid",gap:14}}><Inp C={C} label="Nome" value={nome} onChange={setNome}/><Inp C={C} label="Celular" value={cel} onChange={setCel}/><Inp C={C} label="Email" value={user?.email||""} readOnly/></div>
        {msg.text&&<div style={{marginTop:12,background:msg.ok?"rgba(34,197,94,0.1)":"rgba(239,68,68,0.1)",color:msg.ok?C.green:C.red,padding:10,borderRadius:8,fontSize:13}}>{msg.text}</div>}
        <div style={{marginTop:16}}><Btn C={C} onClick={salvar} loading={loading} icon="check" full>Salvar</Btn></div>
      </Card>
      <Card C={C}><h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:700,color:C.accent}}>🔑 Segurança</h3>
        <p style={{fontSize:13,color:C.muted,marginBottom:14}}>Receba um link para redefinir sua senha.</p>
        <Btn C={C} onClick={recuperarSenha} variant="ghost" icon="key" full>Enviar email de recuperação</Btn>
      </Card>
    </div>
  </div>);
};


// ── MAIN APP ───────────────────────────────────────────────────────────────
export default function App(){
  const [darkMode,setDarkMode]=useState(true);
  const [user,setUser]=useState(null); const [appLoading,setAppLoading]=useState(true);
  const [isRecovery,setIsRecovery]=useState(false);
  const [page,setPage]=useState("dashboard");
  const [filamentos,setFilamentos]=useState([]); const [clientes,setClientes]=useState([]);
  const [pedidos,setPedidos]=useState([]); const [catalogo,setCatalogo]=useState([]);
  const [insumos,setInsumos]=useState([]); const [configs,setConfigs]=useState(null);
  const [pedidoDetalhe,setPedidoDetalhe]=useState(null);
  const [novoPedidoAlert,setNovoPedidoAlert]=useState(null);
  const [badge,setBadge]=useState(0);
  const C=darkMode?DARK:LIGHT;

  useEffect(()=>{
    const hash=window.location.hash;
    if(hash.includes("type=recovery")||new URLSearchParams(window.location.search).get("type")==="recovery"){setIsRecovery(true);}
    supabase.auth.getSession().then(({data:{session}})=>{setUser(session?.user??null);setAppLoading(false);});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>{
      setUser(s?.user??null);
      if(_e==="PASSWORD_RECOVERY")setIsRecovery(true);
    });
    return()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if(!user)return;
    (async()=>{
      const [f,c,p,cat,ins,cfg]=await Promise.all([
        supabase.from("filamentos").select("*").order("created_at",{ascending:false}),
        supabase.from("clientes").select("*").order("created_at",{ascending:false}),
        supabase.from("pedidos").select("*").order("numero",{ascending:false}),
        supabase.from("catalogo").select("*").order("created_at",{ascending:false}),
        supabase.from("insumos").select("*").order("created_at",{ascending:false}),
        supabase.from("configs").select("*").eq("user_id",user.id).single(),
      ]);
      if(f.data)setFilamentos(f.data);
      if(c.data)setClientes(c.data);
      if(p.data){setPedidos(p.data);setBadge(p.data.filter(x=>x.status==="aguardando confirmação").length);}
      if(cat.data)setCatalogo(cat.data);
      if(ins.data)setInsumos(ins.data);
      if(cfg.data)setConfigs(cfg.data);
    })();
  },[user]);

  useEffect(()=>{
    if(!user)return;
    if("Notification" in window&&Notification.permission==="default")Notification.requestPermission();
    const ch=supabase.channel("pedidos-rt")
      .on("postgres_changes",{event:"INSERT",schema:"public",table:"pedidos"},(payload)=>{
        const p=payload.new;
        setPedidos(prev=>[p,...prev]);
        if(p.origem==="loja_publica"){
          setNovoPedidoAlert(p);
          setBadge(b=>b+1);
          if("Notification" in window&&Notification.permission==="granted")
            new Notification("🛍️ Novo pedido da loja!",{body:p.cliente_nome+" · "+brl(p.total)});
          try{const ctx=new(window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator();const g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=880;g.gain.setValueAtTime(0.3,ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.01,ctx.currentTime+0.5);o.start();o.stop(ctx.currentTime+0.5);}catch(e){}
        }
      }).subscribe();
    return()=>supabase.removeChannel(ch);
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
  const addCat=async(d)=>{const {data:r}=await supabase.from("catalogo").insert({...d,user_id:user.id}).select().single();if(r)setCatalogo(p=>[r,...p]);return r;};
  const updCat=async(id,d)=>{await supabase.from("catalogo").update(d).eq("id",id);setCatalogo(p=>p.map(x=>x.id===id?{...x,...d}:x));};
  const delCat=async(id)=>{await supabase.from("catalogo").delete().eq("id",id);setCatalogo(p=>p.filter(x=>x.id!==id));};
  const updEstoque=async(id,q)=>{await supabase.from("catalogo").update({qtd_estoque:q}).eq("id",id);setCatalogo(p=>p.map(x=>x.id===id?{...x,qtd_estoque:q}:x));};
  const addIns=async(d)=>{const {data:r}=await supabase.from("insumos").insert({...d,user_id:user.id}).select().single();if(r)setInsumos(p=>[r,...p]);};
  const updIns=async(id,d)=>{await supabase.from("insumos").update(d).eq("id",id);setInsumos(p=>p.map(x=>x.id===id?{...x,...d}:x));};
  const delIns=async(id)=>{await supabase.from("insumos").delete().eq("id",id);setInsumos(p=>p.filter(x=>x.id!==id));};
  const saveCfg=async(d)=>{const {data:r}=await supabase.from("configs").upsert({...d,user_id:user.id},{onConflict:"user_id"}).select().single();if(r)setConfigs(r);};

  if(appLoading)return<div style={{minHeight:"100vh",background:DARK.bg,display:"flex",alignItems:"center",justifyContent:"center",color:DARK.muted,fontFamily:"sans-serif"}}>Carregando...</div>;
  if(isRecovery)return<RecoveryScreen C={C}/>;
  if(!user)return<AuthScreen C={C}/>;

  const pages={
    dashboard:<Dashboard C={C} filamentos={filamentos} pedidos={pedidos} clientes={clientes} catalogo={catalogo} setPage={setPage}/>,
    catalogo:<Catalogo C={C} catalogo={catalogo} filamentos={filamentos} insumos={insumos} configs={configs} onAdd={addCat} onUpd={updCat} onDel={delCat}/>,
    orcamento:<Orcamento C={C} filamentos={filamentos} insumos={insumos} configs={configs} onSaveConfigs={saveCfg} onAddCatalogo={addCat} setPage={setPage}/>,
    filamentos:<Filamentos C={C} filamentos={filamentos} onAdd={addF} onUpd={updF} onDel={delF}/>,
    insumos:<Insumos C={C} insumos={insumos} onAdd={addIns} onUpd={updIns} onDel={delIns}/>,
    pedidos:<Pedidos C={C} pedidos={pedidos} clientes={clientes} catalogo={catalogo} onAdd={addP} onUpd={updP} onDel={delP} onUpdEstoque={updEstoque} pedidoDetalheInicial={pedidoDetalhe} onClearDetalhe={()=>setPedidoDetalhe(null)}/>,
    clientes:<Clientes C={C} clientes={clientes} pedidos={pedidos} onAdd={addC} onUpd={updC} onDel={delC}/>,
    financeiro:<Financeiro C={C} pedidos={pedidos}/>,
    configs:<Configs C={C} user={user}/>,
  };

  return(
    <div style={{fontFamily:"'DM Sans','Segoe UI',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex",transition:"background .2s"}}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}input,select,textarea{color-scheme:${darkMode?"dark":"light"};}::-webkit-scrollbar{width:6px;}::-webkit-scrollbar-track{background:${C.surface};}::-webkit-scrollbar-thumb{background:${C.border};border-radius:3px;}@media print{aside{display:none!important;}main{margin-left:0!important;}}`}</style>
      <Sidebar C={C} active={page} setActive={p=>{setPage(p);if(p==="pedidos")setBadge(0);}} user={user} onLogout={logout} darkMode={darkMode} setDarkMode={setDarkMode} badge={badge}/>
      <main style={{flex:1,marginLeft:220,padding:"32px 36px",maxWidth:"100%",overflowX:"hidden"}}>
        {novoPedidoAlert&&(
          <div style={{position:"fixed",top:20,right:20,zIndex:999,background:C.green,color:"#fff",borderRadius:14,padding:"16px 20px",boxShadow:"0 8px 32px rgba(22,163,74,0.4)",maxWidth:360,cursor:"pointer"}} onClick={()=>{setPage("pedidos");setBadge(0);setNovoPedidoAlert(null);}}>
            <div style={{fontWeight:800,fontSize:16,marginBottom:4}}>🛍️ Novo pedido da loja!</div>
            <div style={{fontSize:13,opacity:0.9}}>{novoPedidoAlert.cliente_nome} · {brl(novoPedidoAlert.total)}</div>
            {novoPedidoAlert.cliente_whatsapp&&<div style={{fontSize:12,opacity:0.8,marginTop:2}}>📱 {novoPedidoAlert.cliente_whatsapp}</div>}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <button onClick={e=>{e.stopPropagation();const n=novoPedidoAlert;const m=encodeURIComponent("🛍️ NOVO PEDIDO #"+n.numero+"\nCliente: "+n.cliente_nome+"\nWhatsApp: "+(n.cliente_whatsapp||"—")+"\nTotal: "+brl(n.total)+"\nData: "+n.data);window.open("https://wa.me/5516997824029?text="+m,"_blank");}} style={{flex:1,background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"8px",color:"#fff",cursor:"pointer",fontFamily:"inherit",fontWeight:600,fontSize:13}}>📱 WhatsApp</button>
              <button onClick={e=>{e.stopPropagation();setNovoPedidoAlert(null);}} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:8,padding:"8px 12px",color:"#fff",cursor:"pointer",fontSize:13}}>✕</button>
            </div>
          </div>
        )}
        {pages[page]}
      </main>
    </div>
  );
}
