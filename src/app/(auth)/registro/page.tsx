"use client";

import Link from "next/link";
import { useState } from "react";

export default function RegistroPage() {
  const [role, setRole] = useState("cotista");

  return (
    <section className="our-register">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto">
            <div className="main-title text-center">
              <h2 className="title">Cadastro</h2>
              <p className="paragraph">
                Crie sua conta e comece a gerenciar suas cotas de consórcio
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 mx-auto">
            <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
              <div className="mb30">
                <h4>Vamos criar sua conta!</h4>
                <p className="text mt20">
                  Já tem uma conta?{" "}
                  <Link href="/login" className="text-thm">
                    Entrar!
                  </Link>
                </p>
              </div>
              <div className="mb25">
                <label className="form-label fw500 dark-color">
                  Tipo de conta
                </label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="cotista">Cotista</option>
                  <option value="administradora">Administradora</option>
                  <option value="cooperativa">Cooperativa</option>
                  <option value="revenda">Revenda / Comissionado</option>
                </select>
              </div>
              <div className="mb25">
                <label className="form-label fw500 dark-color">
                  Nome completo
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Seu nome"
                />
              </div>
              {(role === "administradora" ||
                role === "cooperativa" ||
                role === "revenda") && (
                <div className="mb25">
                  <label className="form-label fw500 dark-color">
                    {role === "administradora"
                      ? "Nome da Administradora"
                      : role === "cooperativa"
                      ? "Nome da Cooperativa"
                      : "Nome Fantasia"}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Razão social ou nome fantasia"
                  />
                </div>
              )}
              {(role === "administradora" ||
                role === "cooperativa" ||
                role === "revenda") && (
                <div className="mb25">
                  <label className="form-label fw500 dark-color">CNPJ</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="00.000.000/0000-00"
                  />
                </div>
              )}
              {role === "cotista" && (
                <div className="mb25">
                  <label className="form-label fw500 dark-color">CPF</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="000.000.000-00"
                  />
                </div>
              )}
              <div className="mb25">
                <label className="form-label fw500 dark-color">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="mb15">
                <label className="form-label fw500 dark-color">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="*******"
                />
              </div>
              <div className="checkbox-style1 mb20">
                <label className="custom_checkbox fz14 ff-heading">
                  Li e aceito os{" "}
                  <a className="text-thm">Termos de Uso</a> e{" "}
                  <a className="text-thm">Política de Privacidade</a>
                  <input type="checkbox" />
                  <span className="checkmark" />
                </label>
              </div>
              <div className="d-grid mb20">
                <button
                  className="ud-btn btn-thm default-box-shadow2"
                  type="button"
                >
                  Criar Conta <i className="fal fa-arrow-right-long" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
