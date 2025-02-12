"use client";
import { useTheme } from "@/context/ThemeContext";
import React from "react";
import { ToastContainer } from "react-toastify";

const Toast = () => {
  const { theme } = useTheme();
  return (
    <div>
      <ToastContainer theme={theme} position="bottom-right" />
    </div>
  );
};

export default Toast;
