"use client";

import { useEffect } from "react";

export interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Largura máxima do painel (ex: "520px", "90vw") */
  maxWidth?: string;
  /** Ícone no título (classe Font Awesome) */
  icon?: string;
}

export default function BaseModal({
  open,
  onClose,
  title,
  children,
  maxWidth = "560px",
  icon,
}: BaseModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          backgroundColor: "rgba(0,0,0,0.45)",
          zIndex: 1050,
        }}
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        role="button"
        tabIndex={0}
        aria-label="Fechar"
      />
      <div
        className="position-fixed top-0 start-50 translate-middle-x p-3 w-100 h-100 overflow-auto"
        style={{
          zIndex: 1051,
          maxHeight: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="bgc-white bdrs12 shadow-lg w-100"
          style={{ maxWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="d-flex align-items-center justify-content-between p25 bdrb1" style={{ borderColor: "#e8e8e8" }}>
            <h2 id="modal-title" className="mb-0 fz18 fw600 dark-color d-flex align-items-center gap-2">
              {icon && <i className={`fal ${icon}`} style={{ color: "#0d6efd" }} />}
              {title}
            </h2>
            <button
              type="button"
              className="ud-btn btn-white bdrs8"
              onClick={onClose}
              aria-label="Fechar"
            >
              <i className="fal fa-times" />
            </button>
          </div>
          <div className="p25" style={{ maxHeight: "calc(100vh - 140px)", overflowY: "auto" }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
