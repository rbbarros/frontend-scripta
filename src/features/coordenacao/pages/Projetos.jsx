import React, { useState } from 'react';
import { useCoordenacaoProjetos } from '../hooks/useCoordenacaoProjetos';
import { 
  Folder, FileText, X, Plus, Users, Search, Download, Calendar, Clock, 
  CheckCircle, FileIcon, Archive, Image as ImageIcon, Eye, Edit2, Trash2, Filter, BookOpen, Tag
} from 'lucide-react';

export default function Projetos() {
  const { projetos, loading, error } = useCoordenacaoProjetos();

  // Modals state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // Edit state
  const [editForm, setEditForm] = useState({
    integrantes: [],
    arquivos: [],
    novoIntegrante: ''
  });

  const openDetails = (projeto) => {
    setSelectedProject(projeto);
    setIsDetailsOpen(true);
  };

  const closeDetails = () => {
    setIsDetailsOpen(false);
    setSelectedProject(null);
  };

  const openEdit = (projeto) => {
    setSelectedProject(projeto);
    setEditForm({
      integrantes: projeto.integrantes || [],
      arquivos: projeto.arquivos || [],
      novoIntegrante: ''
    });
    setIsDetailsOpen(false);
    setIsEditOpen(true);
  };

  const closeEdit = () => {
    setIsEditOpen(false);
    setSelectedProject(null);
  };

  const handleRemoveIntegrante = (index) => {
    const newIntegrantes = [...editForm.integrantes];
    newIntegrantes.splice(index, 1);
    setEditForm({ ...editForm, integrantes: newIntegrantes });
  };

  const handleAddIntegrante = () => {
    if (editForm.novoIntegrante.trim()) {
      setEditForm({
        ...editForm,
        integrantes: [...editForm.integrantes, { nome: editForm.novoIntegrante.trim(), papel: 'Membro' }],
        novoIntegrante: ''
      });
    }
  };

  const handleRemoveArquivo = (index) => {
    const newArquivos = [...editForm.arquivos];
    newArquivos.splice(index, 1);
    setEditForm({ ...editForm, arquivos: newArquivos });
  };

  const getFileIcon = (fileName) => {
    if (!fileName) return <FileText className="w-5 h-5 text-gray-500" />;
    const ext = fileName.split('.').pop().toLowerCase();
    switch (ext) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'pptx':
      case 'ppt': return <FileText className="w-5 h-5 text-orange-500" />;
      case 'zip':
      case 'rar': return <Archive className="w-5 h-5 text-purple-600" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getBadgeClass = (status) => {
    if (status === 'Aprovado') return 'bg-emerald-100 text-emerald-700';
    if (status === 'Pendente') return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Projetos</h1>
        <p className="text-gray-500">Administre todos os projetos integradores da plataforma</p>
      </div>

      {/* Filtros */}
      <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex items-center text-[#f19f17] font-semibold mb-4">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          {['Curso', 'Turma', 'Semestre', 'Período', 'Status'].map(label => (
            <div key={label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <select className="w-full border border-gray-200 rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]">
                <option>Todos</option>
              </select>
            </div>
          ))}
        </div>
        
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por título..." 
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]"
          />
        </div>
      </div>

      <div className="mb-4">
        <h2 className="font-bold text-gray-900">Projetos ({projetos.length})</h2>
      </div>

      {/* Lista de Projetos */}
      <div className="space-y-4">
        {projetos.map((projeto, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between hover:border-orange-200 transition-colors">
            
            <div className="flex items-start flex-1">
              <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl mr-4 mt-1">
                <Folder className="w-6 h-6 text-[#f19f17]" fill="#fdf6e3" />
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 text-base">{projeto.titulo}</h3>
                <p className="text-xs text-gray-500 mt-0.5 mb-2">
                  {projeto.curso} - {projeto.turma} - {projeto.semestre}
                </p>
                <div className="flex items-center text-xs text-gray-400 gap-4">
                  <span className="flex items-center"><FileText className="w-3.5 h-3.5 mr-1" /> {projeto.arquivos?.length || 0} arquivos</span>
                  <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1" /> {projeto.integrantes?.length || 0} integrantes</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getBadgeClass(projeto.status)}`}>
                {projeto.status || 'Pendente'}
              </span>
              
              <div className="flex items-center gap-1 border-l border-gray-100 pl-4">
                <button onClick={() => openDetails(projeto)} className="p-2 text-[#f19f17] hover:bg-orange-50 rounded-lg transition-colors" title="Visualizar detalhes">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => openEdit(projeto)} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors" title="Editar projeto">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETALHES */}
      {isDetailsOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 relative">
              <button onClick={closeDetails} className="absolute right-6 top-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <div className="flex justify-between items-start pr-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedProject.titulo}</h2>
                  <p className="text-xs text-gray-500">
                    {selectedProject.curso} • {selectedProject.turma} • {selectedProject.semestre} • {selectedProject.periodo || 'Matutino'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getBadgeClass(selectedProject.status)}`}>
                  {selectedProject.status || 'Pendente'}
                </span>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">DESCRIÇÃO</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedProject.descricao || 'Sem descrição detalhada.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="flex items-center text-gray-400 mb-1 text-xs">
                    <BookOpen className="w-3.5 h-3.5 mr-1 text-[#f19f17]" /> Professor focal
                  </div>
                  <span className="font-semibold text-gray-800">{selectedProject.professor || 'Não atribuído'}</span>
                </div>
                <div>
                  <div className="flex items-center text-gray-400 mb-1 text-xs">
                    <Tag className="w-3.5 h-3.5 mr-1 text-[#f19f17]" /> Área de conhecimento
                  </div>
                  <span className="font-semibold text-gray-800">{selectedProject.area || 'Não definida'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" /> INTEGRANTES
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.integrantes?.map((int, i) => (
                    <div key={i} className="flex items-center bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5 text-xs text-gray-700 font-medium">
                      <Users className="w-3 h-3 mr-1.5 text-gray-400" />
                      {int.nome || 'Integrante'}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Folder className="w-4 h-4 mr-2" /> ARQUIVOS ENVIADOS
                </h4>
                <div className="space-y-2">
                  {selectedProject.arquivos?.map((arq, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center">
                        {getFileIcon(arq.nome)}
                        <span className="ml-3 text-sm font-medium text-gray-700">{arq.nome || 'Arquivo sem nome'}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{arq.nome?.split('.').pop() || 'FILE'}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" /> HISTÓRICO DE VERSÕES
                </h4>
                <div className="space-y-3">
                  {selectedProject.historico?.map((hist, i) => (
                    <div key={i} className="flex items-start text-sm">
                      <span className="font-bold text-[#f19f17] w-12">{hist.versao}</span>
                      <span className="text-gray-400 w-24">{hist.data}</span>
                      <span className="text-gray-700">{hist.nota}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0">
              <button onClick={() => { closeDetails(); openEdit(selectedProject); }} className="px-5 py-2.5 rounded-xl font-semibold text-sm border-2 border-[#f19f17] text-[#f19f17] hover:bg-orange-50 transition-colors">
                Editar projeto
              </button>
              <button onClick={closeDetails} className="bg-[#f19f17] hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-orange-200">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EDITAR */}
      {isEditOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 relative">
              <button onClick={closeEdit} className="absolute right-6 top-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Editar projeto</h2>
              <p className="text-xs text-gray-500">{selectedProject.titulo}</p>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-8">
              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-[#f19f17]" /> Integrantes
                </h4>
                <div className="space-y-2 mb-4">
                  {editForm.integrantes.map((int, idx) => (
                    <div key={idx} className="flex items-center justify-between border border-gray-100 rounded-xl p-3 text-sm font-medium text-gray-700">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-3 text-gray-400" />
                        {int.nome || 'Integrante'}
                      </div>
                      <button onClick={() => handleRemoveIntegrante(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    value={editForm.novoIntegrante}
                    onChange={(e) => setEditForm({...editForm, novoIntegrante: e.target.value})}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddIntegrante()}
                    placeholder="Nome do integrante..." 
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#f19f17]/50"
                  />
                  <button onClick={handleAddIntegrante} disabled={!editForm.novoIntegrante.trim()} className="px-4 py-2 rounded-xl text-sm font-semibold border-2 border-[#f19f17] text-[#f19f17] hover:bg-orange-50 transition-colors flex items-center disabled:opacity-50">
                    <Plus className="w-4 h-4 mr-1" /> Adicionar
                  </button>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                  <Folder className="w-4 h-4 mr-2 text-[#f19f17]" /> Arquivos
                </h4>
                <div className="space-y-2 mb-4">
                  {editForm.arquivos.map((arq, idx) => (
                    <div key={idx} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                      <div className="flex items-center">
                        {getFileIcon(arq.nome)}
                        <span className="ml-3 text-sm font-medium text-gray-700">{arq.nome || 'Arquivo'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{arq.nome?.split('.').pop() || 'FILE'}</span>
                        <button onClick={() => handleRemoveArquivo(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer text-sm">
                  <Plus className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-700 mb-1">Clique para enviar novos arquivos</p>
                  <p className="text-xs text-gray-400">PDF, DOCX, PPTX, ZIP — máx. 50MB</p>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0">
              <button onClick={closeEdit} className="text-gray-600 font-semibold text-sm px-4 hover:bg-gray-50 rounded-xl transition-colors">
                Cancelar
              </button>
              <button onClick={closeEdit} className="bg-[#f19f17] hover:bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-orange-200">
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
