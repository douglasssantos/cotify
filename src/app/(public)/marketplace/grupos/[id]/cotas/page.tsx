"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { mockGroups, getGroupStatusLabel } from "@/data/mock-groups";
import { mockQuotas } from "@/data/mock-quotas";
import QuotaListCard from "@/components/marketplace/QuotaListCard";
import { formatCurrency, formatPercent } from "@/lib/utils";

const sortOptions = [
  { value: "relevancia", title: "Relevância" },
  { value: "menor-preco", title: "Menor preço" },
  { value: "maior-preco", title: "Maior preço" },
  { value: "maior-credito", title: "Maior crédito" },
  { value: "menos-parcelas", title: "Menos parcelas" },
];

export default function GroupQuotasPage() {
  const params = useParams();
  const group = mockGroups.find((g) => g.id === params.id);

  const [sortBy, setSortBy] = useState("relevancia");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");

  if (!group) {
    return (
      <div className="container py-5 text-center" style={{ marginTop: 100 }}>
        <h2>Grupo não encontrado</h2>
        <Link href="/marketplace/grupos" className="ud-btn btn-thm mt20">
          Voltar aos Grupos <i className="fal fa-arrow-right-long" />
        </Link>
      </div>
    );
  }

  const groupQuotas = mockQuotas
    .filter((q) => q.groupCode === group.code)
    .filter((q) => (filterStatus ? q.status === filterStatus : true))
    .sort((a, b) => {
      if (sortBy === "menor-preco")
        return (a.listingPrice || 0) - (b.listingPrice || 0);
      if (sortBy === "maior-preco")
        return (b.listingPrice || 0) - (a.listingPrice || 0);
      if (sortBy === "maior-credito") return b.creditValue - a.creditValue;
      if (sortBy === "menos-parcelas")
        return a.remainingInstallments - b.remainingInstallments;
      return 0;
    });

  const progressPercent = Math.round(
    (group.currentAssembly / group.term) * 100
  );
  const selectedSort =
    sortOptions.find((s) => s.value === sortBy)?.title || "Relevância";

  const statusFilters = [
    { value: "", label: "Todas" },
    { value: "ativa", label: "Ativas" },
    { value: "contemplada", label: "Contempladas" },
    { value: "cancelada", label: "Canceladas" },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <Link href="/marketplace/grupos">Grupos</Link>
                  <Link href={`/marketplace/grupos/${group.id}`}>
                    {group.code}
                  </Link>
                  <a>Cotas Disponíveis</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Group Summary Banner */}
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt60 pb60 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img
            className="left-top-img"
            src="/images/vector-img/left-top.png"
            alt=""
          />
          <img
            className="right-bottom-img"
            src="/images/vector-img/right-bottom.png"
            alt=""
          />
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <div className="position-relative">
                  <div className="d-flex align-items-center gap-2 mb10">
                    <span
                      className={`badge ${
                        group.status === "em_andamento"
                          ? "bg-success"
                          : group.status === "formacao"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {getGroupStatusLabel(group.status)}
                    </span>
                    <span className="badge bg-info">{group.goodTypeLabel}</span>
                  </div>
                  <h2 className="mb5">
                    Cotas do Grupo {group.code}
                  </h2>
                  <p className="text mb-0">
                    {group.administradora} &bull; Crédito{" "}
                    {formatCurrency(group.creditValue)} &bull; {group.term} meses
                  </p>
                </div>
              </div>
              <div className="col-lg-5 mt20 mt0-lg">
                <div className="row">
                  <div className="col-4 text-center">
                    <h3 className="mb-0">{group.totalQuotas}</h3>
                    <p className="text fz13 mb-0">Total de Cotas</p>
                  </div>
                  <div className="col-4 text-center">
                    <h3 className="mb-0">{group.activeQuotas}</h3>
                    <p className="text fz13 mb-0">Ativas</p>
                  </div>
                  <div className="col-4 text-center">
                    <h3 className="mb-0">{group.contemplatedQuotas}</h3>
                    <p className="text fz13 mb-0">Contempladas</p>
                  </div>
                </div>
                <div className="mt15">
                  <div className="d-flex justify-content-between fz13 mb5">
                    <span>Progresso do Grupo</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="progress" style={{ height: 8 }}>
                    <div
                      className="progress-bar bgc-thm"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="fz12 text mt5 mb-0">
                    Assembleia {group.currentAssembly}/{group.term} &bull;
                    Próxima: {group.nextAssemblyDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quotas List */}
      <section className="pt30 pb90">
        <div className="container">
          <div className="row">
            {/* Sidebar Filters */}
            <div className="col-lg-3">
              <div className="default-box-shadow1 bdrs8 p30 mb30">
                <h5 className="mb20">Filtrar Cotas</h5>

                <div className="mb20">
                  <label className="fw600 fz14 mb10 d-block">Status</label>
                  {statusFilters.map((sf) => (
                    <div key={sf.value} className="form-check mb-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statusFilter"
                        id={`sf-${sf.value}`}
                        checked={filterStatus === sf.value}
                        onChange={() => setFilterStatus(sf.value)}
                      />
                      <label
                        className="form-check-label fz14"
                        htmlFor={`sf-${sf.value}`}
                      >
                        {sf.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mb20">
                  <h6 className="fz14 fw600 mb10">Info do Grupo</h6>
                  <ul className="list-unstyled fz14">
                    <li className="d-flex justify-content-between mb-2">
                      <span className="text">Taxa Adm.</span>
                      <span className="fw500">{formatPercent(group.adminFee)}</span>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span className="text">Fundo Reserva</span>
                      <span className="fw500">
                        {formatPercent(group.reserveFund)}
                      </span>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span className="text">Crédito</span>
                      <span className="fw500">
                        {formatCurrency(group.creditValue)}
                      </span>
                    </li>
                    <li className="d-flex justify-content-between mb-2">
                      <span className="text">Prazo</span>
                      <span className="fw500">{group.term} meses</span>
                    </li>
                    {group.cooperativa && (
                      <li className="d-flex justify-content-between mb-2">
                        <span className="text">Cooperativa</span>
                        <span className="fw500 fz12">{group.cooperativa}</span>
                      </li>
                    )}
                    {group.comissionado && (
                      <li className="d-flex justify-content-between mb-2">
                        <span className="text">Comissionado</span>
                        <span className="fw500 fz12">{group.comissionado}</span>
                      </li>
                    )}
                  </ul>
                </div>

                <Link
                  href={`/marketplace/grupos/${group.id}`}
                  className="ud-btn btn-light-thm w-100"
                >
                  Ver Detalhes do Grupo
                  <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            </div>

            {/* Quotas */}
            <div className="col-lg-9">
              {/* List header */}
              <div className="d-flex align-items-center justify-content-between mb20">
                <p className="text mb-0">
                  <span className="fw600">{groupQuotas.length}</span> cotas
                  encontradas no grupo {group.code}
                </p>
                <div className="page_control_shorting d-flex align-items-center">
                  <div className="pcs_dropdown dark-color">
                    <span>Ordenar por: </span>
                    <div
                      className="dropdown"
                      style={{ display: "inline-block" }}
                    >
                      <button
                        className="btn dropdown-toggle fz14"
                        type="button"
                        onClick={() => setSortOpen(!sortOpen)}
                        onBlur={() =>
                          setTimeout(() => setSortOpen(false), 150)
                        }
                      >
                        {selectedSort}
                      </button>
                      <ul
                        className={`dropdown-menu ${sortOpen ? "show" : ""}`}
                      >
                        {sortOptions.map((opt) => (
                          <li key={opt.value}>
                            <a
                              className={`dropdown-item ${
                                sortBy === opt.value ? "active" : ""
                              }`}
                              onClick={() => {
                                setSortBy(opt.value);
                                setSortOpen(false);
                              }}
                            >
                              {opt.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {groupQuotas.length === 0 ? (
                <div className="text-center py-5">
                  <span className="flaticon-document fz50 text-thm2 d-block mb20" />
                  <h4>Nenhuma cota encontrada</h4>
                  <p className="text">
                    Não há cotas disponíveis neste grupo com os filtros
                    selecionados.
                  </p>
                  <Link
                    href="/marketplace"
                    className="ud-btn btn-thm mt10"
                  >
                    Ver Marketplace
                    <i className="fal fa-arrow-right-long" />
                  </Link>
                </div>
              ) : (
                <div className="row">
                  {groupQuotas.map((q) => (
                    <div key={q.id} className="col-12 mb20">
                      <QuotaListCard data={q} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
