import { useState } from 'react';

export const PythonCalculator = () => {
    const [numA, setNumA] = useState<number>(10);
    const [numB, setNumB] = useState<number>(5);
    const [result, setResult] = useState<string>('');

    const handleCalculate = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/multiply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ numA, numB }),
            });
            const data = await response.json();
            setResult(data.result);
        } catch (error) {
            setResult('Error connecting to Python server');
        }
    };

    return (
        <div className="flex max-w-xs flex-col gap-3 rounded-md border border-white/10 bg-white/5 p-4">
            <h3 className="font-semibold text-indigo-400">
                Python FastAPI Multiply
            </h3>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={numA}
                    onChange={(e) => setNumA(Number(e.target.value))}
                    className="w-full rounded border border-white/20 bg-slate-900 px-2 py-1"
                />
                <span className="self-center font-bold">×</span>
                <input
                    type="number"
                    value={numB}
                    onChange={(e) => setNumB(Number(e.target.value))}
                    className="w-full rounded border border-white/20 bg-slate-900 px-2 py-1"
                />
            </div>
            <button
                onClick={handleCalculate}
                className="rounded bg-indigo-600 py-1 font-medium hover:bg-indigo-500"
            >
                Calculate
            </button>
            {result && <span className="text-xs text-slate-300">{result}</span>}
        </div>
    );
};
