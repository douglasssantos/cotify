"use client";

import Link from "next/link";
import Simulator from "@/components/marketplace/Simulator";

export default function SimuladorPage() {
  return (
    <>
      {/* TabSection1 */}
      <section className="categories_list_section overflow-hidden">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="listings_category_nav_list_menu">
                <ul className="mb0 d-flex ps-0">
                  <li><Link href="/marketplace">Cotas</Link></li>
                  <li><Link href="/marketplace/grupos">Grupos</Link></li>
                  <li><Link href="/marketplace/assembleias">Assembleias</Link></li>
                  <li><a className="active" style={{ cursor: "pointer" }}>Simulador</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Breadcumb3 */}
      <section className="breadcumb-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcumb-style1">
                <div className="breadcumb-list">
                  <Link href="/">Início</Link>
                  <a>Simulador</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="breadcumb-section pt-0">
        <div className="cta-service-v1 cta-banner mx-auto maxw1700 pt120 pb120 bdrs16 position-relative overflow-hidden d-flex align-items-center mx20-lg px30-lg">
          <img className="left-top-img" src="/images/vector-img/left-top.png" alt="" />
          <img className="right-bottom-img" src="/images/vector-img/right-bottom.png" alt="" />
          <img className="service-v1-vector bounce-y d-none d-xl-block" src="/images/vector-img/vector-service-v1.png" alt="" />
          <div className="container">
            <div className="row">
              <div className="col-xl-7">
                <div className="position-relative">
                  <h2>Simulador de Consórcio</h2>
                  <p className="text mb-0">
                    Calcule o valor da parcela, compare cenários e encontre cotas
                    compatíveis com o que você procura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pt30 pb90">
        <div className="container">
          <Simulator />
        </div>
      </section>
    </>
  );
}
