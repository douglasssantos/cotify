"use client";

import { useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import {
  mockTransfers,
  getTransferStatusLabel,
  getTransferStatusColor,
  type TransferStatus,
} from "@/data/mock-secondary-market";

export default function RepassesPage() {
  const [selectedTransferId, setSelectedTransferId] = useState<string>(
    mockTransfers[0]?.id || ""
  );

  const selectedTransfer = mockTransfers.find((t) => t.id === selectedTransferId);

  const activeCount = mockTransfers.filter(
    (t) => !["concluido", "cancelado", "reprovado"].includes(t.status)
  ).length;
  const completedCount = mockTransfers.filter(
    (t) => t.status === "concluido"
  ).length;

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Repasses</h2>
            <p className="text">
              Acompanhe o processo de transferência de suas cotas
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb30">
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{mockTransfers.length}</div>
              <span className="fz13 body-color">Total de Repasses</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#0d6efd15" }}
            >
              <i className="flaticon-transfer fz20" style={{ color: "#0d6efd" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{activeCount}</div>
              <span className="fz13 body-color">Em Andamento</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#f0ad4e15" }}
            >
              <i className="flaticon-flash fz20" style={{ color: "#f0ad4e" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{completedCount}</div>
              <span className="fz13 body-color">Concluídos</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "rgba(91,187,123,0.08)" }}
            >
              <i className="flaticon-badge fz20" style={{ color: "#5bbb7b" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">
                {formatCurrency(mockTransfers.reduce((s, t) => s + t.agreedPrice, 0))}
              </div>
              <span className="fz13 body-color">Valor Total</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#6f42c115" }}
            >
              <i className="flaticon-dollar fz20" style={{ color: "#6f42c1" }} />
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Transfer List */}
        <div className="col-lg-4">
          <div className="ps-widget bgc-white bdrs12 p20 mb30">
            <h5 className="mb15">Seus Repasses</h5>
            {mockTransfers.map((transfer) => {
              const isActive = selectedTransferId === transfer.id;
              return (
                <div
                  key={transfer.id}
                  onClick={() => setSelectedTransferId(transfer.id)}
                  className={`p15 bdrs8 mb10 ${isActive ? "default-box-shadow1" : "hover-box-shadow"}`}
                  style={{
                    cursor: "pointer",
                    border: isActive ? "2px solid #5bbb7b" : "1px solid #eee",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-start mb10">
                    <div>
                      <h6 className="mb-0 fz14">
                        {transfer.listing.groupCode} · Cota #{transfer.listing.quotaNumber}
                      </h6>
                      <span className="fz12 body-color">
                        {transfer.listing.goodTypeLabel} · {transfer.listing.administradora}
                      </span>
                    </div>
                    <span
                      className="text-white fz11 fw600"
                      style={{
                        padding: "3px 8px",
                        borderRadius: 10,
                        backgroundColor: getTransferStatusColor(transfer.status),
                        whiteSpace: "nowrap",
                      }}
                    >
                      {getTransferStatusLabel(transfer.status)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between fz13">
                    <span className="body-color">Valor:</span>
                    <span className="fw500">{formatCurrency(transfer.agreedPrice)}</span>
                  </div>
                  <div className="d-flex justify-content-between fz13">
                    <span className="body-color">Comprador:</span>
                    <span className="fw500">{transfer.buyerName}</span>
                  </div>
                  {/* Progress */}
                  <div className="mt10">
                    <div className="progress" style={{ height: 4 }}>
                      <div
                        className="progress-bar"
                        style={{
                          width: `${(transfer.steps.filter((s) => s.status === "completo").length / transfer.steps.length) * 100}%`,
                          backgroundColor: getTransferStatusColor(transfer.status),
                        }}
                      />
                    </div>
                    <span className="fz11 body-light-color">
                      {transfer.steps.filter((s) => s.status === "completo").length}/{transfer.steps.length} etapas
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transfer Detail */}
        <div className="col-lg-8">
          {selectedTransfer ? (
            <>
              {/* Header */}
              <div className="ps-widget bgc-white bdrs12 p25 mb20">
                <div className="d-flex justify-content-between align-items-start flex-wrap">
                  <div>
                    <h4 className="mb5">
                      {selectedTransfer.listing.groupCode} · Cota #{selectedTransfer.listing.quotaNumber}
                    </h4>
                    <p className="body-color fz14 mb-0">
                      {selectedTransfer.listing.goodTypeLabel} · {selectedTransfer.listing.administradora} ·{" "}
                      Crédito {formatCurrency(selectedTransfer.listing.creditValue)}
                    </p>
                  </div>
                  <div className="text-lg-end mt15-sm">
                    <span
                      className="text-white fz13 fw600"
                      style={{
                        padding: "6px 16px",
                        borderRadius: 20,
                        backgroundColor: getTransferStatusColor(selectedTransfer.status),
                      }}
                    >
                      {getTransferStatusLabel(selectedTransfer.status)}
                    </span>
                  </div>
                </div>
                <div className="row mt20">
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Valor Acordado</span>
                    <span className="fw600 fz15 text-thm2">{formatCurrency(selectedTransfer.agreedPrice)}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Comprador</span>
                    <span className="fw500 fz14">{selectedTransfer.buyerName}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Início</span>
                    <span className="fw500 fz14">{selectedTransfer.createdAt}</span>
                  </div>
                  <div className="col-6 col-md-3">
                    <span className="fz12 body-light-color d-block">Previsão</span>
                    <span className="fw500 fz14">{selectedTransfer.estimatedCompletion || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="ps-widget bgc-white bdrs12 p25 mb20">
                <h5 className="mb20">Progresso do Repasse</h5>
                <div className="position-relative">
                  {selectedTransfer.steps.map((step, index) => {
                    const isLast = index === selectedTransfer.steps.length - 1;
                    const iconBg =
                      step.status === "completo"
                        ? "#5bbb7b"
                        : step.status === "atual"
                        ? "#0d6efd"
                        : "#dee2e6";
                    const iconContent =
                      step.status === "completo"
                        ? "fa-check"
                        : step.status === "atual"
                        ? "fa-spinner fa-pulse"
                        : "fa-circle";

                    return (
                      <div
                        key={step.id}
                        className="d-flex"
                        style={{ minHeight: isLast ? "auto" : 80 }}
                      >
                        {/* Line + Icon */}
                        <div className="d-flex flex-column align-items-center me-3" style={{ width: 36 }}>
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle text-white flex-shrink-0"
                            style={{
                              width: 36,
                              height: 36,
                              backgroundColor: iconBg,
                              fontSize: 14,
                            }}
                          >
                            <i className={`fas ${iconContent}`} />
                          </div>
                          {!isLast && (
                            <div
                              className="flex-grow-1"
                              style={{
                                width: 2,
                                backgroundColor: step.status === "completo" ? "#5bbb7b" : "#dee2e6",
                              }}
                            />
                          )}
                        </div>
                        {/* Content */}
                        <div className={`pb20 ${step.status === "atual" ? "" : ""}`}>
                          <h6 className={`mb5 ${step.status === "pendente" ? "body-light-color" : ""}`}>
                            {step.label}
                          </h6>
                          <p className={`fz13 mb5 ${step.status === "pendente" ? "body-light-color" : "body-color"}`}>
                            {step.description}
                          </p>
                          {step.date && (
                            <span className="fz12 body-light-color">
                              <i className="fas fa-calendar-alt me-1" />
                              {step.date}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Documents */}
              <div className="ps-widget bgc-white bdrs12 p25 mb20">
                <div className="d-flex justify-content-between align-items-center mb20">
                  <h5 className="mb-0">Documentos</h5>
                  {selectedTransfer.documents.some((d) => d.status === "pendente") && (
                    <button className="ud-btn btn-thm bdrs12 fz13" style={{ padding: "8px 16px" }}>
                      <i className="fas fa-upload me-1" /> Enviar Documento
                    </button>
                  )}
                </div>
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="fz13 fw500 body-color">Documento</th>
                        <th className="fz13 fw500 body-color">Status</th>
                        <th className="fz13 fw500 body-color">Data</th>
                        <th className="fz13 fw500 body-color">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTransfer.documents.map((doc, i) => {
                        const statusColors: Record<string, string> = {
                          pendente: "#f0ad4e",
                          enviado: "#0d6efd",
                          aprovado: "#5bbb7b",
                          rejeitado: "#eb6753",
                        };
                        const statusLabels: Record<string, string> = {
                          pendente: "Pendente",
                          enviado: "Enviado",
                          aprovado: "Aprovado",
                          rejeitado: "Rejeitado",
                        };
                        return (
                          <tr key={i}>
                            <td className="fz14">
                              <i className="fas fa-file-alt me-2 body-light-color" />
                              {doc.name}
                            </td>
                            <td>
                              <span
                                className="text-white fz11 fw600"
                                style={{
                                  padding: "3px 10px",
                                  borderRadius: 10,
                                  backgroundColor: statusColors[doc.status],
                                }}
                              >
                                {statusLabels[doc.status]}
                              </span>
                            </td>
                            <td className="fz13 body-color">{doc.uploadedAt || "-"}</td>
                            <td>
                              {doc.status === "pendente" ? (
                                <button className="ud-btn btn-thm-border bdrs8 fz12" style={{ padding: "4px 12px" }}>
                                  Enviar
                                </button>
                              ) : doc.status === "rejeitado" ? (
                                <button className="ud-btn bdrs8 fz12" style={{ padding: "4px 12px", color: "#eb6753", border: "1px solid #eb6753" }}>
                                  Reenviar
                                </button>
                              ) : (
                                <span className="fz12 body-light-color">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Info box */}
              <div
                className="p15 bdrs12"
                style={{ backgroundColor: "rgba(91, 187, 123, 0.08)" }}
              >
                <p className="fz13 mb-0 body-color">
                  <i className="fas fa-shield-alt me-2" style={{ color: "#5bbb7b" }} />
                  <strong>Escrow da Plataforma:</strong> O valor acordado de{" "}
                  {formatCurrency(selectedTransfer.agreedPrice)} ficará retido pela plataforma
                  até a conclusão de todas as etapas do repasse, garantindo segurança para ambas as partes.
                </p>
              </div>
            </>
          ) : (
            <div className="ps-widget bgc-white bdrs12 p30 text-center">
              <i className="flaticon-transfer fz40 body-light-color" />
              <h5 className="mt15">Selecione um repasse</h5>
              <p className="body-color fz14">
                Clique em um repasse ao lado para ver os detalhes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
