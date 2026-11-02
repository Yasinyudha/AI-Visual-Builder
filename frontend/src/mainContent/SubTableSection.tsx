import { useState } from "react";
import { IconEmptyFolder, IconLoading, IconResultEmpty } from "../Store";
import {
  useFilename,
  useTableData,
  type TableData,
} from "./SubSidebarWithFiles";
import { create } from "zustand";
import {
  useNormalizationState,
  useSelectedNormalizedFeatures,
} from "./nodeComponent/NodeInput";
import { useModelInfoState } from "./nodeComponent/NodeModel";
import { useLinearRegressionTrainingResult, useTrainState } from "./SubGrapher";

interface HyperparameterResult {
  nameValue: string;
  value: string[];
}

interface ProcessedResultProps {
  title: string;
  data: HyperparameterResult[];
}

interface TableDataProps {
  headers: string[];
  rows: Record<string, string>[];
  setHeaders: (headers: string[]) => void;
  setRows: (rows: Record<string, string>[]) => void;
}

interface HeaderBlockTemplateInterface {
  title: string;
  value: number;
  isChoosed: boolean;
  onChoose: (value: number) => void;
}

interface PreprocessedTableState {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

interface ColumnColorState {
  selectedFeature: {
    selectedIndexFeature: number[];
    selectedNameFeature: string[];
  };
  selectedLabel: {
    selectedIndexLabel: number[];
    selectedNameLabel: string[];
  };

  toggleSelectedIndexColumn: (index: number) => void;
  toggleSelectedIndexLabel: (index: number) => void;

  insertNameFeature: (feature: string) => void;
  insertNameLabel: (label: string) => void;
}

const useProcessedTableState = create<PreprocessedTableState>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading: isLoading }),
}));

const useProcessedTable = create<TableDataProps>((set) => ({
  headers: [],
  rows: [],
  setHeaders: (headers) => set({ headers: headers }),
  setRows: (rows) => set({ rows: rows }),
}));

export const useColumnColor = create<ColumnColorState>((set) => ({
  selectedFeature: {
    selectedIndexFeature: [],
    selectedNameFeature: [],
  },

  selectedLabel: {
    selectedIndexLabel: [],
    selectedNameLabel: [],
  },

  toggleSelectedIndexColumn: (index) =>
    set((state) => {
      const exists = state.selectedFeature.selectedIndexFeature.includes(index);
      return {
        selectedFeature: {
          ...state.selectedFeature,
          selectedIndexFeature: exists
            ? state.selectedFeature.selectedIndexFeature.filter(
                (i) => i !== index,
              )
            : [...state.selectedFeature.selectedIndexFeature, index],
        },
      };
    }),

  toggleSelectedIndexLabel: (index) =>
    set((state) => {
      const exists = state.selectedLabel.selectedIndexLabel.includes(index);
      return {
        selectedLabel: {
          ...state.selectedLabel,
          selectedIndexLabel: exists
            ? state.selectedLabel.selectedIndexLabel.filter((i) => i !== index)
            : [...state.selectedLabel.selectedIndexLabel, index],
        },
      };
    }),

  insertNameFeature: (feature) =>
    set((state) => {
      const currentList = state.selectedFeature.selectedNameFeature;
      const exists = currentList.includes(feature);

      return {
        selectedFeature: {
          ...state.selectedFeature,
          selectedNameFeature: exists
            ? currentList.filter((i) => i !== feature)
            : [...currentList, feature],
        },
      };
    }),

  insertNameLabel: (label) =>
    set((state) => {
      const currentList = state.selectedLabel.selectedNameLabel;
      const exists = currentList.includes(label);

      return {
        selectedLabel: {
          ...state.selectedLabel,
          selectedNameLabel: exists
            ? currentList.filter((i) => i !== label)
            : [...currentList, label],
        },
      };
    }),
}));

const TableContentWhenEmpty = () => {
  return (
    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      <IconEmptyFolder />
      <span className="text-dim-white/40">
        There are no tables displayed here
      </span>
    </div>
  );
};

const ResultWhenEmpty = () => {
  return (
    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
      <IconResultEmpty className="h-25 w-25" />
      <span className="text-dim-white/40">You should train model first</span>
    </div>
  );
};

const ColumnMapElement = ({ headers }: Pick<TableDataProps, "headers">) => {
  const {
    selectedFeature,
    selectedLabel,
    toggleSelectedIndexColumn,
    toggleSelectedIndexLabel,
    insertNameFeature,
    insertNameLabel,
  } = useColumnColor();

  const handleColumnColor = (feature: string, index: number) => {
    toggleSelectedIndexColumn(index);
    insertNameFeature(feature);
  };

  const handleLabelColor = (
    e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
    label: string,
    index: number,
  ) => {
    e.preventDefault();

    insertNameLabel(label);
    toggleSelectedIndexLabel(index);
  };

  return headers.map((header, index) => (
    <th
      onContextMenu={(e) => handleLabelColor(e, header, index)}
      onClick={() => handleColumnColor(header, index)}
      key={index}
      className={`px-4 py-2 ${
        selectedFeature.selectedIndexFeature.includes(index)
          ? "bg-unique-red/40"
          : selectedLabel.selectedIndexLabel.includes(index)
            ? "bg-unique-yellow/40"
            : "bg-grey"
      }`}
    >
      {header}
    </th>
  ));
};

const RowMapElement = ({
  headers,
  rows,
}: Pick<TableDataProps, "headers" | "rows">) => {
  const { selectedFeature, selectedLabel } = useColumnColor();

  return rows.slice(0, 7).map((row, indexRow) => (
    <tr key={indexRow}>
      {headers.map((header, indexHeader) => (
        <td
          key={indexHeader}
          className={`py-2 ${
            selectedFeature.selectedIndexFeature.includes(indexHeader)
              ? "bg-unique-red/20"
              : selectedLabel.selectedIndexLabel.includes(indexHeader) &&
                "bg-unique-yellow/20"
          }`}
        >
          {row[header]}
        </td>
      ))}
    </tr>
  ));
};

const ProcessedHeaderElement = ({
  headers,
}: Pick<TableDataProps, "headers">) => {
  const {
    toggleSelectedIndexColumn,
    toggleSelectedIndexLabel,
    insertNameFeature,
    insertNameLabel,
  } = useColumnColor();

  const handleColumnColor = (feature: string, index: number) => {
    toggleSelectedIndexColumn(index);
    insertNameFeature(feature);
  };

  const handleLabelColor = (
    e: React.MouseEvent<HTMLTableHeaderCellElement, MouseEvent>,
    label: string,
    index: number,
  ) => {
    e.preventDefault();

    insertNameLabel(label);
    toggleSelectedIndexLabel(index);
  };

  return headers.map((header, index) => (
    <th
      onContextMenu={(e) => handleLabelColor(e, header, index)}
      onClick={() => handleColumnColor(header, index)}
      key={index}
      className={`bg-grey } px-4 py-2`}
    >
      {header}
    </th>
  ));
};

const ProcessedRowElement = ({
  headers,
  rows,
}: Pick<TableDataProps, "headers" | "rows">) => {
  return rows.slice(0, 7).map((row, indexRow) => (
    <tr key={indexRow}>
      {headers.map((header, indexHeader) => (
        <td key={indexHeader} className="py-2">
          {row[header]}
        </td>
      ))}
    </tr>
  ));
};

const TableContentWhenFileExists = ({
  tableData,
}: {
  tableData: TableData;
}) => {
  const headers = tableData.headers;
  const rows = tableData.rows;

  return (
    <div className="custom-scrollbar mt-2 max-h-[22vh] w-full overflow-auto">
      <div className="mt-5 flex">
        <table className="text-center">
          <thead className="sticky top-0 hover:cursor-pointer">
            <tr>
              <ColumnMapElement headers={headers} />
            </tr>
          </thead>
          <tbody>
            <RowMapElement headers={headers} rows={rows} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProcessedTableContent = ({ tableData }: { tableData: TableData }) => {
  const { isLoading } = useProcessedTableState();

  const headers = tableData.headers;
  const rows = tableData.rows;

  return isLoading ? (
    <IconLoading className="flex w-full scale-40 items-center justify-center" />
  ) : (
    <div className="custom-scrollbar mt-2 max-h-[22vh] w-full overflow-auto">
      <div className="mt-5 flex">
        <table className="text-center">
          <thead className="sticky top-0 hover:cursor-pointer">
            <tr>
              <ProcessedHeaderElement headers={headers} />
            </tr>
          </thead>
          <tbody>
            <ProcessedRowElement headers={headers} rows={rows} />
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HeaderBlockTemplate = ({
  title,
  value,
  isChoosed,
  onChoose,
}: HeaderBlockTemplateInterface) => {
  const { setHeaders, setRows } = useProcessedTable();
  const { tableData } = useTableData();
  const { filename } = useFilename();
  const { selectedFeature, selectedLabel } = useColumnColor();
  const { setIsLoading } = useProcessedTableState();
  const { selectedNormalizedFeatures } = useSelectedNormalizedFeatures();
  const { selectedNormDropdown } = useNormalizationState();

  const handlePrepareDataOnClick = async () => {
    if (value === 0) {
      if (!tableData?.headers || !tableData?.rows) return;

      setHeaders(tableData.headers);
      setRows(tableData.rows);
      return;
    }

    if (value === 1) {
      setIsLoading(true);

      const response = await fetch("http://127.0.0.1:8000/api/get-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: filename,
          normalization_method: selectedNormDropdown,
          normalized_features: selectedNormalizedFeatures,
          feature: selectedFeature.selectedNameFeature,
          label: selectedLabel.selectedNameLabel,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        setHeaders(data.headers);
        setRows(data.rows);
      }

      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={() => {
        onChoose(value);
        handlePrepareDataOnClick();
      }}
      className={`h-fit px-5 py-1.5 hover:cursor-pointer ${isChoosed && "bg-grey/60 rounded-sm"}`}
    >
      <span>{title}</span>
    </div>
  );
};

const ResultTemplate = ({ title, data }: ProcessedResultProps) => {
  return (
    <div className="flex w-full flex-col gap-1">
      <h2>{title}</h2>
      {data &&
        data.map((singleData, index) => (
          <div key={index} className="flex justify-between text-right">
            <span className="text-unique-yellow">{singleData.nameValue}</span>
            <div className="flex flex-col gap-1">
              {singleData.value.map((data, indexData) => (
                <span key={indexData}>{data}</span>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

const ProcessedResultElement = () => {
  const { learningRate, iteration } = useModelInfoState();
  const {
    coefficient,
    intercept,
    meanAbsoluteError,
    meanSquaredError,
    rootMeanSquaredError,
    rSquared,
    fValue,
    pValue,
  } = useLinearRegressionTrainingResult();
  const { isTrain } = useTrainState();

  const hyperparametersTemplate: HyperparameterResult[] = [
    {
      nameValue: "Learning Rate",
      value: [learningRate ?? "null"],
    },
    {
      nameValue: "Iterations",
      value: [iteration ?? "null"],
    },
  ];

  const resultsTemplate: HyperparameterResult[] = [
    {
      nameValue: "Coefficient",
      value: coefficient,
    },
    {
      nameValue: "Intercept",
      value: intercept,
    },
  ];

  const errorMagnitudeMetricsTemplate: HyperparameterResult[] = [
    {
      nameValue: "Mean Absolute Error (MAE)",
      value: meanAbsoluteError,
    },
    {
      nameValue: "Root Mean Squared Error (RMSE)",
      value: rootMeanSquaredError,
    },
    {
      nameValue: "Mean Squared Error (MSE)",
      value: meanSquaredError,
    },
  ];

  const goodnessOfFitMetricsTemplate: HyperparameterResult[] = [
    {
      nameValue: "R-squared Coefficient",
      value: rSquared,
    },
  ];

  const statisticalSignificanceTemplate: HyperparameterResult[] = [
    {
      nameValue: "F-value",
      value: fValue,
    },
    {
      nameValue: "P-value",
      value: pValue,
    },
  ];

  if (!isTrain) return <ResultWhenEmpty />;
  return (
    <div className="flex w-full flex-col gap-1 p-5 text-xs">
      <span className="font-jakarta-semibold text-base text-white">
        Linear Regression Training Results
      </span>
      <div className="mt-3 grid w-full grid-cols-3 gap-10">
        <div className="flex flex-col gap-3">
          <ResultTemplate
            title="Hyperparameters"
            data={hyperparametersTemplate}
          />
          <ResultTemplate title="Results" data={resultsTemplate} />
        </div>
        <div className="flex flex-col gap-3">
          <ResultTemplate
            title="Error Magnitude Metrics"
            data={errorMagnitudeMetricsTemplate}
          />
          <ResultTemplate
            title="Goodness of Fit Metrics"
            data={goodnessOfFitMetricsTemplate}
          />
        </div>
        <div className="flex flex-col gap-3">
          <ResultTemplate
            title="Statistical Significance"
            data={statisticalSignificanceTemplate}
          />
        </div>
      </div>
    </div>
  );
};

export const TableSection = () => {
  const [headerIndex, setHeaderIndex] = useState<number>(0);
  const { headers, rows } = useProcessedTable();
  const tableData = useTableData((state) => state.tableData);

  const headerTables = [
    "Table Preview",
    "Pre-Processed Table",
    "Result",
    "Logs",
  ];

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden px-8 py-3">
      <div className="flex gap-1">
        {headerTables.map((header, index) => (
          <HeaderBlockTemplate
            key={index}
            title={header}
            value={index}
            isChoosed={headerIndex == index}
            onChoose={(value) => setHeaderIndex(value)}
          />
        ))}
      </div>
      {tableData === null ? (
        <TableContentWhenEmpty />
      ) : headerIndex === 0 ? (
        <TableContentWhenFileExists tableData={tableData} />
      ) : headerIndex === 1 ? (
        <ProcessedTableContent tableData={{ headers, rows }} />
      ) : (
        headerIndex === 2 && <ProcessedResultElement />
      )}
    </div>
  );
};
