"use client";

import { useState } from "react";
import { getFaviconUrl } from "@/lib/utils";

interface AdminLogoProps {
  /** URL da logo vinda do banco de dados */
  logo?: string | null;
  /** URL do site da administradora (usado para favicon quando não há logo) */
  website?: string | null;
  /** Nome da administradora (alt text e fallback visual) */
  name: string;
  /** Tamanho em px (largura e altura) */
  size?: number;
  className?: string;
  /** Estilo do container da logo (ex. rounded-circle) */
  containerClassName?: string;
  /** 'default' = círculo verde; 'light' = círculo branco com ícone tema (página detalhe) */
  placeholderVariant?: "default" | "light";
}

const PLACEHOLDER_ICON = "flaticon-home";

export function AdminLogo({
  logo,
  website,
  name,
  size = 52,
  className = "",
  containerClassName = "",
  placeholderVariant = "default",
}: AdminLogoProps) {
  const faviconUrl = getFaviconUrl(website ?? undefined);
  const [srcFailed, setSrcFailed] = useState(false);
  const [faviconFailed, setFaviconFailed] = useState(false);

  const useLogo = logo && !srcFailed;
  const useFavicon = !useLogo && faviconUrl && !faviconFailed;
  const showPlaceholder = !useLogo && !useFavicon;

  const handleLogoError = () => {
    setSrcFailed(true);
  };

  const handleFaviconError = () => {
    setFaviconFailed(true);
  };

  if (showPlaceholder) {
    const isLight = placeholderVariant === "light";
    return (
      <div
        className={`rounded-circle d-flex align-items-center justify-content-center ${isLight ? "bgc-white default-box-shadow1" : "bgc-thm2"} ${containerClassName}`}
        style={{ width: size, height: size }}
        title={name}
      >
        <span
          className={`${PLACEHOLDER_ICON} fz20 ${isLight ? "text-thm2" : "text-white"}`}
          style={{ fontSize: size * 0.4 }}
        />
      </div>
    );
  }

  if (useLogo) {
    return (
      <img
        src={logo!}
        alt={name}
        className={`object-fit-contain ${className}`}
        style={{ width: size, height: size }}
        onError={handleLogoError}
      />
    );
  }

  return (
    <img
      src={faviconUrl!}
      alt={name}
      className={`object-fit-contain ${className}`}
      style={{ width: size, height: size }}
      onError={handleFaviconError}
    />
  );
}
