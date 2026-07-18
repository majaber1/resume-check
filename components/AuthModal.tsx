"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthModal({ open, onClose, locale }: { open: boolean; onClose: () => void; locale: "en" | "ar" }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [mode, setMode] = useState<"signin" | "signup">("signin"); const [message, setMessage] = useState("");
  if (!open) return null; const ar = locale === "ar";
  async function submit() {
    const supabase = createClient();
    if (!supabase) return setMessage(ar ? "أضف إعدادات Supabase أولًا" : "Configure Supabase first");
    const result = mode === "signin" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${location.origin}/dashboard` } });
    if (result.error) setMessage(result.error.message); else if (mode === "signup") setMessage(ar ? "راجع بريدك لتأكيد الحساب" : "Check your email to confirm your account"); else location.href = "/dashboard";
  }
  return <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/60 p-4" onMouseDown={onClose}><div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl" onMouseDown={e=>e.stopPropagation()}><div className="flex justify-between"><h2 className="text-2xl font-bold">{mode === "signin" ? (ar?"تسجيل الدخول":"Welcome back") : (ar?"إنشاء حساب":"Create account")}</h2><button onClick={onClose}>✕</button></div><div className="mt-6 space-y-4"><input aria-label="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-xl border p-3"/><input aria-label="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder={ar?"كلمة المرور":"Password"} className="w-full rounded-xl border p-3"/><button onClick={submit} className="w-full rounded-xl bg-indigo-600 p-3 font-bold text-white">{mode === "signin" ? (ar?"دخول":"Sign in") : (ar?"إنشاء الحساب":"Create account")}</button>{message&&<p className="text-sm text-slate-600">{message}</p>}<button onClick={()=>setMode(mode==="signin"?"signup":"signin")} className="w-full text-sm font-semibold text-indigo-600">{mode==="signin"?(ar?"ليس لديك حساب؟ أنشئ حسابًا":"New here? Create an account"):(ar?"لديك حساب؟ سجل الدخول":"Already registered? Sign in")}</button></div></div></div>;
}

