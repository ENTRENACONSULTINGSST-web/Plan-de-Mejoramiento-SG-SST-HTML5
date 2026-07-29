import React, { useState, useEffect } from 'react';
import { PlanMejoramientoSST, EmpresaInfo } from './types';
import { EJEMPLO_PLAN_MEJORAMIENTO } from './data/standardsData';
import { updateResumenConPorcentaje } from './utils/sstUtils';
import { Header } from './components/Header';
import { CompanyProfileForm } from './components/CompanyProfileForm';
import { PlanMatrixTable } from './components/PlanMatrixTable';
import { DashboardAnalytics } from './components/DashboardAnalytics';
import { JsonExportPanel } from './components/JsonExportPanel';
import { NormativaModal } from './components/NormativaModal';
import { ShieldCheck, Save, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY_PLAN = 'sg_sst_plan_data_v1';
const STORAGE_KEY_TAB = 'sg_sst_active_tab_v1';

export default function App() {
  // Load plan from localStorage if available, or fallback to example
  const [plan, setPlan] = useState<PlanMejoramientoSST>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAN);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.empresaInfo && Array.isArray(parsed.actividades)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error al cargar datos guardados desde localStorage:', e);
    }
    return EJEMPLO_PLAN_MEJORAMIENTO;
  });

  // Load active tab from localStorage
  const [activeTab, setActiveTab] = useState<
    'matriz' | 'generador' | 'indicadores' | 'json_export' | 'normatividad'
  >(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TAB);
      if (
        saved &&
        ['matriz', 'generador', 'indicadores', 'json_export', 'normatividad'].includes(saved)
      ) {
        return saved as any;
      }
    } catch (e) {
      console.error('Error al cargar pestaña desde localStorage:', e);
    }
    return 'generador';
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSavedToast, setShowSavedToast] = useState<boolean>(false);

  // Automatically save plan data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAN, JSON.stringify(plan));
      setShowSavedToast(true);
      const timer = setTimeout(() => setShowSavedToast(false), 2000);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('Error guardando plan en localStorage:', e);
    }
  }, [plan]);

  // Save active tab
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TAB, activeTab);
    } catch (e) {
      console.error('Error guardando tab en localStorage:', e);
    }
  }, [activeTab]);

  const handleCargarEjemplo = () => {
    if (
      confirm(
        '¿Desea restaurar la plantilla de ejemplo? Se reemplazará la información guardada actualmente por los datos por defecto.'
      )
    ) {
      setPlan(EJEMPLO_PLAN_MEJORAMIENTO);
    }
  };

  const handlePlanGenerated = (newPlan: PlanMejoramientoSST) => {
    setPlan(updateResumenConPorcentaje(newPlan));
    setActiveTab('matriz'); // Jump to matrix view when generated
  };

  const handleCompanyInfoUpdate = (updatedInfo: EmpresaInfo) => {
    setPlan((prev) =>
      updateResumenConPorcentaje({
        ...prev,
        empresaInfo: updatedInfo,
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col relative">
      {/* Save indicator floating toast */}
      <div
        className={`fixed bottom-4 right-4 z-50 bg-slate-900 text-emerald-400 border border-slate-800 text-xs px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2 transition-all duration-300 pointer-events-none ${
          showSavedToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold text-slate-200">
          Guardado automáticamente en el navegador
        </span>
      </div>

      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        empresaNombre={plan.empresaInfo.nombre}
        cumplimiento={plan.empresaInfo.porcentajeCumplimiento}
        onCargarEjemplo={handleCargarEjemplo}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'matriz' && (
          <PlanMatrixTable
            plan={plan}
            onUpdatePlan={(updated) => setPlan(updated)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'generador' && (
          <CompanyProfileForm
            initialInfo={plan.empresaInfo}
            onPlanGenerated={handlePlanGenerated}
            onCompanyInfoUpdate={handleCompanyInfoUpdate}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        )}

        {activeTab === 'indicadores' && <DashboardAnalytics plan={plan} />}

        {activeTab === 'json_export' && <JsonExportPanel plan={plan} />}

        {activeTab === 'normatividad' && <NormativaModal />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-300">
              Consultor Experto en SG-SST (Decreto 1072/15 & Res. 0312/19)
            </span>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Persistencia Local Activada (Los datos no se borran al cerrar)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

