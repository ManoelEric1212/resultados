
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Resultados from "./pages/Results";
import ConferenciaDetalhes from "./pages/Details";
import { ToastContainer } from 'react-toastify';
import logosenai from "./assets/logo_senaiii.png"
import ResumoFeedback from "./pages/FeedBack";


function App() {
  return (
    <BrowserRouter basename="/admin/resultados">
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white">
        <header className="bg-[#005CAA] shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img
                src={logosenai}
                className="h-10 w-32 sm:h-15 sm:w-60"
                alt="Logo"
              />
            </div>

            <h1 className="hidden sm:block text-xl font-bold text-white">
              Resultados - App patrimônio
            </h1>

            <nav className="flex gap-3 sm:gap-4 text-sm sm:text-base">
              <Link to="/" className="text-white hover:text-gray-300 transition">
                Início
              </Link>
              <Link to="/feedback" className="text-white hover:text-gray-300 transition">
                Considerações
              </Link>
            </nav>
          </div>
        </header>



        <main className="max-w-7xl mx-auto px-6 py-2">
          <Routes>
            <Route path="/" element={<Resultados />} />
            <Route path="/conferencia/:id" element={<ConferenciaDetalhes />} />
            <Route path="/feedback" element={<ResumoFeedback />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
