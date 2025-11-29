"use client";

import { useState, useEffect } from "react";

export type Language = "en" | "ti";

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved === "en" || saved === "ti") {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return {
    language,
    changeLanguage,
  };
}

