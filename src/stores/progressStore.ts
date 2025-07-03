import { create } from 'zustand';

export interface WeightLossData {
  height: number;
  currentWeight: number;
  targetWeight: number;
  goalTime: number;
  frequency: number;
  impedance?: string;
  diet: string;
  medicalNotes?: string;
  imc: number;
  idealWeight: number;
  dailyDeficit: number;
}

export interface BodyMetrics {
  totalWeight: number;
  bmi: number;
  totalBodyWater: number;
  intracellularWater: number;
  extracellularWater: number;
  leanMass: number;
  skeletalMuscleMass: number;
  bodyFatMass: number;
  bodyFatPercent: number;
  fatArms: number;
  fatTrunk: number;
  fatLegs: number;
  boneMass: number;
  bmr: number;
  ecwIcwRatio: number;
  muscleSymmetry: number;
}

interface ProgressStore {
  weightLoss?: WeightLossData;
  metrics: BodyMetrics;
  setWeightLoss: (data: WeightLossData) => void;
  setMetrics: (data: Partial<BodyMetrics>) => void;
}

const defaultMetrics: BodyMetrics = {
  totalWeight: 0,
  bmi: 0,
  totalBodyWater: 0,
  intracellularWater: 0,
  extracellularWater: 0,
  leanMass: 0,
  skeletalMuscleMass: 0,
  bodyFatMass: 0,
  bodyFatPercent: 0,
  fatArms: 0,
  fatTrunk: 0,
  fatLegs: 0,
  boneMass: 0,
  bmr: 0,
  ecwIcwRatio: 0,
  muscleSymmetry: 0,
};

export const useProgressStore = create<ProgressStore>((set) => ({
  weightLoss: undefined,
  metrics: defaultMetrics,
  setWeightLoss: (data) => set({ weightLoss: data }),
  setMetrics: (data) => set((state) => ({ metrics: { ...state.metrics, ...data } })),
}));
