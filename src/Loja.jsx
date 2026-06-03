import { useState, useEffect } from "react";
import { supabase } from "./supabase.js";

const LOGO = "/logo.png";

const WHATSAPP = "5516997824029";
const WA_MSG = encodeURIComponent("Olá! Gostaria de falar sobre meu pedido na Itsuki Lab 💜");
const brl = (v) => Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});

const C = {
  bg:"#f8f5ff", card:"#ffffff", border:"#e5d9f9",
  accent:"#9333ea", accentSoft:"rgba(147,51,234,0.08)", accentGlow:"rgba(147,51,234,0.3)",
  green:"#16a34a", red:"#dc2626", text:"#1e1b4b", muted:"#6b7280",
  inputBg:"#f3eeff", yellow:"#d97706", dim:"#9ca3af",
};

const WaBtn = ({text="Falar no WhatsApp", big=false}) => (
  <a href={`https://wa.me/${WHATSAPP}?text=${WA_MSG}`} target="_blank" rel="noreferrer"
    style={{display:"inline-flex",alignItems:"center",gap:10,background:"#25d366",color:"#fff",
      textDecoration:"none",padding:big?"14px 32px":"10px 20px",borderRadius:12,
      fontWeight:700,fontSize:big?16:14,boxShadow:"0 4px 20px rgba(37,211,102,0.35)",fontFamily:"inherit"}}>
    <svg width={big?22:18} height={big?22:18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
    {text}
  </a>
);

const Header = ({carrinho, onVerCarrinho}) => {
  const total = carrinho.reduce((s,i)=>s+i.subtotal,0);
  const totalItens = carrinho.reduce((s,i)=>s+i.quantidade,0);
  return (
    <div style={{background:C.card,borderBottom:`1px solid ${C.border}`,padding:"14px 24px",
      display:"flex",alignItems:"center",justifyContent:"space-between",
      position:"sticky",top:0,zIndex:50,boxShadow:"0 2px 12px rgba(147,51,234,0.06)"}}>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <img src={LOGO} alt="Itsuki Lab" style={{width:44,height:44,objectFit:"contain"}}/>
        <div>
          <div style={{fontWeight:800,color:C.text,fontSize:16}}>Itsuki Lab</div>
          <div style={{fontSize:11,color:C.muted}}>Materializando sua imaginação</div>
        </div>
      </div>
      {carrinho.length > 0 && (
        <button onClick={onVerCarrinho}
          style={{background:C.accent,color:"#fff",border:"none",borderRadius:10,
            padding:"10px 20px",fontWeight:700,fontSize:14,cursor:"pointer",
            fontFamily:"inherit",display:"flex",alignItems:"center",gap:8,
            boxShadow:`0 4px 16px ${C.accentGlow}`}}>
          🛒 {totalItens} {totalItens===1?"item":"itens"} · {brl(total)}
        </button>
      )}
    </div>
  );
};

// Modal de detalhe do produto
const ProdutoModal = ({prod, noCarrinho, onAdd, onUpd, onRem, onClose}) => {
  const qtd = noCarrinho ? noCarrinho.quantidade : 0;
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:100,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:C.card,borderRadius:20,width:"100%",maxWidth:620,
        maxHeight:"92vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(147,51,234,0.25)"}}>
        {prod.foto_url
          ? <img src={prod.foto_url} alt={prod.nome}
              style={{width:"100%",height:280,objectFit:"cover",borderRadius:"20px 20px 0 0"}}/>
          : <div style={{width:"100%",height:200,background:C.inputBg,borderRadius:"20px 20px 0 0",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:56}}>📦</div>}
        <div style={{padding:24}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
            <h2 style={{color:C.text,fontSize:22,fontWeight:800,margin:0,flex:1}}>{prod.nome}</h2>
            <button onClick={onClose}
              style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted,padding:"0 4px"}}>✕</button>
          </div>
          {prod.descricao && (
            <p style={{color:C.muted,fontSize:14,lineHeight:1.7,marginBottom:16}}>{prod.descricao}</p>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
            <div style={{background:C.inputBg,borderRadius:10,padding:12}}>
              <div style={{fontSize:11,color:C.muted,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Disponível</div>
              <div style={{fontWeight:700,color:prod.qtd_estoque>3?C.green:C.yellow}}>
                {prod.qtd_estoque>3?`${prod.qtd_estoque} unidades`:`Últimas ${prod.qtd_estoque} un`}
              </div>
            </div>
            <div style={{background:C.accentSoft,borderRadius:10,padding:12,border:`1px solid ${C.accentGlow}`}}>
              <div style={{fontSize:11,color:C.accent,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>Preço</div>
              <div style={{fontWeight:900,color:C.accent,fontSize:22}}>{brl(prod.preco_venda)}</div>
            </div>
          </div>
          {qtd === 0 ? (
            <button onClick={()=>onAdd(prod)}
              style={{width:"100%",background:C.accent,color:"#fff",border:"none",
                borderRadius:12,padding:"14px",fontSize:15,fontWeight:700,
                cursor:"pointer",fontFamily:"inherit",
                boxShadow:`0 4px 20px ${C.accentGlow}`}}>
              + Adicionar ao pedido
            </button>
          ) : (
            <div>
              <div style={{display:"flex",alignItems:"center",gap:12,
                background:C.inputBg,borderRadius:12,padding:"10px 16px",marginBottom:12}}>
                <button onClick={()=>qtd<=1?onRem(prod.id):onUpd(prod.id,qtd-1)}
                  style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,
                    width:40,height:40,cursor:"pointer",color:C.text,fontSize:22,
                    display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>−</button>
                <div style={{flex:1,textAlign:"center",fontWeight:800,color:C.text,fontSize:20}}>{qtd}</div>
                <button onClick={()=>onUpd(prod.id,qtd+1)}
                  style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,
                    width:40,height:40,cursor:"pointer",color:C.text,fontSize:22,
                    display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700}}>+</button>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                background:C.accentSoft,borderRadius:10,padding:"10px 16px",marginBottom:12}}>
                <span style={{color:C.muted,fontSize:13}}>Subtotal</span>
                <span style={{fontWeight:800,color:C.accent,fontSize:16}}>{brl(qtd*prod.preco_venda)}</span>
              </div>
              <button onClick={()=>{onRem(prod.id);}}
                style={{width:"100%",background:"none",border:`1px solid ${C.border}`,
                  borderRadius:10,padding:"10px",fontSize:13,color:C.muted,
                  cursor:"pointer",fontFamily:"inherit"}}>
                Remover do pedido
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal do carrinho
const CarrinhoModal = ({carrinho, catalogo, onUpd, onRem, onFechar, onConfirmar}) => {
  const total = carrinho.reduce((s,i)=>s+i.subtotal,0);
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:100,
      display:"flex",alignItems:"flex-end",justifyContent:"center",padding:"0"}}
      onClick={e=>e.target===e.currentTarget&&onFechar()}>
      <div style={{background:C.card,borderRadius:"20px 20px 0 0",width:"100%",maxWidth:620,
        maxHeight:"85vh",overflowY:"auto",boxShadow:"0 -8px 40px rgba(147,51,234,0.2)"}}>
        <div style={{padding:"20px 24px 0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{margin:0,fontSize:20,fontWeight:800,color:C.text}}>🛒 Meu Pedido</h2>
          <button onClick={onFechar}
            style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.muted}}>✕</button>
        </div>
        <div style={{padding:"16px 24px"}}>
          {carrinho.length === 0 ? (
            <div style={{textAlign:"center",padding:"40px 0",color:C.muted}}>
              <div style={{fontSize:40,marginBottom:12}}>🛒</div>
              <p>Nenhum item adicionado ainda</p>
            </div>
          ) : (
            <>
              {carrinho.map(item => (
                <div key={item.produto_id}
                  style={{display:"flex",alignItems:"center",gap:12,
                    padding:"12px 0",borderBottom:`1px solid ${C.border}`}}>
                  {item.foto_url
                    ? <img src={item.foto_url} style={{width:56,height:56,borderRadius:10,objectFit:"cover"}} alt={item.nome}/>
                    : <div style={{width:56,height:56,borderRadius:10,background:C.inputBg,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>📦</div>}
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:2}}>{item.nome}</div>
                    <div style={{fontSize:13,color:C.muted}}>{brl(item.preco_unit)} / un</div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <button onClick={()=>item.quantidade<=1?onRem(item.produto_id):onUpd(item.produto_id,item.quantidade-1)}
                      style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:6,
                        width:30,height:30,cursor:"pointer",color:C.text,fontSize:18,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>−</button>
                    <span style={{minWidth:28,textAlign:"center",fontWeight:700,color:C.text}}>{item.quantidade}</span>
                    <button onClick={()=>onUpd(item.produto_id,item.quantidade+1)}
                      style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:6,
                        width:30,height:30,cursor:"pointer",color:C.text,fontSize:18,
                        display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
                  </div>
                  <div style={{minWidth:80,textAlign:"right"}}>
                    <div style={{fontWeight:700,color:C.accent}}>{brl(item.subtotal)}</div>
                    <button onClick={()=>onRem(item.produto_id)}
                      style={{background:"none",border:"none",color:C.red,cursor:"pointer",fontSize:11,
                        fontFamily:"inherit",padding:"2px 0"}}>remover</button>
                  </div>
                </div>
              ))}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"16px 0",borderTop:`2px solid ${C.border}`,marginTop:8}}>
                <span style={{fontWeight:700,color:C.text,fontSize:16}}>Total do pedido</span>
                <span style={{fontWeight:900,color:C.accent,fontSize:22}}>{brl(total)}</span>
              </div>
              <button onClick={onConfirmar}
                style={{width:"100%",background:C.accent,color:"#fff",border:"none",
                  borderRadius:12,padding:"16px",fontSize:16,fontWeight:700,
                  cursor:"pointer",fontFamily:"inherit",
                  boxShadow:`0 4px 20px ${C.accentGlow}`,marginBottom:12}}>
                Continuar e preencher dados 💜
              </button>
              <button onClick={onFechar}
                style={{width:"100%",background:"none",border:`1px solid ${C.border}`,
                  borderRadius:10,padding:"12px",fontSize:14,color:C.muted,
                  cursor:"pointer",fontFamily:"inherit"}}>
                Continuar comprando
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Loja() {
  const [catalogo, setCatalogo] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [etapa, setEtapa] = useState("loja");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCat, setLoadingCat] = useState(true);
  const [produtoSel, setProdutoSel] = useState(null);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);

  useEffect(() => {
    supabase.from("catalogo").select("*")
      .eq("em_estoque", true).gt("qtd_estoque", 0)
      .order("created_at", {ascending:false})
      .then(({data}) => { if(data) setCatalogo(data); setLoadingCat(false); });
  }, []);

  const total = carrinho.reduce((s,i)=>s+i.subtotal,0);

  const addItem = (prod) => {
    setCarrinho(c => {
      const ex = c.find(x=>x.produto_id===prod.id);
      if(ex) return c.map(x=>x.produto_id===prod.id?{...x,quantidade:x.quantidade+1,subtotal:(x.quantidade+1)*x.preco_unit}:x);
      return [...c,{produto_id:prod.id,nome:prod.nome,quantidade:1,preco_unit:prod.preco_venda,subtotal:prod.preco_venda,foto_url:prod.foto_url}];
    });
  };

  const remItem = (pid) => setCarrinho(c=>c.filter(x=>x.produto_id!==pid));
  const updQtd = (pid, q) => {
    const qtd = parseInt(q)||1;
    setCarrinho(c=>c.map(x=>x.produto_id===pid?{...x,quantidade:qtd,subtotal:qtd*x.preco_unit}:x));
  };

  const irParaForm = () => { setCarrinhoAberto(false); setEtapa("form"); };

  const enviarPedido = async () => {
    if(!nome.trim()) return alert("Preencha seu nome.");
    if(!whatsapp.trim()) return alert("Preencha seu WhatsApp.");
    if(carrinho.length===0) return alert("Selecione pelo menos um item.");
    setLoading(true);
    try {
      const {data:ped} = await supabase.from("pedidos").select("numero").order("numero",{ascending:false}).limit(1);
      const num = (ped&&ped.length>0?(ped[0].numero||0):0)+1;
      await supabase.from("pedidos").insert({
        numero:num, cliente_nome:nome, cliente_email:email, cliente_whatsapp:whatsapp,
        total, status:"aguardando confirmação", forma_pagamento:"a definir",
        data:new Date().toLocaleDateString("pt-BR"),
        itens:JSON.stringify(carrinho), origem:"loja_publica",
        obs:`Pedido via loja | WhatsApp: ${whatsapp}${email?" | Email: "+email:""}`,
      });
      for(const item of carrinho) {
        const prod = catalogo.find(p=>p.id===item.produto_id);
        if(prod&&prod.em_estoque)
          await supabase.from("catalogo").update({qtd_estoque:Math.max(0,(prod.qtd_estoque||0)-item.quantidade)}).eq("id",item.produto_id);
      }
      setEtapa("sucesso");
    } catch(e) { alert("Erro ao enviar pedido. Tente novamente."); }
    setLoading(false);
  };

  const resetar = () => { setEtapa("loja"); setCarrinho([]); setNome(""); setEmail(""); setWhatsapp(""); };

  if(etapa==="sucesso") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif"}}>
      <Header carrinho={[]} onVerCarrinho={()=>{}}/>
      <div style={{maxWidth:500,margin:"60px auto",padding:"0 20px",textAlign:"center"}}>
        <div style={{fontSize:64,marginBottom:16}}>💜</div>
        <h2 style={{color:C.text,fontSize:26,fontWeight:800,margin:"0 0 16px"}}>Pedido enviado!</h2>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,
          padding:32,marginBottom:28,boxShadow:"0 4px 24px rgba(147,51,234,0.1)"}}>
          <p style={{color:C.text,fontSize:15,lineHeight:1.8,margin:0}}>
            Você acabou de enviar seu pedido, em breve entraremos em contato. 💜<br/><br/>
            <strong>Muito obrigada por nos escolher</strong>, preparamos tudo com muito carinho pra você!
          </p>
        </div>
        <p style={{color:C.muted,fontSize:14,marginBottom:20}}>Caso queira falar conosco é só clicar no botão abaixo</p>
        <WaBtn big={true}/>
        <div style={{marginTop:24}}>
          <button onClick={resetar}
            style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:13,fontFamily:"inherit"}}>
            ← Fazer novo pedido
          </button>
        </div>
      </div>
    </div>
  );

  if(etapa==="form") return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif"}}>
      <Header carrinho={carrinho} onVerCarrinho={()=>setCarrinhoAberto(true)}/>
      {carrinhoAberto && <CarrinhoModal carrinho={carrinho} catalogo={catalogo}
        onUpd={updQtd} onRem={remItem}
        onFechar={()=>setCarrinhoAberto(false)} onConfirmar={irParaForm}/>}
      <div style={{maxWidth:560,margin:"0 auto",padding:"32px 20px"}}>
        <button onClick={()=>setEtapa("loja")}
          style={{background:"none",border:"none",color:C.accent,cursor:"pointer",fontSize:14,fontFamily:"inherit",marginBottom:20}}>
          ← Voltar ao catálogo
        </button>
        <h2 style={{color:C.text,fontSize:22,fontWeight:800,marginBottom:6}}>Quase lá! 💜</h2>
        <p style={{color:C.muted,fontSize:14,marginBottom:24}}>Confirme seu pedido e preencha seus dados</p>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:20}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>Resumo do pedido</div>
          {carrinho.map(item=>(
            <div key={item.produto_id}
              style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {item.foto_url&&<img src={item.foto_url} style={{width:36,height:36,borderRadius:8,objectFit:"cover"}} alt={item.nome}/>}
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>{item.nome}</div>
                  <div style={{fontSize:12,color:C.muted}}>{brl(item.preco_unit)} × {item.quantidade}</div>
                </div>
              </div>
              <div style={{fontWeight:700,color:C.accent}}>{brl(item.subtotal)}</div>
            </div>
          ))}
          <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0 0",fontWeight:800,fontSize:16}}>
            <span style={{color:C.text}}>Total</span>
            <span style={{color:C.accent}}>{brl(total)}</span>
          </div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:24,display:"flex",flexDirection:"column",gap:14}}>
          <div style={{fontSize:13,fontWeight:700,color:C.text}}>Seus dados</div>
          {[["Nome completo *",nome,setNome,"text","Seu nome completo"],
            ["Email",email,setEmail,"email","seu@email.com (opcional)"],
            ["WhatsApp *",whatsapp,setWhatsapp,"tel","(16) 99999-9999"]].map(([lb,val,setter,type,ph])=>(
            <div key={lb} style={{display:"flex",flexDirection:"column",gap:6}}>
              <label style={{fontSize:12,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".06em"}}>{lb}</label>
              <input type={type} value={val} onChange={e=>setter(e.target.value)} placeholder={ph}
                style={{background:C.inputBg,border:`1px solid ${C.border}`,borderRadius:8,
                  padding:"11px 14px",color:C.text,fontSize:14,fontFamily:"inherit",
                  outline:"none",width:"100%",boxSizing:"border-box"}}
                onFocus={e=>e.target.style.borderColor=C.accent}
                onBlur={e=>e.target.style.borderColor=C.border}/>
            </div>
          ))}
        </div>
        <button onClick={enviarPedido} disabled={loading}
          style={{width:"100%",background:C.accent,color:"#fff",border:"none",borderRadius:12,
            padding:"16px",fontSize:16,fontWeight:700,cursor:loading?"not-allowed":"pointer",
            boxShadow:`0 4px 20px ${C.accentGlow}`,opacity:loading?0.7:1,fontFamily:"inherit"}}>
          {loading?"Enviando...":"💜 Confirmar pedido"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,fontFamily:"'DM Sans',sans-serif"}}>
      <Header carrinho={carrinho} onVerCarrinho={()=>setCarrinhoAberto(true)}/>

      {produtoSel && (
        <ProdutoModal
          prod={produtoSel}
          noCarrinho={carrinho.find(x=>x.produto_id===produtoSel.id)}
          onAdd={(p)=>{addItem(p);}}
          onUpd={updQtd}
          onRem={(id)=>{remItem(id);}}
          onClose={()=>setProdutoSel(null)}
        />
      )}

      {carrinhoAberto && (
        <CarrinhoModal carrinho={carrinho} catalogo={catalogo}
          onUpd={updQtd} onRem={remItem}
          onFechar={()=>setCarrinhoAberto(false)}
          onConfirmar={irParaForm}/>
      )}

      <div style={{maxWidth:960,margin:"0 auto",padding:"32px 20px"}}>
        <div style={{textAlign:"center",marginBottom:36}}>
          <h1 style={{color:C.text,fontSize:28,fontWeight:900,margin:"0 0 8px"}}>Nosso Catálogo 💜</h1>
          <p style={{color:C.muted,fontSize:15}}>Clique em um produto para ver detalhes e adicionar ao pedido</p>
        </div>

        {loadingCat ? (
          <div style={{textAlign:"center",padding:80,color:C.muted,fontSize:16}}>Carregando produtos...</div>
        ) : catalogo.length===0 ? (
          <div style={{textAlign:"center",padding:80}}>
            <div style={{fontSize:48,marginBottom:16}}>🛍️</div>
            <p style={{color:C.muted,fontSize:16,marginBottom:20}}>Nenhum produto disponível no momento</p>
            <WaBtn text="Fale conosco para encomendas"/>
          </div>
        ) : (
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
            {catalogo.map(prod => {
              const noCarrinho = carrinho.find(x=>x.produto_id===prod.id);
              return (
                <div key={prod.id}
                  style={{background:C.card,border:`1px solid ${noCarrinho?C.accent:C.border}`,
                    borderRadius:16,overflow:"hidden",cursor:"pointer",
                    boxShadow:noCarrinho?`0 4px 20px ${C.accentGlow}`:"0 2px 12px rgba(147,51,234,0.06)",
                    transition:"transform .2s,box-shadow .2s",position:"relative"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 32px rgba(147,51,234,0.2)`;}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow=noCarrinho?`0 4px 20px ${C.accentGlow}`:"0 2px 12px rgba(147,51,234,0.06)";}}
                  onClick={()=>setProdutoSel(prod)}>
                  {noCarrinho && (
                    <div style={{position:"absolute",top:10,right:10,background:C.accent,
                      color:"#fff",borderRadius:20,padding:"3px 10px",fontSize:12,fontWeight:700,zIndex:1}}>
                      {noCarrinho.quantidade} no pedido
                    </div>
                  )}
                  {prod.foto_url
                    ? <img src={prod.foto_url} alt={prod.nome} style={{width:"100%",height:200,objectFit:"cover"}}/>
                    : <div style={{width:"100%",height:200,background:C.inputBg,
                        display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>📦</div>}
                  <div style={{padding:18}}>
                    <div style={{fontWeight:700,color:C.text,fontSize:16,marginBottom:4}}>{prod.nome}</div>
                    {prod.descricao&&<div style={{fontSize:13,color:C.muted,marginBottom:12,lineHeight:1.5,
                      display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",overflow:"hidden"}}>{prod.descricao}</div>}
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                      <div style={{fontSize:22,fontWeight:900,color:C.accent}}>{brl(prod.preco_venda)}</div>
                      <div style={{fontSize:12,fontWeight:600,color:prod.qtd_estoque>3?C.green:C.yellow}}>
                        {prod.qtd_estoque>3?`✓ ${prod.qtd_estoque} disp.`:`⚠️ ${prod.qtd_estoque} un`}
                      </div>
                    </div>
                    <div style={{width:"100%",background:noCarrinho?C.accentSoft:C.inputBg,
                      border:`1px solid ${noCarrinho?C.accentGlow:C.border}`,
                      borderRadius:10,padding:"10px",fontSize:14,fontWeight:700,
                      color:noCarrinho?C.accent:C.muted,textAlign:"center"}}>
                      {noCarrinho?`✓ ${noCarrinho.quantidade} adicionado(s) — ver detalhes`:"Ver detalhes e adicionar"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div style={{textAlign:"center",marginTop:48,paddingTop:32,borderTop:`1px solid ${C.border}`}}>
          <p style={{color:C.muted,fontSize:13,marginBottom:12}}>Prefere um pedido personalizado?</p>
          <WaBtn/>
        </div>
      </div>

      {carrinho.length>0 && !carrinhoAberto && !produtoSel && (
        <div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:20}}>
          <button onClick={()=>setCarrinhoAberto(true)}
            style={{background:C.accent,color:"#fff",border:"none",borderRadius:50,
              padding:"16px 32px",fontWeight:700,fontSize:15,cursor:"pointer",
              fontFamily:"inherit",boxShadow:`0 8px 32px ${C.accentGlow}`,whiteSpace:"nowrap",
              display:"flex",alignItems:"center",gap:10}}>
            🛒 Ver pedido · {brl(total)}
          </button>
        </div>
      )}
    </div>
  );
}
