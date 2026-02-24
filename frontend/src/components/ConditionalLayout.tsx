"use client"

import { usePathname } from "next/navigation";
import NavLateral from "@/components/nav/NavLateral";
import Nav from "@/components/nav/Nav";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth_store";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  // Verificações de autenticação
  const code = useAuthStore(s => s.code);
  const course_id = useAuthStore(s => s.course_id);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Páginas que não precisam de autenticação
  const isLoginPage = pathname === "/login" || pathname.startsWith("/login/");

  // Se não está no cliente ainda, não renderiza nav para evitar hidration mismatch
  if (!isClient) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        {children}
      </div>
    );
  }

  // Se não está logado E não está na página de login, não mostra nav
  const isAuthenticated = code && code !== 0 && course_id && course_id !== "";
  const shouldShowNav = isAuthenticated && !isLoginPage;

  return (
    <>
      {shouldShowNav && (
        <>
          <NavLateral />
          <Nav />
        </>
      )}

      <div
        style={{
          paddingLeft: shouldShowNav ? 'var(--sidebar-width, 5rem)' : '0',
          transition: 'padding-left 300ms ease-in-out',
        }}
        className={`${shouldShowNav ? 'pt-20' : ''} min-h-screen bg-background transition-colors duration-300`}
      >
        {children}
      </div>
    </>
  );
}
