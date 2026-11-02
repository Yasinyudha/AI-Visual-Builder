import { create } from "zustand";

interface LinearRegressionResultState {
  // Hyperparameters
  learningRate: number | null;
  iterations: number | null;

  setLearningRate: (learningRate: number) => void;
  setIterations: (iterations: number) => void;
}

export const useLinearRegressionResultState =
  create<LinearRegressionResultState>((set) => ({
    // Hyperparameters
    learningRate: null,
    iterations: null,

    setLearningRate: (learningRate) => set({ learningRate: learningRate }),
    setIterations: (iterations) => set({ iterations: iterations }),
  }));
