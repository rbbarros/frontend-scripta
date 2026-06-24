import React, { useEffect, useState } from 'react';
import { getCoordenadores, getEmpresas, getPortfolioList, getProjetos, getProfessores } from '../../../lib/authService';
import { Folder, Users, CheckCircle, Clock, ArrowRight, Settings, FileText, Award, BarChart2 } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProjetos();
        setProjetos(data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const atividadesRecentes = [
    {
      id: 1,
      tipo: 'submetido',
      titulo: 'Projeto submetido',
      subtitulo: 'Sistema de Gestão Escolar - João Silva',
      tempo: '30 min atrás',
      cor: 'blue'
    },
    {
      id: 2,
      tipo: 'avaliacao',
      titulo: 'Avaliação registrada',
      subtitulo: 'App de Delivery - Prof. Maria Santos',
      tempo: '2h atrás',
      cor: 'purple'
    },
    {
      id: 3,
      tipo: 'certificado',
      titulo: 'Certificado emitido',
      subtitulo: 'E-commerce React - Ana Costa',
      tempo: '5h atrás',
      cor: 'green'
    },
    {
      id: 4,
      tipo: 'usuario',
      titulo: 'Novo usuário cadastrado',
      subtitulo: 'Carlos Oliveira',
      tempo: '1 dia atrás',
      cor: 'orange'
    }
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Visão geral da plataforma Scripta — Faculdade Senac</p>
      </header>

      <section className="kpi-section">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper blue">
            <Folder className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Total de Projetos</span>
            <span className="kpi-value">187</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper purple">
            <Users className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Usuários Ativos</span>
            <span className="kpi-value">342</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper green">
            <CheckCircle className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Aprovados</span>
            <span className="kpi-value">124</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper amber">
            <Clock className="kpi-icon" />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pendentes</span>
            <span className="kpi-value">63</span>
          </div>
        </div>
      </section>

      <div className="dashboard-content">
        <section className="activity-section">
          <div className="section-header">
            <h2>Atividade Recente</h2>
            <a href="/projetos" className="view-all-link">
              Ver projetos <ArrowRight size={16} />
            </a>
          </div>
          <div className="timeline">
            {atividadesRecentes.map((atividade) => (
              <div key={atividade.id} className="timeline-item">
                <div className={`timeline-dot ${atividade.cor}`}></div>
                <div className="timeline-content">
                  <div className="timeline-title">{atividade.titulo}</div>
                  <div className="timeline-subtitle">{atividade.subtitulo}</div>
                </div>
                <div className="timeline-time">{atividade.tempo}</div>
              </div>
            ))}
          </div>
        </section>

        <aside className="sidebar-section">
          <div className="quick-access-section">
            <h2>Acesso Rápido</h2>
            <div className="quick-access-buttons">
              <button className="amber-outline-btn">
                <Settings size={18} />
                Gerenciar usuários
              </button>
              <button className="amber-outline-btn">
                <FileText size={18} />
                Gerar relatório
              </button>
              <button className="amber-outline-btn">
                <Award size={18} />
                Emitir certificado
              </button>
              <button className="amber-outline-btn">
                <BarChart2 size={18} />
                Ver indicadores
              </button>
            </div>
          </div>

          <div className="project-status-section">
            <h2>Status dos Projetos</h2>
            <div className="progress-container">
              <div className="progress-label">
                <span>Aprovados</span>
                <span>124</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar fill-green" style={{ width: '66%' }}></div>
              </div>
            </div>
            <div className="progress-container">
              <div className="progress-label">
                <span>Pendentes</span>
                <span>63</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar fill-amber" style={{ width: '34%' }}></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
