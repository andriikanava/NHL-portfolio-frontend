import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("access") || null
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refresh") || null
  );
  const [loading, setLoading] = useState(true);

  // ───────────────────────────────────────────────
  // 1. Интерцептор: если получаем 401 → обновляем access
  // ───────────────────────────────────────────────
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      res => res,
      async error => {
        const originalRequest = error.config;

        // Если 401 и токена ещё не обновляли
        if (
          error.response?.status === 401 &&
          !originalRequest._retry &&
          refreshToken
        ) {
          originalRequest._retry = true;

          try {
            const res = await api.post("/portfolio/token/refresh/", {
              refresh: refreshToken,
            });

            localStorage.setItem("access", res.data.access);
            setAccessToken(res.data.access);

            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${res.data.access}`;

            return api(originalRequest);
          } catch (err) {
            logout(); // refresh невалиден → выходим
          }
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken]);

  // ───────────────────────────────────────────────
  // 2. Подгружаем пользователя при наличии access
  // (но если он уже есть в localStorage — запрос не шлём)
  // ───────────────────────────────────────────────
  useEffect(() => {
    async function fetchUser() {
      if (!accessToken || user) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/portfolio/users/me/", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [accessToken]);

  // ───────────────────────────────────────────────
  // 3. Логин
  // ───────────────────────────────────────────────
  const login = async (email, password) => {
    const res = await api.post("/portfolio/token/", { email, password });
    const { access, refresh } = res.data;

    setAccessToken(access);
    setRefreshToken(refresh);

    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    const meRes = await api.get("/portfolio/users/me/", {
      headers: { Authorization: `Bearer ${access}` },
    });

    setUser(meRes.data);
    localStorage.setItem("user", JSON.stringify(meRes.data));
  };

  // ───────────────────────────────────────────────
  // 4. Логаут
  // ───────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
