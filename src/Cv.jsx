import { useState, useEffect, useRef } from "react";


const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { background: #06090f; font-family: 'DM Sans', sans-serif; color: #e2e8f0; overflow: hidden; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #1e2d42; border-radius: 4px; }
    @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.2} }
    @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
    @keyframes fadeSlide { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
    @keyframes pulse     { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.4)} 50%{box-shadow:0 0 0 6px rgba(59,130,246,0)} }
    @keyframes photoRing { 0%,100%{box-shadow:0 0 0 2px #1e2d42,0 0 0 4px #06090f} 50%{box-shadow:0 0 0 2px #3b82f6,0 0 0 4px #06090f,0 0 20px rgba(59,130,246,0.25)} }
  `}</style>
);

const NAV = [
  { id:"overview",  icon:"⬡", label:"Overview"  },
  { id:"about",     icon:"◈", label:"About"      },
  { id:"education", icon:"▣", label:"Educación"  },
  { id:"projects",  icon:"◉", label:"Proyectos"  },
  { id:"skills",    icon:"◈", label:"Skills"     },
  { id:"contact",   icon:"◎", label:"Contacto"   },
];

const SKILLS = [
  { cat:"Mobile",         color:"#a78bfa", items:[["Kotlin",88],["Jetpack Compose",83],["MVVM",80],["Android SDK",77]] },
  { cat:"Frontend",       color:"#38bdf8", items:[["React",85],["TypeScript",78],["TailwindCSS",82],["Vite",80]] },
  { cat:"Backend",        color:"#34d399", items:[["NestJS",80],["Laravel",72],["C# .NET",68],["MongoDB",76]] },
  { cat:"DevOps & Cloud", color:"#fbbf24", items:[["AWS EC2",65],["Nginx + PM2",70],["Vercel",85],["Git / GitHub",90]] },
];

const PROJECTS = [
  { num:"01", name:"CENEVAL Platform", status:"En producción", color:"#3b82f6",
    desc:"Plataforma de exámenes de práctica para universitarios mexicanos (EGEL/CENEVAL). Auth con Clerk, pagos Stripe, modo examen cronometrado y dashboard de resultados.",
    stack:["React","Vite","TypeScript","Supabase","Stripe","Clerk","Vercel"] },
  { num:"02", name:"EduSync", status:"Completado", color:"#a78bfa",
    desc:"App Android gamificada para gestión de tareas académicas con sistema de recompensas. MVVM, Material Design 3, Room DB.",
    stack:["Kotlin","Jetpack Compose","MVVM","Room DB","MD3"] },
  { num:"03", name:"SOA E-commerce", status:"Completado", color:"#34d399",
    desc:"Sistema con doble backend: NestJS/MongoDB para usuarios y C#/.NET/SQL Server para catálogo. Frontend React con JWT y módulo POS. Desplegado en AWS EC2.",
    stack:["NestJS","C# .NET","MongoDB","AWS EC2","React","Nginx"] },
  { num:"04", name:"Sistema de Contactos", status:"Completado", color:"#fbbf24",
    desc:"App de gestión de contactos con backend Laravel y frontend Android nativo. Auth, CRUD completo y sincronización entre plataformas.",
    stack:["Laravel","PHP","MySQL","Android","Kotlin"] },
];

const Dot = ({ color="#34d399" }) => (
  <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:color, animation:"blink 1.8s infinite", flexShrink:0 }}/>
);

const Tag = ({ children, color="#3b82f6" }) => (
  <span style={{
    fontFamily:"'JetBrains Mono',monospace", fontSize:10, letterSpacing:"0.06em",
    padding:"3px 9px", borderRadius:4, whiteSpace:"nowrap",
    background:`${color}12`, border:`1px solid ${color}35`, color,
  }}>{children}</span>
);

const SecHeader = ({ label, title }) => (
  <div style={{ marginBottom:36 }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#3b82f6", letterSpacing:"0.2em", textTransform:"uppercase", display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <span style={{color:"#2d3f55"}}>//</span>{label}<div style={{flex:1,height:1,background:"#1e2d42"}}/>
    </div>
    <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,3vw,40px)", fontWeight:800, letterSpacing:"-0.02em", lineHeight:1.1, whiteSpace:"pre-line" }}>{title}</h2>
  </div>
);

const PhotoCircle = ({ size = 180, showLabel = false }) => {
  const imgSrc = "/mi_foto.jpeg";

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14 }}>
      <div
        style={{
          width:size, height:size, borderRadius:"50%", overflow:"hidden",
          background:"#0f172a", boxShadow:"0 8px 30px rgba(0,0,0,0.4)",
          transition:"transform 0.25s ease",
        }}
        className="photo-container"
      >
        <img src={imgSrc} alt="Gael Rojo"
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}/>
      </div>
      {showLabel && (
        <>
          <span style={{ fontFamily:"'Syne', sans-serif", fontSize:16, fontWeight:700, color:"#e2e8f0", textAlign:"center" }}>
            Gael Rojo Fuentes
          </span>
          <span style={{ fontFamily:"'JetBrains Mono', monospace", fontSize:12, color:"#64748b", letterSpacing:"0.08em", textAlign:"center" }}>
            SOFTWARE ENGINEER
          </span>
        </>
      )}
      <style>{`.photo-container:hover { transform: scale(1.05); }`}</style>
    </div>
  );
};

/* ── PANELS ── */

const OverviewPanel = () => (
  <div style={{ animation:"fadeSlide 0.4s ease" }}>
    <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:24, marginBottom:24 }}>
      <div style={{ background:"#0d1520", border:"1px solid #1e2d42", borderRadius:12, padding:32, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#3b82f6,#06b6d4)" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:22, marginBottom:24 }}>
          <PhotoCircle size={80}/>
          <div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, marginBottom:10, fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#34d399", background:"rgba(52,211,153,0.08)", border:"1px solid rgba(52,211,153,0.2)", padding:"5px 14px", borderRadius:100 }}>
              <Dot/> Buscando oportunidad Jr
            </div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,3.5vw,50px)", fontWeight:800, letterSpacing:"-0.03em", lineHeight:0.95 }}>
              <span style={{ display:"block", color:"#e2e8f0" }}>Gael Rojo</span>
              <span style={{ display:"block", color:"transparent", WebkitTextStroke:"1.5px #3b82f6" }}>Fuentes.</span>
            </h1>
          </div>
        </div>
        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#06b6d4", letterSpacing:"0.1em", marginBottom:16 }}>// Software Engineer Jr · Android & Full Stack</p>
        <p style={{ fontSize:14, color:"#64748b", lineHeight:1.7, maxWidth:480, marginBottom:28 }}>
          Estudiante de Ingeniería en Software en la UPP con experiencia real en proyectos full-stack y Android. Apasionado por construir productos que resuelven problemas reales.
        </p>
        <div style={{ display:"flex", gap:12 }}>
          <a href="mailto:gael.rojofuentes@gmail.com" style={{ display:"inline-flex", alignItems:"center", gap:8, border:"1px solid #1e2d42", color:"#94a3b8", fontFamily:"'JetBrains Mono',monospace", fontSize:11, letterSpacing:"0.06em", padding:"11px 22px", borderRadius:6, textDecoration:"none", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="#3b82f6";e.currentTarget.style.color="#60a5fa"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e2d42";e.currentTarget.style.color="#94a3b8"}}>Contactar</a>
        </div>
      </div>

      <div style={{ background:"#0d1520", border:"1px solid #1e2d42", borderRadius:12, overflow:"hidden", width:285, flexShrink:0, boxShadow:"0 40px 80px rgba(0,0,0,0.4)", animation:"float 5s ease-in-out infinite" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, padding:"11px 16px", background:"#111b2b", borderBottom:"1px solid #1e2d42" }}>
          {["#ef4444","#f59e0b","#10b981"].map((c,i)=><span key={i} style={{ width:10, height:10, borderRadius:"50%", background:c, display:"inline-block" }}/>)}
          <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#64748b", marginLeft:6 }}>gael.json</span>
        </div>
        <div style={{ padding:"18px 22px" }}>
          {[[null,"{"],[" name",'"Gael Rojo Fuentes"'],[" role",'"Software Engineer Jr"'],[" location",'"Pachuca, México 🇲🇽"'],[" university",'"UPP · Ing. Software"'],[" focus","["],[null,'"Android"',"i"],[null,'"Full Stack"',"i"],[null,'"React + Kotlin"',"i"],[null,"]"],[" open_to_work","true","b"],[null,"}"]].map(([k,v,t],i)=>(
            <div key={i} style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, lineHeight:2, display:"flex", gap:8 }}>
              <span style={{ color:"#2d3f55", minWidth:22, textAlign:"right", userSelect:"none" }}>{i+1}</span>
              {k?.trim() && <span style={{ color:"#f87171" }}>&nbsp;&nbsp;"{k.trim()}"</span>}
              {k?.trim() && <span style={{ color:"#64748b" }}>:</span>}
              <span style={{ color: t==="b"?"#86efac": t==="i"?"#94a3b8": ["{","}","[","]"].includes(v)?"#64748b":"#fcd34d" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const AboutPanel = () => (
  <div style={{ animation:"fadeSlide 0.4s ease" }}>
    <SecHeader label="about_me" title={"Quién\nsoy."}/>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:32 }}>
      <div>
        {[<>Soy estudiante de <strong style={{color:"#e2e8f0"}}>Ingeniería en Software</strong> en la UPP. Me especializo en desarrollo Android nativo con Kotlin y en aplicaciones full-stack con React y NestJS.</>,<>Me mueve construir software que resuelva problemas reales — desde apps Android con Jetpack Compose hasta plataformas web con auth, pagos y base de datos en producción.</>,<>Trabajo bien en equipo, aprendo rápido y me adapto a nuevas tecnologías. Busco mi primera oportunidad profesional donde pueda aportar y crecer.</>].map((t,i)=><p key={i} style={{ fontSize:14, color:"#64748b", lineHeight:1.8, marginBottom:16 }}>{t}</p>)}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:2, marginTop:24, border:"1px solid #1e2d42", borderRadius:10, overflow:"hidden" }}>
          {[["📍","Ubicación","Pachuca, México"],["🎓","Universidad","UPP — Ing. Software"],["🌐","Idiomas","Español · Inglés técnico"],["☕","Ambiente","Cafeterías + código"]].map(([icon,label,val])=>(
            <div key={label} style={{ background:"#0d1520", padding:"16px 20px" }}>
              <div style={{ fontSize:16, marginBottom:4 }}>{icon}</div>
              <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#64748b", letterSpacing:"0.1em", marginBottom:2 }}>{label.toUpperCase()}</div>
              <div style={{ fontSize:13, color:"#94a3b8" }}>{val}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {[{cat:"MOBILE",color:"#a78bfa",tags:["Kotlin","Jetpack Compose","MVVM","Material Design 3","Android SDK"]},{cat:"FRONTEND",color:"#38bdf8",tags:["React","TypeScript","Vite","TailwindCSS","Framer Motion","Clerk","Stripe"]},{cat:"BACKEND",color:"#34d399",tags:["NestJS","Node.js","Laravel","PHP","C# .NET","JWT Auth"]},{cat:"DATOS & CLOUD",color:"#fbbf24",tags:["MongoDB","MySQL","SQL Server","Supabase","AWS EC2","Vercel","Nginx"]}].map(({cat,color,tags})=>(
          <div key={cat} style={{ marginBottom:22 }}>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color, letterSpacing:"0.12em", marginBottom:10, display:"flex", alignItems:"center", gap:8 }}>{cat}<div style={{flex:1,height:1,background:"#1e2d42"}}/></div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{tags.map(t=><Tag key={t} color={color}>{t}</Tag>)}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── EDUCATION PANEL — solo formación académica, sin proyectos ── */
const EducationPanel = () => {

  const COURSES = [
    {
      area: "DESARROLLO MÓVIL",
      color: "#a78bfa",
      icon: "📱",
      subjects: [
        { name: "Desarrollo Móvil 1 & 2", learn: "Android nativo con Kotlin, Jetpack Compose, arquitectura MVVM y Material Design 3." },
        { name: "Programación Orientada a Objetos", learn: "Principios SOLID, patrones de diseño y herencia aplicada a Kotlin y Java." },
      ],
    },
    {
      area: "DESARROLLO WEB & BACKEND",
      color: "#38bdf8",
      icon: "🌐",
      subjects: [
        { name: "Desarrollo Web", learn: "HTML, CSS, JavaScript, React y consumo de APIs REST." },
        { name: "Programación del Lado del Servidor", learn: "PHP, Laravel, NestJS, manejo de rutas, middlewares y autenticación JWT." },
        { name: "Arquitectura Orientada a Servicios", learn: "Diseño de sistemas SOA, microservicios, integración de múltiples backends y despliegue en AWS EC2." },
      ],
    },
    {
      area: "BASES DE DATOS",
      color: "#34d399",
      icon: "🗄️",
      subjects: [
        { name: "Bases de Datos Relacionales", learn: "Modelado entidad-relación, SQL avanzado, MySQL y SQL Server." },
        { name: "Bases de Datos No Relacionales", learn: "MongoDB, diseño de documentos, índices y agregaciones." },
        { name: "Minería de Datos", learn: "Algoritmos de clustering, clasificación y sistemas de recomendación con Python y scikit-learn." },
      ],
    },
    {
      area: "INFRAESTRUCTURA & SEGURIDAD",
      color: "#fbbf24",
      icon: "🔐",
      subjects: [
        { name: "Seguridad Informática", learn: "OWASP Top 10, análisis de vulnerabilidades con ZAP, implementación de 2FA y buenas prácticas de hardening." },
        { name: "Redes y Sistemas Operativos", learn: "Configuración de servidores Linux, Nginx como proxy inverso y fundamentos de redes TCP/IP." },
      ],
    },
    {
      area: "INTELIGENCIA ARTIFICIAL",
      color: "#f472b6",
      icon: "🤖",
      subjects: [
        { name: "Inteligencia Artificial", learn: "Redes neuronales, algoritmos genéticos y lógica difusa aplicada a la resolución de problemas." },
        { name: "Aprendizaje Automático", learn: "Modelos supervisados y no supervisados, filtrado colaborativo y evaluación de modelos con scikit-learn." },
      ],
    },
  ];

  return (
    <div style={{ animation:"fadeSlide 0.4s ease" }}>
      <SecHeader label="education" title={"Formación\nacadémica."}/>

      {/* Institución */}
      <div style={{
        background:"#0d1520", border:"1px solid #1e2d42", borderRadius:12,
        padding:"24px 28px", marginBottom:36,
        borderLeft:"3px solid #3b82f6", position:"relative", overflow:"hidden",
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"linear-gradient(90deg,#3b82f6,#06b6d4)" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#e2e8f0", marginBottom:4 }}>
              Universidad Politécnica de Pachuca
            </div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#3b82f6", marginBottom:10 }}>
              Ingeniería en Software · Hidalgo, México
            </div>
            <p style={{ fontSize:13, color:"#64748b", lineHeight:1.7, maxWidth:520 }}>
              Carrera enfocada en el diseño, desarrollo y despliegue de sistemas de software. 
              Formación práctica con proyectos reales en cada cuatrimestre, abarcando mobile, web, 
              bases de datos, seguridad e inteligencia artificial.
            </p>
          </div>
          <div style={{
            background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.2)",
            borderRadius:8, padding:"12px 20px", textAlign:"center", flexShrink:0,
          }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#3b82f6" }}>2023</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#64748b", letterSpacing:"0.1em", marginTop:2 }}>— 2026</div>
            <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:"#34d399", letterSpacing:"0.08em", marginTop:6 }}>EN CURSO</div>
          </div>
        </div>
      </div>

      {/* Materias por área */}
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#64748b", letterSpacing:"0.15em", marginBottom:20 }}>
        ÁREAS DE CONOCIMIENTO
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {COURSES.map(({ area, color, icon, subjects }) => (
          <div key={area} style={{
            background:"#0d1520", border:"1px solid #1e2d42", borderRadius:10,
            padding:22, transition:"border-color 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = `${color}40`}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#1e2d42"}
          >
            {/* Header del área */}
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18, paddingBottom:14, borderBottom:"1px solid #1e2d42" }}>
              <span style={{ fontSize:18 }}>{icon}</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color, letterSpacing:"0.12em" }}>
                {area}
              </span>
            </div>

            {/* Materias */}
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {subjects.map(({ name, learn }) => (
                <div key={name}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }}/>
                    <span style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#e2e8f0" }}>
                      {name}
                    </span>
                  </div>
                  <p style={{ fontSize:12, color:"#64748b", lineHeight:1.6, paddingLeft:13 }}>
                    {learn}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsPanel = () => (
  <div style={{ animation:"fadeSlide 0.4s ease" }}>
    <SecHeader label="projects" title={"Lo que\nhe construido."}/>
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
      {PROJECTS.map((p,i)=>(
        <div key={i} style={{ background:"#0d1520", border:"1px solid #1e2d42", borderRadius:12, padding:28, gridColumn:i===0?"1 / -1":"auto", cursor:"pointer", position:"relative", overflow:"hidden", transition:"all 0.25s" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=`${p.color}50`;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.querySelector(".tl").style.transform="scaleX(1)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e2d42";e.currentTarget.style.transform="translateY(0)";e.currentTarget.querySelector(".tl").style.transform="scaleX(0)";}}>
          <div className="tl" style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${p.color},${p.color}60)`, transform:"scaleX(0)", transformOrigin:"left", transition:"transform 0.3s ease" }}/>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#64748b" }}>{p.num}</span>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, padding:"3px 10px", borderRadius:100, background:`${p.color}15`, border:`1px solid ${p.color}40`, color:p.color }}>{p.status}</span>
          </div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:i===0?22:18, fontWeight:700, color:"#e2e8f0", marginBottom:10 }}>{p.name}</div>
          <p style={{ fontSize:13, color:"#64748b", lineHeight:1.7, marginBottom:18 }}>{p.desc}</p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>{p.stack.map(s=><Tag key={s} color={p.color}>{s}</Tag>)}</div>
        </div>
      ))}
    </div>
  </div>
);

const SkillsPanel = () => (
  <div style={{ animation:"fadeSlide 0.4s ease" }}>
    <SecHeader label="skills" title={"Stack &\nherramientas."}/>
    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:16 }}>
      {SKILLS.map(({cat,color,items})=>(
        <div key={cat} style={{ background:"#0d1520", border:"1px solid #1e2d42", borderRadius:10, padding:24, transition:"border-color 0.2s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor=`${color}40`} onMouseLeave={e=>e.currentTarget.style.borderColor="#1e2d42"}>
          <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:20, paddingBottom:12, borderBottom:"1px solid #1e2d42" }}>{cat}</div>
          {items.map(([name,pct])=>(
            <div key={name} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#94a3b8" }}>{name}</span>
                <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#64748b" }}>{pct}%</span>
              </div>
              <div style={{ height:3, background:"#1e2d42", borderRadius:2, overflow:"hidden" }}>
                <div style={{ height:"100%", borderRadius:2, width:`${pct}%`, background:`linear-gradient(90deg,${color},${color}80)` }}/>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
    <div style={{ marginTop:16, background:"#0d1520", border:"1px solid #1e2d42", borderRadius:10, padding:24 }}>
      <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#64748b", letterSpacing:"0.12em", marginBottom:14 }}>HERRAMIENTAS</div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
        {["VS Code","Postman","Figma","Git","GitHub","Android Studio","Vite","PM2"].map(t=><Tag key={t} color="#64748b">{t}</Tag>)}
      </div>
    </div>
  </div>
);

const ContactPanel = () => (
  <div style={{ animation:"fadeSlide 0.4s ease", textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:400 }}>
    <div style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"#3b82f6", letterSpacing:"0.2em", marginBottom:16 }}>// CONTACT</div>
    <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(26px,3.5vw,48px)", fontWeight:800, letterSpacing:"-0.02em", lineHeight:1.1, marginBottom:12 }}>¿Tienes una<br/>oportunidad Jr?</h2>
    <p style={{ fontSize:14, color:"#64748b", marginBottom:40 }}>Estoy disponible para trabajar. Hablemos.</p>
    <a href="mailto:gael.rojofuenetes@gmail.com" style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(16px,2.2vw,28px)", fontWeight:800, color:"transparent", WebkitTextStroke:"1.5px #3b82f6", textDecoration:"none", marginBottom:48, transition:"all 0.3s" }}
      onMouseEnter={e=>{e.currentTarget.style.color="#60a5fa";e.currentTarget.style.WebkitTextStroke="0px"}}
      onMouseLeave={e=>{e.currentTarget.style.color="transparent";e.currentTarget.style.WebkitTextStroke="1.5px #3b82f6"}}>gael.rojofuentes@gmail.com</a>
    <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
      {[{label:"GitHub",href:"https://github.com/gaelrojo"},{label:"LinkedIn",href:"https://www.linkedin.com/in/gael-rojo-fuentes-39a4832b7/"},{label:"Instagram",href:"https://instagram.com/404_gael"}].map(({label,href})=>(
        <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:12, color:"#64748b", textDecoration:"none", padding:"10px 22px", border:"1px solid #1e2d42", borderRadius:6, transition:"all 0.2s", letterSpacing:"0.06em" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="#3b82f6";e.currentTarget.style.color="#60a5fa"}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="#1e2d42";e.currentTarget.style.color="#64748b"}}>{label}</a>
      ))}
    </div>
    <div style={{ marginTop:48, fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"#2d3f55", letterSpacing:"0.08em" }}>Pachuca, México 🇲🇽 · Disponible para trabajo remoto o local</div>
  </div>
);

const PANELS = { overview:<OverviewPanel/>, about:<AboutPanel/>, education:<EducationPanel/>, projects:<ProjectsPanel/>, skills:<SkillsPanel/>, contact:<ContactPanel/> };

export default function CV() {
  const [active, setActive] = useState("overview");
  const [time,   setTime]   = useState(new Date());
  const contentRef = useRef(null);

  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return ()=>clearInterval(t); },[]);
  useEffect(()=>{ contentRef.current?.scrollTo({top:0,behavior:"smooth"}); },[active]);

  const fmt = d => d.toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit",second:"2-digit"});

  return (
    <>
      <GlobalStyles/>
      <div style={{ display:"grid", gridTemplateColumns:"220px 1fr", gridTemplateRows:"48px 1fr", height:"100vh" }}>

        {/* TOP BAR */}
        <div style={{ gridColumn:"1 / -1", display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px 0 20px", background:"#0a111c", borderBottom:"1px solid #1e2d42", fontFamily:"'JetBrains Mono',monospace", fontSize:11 }}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <span style={{ color:"#3b82f6", fontWeight:600, letterSpacing:"0.1em" }}>GAEL.DEV</span>
            <span style={{ color:"#1e2d42" }}>|</span>
            <span style={{ color:"#2d3f55" }}>Curriculum Vitae · v2025</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, color:"#64748b" }}><Dot color="#34d399"/> Jr Dev · Open to work</div>
            <span style={{ color:"#2d3f55" }}>|</span>
            <span style={{ color:"#2d3f55" }}>{fmt(time)}</span>
          </div>
        </div>

        {/* SIDEBAR */}
        <aside style={{ background:"#0a111c", borderRight:"1px solid #1e2d42", display:"flex", flexDirection:"column", padding:"24px 0" }}>
          <div style={{ padding:"0 20px 24px", borderBottom:"1px solid #1e2d42", marginBottom:16 }}>
            <PhotoCircle size={64} showLabel/>
          </div>
          <nav style={{ flex:1, padding:"0 12px" }}>
            {NAV.map(({id,icon,label})=>(
              <button key={id} onClick={()=>setActive(id)} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"10px 12px", borderRadius:8, marginBottom:2, background:active===id?"rgba(59,130,246,0.12)":"transparent", border:active===id?"1px solid rgba(59,130,246,0.25)":"1px solid transparent", color:active===id?"#60a5fa":"#64748b", fontFamily:"'JetBrains Mono',monospace", fontSize:12, cursor:"pointer", textAlign:"left", letterSpacing:"0.04em", transition:"all 0.15s" }}
                onMouseEnter={e=>{ if(active!==id){e.currentTarget.style.background="rgba(255,255,255,0.03)";e.currentTarget.style.color="#94a3b8";}}}
                onMouseLeave={e=>{ if(active!==id){e.currentTarget.style.background="transparent";e.currentTarget.style.color="#64748b";}}}>
                <span style={{fontSize:14,opacity:0.7}}>{icon}</span>
                {label}
                {active===id && <div style={{marginLeft:"auto",width:4,height:4,borderRadius:"50%",background:"#3b82f6"}}/>}
              </button>
            ))}
          </nav>
          <div style={{ padding:"16px 12px 0", borderTop:"1px solid #1e2d42" }}>
            <a href="/CV_Gael_Rojo.pdf" download style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 12px", borderRadius:8, background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)", color:"#60a5fa", fontFamily:"'JetBrains Mono',monospace", fontSize:11, textDecoration:"none", letterSpacing:"0.04em", transition:"all 0.2s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(59,130,246,0.18)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(59,130,246,0.1)"}>↓ Descargar CV</a>
          </div>
        </aside>

        {/* MAIN */}
        <main ref={contentRef} style={{ overflow:"auto", padding:"36px 40px", background:"#06090f" }}>
          <div style={{ maxWidth:900, margin:"0 auto" }}>{PANELS[active]}</div>
        </main>

      </div>
    </>
  );
}