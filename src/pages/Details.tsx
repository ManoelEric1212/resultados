import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import api from "../service/api";

export interface BemItem {
  codBem?: string;
  descricao?: string;
  endereco?: string;
  local?: string;
}

export interface ConferenciaResponse {
  id: string;
  titulo: string;
  ambiente: string;
  totalBens: number;
  totalVerificados: number;
  totalFaltantes: number;
  totalFora: number;
  totalExtras: number;
  bensVerificados: BemItem[];
  bensFaltantes: BemItem[];
  bensExtras: BemItem[];
  foraAgrupados: Record<string, BemItem[]>;
}

const fetchConferencia = async (id: string) => {
  const response = await api.get(`/conferencias/${id}/busca/finalizado`);
  return response.data.conferencia as ConferenciaResponse;
};

const StatCard: React.FC<{
  label: string;
  value: number | string;
  colorClass?: string;
}> = ({ label, value, colorClass = "text-gray-900" }) => (
  <div className="w-full sm:w-1/2 lg:w-1/5 p-2">
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm flex flex-col items-center">
      <div className={`text-xl font-semibold ${colorClass}`}>{value}</div>
      <div className="text-sm text-gray-500 text-center mt-1">{label}</div>
    </div>
  </div>
);

const ConferenciaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<ConferenciaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showVerificados, setShowVerificados] = useState(false);
  const [showFaltantes, setShowFaltantes] = useState(false);
  const [showFora, setShowFora] = useState(false);
  const [showExtra, setShowExtra] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchConferencia(id)
      .then((d) => setData(d))
      .catch((e) => setError(e.message || "Erro desconhecido"))
      .finally(() => setLoading(false));
  }, [id]);

  const percentual = useMemo(() => {
    if (!data) return "0";
    return data.totalBens > 0
      ? ((data.totalVerificados / data.totalBens) * 100).toFixed(1)
      : "0";
  }, [data]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: "Verificados", value: data.totalVerificados, color: "#28a745" },
      { name: "Faltantes", value: data.totalFaltantes, color: "#d31714" },
      { name: "Fora", value: data.totalFora, color: "#ebb160" },
      { name: "Extras", value: data.totalExtras, color: "#577ac1" },
    ];
  }, [data]);

  if (!id) return <div className="p-6">ID da conferência não encontrado na URL.</div>;

  return (
    <div className="p-2 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Detalhes da Conferência</h1>
          <p className="text-lg text-gray-500">Local: {data?.ambiente}</p>
        </div>
        <div className="text-center">
          <div className="text-lg font-extrabold text-blue-700">{percentual}%</div>
          <div className="text-sm text-gray-500">da conferência concluída</div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-4">
        {loading && <div className="text-gray-500">Carregando...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {!loading && !error && data && (
          <>
            <div className="w-full h-76">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 19, right: 16, left: 0, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} domain={[0, 'dataMax + 5']} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="value" position="top" style={{ fontSize: 19, fontWeight: 600, fill: "#333" }} />
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap -mx-2">
              <StatCard label="Total de Bens" value={data.totalBens} />
              <StatCard label="Verificados" value={data.totalVerificados} colorClass="text-green-600" />
              <StatCard label="Faltantes" value={data.totalFaltantes} colorClass="text-yellow-600" />
              <StatCard label="Fora do Local" value={data.totalFora} colorClass="text-red-600" />
              <StatCard label="Extras (Sem patrimônio)" value={data.totalExtras} colorClass="text-indigo-600" />
            </div>

            <div className="mt-4 space-y-3">
              {/* Seletor de botões */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setShowVerificados((s) => !s);
                    setShowFaltantes(false);
                    setShowFora(false);
                    setShowExtra(false);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold hover:cursor-pointer text-white transition ${showVerificados ? "bg-[#004C8A] text-white" : "bg-[#005CAA] hover:bg-[#004C8A] active:bg-[#003C70] text-white"
                    }`}
                >
                  {showVerificados ? "Ocultar Verificados" : "Ver Itens Verificados"}
                </button>

                <button
                  onClick={() => {
                    setShowFaltantes((s) => !s);
                    setShowVerificados(false);
                    setShowFora(false);
                    setShowExtra(false);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold hover:cursor-pointer text-white transition ${showFaltantes ? "bg-[#004C8A] text-white" : "bg-[#005CAA] hover:bg-[#004C8A] active:bg-[#003C70] text-white"
                    }`}
                >
                  {showFaltantes ? "Ocultar Faltantes" : "Ver Itens Faltantes"}
                </button>

                <button
                  onClick={() => {
                    setShowFora((s) => !s);
                    setShowFaltantes(false);
                    setShowVerificados(false);
                    setShowExtra(false);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold hover:cursor-pointer text-white transition ${showFora ? "bg-[#004C8A] text-white" : "bg-[#005CAA] hover:bg-[#004C8A] active:bg-[#003C70] text-white"
                    }`}
                >
                  {showFora ? "Ocultar Itens Fora" : "Ver Itens Fora"}
                </button>

                <button
                  onClick={() => {
                    setShowExtra((s) => !s);
                    setShowVerificados(false);
                    setShowFaltantes(false);
                    setShowFora(false);
                  }}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold hover:cursor-pointer text-white transition ${showExtra ? "bg-[#004C8A] text-white" : "bg-[#005CAA] hover:bg-[#004C8A] active:bg-[#003C70] text-white"
                    }`}
                >
                  {showExtra ? "Ocultar Extras" : "Ver Itens Extras"}
                </button>
              </div>

              {/* Grid fixo com scroll */}
              <div className="mt-4 bg-gray-50 p-4 rounded-lg h-72 overflow-y-auto shadow-inner">
                {showVerificados && (
                  <>
                    <h3 className="font-bold text-lg">✔️ Bens Verificados</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {data.bensVerificados.length === 0 ? (
                        <div className="text-sm italic text-gray-500 col-span-full">
                          Nenhum item verificado
                        </div>
                      ) : (
                        data.bensVerificados.map((i) => (
                          <div
                            key={i.codBem}
                            className="text-sm text-gray-700 border border-gray-200 rounded p-2 bg-white shadow-sm"
                          >
                            <strong>{i.codBem}</strong> - {i.descricao}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {showFaltantes && (
                  <>
                    <h3 className="font-bold text-lg">❌ Bens Faltantes</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {data.bensFaltantes.length === 0 ? (
                        <div className="text-sm italic text-gray-500 col-span-full">
                          Nenhum item faltante
                        </div>
                      ) : (
                        data.bensFaltantes.map((i) => (
                          <div
                            key={i.codBem}
                            className="text-sm text-gray-700 border border-gray-200 rounded p-2 bg-white shadow-sm"
                          >
                            <strong>{i.codBem}</strong> - {i.descricao}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                {showFora && (
                  <>
                    <h3 className="font-bold text-lg">⚠️ Itens Fora do Local</h3>
                    <div className="mt-2 space-y-3">
                      {Object.entries(data.foraAgrupados).map(([ambiente, itens]) => (
                        <div key={ambiente}>
                          <div className="font-semibold text-blue-700 mb-1">
                            {ambiente} ({itens.length})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {itens.map((i) => (
                              <div
                                key={i.codBem}
                                className="text-sm text-gray-700 border border-gray-200 rounded p-2 bg-white shadow-sm"
                              >
                                <strong>{i.codBem}</strong> - {i.descricao}
                                <div className="text-xs text-gray-500 mt-1">
                                  (Local real: {i.endereco} - {i.local})
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {showExtra && (
                  <>
                    <h3 className="font-bold text-lg">🟦 Bens Extras (Sem Patrimônio)</h3>
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {data.bensExtras.length === 0 ? (
                        <div className="text-sm italic text-gray-500 col-span-full">
                          Nenhum item extra
                        </div>
                      ) : (
                        data.bensExtras.map((i, idx) => (
                          <div
                            key={`${i.codBem ?? "extra"}-${idx}`}
                            className="text-sm text-gray-700 border border-gray-200 rounded p-2 bg-white shadow-sm"
                          >
                            {i.descricao}
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

          </>
        )}

        {!loading && !error && !data && (
          <div className="text-gray-500">Nenhum dado disponível para essa conferência.</div>
        )}
      </div>
    </div>
  );
};

export default ConferenciaDetalhes;