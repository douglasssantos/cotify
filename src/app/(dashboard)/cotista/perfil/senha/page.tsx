"use client";

import { useState } from "react";
import Link from "next/link";

export default function AlterarSenhaPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) {
      setError("A nova senha deve ter no mínimo 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("A confirmação da senha não confere.");
      return;
    }
    setSaved(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Alterar senha</h2>
            <p className="text">
              Defina uma nova senha de acesso à sua conta
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-6">
          <div className="ps-widget bgc-white bdrs4 p30 mb30">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="alert alert-danger mb20" role="alert">
                  {error}
                </div>
              )}
              {saved && (
                <div className="alert alert-success mb20" role="alert">
                  Senha alterada com sucesso.
                </div>
              )}
              <div className="mb20">
                <label className="fw500 ff-heading dark-color mb-2 d-block">Senha atual</label>
                <input
                  type="password"
                  className="form-control"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb20">
                <label className="fw500 ff-heading dark-color mb-2 d-block">Nova senha</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
                <p className="fz12 body-color mt-1 mb-0">Mínimo 8 caracteres.</p>
              </div>
              <div className="mb20">
                <label className="fw500 ff-heading dark-color mb-2 d-block">Confirmar nova senha</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="d-flex gap-3">
                <button type="submit" className="ud-btn btn-thm bdrs12">
                  Alterar senha <i className="fal fa-arrow-right-long" />
                </button>
                <Link href="/cotista/perfil" className="ud-btn btn-thm-border bdrs12">
                  Voltar
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
