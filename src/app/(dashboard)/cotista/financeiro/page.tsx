"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockMyPayments,
  getPaymentStatusLabel,
  getPaymentStatusColor,
  type MyPayment,
} from "@/data/mock-cotista";

export default function FinanceiroPage() {
  const [filterStatus, setFilterStatus] = useState<MyPayment["status"] | "todos">("todos");
  const [filterGroup, setFilterGroup] = useState<string>("todos");

  const groups = [...new Set(mockMyPayments.map((p) => p.groupCode))];

  const filtered = mockMyPayments
    .filter((p) => (filterStatus === "todos" ? true : p.status === filterStatus))
    .filter((p) => (filterGroup === "todos" ? true : p.groupCode === filterGroup))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPago = mockMyPayments
    .filter((p) => p.status === "pago")
    .reduce((s, p) => s + p.value, 0);
  const proximaParcela = mockMyPayments.find(
    (p) => p.status === "agendado" || p.status === "pendente"
  );
  const pendenteValor = mockMyPayments
    .filter((p) => p.status === "pendente" || p.status === "atrasado")
    .reduce((s, p) => s + p.value, 0);

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Financeiro</h2>
            <p className="text">
              Extrato de parcelas e pagamentos das suas cotas
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb30">
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{formatCurrency(totalPago)}</div>
              <span className="fz13 body-color">Total Pago</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "rgba(91,187,123,0.15)" }}
            >
              <i className="flaticon-like-1 fz20" style={{ color: "#5bbb7b" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">
                {proximaParcela ? formatCurrency(proximaParcela.value) : "—"}
              </div>
              <span className="fz13 body-color">Próxima Parcela</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#0d6efd15" }}
            >
              <i className="flaticon-calendar fz20" style={{ color: "#0d6efd" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{formatCurrency(pendenteValor)}</div>
              <span className="fz13 body-color">Pendente</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#f0ad4e15" }}
            >
              <i className="flaticon-dollar fz20" style={{ color: "#f0ad4e" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{mockMyPayments.length}</div>
              <span className="fz13 body-color">Lançamentos</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#6f42c115" }}
            >
              <i className="flaticon-document fz20" style={{ color: "#6f42c1" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb20">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p15 d-flex flex-wrap align-items-center gap-3">
            <span className="fz14 fw500 body-color">Filtrar:</span>
            <select
              className="form-select w-auto fz14"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as MyPayment["status"] | "todos")}
            >
              <option value="todos">Todos os status</option>
              <option value="pago">Pago</option>
              <option value="pendente">Pendente</option>
              <option value="atrasado">Atrasado</option>
              <option value="agendado">Agendado</option>
            </select>
            <select
              className="form-select w-auto fz14"
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
            >
              <option value="todos">Todos os grupos</option>
              {groups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Extrato */}
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            <div className="d-flex justify-content-between bdrb1 pb15 mb20">
              <h5 className="title">Extrato</h5>
              <button className="ud-btn btn-thm-border bdrs12 fz13" style={{ padding: "8px 16px" }}>
                <i className="fal fa-download me-1" /> Exportar
              </button>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-5">
                <i className="flaticon-dollar fz40 body-light-color" />
                <h5 className="mt15">Nenhum lançamento encontrado</h5>
                <p className="body-color fz14">Ajuste os filtros.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="fz14 fw600">Data</th>
                      <th className="fz14 fw600">Grupo / Cota</th>
                      <th className="fz14 fw600">Descrição</th>
                      <th className="fz14 fw600">Tipo</th>
                      <th className="fz14 fw600">Valor</th>
                      <th className="fz14 fw600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((payment) => (
                      <tr key={payment.id}>
                        <td className="fz14">
                          {new Date(payment.date).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          <p className="fw500 mb-0 fz14">{payment.groupCode}</p>
                          <span className="fz12 body-color">Cota #{payment.quotaNumber}</span>
                        </td>
                        <td className="fz14">{payment.description}</td>
                        <td className="fz14 text-capitalize">{payment.type}</td>
                        <td className="fz14 fw500">{formatCurrency(payment.value)}</td>
                        <td>
                          <span
                            className="text-white fz12 fw600"
                            style={{
                              padding: "4px 10px",
                              borderRadius: 10,
                              backgroundColor: getPaymentStatusColor(payment.status),
                            }}
                          >
                            {getPaymentStatusLabel(payment.status)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div
            className="p20 bdrs12"
            style={{ backgroundColor: "rgba(13, 110, 253, 0.06)" }}
          >
            <p className="fz13 mb-0 body-color">
              <i className="fas fa-info-circle me-2" style={{ color: "#0d6efd" }} />
              As parcelas são debitadas automaticamente conforme o calendário de cada grupo.
              Em caso de dúvida, entre em contato com a administradora do seu consórcio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
