import Header from "@/components/ui/custom/Header";
import { Toaster } from "@/components/ui/sonner";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <Toaster />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
