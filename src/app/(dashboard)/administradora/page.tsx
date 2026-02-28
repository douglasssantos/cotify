"use client";

import StatCard from "@/components/ui/StatCard";
import Link from "next/link";

const pendingTransfers = [
  {
    id: 1,
    seller: "João Silva",
    buyer: "Maria Santos",
    quota: "GRP-4052 #12",
    value: "R$ 95.000",
    date: "25/02/2026",
  },
  {
    id: 2,
    seller: "Pedro Costa",
    buyer: "Ana Oliveira",
    quota: "GRP-5521 #7",
    value: "R$ 165.000",
    date: "24/02/2026",
  },
  {
    id: 3,
    seller: "Carlos Lima",
    buyer: "Lucas Rocha",
    quota: "GRP-3187 #45",
    value: "R$ 52.000",
    date: "23/02/2026",
  },
];

export default function AdministradoraDashboard() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Dashboard da Administradora</h2>
            <p className="text">
              Gerencie grupos, cotas e aprovações de transferência
            </p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Grupos Ativos"
            value="48"
            subtitle="3 novos este mês"
            icon="flaticon-document"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Cotas Ativas"
            value="2.340"
            subtitle="120 contempladas"
            icon="flaticon-contract"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Fundo Comum"
            value="R$ 12.5M"
            subtitle="Saldo disponível"
            icon="flaticon-dollar"
          />
        </div>
        <div className="col-sm-6 col-xxl-3">
          <StatCard
            title="Transferências Pendentes"
            value="3"
            subtitle="Aguardando aprovação"
            icon="flaticon-transfer"
          />
        </div>
      </div>
      <div className="row mt30">
        <div className="col-lg-8">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Transferências Pendentes</h5>
              <Link
                href="/administradora/transferencias"
                className="text-decoration-underline text-thm6"
              >
                Ver todas
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz13 fw600">Cota</th>
                    <th className="fz13 fw600">Vendedor</th>
                    <th className="fz13 fw600">Comprador</th>
                    <th className="fz13 fw600">Valor</th>
                    <th className="fz13 fw600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTransfers.map((transfer) => (
                    <tr key={transfer.id}>
                      <td className="fz14">{transfer.quota}</td>
                      <td className="fz14">{transfer.seller}</td>
                      <td className="fz14">{transfer.buyer}</td>
                      <td className="fz14 fw500">{transfer.value}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="ud-btn btn-thm bdrs4 fz12 px-3 py-1">
                            Aprovar
                          </button>
                          <button className="ud-btn btn-white bdrs4 fz12 px-3 py-1">
                            Rejeitar
                          </button>
                        </div>
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
              <h5 className="title">Saúde dos Grupos</h5>
            </div>
            {[
              { group: "GRP-4052", health: 95, color: "#5bbb7b" },
              { group: "GRP-3187", health: 88, color: "#5bbb7b" },
              { group: "GRP-5521", health: 72, color: "#ffc107" },
              { group: "GRP-2899", health: 60, color: "#eb6753" },
            ].map((item, i) => (
              <div key={i} className="mb15">
                <div className="d-flex justify-content-between mb5">
                  <span className="fz14">{item.group}</span>
                  <span className="fz14 fw500">{item.health}%</span>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${item.health}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="bdrb1 pb15 mb20">
              <h5 className="title">Inadimplência</h5>
            </div>
            <div className="text-center">
              <h3 className="fw700" style={{ color: "#eb6753" }}>
                4.2%
              </h3>
              <p className="fz14 body-color mb-0">
                98 cotas inadimplentes de 2.340
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
