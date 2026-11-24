"use client";

import { useEffect, useRef, useState } from "react";
import { Award, BookOpen, Building2, CheckCircle2, Code2, Download, FileText, GraduationCap, Hash, IdCard, LockKeyhole, Mail, MapPin, Save, ShieldCheck, Sparkles, Upload, User } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PasswordStrength } from "@/components/password-strength";
import { SkillPicker } from "@/components/skill-picker";
import { checkPassword } from "@/lib/password-policy";
import { SEMESTER_NUMBERS } from "@/lib/student-options";
import { nombreVisibleCarrera } from "@/lib/career-name";
import { Panel, primaryButton, secondaryButton } from "@/components/dashboard-ui";

function SectionHeader({ icon: Icon, title, description, badge }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-amber-50 text-amber-600">
            <Icon size={16} />
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-slate-900">{title}</h2>
          {description && (
            <p className="mt-0.5 text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <CheckCircle2 size={13} className="text-emerald-600" />
          {badge}
        </span>
      )}
    </div>
  );
}

function RequiredLabel({ children, extra }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-1 text-xs font-semibold text-slate-700">
      <span>{children}</span>
      <span className="text-rose-600" aria-hidden="true">
        *
      </span>
      {extra && (
        <span className="text-[11px] font-medium text-rose-600">{extra}</span>
      )}
    </span>
  );
}

function IconInput({ icon: Icon, className = "", ...props }) {
  return (
    <div className="relative flex items-center">
      {Icon && (
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 text-slate-400"
          aria-hidden="true"
        />
      )}
      <input
        {...props}
        className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10 ${
          Icon ? "pl-10" : "pl-3.5"
        } ${className}`}
      />
    </div>
  );
}

function IconSelect({ icon: Icon, children, className = "", ...props }) {
  return (
    <div className="relative flex items-center">
      {Icon && (
        <Icon
          size={16}
          className="pointer-events-none absolute left-3.5 text-slate-400"
          aria-hidden="true"
        />
      )}
      <select
        {...props}
        className={`select-chevron w-full rounded-xl border border-slate-200 bg-white py-2.5 pr-9 text-sm text-slate-800 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10 ${
          Icon ? "pl-10" : "pl-3.5"
        } ${className}`}
      >
        {children}
      </select>
    </div>
  );
}

export default function StudentAccountPage() {
  const [fullName, setFullName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [location, setLocation] = useState("");
  const [career, setCareer] = useState("");
  const [semester, setSemester] = useState("");
  const [gpa, setGpa] = useState("");
  const [extract, setExtract] = useState("");
  const [skills, setSkills] = useState([]);
  const [catalogos, setCatalogos] = useState({ facultades: [], carreras: [], habilidades: [] });
  const [cv, setCv] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoCv, setSubiendoCv] = useState(false);
  const [cambiandoPassword, setCambiandoPassword] = useState(false);
  const [aviso, setAviso] = useState("");
  const [errorGuardado, setErrorGuardado] = useState("");
  const [error, setError] = useState("");
  const [cvAviso, setCvAviso] = useState("");
  const [passwordAviso, setPasswordAviso] = useState("");
  const fileInput = useRef(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordReady = Boolean(currentPassword && newPassword && checkPassword(newPassword).valid && confirmPassword === newPassword);

  useEffect(() => {
    let mounted = true;
    async function cargar() {
      try {
        const response = await fetch("/api/estudiante/cuenta", { cache: "no-store" });
        const json = await response.json();
        if (!response.ok || !json.ok) throw new Error(json.message || "No pudimos cargar tu perfil.");
        if (!mounted) return;
        const perfil = json.perfil;
        setFullName(perfil.nombreCompleto || "");
        setAccountNumber(perfil.numeroCuenta || "");
        setEmail(perfil.correo || "");
        setFaculty(String(perfil.facultadId ?? ""));
        setCareer(String(perfil.carreraId ?? ""));
        setSemester(String(perfil.semestre ?? ""));
        setGpa(String(perfil.promedio ?? ""));
        setLocation(perfil.ubicacion || "");
        setExtract(perfil.resumen || "");
        setSkills(perfil.habilidades || []);
        setCv(perfil.cv);
        setCatalogos(json.catalogos);
      } catch (err) {
        if (mounted) setError(err.message || "No pudimos cargar tu perfil.");
      } finally {
        if (mounted) setCargando(false);
      }
    }
    cargar();
    return () => { mounted = false; };
  }, []);

  async function guardarPerfil() {
    setAviso(""); setErrorGuardado(""); setGuardando(true);
    try {
      const response = await fetch("/api/estudiante/cuenta", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombreCompleto: fullName, numeroCuenta: accountNumber,
          facultadId: faculty, carreraId: career, semestre: semester, promedio: gpa,
          ubicacion: location, resumen: extract, habilidades: skills }),
      });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.message || "No pudimos guardar los cambios.");
      setAviso("Cambios guardados correctamente.");
    } catch (err) { setErrorGuardado(err.message || "No pudimos guardar los cambios."); }
    finally { setGuardando(false); }
  }

  async function actualizarPassword() {
    setPasswordAviso(""); setCambiandoPassword(true);
    try {
      const response = await fetch("/api/estudiante/cuenta/password", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actual: currentPassword, nueva: newPassword, confirmar: confirmPassword }),
      });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.message || "No pudimos actualizar tu contraseña.");
      window.location.assign(json.redirect || "/ingresar");
    } catch (err) { setPasswordAviso(err.message || "No pudimos actualizar tu contraseña."); }
    finally { setCambiandoPassword(false); }
  }

  async function subirCv(event) {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    setCvAviso(""); setSubiendoCv(true);
    try {
      const form = new FormData(); form.append("cv", archivo);
      const response = await fetch("/api/estudiante/cuenta/cv", { method: "POST", body: form });
      const json = await response.json();
      if (!response.ok || !json.ok) throw new Error(json.message || "No pudimos cargar tu CV.");
      setCv(json.cv);
      setCvAviso("Tu CV vigente se actualizó correctamente.");
    } catch (err) { setCvAviso(err.message || "No pudimos cargar tu CV."); }
    finally { setSubiendoCv(false); event.target.value = ""; }
  }

  const carrerasFiltradas = catalogos.carreras.filter((c) => String(c.facultad_id) === faculty);
  return (
    <DashboardShell
      role="estudiante"
      title="Mi cuenta"
      eyebrow="CUENTA ESTUDIANTIL · CORREO VERIFICADO"
      description="Administra tus datos personales, información académica, tu CV vigente en PDF y la seguridad de tu cuenta institucional."
    >
      {cargando && <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600" role="status">Cargando tus datos...</div>}
      {error && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700" role="alert">{error}</div>}
      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
        {/* Columna principal izquierda */}
        <div className="space-y-6">
          <Panel>
            <SectionHeader
              icon={IdCard}
              title="Datos personales y académicos"
              description="Completa o actualiza la información que acompaña tus postulaciones."
              badge="Correo verificado"
            />
            <div className="grid gap-4 p-5 md:grid-cols-2">
              <div className="space-y-1.5">
                <RequiredLabel>Nombre completo</RequiredLabel>
                <IconInput
                  icon={User}
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Escribe tu nombre completo"
                />
              </div>

              <div className="space-y-1.5">
                <RequiredLabel extra="(9 dígitos)">Número de cuenta</RequiredLabel>
                <IconInput
                  icon={Hash}
                  type="text"
                  inputMode="numeric"
                  maxLength={9}
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Ingresa tu número de cuenta"
                />
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Correo institucional</RequiredLabel>
                <IconInput
                  icon={Mail}
                  type="email"
                  value={email}
                  readOnly
                  aria-readonly="true"
                  className="bg-slate-50"
                  placeholder="usuario@comunidad.unam.mx"
                />
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Facultad o Escuela</RequiredLabel>
                <IconSelect
                  icon={Building2}
                  value={faculty}
                  onChange={(e) => { setFaculty(e.target.value); setCareer(""); }}
                >
                  <option value="">Selecciona una facultad o escuela</option>
                  {catalogos.facultades.map((f) => (
                    <option key={f.id} value={String(f.id)}>{f.nombre}</option>
                  ))}
                </IconSelect>
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Ubicación / Campus</RequiredLabel>
                <IconInput
                  icon={MapPin}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej. Ciudad Universitaria"
                />
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Carrera</RequiredLabel>
                <IconSelect
                  icon={GraduationCap}
                  value={career}
                  onChange={(e) => setCareer(e.target.value)}
                >
                  <option value="">Selecciona tu carrera</option>
                  {carrerasFiltradas.map((c) => (
                    <option key={c.id} value={String(c.id)}>{nombreVisibleCarrera(c.nombre)}</option>
                  ))}
                </IconSelect>
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Semestre cursado</RequiredLabel>
                <IconSelect
                  icon={BookOpen}
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                >
                  <option value="">Selecciona tu semestre</option>
                  {SEMESTER_NUMBERS.map((value) => (
                    <option key={value} value={String(value)}>{value}º semestre</option>
                  ))}
                </IconSelect>
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Promedio general acumulado</RequiredLabel>
                <IconInput
                  icon={Award}
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  value={gpa}
                  onChange={(e) => setGpa(e.target.value)}
                  placeholder="Ej. 8.85"
                />
              </div>
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              icon={FileText}
              title="CV vigente en PDF"
              description="Documento único activo. Al reemplazarlo, el archivo anterior deja de estar disponible."
            />
            <div className="p-5">
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-navy text-white">
                  <FileText size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {cv?.nombre || "Sin archivo PDF cargado aún"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {cv ? `Actualizado: ${new Date(cv.actualizadoEn).toLocaleDateString("es-MX")}` : "Sube tu CV en formato PDF (máximo 5 MB)."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={secondaryButton} disabled={!cv} onClick={() => window.open("/api/estudiante/cuenta/cv", "_blank", "noopener,noreferrer")}>
                    <Download size={16} />
                    Ver PDF
                  </button>
                  <input ref={fileInput} type="file" accept=".pdf,application/pdf" className="hidden" onChange={subirCv} aria-label="Selecciona tu CV en PDF" />
                  <button type="button" className={primaryButton} disabled={subiendoCv || cargando} onClick={() => fileInput.current?.click()}>
                    <Upload size={16} />
                    {subiendoCv ? "Subiendo..." : cv ? "Reemplazar CV" : "Subir CV"}
                  </button>
                </div>
              </div>
              {cvAviso && <p className="mt-3 text-xs text-slate-700" role="status">{cvAviso}</p>}
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              icon={LockKeyhole}
              title="Seguridad de la cuenta"
              description="Credenciales de acceso institucional."
            />
            <div className="space-y-4 p-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Contraseña actual
                  </label>
                  <IconInput
                    icon={LockKeyhole}
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nueva contraseña
                  </label>
                  <IconInput
                    icon={LockKeyhole}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Confirmar contraseña
                  </label>
                  <IconInput
                    icon={ShieldCheck}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <PasswordStrength password={newPassword} />
              {confirmPassword && confirmPassword !== newPassword && <p className="text-xs font-semibold text-rose-700">Las contraseñas no coinciden.</p>}
              {passwordAviso && <p className="text-xs text-rose-700" role="alert">{passwordAviso}</p>}
              <div className="flex justify-end">
                <button type="button" disabled={!passwordReady || cambiandoPassword} onClick={actualizarPassword} className={primaryButton}>
                  <LockKeyhole size={16} /> {cambiandoPassword ? "Actualizando..." : "Actualizar contraseña"}
                </button>
              </div>
            </div>
          </Panel>

          

          <div className="flex flex-wrap items-center justify-end gap-3 pt-1">
            {aviso && <p className="mr-auto flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800" role="status"><CheckCircle2 size={18}/>{aviso}</p>}
            {errorGuardado && <p role="alert" className="mr-auto rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorGuardado}</p>}
            <button type="button" disabled={guardando || cargando} onClick={guardarPerfil} className={primaryButton}>
              <Save size={16} />
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </div>

        
        <aside className="space-y-6">
          <Panel>
            <SectionHeader
              icon={Sparkles}
              title="Extracto profesional"
              description="Síntesis para reclutadores."
            />
            <div className="p-5">
              <textarea
                rows={6}
                value={extract}
                onChange={(e) => setExtract(e.target.value)}
                maxLength={1500}
                placeholder="Escribe una breve descripción sobre tu perfil académico, áreas de interés o proyectos..."
                className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
              />
            </div>
          </Panel>

          <Panel>
            <SectionHeader
              icon={Code2}
              title="Habilidades técnicas"
              description="Etiquetas activas para emparejamiento con vacantes."
            />
            <div className="space-y-4 p-5">
              <SkillPicker skills={skills} onChange={setSkills} suggestions={catalogos.habilidades} allowCustom={false} label="Buscar habilidades técnicas" />
            </div>
          </Panel>
        </aside>
      </div>
    </DashboardShell>
  );
}