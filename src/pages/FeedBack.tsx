import React from "react";

const melhorias = [
  {
    id: 1,
    titulo: "Tratamento de casos com termo de cautela ou termo individual",
    descricao:
      "Definir como o app deve lidar com notebooks sob termo de cautela ou individual, evitando inconsistências nas conferências.",
  },
  {
    id: 2,
    titulo: "Itens fora do local",
    descricao:
      "Permitir registrar observações de regularização para itens fora do ambiente (ex: transferido ou devolvido).",
  },
  {
    id: 3,
    titulo: "Confirmação ao finalizar",
    descricao:
      "Adicionar mensagem de confirmação ('Deseja realmente finalizar?') para evitar finalizações acidentais.",
  },
  {
    id: 4,
    titulo: "Formatos de relatório",
    descricao:
      "Disponibilizar exportação de relatórios em formato Excel, facilitando a análise e compilação dos dados.",
  },
  {
    id: 5,
    titulo: "Etiquetas rasuradas",
    descricao:
      "Inserir campo de observação para itens com etiquetas danificadas, permitindo registrar substituições.",
  },
];

const resumoDepoimento = [
  "Aplicativo ágil na coleta de informações, trazendo praticidade e eficiência.",
  "Melhora significativa no tempo de execução das atividades.",
  "Conferências mais rápidas e precisas em comparação ao método convencional.",
  "Maior consistência e dinamismo no processo.",
  "Economia de tempo e melhoria na qualidade dos resultados."
];

const ResumoFeedback: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-2 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#005CAA] mb-6 text-center">
          Resumo de Feedback do Usuário
        </h1>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Observações do Uso
          </h2>
          <div className="bg-blue-50 border border-blue-100 text-gray-700 p-4 rounded-lg">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {resumoDepoimento.map((item, index) => (
                <li key={index} className="leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Seção de melhorias */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Pontos de Melhoria Identificados
          </h2>

          {/* Tabela responsiva */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-[#005CAA] text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-sm sm:text-base">#</th>
                  <th className="py-3 px-4 text-left text-sm sm:text-base">Melhoria</th>
                  <th className="py-3 px-4 text-left text-sm sm:text-base">Descrição</th>
                </tr>
              </thead>
              <tbody>
                {melhorias.map((m) => (
                  <tr
                    key={m.id}
                    className="border-t border-gray-200 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-700">{m.id}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">{m.titulo}</td>
                    <td className="py-3 px-4 text-gray-600">{m.descricao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 text-sm text-gray-600 italic text-center">
            Feedbacks coletados e revisados em conjunto com a equipe de desenvolvimento —{" "}
            <span className="font-semibold text-[#005CAA]">@Manoel Eric</span> e{" "}
            <span className="font-semibold text-[#005CAA]">@Lucilani Filho</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumoFeedback;
