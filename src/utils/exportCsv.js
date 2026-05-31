/**
 * Utility to convert an array of JSON objects into a downloadable CSV file.
 * @param {Array<Object>} data - The dataset array.
 * @param {string} filename - Output name for the downloaded file.
 */
export function exportToCsv(data, filename = "bharat_budget_export.csv") {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // 1. Add headers
  csvRows.push(headers.join(','));

  // 2. Add rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // 3. Create blob & download
  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
