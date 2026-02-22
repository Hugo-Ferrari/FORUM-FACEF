"use client"

import { usePathname } from "next/navigation";
import NavLateral from "@/components/nav/NavLateral";
import Nav from "@/components/nav/Nav";
import React from "react";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <>
          <NavLateral />
          <Nav />
        </>
      )}

      <div
        style={{
          paddingLeft: isLoginPage ? '0' : 'var(--sidebar-width, 5rem)',
          transition: 'padding-left 300ms ease-in-out',
        }}
        className={`${isLoginPage ? '' : 'pt-20'} min-h-screen bg-background transition-colors duration-300`}
      >
        {children}
      </div>
    </>
  );
}
