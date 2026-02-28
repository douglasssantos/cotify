"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  formatCurrency,
  formatPercent,
  calculateInstallment,
} from "@/lib/utils";
import { mockQuotas, Quota } from "@/data/mock-quotas";
import { mockGroups, Group } from "@/data/mock-groups";

const goodTypeOptions = [
  {
    value: "imovel",
    label: "Imóvel",
    icon: "flaticon-home",
    desc: "Casas, apartamentos, terrenos e lotes",
    range: "R$ 100 mil a R$ 1 milhão",
    count: "2.500+",
  },
  {
    value: "veiculo",
    label: "Veículo",
    icon: "fas fa-car",
    desc: "Carros, motos, caminhões e utilitários",
    range: "R$ 30 mil a R$ 300 mil",
    count: "1.800+",
  },
  {
    value: "servico",
    label: "Serviço",
    icon: "flaticon-briefcase",
    desc: "Reformas, viagens, procedimentos e mais",
    range: "R$ 10 mil a R$ 200 mil",
    count: "500+",
  },
];

const termOptions = [
  { value: 60, label: "60 meses (5 anos)" },
  { value: 72, label: "72 meses (6 anos)" },
  { value: 120, label: "120 meses (10 anos)" },
  { value: 144, label: "144 meses (12 anos)" },
  { value: 180, label: "180 meses (15 anos)" },
  { value: 200, label: "200 meses (~17 anos)" },
];

interface SimParams {
  goodType: string;
  creditValue: number;
  term: number;
  adminFee: number;
  reserveFund: number;
  installment: number;
}

function scoreQuota(q: Quota, params: SimParams): number {
  let score = 0;

  if (q.goodType !== params.goodType) return -1;
  if (q.status === "cancelada") return -1;

  const creditDiff = Math.abs(q.creditValue - params.creditValue) / params.creditValue;
  if (creditDiff > 0.8) return -1;
  score += Math.max(0, 40 * (1 - creditDiff));

  const termDiff = Math.abs(q.totalInstallments - params.term) / params.term;
  score += Math.max(0, 20 * (1 - termDiff));

  const adminDiff = Math.abs(q.adminFee - params.adminFee) / Math.max(params.adminFee, 1);
  score += Math.max(0, 15 * (1 - adminDiff));

  const frDiff = Math.abs(q.reserveFund - params.reserveFund) / Math.max(params.reserveFund, 1);
  score += Math.max(0, 10 * (1 - frDiff));

  if (q.installmentValue <= params.installment * 1.1) score += 10;

  if (q.status === "contemplada") score += 5;

  return score;
}

function scoreGroup(g: Group, params: SimParams): number {
  let score = 0;

  if (g.goodType !== params.goodType) return -1;
  if (g.status === "encerrado") return -1;

  const creditDiff = Math.abs(g.creditValue - params.creditValue) / params.creditValue;
  if (creditDiff > 0.8) return -1;
  score += Math.max(0, 40 * (1 - creditDiff));

  const termDiff = Math.abs(g.term - params.term) / params.term;
  score += Math.max(0, 20 * (1 - termDiff));

  const adminDiff = Math.abs(g.adminFee - params.adminFee) / Math.max(params.adminFee, 1);
  score += Math.max(0, 15 * (1 - adminDiff));

  const frDiff = Math.abs(g.reserveFund - params.reserveFund) / Math.max(params.reserveFund, 1);
  score += Math.max(0, 10 * (1 - frDiff));

  if (g.status === "formacao") score += 5;
  if (g.activeQuotas > 0) score += 5;
  const pctContemplated = g.contemplatedQuotas / g.totalQuotas;
  score += 5 * (1 - pctContemplated);

  return score;
}

function findSuggestions(
  params: SimParams
): { quotas: (Quota & { score: number })[]; groups: (Group & { score: number })[] } {
  const scoredQuotas = mockQuotas
    .map((q) => ({ ...q, score: scoreQuota(q, params) }))
    .filter((q) => q.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  const scoredGroups = mockGroups
    .map((g) => ({ ...g, score: scoreGroup(g, params) }))
    .filter((g) => g.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return { quotas: scoredQuotas, groups: scoredGroups };
}

export default function Simulator() {
  const [creditValue, setCreditValue] = useState(200000);
  const [term, setTerm] = useState(180);
  const [goodType, setGoodType] = useState("imovel");
  const [adminFee, setAdminFee] = useState(18);
  const [reserveFund, setReserveFund] = useState(3);
  const [insurance, setInsurance] = useState(0.5);
  const [showResult, setShowResult] = useState(false);

  const installment = calculateInstallment(
    creditValue,
    term,
    adminFee,
    reserveFund,
    insurance
  );

  const totalAdminFee = creditValue * (adminFee / 100);
  const totalReserveFund = creditValue * (reserveFund / 100);
  const totalInsurance = creditValue * (insurance / 100);
  const totalPaid = installment * term;
  const commonFundMonthly = creditValue / term;
  const costOverCredit = ((totalPaid - creditValue) / creditValue) * 100;

  const suggestions = useMemo(
    () =>
      showResult
        ? findSuggestions({ goodType, creditValue, term, adminFee, reserveFund, installment })
        : { quotas: [], groups: [] },
    [showResult, goodType, creditValue, term, adminFee, reserveFund, installment]
  );

  const handleSimulate = () => {
    setShowResult(true);
  };

  const selectedGoodType = goodTypeOptions.find((g) => g.value === goodType);

  return (
    <>
      {/* Good Type Selection */}
      <div className="row mb40">
        {goodTypeOptions.map((item) => {
          const isActive = goodType === item.value;
          return (
            <div key={item.value} className="col-sm-4">
              <div
                onClick={() => {
                  setGoodType(item.value);
                  setShowResult(false);
                }}
                className={`iconbox-style1 bdrs16 p30 text-center mb30 position-relative overflow-hidden ${
                  isActive
                    ? "default-box-shadow2"
                    : "bdr1 hover-box-shadow"
                }`}
                style={{
                  cursor: "pointer",
                  borderColor: isActive ? "#5bbb7b" : undefined,
                  borderWidth: isActive ? 2 : undefined,
                  borderStyle: isActive ? "solid" : undefined,
                }}
              >
                {isActive && (
                  <span
                    className="position-absolute d-flex align-items-center justify-content-center bgc-thm text-white"
                    style={{
                      top: 12,
                      right: 12,
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      fontSize: 14,
                    }}
                  >
                    <i className="fas fa-check" />
                  </span>
                )}
                <div
                  className={`d-inline-flex align-items-center justify-content-center mb20 ${
                    isActive ? "bgc-thm2" : "bgc-thm4"
                  }`}
                  style={{ width: 80, height: 80, borderRadius: "50%" }}
                >
                  <span
                    className={`${item.icon} ${
                      isActive ? "text-white" : "text-thm2"
                    }`}
                    style={{ fontSize: 32 }}
                  />
                </div>
                <h4 className="title mb10">{item.label}</h4>
                <p className="body-color fz14 mb10">{item.desc}</p>
                <p className="fz13 body-light-color mb15">{item.range}</p>
                <span
                  className={`tag bdrs60 ${
                    isActive ? "bgc-thm text-white" : ""
                  }`}
                >
                  {item.count} cotas
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row">
        {/* Form */}
        <div className="col-lg-7 mb30">
          <div className="ps-widget bgc-white bdrs12 p30 default-box-shadow1">
            <h4 className="mb25">
              <i className={`${selectedGoodType?.icon} text-thm2 me-2`} />
              Simulação de {selectedGoodType?.label}
            </h4>

            <div className="mb25">
              <label className="fw500 ff-heading dark-color mb-2">
                Valor do Crédito
              </label>
              <h3 className="text-thm2 mb10">{formatCurrency(creditValue)}</h3>
              <input
                type="range"
                className="form-range"
                min={goodType === "servico" ? 10000 : goodType === "veiculo" ? 30000 : 100000}
                max={goodType === "servico" ? 200000 : goodType === "veiculo" ? 300000 : 1000000}
                step={goodType === "servico" ? 5000 : 10000}
                value={creditValue}
                onChange={(e) => {
                  setCreditValue(Number(e.target.value));
                  setShowResult(false);
                }}
              />
              <div className="d-flex justify-content-between fz12 body-color">
                <span>
                  {formatCurrency(
                    goodType === "servico" ? 10000 : goodType === "veiculo" ? 30000 : 100000
                  )}
                </span>
                <span>
                  {formatCurrency(
                    goodType === "servico" ? 200000 : goodType === "veiculo" ? 300000 : 1000000
                  )}
                </span>
              </div>
            </div>

            <div className="mb25">
              <label className="fw500 ff-heading dark-color mb-2">Prazo</label>
              <select
                className="form-select"
                value={term}
                onChange={(e) => {
                  setTerm(Number(e.target.value));
                  setShowResult(false);
                }}
              >
                {termOptions.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="row mb25">
              <div className="col-4">
                <label className="fw500 ff-heading dark-color mb-2 fz14">
                  Taxa Adm. (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={adminFee}
                  onChange={(e) => {
                    setAdminFee(Number(e.target.value));
                    setShowResult(false);
                  }}
                  min={0}
                  max={30}
                  step={0.5}
                />
              </div>
              <div className="col-4">
                <label className="fw500 ff-heading dark-color mb-2 fz14">
                  Fundo Res. (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={reserveFund}
                  onChange={(e) => {
                    setReserveFund(Number(e.target.value));
                    setShowResult(false);
                  }}
                  min={0}
                  max={10}
                  step={0.5}
                />
              </div>
              <div className="col-4">
                <label className="fw500 ff-heading dark-color mb-2 fz14">
                  Seguro (%)
                </label>
                <input
                  type="number"
                  className="form-control"
                  value={insurance}
                  onChange={(e) => {
                    setInsurance(Number(e.target.value));
                    setShowResult(false);
                  }}
                  min={0}
                  max={5}
                  step={0.1}
                />
              </div>
            </div>

            <div className="d-grid">
              <button
                className="ud-btn btn-thm bdrs12"
                type="button"
                onClick={handleSimulate}
              >
                Simular Consórcio
                <i className="fal fa-arrow-right-long" />
              </button>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="col-lg-5 mb30">
          {showResult ? (
            <div className="price-widget pt25 pb25 bdrs12">
              <h4 className="widget-title mb5">Parcela Estimada</h4>
              <h2 className="text-thm mb5">{formatCurrency(installment)}</h2>
              <p className="text fz14 mb20">por mês durante {term} meses</p>

              <hr className="opacity-100" />

              <div className="d-flex justify-content-between mb10 mt15">
                <span className="fz14 body-color">Fundo Comum</span>
                <span className="fw500 fz14">
                  {formatCurrency(commonFundMonthly)}/mês
                </span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Taxa Administração</span>
                <span className="fw500 fz14">
                  {formatCurrency(totalAdminFee / term)}/mês
                </span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Fundo de Reserva</span>
                <span className="fw500 fz14">
                  {formatCurrency(totalReserveFund / term)}/mês
                </span>
              </div>
              <div className="d-flex justify-content-between mb15">
                <span className="fz14 body-color">Seguro</span>
                <span className="fw500 fz14">
                  {formatCurrency(totalInsurance / term)}/mês
                </span>
              </div>

              <hr className="opacity-100" />

              <div className="d-flex justify-content-between mb10 mt15">
                <span className="fz14 body-color">Taxa Adm. Total</span>
                <span className="fw500 fz14">
                  {formatCurrency(totalAdminFee)} ({formatPercent(adminFee)})
                </span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Fundo de Reserva Total</span>
                <span className="fw500 fz14">
                  {formatCurrency(totalReserveFund)} ({formatPercent(reserveFund)})
                </span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Seguro Total</span>
                <span className="fw500 fz14">
                  {formatCurrency(totalInsurance)} ({formatPercent(insurance)})
                </span>
              </div>
              <div className="d-flex justify-content-between mb10">
                <span className="fz14 body-color">Total de Taxas e Encargos</span>
                <span className="fw600 fz14 text-thm2">
                  {formatCurrency(totalAdminFee + totalReserveFund + totalInsurance)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb15">
                <span className="fz14 body-color">Custo sobre crédito</span>
                <span className="fw500 fz14">{costOverCredit.toFixed(1)}%</span>
              </div>

              <hr className="opacity-100" />

              <div className="d-flex justify-content-between mt15 mb5">
                <span className="fz15 fw600 dark-color">Crédito</span>
                <span className="fw700 fz17 text-thm2">
                  {formatCurrency(creditValue)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb15">
                <span className="fz15 fw600 dark-color">Total a Pagar</span>
                <span className="fw700 fz17">{formatCurrency(totalPaid)}</span>
              </div>

              <div className="d-grid mt15">
                <Link href="/marketplace" className="ud-btn btn-thm-border bdrs12">
                  Ver Cotas Disponíveis
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="ps-widget bgc-white bdrs12 p30 default-box-shadow1 h-100 d-flex align-items-center justify-content-center">
              <div className="text-center">
                <i className="flaticon-flash fz60 text-thm2" />
                <h5 className="mt20">Configure sua simulação</h5>
                <p className="body-color fz14">
                  Escolha o tipo de bem, valor do crédito e prazo desejado.
                  <br />
                  Clique em &ldquo;Simular Consórcio&rdquo; para ver o resultado.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions */}
      {showResult && (suggestions.quotas.length > 0 || suggestions.groups.length > 0) && (
        <div className="mt30">
          <hr className="opacity-100 mb40" />

          <div className="row align-items-center mb30">
            <div className="col-lg-8">
              <div className="main-title">
                <h2 className="title">Sugestões para Você</h2>
                <p className="paragraph">
                  Baseado em: {selectedGoodType?.label},{" "}
                  {formatCurrency(creditValue)}, {term} meses, Taxa {formatPercent(adminFee)}, FR {formatPercent(reserveFund)}, Parcela ~{formatCurrency(installment)}
                </p>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link href="/marketplace" className="ud-btn2">
                Ver todas as cotas <i className="fal fa-arrow-right-long" />
              </Link>
            </div>
          </div>

          {/* Suggested Quotas */}
          {suggestions.quotas.length > 0 && (
            <>
              <h4 className="mb20">
                <i className="flaticon-document text-thm2 me-2" />
                Cotas Disponíveis
              </h4>
              <div className="row mb30">
                {suggestions.quotas.map((quota) => {
                  const paidPct = Math.round(
                    (quota.paidAmount / quota.creditValue) * 100
                  );
                  const compat = Math.round(quota.score);
                  const tags: string[] = [];
                  const creditDiff = Math.abs(quota.creditValue - creditValue) / creditValue;
                  if (creditDiff <= 0.15) tags.push("Crédito similar");
                  const termDiff = Math.abs(quota.totalInstallments - term) / term;
                  if (termDiff <= 0.15) tags.push("Prazo compatível");
                  if (quota.adminFee <= adminFee) tags.push("Taxa ≤ simulada");
                  if (quota.installmentValue <= installment * 1.1) tags.push("Parcela acessível");
                  if (quota.status === "contemplada") tags.push("Contemplada");
                  return (
                    <div key={quota.id} className="col-md-6 col-lg-12">
                      <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
                        <div className="col-lg-8 ps-0">
                          <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                            <div className="thumb w60 position-relative rounded-circle mb15-md">
                              <div
                                className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm2"
                                style={{ width: 60, height: 60 }}
                              >
                                <i
                                  className={`${
                                    goodTypeOptions.find(
                                      (g) => g.value === quota.goodType
                                    )?.icon
                                  } text-white fz20`}
                                />
                              </div>
                            </div>
                            <div className="details ml15 ml0-md mb15-md">
                              <h5 className="title mb-2">
                                Carta de Crédito{" "}
                                {formatCurrency(quota.creditValue)}
                              </h5>
                              <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                <i className="flaticon-place fz16 vam text-thm2 me-1" />
                                {quota.administradora}
                              </p>
                              <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                <i className="flaticon-30-days fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                {quota.remainingInstallments}/
                                {quota.totalInstallments} parcelas
                              </p>
                              <p className="mb-0 fz14 list-inline-item mb5-sm">
                                <i className="flaticon-contract fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                Grupo {quota.groupCode} · Taxa {quota.adminFee}% · FR {quota.reserveFund}%
                              </p>
                              <div
                                className="d-flex align-items-center mt10"
                                style={{ maxWidth: 300 }}
                              >
                                <div
                                  className="progress w-100"
                                  style={{ height: 6 }}
                                >
                                  <div
                                    className="progress-bar bgc-thm"
                                    style={{ width: `${paidPct}%` }}
                                  />
                                </div>
                                <span className="fz12 ml10 body-color text-nowrap">
                                  {paidPct}% pago
                                </span>
                              </div>
                              {tags.length > 0 && (
                                <div className="d-flex flex-wrap gap-1 mt10">
                                  {tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="tag bdrs60 fz12"
                                      style={{ padding: "2px 10px" }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
                          <div className="details">
                            <div className="text-lg-end">
                              <span
                                className="text-white fz12 fw600 d-inline-flex align-items-center mb10"
                                style={{
                                  height: 24,
                                  padding: "0 12px",
                                  borderRadius: 20,
                                  backgroundColor: compat >= 70 ? "#5bbb7b" : compat >= 40 ? "#f0ad4e" : "#eb6753",
                                }}
                              >
                                <i className={`fas ${compat >= 70 ? "fa-check-circle" : compat >= 40 ? "fa-exclamation-circle" : "fa-info-circle"} me-1`} />
                                {compat}% compatível
                              </span>
                              <h4>
                                {formatCurrency(
                                  quota.listingPrice || quota.paidAmount
                                )}
                              </h4>
                              <p className="text mb-0">
                                Parcela:{" "}
                                {formatCurrency(quota.installmentValue)}/mês
                              </p>
                              <p className="fz13 body-light-color">
                                Simulada: {formatCurrency(installment)}/mês
                              </p>
                            </div>
                            <div className="d-grid mt10">
                              <Link
                                href={`/marketplace/${quota.id}`}
                                className="ud-btn btn-light-thm"
                              >
                                Ver Detalhes
                                <i className="fal fa-arrow-right-long" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Suggested Groups */}
          {suggestions.groups.length > 0 && (
            <>
              <h4 className="mb20">
                <i className="flaticon-calendar text-thm2 me-2" />
                Grupos Disponíveis
              </h4>
              <div className="row">
                {suggestions.groups.map((group) => {
                  const pct = Math.round(
                    (group.currentAssembly / group.term) * 100
                  );
                  const compat = Math.round(group.score);
                  const tags: string[] = [];
                  const creditDiff = Math.abs(group.creditValue - creditValue) / creditValue;
                  if (creditDiff <= 0.15) tags.push("Crédito similar");
                  const termDiff = Math.abs(group.term - term) / term;
                  if (termDiff <= 0.15) tags.push("Prazo compatível");
                  if (group.adminFee <= adminFee) tags.push("Taxa ≤ simulada");
                  if (group.reserveFund <= reserveFund) tags.push("FR ≤ simulado");
                  if (group.status === "formacao") tags.push("Em formação");
                  return (
                    <div key={group.id} className="col-md-6 col-lg-12">
                      <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
                        <div className="col-lg-8 ps-0">
                          <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                            <div className="thumb w60 position-relative rounded-circle mb15-md">
                              <div
                                className="rounded-circle mx-auto d-flex align-items-center justify-content-center bgc-thm"
                                style={{ width: 60, height: 60 }}
                              >
                                <span className="text-white fw700 fz16">
                                  {group.code.split("-")[1]}
                                </span>
                              </div>
                            </div>
                            <div className="details ml15 ml0-md mb15-md">
                              <h5 className="title mb-2">
                                {group.code} —{" "}
                                {formatCurrency(group.creditValue)}
                              </h5>
                              <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                <i className="flaticon-place fz16 vam text-thm2 me-1" />
                                {group.administradora}
                              </p>
                              <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                                <i className="flaticon-user fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                {group.totalQuotas} cotas
                              </p>
                              <p className="mb-0 fz14 list-inline-item mb5-sm">
                                <i className="flaticon-fifteen fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                                {group.term} meses · Taxa {group.adminFee}% · FR {group.reserveFund}%
                              </p>
                              <div
                                className="d-flex align-items-center mt10"
                                style={{ maxWidth: 300 }}
                              >
                                <div
                                  className="progress w-100"
                                  style={{ height: 6 }}
                                >
                                  <div
                                    className="progress-bar bgc-thm"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="fz12 ml10 body-color text-nowrap">
                                  {pct}% andamento
                                </span>
                              </div>
                              {tags.length > 0 && (
                                <div className="d-flex flex-wrap gap-1 mt10">
                                  {tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="tag bdrs60 fz12"
                                      style={{ padding: "2px 10px" }}
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 ps-0 ps-xl-3 pe-0">
                          <div className="details">
                            <div className="text-lg-end">
                              <span
                                className="text-white fz12 fw600 d-inline-flex align-items-center mb10"
                                style={{
                                  height: 24,
                                  padding: "0 12px",
                                  borderRadius: 20,
                                  backgroundColor: compat >= 70 ? "#5bbb7b" : compat >= 40 ? "#f0ad4e" : "#eb6753",
                                }}
                              >
                                <i className={`fas ${compat >= 70 ? "fa-check-circle" : compat >= 40 ? "fa-exclamation-circle" : "fa-info-circle"} me-1`} />
                                {compat}% compatível
                              </span>
                              <h4>{group.activeQuotas} ativas</h4>
                              <p className="text">
                                {group.contemplatedQuotas} contempladas
                              </p>
                            </div>
                            <div className="d-grid mt10">
                              <Link
                                href={`/marketplace/grupos/${group.id}`}
                                className="ud-btn btn-light-thm"
                              >
                                Ver Grupo
                                <i className="fal fa-arrow-right-long" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* No suggestions */}
      {showResult && suggestions.quotas.length === 0 && suggestions.groups.length === 0 && (
        <div className="mt30">
          <hr className="opacity-100 mb40" />
          <div className="text-center py-4">
            <i className="flaticon-loupe fz40 text-thm2" />
            <h5 className="mt15">Nenhuma cota ou grupo compatível encontrado</h5>
            <p className="body-color fz14 mb20">
              Não encontramos cotas ou grupos com valor próximo a{" "}
              {formatCurrency(creditValue)} para {selectedGoodType?.label.toLowerCase()}.
            </p>
            <Link href="/marketplace" className="ud-btn btn-thm bdrs12">
              Explorar Marketplace <i className="fal fa-arrow-right-long" />
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
