/**
 * Contexto de Autenticação
 * Gerencia estado do usuário, login, cadastro e logout via Firebase Auth
 */

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth } from "../firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        currentUser.getIdToken().then((idToken) => {
          setToken(idToken);
          // Armazene o token no localStorage para uso futuro
          localStorage.setItem("authToken", idToken);
        });
      } else {
        setToken(null);
        localStorage.removeItem("authToken");
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      localStorage.setItem("authToken", idToken);
    } catch (error) {
      console.error("Login error:", error);
      setToken(null);
      localStorage.removeItem("authToken");
      throw error;
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope("profile");
      provider.addScope("email");
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      localStorage.setItem("authToken", idToken);
    } catch (error) {
      console.error("Google login error:", error);
      setToken(null);
      localStorage.removeItem("authToken");
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const idToken = await result.user.getIdToken();
      setToken(idToken);
      localStorage.setItem("authToken", idToken);
    } catch (error) {
      console.error("Registration error:", error);
      setToken(null);
      localStorage.removeItem("authToken");
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, loginWithGoogle, token }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
