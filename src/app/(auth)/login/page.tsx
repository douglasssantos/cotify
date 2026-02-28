"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <section className="our-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 m-auto">
            <div className="main-title text-center">
              <h2 className="title">Entrar</h2>
              <p className="paragraph">
                Acesse sua conta para gerenciar suas cotas de consórcio
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 mx-auto">
            <div className="log-reg-form search-modal form-style1 bgc-white p50 p30-sm default-box-shadow1 bdrs12">
              <div className="mb30">
                <h4>Bem-vindo de volta!</h4>
                <p className="text">
                  Não tem uma conta?{" "}
                  <Link href="/registro" className="text-thm">
                    Cadastre-se!
                  </Link>
                </p>
              </div>
              <div className="mb20">
                <label className="form-label fw600 dark-color">E-mail</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="mb15">
                <label className="form-label fw600 dark-color">Senha</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="*******"
                />
              </div>
              <div className="checkbox-style1 d-block d-sm-flex align-items-center justify-content-between mb20">
                <label className="custom_checkbox fz14 ff-heading">
                  Lembrar-me
                  <input type="checkbox" defaultChecked />
                  <span className="checkmark" />
                </label>
                <a className="fz14 ff-heading text-thm">Esqueceu sua senha?</a>
              </div>
              <div className="d-grid mb20">
                <button className="ud-btn btn-thm" type="button">
                  Entrar <i className="fal fa-arrow-right-long" />
                </button>
              </div>
              <div className="hr_content mb20">
                <hr />
                <span className="hr_top_text">OU</span>
              </div>
              <div className="mb20">
                <p className="fz14 fw600 dark-color mb10">
                  Acessar como perfil:
                </p>
                <div className="d-md-flex justify-content-between gap-2">
                  <Link
                    href="/cotista"
                    className="ud-btn btn-thm-border fz14 fw400 mb-2 w-100"
                  >
                    <i className="flaticon-user pr10" /> Cotista
                  </Link>
                  <Link
                    href="/administradora"
                    className="ud-btn btn-thm-border fz14 fw400 mb-2 w-100"
                  >
                    <i className="flaticon-briefcase pr10" /> Administradora
                  </Link>
                </div>
                <div className="d-md-flex justify-content-between gap-2">
                  <Link
                    href="/cooperativa"
                    className="ud-btn btn-thm-border fz14 fw400 mb-2 w-100"
                  >
                    <i className="flaticon-home pr10" /> Cooperativa
                  </Link>
                  <Link
                    href="/revenda"
                    className="ud-btn btn-thm-border fz14 fw400 mb-2 w-100"
                  >
                    <i className="flaticon-shop pr10" /> Revenda
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
