export interface FormulaConfig {
  placement: {
    pCap: number;
    qCap: number;
    dCap: number;
    offer1Weight: number;
    offer2Weight: number;
    pLabel: string;
    pFormula: string;
    qLabel: string;
    qFormula: string;
    qDescription: string;
    dLabel: string;
    dFormula: string;
    totalFormula: string;
  };
  placementRate: {
    formula: string;
    description: string;
  };
  internship: {
    engineering: {
      year2Target: number;
      year3Target: number;
      year4Target: number;
      conversionTarget: number;
      componentALabel: string;
      componentAFormula: string;
      componentADescription: string;
      componentBLabel: string;
      componentBFormula: string;
      componentBDescription: string;
      componentCLabel: string;
      componentCFormula: string;
      componentCDescription: string;
      componentDLabel: string;
      componentDFormula: string;
      componentDDescription: string;
      finalFormula: string;
      strengthNote: string;
    };
    arts: {
      year2Target: number;
      year3Target: number;
      conversionTarget: number;
      componentALabel: string;
      componentAFormula: string;
      componentADescription: string;
      componentBLabel: string;
      componentBFormula: string;
      componentBDescription: string;
      componentCLabel: string;
      componentCFormula: string;
      componentCDescription: string;
      finalFormula: string;
      strengthNote: string;
    };
    pg: {
      year1Target: number;
      conversionTarget: number;
      componentALabel: string;
      componentAFormula: string;
      componentADescription: string;
      componentBLabel: string;
      componentBFormula: string;
      componentBDescription: string;
      finalFormula: string;
      strengthNote: string;
    };
  };
}

const DEFAULT_CONFIG: FormulaConfig = {
  placement: {
    pCap: 50,
    qCap: 40,
    dCap: 10,
    offer1Weight: 5,
    offer2Weight: 10,
    pLabel: 'P - Percentage of Placement',
    pFormula: '= No. of Placement / No. of Placement enrolled',
    qLabel: 'Q - Quality Placement',
    qFormula: '= (100 + (DELTA OF NET SALARY)) / 2',
    qDescription: 'NET SALARY = (Percentage Students placed last year X Average Salary) - (Percentage of Students placed current year X Average Salary)',
    dLabel: 'D - Dream Placement',
    dFormula: '1 offer - 5% | 2 Offer 10%',
    totalFormula: '= MIN(P+Q+D), 100)',
  },
  placementRate: {
    formula: '(Total Placed / Total Enrolled) × 100',
    description: 'Calculates the percentage of students placed out of total enrolled students',
  },
  internship: {
    engineering: {
      year2Target: 0.10,
      year3Target: 0.20,
      year4Target: 0.30,
      conversionTarget: 0.50,
      componentALabel: 'A = 10% of II YEAR - MAX 25 MARKS',
      componentAFormula: 'MAX (N2/S2 X 10) X 25) Marks',
      componentADescription: 'N2 - Number of Internship Students in Second year',
      componentBLabel: 'B = 20% of III YEAR - MAX 25 MARKS',
      componentBFormula: 'MAX ((N3/S3 X 5) X 25) Marks',
      componentBDescription: 'N3 - Number of Internship Students in Third year',
      componentCLabel: 'C = 30% of IV YEAR - MAX 25',
      componentCFormula: 'MAX ((N4/S4 X 3.33) X 25 Marks',
      componentCDescription: 'N4 - Number of Internship Students in Fourth year',
      componentDLabel: 'Conversion from D = Internship to Placement MAX 25 MARKS',
      componentDFormula: 'MAX ((NC4/N4 X 2) X 25) MARKS',
      componentDDescription: 'engineering who converted from Internship to placement in the same Company',
      finalFormula: '(10 N2/S2 + 5N3/S3 + 3.33 N4/S4 + 2 NC4/N4) X 25',
      strengthNote: 'S2, S3, S4 are Strength of respective classs',
    },
    arts: {
      year2Target: 0.20,
      year3Target: 0.30,
      conversionTarget: 0.50,
      componentALabel: 'A = 20% II YEAR - MAX 33 MARKS',
      componentAFormula: 'MAX (N2/S2 X 5) X 33) Marks',
      componentADescription: 'N2 - Number of Internship Students in Second year',
      componentBLabel: 'B = 30% III YEAR - MAX 33 MARKS',
      componentBFormula: 'MAX ((N3/S3 X 3.33) X 33) Marks',
      componentBDescription: 'N3 - Number of Internship Students in Third year',
      componentCLabel: 'Conversion from C = Internship to Placement MAX 34 MARKS',
      componentCFormula: 'MAX ((NC3/N3 X 2) X 34) MARKS',
      componentCDescription: 'NC3 - Final year studest who converted from Internship to placement in the same Company',
      finalFormula: '(5 N2/S2 + 3.33 N3/S3 + 2 NC3/N3) X 33.33',
      strengthNote: 'S2, & S3 are Strength of respective classs in 2nd and 3rd)',
    },
    pg: {
      year1Target: 0.30,
      conversionTarget: 0.50,
      componentALabel: 'A = 30% III YEAR - MAX 50 MARKS',
      componentAFormula: 'MAX ((N1/S1 X 3.33) X 50) Marks',
      componentADescription: 'N1 - Number of Internship Students in Second year',
      componentBLabel: 'B = Internship to Placement MAX 50 MARKS',
      componentBFormula: 'MAX ((NC1/N1 X 2) X 50) MARKS',
      componentBDescription: 'NC1 - Second year studest who converted from Internship to placement in the same Company',
      finalFormula: '(3.33 N1/S1 + 2NC1/N1) X50',
      strengthNote: 'S1 are Strength Second Years',
    },
  },
};

let currentConfig: FormulaConfig = { ...DEFAULT_CONFIG };

export const getFormulaConfig = async (): Promise<FormulaConfig> => {
  try {
    const response = await fetch('http://localhost:3001/api/formula-config');
    const data = await response.json();
    if (Object.keys(data).length > 0) {
      currentConfig = data as FormulaConfig;
    } else {
      currentConfig = { ...DEFAULT_CONFIG };
    }
  } catch {
    currentConfig = { ...DEFAULT_CONFIG };
  }
  return { ...currentConfig };
};

export const updateFormulaConfig = async (config: FormulaConfig): Promise<void> => {
  currentConfig = { ...config };
  await fetch('http://localhost:3001/api/formula-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
};

export const resetFormulaConfig = async (): Promise<void> => {
  currentConfig = { ...DEFAULT_CONFIG };
  await fetch('http://localhost:3001/api/formula-config', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(DEFAULT_CONFIG)
  });
};

export const getFormulaConfigSync = (): FormulaConfig => {
  return { ...currentConfig };
};
