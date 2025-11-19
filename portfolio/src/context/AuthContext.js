import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || null);
  const [loading, setLoading] = useState(true); // добавили загрузку

  useEffect(() => {
    if (accessToken) {
      api
        .get("/portfolio/users/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then(res => setUser(res.data))
        .catch(() => {
          setUser(null);
          setAccessToken(null);
          localStorage.removeItem("access");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const login = async (email, password) => {
    const res = await api.post("/portfolio/token/", { email, password });
    const { access } = res.data;
    localStorage.setItem("access", access);
    setAccessToken(access);

    const meRes = await api.get("/portfolio/users/me/", {
      headers: { Authorization: `Bearer ${access}` },
    });
    setUser(meRes.data);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("access");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
