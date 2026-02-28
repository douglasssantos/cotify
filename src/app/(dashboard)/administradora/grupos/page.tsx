"use client";

import { formatCurrency } from "@/lib/utils";

const groups = [
  {
    code: "GRP-4052",
    type: "Imóvel",
    credit: 350000,
    term: 180,
    totalQuotas: 200,
    activeQuotas: 188,
    adminFee: 18,
    status: "Ativo",
  },
  {
    code: "GRP-3187",
    type: "Veículo",
    credit: 85000,
    term: 72,
    totalQuotas: 150,
    activeQuotas: 142,
    adminFee: 15,
    status: "Ativo",
  },
  {
    code: "GRP-5521",
    type: "Imóvel",
    credit: 500000,
    term: 200,
    totalQuotas: 180,
    activeQuotas: 165,
    adminFee: 20,
    status: "Ativo",
  },
  {
    code: "GRP-2899",
    type: "Veículo",
    credit: 120000,
    term: 60,
    totalQuotas: 100,
    activeQuotas: 89,
    adminFee: 14,
    status: "Encerramento",
  },
  {
    code: "GRP-6100",
    type: "Serviço",
    credit: 45000,
    term: 60,
    totalQuotas: 80,
    activeQuotas: 75,
    adminFee: 16,
    status: "Formação",
  },
];

export default function GruposPage() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-9">
          <div className="dashboard_title_area">
            <h2>Gestão de Grupos</h2>
            <p className="text">Crie e gerencie os grupos de consórcio</p>
          </div>
        </div>
        <div className="col-lg-3 text-lg-end">
          <button className="ud-btn btn-thm bdrs4">
            <i className="fas fa-plus mr10" /> Novo Grupo
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz14 fw600">Código</th>
                    <th className="fz14 fw600">Tipo</th>
                    <th className="fz14 fw600">Crédito</th>
                    <th className="fz14 fw600">Prazo</th>
                    <th className="fz14 fw600">Cotas</th>
                    <th className="fz14 fw600">Taxa Adm</th>
                    <th className="fz14 fw600">Status</th>
                    <th className="fz14 fw600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((group) => (
                    <tr key={group.code}>
                      <td className="fz14 fw500">{group.code}</td>
                      <td className="fz14">{group.type}</td>
                      <td className="fz14">{formatCurrency(group.credit)}</td>
                      <td className="fz14">{group.term} meses</td>
                      <td className="fz14">
                        {group.activeQuotas}/{group.totalQuotas}
                      </td>
                      <td className="fz14">{group.adminFee}%</td>
                      <td>
                        <span
                          className={`quota-status-badge ${
                            group.status === "Ativo"
                              ? "ativa"
                              : group.status === "Formação"
                              ? "contemplada"
                              : "inadimplente"
                          }`}
                        >
                          {group.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="ud-btn btn-white bdrs4 fz12 px-3 py-1">
                            Editar
                          </button>
                          <button className="ud-btn btn-white bdrs4 fz12 px-3 py-1">
                            Cotas
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
      </div>
    </div>
  );
}
