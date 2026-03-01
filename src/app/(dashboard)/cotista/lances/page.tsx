"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mockMyBids,
  getBidTypeLabel,
  getBidResultLabel,
  getBidResultColor,
  type BidType,
  type BidResult,
} from "@/data/mock-cotista";
import { formatCurrency } from "@/lib/utils";

export default function MeusLancesPage() {
  const [filterType, setFilterType] = useState<BidType | "todos">("todos");
  const [filterResult, setFilterResult] = useState<BidResult | "todos">("todos");

  const filtered = mockMyBids
    .filter((b) => (filterType === "todos" ? true : b.type === filterType))
    .filter((b) => (filterResult === "todos" ? true : b.result === filterResult))
    .sort((a, b) => new Date(b.assemblyDate).getTime() - new Date(a.assemblyDate).getTime());

  const aguardandoCount = mockMyBids.filter((b) => b.result === "aguardando").length;
  const contempladoCount = mockMyBids.filter((b) => b.result === "contemplado").length;

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb40">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Meus Lances</h2>
            <p className="text">
              Histórico de participação em assembleias e lances
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row mb30">
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{mockMyBids.length}</div>
              <span className="fz13 body-color">Total de Participações</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#0d6efd15" }}
            >
              <i className="flaticon-flash fz20" style={{ color: "#0d6efd" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{aguardandoCount}</div>
              <span className="fz13 body-color">Aguardando</span>
            </div>
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{ width: 48, height: 48, backgroundColor: "#f0ad4e15" }}
            >
              <i className="flaticon-time fz20" style={{ color: "#f0ad4e" }} />
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-xl-3">
          <div className="d-flex align-items-center justify-content-between ps-widget bgc-white bdrs4 p20 mb20">
            <div>
              <div className="fz15 fw600 dark-color">{contempladoCount}</div>
              <span className="fz13 body-color">Contemplados</span>
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
                {mockMyBids.filter((b) => b.type !== "sorteio").length}
              </div>
              <span className="fz13 body-color">Lances com oferta</span>
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

      {/* Filters */}
      <div className="row mb20">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p15 d-flex flex-wrap align-items-center gap-3">
            <span className="fz14 fw500 body-color">Filtrar:</span>
            <select
              className="form-select w-auto fz14"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as BidType | "todos")}
            >
              <option value="todos">Todos os tipos</option>
              <option value="sorteio">Sorteio</option>
              <option value="lance_livre">Lance Livre</option>
              <option value="lance_fixo">Lance Fixo</option>
              <option value="lance_embutido">Lance Embutido</option>
            </select>
            <select
              className="form-select w-auto fz14"
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value as BidResult | "todos")}
            >
              <option value="todos">Todos os resultados</option>
              <option value="aguardando">Aguardando</option>
              <option value="contemplado">Contemplado</option>
              <option value="nao_contemplado">Não contemplado</option>
            </select>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="row">
        <div className="col-12">
          <div className="ps-widget bgc-white bdrs4 p30 mb30 overflow-hidden position-relative">
            {filtered.length === 0 ? (
              <div className="text-center py-5">
                <i className="flaticon-flash fz40 body-light-color" />
                <h5 className="mt15">Nenhum lance encontrado</h5>
                <p className="body-color fz14">Ajuste os filtros ou participe de uma assembleia.</p>
                <Link href="/marketplace" className="ud-btn btn-thm bdrs12 mt15">
                  Ver Grupos no Marketplace <i className="fal fa-arrow-right-long" />
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="fz14 fw600">Data</th>
                      <th className="fz14 fw600">Grupo / Assembleia</th>
                      <th className="fz14 fw600">Tipo</th>
                      <th className="fz14 fw600">Lance</th>
                      <th className="fz14 fw600">Resultado</th>
                      <th className="fz14 fw600">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((bid) => (
                      <tr key={bid.id}>
                        <td className="fz14">
                          {new Date(bid.assemblyDate).toLocaleDateString("pt-BR")}
                        </td>
                        <td>
                          <p className="fw500 mb-0 fz14">{bid.groupCode}</p>
                          <span className="fz12 body-color">{bid.assemblyNumber}ª assembleia</span>
                          <p className="fz12 body-color mb-0">{bid.goodTypeLabel} · {bid.administradora}</p>
                        </td>
                        <td className="fz14">{getBidTypeLabel(bid.type)}</td>
                        <td className="fz14">
                          {bid.bidValue != null
                            ? bid.type === "lance_livre" || bid.type === "lance_fixo"
                              ? `${bid.bidValue}%`
                              : formatCurrency(bid.bidValue)
                            : "—"}
                        </td>
                        <td>
                          <span
                            className="text-white fz12 fw600"
                            style={{
                              padding: "4px 10px",
                              borderRadius: 10,
                              backgroundColor: getBidResultColor(bid.result),
                            }}
                          >
                            {getBidResultLabel(bid.result)}
                          </span>
                        </td>
                        <td>
                          <Link
                            href={`/marketplace/grupos/${bid.groupId}`}
                            className="ud-btn btn-thm-border bdrs4 fz12 px-3 py-1"
                          >
                            Ver Grupo
                          </Link>
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
    </div>
  );
}
