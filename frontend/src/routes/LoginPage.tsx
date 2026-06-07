/**
 * LoginPage — Tela de login elegante com visual espacial
 * Permite login e cadastro com Firebase Auth (email/senha)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  Input,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@heroui/react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedTab, setSelectedTab] = useState<string>("login");
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (selectedTab === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Auth error:", err);
      const code = err?.code || "";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setError("Email ou senha incorretos.");
      } else if (code === "auth/email-already-in-use") {
        setError("Este email já está cadastrado.");
      } else if (code === "auth/weak-password") {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres.");
      } else if (code === "auth/invalid-email") {
        setError("Email inválido.");
      } else {
        setError("Erro ao autenticar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center px-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-4xl font-extrabold ga-gradient-text mb-2">
            GuardaAgro
          </h1>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Análise ambiental com dados espaciais da NASA para prevenção de riscos climáticos
          </p>
        </div>

        {/* Card de Login */}
        <Card className="ga-card border-0 shadow-2xl shadow-black/40 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <CardBody className="p-6 sm:p-8">
            <Tabs
              fullWidth
              selectedKey={selectedTab}
              onSelectionChange={(key) => {
                setSelectedTab(String(key));
                setError("");
              }}
              variant="bordered"
              classNames={{
                tabList: "bg-slate-900/50 border-slate-700/50",
                cursor: "bg-emerald-500/20 border border-emerald-500/30",
                tab: "text-slate-400 data-[selected=true]:text-emerald-400",
              }}
            >
              <Tab key="login" title="Entrar" />
              <Tab key="register" title="Cadastrar" />
            </Tabs>

            <div className="mt-6 space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onValueChange={(v) => { setEmail(v); setError(""); }}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-slate-900/50 border-slate-700/50 hover:border-emerald-500/40 group-data-[focus=true]:border-emerald-500",
                  label: "text-slate-400",
                  input: "text-white",
                }}
              />

              <Input
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onValueChange={(v) => { setPassword(v); setError(""); }}
                variant="bordered"
                classNames={{
                  inputWrapper: "bg-slate-900/50 border-slate-700/50 hover:border-emerald-500/40 group-data-[focus=true]:border-emerald-500",
                  label: "text-slate-400",
                  input: "text-white",
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                fullWidth
                size="lg"
                onPress={handleSubmit}
                isLoading={isLoading}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all mt-2"
              >
                {selectedTab === "login" ? "Entrar" : "Criar conta"}
              </Button>
            </div>

            <Divider className="bg-white/5 my-6" />

            <p className="text-xs text-slate-500 text-center">
              FIAP — Global Solution · Space Connect
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
