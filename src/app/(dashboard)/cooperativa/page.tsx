"use client";

import StatCard from "@/components/ui/StatCard";

const cooperados = [
  { name: "João Silva", quotas: 2, status: "Adimplente", capital: "R$ 15.000" },
  { name: "Maria Santos", quotas: 1, status: "Adimplente", capital: "R$ 8.500" },
  { name: "Pedro Costa", quotas: 3, status: "Adimplente", capital: "R$ 22.000" },
  { name: "Ana Oliveira", quotas: 1, status: "Inadimplente", capital: "R$ 5.000" },
  { name: "Carlos Lima", quotas: 2, status: "Adimplente", capital: "R$ 18.000" },
];

export default function CooperativaDashboard() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Dashboard da Cooperativa</h2>
            <p className="text">
              Gerencie cooperados, grupos e distribuição de sobras
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Cooperados"
            value="1.250"
            subtitle="45 novos este mês"
            icon="flaticon-user"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Capital Social"
            value="R$ 8.2M"
            subtitle="Total acumulado"
            icon="flaticon-dollar"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Grupos Ativos"
            value="32"
            subtitle="5 em formação"
            icon="flaticon-document"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Sobras a Distribuir"
            value="R$ 450K"
            subtitle="Exercício 2025"
            icon="flaticon-chart"
          />
        </div>
      </div>
      <div className="row mt30">
        <div className="col-lg-8">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Cooperados Recentes</h5>
              <a className="text-decoration-underline text-thm6">Ver todos</a>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz13 fw600">Nome</th>
                    <th className="fz13 fw600">Cotas</th>
                    <th className="fz13 fw600">Capital Social</th>
                    <th className="fz13 fw600">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {cooperados.map((c, i) => (
                    <tr key={i}>
                      <td className="fz14">{c.name}</td>
                      <td className="fz14">{c.quotas}</td>
                      <td className="fz14">{c.capital}</td>
                      <td>
                        <span
                          className={`quota-status-badge ${
                            c.status === "Adimplente" ? "ativa" : "inadimplente"
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="bdrb1 pb15 mb20">
              <h5 className="title">Distribuição de Sobras</h5>
            </div>
            <div className="text-center mb20">
              <h3 className="fw700" style={{ color: "#5bbb7b" }}>
                R$ 450.000
              </h3>
              <p className="fz14 body-color">Resultado positivo - Provisões</p>
            </div>
            <div className="bdrb1 pb15 mb15">
              <div className="d-flex justify-content-between">
                <span className="fz14">Resultado Bruto</span>
                <span className="fz14 fw500">R$ 620.000</span>
              </div>
            </div>
            <div className="bdrb1 pb15 mb15">
              <div className="d-flex justify-content-between">
                <span className="fz14">Provisões</span>
                <span className="fz14 fw500" style={{ color: "#eb6753" }}>
                  - R$ 170.000
                </span>
              </div>
            </div>
            <div className="mb15">
              <div className="d-flex justify-content-between">
                <span className="fz14 fw600">Sobras Líquidas</span>
                <span className="fz14 fw600" style={{ color: "#5bbb7b" }}>
                  R$ 450.000
                </span>
              </div>
            </div>
            <div className="d-grid mt20">
              <button className="ud-btn btn-thm bdrs4 fz14">
                Calcular Rateio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
