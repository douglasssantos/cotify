"use client";

import { useState, useMemo } from "react";
import BaseModal from "./BaseModal";
import { formatCurrency } from "@/lib/utils";
import type { Quota } from "@/data/mock-quotas";

export interface SimuladorInadimplenciaModalProps {
  open: boolean;
  onClose: () => void;
  quota: Quota;
}

/** Juros ao mês (ex.: 1%) + multa única (ex.: 2% sobre o valor em atraso) - valores mock */
const JUROS_MENSAL = 0.01;
const MULTA_PERCENT = 2;

export default function SimuladorInadimplenciaModal({
  open,
  onClose,
  quota,
}: SimuladorInadimplenciaModalProps) {
  const [parcelasAtrasadas, setParcelasAtrasadas] = useState(1);
  const [diasAtraso, setDiasAtraso] = useState(30);

  const valorParcela = quota.installmentValue;
  const valorEmAtraso = parcelasAtrasadas * valorParcela;

  const multa = useMemo(() => {
    return (valorEmAtraso * MULTA_PERCENT) / 100;
  }, [valorEmAtraso]);

  const mesesAtraso = Math.ceil(diasAtraso / 30);
  const juros = useMemo(() => {
    return valorEmAtraso * (Math.pow(1 + JUROS_MENSAL, mesesAtraso) - 1);
  }, [valorEmAtraso, mesesAtraso]);

  const totalRegularizacao = valorEmAtraso + multa + juros;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      title="Simulador de Inadimplência"
      icon="fa-exclamation-triangle"
      maxWidth="500px"
    >
      <p className="fz13 body-color mb20">
        Simule juros e multa em caso de atraso. Use para estimar o valor total a pagar na regularização.
      </p>

      <div className="bdrs8 p15 mb20" style={{ backgroundColor: "rgba(235,103,83,0.08)" }}>
        <p className="fz12 body-color mb-1">{quota.groupCode} — Cota #{quota.quotaNumber}</p>
        <p className="fz14 fw600 mb-0">
          Parcela: <strong>{formatCurrency(valorParcela)}</strong>/mês
        </p>
      </div>

      <div className="mb20">
        <label className="fw500 ff-heading dark-color mb-2 d-block">Quantidade de parcelas em atraso</label>
        <div className="d-flex align-items-center gap-3">
          <input
            type="range"
            min="1"
            max="12"
            value={parcelasAtrasadas}
            onChange={(e) => setParcelasAtrasadas(Number(e.target.value))}
            className="form-range flex-grow-1"
          />
          <span className="fz14 fw600" style={{ minWidth: 32 }}>{parcelasAtrasadas}</span>
          <span className="fz12 body-color">parcela(s)</span>
        </div>
      </div>

      <div className="mb20">
        <label className="fw500 ff-heading dark-color mb-2 d-block">Dias em atraso (parcela mais antiga)</label>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <input
            type="number"
            min="1"
            max="365"
            value={diasAtraso}
            onChange={(e) => setDiasAtraso(Math.min(365, Math.max(1, Number(e.target.value) || 0)))}
            className="form-control"
            style={{ width: 100 }}
          />
          <span className="fz12 body-color">dias</span>
        </div>
      </div>

      {/* Resultados */}
      <div className="row g-3 mb20">
        <div className="col-12">
          <div className="d-flex justify-content-between bdrs8 px-3 py-2" style={{ backgroundColor: "#f8f9fa" }}>
            <span className="fz13 body-color">Valor das parcelas em atraso</span>
            <span className="fz13 fw600">{formatCurrency(valorEmAtraso)}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="d-flex justify-content-between bdrs8 px-3 py-2" style={{ backgroundColor: "#f8f9fa" }}>
            <span className="fz13 body-color">Multa ({MULTA_PERCENT}% sobre o atraso)</span>
            <span className="fz13 fw600">{formatCurrency(multa)}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="d-flex justify-content-between bdrs8 px-3 py-2" style={{ backgroundColor: "#f8f9fa" }}>
            <span className="fz13 body-color">Juros ({(JUROS_MENSAL * 100).toFixed(0)}% a.m., {mesesAtraso} mês(es))</span>
            <span className="fz13 fw600">{formatCurrency(juros)}</span>
          </div>
        </div>
        <div className="col-12">
          <div
            className="bdrs8 px-3 py-3 d-flex justify-content-between align-items-center"
            style={{ backgroundColor: "rgba(235,103,83,0.1)", border: "1px solid rgba(235,103,83,0.3)" }}
          >
            <span className="fz14 fw600 dark-color">Total para regularizar</span>
            <span className="fz18 fw700" style={{ color: "#c53030" }}>
              {formatCurrency(totalRegularizacao)}
            </span>
          </div>
        </div>
      </div>

      <div className="bdrs8 p15" style={{ backgroundColor: "rgba(235,103,83,0.06)", border: "1px solid rgba(235,103,83,0.2)" }}>
        <p className="fz12 body-color mb-0">
          <i className="fal fa-info-circle me-1" style={{ color: "#c53030" }} />
          Valores ilustrativos. Consulte o boleto ou a administradora para o valor exato. A inadimplência pode levar ao bloqueio da cota e perda do direito à contemplação.
        </p>
      </div>
    </BaseModal>
  );
}
