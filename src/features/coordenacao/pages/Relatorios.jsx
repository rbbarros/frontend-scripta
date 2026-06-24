import React, { useState } from 'react';
import { Folder, BarChart2, Filter, FileText, Search, Download } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

const Relatorios = () => {
  const [reportType, setReportType] = useState('projetos');
  const [exportFormat, setExportFormat] = useState('PDF');
  
  const [filters, setFilters] = useState({
    curso: '',
    turma: '',
    semestre: '',
    periodo: '',
    status: '',
    professor: '',
    search: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      // Fetch reports using apiRequest
      const response = await apiRequest('/relatorios/projetos', {
        method: 'GET',
        params: {
          ...filters,
          type: reportType,
          format: exportFormat.toLowerCase()
        }
      });
      
      console.log('Report generated successfully:', response);
      alert(`${exportFormat} gerado com sucesso!`);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Erro ao gerar o relatório.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-gray-800">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Relatórios</h1>

      {/* Tipo de Relatório */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Tipo de Relatório
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            onClick={() => setReportType('projetos')}
            className={`cursor-pointer p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-3 bg-white
              ${reportType === 'projetos' ? 'border-[#f19f17] shadow-md' : 'border-gray-200 hover:border-amber-300'}`}
          >
            <Folder className={`w-10 h-10 ${reportType === 'projetos' ? 'text-[#f19f17]' : 'text-gray-400'}`} />
            <h3 className="font-bold text-lg">Relatório de Projetos</h3>
            <p className="text-sm text-gray-500 text-center">
              Acompanhamento de projetos integradores, status e entregas.
            </p>
          </div>

          <div 
            onClick={() => setReportType('academico')}
            className={`cursor-pointer p-6 rounded-lg border-2 transition-all flex flex-col items-center justify-center gap-3 bg-white
              ${reportType === 'academico' ? 'border-[#f19f17] shadow-md' : 'border-gray-200 hover:border-amber-300'}`}
          >
            <BarChart2 className={`w-10 h-10 ${reportType === 'academico' ? 'text-[#f19f17]' : 'text-gray-400'}`} />
            <h3 className="font-bold text-lg">Relatório Acadêmico</h3>
            <p className="text-sm text-gray-500 text-center">
              Desempenho de turmas, notas e estatísticas acadêmicas.
            </p>
          </div>
        </div>
      </section>

      {/* Configurar Relatório */}
      <section className="mb-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Configurar Relatório
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Curso</label>
            <select name="curso" value={filters.curso} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#f19f17] focus:outline-none">
              <option value="">Todos os Cursos</option>
              <option value="engenharia">Engenharia</option>
              <option value="computacao">Ciência da Computação</option>
              <option value="design">Design</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Turma</label>
            <select name="turma" value={filters.turma} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#f19f17] focus:outline-none">
              <option value="">Todas as Turmas</option>
              <option value="t1">Turma 1</option>
              <option value="t2">Turma 2</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Semestre</label>
            <select name="semestre" value={filters.semestre} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#f19f17] focus:outline-none">
              <option value="">Todos os Semestres</option>
              <option value="1">1º Semestre</option>
              <option value="2">2º Semestre</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Período</label>
            <select name="periodo" value={filters.periodo} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#f19f17] focus:outline-none">
              <option value="">Todos os Períodos</option>
              <option value="matutino">Matutino</option>
              <option value="vespertino">Vespertino</option>
              <option value="noturno">Noturno</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Status</label>
            <select name="status" value={filters.status} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#f19f17] focus:outline-none">
              <option value="">Todos os Status</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="atrasado">Atrasado</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Professor</label>
            <select name="professor" value={filters.professor} onChange={handleFilterChange} className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#f19f17] focus:outline-none">
              <option value="">Todos os Professores</option>
              <option value="prof1">Prof. João</option>
              <option value="prof2">Prof. Maria</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-600">Buscar</label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Buscar por título do projeto..." 
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:ring-2 focus:ring-[#f19f17] focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Formato de exportação */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Formato de exportação</h2>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="exportFormat" 
              value="PDF" 
              checked={exportFormat === 'PDF'} 
              onChange={() => setExportFormat('PDF')}
              className="w-4 h-4 text-[#f19f17] focus:ring-[#f19f17]"
            />
            <span className="font-medium text-gray-700">PDF</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="radio" 
              name="exportFormat" 
              value="Excel" 
              checked={exportFormat === 'Excel'} 
              onChange={() => setExportFormat('Excel')}
              className="w-4 h-4 text-[#f19f17] focus:ring-[#f19f17]"
            />
            <span className="font-medium text-gray-700">Excel</span>
          </label>
        </div>
      </section>

      {/* Ações */}
      <div className="flex justify-end">
        <button 
          onClick={handleGenerateReport}
          disabled={isLoading}
          className="bg-[#f19f17] hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Download className="w-5 h-5" />
          {isLoading ? 'Gerando...' : `Gerar e Baixar ${exportFormat}`}
        </button>
      </div>
    </div>
  );
};

export default Relatorios;
