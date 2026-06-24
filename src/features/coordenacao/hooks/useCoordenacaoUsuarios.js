import { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '../../../lib/api';

export function useCoordenacaoUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
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
          displayName: item.nome || item.nome_completo || item.razao_social || 'Usuário',
          displayEmail: item.email || item.email_institucional || 'Sem e-mail',
          displayCourse: item.curso || '-',
          isActive: item.ativo !== false,
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
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUser = async (editingUser) => {
    let endpoint = '';
    if (editingUser.originalType === 'coordenador') endpoint = `/coordenadores/${editingUser.id}/`;
    else if (editingUser.originalType === 'aluno') endpoint = `/alunos/${editingUser.id}/`;
    else if (editingUser.originalType === 'professor') endpoint = `/professores/${editingUser.id}/`;
    else if (editingUser.originalType === 'empresa') endpoint = `/empresas/${editingUser.id}/`;

    if (endpoint) {
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

      setUsers(prev => prev.map(u => 
        (u.id === editingUser.id && u.role === editingUser.role) ? editingUser : u
      ));
    }
  };

  return { users, loading, updateUser, refetch: fetchUsers };
}
