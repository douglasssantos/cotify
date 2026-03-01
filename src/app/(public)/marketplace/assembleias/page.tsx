"use client";

import { useState } from "react";
import Link from "next/link";
import {
  mockGroups,
  Assembly,
  getAssemblyStatusLabel,
  getWinnerTypeLabel,
} from "@/data/mock-groups";
import { formatCurrency } from "@/lib/utils";
import { BiUser, BiUserCheck } from "react-icons/bi";
import { HiOutlineCalendarDays } from "react-icons/hi2";
import { LiaKeySolid } from "react-icons/lia";
import { TbCalendarCheck } from "react-icons/tb";
import { PiCalendarCheckLight, PiUserCheck, PiUsersThreeLight } from "react-icons/pi";

interface AssemblyWithGroup extends Assembly {
  groupId: string;
  groupCode: string;
  groupCreditValue: number;
  administradora: string;
  goodTypeLabel: string;
}

function getAllAssemblies(): AssemblyWithGroup[] {
  const all: AssemblyWithGroup[] = [];
  for (const group of mockGroups) {
    for (const assembly of group.assemblies) {
      all.push({
        ...assembly,
        groupId: group.id,
        groupCode: group.code,
        groupCreditValue: group.creditValue,
        administradora: group.administradora,
        goodTypeLabel: group.goodTypeLabel,
      });
    }
  }
  return all.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

const tabFilters = ["Todas", "Realizadas", "Agendadas"];

export default function AssembliesPage() {
  const [currentTab, setCurrentTab] = useState("Todas");
  const allAssemblies = getAllAssemblies();

  const filteredAssemblies = allAssemblies.filter((a) => {
    if (currentTab === "Todas") return true;
    if (currentTab === "Realizadas") return a.status === "realizada";
    if (currentTab === "Agendadas") return a.status === "agendada";
    return true;
  });

  const realizadasCount = allAssemblies.filter((a) => a.status === "realizada").length;
  const agendadasCount = allAssemblies.filter((a) => a.status === "agendada").length;
  const totalContemplados = allAssemblies
    .filter((a) => a.status === "realizada")
    .reduce((sum, a) => sum + a.contemplatedCount, 0);

  return (
    <>
      {/* Breadcumb3 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <Link href="/marketplace">Marketplace</Link>
                  <a>Assembleias</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner - igual ao original */}
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
          <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
          <img
            className="service-v1-vector bounce-y d-none d-xl-block"
            style={{ maxWidth: "480px" }}
            src="/images/vector-img/assembleia.png"
            alt=""
          />
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>Assembleias de Consórcio</h2>
                  <p className="text mb30">
                    Acompanhe o progresso das assembleias, contemplações e resultados dos grupos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt50 pb20">
        <div className="container">
          <div className="row">
            <div className="col-6 col-md-3 mb30">
              <div className="iconbox-style1 contact-style text-center bdr1 p25 bdrs8 h-100">
                <div className="icon flex-shrink-0 mb25">
                  <PiUsersThreeLight className="fz50"/>
                </div>
                <h3 className="fw700 dark-color mb5">{allAssemblies.length}</h3>
                <p className="mb-0 text fz14">Total de Assembleias</p>
              </div>
            </div>
            <div className="col-6 col-md-3 mb30">
              <div className="iconbox-style1 contact-style text-center bdr1 p25 bdrs8 h-100">
                <div className="icon flex-shrink-0 mb15">
                  <PiCalendarCheckLight className="fz50"/>
                  {/* <span className="flaticon-like-1 fz40" /> */}
                </div>
                <h3 className="fw700 dark-color mb5">{realizadasCount}</h3>
                <p className="mb-0 text fz14">Realizadas</p>
              </div>
            </div>
            <div className="col-6 col-md-3 mb30">
              <div className="iconbox-style1 contact-style text-center bdr1 p25 bdrs8 h-100">
                <div className="icon flex-shrink-0 mb15">
                  <HiOutlineCalendarDays className="fz50"/>
                </div>
                <h3 className="fw700 dark-color mb5">{agendadasCount}</h3>
                <p className="mb-0 text fz14">Agendadas / Em andamento</p>
              </div>
            </div>
            <div className="col-6 col-md-3 mb30">
              <div className="iconbox-style1 contact-style text-center bdr1 p25 bdrs8 h-100">
                <div className="icon flex-shrink-0 mb15">
                  <PiUserCheck className="fz50"/>
                </div>
                <h3 className="fw700 dark-color mb5">{totalContemplados}</h3>
                <p className="mb-0 text fz14">Contemplados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listing - filtros e cards em lista */}
      <section className="pt0 pb90">
        <div className="container">
          <div className="row align-items-center mb20">
            <div className="col-md-6">
              <div className="navpill-style2 at-home9">
                <ul className="nav nav-pills mb20">
                  {tabFilters.map((item, i) => (
                    <li key={i} className="nav-item">
                      <button
                        type="button"
                        onClick={() => setCurrentTab(item)}
                        className={`nav-link fw500 dark-color ${currentTab === item ? "active" : ""}`}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-center text-md-end">
                <p className="text mb-0">
                  <span className="fw500">{filteredAssemblies.length}</span> assembleias
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {filteredAssemblies.length > 0 ? (
              filteredAssemblies.map((assembly) => (
                <div key={assembly.id} className="col-md-6 col-lg-12">
                  <div className="freelancer-style1 bdr1 hover-box-shadow row ms-0 align-items-lg-center">
                    <div className="col-lg-7 ps-0">
                      <div className="d-lg-flex bdrr1 bdrn-xl pr15 pr0-lg">
                        <div className="thumb w60 position-relative rounded-circle mb15-md">
                          <div
                            className={`rounded-circle mx-auto d-flex align-items-center justify-content-center ${
                              assembly.status === "realizada" ? "bgc-thm" : "bgc-thm4"
                            }`}
                            style={{ width: 60, height: 60 }}
                          >
                            <span
                              className={`fw700 fz18 ${
                                assembly.status === "realizada"
                                  ? "text-white"
                                  : "dark-color"
                              }`}
                            >
                              {assembly.number}ª
                            </span>
                          </div>
                        </div>
                        <div className="details ml15 ml0-md mb15-md">
                          <h5 className="title mb-3">
                            {assembly.groupCode} — Assembleia {assembly.number}ª
                          </h5>
                          <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                            <i className="flaticon-place fz16 vam text-thm2 me-1" />
                            {assembly.administradora}
                          </p>
                          <p className="mb-0 fz14 list-inline-item mb5-sm pe-1">
                            <i className="flaticon-calendar fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                            {new Date(assembly.date).toLocaleDateString("pt-BR")}
                          </p>
                          <p className="mb-0 fz14 list-inline-item mb5-sm">
                            <i className="flaticon-user fz16 vam text-thm2 me-1 bdrl1 pl15 pl0-xs bdrn-xs" />
                            {assembly.totalParticipants} participantes
                          </p>
                          <div className="skill-tags d-flex align-items-center justify-content-start mt10">
                            <span
                              className={`tag ${
                                assembly.status === "realizada" ? "" : "style2"
                              }`}
                            >
                              {getAssemblyStatusLabel(assembly.status)}
                            </span>
                            <span className="tag mx10">{assembly.goodTypeLabel}</span>
                            {assembly.winnerType && (
                              <span className="tag">
                                {getWinnerTypeLabel(assembly.winnerType)}
                              </span>
                            )}
                            {assembly.winnerQuota && (
                              <span className="tag mx10 text-thm">
                                {assembly.winnerQuota}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 ps-0 ps-xl-3">
                      <div className="details text-lg-center">
                        {assembly.status === "realizada" ? (
                          <>
                            <p className="mb-0 fz14 body-color">Contemplados</p>
                            <h4 className="mb-0">{assembly.contemplatedCount}</h4>
                            {assembly.winnerBidValue != null && (
                              <p className="fz13 text-thm mb-0">
                                Lance: {assembly.winnerBidValue}%
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="mb-0 fz14 body-color">Crédito</p>
                            <h5 className="mb-0">
                              {formatCurrency(assembly.groupCreditValue)}
                            </h5>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-2 ps-0 pe-0">
                      <div className="details">
                        <div className="d-grid mt15 mt0-lg">
                          <Link
                            href={`/marketplace/grupos/${assembly.groupId}`}
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
              ))
            ) : (
              <div className="col-12 text-center py-5">
                <i
                  className="flaticon-loupe"
                  style={{ fontSize: 64, color: "#ccc" }}
                />
                <h4 className="mt20">Nenhuma assembleia encontrada</h4>
                <p className="body-color">Tente outro filtro.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
