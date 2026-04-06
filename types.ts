export enum Department {
  ENGINEERING = 'Engineering',
  ARTS = 'Arts',
  PG = 'PG'
}

export interface PlacementInputs {
  totalEnrolled: number;
  totalPlaced: number;
  averageSalary: number;
  lastYearPlacedPercent: number; // Percentage of students placed last year
  lastYearAvgSalary: number;
  offers1: number; // Students with 1 offer
  offers2: number; // Students with 2 offers
}

export interface PlacementMetrics {
  P: number; // Percentage score (Max 50)
  Q: number; // Quality score (Max 40)
  D: number; // Dream score (Max 10)
  totalScore: number; // Max 100
  rawP: number; // Raw percentage
  rawQ: number; // Raw quality calculation
  rawD: number; // Raw dream calculation
}

export interface InternshipInputs {
  department: Department;
  // Year 1 (PG mostly)
  n1: number;
  s1: number;
  nc1: number; // Conversion
  // Year 2
  n2: number;
  s2: number;
  // Year 3
  n3: number;
  s3: number;
  nc3: number; // Conversion for Arts
  // Year 4 (Engineering)
  n4: number;
  s4: number;
  nc4: number; // Conversion for Engg
}

export interface InternshipMetrics {
  componentA: number;
  componentB: number;
  componentC: number;
  componentD: number; // Only for Engg (4 components)
  totalScore: number; // Max 100
}
