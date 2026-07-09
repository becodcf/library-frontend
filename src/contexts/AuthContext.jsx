import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("@library:user");
    const storedToken = localStorage.getItem("@library:token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function signIn(email, password) {
    const { user: loggedUser, token } = await authService.login(email, password);

    localStorage.setItem("@library:token", token);
    localStorage.setItem("@library:user", JSON.stringify(loggedUser));

    setUser(loggedUser);
  }

  async function signUp(name, email, password) {
    await authService.register(name, email, password);
    await signIn(email, password);
  }

  function signOut() {
    localStorage.removeItem("@library:token");
    localStorage.removeItem("@library:user");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signed: !!user,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export { AuthProvider, useAuth };
