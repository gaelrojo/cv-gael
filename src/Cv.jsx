import { useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   PALETTE
   Light mode: bg #F6FAFD, surface #FFFFFF, mid #B3CFE5, accent #4A7FA7, dark #1A3D63, darkest #0A1931
   Dark mode:  bg #0A1931, surface #1A3D63, mid #1A3D63, accent #4A7FA7, text #F6FAFD
───────────────────────────────────────────── */

const SKILLS = [
  { cat: "Mobile",        color: "#4A7FA7", items: [["Kotlin",88],["Jetpack Compose",83],["MVVM",80],["Android SDK",77]] },
  { cat: "Frontend",      color: "#1A3D63", items: [["React",85],["TypeScript",78],["TailwindCSS",82],["Vite",80]] },
  { cat: "Backend",       color: "#4A7FA7", items: [["NestJS",80],["Laravel",72],["C# .NET",68],["MongoDB",76]] },
  { cat: "DevOps & Cloud",color: "#1A3D63", items: [["Git / GitHub",90],["Vercel",85],["Nginx + PM2",70],["AWS EC2",65]] },
];

const PROJECTS = [
  { num:"01", name:"CENEVAL Platform", status:"En producción", featured: true,
    desc:"Plataforma de exámenes de práctica para universitarios mexicanos (EGEL/CENEVAL). Auth con Clerk, pagos Stripe, modo examen cronometrado y dashboard de resultados.",
    stack:["React","Vite","TypeScript","Supabase","Stripe","Clerk","Vercel"] },
  { num:"02", name:"EduSync", status:"Completado",
    desc:"App Android gamificada para gestión de tareas académicas con sistema de recompensas. MVVM, Material Design 3, Room DB.",
    stack:["Kotlin","Jetpack Compose","MVVM","Room DB","MD3"] },
  { num:"03", name:"SOA E-commerce", status:"Completado",
    desc:"Doble backend NestJS/MongoDB y C#/.NET/SQL. Frontend React con JWT y módulo POS. AWS EC2.",
    stack:["NestJS","C# .NET","MongoDB","AWS EC2","React","Nginx"] },
  { num:"04", name:"Sistema de Contactos", status:"Completado",
    desc:"Gestión de contactos con backend Laravel y frontend Android nativo. Auth, CRUD y sincronización.",
    stack:["Laravel","PHP","MySQL","Kotlin","Android"] },
];

const COURSES = [
  { area:"MOBILE", icon:"📱", color:"#4A7FA7",
    subjects:[
      {name:"Desarrollo Móvil 1 & 2", desc:"Android nativo con Kotlin, Jetpack Compose, MVVM y Material Design 3."},
      {name:"Programación Orientada a Objetos", desc:"Principios SOLID, patrones de diseño aplicados en Kotlin y Java."},
    ]},
  { area:"WEB & BACKEND", icon:"🌐", color:"#1A3D63",
    subjects:[
      {name:"Desarrollo Web", desc:"HTML, CSS, JavaScript, React y consumo de APIs REST."},
      {name:"Programación del Servidor", desc:"PHP, Laravel, NestJS, middlewares y autenticación JWT."},
      {name:"Arquitectura SOA", desc:"Microservicios, integración de backends y despliegue en AWS EC2."},
    ]},
  { area:"BASES DE DATOS", icon:"🗄️", color:"#4A7FA7",
    subjects:[
      {name:"BD Relacionales", desc:"Modelado ER, SQL avanzado, MySQL y SQL Server."},
      {name:"BD No Relacionales", desc:"MongoDB, documentos, índices y agregaciones."},
      {name:"Minería de Datos", desc:"Clustering, clasificación y recomendaciones con scikit-learn."},
    ]},
  { area:"SEGURIDAD & IA", icon:"🤖", color:"#1A3D63",
    subjects:[
      {name:"Seguridad Informática", desc:"OWASP Top 10, análisis con ZAP, 2FA y hardening."},
      {name:"Inteligencia Artificial", desc:"Redes neuronales, algoritmos genéticos y lógica difusa."},
      {name:"Aprendizaje Automático", desc:"Modelos supervisados y no supervisados con scikit-learn."},
    ]},
];

const TICKER_ITEMS = ["Kotlin","React","NestJS","Jetpack Compose","TypeScript","Laravel","AWS EC2","MongoDB","MVVM","Supabase","Figma","Vite"];

// ── IPHONE SWITCH ──
function IPhoneSwitch({ dark, toggle }) {
  return (
    <button
      onClick={toggle}
      style={{
        width:44, height:26, borderRadius:100,
        background: dark ? "#4A7FA7" : "#334155",
        border:"none", cursor:"pointer",
        position:"relative", flexShrink:0,
        transition:"background 0.3s",
        padding:0, display:"flex", alignItems:"center",
      }}
    >
      <span style={{
        position:"absolute",
        left: dark ? "calc(100% - 22px)" : 3,
        width:20, height:20, borderRadius:"50%",
        background:"#ffffff",
        transition:"left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        boxShadow:"0 1px 4px rgba(0,0,0,0.35)",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11,
      }}>
        {dark ? "🌙" : "☀️"}
      </span>
    </button>
  );
}

// ── SECTION LABEL ──
function SecLabel({ text, dark }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:12,
      fontFamily:"'JetBrains Mono',monospace", fontSize:12,
      color: dark ? "#4A7FA7" : "#4A7FA7",
      letterSpacing:"0.2em", marginBottom:14,
    }}>
      <span style={{width:28,height:2,background:"#4A7FA7",display:"inline-block",flexShrink:0}}/>
      {text}
      <span style={{flex:1,height:1,background: dark ? "#1A3D63" : "#deedf8"}}/>
    </div>
  );
}

// ── TAG ──
function Tag({ children, dark }) {
  return (
    <span style={{
      fontFamily:"'JetBrains Mono',monospace", fontSize:12,
      padding:"4px 12px", borderRadius:5,
      border:`1px solid ${dark ? "#4A7FA7" : "#B3CFE5"}`,
      color: dark ? "#B3CFE5" : "#4A7FA7",
      background: dark ? "rgba(74,127,167,0.12)" : "#fff",
      whiteSpace:"nowrap",
    }}>{children}</span>
  );
}

// ── FLOATING CARD ──
function FloatCard({ title, value, sub, style, dark }) {
  return (
    <div style={{
      position:"absolute", background: dark ? "#1A3D63" : "#fff",
      border:`1px solid ${dark ? "#4A7FA7" : "#d4e6f3"}`,
      borderRadius:14, padding:"14px 18px",
      boxShadow: dark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(26,61,99,0.2)",
      zIndex: 10,
      ...style,
    }}>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",letterSpacing:"0.08em",marginBottom:5}}>{title}</div>
      <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:16,color: dark ? "#F6FAFD" : "#0A1931"}}>{value}</div>
      <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color: dark ? "#4A7FA7" : "#B3CFE5",marginTop:3}}>{sub}</div>
    </div>
  );
}

export default function GaelRojoLanding() {
  const [dark, setDark] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const C = {
    bg:       dark ? "#0A1931" : "#F6FAFD",
    surface:  dark ? "#112240" : "#ffffff",
    surface2: dark ? "#1A3D63" : "#F6FAFD",
    border:   dark ? "#1A3D63" : "#deedf8",
    borderMid:dark ? "#4A7FA7" : "#B3CFE5",
    text:     dark ? "#F6FAFD" : "#0A1931",
    textMid:  dark ? "#B3CFE5" : "#1A3D63",
    textSub:  dark ? "#4A7FA7" : "#4A7FA7",
    accent:   "#4A7FA7",
    navy:     dark ? "#B3CFE5" : "#1A3D63",
  };

  const sectionStyle = (alt) => ({
    padding:"100px 40px",
    background: alt ? C.surface2 : C.surface,
    borderBottom:`1px solid ${C.border}`,
    transition:"background 0.3s, border-color 0.3s",
  });

  const wrap = { maxWidth:1100, margin:"0 auto" };

  const h2Style = {
    fontFamily:"'Syne',sans-serif", fontWeight:800,
    fontSize:"clamp(32px,4vw,52px)", letterSpacing:"-0.03em",
    lineHeight:1.02, color:C.text, marginBottom:40,
    transition:"color 0.3s",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@400;500&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#4A7FA7;border-radius:4px}
        body{overflow-x:hidden}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}
        @keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .fade-in{animation:fadeUp 0.6s ease forwards}
        .fade-in-1{animation:fadeUp 0.6s 0.1s ease both}
        .fade-in-2{animation:fadeUp 0.6s 0.2s ease both}
        .fade-in-3{animation:fadeUp 0.6s 0.3s ease both}
        .fade-in-4{animation:fadeUp 0.6s 0.4s ease both}
        .float-card{animation:floatY 4s ease-in-out infinite}
        .float-card-2{animation:floatY 5s 1s ease-in-out infinite}
        .proj-card:hover{transform:translateY(-4px)!important;border-color:#4A7FA7!important;}
        .proj-card{transition:transform 0.25s,border-color 0.25s,box-shadow 0.25s!important}
        .proj-card:hover{box-shadow:0 12px 36px rgba(74,127,167,0.18)!important}
        .edu-card:hover{border-color:#4A7FA7!important;transform:translateY(-2px)!important}
        .edu-card{transition:all 0.2s!important}
        .sk-card:hover{border-color:#4A7FA7!important}
        .sk-card{transition:border-color 0.2s!important}
        .dl-btn:hover{transform:translateY(-3px)!important;box-shadow:0 16px 40px rgba(26,61,99,0.25)!important}
        .dl-btn{transition:all 0.2s!important}
        .soc-btn:hover{border-color:#4A7FA7!important;color:#4A7FA7!important;background:rgba(74,127,167,0.08)!important}
        .soc-btn{transition:all 0.2s!important}
      `}</style>

      <div style={{background:C.bg, color:C.text, transition:"background 0.3s, color 0.3s", minHeight:"100vh"}}>

        {/* TOP STRIPE gradient */}
        <div style={{height:3,background:"linear-gradient(90deg,#0A1931 0%,#1A3D63 25%,#4A7FA7 60%,#B3CFE5 85%,#F6FAFD 100%)"}}/>

        {/* ─── TOP BAR ─── */}
        <div style={{
          background: dark ? "#0a111c" : "#0A1931",
          borderBottom:"1px solid #1A3D63",
          padding:"0 32px",
          fontFamily:"'JetBrains Mono',monospace", fontSize:11,
          transition:"background 0.3s",
          position:"sticky", top:0, zIndex:200,
        }}>
          <div style={{
            maxWidth:1100, margin:"0 auto",
            display:"flex", alignItems:"center", justifyContent:"space-between",
            height:48,
          }}>
            {/* LEFT */}
            <div style={{display:"flex", alignItems:"center", gap:20}}>
              <span style={{color:"#4A7FA7", fontWeight:600, letterSpacing:"0.1em"}}>GAEL.DEV</span>
              <span style={{color:"#1A3D63"}}>|</span>
              <span style={{color:"#2d3f55", letterSpacing:"0.04em"}}>Curriculum Vitae · v2025</span>
            </div>
            {/* RIGHT */}
            <div style={{display:"flex", alignItems:"center", gap:18}}>
              {/* clock */}
              <span style={{color:"#2d3f55", letterSpacing:"0.06em", minWidth:72, textAlign:"right"}}>
                {time.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
              </span>
              <span style={{color:"#1A3D63"}}>|</span>
              {/* iPhone switch */}
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <span style={{color:"#2d3f55", fontSize:10, letterSpacing:"0.06em"}}>
                  {dark ? "DARK" : "LIGHT"}
                </span>
                <IPhoneSwitch dark={dark} toggle={() => setDark(d => !d)} />
              </div>
            </div>
          </div>
        </div>
        <section id="hero" style={{
          minHeight:"calc(100vh - 47px)", display:"flex", alignItems:"center",
          background: dark
            ? "linear-gradient(135deg,#0A1931 0%,#112240 50%,#1A3D63 100%)"
            : "linear-gradient(135deg,#F6FAFD 0%,#deedf8 50%,#F6FAFD 100%)",
          padding:"60px 40px 60px", position:"relative", overflow:"hidden",
          transition:"background 0.3s",
        }}>
          {/* BIG BG TEXT */}
          <div style={{
            position:"absolute", top:"50%", left:"50%",
            transform:"translate(-50%,-52%)",
            fontFamily:"'Syne',sans-serif", fontWeight:800,
            fontSize:"clamp(80px,16vw,200px)",
            color: dark ? "rgba(74,127,167,0.07)" : "rgba(179,207,229,0.25)",
            whiteSpace:"nowrap", pointerEvents:"none",
            letterSpacing:"-0.04em", userSelect:"none",
          }}>GAEL.DEV</div>

          <div style={{...wrap, display:"grid", gridTemplateColumns:"1fr 400px", gap:0, alignItems:"center", width:"100%"}}>
            {/* LEFT */}
            <div style={{paddingRight:48}}>
              <div className="fade-in" style={{
                display:"inline-flex", alignItems:"center", gap:8,
                fontFamily:"'JetBrains Mono',monospace", fontSize:11,
                color:"#1A3D63", background: dark ? "rgba(74,127,167,0.2)" : "#deedf8",
                border:`1px solid ${dark ? "#4A7FA7" : "#B3CFE5"}`,
                padding:"6px 16px", borderRadius:100, marginBottom:32,
              }}>
                <span style={{
                  width:7, height:7, borderRadius:"50%",
                  background:"#22c55e",
                  animation:"blink 2s infinite", display:"inline-block",
                  boxShadow:"0 0 6px rgba(34,197,94,0.7)",
                }}/>
                <span style={{color:C.textMid}}>Jr Dev - Open to work</span>
              </div>

              <h1 className="fade-in-1" style={{
                fontFamily:"'Syne',sans-serif", fontWeight:800,
                fontSize:"clamp(48px,6.5vw,84px)", letterSpacing:"-0.04em",
                lineHeight:0.92, marginBottom:24, color:C.text,
              }}>
                <span style={{display:"block"}}>Gael</span>
                <span style={{display:"block", color:"#4A7FA7"}}>Rojo</span>
                <span style={{
                  display:"block",
                  color:"transparent",
                  WebkitTextStroke:`2px ${dark ? "#4A7FA7" : "#1A3D63"}`,
                }}>Fuentes.</span>
              </h1>

              <p className="fade-in-2" style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:12,
                color:"#4A7FA7", letterSpacing:"0.12em", marginBottom:20,
              }}>// Software Engineer Jr · Android & Full Stack</p>

              <p className="fade-in-3" style={{
                fontSize:15, color:C.textMid, lineHeight:1.78,
                maxWidth:440, marginBottom:36, opacity:0.9,
              }}>
                Estudiante de Ingeniería en Software en la UPP con experiencia real
                en proyectos full-stack y Android. Apasionado por construir productos
                que resuelven problemas reales.
              </p>

              <div className="fade-in-4" style={{display:"flex", gap:12, flexWrap:"wrap", marginBottom:52}}>
                <a href="mailto:gael.rojofuentes@gmail.com" style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:12,
                  padding:"13px 28px", background:C.navy,
                  color: dark ? "#0A1931" : "#F6FAFD",
                  borderRadius:8, letterSpacing:"0.04em",
                  display:"inline-flex", alignItems:"center", gap:8,
                  transition:"opacity 0.2s",
                }}>Contactar →</a>
                <a href="#projects" style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:12,
                  padding:"13px 28px", background:"transparent",
                  color:C.textSub, borderRadius:8,
                  border:`1.5px solid ${C.borderMid}`,
                  letterSpacing:"0.04em", transition:"all 0.2s",
                }}>Ver proyectos</a>
                <a href="/CV_Gael_Rojo.pdf" download style={{
                  fontFamily:"'JetBrains Mono',monospace", fontSize:12,
                  padding:"13px 28px", background:"transparent",
                  color: dark ? "#4A7FA7" : "#4A7FA7", borderRadius:8,
                  border:`1.5px solid ${dark ? "#4A7FA7" : "#4A7FA7"}`,
                  letterSpacing:"0.04em", transition:"all 0.2s",
                  display:"inline-flex", alignItems:"center", gap:8,
                }}>↓ Descargar CV</a>
              </div>

              {/* STATS */}
              <div style={{display:"flex", gap:36}}>
                {[["4+","PROYECTOS"],["3","AÑOS EN UPP"],["10+","TECNOLOGÍAS"]].map(([n,l])=>(
                  <div key={l}>
                    <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:30,color:C.text,letterSpacing:"-0.03em"}}>{n}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",letterSpacing:"0.1em",marginTop:3}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — PHOTO */}
            <div style={{
              position:"relative",
              display:"flex", justifyContent:"center", alignItems:"center",
              height:400, marginTop:40,
            }}>
              {/* PHOTO CIRCLE — zIndex:1 so cards (zIndex:10) float above */}
              <div style={{
                width:320, height:320, borderRadius:"50%",
                background: dark
                  ? "linear-gradient(160deg,#1A3D63,#0A1931)"
                  : "linear-gradient(160deg,#deedf8,#B3CFE5)",
                display:"flex", alignItems:"center", justifyContent:"center",
                overflow:"hidden", position:"relative", zIndex:1,
                border:`3px solid ${dark ? "#4A7FA7" : "rgba(179,207,229,0.7)"}`,
                boxShadow: dark
                  ? "0 24px 60px rgba(0,0,0,0.4)"
                  : "0 24px 60px rgba(26,61,99,0.2)",
                flexShrink:0,
              }}>
                {!imgError ? (
                  <img src="/mi_foto.jpeg" alt="Gael Rojo Fuentes"
                    onError={() => setImgError(true)}
                    style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                ) : (
                  <div style={{textAlign:"center",padding:24}}>
                    <div style={{fontSize:64}}>👨‍💻</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",marginTop:8}}>mi_foto.jpeg</div>
                  </div>
                )}
              </div>

              {/* FLOATING CARDS — rendered AFTER photo, zIndex:10 → always on top */}
              <FloatCard dark={dark} title="DISPONIBILIDAD" value="Open to work" sub="Remoto o local"
                style={{top:30, right:-20}} />
              <FloatCard dark={dark} title="UBICACIÓN" value="Pachuca 🇲🇽" sub="Hidalgo, México"
                style={{bottom:20, left:-10}} />
            </div>
          </div>
        </section>

        {/* ─── TICKER ─── */}
        <div style={{
          background: dark ? "#0A1931" : "#0A1931",
          borderTop:`1px solid #1A3D63`, borderBottom:`1px solid #1A3D63`,
          padding:"14px 0", overflow:"hidden",
        }}>
          <div style={{display:"flex",gap:0,animation:"ticker 22s linear infinite",width:"max-content"}}>
            {[...TICKER_ITEMS,...TICKER_ITEMS].map((item,i)=>(
              <div key={i} style={{
                fontFamily:"'JetBrains Mono',monospace", fontSize:12,
                color:"#B3CFE5", letterSpacing:"0.1em",
                padding:"0 36px", display:"flex", alignItems:"center", gap:14, whiteSpace:"nowrap",
              }}>
                {item} <span style={{color:"#4A7FA7"}}>·</span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── ABOUT ─── */}
        <section id="about" style={sectionStyle(false)}>
          <div style={{...wrap, display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"center"}}>
            <div>
              <SecLabel text="ABOUT ME" dark={dark}/>
              <h2 style={h2Style}>Quién<br/>soy.</h2>
              {[
                <>Soy estudiante de <strong style={{color:C.text}}>Ingeniería en Software</strong> en la UPP. Me especializo en desarrollo Android nativo con Kotlin y en aplicaciones full-stack con React y NestJS.</>,
                <>Me mueve construir software que resuelva problemas reales — desde apps Android con Jetpack Compose hasta plataformas web con auth, pagos y base de datos en producción.</>,
                <>Trabajo bien en equipo, aprendo rápido y me adapto a nuevas tecnologías. Busco mi primera oportunidad profesional donde pueda aportar y crecer.</>,
              ].map((t,i)=>(
                <p key={i} style={{fontSize:14,color:C.textMid,lineHeight:1.8,marginBottom:16,opacity:0.9}}>{t}</p>
              ))}
              <div style={{
                display:"grid", gridTemplateColumns:"1fr 1fr",
                gap:1, background:C.border,
                border:`1px solid ${C.border}`, borderRadius:12,
                overflow:"hidden", marginTop:32,
              }}>
                {[["📍","UBICACIÓN","Pachuca, México"],["🎓","UNIVERSIDAD","UPP — Ing. Software"],["🌐","IDIOMAS","Español · Inglés técnico"],["☕","AMBIENTE","Cafeterías + código"]].map(([icon,lbl,val])=>(
                  <div key={lbl} style={{background:C.surface2,padding:"18px 20px"}}>
                    <div style={{fontSize:14,marginBottom:6}}>{icon}</div>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",letterSpacing:"0.1em",marginBottom:3}}>{lbl}</div>
                    <div style={{fontSize:13,color:C.textMid,fontWeight:500}}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* ABOUT RIGHT */}
            <div>
              {/* Mini photo */}
              <div style={{display:"flex",justifyContent:"center",marginBottom:28,position:"relative"}}>
                <div style={{
                  width:200,height:200,borderRadius:20,
                  background: dark ? "linear-gradient(135deg,#1A3D63,#0A1931)" : "linear-gradient(135deg,#deedf8,#B3CFE5)",
                  overflow:"hidden", border:`2px solid ${C.borderMid}`,
                  boxShadow: dark ? "0 12px 40px rgba(0,0,0,0.3)" : "0 12px 40px rgba(26,61,99,0.12)",
                }}>
                  {!imgError ? (
                    <img src="/mi_foto.jpeg" alt="Gael"
                      onError={() => setImgError(true)}
                      style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/>
                  ) : (
                    <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>👨‍💻</div>
                  )}
                </div>
                <div style={{
                  position:"absolute", top:-10, right:40,
                  background: dark ? "#1A3D63" : "#0A1931",
                  color: dark ? "#B3CFE5" : "#F6FAFD",
                  fontFamily:"'JetBrains Mono',monospace", fontSize:10,
                  padding:"8px 14px", borderRadius:8, letterSpacing:"0.06em",
                }}>Software Jr 🚀</div>
              </div>

              {/* TAG GRID */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {[
                  {lbl:"📱 MOBILE",   tags:["Kotlin","Compose","MVVM","Android"]},
                  {lbl:"🌐 FRONTEND", tags:["React","TypeScript","Vite","Tailwind"]},
                  {lbl:"🛠 BACKEND",  tags:["NestJS","Laravel","C# .NET","MongoDB"]},
                  {lbl:"☁️ CLOUD",    tags:["AWS EC2","Vercel","Nginx","GitHub"]},
                ].map(({lbl,tags})=>(
                  <div key={lbl} style={{
                    background:C.surface, border:`1px solid ${C.border}`,
                    borderRadius:10, padding:"14px 16px",
                  }}>
                    <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",letterSpacing:"0.1em",marginBottom:10}}>{lbl}</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {tags.map(t=><Tag key={t} dark={dark}>{t}</Tag>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── EDUCATION ─── */}
        <section id="education" style={sectionStyle(true)}>
          <div style={wrap}>
            <SecLabel text="EDUCATION" dark={dark}/>
            <h2 style={h2Style}>Formación<br/>académica.</h2>

            {/* UNI CARD */}
            <div style={{
              background: dark ? "#0A1931" : "#0A1931",
              borderRadius:20, padding:"40px 48px", marginBottom:40,
              display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"center",
              position:"relative", overflow:"hidden",
              boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            }}>
              <div style={{
                position:"absolute", right:160, top:"50%", transform:"translateY(-50%)",
                fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:100,
                color:"rgba(179,207,229,0.05)", pointerEvents:"none", letterSpacing:"-0.04em",
              }}>UPP</div>
              <div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:22,color:"#F6FAFD",marginBottom:6}}>
                  Universidad Politécnica de Pachuca
                </div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",marginBottom:14}}>
                  Ingeniería en Software · Hidalgo, México
                </div>
                <p style={{fontSize:13,color:"#B3CFE5",lineHeight:1.7,maxWidth:500,opacity:0.85}}>
                  Carrera enfocada en el diseño, desarrollo y despliegue de sistemas de software.
                  Formación práctica con proyectos reales en cada cuatrimestre.
                </p>
              </div>
              <div style={{
                background:"rgba(74,127,167,0.2)",border:"1px solid rgba(74,127,167,0.4)",
                borderRadius:12,padding:"16px 24px",textAlign:"center",flexShrink:0,
              }}>
                <div style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,color:"#B3CFE5"}}>2023</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#4A7FA7",display:"block",marginTop:2}}>— 2026</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:"#74d399",display:"block",marginTop:8}}>EN CURSO</div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16}}>
              {COURSES.map(({area,icon,color,subjects})=>(
                <div key={area} className="edu-card" style={{
                  background:C.surface, border:`1px solid ${C.border}`,
                  borderRadius:14, padding:24, cursor:"default",
                }}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
                    <span style={{fontSize:16}}>{icon}</span>
                    <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color,letterSpacing:"0.12em"}}>{area}</span>
                  </div>
                  {subjects.map(({name,desc})=>(
                    <div key={name} style={{marginBottom:14}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                        <div style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>
                        <div style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:700,color:C.text}}>{name}</div>
                      </div>
                      <p style={{fontSize:12,color:C.textSub,lineHeight:1.6,paddingLeft:13}}>{desc}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PROJECTS ─── */}
        <section id="projects" style={sectionStyle(false)}>
          <div style={wrap}>
            <SecLabel text="PROJECTS" dark={dark}/>
            <h2 style={h2Style}>Lo que he<br/>construido.</h2>

            {/* FEATURED */}
            <div className="proj-card" style={{
              background:C.surface2, border:`1px solid ${C.border}`,
              borderRadius:20, padding:40, marginBottom:20,
              display:"grid", gridTemplateColumns:"1fr auto",
              gap:40, alignItems:"center", position:"relative", overflow:"hidden",
              cursor:"default",
            }}>
              <div style={{
                position:"absolute", right:24, bottom:-10,
                fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:120,
                color: dark ? "rgba(74,127,167,0.08)" : "rgba(179,207,229,0.3)",
                lineHeight:1, pointerEvents:"none", letterSpacing:"-0.04em",
              }}>01</div>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#1A3D63,#4A7FA7)"}}/>
              <div>
                <div style={{
                  display:"inline-flex",alignItems:"center",gap:6,
                  fontFamily:"'JetBrains Mono',monospace",fontSize:10,
                  color:dark?"#B3CFE5":"#1A3D63",
                  background:dark?"rgba(74,127,167,0.15)":"#deedf8",
                  border:`1px solid ${C.borderMid}`,
                  padding:"4px 12px",borderRadius:100,marginBottom:16,
                }}>
                  <span style={{width:6,height:6,borderRadius:"50%",background:"#4A7FA7",display:"inline-block"}}/>
                  En producción
                </div>
                <div style={{fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:32,color:C.text,marginBottom:12,letterSpacing:"-0.02em"}}>
                  CENEVAL Platform
                </div>
                <p style={{fontSize:14,color:C.textMid,lineHeight:1.75,opacity:0.85,marginBottom:20,maxWidth:560}}>
                  Plataforma de exámenes de práctica para universitarios mexicanos (EGEL/CENEVAL). Auth con Clerk, pagos Stripe, modo examen cronometrado y dashboard de resultados.
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {["React","Vite","TypeScript","Supabase","Stripe","Clerk","Vercel"].map(t=><Tag key={t} dark={dark}>{t}</Tag>)}
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16}}>
              {PROJECTS.filter(p=>!p.featured).map((p,i)=>(
                <div key={p.num} className="proj-card" style={{
                  background:C.surface2, border:`1px solid ${C.border}`,
                  borderRadius:14, padding:26, position:"relative",
                  overflow:"hidden", cursor:"default",
                }}>
                  <div style={{
                    position:"absolute",top:0,left:0,right:0,height:3,
                    background: i===0 ? "linear-gradient(90deg,#4A7FA7,#B3CFE5)"
                              : i===1 ? "linear-gradient(90deg,#0A1931,#1A3D63)"
                              : "linear-gradient(90deg,#1A3D63,#4A7FA7)",
                  }}/>
                  <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#B3CFE5",marginBottom:10}}>{p.num}</div>
                  <div style={{fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:17,color:C.text,marginBottom:8}}>{p.name}</div>
                  <p style={{fontSize:12,color:C.textMid,lineHeight:1.7,opacity:0.85,marginBottom:14}}>{p.desc}</p>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                    {p.stack.map(t=><Tag key={t} dark={dark}>{t}</Tag>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SKILLS ─── */}
        <section id="skills" style={{
          padding:"100px 40px",
          background: dark ? "#112240" : "#0A1931",
          borderBottom:`1px solid ${dark ? "#1A3D63" : "#1A3D63"}`,
          transition:"background 0.3s",
        }}>
          <div style={wrap}>
            <SecLabel text="SKILLS" dark={true}/>
            <h2 style={{...h2Style, color:"#F6FAFD"}}>Stack &<br/>herramientas.</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:16,marginBottom:16}}>
              {SKILLS.map(({cat,color,items})=>(
                <div key={cat} className="sk-card" style={{
                  background:"rgba(26,61,99,0.4)",
                  border:"1px solid rgba(74,127,167,0.25)",
                  borderRadius:14, padding:24,
                }}>
                  <div style={{
                    fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                    letterSpacing:"0.15em",color:"#B3CFE5",
                    marginBottom:20,paddingBottom:12,
                    borderBottom:"1px solid rgba(74,127,167,0.2)",
                  }}>{cat.toUpperCase()}</div>
                  {items.map(([name,pct])=>(
                    <div key={name} style={{marginBottom:14}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:"#B3CFE5"}}>{name}</span>
                        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#4A7FA7"}}>{pct}%</span>
                      </div>
                      <div style={{height:3,background:"rgba(74,127,167,0.2)",borderRadius:2,overflow:"hidden"}}>
                        <div style={{height:"100%",borderRadius:2,width:`${pct}%`,background:`linear-gradient(90deg,${color},#B3CFE5)`}}/>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div style={{
              background:"rgba(26,61,99,0.3)",
              border:"1px solid rgba(74,127,167,0.2)",
              borderRadius:14, padding:24,
            }}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#4A7FA7",letterSpacing:"0.12em",marginBottom:14}}>HERRAMIENTAS</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {["VS Code","Android Studio","Postman","Figma","Git","GitHub","Vite","PM2"].map(t=>(
                  <span key={t} style={{
                    fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                    padding:"5px 14px",borderRadius:5,
                    border:"1px solid rgba(74,127,167,0.3)",
                    color:"#B3CFE5",background:"rgba(74,127,167,0.1)",whiteSpace:"nowrap",
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CONTACT ─── */}
        <section id="contact" style={{
          padding:"100px 40px",
          background: dark ? "#0A1931" : "#F6FAFD",
          position:"relative", overflow:"hidden",
          transition:"background 0.3s",
        }}>
          <div style={{
            position:"absolute", bottom:-60, left:"50%", transform:"translateX(-50%)",
            fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:180,
            color: dark ? "rgba(74,127,167,0.06)" : "rgba(179,207,229,0.2)",
            whiteSpace:"nowrap", pointerEvents:"none", letterSpacing:"-0.04em",
          }}>HOLA</div>

          <div style={{maxWidth:860,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
            <SecLabel text="CONTACT" dark={dark}/>
            <h2 style={{...h2Style,fontSize:"clamp(36px,5vw,64px)",lineHeight:1}}>
              ¿Tienes una<br/>oportunidad Jr?
            </h2>
            <p style={{fontSize:15,color:C.textSub,marginBottom:48}}>Estoy disponible para trabajar. Hablemos.</p>

            <div style={{marginBottom:48}}>
              <a href="mailto:gael.rojofuentes@gmail.com" style={{
                fontFamily:"'Syne',sans-serif",fontWeight:800,
                fontSize:"clamp(18px,2.8vw,34px)",color:C.textMid,
                borderBottom:`3px solid #4A7FA7`,paddingBottom:6,
                transition:"color 0.2s",letterSpacing:"-0.02em",
              }}>gael.rojofuentes@gmail.com</a>
            </div>

            <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:48,flexWrap:"wrap"}}>
              {[
                {label:"GitHub",href:"https://github.com/gaelrojo"},
                {label:"LinkedIn",href:"https://www.linkedin.com/in/gael-rojo-fuentes-39a4832b7/"},
                
              ].map(({label,href})=>(
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="soc-btn" style={{
                  fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                  padding:"12px 24px",border:`1px solid ${C.borderMid}`,
                  borderRadius:8,color:C.textSub,letterSpacing:"0.06em",
                  background:"transparent",
                }}>{label}</a>
              ))}
            </div>

      

            <p style={{
              fontFamily:"'JetBrains Mono',monospace", fontSize:14,
              color: dark ? "#4A7FA7" : "#1A3D63",
              letterSpacing:"0.06em", opacity:0.75,
            }}>
              Pachuca, México 🇲🇽 &nbsp;·&nbsp; Disponible para trabajo remoto o local
            </p>
          </div>
        </section>

      </div>
    </>
  );
}