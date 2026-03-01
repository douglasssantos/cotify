"use client";

import { useState, useMemo } from "react";
import BaseModal from "./BaseModal";
import { formatCurrency } from "@/lib/utils";
import { installmentBreakdown, type Quota } from "@/data/mock-quotas";

export interface SimuladorContemplacaoModalProps {
  open: boolean;
  onClose: () => void;
  quota: Quota;
}

type TipoContemplacao = "sorteio" | "lance";

export default function SimuladorContemplacaoModal({
  open,
  onClose,
  quota,
}: SimuladorContemplacaoModalProps) {
  const [tipo, setTipo] = useState<TipoContemplacao>("sorteio");
  const [lancePercent, setLancePercent] = useState(25);

  const breakdown = useMemo(() => installmentBreakdown(quota), [quota]);

  /** Se contemplado por lance: valor do lance (desconto dado sobre o crédito) */
  const lanceValue = useMemo(
    () => (quota.creditValue * lancePercent) / 100,
    [quota.creditValue, lancePercent]
  );

  /** Crédito líquido após contemplação por lance (crédito - lance) */
  const creditAfterBid = useMemo(
    () => quota.creditValue - lanceValue,
    [quota.creditValue, lanceValue]
  );

  /** Parcela mensal após contemplação: sobre o saldo devedor restante (crédito já pago foi "consumido") */
  const remainingDebt = quota.creditValue - quota.paidAmount;
  const installmentAfterContemplation = useMemo(() => {
    if (tipo === "sorteio") {
      return breakdown.total;
    }
    const term = quota.remainingInstallments;
    const base = creditAfterBid / term;
    const adm = (creditAfterBid * (quota.adminFee / 100)) / term;
    const fr = (creditAfterBid * (quota.reserveFund / 100)) / term;
    return base + adm + fr + quota.insurance;
  }, [tipo, breakdown.total, creditAfterBid, quota, remainingDebt]);

  const totalToPayRemaining = useMemo(
    () => installmentAfterContemplation * quota.remainingInstallments,
    [installmentAfterContemplation, quota.remainingInstallments]
  );

  const creditReleased = tipo === "sorteio" ? quota.creditValue : creditAfterBid;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Simulador de Contemplação"
      icon="fa-trophy"
      maxWidth="540px"
    >
      <p className="fz13 body-color mb20">
        Simule a contemplação da sua cota por <strong>sorteio</strong> ou por <strong>lance</strong> e veja o impacto nas parcelas e no crédito liberado.
      </p>

      <div className="bdrs8 p15 mb20" style={{ backgroundColor: "#f8f9fa" }}>
        <p className="fz12 body-color mb-1">{quota.groupCode} — Cota #{quota.quotaNumber}</p>
        <p className="fz14 fw600 mb-0">
          Crédito: {formatCurrency(quota.creditValue)} · Restam {quota.remainingInstallments} parcelas
        </p>
      </div>

      {/* Tipo: Sorteio ou Lance */}
      <div className="mb20">
        <label className="fw500 ff-heading dark-color mb-2 d-block">Forma de contemplação</label>
        <div className="d-flex gap-2">
          <button
            type="button"
            onClick={() => setTipo("sorteio")}
            className="ud-btn bdrs8 fz13 flex-grow-1"
            style={{
              backgroundColor: tipo === "sorteio" ? "#0d6efd" : "#f0f0f0",
              color: tipo === "sorteio" ? "#fff" : "#6c757d",
              border: "none",
            }}
          >
            <i className="fal fa-random me-1" /> Sorteio
          </button>
          <button
            type="button"
            onClick={() => setTipo("lance")}
            className="ud-btn bdrs8 fz13 flex-grow-1"
            style={{
              backgroundColor: tipo === "lance" ? "#0d6efd" : "#f0f0f0",
              color: tipo === "lance" ? "#fff" : "#6c757d",
              border: "none",
            }}
          >
            <i className="fal fa-gavel me-1" /> Lance
          </button>
        </div>
      </div>

      {tipo === "lance" && (
        <div className="mb20">
          <label className="fw500 ff-heading dark-color mb-2 d-block">
            Percentual do lance (desconto sobre o crédito)
          </label>
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <input
              type="range"
              min="5"
              max="40"
              step="1"
              value={lancePercent}
              onChange={(e) => setLancePercent(Number(e.target.value))}
              className="form-range flex-grow-1"
              style={{ maxWidth: 260 }}
            />
            <input
              type="number"
              min="5"
              max="40"
              value={lancePercent}
              onChange={(e) => setLancePercent(Math.min(40, Math.max(5, Number(e.target.value) || 0)))}
              className="form-control"
              style={{ width: 70 }}
            />
            <span className="fz14">%</span>
          </div>
          <p className="fz12 body-color mt-1 mb-0">
            Valor do lance: <strong>{formatCurrency(lanceValue)}</strong> (desconto dado na contemplação)
          </p>
        </div>
      )}

      {/* Resultados */}
      <div className="row g-3 mb15">
        <div className="col-12">
          <div className="bdrs8 p15" style={{ backgroundColor: "rgba(91,187,123,0.08)", border: "1px solid rgba(91,187,123,0.25)" }}>
            <p className="fz11 body-color mb-1">Crédito a ser liberado</p>
            <p className="fz20 fw700 mb-0" style={{ color: "#0d6a2c" }}>
              {formatCurrency(creditReleased)}
            </p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p15 h-100" style={{ border: "1px solid #e8e8e8" }}>
            <p className="fz11 body-color mb-1">Parcela mensal (após contemplação)</p>
            <p className="fz16 fw700 mb-0 dark-color">
              {formatCurrency(installmentAfterContemplation)}
            </p>
          </div>
        </div>
        <div className="col-6">
          <div className="bdrs8 p15 h-100" style={{ border: "1px solid #e8e8e8" }}>
            <p className="fz11 body-color mb-1">Total a pagar (restante)</p>
            <p className="fz16 fw700 mb-0 dark-color">
              {formatCurrency(totalToPayRemaining)}
            </p>
          </div>
        </div>
      </div>

      <div className="bdrs8 p15" style={{ backgroundColor: "#f8f9fa" }}>
        <p className="fz12 body-color mb-0">
          {tipo === "sorteio"
            ? "No sorteio não há desconto: você recebe o crédito integral e continua pagando as parcelas conforme o plano."
            : "No lance você antecipa a contemplação em troca de um desconto (lance). O crédito liberado é menor e as parcelas futuras podem ser recalculadas sobre o saldo restante."}
        </p>
      </div>
    </BaseModal>
  );
}
