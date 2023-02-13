export const defaultDataFetcher = async (url: RequestInfo | URL) => {
    const res = await fetch(url)
    if (!res.ok) {
        const error = new SwrErr('An error occurred while fetching the data.');
        // Attach extra info to the error object.
        error.info = await res.json()
        error.status = res.status
        error.getErrorMessage();
        throw error;
    }
    return res.json();
}