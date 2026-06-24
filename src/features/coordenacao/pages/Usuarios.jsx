import React, { useState, useEffect } from 'react';
import { Edit2, X, Search } from 'lucide-react';
import { apiRequest } from '../../../lib/api';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const [coordenadores, alunos, professores, empresas] = await Promise.all([
        apiRequest('/coordenadores/').catch(() => []),
        apiRequest('/alunos/').catch(() => []),
        apiRequest('/professores/').catch(() => []),
        apiRequest('/empresas/').catch(() => []),
      ]);
      
      const formatData = (data, role) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => ({
          ...item,
          // Normaliza os campos para a tabela
          displayName: item.nome || item.nome_completo || item.razao_social || 'Usuário',
          displayEmail: item.email || item.email_institucional || 'Sem e-mail',
          displayCourse: item.curso || '-',
          isActive: item.ativo !== false, // Assume true se for undefined
          role: role,
          originalType: role.toLowerCase()
        }));
      };

      const combined = [
        ...formatData(coordenadores, 'Coordenador'),
        ...formatData(alunos, 'Aluno'),
        ...formatData(professores, 'Professor'),
        ...formatData(empresas, 'Empresa'),
      ];

      setUsers(combined);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSave = async () => {
    try {
      // Determina a rota baseada no tipo do usuário
      let endpoint = '';
      if (editingUser.originalType === 'coordenador') endpoint = `/coordenadores/${editingUser.id}/`;
      else if (editingUser.originalType === 'aluno') endpoint = `/alunos/${editingUser.id}/`;
      else if (editingUser.originalType === 'professor') endpoint = `/professores/${editingUser.id}/`;
      else if (editingUser.originalType === 'empresa') endpoint = `/empresas/${editingUser.id}/`;

      if (endpoint) {
        // Prepara o payload mantendo os dados originais e atualizando os alterados
        const payload = { ...editingUser };
        
        if (editingUser.nome !== undefined) payload.nome = editingUser.displayName;
        if (editingUser.nome_completo !== undefined) payload.nome_completo = editingUser.displayName;
        if (editingUser.razao_social !== undefined) payload.razao_social = editingUser.displayName;
        
        if (editingUser.email !== undefined) payload.email = editingUser.displayEmail;
        if (editingUser.email_institucional !== undefined) payload.email_institucional = editingUser.displayEmail;
        
        payload.curso = editingUser.displayCourse;
        payload.ativo = editingUser.isActive;

        await apiRequest(endpoint, {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: { 'Content-Type': 'application/json' }
        });

        // Atualiza o estado local
        setUsers(users.map(u => 
          (u.id === editingUser.id && u.role === editingUser.role) ? editingUser : u
        ));
        closeModal();
      }
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao salvar as alterações. Tente novamente.');
    }
  };

  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.displayEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestão de Usuários</h1>
            <p className="text-gray-500 mt-1">Visualize e gerencie os usuários cadastrados na plataforma Scripta.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nome, email ou perfil..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all"
            />
          </div>
        </div>

        {/* Container da Tabela (Glassmorphism) */}
        <div className="bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Curso
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-bounce"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="mt-4 block">Carregando usuários...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={`${user.id}-${index}`} className="hover:bg-amber-50/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 font-bold shadow-inner">
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.displayName}</div>
                            <div className="text-sm text-gray-500">{user.displayEmail}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.displayCourse}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${
                          user.isActive 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {user.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleEditClick(user)}
                          className="text-amber-600 hover:text-orange-600 p-2 rounded-lg hover:bg-amber-50 transition-colors"
                          title="Editar usuário"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Edição (Glassmorphism) */}
      {isModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          
          {/* Conteúdo do Modal */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 w-full max-w-md p-6 transform transition-all">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Editar usuário</h3>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={editingUser.displayName}
                  onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail institucional
                </label>
                <input
                  type="email"
                  value={editingUser.displayEmail}
                  onChange={(e) => setEditingUser({...editingUser, displayEmail: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curso
                </label>
                <input
                  type="text"
                  value={editingUser.displayCourse}
                  onChange={(e) => setEditingUser({...editingUser, displayCourse: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setEditingUser({...editingUser, isActive: !editingUser.isActive})}
                    className={`${
                      editingUser.isActive ? 'bg-amber-500' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2`}
                  >
                    <span className="sr-only">Alternar status</span>
                    <span
                      className={`${
                        editingUser.isActive ? 'translate-x-5' : 'translate-x-0'
                      } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                    />
                  </button>
                  <span className={`ml-3 text-sm font-medium ${editingUser.isActive ? 'text-amber-600' : 'text-gray-500'}`}>
                    {editingUser.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 border border-transparent rounded-xl hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all shadow-md"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
