"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { CurrencyInput } from "@/components/ui/CurrencyInput";
import { mockQuotas } from "@/data/mock-quotas";
import type {
  AcquiredAssetImovel,
  AcquiredAssetVeiculo,
} from "@/data/mock-cotista";

// ─── Constants ────────────────────────────────────────────────────────────────

type AnuncioType = "cota" | "bem";

/** Origem dos dados do crédito no anúncio do bem: cota do sistema ou cadastro manual */
type BemCreditSource = "quota" | "manual";

/** Dados da cota/carta de crédito cadastrados manualmente (bem não adquirido pelo marketplace) */
export interface ManualCreditData {
  groupCode: string;
  quotaNumber: string;
  administradora: string;
  creditValue: number;
  creditReleasedAt: string;
  goodType: "imovel" | "veiculo" | "servico";
}

const goodTypeLabels: Record<ManualCreditData["goodType"], string> = {
  imovel: "Imóvel",
  veiculo: "Veículo",
  servico: "Serviço",
};

const myQuotas = mockQuotas.filter(
  (q) => q.status === "ativa" || q.status === "contemplada"
);

/** Cotas com crédito liberado (bem pode ter sido adquirido) */
const releaseQuotas = mockQuotas.filter(
  (q) => q.status === "contemplada" && q.creditStatus === "released"
);

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <div className="ps-widget bgc-white bdrs12 p25 mb25">
      <div className="d-flex align-items-center overflow-auto" style={{ flexWrap: "nowrap", gap: 0 }}>
        {steps.map((label, i) => {
          const n = i + 1;
          const done = current > n;
          const active = current === n;
          return (
            <div key={n} className="d-flex align-items-center" style={{ flex: i < steps.length - 1 ? "1 1 0" : "none" }}>
              <div className="d-flex align-items-center gap-2" style={{ flexShrink: 0 }}>
                <div
                  className="d-flex align-items-center justify-content-center fw600 text-white"
                  style={{
                    width: 32, height: 32, borderRadius: "50%", fontSize: 13,
                    backgroundColor: done || active ? "#5bbb7b" : "#dee2e6",
                  }}
                >
                  {done ? <i className="fas fa-check" /> : n}
                </div>
                <span
                  className={`fz13 fw500 ${active ? "dark-color" : done ? "body-color" : "body-light-color"}`}
                  style={{ whiteSpace: "nowrap" }}
                >
                  {label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className="flex-grow-1 mx-2"
                  style={{ height: 2, backgroundColor: done ? "#5bbb7b" : "#dee2e6", minWidth: 20 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Shared success screen ─────────────────────────────────────────────────────

function SuccessScreen({
  type,
  title,
  subtitle,
}: {
  type: AnuncioType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="ps-widget bgc-white bdrs12 p30 text-center">
          <div
            className="d-inline-flex align-items-center justify-content-center mb20"
            style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "rgba(91,187,123,0.1)" }}
          >
            <i className="fas fa-check-circle fz40" style={{ color: "#5bbb7b" }} />
          </div>
          <h4 className="mb10">Anúncio publicado com sucesso!</h4>
          <p className="body-color fz14 mb25">{subtitle}</p>
          <div className="d-flex gap-2 justify-content-center flex-wrap">
            <Link href="/cotista/anuncios" className="ud-btn btn-thm bdrs12">
              Ver Meus Anúncios <i className="fal fa-arrow-right-long" />
            </Link>
            <Link
              href={type === "bem" ? "/marketplace" : "/marketplace"}
              className="ud-btn btn-thm-border bdrs12"
            >
              Ver no Marketplace <i className="fal fa-arrow-right-long" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROW helper ───────────────────────────────────────────────────────────────

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="d-flex justify-content-between align-items-center mb10">
      <span className="fz13 body-color">{label}</span>
      <span className="fw500 fz13">{value}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function AnunciarCotaPage() {
  const [anuncioType, setAnuncioType] = useState<AnuncioType | null>(null);
  const [published, setPublished] = useState(false);

  const handlePublish = () => setPublished(true);

  // ── Cota state ──
  const [cotaStep, setCotaStep] = useState(1);
  const [selectedQuotaId, setSelectedQuotaId] = useState("");
  const [askingPrice, setAskingPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [acceptsCounterOffer, setAcceptsCounterOffer] = useState(true);
  const [acceptsFinancing, setAcceptsFinancing] = useState(false);

  const selectedQuota = myQuotas.find((q) => q.id === selectedQuotaId);

  const handleSelectQuota = (quotaId: string) => {
    setSelectedQuotaId(quotaId);
    const q = myQuotas.find((item) => item.id === quotaId);
    if (q) setAskingPrice(q.listingPrice || q.paidAmount);
  };

  // ── Bem state ──
  const [bemStep, setBemStep] = useState(1);
  const [bemCreditSource, setBemCreditSource] = useState<BemCreditSource>("quota");
  const [selectedBemQuotaId, setSelectedBemQuotaId] = useState(
    releaseQuotas[0]?.id ?? ""
  );
  const [manualCredit, setManualCredit] = useState<ManualCreditData>({
    groupCode: "",
    quotaNumber: "",
    administradora: "",
    creditValue: 0,
    creditReleasedAt: "",
    goodType: "imovel",
  });
  const [bemTitle, setBemTitle] = useState("");
  const [bemDesc, setBemDesc] = useState("");
  const [bemPrice, setBemPrice] = useState(0);
  const [bemAcceptsCounterOffer, setBemAcceptsCounterOffer] = useState(true);
  const [bemAcceptsFinancing, setBemAcceptsFinancing] = useState(false);

  // Imóvel fields
  const [imovelTipo, setImovelTipo] = useState<AcquiredAssetImovel["tipo"]>("apartamento");
  const [imovelArea, setImovelArea] = useState(0);
  const [imovelDorm, setImovelDorm] = useState(2);
  const [imovelBanheiros, setImovelBanheiros] = useState(2);
  const [imovelVagas, setImovelVagas] = useState(1);
  const [imovelAndar, setImovelAndar] = useState<number | "">("");
  const [imovelCond, setImovelCond] = useState<number | "">("");
  const [imovelIptu, setImovelIptu] = useState<number | "">("");
  const [imovelCidade, setImovelCidade] = useState("");
  const [imovelEstado, setImovelEstado] = useState("");
  const [imovelBairro, setImovelBairro] = useState("");
  const [imovelCep, setImovelCep] = useState("");
  const [imovelLogradouro, setImovelLogradouro] = useState("");
  const [imovelNumero, setImovelNumero] = useState("");
  const [imovelComplemento, setImovelComplemento] = useState("");
  const [imovelReferencia, setImovelReferencia] = useState("");
  const [imovelOutrosCustos, setImovelOutrosCustos] = useState<number | "">("");
  const [imovelComodidades, setImovelComodidades] = useState<string[]>([]);
  const [imovelDiferenciais, setImovelDiferenciais] = useState("");

  const imovelComodidadesList = [
    { value: "piscina", label: "Piscina" },
    { value: "academia", label: "Academia" },
    { value: "churrasqueira", label: "Churrasqueira" },
    { value: "salao_festas", label: "Salão de festas" },
    { value: "playground", label: "Playground" },
    { value: "area_verde", label: "Área verde" },
    { value: "portaria_24h", label: "Portaria 24h" },
    { value: "seguranca", label: "Segurança / Câmeras" },
    { value: "elevador", label: "Elevador" },
    { value: "pet_place", label: "Pet place" },
    { value: "bicicletario", label: "Bicicletário" },
    { value: "lavanderia", label: "Lavanderia" },
    { value: "quadra", label: "Quadra esportiva" },
    { value: "salao_jogos", label: "Salão de jogos" },
  ];

  const toggleImovelComodidade = (value: string) => {
    setImovelComodidades((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  // Veículo fields
  const [veiculoMarca, setVeiculoMarca] = useState("");
  const [veiculoModelo, setVeiculoModelo] = useState("");
  const [veiculoAno, setVeiculoAno] = useState(new Date().getFullYear());
  const [veiculoKm, setVeiculoKm] = useState(0);
  const [veiculoCor, setVeiculoCor] = useState("");
  const [veiculoCambio, setVeiculoCambio] = useState<AcquiredAssetVeiculo["cambio"]>("automatico");
  const [veiculoCombustivel, setVeiculoCombustivel] = useState<string[]>(["flex"]);
  const [veiculoSituacao, setVeiculoSituacao] = useState<string>("seminovo");

  const veiculoCombustivelList = [
    { value: "flex", label: "Flex" },
    { value: "gasolina", label: "Gasolina" },
    { value: "etanol", label: "Etanol" },
    { value: "diesel", label: "Diesel" },
    { value: "eletrico", label: "Elétrico" },
    { value: "hibrido", label: "Híbrido" },
  ];

  const toggleVeiculoCombustivel = (value: string) => {
    setVeiculoCombustivel((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };
  const [veiculoOpcionais, setVeiculoOpcionais] = useState<string[]>([]);
  const [veiculoExtras, setVeiculoExtras] = useState("");

  const veiculoOpcionaisList = [
    { value: "ar_condicionado", label: "Ar-condicionado" },
    { value: "direcao_hidraulica", label: "Direção hidráulica" },
    { value: "direcao_eletrica", label: "Direção elétrica" },
    { value: "vidros_eletricos", label: "Vidros elétricos" },
    { value: "travas_eletricas", label: "Travas elétricas" },
    { value: "air_bag", label: "Air bag" },
    { value: "abs", label: "ABS" },
    { value: "multimidia", label: "Central multimídia" },
    { value: "sensor_estacionamento", label: "Sensor de estacionamento" },
    { value: "camera_re", label: "Câmera de ré" },
    { value: "piloto_automatico", label: "Piloto automático" },
    { value: "teto_solar", label: "Teto solar" },
    { value: "couro", label: "Bancos de couro" },
  ];

  const toggleVeiculoOpcional = (value: string) => {
    setVeiculoOpcionais((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  const selectedBemQuota = useMemo(
    () => releaseQuotas.find((q) => q.id === selectedBemQuotaId),
    [selectedBemQuotaId]
  );

  /** Crédito usado no anúncio: cota do sistema ou dados manuais (carta de crédito) */
  const bemCredit = useMemo(() => {
    if (bemCreditSource === "quota" && selectedBemQuota) return selectedBemQuota;
    if (bemCreditSource === "manual") {
      const { groupCode, quotaNumber, administradora, creditValue, creditReleasedAt, goodType } = manualCredit;
      return {
        groupCode,
        quotaNumber: String(quotaNumber),
        goodType,
        goodTypeLabel: goodTypeLabels[goodType],
        administradora,
        creditValue,
        creditReleasedValue: creditValue,
        creditReleasedAt: creditReleasedAt || undefined,
      };
    }
    return null;
  }, [bemCreditSource, selectedBemQuota, manualCredit]);

  // Pre-fill price from credit released value
  const handleSelectBemQuota = (quotaId: string) => {
    setSelectedBemQuotaId(quotaId);
    const q = releaseQuotas.find((item) => item.id === quotaId);
    if (q) setBemPrice(q.creditReleasedValue ?? q.creditValue);
  };

  const canProceedBemStep1 =
    bemCreditSource === "quota"
      ? !!selectedBemQuotaId
      : !!(
          manualCredit.groupCode.trim() &&
          manualCredit.quotaNumber.trim() &&
          manualCredit.administradora.trim() &&
          manualCredit.creditValue > 0
        );

  const handleBemStep1Next = () => {
    if (bemCreditSource === "manual") setBemPrice(manualCredit.creditValue);
    setBemStep(2);
  };

  const handleTypeSelect = (type: AnuncioType) => {
    setAnuncioType(type);
    if (type === "bem") {
      if (releaseQuotas.length > 0 && !selectedBemQuotaId) {
        handleSelectBemQuota(releaseQuotas[0].id);
      } else if (releaseQuotas.length === 0) {
        setBemCreditSource("manual");
      }
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────

  if (published) {
    const isCotas = anuncioType === "cota";
    return (
      <div className="dashboard__content hover-bgc-color">
        <div className="row pb40">
          <div className="col-lg-12">
            <div className="dashboard_title_area">
              <h2>Anúncio Criado!</h2>
            </div>
          </div>
        </div>
        <SuccessScreen
          type={anuncioType!}
          title={isCotas ? "Cota anunciada" : "Bem anunciado"}
          subtitle={
            isCotas
              ? `Sua cota do grupo ${selectedQuota?.groupCode} (Cota #${selectedQuota?.quotaNumber}) está agora visível no marketplace por ${formatCurrency(askingPrice)}.`
              : `Seu ${bemCredit?.goodTypeLabel?.toLowerCase()} "${bemTitle}" está agora visível no marketplace por ${formatCurrency(bemPrice)}.`
          }
        />
      </div>
    );
  }

  return (
    <div className="dashboard__content hover-bgc-color">
      <div className="row pb25">
        <div className="col-lg-12">
          <div className="dashboard_title_area">
            <h2>Anunciar no Marketplace</h2>
            <p className="text body-color">
              Venda sua cota de consórcio ou o bem adquirido com a carta de crédito
            </p>
          </div>
        </div>
      </div>

      {/* ── Seleção do tipo de anúncio ── */}
      {!anuncioType && (
        <div className="row justify-content-center">
          <div className="col-12">
            <p className="fz14 body-color mb20 text-center">
              O que você deseja anunciar?
            </p>
            <div className="row g-4 justify-content-center">
              {/* Vender Cota */}
              <div className="col-md-5">
                <button
                  type="button"
                  onClick={() => handleTypeSelect("cota")}
                  className="w-100 text-start bdrs12 p30 hover-box-shadow"
                  style={{
                    border: "2px solid #e8e8e8",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#5bbb7b")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e8e8e8")}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mb20"
                    style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: "rgba(91,187,123,0.12)" }}
                  >
                    <i className="fal fa-file-contract fz24" style={{ color: "#5bbb7b" }} />
                  </div>
                  <h4 className="mb10">Vender cota de consórcio</h4>
                  <p className="fz14 body-color mb15">
                    Transfira sua cota ativa ou contemplada para outro comprador. O comprador assume as parcelas restantes e o direito ao crédito.
                  </p>
                  <ul className="list-unstyled fz13 body-color mb20">
                    <li className="mb-1"><i className="fal fa-check me-2" style={{ color: "#5bbb7b" }} />Cotas ativas ou contempladas</li>
                    <li className="mb-1"><i className="fal fa-check me-2" style={{ color: "#5bbb7b" }} />Comprador assume parcelas</li>
                    <li><i className="fal fa-check me-2" style={{ color: "#5bbb7b" }} />Transferência formal junto à administradora</li>
                  </ul>
                  <span className="ud-btn btn-thm bdrs8 fz13 d-inline-block">
                    Anunciar cota <i className="fal fa-arrow-right ms-1" />
                  </span>
                </button>
              </div>

              {/* Vender Bem Adquirido */}
              <div className="col-md-5">
                <button
                  type="button"
                  onClick={() => handleTypeSelect("bem")}
                  className="w-100 text-start bdrs12 p30 hover-box-shadow"
                  style={{
                    border: "2px solid #e8e8e8",
                    background: "#fff",
                    cursor: "pointer",
                    transition: "border-color .2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0d6efd")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e8e8e8")}
                >
                  <div
                    className="d-flex align-items-center justify-content-center mb20"
                    style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: "rgba(13,110,253,0.1)" }}
                  >
                    <i className="fal fa-home fz24" style={{ color: "#0d6efd" }} />
                  </div>
                  <h4 className="mb10">Vender bem adquirido com crédito</h4>
                  <p className="fz14 body-color mb15">
                    Anuncie o imóvel, veículo ou serviço que você comprou usando a carta de crédito do seu consórcio.
                  </p>
                  <ul className="list-unstyled fz13 body-color mb20">
                    <li className="mb-1"><i className="fal fa-check me-2" style={{ color: "#0d6efd" }} />Imóveis, veículos ou serviços</li>
                    <li className="mb-1"><i className="fal fa-check me-2" style={{ color: "#0d6efd" }} />Crédito já liberado e utilizado</li>
                    <li><i className="fal fa-check me-2" style={{ color: "#0d6efd" }} />Venda direta sem transferência de cota</li>
                  </ul>
                  {releaseQuotas.length === 0 && (
                    <span className="fz12 body-color d-block mb10" style={{ color: "#eb6753" }}>
                      <i className="fal fa-info-circle me-1" />
                      Nenhum crédito liberado encontrado
                    </span>
                  )}
                  <span
                    className="ud-btn bdrs8 fz13 d-inline-block"
                    style={{ backgroundColor: "#0d6efd", color: "#fff", border: "none" }}
                  >
                    Anunciar bem <i className="fal fa-arrow-right ms-1" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* FLUXO: VENDER COTA                                          */}
      {/* ════════════════════════════════════════════════════════════ */}
      {anuncioType === "cota" && (
        <>
          <StepIndicator
            steps={["Selecionar cota", "Preço e condições", "Revisar e publicar"]}
            current={cotaStep}
          />

          {/* Step 1 */}
          {cotaStep === 1 && (
            <div className="row">
              <div className="col-12">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <div className="d-flex align-items-center justify-content-between mb20">
                    <h4 className="mb-0">Selecione a cota que deseja vender</h4>
                    <button
                      type="button"
                      className="ud-btn btn-white bdrs8 fz13"
                      onClick={() => setAnuncioType(null)}
                    >
                      <i className="fal fa-arrow-left me-1" /> Voltar
                    </button>
                  </div>
                  <p className="body-color fz14 mb25">
                    Apenas cotas ativas ou contempladas podem ser anunciadas.
                  </p>
                  {myQuotas.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="flaticon-document fz40 text-thm2" />
                      <h5 className="mt15">Nenhuma cota disponível</h5>
                      <p className="body-color fz14">Você não possui cotas ativas ou contempladas.</p>
                    </div>
                  ) : (
                    <div className="row">
                      {myQuotas.map((quota) => {
                        const isSelected = selectedQuotaId === quota.id;
                        const paidPct = Math.round((quota.paidAmount / quota.creditValue) * 100);
                        return (
                          <div key={quota.id} className="col-md-6 col-xl-4">
                            <div
                              onClick={() => handleSelectQuota(quota.id)}
                              className="bdrs12 p20 mb20"
                              style={{
                                cursor: "pointer",
                                border: isSelected ? "2px solid #5bbb7b" : "1px solid #e8e8e8",
                                position: "relative",
                                backgroundColor: isSelected ? "rgba(91,187,123,0.04)" : "#fff",
                                transition: "border-color .15s",
                              }}
                            >
                              {isSelected && (
                                <span
                                  className="position-absolute d-flex align-items-center justify-content-center text-white"
                                  style={{ top: 10, right: 10, width: 24, height: 24, borderRadius: "50%", backgroundColor: "#5bbb7b", fontSize: 11 }}
                                >
                                  <i className="fas fa-check" />
                                </span>
                              )}
                              <div className="d-flex align-items-center mb12">
                                <div
                                  className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                  style={{ width: 44, height: 44, flexShrink: 0, backgroundColor: "rgba(91,187,123,0.12)" }}
                                >
                                  <i className={`fal ${quota.goodType === "imovel" ? "fa-home" : quota.goodType === "veiculo" ? "fa-car" : "fa-tools"} fz18`} style={{ color: "#5bbb7b" }} />
                                </div>
                                <div>
                                  <p className="fz13 fw600 mb-0 dark-color">{quota.groupCode} · Cota #{quota.quotaNumber}</p>
                                  <p className="fz12 body-color mb-0">{quota.goodTypeLabel} · {quota.administradora}</p>
                                </div>
                              </div>
                              <SummaryRow label="Crédito" value={formatCurrency(quota.creditValue)} />
                              <SummaryRow label="Já pago" value={formatCurrency(quota.paidAmount)} />
                              <SummaryRow label="Parcela" value={`${formatCurrency(quota.installmentValue)}/mês`} />
                              <div className="mt10">
                                <div className="progress" style={{ height: 5 }}>
                                  <div className="progress-bar bgc-thm" style={{ width: `${paidPct}%` }} />
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                  <span className="fz11 body-color">{paidPct}% pago</span>
                                  <span className="fz11 body-color">{quota.remainingInstallments} meses restantes</span>
                                </div>
                              </div>
                              <div className="mt10">
                                <span
                                  className="fz11 text-white px-2 py-1"
                                  style={{ borderRadius: 10, backgroundColor: quota.status === "contemplada" ? "#5bbb7b" : "#0d6efd" }}
                                >
                                  {quota.status === "contemplada" ? "Contemplada" : "Ativa"}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="d-flex justify-content-end mt10">
                    <button className="ud-btn btn-thm bdrs12" disabled={!selectedQuotaId} onClick={() => setCotaStep(2)}>
                      Próximo <i className="fal fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {cotaStep === 2 && selectedQuota && (
            <div className="row">
              <div className="col-lg-7">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <h4 className="mb25">Defina o preço e condições</h4>

                  <div className="mb25">
                    <label className="fw500 ff-heading dark-color mb-2 d-block">Preço de venda</label>
                    <CurrencyInput
                      value={askingPrice}
                      onValueChange={setAskingPrice}
                    />
                    <div className="d-flex gap-3 mt10 flex-wrap">
                      <span className="fz12 body-color">Já pago: <strong>{formatCurrency(selectedQuota.paidAmount)}</strong></span>
                      <span className="fz12 body-color">Crédito: <strong>{formatCurrency(selectedQuota.creditValue)}</strong></span>
                    </div>
                    {askingPrice > 0 && (
                      <div className="mt10 p12 bdrs8" style={{ backgroundColor: askingPrice < selectedQuota.paidAmount ? "rgba(235,103,83,0.08)" : "rgba(91,187,123,0.08)" }}>
                        <span className="fz13">
                          {askingPrice < selectedQuota.paidAmount ? (
                            <span style={{ color: "#eb6753" }}>
                              <i className="fas fa-exclamation-triangle me-1" />
                              Preço abaixo do valor já pago ({formatCurrency(selectedQuota.paidAmount - askingPrice)} de desconto)
                            </span>
                          ) : askingPrice <= selectedQuota.paidAmount * 1.1 ? (
                            <span style={{ color: "#5bbb7b" }}>
                              <i className="fas fa-thumbs-up me-1" />
                              Preço competitivo — maior chance de venda rápida
                            </span>
                          ) : (
                            <span style={{ color: "#e0900a" }}>
                              <i className="fas fa-info-circle me-1" />
                              Preço acima do pago (+{formatCurrency(askingPrice - selectedQuota.paidAmount)})
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mb25">
                    <label className="fw500 ff-heading dark-color mb-2 d-block">Descrição do anúncio</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva sua cota, motivo da venda, diferenciais..."
                    />
                  </div>

                  <div className="mb20">
                    <div className="form-check form-switch mb15">
                      <input className="form-check-input" type="checkbox" id="counterOffer" checked={acceptsCounterOffer} onChange={(e) => setAcceptsCounterOffer(e.target.checked)} />
                      <label className="form-check-label fz14" htmlFor="counterOffer">Aceitar contra-propostas</label>
                      <p className="fz12 body-light-color mb-0 mt-1">Compradores poderão enviar propostas abaixo do preço pedido</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="financing" checked={acceptsFinancing} onChange={(e) => setAcceptsFinancing(e.target.checked)} />
                      <label className="form-check-label fz14" htmlFor="financing">Aceitar parcelamento do repasse</label>
                      <p className="fz12 body-light-color mb-0 mt-1">O comprador poderá pagar o valor do repasse em parcelas</p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt25">
                    <button className="ud-btn btn-thm-border bdrs12" onClick={() => setCotaStep(1)}>
                      <i className="fal fa-arrow-left-long me-2" /> Voltar
                    </button>
                    <button className="ud-btn btn-thm bdrs12" onClick={() => setCotaStep(3)}>
                      Revisar <i className="fal fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="price-widget pt25 pb25 bdrs12">
                  <h5 className="widget-title mb15">Resumo da cota</h5>
                  <SummaryRow label="Grupo" value={selectedQuota.groupCode} />
                  <SummaryRow label="Cota" value={`#${selectedQuota.quotaNumber}`} />
                  <SummaryRow label="Tipo" value={selectedQuota.goodTypeLabel} />
                  <SummaryRow label="Crédito" value={formatCurrency(selectedQuota.creditValue)} />
                  <SummaryRow label="Parcelas restantes" value={`${selectedQuota.remainingInstallments}/${selectedQuota.totalInstallments}`} />
                  <SummaryRow label="Administradora" value={selectedQuota.administradora} />
                  <hr className="opacity-100" />
                  <div className="d-flex justify-content-between mt10">
                    <span className="fz15 fw600 dark-color">Preço de Venda</span>
                    <span className="fw700 fz17 text-thm2">{formatCurrency(askingPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {cotaStep === 3 && selectedQuota && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <h4 className="mb25">Revise seu anúncio de cota</h4>
                  <div className="bdr1 bdrs12 p20 mb20">
                    <div className="d-flex align-items-center mb15">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle me-3"
                        style={{ width: 48, height: 48, flexShrink: 0, backgroundColor: "rgba(91,187,123,0.12)" }}
                      >
                        <i className={`fal ${selectedQuota.goodType === "imovel" ? "fa-home" : selectedQuota.goodType === "veiculo" ? "fa-car" : "fa-tools"} fz18`} style={{ color: "#5bbb7b" }} />
                      </div>
                      <div>
                        <h5 className="mb-0">{selectedQuota.groupCode} · Cota #{selectedQuota.quotaNumber}</h5>
                        <span className="fz13 body-color">{selectedQuota.goodTypeLabel} · {selectedQuota.administradora}</span>
                      </div>
                    </div>
                    <div className="row mb15">
                      {[
                        { l: "Crédito", v: formatCurrency(selectedQuota.creditValue) },
                        { l: "Já pago", v: formatCurrency(selectedQuota.paidAmount) },
                        { l: "Parcela", v: `${formatCurrency(selectedQuota.installmentValue)}/mês` },
                        { l: "Restantes", v: `${selectedQuota.remainingInstallments} meses` },
                      ].map((item) => (
                        <div key={item.l} className="col-6 col-md-3">
                          <p className="fz11 body-light-color mb-1">{item.l}</p>
                          <p className="fw500 fz13 mb-0">{item.v}</p>
                        </div>
                      ))}
                    </div>
                    <hr className="opacity-100" />
                    <div className="row mt15">
                      <div className="col-md-6">
                        <SummaryRow label="Preço de venda" value={<strong className="text-thm2">{formatCurrency(askingPrice)}</strong>} />
                        <SummaryRow label="Contra-proposta" value={acceptsCounterOffer ? "Sim" : "Não"} />
                        <SummaryRow label="Parcelamento" value={acceptsFinancing ? "Sim" : "Não"} />
                      </div>
                      <div className="col-md-6">
                        <p className="fz12 body-light-color mb-1">Descrição</p>
                        <p className="fz13 body-color">{description || "Nenhuma descrição."}</p>
                      </div>
                    </div>
                  </div>

                  <InfoNote>
                    Ao publicar, sua cota ficará visível no marketplace.
                    Você pode pausar ou remover o anúncio em{" "}
                    <Link href="/cotista/anuncios" className="text-thm">Meus Anúncios</Link>.
                  </InfoNote>

                  <div className="d-flex justify-content-between">
                    <button className="ud-btn btn-thm-border bdrs12" onClick={() => setCotaStep(2)}>
                      <i className="fal fa-arrow-left-long me-2" /> Voltar
                    </button>
                    <button className="ud-btn btn-thm bdrs12" onClick={handlePublish}>
                      <i className="fas fa-megaphone me-2" /> Publicar anúncio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════════════════════════════ */}
      {/* FLUXO: VENDER BEM ADQUIRIDO                                  */}
      {/* ════════════════════════════════════════════════════════════ */}
      {anuncioType === "bem" && (
        <>
          <StepIndicator
            steps={["Selecionar crédito", "Dados do bem", "Preço e condições", "Revisar e publicar"]}
            current={bemStep}
          />

          {/* Step 1: Selecionar crédito ou cadastrar cota/carta manualmente */}
          {bemStep === 1 && (
            <div className="row">
              <div className="col-12">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <div className="d-flex align-items-center justify-content-between mb20">
                    <h4 className="mb-0">Crédito utilizado na aquisição do bem</h4>
                    <button type="button" className="ud-btn btn-white bdrs8 fz13" onClick={() => setAnuncioType(null)}>
                      <i className="fal fa-arrow-left me-1" /> Voltar
                    </button>
                  </div>
                  <p className="fz14 body-color mb25">
                    Vincule uma cota com crédito liberado que você já tem no sistema ou cadastre os dados da cota/carta de crédito, caso o bem não tenha sido adquirido pelo marketplace.
                  </p>

                  {/* Opção: origem do crédito */}
                  <div className="d-flex gap-3 mb25 flex-wrap">
                    <button
                      type="button"
                      className={`ud-btn bdrs12 fz14 ${bemCreditSource === "quota" ? "btn-thm" : "btn-thm-border"}`}
                      onClick={() => setBemCreditSource("quota")}
                    >
                      <i className="fal fa-list me-1" /> Selecionar cota do sistema
                    </button>
                    <button
                      type="button"
                      className={`ud-btn bdrs12 fz14 ${bemCreditSource === "manual" ? "btn-thm" : "btn-thm-border"}`}
                      onClick={() => setBemCreditSource("manual")}
                    >
                      <i className="fal fa-edit me-1" /> Cadastrar cota/carta de crédito
                    </button>
                  </div>

                  {bemCreditSource === "quota" && (
                    <>
                      {releaseQuotas.length === 0 ? (
                        <div className="text-center py-4 bdrs12 bdr1 p20">
                          <i className="fal fa-info-circle fz36 mb10 d-block" style={{ color: "#0d6efd" }} />
                          <h5 className="mb10">Nenhum crédito liberado</h5>
                          <p className="fz14 body-color mb0">
                            Para vincular uma cota, você precisa ter uma com crédito já liberado. Caso o bem tenha sido adquirido fora do sistema, use <strong>Cadastrar cota/carta de crédito</strong> acima.
                          </p>
                        </div>
                      ) : (
                        <div className="row">
                          {releaseQuotas.map((quota) => {
                            const isSelected = selectedBemQuotaId === quota.id;
                            return (
                              <div key={quota.id} className="col-md-6 col-xl-4">
                                <div
                                  onClick={() => handleSelectBemQuota(quota.id)}
                                  className="bdrs12 p20 mb20"
                                  style={{
                                    cursor: "pointer",
                                    border: isSelected ? "2px solid #0d6efd" : "1px solid #e8e8e8",
                                    backgroundColor: isSelected ? "rgba(13,110,253,0.04)" : "#fff",
                                    position: "relative",
                                    transition: "border-color .15s",
                                  }}
                                >
                                  {isSelected && (
                                    <span
                                      className="position-absolute d-flex align-items-center justify-content-center text-white"
                                      style={{ top: 10, right: 10, width: 24, height: 24, borderRadius: "50%", backgroundColor: "#0d6efd", fontSize: 11 }}
                                    >
                                      <i className="fas fa-check" />
                                    </span>
                                  )}
                                  <div className="d-flex align-items-center mb12">
                                    <div
                                      className="d-flex align-items-center justify-content-center rounded-circle me-3"
                                      style={{ width: 44, height: 44, flexShrink: 0, backgroundColor: "rgba(13,110,253,0.1)" }}
                                    >
                                      <i className={`fal ${quota.goodType === "imovel" ? "fa-home" : quota.goodType === "veiculo" ? "fa-car" : "fa-tools"} fz18`} style={{ color: "#0d6efd" }} />
                                    </div>
                                    <div>
                                      <p className="fz13 fw600 mb-0 dark-color">{quota.groupCode} · Cota #{quota.quotaNumber}</p>
                                      <p className="fz12 body-color mb-0">{quota.goodTypeLabel} · {quota.administradora}</p>
                                    </div>
                                  </div>
                                  <SummaryRow label="Crédito liberado" value={<strong>{formatCurrency(quota.creditReleasedValue ?? quota.creditValue)}</strong>} />
                                  {quota.creditReleasedAt && (
                                    <SummaryRow label="Liberado em" value={new Date(quota.creditReleasedAt).toLocaleDateString("pt-BR")} />
                                  )}
                                  <div className="mt10">
                                    <span className="fz11 text-white px-2 py-1" style={{ borderRadius: 10, backgroundColor: "#5bbb7b" }}>
                                      Crédito liberado
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}

                  {bemCreditSource === "manual" && (
                    <div className="bdr1 bdrs12 p25 mb20" style={{ backgroundColor: "#f8f9fa" }}>
                      <h5 className="mb15">Dados da cota ou carta de crédito</h5>
                      <p className="fz13 body-color mb20">
                        Preencha com as informações do consórcio que foi usado para adquirir o bem (não precisa ser do marketplace).
                      </p>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Código do grupo *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={manualCredit.groupCode}
                            onChange={(e) => setManualCredit((p) => ({ ...p, groupCode: e.target.value }))}
                            placeholder="Ex: GRP-4052"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Número da cota *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={manualCredit.quotaNumber}
                            onChange={(e) => setManualCredit((p) => ({ ...p, quotaNumber: e.target.value }))}
                            placeholder="Ex: 12"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Tipo de bem *</label>
                          <select
                            className="form-select"
                            value={manualCredit.goodType}
                            onChange={(e) => setManualCredit((p) => ({ ...p, goodType: e.target.value as ManualCreditData["goodType"] }))}
                          >
                            <option value="imovel">Imóvel</option>
                            <option value="veiculo">Veículo</option>
                            <option value="servico">Serviço</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Administradora *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={manualCredit.administradora}
                            onChange={(e) => setManualCredit((p) => ({ ...p, administradora: e.target.value }))}
                            placeholder="Ex: Embracon"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Valor do crédito *</label>
                          <CurrencyInput
                            value={manualCredit.creditValue}
                            onValueChange={(v) => setManualCredit((p) => ({ ...p, creditValue: v }))}
                            placeholder="R$ 0,00"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Data de liberação do crédito (opcional)</label>
                          <input
                            type="date"
                            className="form-control"
                            value={manualCredit.creditReleasedAt}
                            onChange={(e) => setManualCredit((p) => ({ ...p, creditReleasedAt: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="d-flex justify-content-end mt10">
                    <button
                      className="ud-btn btn-thm bdrs12"
                      disabled={!canProceedBemStep1}
                      onClick={handleBemStep1Next}
                    >
                      Próximo <i className="fal fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Dados do bem */}
          {bemStep === 2 && bemCredit && (
            <div className="row">
              <div className="col-lg-8">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <h4 className="mb25">Informações do bem</h4>

                  {/* Título do anúncio */}
                  <div className="mb20">
                    <label className="fw500 ff-heading dark-color mb-2 d-block">Título do anúncio *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bemTitle}
                      onChange={(e) => setBemTitle(e.target.value)}
                      placeholder={
                        bemCredit.goodType === "imovel"
                          ? "Ex: Apartamento 3 quartos, 90m² – Moema, SP"
                          : bemCredit.goodType === "veiculo"
                            ? "Ex: Toyota Corolla 2022 – Prata – 18.000 km"
                            : "Ex: Reforma completa de imóvel – 120m²"
                      }
                      maxLength={120}
                    />
                  </div>

                  {/* ─── Imóvel ─── */}
                  {bemCredit.goodType === "imovel" && (
                    <>
                      <p className="fz12 fw600 body-color text-uppercase mb15" style={{ letterSpacing: "0.05em" }}>Dados do imóvel</p>
                      <div className="row g-3 mb20">
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Tipo</label>
                          <select
                            className="form-select"
                            value={imovelTipo}
                            onChange={(e) => setImovelTipo(e.target.value as AcquiredAssetImovel["tipo"])}
                          >
                            <option value="apartamento">Apartamento</option>
                            <option value="casa">Casa</option>
                            <option value="comercial">Comercial</option>
                            <option value="terreno">Terreno</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Área (m²)</label>
                          <input type="number" className="form-control" value={imovelArea || ""} onChange={(e) => setImovelArea(Number(e.target.value))} min={1} />
                        </div>
                        {imovelTipo !== "terreno" && (
                          <>
                            <div className="col-md-4">
                              <label className="fw500 ff-heading dark-color mb-2 d-block">Dormitórios</label>
                              <select className="form-select" value={imovelDorm} onChange={(e) => setImovelDorm(Number(e.target.value))}>
                                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="fw500 ff-heading dark-color mb-2 d-block">Banheiros</label>
                              <select className="form-select" value={imovelBanheiros} onChange={(e) => setImovelBanheiros(Number(e.target.value))}>
                                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            </div>
                            <div className="col-md-4">
                              <label className="fw500 ff-heading dark-color mb-2 d-block">Vagas</label>
                              <select className="form-select" value={imovelVagas} onChange={(e) => setImovelVagas(Number(e.target.value))}>
                                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
                              </select>
                            </div>
                            {imovelTipo === "apartamento" && (
                              <div className="col-md-4">
                                <label className="fw500 ff-heading dark-color mb-2 d-block">Andar</label>
                                <input type="number" className="form-control" value={imovelAndar} onChange={(e) => setImovelAndar(Number(e.target.value))} min={1} />
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Localização */}
                      <p className="fz12 fw600 body-color text-uppercase mb15 mt25" style={{ letterSpacing: "0.05em" }}>Localização</p>
                      <div className="row g-3 mb20">
                        <div className="col-md-3">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">CEP</label>
                          <input type="text" className="form-control" value={imovelCep} onChange={(e) => setImovelCep(e.target.value)} placeholder="00000-000" maxLength={9} />
                        </div>
                        <div className="col-md-6">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Logradouro</label>
                          <input type="text" className="form-control" value={imovelLogradouro} onChange={(e) => setImovelLogradouro(e.target.value)} placeholder="Rua, avenida..." />
                        </div>
                        <div className="col-md-3">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Número</label>
                          <input type="text" className="form-control" value={imovelNumero} onChange={(e) => setImovelNumero(e.target.value)} placeholder="123" />
                        </div>
                        <div className="col-md-6">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Complemento</label>
                          <input type="text" className="form-control" value={imovelComplemento} onChange={(e) => setImovelComplemento(e.target.value)} placeholder="Apto, bloco..." />
                        </div>
                        <div className="col-md-6">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Bairro</label>
                          <input type="text" className="form-control" value={imovelBairro} onChange={(e) => setImovelBairro(e.target.value)} placeholder="Ex: Moema" />
                        </div>
                        <div className="col-md-5">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Cidade</label>
                          <input type="text" className="form-control" value={imovelCidade} onChange={(e) => setImovelCidade(e.target.value)} placeholder="São Paulo" />
                        </div>
                        <div className="col-md-2">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Estado</label>
                          <input type="text" className="form-control" value={imovelEstado} onChange={(e) => setImovelEstado(e.target.value)} placeholder="SP" maxLength={2} />
                        </div>
                        <div className="col-12">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Ponto de referência</label>
                          <input type="text" className="form-control" value={imovelReferencia} onChange={(e) => setImovelReferencia(e.target.value)} placeholder="Ex: Próximo ao metrô Vila Mariana" />
                        </div>
                      </div>

                      {/* Custos Mensais */}
                      <p className="fz12 fw600 body-color text-uppercase mb15 mt25" style={{ letterSpacing: "0.05em" }}>Custos mensais</p>
                      <div className="row g-3 mb20">
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Condomínio (R$/mês)</label>
                          <input type="number" className="form-control" value={imovelCond} onChange={(e) => setImovelCond(Number(e.target.value))} min={0} placeholder="0" />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">IPTU (R$/mês)</label>
                          <input type="number" className="form-control" value={imovelIptu} onChange={(e) => setImovelIptu(Number(e.target.value))} min={0} placeholder="0" />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Outros (R$/mês)</label>
                          <input type="number" className="form-control" value={imovelOutrosCustos} onChange={(e) => setImovelOutrosCustos(Number(e.target.value))} min={0} placeholder="Água, gás, luz (estimado)" />
                        </div>
                      </div>

                      {/* Comodidades */}
                      <p className="fz12 fw600 body-color text-uppercase mb15 mt25" style={{ letterSpacing: "0.05em" }}>Comodidades</p>
                      <div className="row g-2 mb20">
                        {imovelComodidadesList.map((opt) => (
                          <div key={opt.value} className="col-6 col-md-4 col-lg-3">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`comod-${opt.value}`}
                                checked={imovelComodidades.includes(opt.value)}
                                onChange={() => toggleImovelComodidade(opt.value)}
                              />
                              <label className="form-check-label fz14" htmlFor={`comod-${opt.value}`}>
                                {opt.label}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Diferenciais */}
                      <p className="fz12 fw600 body-color text-uppercase mb15 mt25" style={{ letterSpacing: "0.05em" }}>Diferenciais</p>
                      <div className="mb20">
                        <textarea
                          className="form-control"
                          rows={3}
                          value={imovelDiferenciais}
                          onChange={(e) => setImovelDiferenciais(e.target.value)}
                          placeholder="Ex: Vista livre, acabamento premium, cozinha planejada, varanda gourmet, único dono..."
                        />
                        <p className="fz12 body-color mt-1 mb-0">Destaque o que torna este imóvel especial para o comprador.</p>
                      </div>
                    </>
                  )}

                  {/* ─── Veículo ─── */}
                  {bemCredit.goodType === "veiculo" && (
                    <>
                      <p className="fz12 fw600 body-color text-uppercase mb15" style={{ letterSpacing: "0.05em" }}>Dados do veículo</p>
                      <div className="row g-3 mb20">
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Marca</label>
                          <input type="text" className="form-control" value={veiculoMarca} onChange={(e) => setVeiculoMarca(e.target.value)} placeholder="Ex: Toyota" />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Modelo</label>
                          <input type="text" className="form-control" value={veiculoModelo} onChange={(e) => setVeiculoModelo(e.target.value)} placeholder="Ex: Corolla XEi" />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Ano</label>
                          <input type="number" className="form-control" value={veiculoAno} onChange={(e) => setVeiculoAno(Number(e.target.value))} min={1990} max={new Date().getFullYear() + 1} />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Quilometragem</label>
                          <input type="number" className="form-control" value={veiculoKm || ""} onChange={(e) => setVeiculoKm(Number(e.target.value))} min={0} placeholder="0" />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Cor</label>
                          <input type="text" className="form-control" value={veiculoCor} onChange={(e) => setVeiculoCor(e.target.value)} placeholder="Ex: Prata" />
                        </div>
                        <div className="col-md-4">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Câmbio</label>
                          <select className="form-select" value={veiculoCambio} onChange={(e) => setVeiculoCambio(e.target.value as AcquiredAssetVeiculo["cambio"])}>
                            <option value="automatico">Automático</option>
                            <option value="manual">Manual</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Combustível</label>
                          <div className="row g-2">
                            {veiculoCombustivelList.map((opt) => (
                              <div key={opt.value} className="col-6 col-md-4">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`comb-${opt.value}`}
                                    checked={veiculoCombustivel.includes(opt.value)}
                                    onChange={() => toggleVeiculoCombustivel(opt.value)}
                                  />
                                  <label className="form-check-label fz14" htmlFor={`comb-${opt.value}`}>
                                    {opt.label}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Situação do veículo</label>
                          <select
                            className="form-select"
                            value={veiculoSituacao}
                            onChange={(e) => setVeiculoSituacao(e.target.value)}
                          >
                            <option value="novo">Novo</option>
                            <option value="seminovo">Seminovo</option>
                            <option value="usado">Usado</option>
                            <option value="reformado">Reformado</option>
                            <option value="recem_licenciado">Recém-licenciado</option>
                          </select>
                        </div>
                        <div className="col-12">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Opcionais</label>
                          <div className="row g-2">
                            {veiculoOpcionaisList.map((opt) => (
                              <div key={opt.value} className="col-6 col-md-4 col-lg-3">
                                <div className="form-check">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={`opc-${opt.value}`}
                                    checked={veiculoOpcionais.includes(opt.value)}
                                    onChange={() => toggleVeiculoOpcional(opt.value)}
                                  />
                                  <label className="form-check-label fz14" htmlFor={`opc-${opt.value}`}>
                                    {opt.label}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="fw500 ff-heading dark-color mb-2 d-block">Extras</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={veiculoExtras}
                            onChange={(e) => setVeiculoExtras(e.target.value)}
                            placeholder="Ex: Kit de ferramentas, estepe novo, documentação em dia, único dono..."
                          />
                          <p className="fz12 body-color mt-1 mb-0">Informe itens extras, acessórios ou observações sobre o veículo.</p>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ─── Serviço ─── */}
                  {bemCredit.goodType === "servico" && (
                    <div className="bdrs8 p15 mb20" style={{ backgroundColor: "#f8f9fa" }}>
                      <p className="fz13 body-color mb-0">
                        <i className="fal fa-info-circle me-1" style={{ color: "#0d6efd" }} />
                        Preencha o título e a descrição do serviço adquirido que deseja vender ou transferir.
                      </p>
                    </div>
                  )}

                  {/* Fotos (placeholder) */}
                  <div className="mb20">
                    <label className="fw500 ff-heading dark-color mb-2 d-block">Fotos do bem</label>
                    <div
                      className="bdrs8 p20 text-center"
                      style={{ border: "2px dashed #e8e8e8", cursor: "pointer" }}
                      onClick={() => {}}
                    >
                      <i className="fal fa-cloud-upload fz30 body-color d-block mb10" />
                      <p className="fz13 body-color mb-0">
                        Arraste fotos aqui ou <span className="text-thm fw500">clique para selecionar</span>
                      </p>
                      <p className="fz11 body-color mt-1 mb-0">Até 10 fotos · JPG, PNG · Máx. 5MB cada</p>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button className="ud-btn btn-thm-border bdrs12" onClick={() => setBemStep(1)}>
                      <i className="fal fa-arrow-left-long me-2" /> Voltar
                    </button>
                    <button
                      className="ud-btn btn-thm bdrs12"
                      disabled={!bemTitle.trim()}
                      onClick={() => setBemStep(3)}
                    >
                      Próximo <i className="fal fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="price-widget pt25 pb25 bdrs12">
                  <h5 className="widget-title mb15">Crédito utilizado</h5>
                  <SummaryRow label="Grupo" value={bemCredit.groupCode} />
                  <SummaryRow label="Cota" value={`#${bemCredit.quotaNumber}`} />
                  <SummaryRow label="Tipo de bem" value={bemCredit.goodTypeLabel} />
                  <SummaryRow label="Crédito liberado" value={<strong>{formatCurrency(bemCredit.creditReleasedValue ?? bemCredit.creditValue)}</strong>} />
                  <SummaryRow label="Administradora" value={bemCredit.administradora} />
                  {bemCredit.creditReleasedAt && (
                    <SummaryRow label="Liberado em" value={new Date(bemCredit.creditReleasedAt).toLocaleDateString("pt-BR")} />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preço e condições do bem */}
          {bemStep === 3 && bemCredit && (
            <div className="row">
              <div className="col-lg-7">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <h4 className="mb25">Preço e condições de venda</h4>

                  <div className="mb25">
                    <label className="fw500 ff-heading dark-color mb-2 d-block">Preço de venda</label>
                    <CurrencyInput
                      value={bemPrice}
                      onValueChange={setBemPrice}
                    />
                    <div className="d-flex gap-3 mt10 flex-wrap">
                      <span className="fz12 body-color">
                        Crédito utilizado: <strong>{formatCurrency(bemCredit.creditReleasedValue ?? bemCredit.creditValue)}</strong>
                      </span>
                      {bemPrice > 0 && (
                        <span className="fz12 body-color">
                          {bemPrice > (bemCredit.creditReleasedValue ?? bemCredit.creditValue) ? (
                            <span style={{ color: "#5bbb7b" }}>
                              <i className="fas fa-arrow-up me-1" />
                              +{formatCurrency(bemPrice - (bemCredit.creditReleasedValue ?? bemCredit.creditValue))} acima do crédito
                            </span>
                          ) : (
                            <span style={{ color: "#e0900a" }}>
                              <i className="fas fa-arrow-down me-1" />
                              {formatCurrency((bemCredit.creditReleasedValue ?? bemCredit.creditValue) - bemPrice)} abaixo do crédito
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb25">
                    <label className="fw500 ff-heading dark-color mb-2 d-block">Descrição completa</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={bemDesc}
                      onChange={(e) => setBemDesc(e.target.value)}
                      placeholder="Descreva o estado do bem, historico, diferenciais, motivo da venda..."
                    />
                  </div>

                  <div className="mb20">
                    <div className="form-check form-switch mb15">
                      <input className="form-check-input" type="checkbox" id="bemCounterOffer" checked={bemAcceptsCounterOffer} onChange={(e) => setBemAcceptsCounterOffer(e.target.checked)} />
                      <label className="form-check-label fz14" htmlFor="bemCounterOffer">Aceitar contra-propostas</label>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="bemFinancing" checked={bemAcceptsFinancing} onChange={(e) => setBemAcceptsFinancing(e.target.checked)} />
                      <label className="form-check-label fz14" htmlFor="bemFinancing">Aceitar financiamento / parcelamento</label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt25">
                    <button className="ud-btn btn-thm-border bdrs12" onClick={() => setBemStep(2)}>
                      <i className="fal fa-arrow-left-long me-2" /> Voltar
                    </button>
                    <button className="ud-btn btn-thm bdrs12" disabled={bemPrice <= 0} onClick={() => setBemStep(4)}>
                      Revisar <i className="fal fa-arrow-right-long" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="price-widget pt25 pb25 bdrs12">
                  <h5 className="widget-title mb15">Resumo</h5>
                  <SummaryRow label="Título" value={bemTitle || "—"} />
                  <SummaryRow label="Tipo" value={bemCredit.goodTypeLabel} />
                  {bemCredit.goodType === "veiculo" && veiculoMarca && (
                    <SummaryRow label="Veículo" value={`${veiculoMarca} ${veiculoModelo} ${veiculoAno}`} />
                  )}
                  {bemCredit.goodType === "imovel" && imovelArea > 0 && (
                    <SummaryRow label="Área" value={`${imovelArea}m²`} />
                  )}
                  {bemCredit.goodType === "imovel" && imovelCidade && (
                    <SummaryRow label="Cidade" value={`${imovelCidade}/${imovelEstado}`} />
                  )}
                  <hr className="opacity-100" />
                  <div className="d-flex justify-content-between mt10">
                    <span className="fz15 fw600 dark-color">Preço de Venda</span>
                    <span className="fw700 fz17 text-thm2">{formatCurrency(bemPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Revisar e publicar */}
          {bemStep === 4 && bemCredit && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                <div className="ps-widget bgc-white bdrs12 p30 mb30">
                  <h4 className="mb25">Revise seu anúncio do bem</h4>

                  <div className="bdr1 bdrs12 p20 mb20">
                    <div className="d-flex align-items-center mb15">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle me-3"
                        style={{ width: 48, height: 48, flexShrink: 0, backgroundColor: "rgba(13,110,253,0.1)" }}
                      >
                        <i className={`fal ${bemCredit.goodType === "imovel" ? "fa-home" : bemCredit.goodType === "veiculo" ? "fa-car" : "fa-tools"} fz18`} style={{ color: "#0d6efd" }} />
                      </div>
                      <div>
                        <h5 className="mb-0">{bemTitle}</h5>
                        <span className="fz13 body-color">{bemCredit.goodTypeLabel} · via consórcio {bemCredit.groupCode}</span>
                      </div>
                    </div>

                    {/* Veículo recap */}
                    {bemCredit.goodType === "veiculo" && veiculoMarca && (
                      <div className="row mb15">
                        {[
                          { l: "Marca/Modelo", v: `${veiculoMarca} ${veiculoModelo}` },
                          { l: "Ano", v: veiculoAno },
                          { l: "Km", v: `${veiculoKm.toLocaleString("pt-BR")} km` },
                          { l: "Cor", v: veiculoCor },
                          { l: "Câmbio", v: veiculoCambio === "automatico" ? "Automático" : "Manual" },
                          { l: "Combustível", v: veiculoCombustivel.length > 0 ? veiculoCombustivel.map((v) => veiculoCombustivelList.find((o) => o.value === v)?.label ?? v).join(" · ") : "—" },
                          { l: "Situação", v: { novo: "Novo", seminovo: "Seminovo", usado: "Usado", reformado: "Reformado", recem_licenciado: "Recém-licenciado" }[veiculoSituacao] ?? veiculoSituacao },
                        ].map((item) => (
                          <div key={item.l} className="col-6 col-md-4 mb10">
                            <p className="fz11 body-light-color mb-1">{item.l}</p>
                            <p className="fw500 fz13 mb-0">{item.v}</p>
                          </div>
                        ))}
                        {veiculoOpcionais.length > 0 && (
                          <div className="col-12 mb10">
                            <p className="fz11 body-light-color mb-1">Opcionais</p>
                            <p className="fw500 fz13 mb-0">
                              {veiculoOpcionais.map((v) => veiculoOpcionaisList.find((o) => o.value === v)?.label ?? v).join(" · ")}
                            </p>
                          </div>
                        )}
                        {veiculoExtras.trim() && (
                          <div className="col-12 mb10">
                            <p className="fz11 body-light-color mb-1">Extras</p>
                            <p className="fw500 fz13 mb-0">{veiculoExtras.trim()}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Imóvel recap */}
                    {bemCredit.goodType === "imovel" && (imovelArea > 0 || imovelCidade || imovelBairro) && (
                      <div className="row mb15">
                        {[
                          { l: "Tipo", v: imovelTipo.charAt(0).toUpperCase() + imovelTipo.slice(1) },
                          ...(imovelArea > 0 ? [{ l: "Área", v: `${imovelArea}m²` }] : []),
                          ...(imovelTipo !== "terreno" ? [
                            { l: "Dormitórios", v: imovelDorm },
                            { l: "Banheiros", v: imovelBanheiros },
                            { l: "Vagas", v: imovelVagas },
                          ] : []),
                          ...(imovelCidade || imovelEstado ? [{ l: "Cidade/UF", v: [imovelCidade, imovelEstado].filter(Boolean).join("/") || "—" }] : []),
                          ...(imovelBairro ? [{ l: "Bairro", v: imovelBairro }] : []),
                          ...(imovelLogradouro || imovelNumero ? [{ l: "Endereço", v: [imovelLogradouro, imovelNumero].filter(Boolean).join(", ") || "—" }] : []),
                          ...(imovelCond || imovelIptu || imovelOutrosCustos ? [{
                            l: "Custos/mês",
                            v: [imovelCond && `Cond. ${formatCurrency(Number(imovelCond))}`, imovelIptu && `IPTU ${formatCurrency(Number(imovelIptu))}`, imovelOutrosCustos && `Outros ${formatCurrency(Number(imovelOutrosCustos))}`].filter(Boolean).join(" · ") || "—",
                          }] : []),
                        ].map((item) => (
                          <div key={item.l} className="col-6 col-md-4 mb10">
                            <p className="fz11 body-light-color mb-1">{item.l}</p>
                            <p className="fw500 fz13 mb-0">{item.v}</p>
                          </div>
                        ))}
                        {imovelComodidades.length > 0 && (
                          <div className="col-12 mb10">
                            <p className="fz11 body-light-color mb-1">Comodidades</p>
                            <p className="fw500 fz13 mb-0">
                              {imovelComodidades.map((v) => imovelComodidadesList.find((o) => o.value === v)?.label ?? v).join(" · ")}
                            </p>
                          </div>
                        )}
                        {imovelDiferenciais.trim() && (
                          <div className="col-12 mb10">
                            <p className="fz11 body-light-color mb-1">Diferenciais</p>
                            <p className="fw500 fz13 mb-0">{imovelDiferenciais.trim()}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <hr className="opacity-100" />

                    <div className="row mt15">
                      <div className="col-md-6">
                        <SummaryRow label="Preço de venda" value={<strong className="text-thm2">{formatCurrency(bemPrice)}</strong>} />
                        <SummaryRow label="Contra-proposta" value={bemAcceptsCounterOffer ? "Sim" : "Não"} />
                        <SummaryRow label="Financiamento/parcelas" value={bemAcceptsFinancing ? "Sim" : "Não"} />
                        <SummaryRow label="Crédito utilizado" value={formatCurrency(bemCredit.creditReleasedValue ?? bemCredit.creditValue)} />
                      </div>
                      <div className="col-md-6">
                        <p className="fz12 body-light-color mb-1">Descrição</p>
                        <p className="fz13 body-color">{bemDesc || "Nenhuma descrição."}</p>
                      </div>
                    </div>
                  </div>

                  <InfoNote>
                    O anúncio será publicado na seção de bens do marketplace. Compradores podem entrar em contato diretamente.
                    Gerencie em{" "}
                    <Link href="/cotista/anuncios" className="text-thm">Meus Anúncios</Link>.
                  </InfoNote>

                  <div className="d-flex justify-content-between">
                    <button className="ud-btn btn-thm-border bdrs12" onClick={() => setBemStep(3)}>
                      <i className="fal fa-arrow-left-long me-2" /> Voltar
                    </button>
                    <button className="ud-btn btn-thm bdrs12" onClick={handlePublish}>
                      <i className="fas fa-megaphone me-2" /> Publicar anúncio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="p15 bdrs8 mb20" style={{ backgroundColor: "rgba(91,187,123,0.08)" }}>
      <p className="fz13 mb-0">
        <i className="fas fa-info-circle me-1" style={{ color: "#5bbb7b" }} />
        {children}
      </p>
    </div>
  );
}
