const pathTemplate = './assets/images';
export const fileCsv = `${pathTemplate}/file.png`;
export const arrow = `${pathTemplate}/right-arrow.png`;
export const emptyFolder = `${pathTemplate}/empty-folder.png`;
export const search = `${pathTemplate}/magnifying-glass.png`;
export const checkMark = `${pathTemplate}/check-mark-dark.png`;

// Global function to connect with python server backend
export const fetchData = async <TResponse, Tpayload = Record<string, unknown>>(
    endpoint: string,
    payload: Tpayload,
): Promise<TResponse> => {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Failed to fetch directory');

    const data = await response.json();
    return data;
};
