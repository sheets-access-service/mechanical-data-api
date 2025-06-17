export type SpreadsheetRow = {
  AREA: string;
  'MAIN-ITEM NO': string;
  'SUB-ITEM NO': string;
  'SUB-ITEM DESCRIPTION': string;
  'EQUIPTMENT CATEGORY': string;
  'EQUIPMENT TYPE': string;
  UNIT: string;
  SYSTEM: string;
  'SUB-SYS': string;
  'WORK ORDER': string;
  'SCOPE 1': string;
  EXTERNAL: string;
  'VISUAL EXTERNAL': string;
  'EXTERNAL DATE': string;
};

export async function getSpreadsheetData(): Promise<SpreadsheetRow[]> {
  try {
    const response = await fetch(
      'https://script.google.com/macros/s/AKfycbw-LqcuJxof3kxdCUcBsMlB13uWbBDvL262TDWWwKnm/dev'
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data. Status: ${response.status}`);
    }

    const data = await response.json();
    return data as SpreadsheetRow[];
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    return [];
  }
}
