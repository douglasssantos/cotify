"use client";

import { formatCurrency } from "@/lib/utils";

const commissions = [
  {
    id: 1,
    client: "João Silva",
    quota: "GRP-4052 #12",
    saleValue: 2450,
    commissionRate: 5,
    commissionValue: 1225,
    type: "Sobre Taxa Adm",
    status: "Pago",
    date: "15/02/2026",
  },
  {
    id: 2,
    client: "Maria Santos",
    quota: "GRP-5521 #7",
    saleValue: 3800,
    commissionRate: 5,
    commissionValue: 1900,
    type: "Sobre Venda",
    status: "Pendente",
    date: "12/02/2026",
  },
  {
    id: 3,
    client: "Pedro Costa",
    quota: "GRP-3187 #45",
    saleValue: 980,
    commissionRate: 5,
    commissionValue: 490,
    type: "Sobre Taxa Adm",
    status: "Pago",
    date: "08/02/2026",
  },
  {
    id: 4,
    client: "Ana Oliveira",
    quota: "GRP-2899 #23",
    saleValue: 1450,
    commissionRate: 5,
    commissionValue: 725,
    type: "Recorrente",
    status: "Aguardando",
    date: "05/02/2026",
  },
  {
    id: 5,
    client: "Carlos Lima",
    quota: "GRP-6100 #89",
    saleValue: 650,
    commissionRate: 5,
    commissionValue: 325,
    type: "Sobre Venda",
    status: "Pago",
    date: "01/02/2026",
  },
];

export default function ComissoesPage() {
  const totalPaid = commissions
    .filter((c) => c.status === "Pago")
    .reduce((sum, c) => sum + c.commissionValue, 0);
  const totalPending = commissions
    .filter((c) => c.status !== "Pago")
    .reduce((sum, c) => sum + c.commissionValue, 0);

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Painel de Comissões</h2>
            <p className="text">
              Acompanhe suas comissões e histórico de pagamentos
            </p>
          </div>
        </div>
      </div>
      <div className="row mb30">
        <div className="col-sm-6 col-lg-4">
          <div className="ps-widget bgc-white bdrs4 p30 default-box-shadow1 text-center">
            <p className="fz14 body-color mb10">Total Recebido</p>
            <h3 className="fw700" style={{ color: "#5bbb7b" }}>
              {formatCurrency(totalPaid)}
            </h3>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="ps-widget bgc-white bdrs4 p30 default-box-shadow1 text-center">
            <p className="fz14 body-color mb10">Pendente</p>
            <h3 className="fw700" style={{ color: "#ffc107" }}>
              {formatCurrency(totalPending)}
            </h3>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <div className="ps-widget bgc-white bdrs4 p30 default-box-shadow1 text-center">
            <p className="fz14 body-color mb10">Total Geral</p>
            <h3 className="fw700 text-thm2">
              {formatCurrency(totalPaid + totalPending)}
            </h3>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <h5 className="title bdrb1 pb15 mb20">Extrato de Comissões</h5>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz14 fw600">Data</th>
                    <th className="fz14 fw600">Cliente</th>
                    <th className="fz14 fw600">Cota</th>
                    <th className="fz14 fw600">Modelo</th>
                    <th className="fz14 fw600">Comissão</th>
                    <th className="fz14 fw600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {commissions.map((c) => (
                    <tr key={c.id}>
                      <td className="fz14">{c.date}</td>
                      <td className="fz14">{c.client}</td>
                      <td className="fz14">{c.quota}</td>
                      <td className="fz14">{c.type}</td>
                      <td className="fz14 fw500">
                        {formatCurrency(c.commissionValue)}
                      </td>
                      <td>
                        <span
                          className={`quota-status-badge ${
                            c.status === "Pago"
                              ? "ativa"
                              : c.status === "Pendente"
                              ? "inadimplente"
                              : "contemplada"
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
      </div>
    </div>
  );
}
