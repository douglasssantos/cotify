"use client";

import Link from "next/link";
import { footerAbout, footerCategories, footerSupport } from "@/data/navigation";

export default function Footer() {
  return (
    <section className="footer-style1 at-home8 pb-0 pt60">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="footer-widget mb-4 mb-lg-5">
              <div className="mailchimp-widget mb90">
                <h6 className="title mb20">Newsletter</h6>
                <div className="mailchimp-style1 at-home20 bdrs12 overflow-hidden">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Seu e-mail"
                  />
                  <button className="text-thm" type="submit">
                    Enviar
                  </button>
                </div>
              </div>
              <div className="row justify-content-between">
                <div className="col-auto">
                  <div className="link-style1 at-home8 mb-3">
                    <h6 className="mb25">Sobre</h6>
                    <div className="link-list">
                      {footerAbout.map((item, i) => (
                        <Link key={i} href={item.path}>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="link-style1 at-home8 mb-3">
                    <h6 className="mb25">Categorias</h6>
                    <ul className="ps-0">
                      {footerCategories.map((item, i) => (
                        <li key={i}>
                          <Link href={item.path}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="link-style1 at-home8 mb-3">
                    <h6 className="mb25">Suporte</h6>
                    <ul className="ps-0">
                      {footerSupport.map((item, i) => (
                        <li key={i}>
                          <Link href={item.path}>{item.name}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-4 offset-xl-2">
            <div className="footer-widget mb-4 mb-lg-5">
              <Link className="footer-logo" href="/">
                <img
                  className="mb40 object-fit-contain"
                  src="/images/header-logo2.svg"
                  alt="ConsórcioPro"
                />
              </Link>
              <div className="row mb-4 mb-lg-5">
                <div className="col-auto">
                  <div className="contact-info">
                    <p className="info-title mb-2">Atendimento ao Cliente</p>
                    <h5 className="info-phone">
                      <a href="#">0800 123 4567</a>
                    </h5>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="contact-info">
                    <p className="info-title mb-2">Precisa de ajuda?</p>
                    <h5 className="info-mail">
                      <a href="mailto:contato@consorciopro.com.br">
                        contato@consorciopro.com.br
                      </a>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="app-widget at-home20">
                <h5 className="title mb20">Regulamentação</h5>
                <div className="row mb-4 mb-lg-5">
                  <div className="col-auto">
                    <a>
                      <div className="app-info d-flex align-items-center mb10 bdrs12 bgc-thm3">
                        <div className="flex-shrink-0">
                          <i className="fas fa-shield-alt fz30" />
                        </div>
                        <div className="flex-grow-1 ml20">
                          <p className="app-text fz13 mb0">Regulamentado pelo</p>
                          <h6 className="app-title">Banco Central</h6>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="col-auto">
                    <a>
                      <div className="app-info d-flex align-items-center mb10 bdrs12 bgc-thm3">
                        <div className="flex-shrink-0">
                          <i className="fas fa-lock fz30" />
                        </div>
                        <div className="flex-grow-1 ml20">
                          <p className="app-text fz13 mb0">Seus dados estão</p>
                          <h6 className="app-title">Protegidos</h6>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              {/* Social */}
              <div className="social-widget">
                <h5 className="mb20">Siga-nos</h5>
                <div className="social-style1 light-style">
                  <a>
                    <i className="fab fa-facebook-f list-inline-item" />
                  </a>
                  <a>
                    <i className="fab fa-twitter list-inline-item" />
                  </a>
                  <a>
                    <i className="fab fa-instagram list-inline-item" />
                  </a>
                  <a>
                    <i className="fab fa-linkedin-in list-inline-item" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container bdrt1 py-4">
        <div className="row">
          <div className="col-sm-6">
            <div className="text-center text-lg-start">
              <p className="copyright-text mb-0 at-home8 ff-heading">
                &copy; {new Date().getFullYear()} ConsórcioPro. Todos os
                direitos reservados.
              </p>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="footer_bottom_right_btns at-home8 text-center text-lg-end">
              <p className="fz14 body-color mb-0">
                Regulamentado pelo Banco Central do Brasil
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
