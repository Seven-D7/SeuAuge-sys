import React, { useState, useRef } from 'react';
import { User, Camera, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProgressStore } from '../stores/progressStore';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const { metrics, setMetrics } = useProgressStore();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [bodyForm, setBodyForm] = useState(metrics);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSave = async () => {
    await updateUser({ name: formData.name, email: formData.email, file });
    setMetrics(bodyForm);
    setIsEditing(false);
    setFile(null);
    setPreview(null);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setBodyForm(metrics);
    setFile(null);
    setPreview(null);
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Meu Perfil</h1>
        {!isEditing ? (
          <button
            onClick={() => {
              setBodyForm(metrics);
              setIsEditing(true);
            }}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            <span>Editar Perfil</span>
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Cancelar</span>
            </button>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <section className="bg-slate-800 rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-emerald-600" />
        <div className="-mt-12 p-8 flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Avatar */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-16 h-16 text-white" />
              )}
            </div>
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-primary hover:bg-primary-dark rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            {!isEditing ? (
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                <p className="text-slate-400 mb-4">{user?.email}</p>
                <div className="inline-flex items-center px-3 py-1 bg-yellow-500 text-black rounded-full text-sm font-medium">
                  Membro Premium
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-300 mt-4">
                  <span>Peso: {metrics.totalWeight}kg</span>
                  <span>IMC: {metrics.bmi}</span>
                  <span>Água Total: {metrics.totalBodyWater}L</span>
                  <span>Massa Magra: {metrics.leanMass}kg</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Endereço de Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Peso Corporal (kg)</span>
                    <input
                      type="number"
                      value={bodyForm.totalWeight}
                      onChange={(e) => setBodyForm({ ...bodyForm, totalWeight: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">IMC</span>
                    <input
                      type="number"
                      value={bodyForm.bmi}
                      onChange={(e) => setBodyForm({ ...bodyForm, bmi: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Água Corporal Total (L)</span>
                    <input
                      type="number"
                      value={bodyForm.totalBodyWater}
                      onChange={(e) => setBodyForm({ ...bodyForm, totalBodyWater: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Água Intracelular (L)</span>
                    <input
                      type="number"
                      value={bodyForm.intracellularWater}
                      onChange={(e) => setBodyForm({ ...bodyForm, intracellularWater: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Água Extracelular (L)</span>
                    <input
                      type="number"
                      value={bodyForm.extracellularWater}
                      onChange={(e) => setBodyForm({ ...bodyForm, extracellularWater: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Massa Magra (kg)</span>
                    <input
                      type="number"
                      value={bodyForm.leanMass}
                      onChange={(e) => setBodyForm({ ...bodyForm, leanMass: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Massa Muscular Esquelética (kg)</span>
                    <input
                      type="number"
                      value={bodyForm.skeletalMuscleMass}
                      onChange={(e) => setBodyForm({ ...bodyForm, skeletalMuscleMass: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Massa de Gordura (kg)</span>
                    <input
                      type="number"
                      value={bodyForm.bodyFatMass}
                      onChange={(e) => setBodyForm({ ...bodyForm, bodyFatMass: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">% Gordura Corporal</span>
                    <input
                      type="number"
                      value={bodyForm.bodyFatPercent}
                      onChange={(e) => setBodyForm({ ...bodyForm, bodyFatPercent: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Gordura Braços (%)</span>
                    <input
                      type="number"
                      value={bodyForm.fatArms}
                      onChange={(e) => setBodyForm({ ...bodyForm, fatArms: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Gordura Tronco (%)</span>
                    <input
                      type="number"
                      value={bodyForm.fatTrunk}
                      onChange={(e) => setBodyForm({ ...bodyForm, fatTrunk: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Gordura Pernas (%)</span>
                    <input
                      type="number"
                      value={bodyForm.fatLegs}
                      onChange={(e) => setBodyForm({ ...bodyForm, fatLegs: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Massa Óssea (kg)</span>
                    <input
                      type="number"
                      value={bodyForm.boneMass}
                      onChange={(e) => setBodyForm({ ...bodyForm, boneMass: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">TMB (kcal)</span>
                    <input
                      type="number"
                      value={bodyForm.bmr}
                      onChange={(e) => setBodyForm({ ...bodyForm, bmr: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Relação ECW/ICW</span>
                    <input
                      type="number"
                      value={bodyForm.ecwIcwRatio}
                      onChange={(e) => setBodyForm({ ...bodyForm, ecwIcwRatio: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-sm mb-1">Equilíbrio Muscular (%)</span>
                    <input
                      type="number"
                      value={bodyForm.muscleSymmetry}
                      onChange={(e) => setBodyForm({ ...bodyForm, muscleSymmetry: Number(e.target.value) })}
                      className="input"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-primary mb-2">47</div>
          <div className="text-slate-400">Vídeos Assistidos</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-emerald-400 mb-2">12</div>
          <div className="text-slate-400">Produtos Comprados</div>
        </div>
        <div className="bg-slate-800 rounded-lg p-6 text-center">
          <div className="text-3xl font-bold text-cyan-400 mb-2">23</div>
          <div className="text-slate-400">Favoritos</div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Atividade Recente</h3>
        <div className="space-y-4">
          {[
            { action: 'Assistiu', item: 'Yoga Matinal Energizante', time: '2 horas atrás' },
            { action: 'Comprou', item: 'Whey Protein Premium', time: '1 dia atrás' },
            { action: 'Adicionou aos favoritos', item: 'HIIT Cardio Explosivo', time: '2 dias atrás' },
            { action: 'Completou', item: 'Meditação para Alívio do Estresse', time: '3 dias atrás' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
              <div>
                <span className="text-white">{activity.action}</span>
                <span className="text-primary ml-1">{activity.item}</span>
              </div>
              <span className="text-slate-400 text-sm">{activity.time}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Profile;