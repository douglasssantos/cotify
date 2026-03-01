"use client";

import { useState } from "react";
import Link from "next/link";
import { mockCotistaProfile } from "@/data/mock-cotista";

export default function MeuPerfilPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: mockCotistaProfile.name,
    email: mockCotistaProfile.email,
    phone: mockCotistaProfile.phone,
    cpf: mockCotistaProfile.cpf,
    birthDate: mockCotistaProfile.birthDate,
    street: mockCotistaProfile.address.street,
    complement: mockCotistaProfile.address.complement,
    neighborhood: mockCotistaProfile.address.neighborhood,
    city: mockCotistaProfile.address.city,
    state: mockCotistaProfile.address.state,
    zip: mockCotistaProfile.address.zip,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleChange = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Meu Perfil</h2>
            <p className="text">
              Atualize seus dados pessoais e de contato
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8">
          <form onSubmit={handleSubmit}>
            <div className="ps-widget bgc-white bdrs4 p30 mb30">
              <h5 className="mb20">Dados Pessoais</h5>
              <div className="row">
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Nome completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange("name")}
                  />
                </div>
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </div>
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Telefone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">CPF</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.cpf}
                    onChange={handleChange("cpf")}
                    placeholder="000.000.000-00"
                  />
                </div>
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Data de nascimento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.birthDate}
                    onChange={handleChange("birthDate")}
                    placeholder="DD/MM/AAAA"
                  />
                </div>
              </div>
            </div>

            <div className="ps-widget bgc-white bdrs4 p30 mb30">
              <h5 className="mb20">Endereço</h5>
              <div className="row">
                <div className="col-12 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Logradouro</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.street}
                    onChange={handleChange("street")}
                  />
                </div>
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Complemento</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.complement}
                    onChange={handleChange("complement")}
                  />
                </div>
                <div className="col-md-6 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Bairro</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.neighborhood}
                    onChange={handleChange("neighborhood")}
                  />
                </div>
                <div className="col-md-4 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Cidade</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.city}
                    onChange={handleChange("city")}
                  />
                </div>
                <div className="col-md-4 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">Estado</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.state}
                    onChange={handleChange("state")}
                    maxLength={2}
                  />
                </div>
                <div className="col-md-4 mb20">
                  <label className="fw500 ff-heading dark-color mb-2">CEP</label>
                  <input
                    type="text"
                    className="form-control"
                    value={form.zip}
                    onChange={handleChange("zip")}
                    placeholder="00000-000"
                  />
                </div>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3">
              <button type="submit" className="ud-btn btn-thm bdrs12">
                {saved ? "Salvo!" : "Salvar alterações"}
                <i className="fal fa-arrow-right-long" />
              </button>
              <Link href="/cotista" className="ud-btn btn-thm-border bdrs12">
                Voltar ao Dashboard
              </Link>
            </div>
          </form>
        </div>

        <div className="col-lg-4">
          <div className="ps-widget bgc-white bdrs4 p30 mb30">
            <h5 className="mb15">Conta</h5>
            <p className="fz13 body-color mb-2">
              Membro desde{" "}
              {new Date(mockCotistaProfile.createdAt).toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
            <Link href="/cotista/perfil/senha" className="ud-btn btn-thm-border bdrs12 fz13 mt10">
              <i className="fal fa-lock me-1" /> Alterar senha
            </Link>
          </div>
          <div
            className="p20 bdrs12"
            style={{ backgroundColor: "rgba(91, 187, 123, 0.08)" }}
          >
            <p className="fz13 mb-0 body-color">
              <i className="fas fa-shield-alt me-2" style={{ color: "#5bbb7b" }} />
              Seus dados são utilizados apenas para a gestão das suas cotas e repasses na plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
