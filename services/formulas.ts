import { Department, InternshipInputs, InternshipMetrics, PlacementInputs, PlacementMetrics } from '../types';
import { getFormulaConfigSync } from './formulaConfig';

/**
 * PLACEMENT FORMULAS
 * 
 * P = (TotalPlaced / TotalEnrolled) * 100  -> Capped at 50 in final score
 * Q = (100 + ((LastYearPlaced% * LastYearAvgSalary) - (CurrentPlaced% * CurrentAvgSalary)) / 2) -> Capped at 40
 *     Note: The prompt logic for Q is ambiguous in text vs formula. 
 *     Text says: NET SALARY = (PrevYear% * PrevAvg) - (Curr% * CurrAvg)
 *     Formula says: (100 + Delta / 2).
 *     We will follow the explicit formula structure provided.
 * D = Min((Offers1 * 5 + Offers2 * 10), 10) -> Capped at 10
 */
export const calculatePlacementScore = (inputs: PlacementInputs): PlacementMetrics => {
  const config = getFormulaConfigSync();
  const {
    totalEnrolled,
    totalPlaced,
    averageSalary,
    lastYearPlacedPercent,
    lastYearAvgSalary,
    offers1,
    offers2,
  } = inputs;

  // Prevent division by zero
  const safeEnrolled = totalEnrolled > 0 ? totalEnrolled : 1;

  // 1. Calculate P (Percentage)
  const rawP = (totalPlaced / safeEnrolled) * 100;
  const scoreP = Math.min(rawP, config.placement.pCap);

  // 2. Calculate Q (Quality)
  const currentPlacedPercent = (totalPlaced / safeEnrolled) * 100; 
  const lastYearFactor = lastYearPlacedPercent * lastYearAvgSalary;
  const currentFactor = currentPlacedPercent * averageSalary;
  const rawQ = (100 + (lastYearFactor - currentFactor)) / 2;
  const scoreQ = Math.min(Math.max(rawQ, 0), config.placement.qCap);

  // 3. Calculate D (Dream)
  const rawD = (offers1 * config.placement.offer1Weight) + (offers2 * config.placement.offer2Weight);
  const scoreD = Math.min(rawD, config.placement.dCap);

  return {
    P: scoreP,
    Q: scoreQ,
    D: scoreD,
    totalScore: Math.min(scoreP + scoreQ + scoreD, 100),
    rawP,
    rawQ,
    rawD
  };
};

/**
 * INTERNSHIP FORMULAS
 */
export const calculateInternshipScore = (inputs: InternshipInputs): InternshipMetrics => {
  const config = getFormulaConfigSync();
  const { department, n1, s1, nc1, n2, s2, n3, s3, nc3, n4, s4, nc4 } = inputs;

  // Helper for safe division
  const ratio = (n: number, s: number) => (s > 0 ? n / s : 0);

  let compA = 0, compB = 0, compC = 0, compD = 0;
  let total = 0;

  switch (department) {
    case Department.ENGINEERING:
      compA = Math.min((10 * ratio(n2, s2)) * 25, 25);
      compB = Math.min((5 * ratio(n3, s3)) * 25, 25);
      compC = Math.min((3.33 * ratio(n4, s4)) * 25, 25);
      compD = Math.min((2 * ratio(nc4, n4)) * 25, 25);
      total = compA + compB + compC + compD;
      break;

    case Department.ARTS:
      compA = Math.min((5 * ratio(n2, s2)) * 33.33, 33);
      compB = Math.min((3.33 * ratio(n3, s3)) * 33.33, 33);
      compC = Math.min((2 * ratio(nc3, n3)) * 33.33, 34);
      total = compA + compB + compC;
      break;

    case Department.PG:
      compA = Math.min((3.33 * ratio(n1, s1)) * 50, 50);
      compB = Math.min((2 * ratio(nc1, n1)) * 50, 50);
      total = compA + compB;
      break;
  }

  return {
    componentA: parseFloat(compA.toFixed(2)),
    componentB: parseFloat(compB.toFixed(2)),
    componentC: parseFloat(compC.toFixed(2)),
    componentD: parseFloat(compD.toFixed(2)),
    totalScore: parseFloat(total.toFixed(2))
  };
};
