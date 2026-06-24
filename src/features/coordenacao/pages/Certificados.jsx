import React, { useState, useEffect } from 'react';
import { Search, Plus, Eye, Download } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

export default function Certificados() {
  const [certificados, setCertificados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificados();
  }, []);

  const fetchCertificados = async () => {
    try {
      setLoading(true);
      const data = await apiRequest('/certificados/emitidos');
      // Handle either array response or { data: [...] } structure
      setCertificados(Array.isArray(data) ? data : (data?.data || []));
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar certificados.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificados = certificados.filter(cert => {
    const term = searchTerm.toLowerCase();
    const alunoMatch = cert.aluno?.toLowerCase().includes(term);
    const projetoMatch = cert.projeto?.toLowerCase().includes(term);
    return alunoMatch || projetoMatch;
  });

  const getConceitoBadge = (conceito) => {
    const label = conceito || 'N/A';
    const normalized = label.toLowerCase();
    
    if (normalized === 'excelente') {
      return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 border border-green-200 backdrop-blur-sm">Excelente</span>;
    }
    if (normalized === 'ótimo' || normalized === 'otimo') {
      return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200 backdrop-blur-sm">Ótimo</span>;
    }
    if (normalized === 'bom') {
      return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200 backdrop-blur-sm">Bom</span>;
    }
    if (normalized === 'regular') {
      return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200 backdrop-blur-sm">Regular</span>;
    }
    
    return <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 border border-gray-200 backdrop-blur-sm">{label}</span>;
  };

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 font-sans">
      {/* Top Bar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Certificados</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          {/* Search Input Container */}
          <div className="relative w-full sm:w-80 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#f19f17] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Buscar por aluno ou projeto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-white/40 rounded-xl bg-white/60 backdrop-blur-md shadow-sm focus:ring-2 focus:ring-[#f19f17]/50 focus:border-[#f19f17] sm:text-sm transition-all text-gray-700 outline-none placeholder:text-gray-400 hover:bg-white/80"
            />
          </div>

          {/* Emit Certificate Button */}
          <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-[#f19f17] hover:bg-[#d98b14] text-white font-semibold rounded-xl shadow-lg shadow-[#f19f17]/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0">
            <Plus className="h-5 w-5" />
            <span>Emitir Certificado</span>
          </button>
        </div>
      </div>

      {/* Main Content Area - Glassmorphism Table */}
      <div className="bg-white/70 backdrop-blur-xl border border-white shadow-2xl rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
        
        <div className="px-6 py-5 border-b border-gray-100/80 bg-white/40 relative z-10">
          <h2 className="text-xl font-semibold text-gray-800">Certificados Emitidos</h2>
        </div>
        
        <div className="overflow-x-auto relative z-10">
          <table className="min-w-full divide-y divide-gray-200/60">
            <thead className="bg-gray-50/50 backdrop-blur-md">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aluno</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Projeto</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Curso</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Emissão</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Conceito</th>
                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col justify-center items-center gap-3">
                      <div className="w-8 h-8 border-4 border-[#f19f17]/30 border-t-[#f19f17] rounded-full animate-spin"></div>
                      <span className="text-sm font-medium">Carregando certificados...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-100">
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCertificados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="h-8 w-8 text-gray-300" />
                      <span className="text-gray-500 font-medium">Nenhum certificado encontrado.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCertificados.map((cert, index) => (
                  <tr key={cert.id || index} className="hover:bg-white/60 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">{cert.aluno}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{cert.projeto}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cert.curso}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {cert.dataEmissao ? new Date(cert.dataEmissao).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getConceitoBadge(cert.conceito)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex items-center justify-center gap-4">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors hover:scale-110 transform" title="Visualizar Certificado">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button className="text-gray-400 hover:text-[#f19f17] transition-colors hover:scale-110 transform" title="Download em PDF">
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
