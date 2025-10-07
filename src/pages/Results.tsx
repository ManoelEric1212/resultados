import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ComposedChart,
  CartesianGrid,
  Line,
} from "recharts";
import { Home } from "lucide-react";
import { buscaConferencias, type getConferenciaProps } from "../service/Conferencias/conferenciaService";
import { toast } from "react-toastify";
import GlobalLoading from "../components/Loading";



const Resultados: React.FC = () => {
  const [selecionadas, setSelecionadas] = useState<string[]>([]);
  const [conferencias2, setConferencias] = useState<getConferenciaProps[]>([])
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const [isMobile, setIsMobile] = useState(false);

  const toggleSelecionada = (id: string) => {
    setSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const selecionadasData = conferencias2.filter((c) =>
    selecionadas.includes(c.id)
  );

  const dados = [
    { ambiente: "BIBLIOTECA", Manual: 18.1, Aplicativo: 16.12 },
    { ambiente: "ADMINISTRATIVO/FINANCEIRO", Manual: 32.8, Aplicativo: 13.28 },
    { ambiente: "OFICINA ELETRICA", Manual: 45, Aplicativo: 29 },
  ];

  const tempoData = selecionadasData.map((amb) => {
    const d = dados.find((item) => item.ambiente === amb.ambiente);
    if (!d) return { conferencia: amb, Manual: 0, Aplicativo: 0, Reducao: 0 };

    return {
      conferencia: amb.ambiente,
      Manual: d.Manual,
      Aplicativo: d.Aplicativo,
      Reducao: d.Manual - d.Aplicativo,
    };
  });

  const buscaTodasConferencias = async () => {
    setLoading(true)
    try {
      const id = 'f610517a-075c-464c-8349-4abcd1bf9035'
      const data = await buscaConferencias(id);
      const filtroConferenciasFinalizada = data.filter((i) => i.status == 'FINALIZADA')
      toast.success('Conferências buscadas');
      setConferencias(filtroConferenciasFinalizada);
      setSelecionadas(filtroConferenciasFinalizada.map((c) => c.id));

    } catch (error) {
      toast.error('Erro ao buscar conferência')
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize(); // define valor inicial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    buscaTodasConferencias()
  }, [])


  return (
    <div className="p-2 space-y-4">
      <h1 className="text-2xl font-bold">Conferências Realizadas</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {conferencias2.length && conferencias2.map((conf) => (
          <div
            key={conf.id}
            className="bg-white border-amber-50 rounded-lg shadow-lg p-4 flex flex-col gap-3 hover:shadow-xl transition"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={selecionadas.includes(conf.id)}
                onChange={() => toggleSelecionada(conf.id)}
                className="w-5 h-5 accent-[#005CAA]"
              />
              <div className="p-3 bg-gray-100 rounded-full">
                <Home className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                {/* Ajuste de fonte e quebra de linha */}
                <h2 className="text-base sm:text-lg font-semibold break-words truncate">
                  {conf.ambiente}
                </h2>
                <p className="text-sm text-gray-500 break-words truncate">
                  Código: {conf.endereco}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/conferencia/${conf.id}`)}
              className="mt-auto px-3 py-1 bg-[#005CAA] text-white rounded hover:bg-blue-700 transition"
            >
              Ver detalhes
            </button>
          </div>
        ))}
      </div>

      <div className="bg-white border-amber-50 rounded-lg shadow-lg p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Comparativo de Tempo (min)</h2>

        {tempoData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450} >
            <ComposedChart
              data={tempoData}
              margin={{ top: 20, right: -20, left: -30, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="conferencia"
                interval={0} // mostra todos os rótulos
                tick={({ x, y, payload }) => {
                  const text = payload.value.length > 12 ? payload.value.slice(0, 12) + "…" : payload.value;
                  return (
                    <text
                      x={x}
                      y={y + 15}
                      textAnchor="end"
                      transform={`rotate(-45, ${x}, ${y + 15})`}
                      fill="#333"
                      fontSize={12}
                    >
                      {text}
                    </text>
                  );
                }}
              />
              <YAxis />
              <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
              <Tooltip />
              <Legend
                verticalAlign="top"
                align="center"
                wrapperStyle={{ marginTop: -10, marginBottom: 30 }}
              />

              <Bar dataKey="Aplicativo" fill="#60a5fa">
                <LabelList dataKey="Aplicativo" position="top" />
              </Bar>
              <Bar dataKey="Manual" fill="#1e3a8a">
                <LabelList dataKey="Manual" position="top" />
              </Bar>

              <Line
                type="monotone"
                dataKey="Reducao"
                stroke="#ef4444"
                yAxisId="right"
                name="Redução de Tempo"
                strokeWidth={2}
              >
                {!isMobile && (
                  <LabelList
                    dataKey="Reducao"
                    position="bottom"
                    fill="#ef4444"
                    formatter={(value) =>
                      typeof value === "number" ? value.toFixed(1) : String(value)
                    }
                  />
                )}
              </Line>
            </ComposedChart>
          </ResponsiveContainer>
          // </div>
        ) : (
          <p className="text-gray-500">Selecione uma conferência acima</p>
        )}
      </div>

      <GlobalLoading isLoading={loading} />
    </div>
  );
};

export default Resultados;
