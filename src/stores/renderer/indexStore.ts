import { create } from 'zustand';

interface HistogramItem {
    interval: string;
    count: number;
}

interface ProcessedData {
    [columnName: string]: (string | number | boolean | null)[];
}

interface LinearRegressionMetricsProps {
    r2Score: number;
    mae: number;
    rmse: number;
}

interface IndexStore {
    // Hold header file state
    isFileActive: boolean;
    setIsFileActive: (isFileActive: boolean) => void;

    // Hold the popup handler of feature state
    isFeatureModalOpen: boolean;
    setIsFeatureModalOpen: (isFeatureModalOpen: boolean) => void;

    // Hold the popup handler of label state
    isLabelModalOpen: boolean;
    setIsLabelModalOpen: (isLabelModalOpen: boolean) => void;

    // Hold scaler dropdown state
    scalerDropdownState: boolean;
    setScalerDropdownState: (scalerDropdownState: boolean) => void;

    // Hold scaler value
    scalerValue: string;
    setScalerValue: (scalerValue: string) => void;

    // Hold dropna state
    dropnaState: boolean;
    setDropnaState: (dropnaState: boolean) => void;

    // Hold scaler state
    normalizedState: boolean;
    setNormalizedState: (normalizedState: boolean) => void;

    // Hold the encode categorical state
    encodeCategoricalState: boolean;
    setEncodeCategoricalState: (encodeCategoricalState: boolean) => void;

    // Hold the encode categorical value
    encodeCategoricalValue: string;
    setEncodeCategoricalValue: (encodeCategoricalValue: string) => void;

    // Hold the encode categorical dropdown state
    encodeCategoricalDropdownState: boolean;
    setEncodeCategoricalDropdownState: (
        encodeCategoricalDropdownState: boolean,
    ) => void;

    // Hold selected labels
    selectedLabels: string[];
    setSelectedLabels: (selectedLabels: string[]) => void;

    // Hold selected features
    selectedFeatures: string[];
    setSelectedFeatures: (selectedFeatures: string[]) => void;

    // Selected file path
    selectedFilePath: string | null;
    setSelectedFilePath: (selectedFilePath: string | null) => void;

    // Hold data displayed in histogram
    dataHistogram: HistogramItem[];
    setDataHistogram: (dataHistogram: HistogramItem[]) => void;

    // Hold dropdown state for select feature in histogram
    featureInHistogramDropdown: boolean;
    setFeatureInHistogramDropdown: (
        featureInHistogramDropdown: boolean,
    ) => void;

    // Hold the dropdown histogram value
    dropdownHistogramValue: string;
    setDropdownHistogramValue: (dropdownHistogramValue: string) => void;

    // Hold histogram bins state
    histogramDropdownBinsState: boolean;
    setHistogramDropdownBinsState: (
        histogramDropdownBinsState: boolean,
    ) => void;

    // Hold histogram bins value
    binsValue: string;
    setBinsValue: (binsValue: string) => void;

    // Hold processed data list
    processedDataList: ProcessedData[];
    setProcessedDataList: (processedDataList: ProcessedData[]) => void;

    // Hold correlation matrix value
    correlationMatrixValue: Record<
        string,
        Record<string, number | null>
    > | null;
    setCorrelationMatrixValue: (
        correlationMatrixValue: Record<
            string,
            Record<string, number | null>
        > | null,
    ) => void;

    // Hold dynamic value of slider ratio
    sliderRatio: number;
    setSliderRatio: (sliderRatio: number) => void;

    // Hold random seed input value
    randomSeedInput: number;
    setRandomSeedInput: (randomSeedInput: number) => void;

    // Hold dropdown value
    problemDefinitionDropdownValue: string;
    setProblemDefinitionDropdownValue: (
        problemDefinitionDropdownValue: string,
    ) => void;

    // Hold preserve class ratio state
    preserveClassRatioState: boolean;
    setPreserveClassRatioState: (preserveClassRatioState: boolean) => void;

    // Hold the selected machine learning model
    selectedMachineLearningModel: string;
    setSelectedMachineLearningModel: (
        selectedMachineLearningModel: string,
    ) => void;

    // Hold learning rate value
    learningRate: number;
    setLearningRate: (learningRate: number) => void;

    // Hold accuracy classification metrics
    accuracy: number;
    setAccuracy: (accuracy: number) => void;

    // Hold epoch
    epoch: number;
    setEpoch: (epoch: number) => void;

    // Hold loading state while train linear regression
    isTraining: boolean;
    setIsTraining: (isTraining: boolean) => void;

    // Hold linear regression metrics
    linearRegressionMetrics: LinearRegressionMetricsProps | null;
    setLinearRegressionMetrics: (
        linearRegressionMetrics: LinearRegressionMetricsProps | null,
    ) => void;
}

export const useIndexStore = create<IndexStore>((set) => ({
    isFileActive: false,
    setIsFileActive: (newIsFileActive) =>
        set({ isFileActive: newIsFileActive }),

    isFeatureModalOpen: false,
    setIsFeatureModalOpen: (newIsFeatureModalOpen) =>
        set({ isFeatureModalOpen: newIsFeatureModalOpen }),

    isLabelModalOpen: false,
    setIsLabelModalOpen: (newIsLabelModalOpen) =>
        set({ isLabelModalOpen: newIsLabelModalOpen }),

    scalerDropdownState: false,
    setScalerDropdownState: (newScalerDropdownState) =>
        set({ scalerDropdownState: newScalerDropdownState }),

    scalerValue: 'MinMax Scaler',
    setScalerValue: (newScalerValue) => set({ scalerValue: newScalerValue }),

    dropnaState: false,
    setDropnaState: (newDropnaState) => set({ dropnaState: newDropnaState }),

    normalizedState: false,
    setNormalizedState: (newNormalizedState) =>
        set({ normalizedState: newNormalizedState }),

    encodeCategoricalState: false,
    setEncodeCategoricalState: (newEncodeCategoricalState) =>
        set({ encodeCategoricalState: newEncodeCategoricalState }),

    encodeCategoricalValue: 'One-Hot Encoding',
    setEncodeCategoricalValue: (newEncodeCategoricalValue) =>
        set({ encodeCategoricalValue: newEncodeCategoricalValue }),

    encodeCategoricalDropdownState: false,
    setEncodeCategoricalDropdownState: (newEncodeCategoricalDropdownState) =>
        set({
            encodeCategoricalDropdownState: newEncodeCategoricalDropdownState,
        }),

    selectedLabels: [],
    setSelectedLabels: (newSelectedLabels) =>
        set({ selectedLabels: newSelectedLabels }),

    selectedFeatures: [],
    setSelectedFeatures: (newSelectedFeatures) =>
        set({ selectedFeatures: newSelectedFeatures }),

    selectedFilePath: null,
    setSelectedFilePath: (newSelectedFilePath) =>
        set({ selectedFilePath: newSelectedFilePath }),

    dataHistogram: [],
    setDataHistogram: (newDataHistogram) =>
        set({ dataHistogram: newDataHistogram }),

    featureInHistogramDropdown: false,
    setFeatureInHistogramDropdown: (newFeatureInHistogramDropdown) =>
        set({ featureInHistogramDropdown: newFeatureInHistogramDropdown }),

    dropdownHistogramValue: 'No Value',
    setDropdownHistogramValue: (newDropdownHistogramValue) =>
        set({ dropdownHistogramValue: newDropdownHistogramValue }),

    histogramDropdownBinsState: false,
    setHistogramDropdownBinsState: (newHistogramDropdownBinsState) =>
        set({ histogramDropdownBinsState: newHistogramDropdownBinsState }),

    binsValue: '5',
    setBinsValue: (newBinsValue) => set({ binsValue: newBinsValue }),

    processedDataList: [],
    setProcessedDataList: (newProcessedDataList) =>
        set({ processedDataList: newProcessedDataList }),

    correlationMatrixValue: null,
    setCorrelationMatrixValue: (newCorrelationMatrixValue) =>
        set({ correlationMatrixValue: newCorrelationMatrixValue }),

    sliderRatio: 0.6,
    setSliderRatio: (newSliderRatio) => set({ sliderRatio: newSliderRatio }),

    randomSeedInput: 42,
    setRandomSeedInput: (newRandomSeedInput) =>
        set({ randomSeedInput: newRandomSeedInput }),

    problemDefinitionDropdownValue: 'Classification',
    setProblemDefinitionDropdownValue: (newProblemDefinitionDropdownValue) =>
        set({
            problemDefinitionDropdownValue: newProblemDefinitionDropdownValue,
        }),

    preserveClassRatioState: false,
    setPreserveClassRatioState: (newPreserveClassRatioState) =>
        set({ preserveClassRatioState: newPreserveClassRatioState }),

    selectedMachineLearningModel: 'Linear Regression',
    setSelectedMachineLearningModel: (newSelectedMachineLearningModel) =>
        set({ selectedMachineLearningModel: newSelectedMachineLearningModel }),

    learningRate: 0.001,
    setLearningRate: (newLearningRate) =>
        set({ learningRate: newLearningRate }),

    accuracy: 0,
    setAccuracy: (newAccuracy) => set({ accuracy: newAccuracy }),

    epoch: 50,
    setEpoch: (newEpoch) => set({ epoch: newEpoch }),

    isTraining: false,
    setIsTraining: (newIsTraining) => set({ isTraining: newIsTraining }),

    linearRegressionMetrics: null,
    setLinearRegressionMetrics: (newLinearRegressionMetrics) =>
        set({ linearRegressionMetrics: newLinearRegressionMetrics }),
}));

export function useIndex<K extends keyof IndexStore & string>(key: K) {
    const setterKey =
        `set${key.charAt(0).toUpperCase()}${key.slice(1)}` as keyof IndexStore;

    const value = useIndexStore((state) => state[key]);
    const setter = useIndexStore((state) => state[setterKey]) as (
        val: IndexStore[K],
    ) => void;

    return [value, setter] as const;
}
