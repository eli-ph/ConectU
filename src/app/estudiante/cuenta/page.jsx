"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BookOpen,
  Building2,
  CheckCircle2,
  Circle,
  Code2,
  Download,
  FileText,
  GraduationCap,
  Hash,
  IdCard,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
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

function evaluatePassword(password) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(
    password
  );

  if (!password) {
    return {
      score: 0,
      label: "Sin evaluar",
      barColor: "bg-slate-200",
      textColor: "text-slate-500",
      hasLength: false,
      hasUpper: false,
      hasNumberOrSymbol: false,
    };
  }

  const isStrong = hasLength && hasUpper && hasNumberOrSymbol;
  if (isStrong) {
    return {
      score: 3,
      label: "Segura",
      barColor: "bg-emerald-500",
      textColor: "text-emerald-600",
      hasLength,
      hasUpper,
      hasNumberOrSymbol,
    };
  }

  const passedCount = [hasLength, hasUpper, hasNumberOrSymbol].filter(Boolean).length;
  if (passedCount === 2) {
    return {
      score: 2,
      label: "Media",
      barColor: "bg-amber-500",
      textColor: "text-amber-600",
      hasLength,
      hasUpper,
      hasNumberOrSymbol,
    };
  }

  return {
    score: 1,
    label: "Débil",
    barColor: "bg-rose-500",
    textColor: "text-rose-600",
    hasLength,
    hasUpper,
    hasNumberOrSymbol,
  };
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
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState([]);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const strength = useMemo(() => evaluatePassword(newPassword), [newPassword]);

  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (!skills.some((item) => item.toLowerCase() === trimmed.toLowerCase())) {
      setSkills((prev) => [...prev, trimmed]);
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((item) => item !== skillToRemove));
  };

  const widthPercent =
    strength.score === 0
      ? "0%"
      : strength.score === 1
      ? "33%"
      : strength.score === 2
      ? "66%"
      : "100%";

  return (
    <DashboardShell
      role="estudiante"
      title="Mi cuenta"
      eyebrow="CREDENCIALES VALIDADAS · ACTIVO"
      description="Administra tus datos personales, información académica, tu CV vigente en PDF y la seguridad de tu cuenta institucional."
    >
      <div className="grid gap-6 xl:grid-cols-[1.65fr_0.85fr]">
        {/* Columna principal izquierda */}
        <div className="space-y-6">
          <Panel>
            <SectionHeader
              icon={IdCard}
              title="Datos personales y académicos"
              description="Completa o actualiza la información que acompaña tus postulaciones."
              badge="Validado UNAM"
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@comunidad.unam.mx"
                />
              </div>

              <div className="space-y-1.5">
                <RequiredLabel>Facultad o Escuela</RequiredLabel>
                <IconSelect
                  icon={Building2}
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                >
                  <option value="">Selecciona una facultad o escuela</option>
                  <option value="Facultad de Ingeniería">Facultad de Ingeniería</option>
                  <option value="Facultad de Ciencias">Facultad de Ciencias</option>
                  <option value="Facultad de Contaduría y Administración">
                    Facultad de Contaduría y Administración
                  </option>
                  <option value="FES Aragón">FES Aragón</option>
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
                  <option value="Ingeniería en Computación">
                    Ingeniería en Computación
                  </option>
                  <option value="Ingeniería Mecatrónica">
                    Ingeniería Mecatrónica
                  </option>
                  <option value="Ingeniería Industrial">
                    Ingeniería Industrial
                  </option>
                  <option value="Ingeniería Aeroespacial">
                    Ingeniería Aeroespacial
                  </option>
                  <option value="Psicología ">
                    Psicología
                  </option>
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
                  <option value="5">5to Semestre</option>
                  <option value="6">6to Semestre</option>
                  <option value="7">7mo Semestre</option>
                  <option value="8">8vo Semestre</option>
                  <option value="9">9no Semestre</option>
                  <option value="10">10mo Semestre</option>
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
                    Sin archivo PDF cargado aún
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Sube tu CV en formato PDF para acompañarlo en tus postulaciones.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={secondaryButton}>
                    <Download size={16} />
                    Ver PDF
                  </button>
                  <button type="button" className={primaryButton}>
                    <Upload size={16} />
                    Reemplazar CV
                  </button>
                </div>
              </div>
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

              <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700">
                    Seguridad de la contraseña
                  </span>
                  <span className={`font-bold ${strength.textColor}`}>
                    {strength.label}
                  </span>
                </div>

                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${strength.barColor}`}
                    style={{ width: widthPercent }}
                  />
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    {strength.hasLength ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : (
                      <Circle size={14} className="text-slate-400" />
                    )}
                    Mínimo 8 caracteres
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {strength.hasUpper ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : (
                      <Circle size={14} className="text-slate-400" />
                    )}
                    Una mayúscula
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    {strength.hasNumberOrSymbol ? (
                      <CheckCircle2 size={14} className="text-emerald-600" />
                    ) : (
                      <Circle size={14} className="text-slate-400" />
                    )}
                    Un número o símbolo
                  </span>
                </div>
              </div>
            </div>
          </Panel>

          

          <div className="flex justify-end pt-1">
            <button type="button" className={primaryButton}>
              <Save size={16} />
              Guardar cambios
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
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Habilidades agregadas</span>
                <span className="font-semibold text-brand-navy">
                  {skills.length}{" "}
                  {skills.length === 1 ? "seleccionada" : "seleccionadas"}
                </span>
              </div>

              <div className="flex min-h-11 flex-wrap gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                {skills.length === 0 ? (
                  <p className="text-xs text-slate-400">
                    Aún no has agregado habilidades técnicas.
                  </p>
                ) : (
                  skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#eeefff] px-2.5 py-1 text-xs font-semibold text-brand-navy"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        aria-label={`Quitar ${skill}`}
                        className="rounded hover:bg-brand-navy/10"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))
                )}
              </div>

              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Añadir tecnología..."
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
                />
                <button type="submit" className={secondaryButton}>
                  <Plus size={15} />
                  Añadir
                </button>
              </form>
            </div>
          </Panel>
        </aside>
      </div>
    </DashboardShell>
  );
}