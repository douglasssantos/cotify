"use client";

import Link from "next/link";
import { mockQuotas } from "@/data/mock-quotas";
import { formatCurrency, getStatusColor, getStatusLabel } from "@/lib/utils";

const myQuotas = mockQuotas.slice(0, 3);

export default function MinhasCotasPage() {
  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Minhas Cotas</h2>
            <p className="text">Gerencie todas as suas cotas de consórcio</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="fz14 fw600">Grupo / Cota</th>
                    <th className="fz14 fw600">Tipo</th>
                    <th className="fz14 fw600">Crédito</th>
                    <th className="fz14 fw600">Pago</th>
                    <th className="fz14 fw600">Parcela</th>
                    <th className="fz14 fw600">Restantes</th>
                    <th className="fz14 fw600">Status</th>
                    <th className="fz14 fw600">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {myQuotas.map((quota) => (
                    <tr key={quota.id}>
                      <td>
                        <p className="fw500 mb-0">{quota.groupCode}</p>
                        <span className="fz12 body-color">
                          Cota #{quota.quotaNumber}
                        </span>
                      </td>
                      <td className="fz14">{quota.goodTypeLabel}</td>
                      <td className="fz14 fw500">
                        {formatCurrency(quota.creditValue)}
                      </td>
                      <td className="fz14">
                        {formatCurrency(quota.paidAmount)}
                      </td>
                      <td className="fz14">
                        {formatCurrency(quota.installmentValue)}
                      </td>
                      <td className="fz14">
                        {quota.remainingInstallments}/{quota.totalInstallments}
                      </td>
                      <td>
                        <span
                          className={`quota-status-badge ${getStatusColor(
                            quota.status
                          )}`}
                        >
                          {getStatusLabel(quota.status)}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            href={`/marketplace/${quota.id}`}
                            className="ud-btn btn-white bdrs4 fz12 px-3 py-1"
                          >
                            Ver
                          </Link>
                          <button className="ud-btn btn-thm-border bdrs4 fz12 px-3 py-1">
                            Vender
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
