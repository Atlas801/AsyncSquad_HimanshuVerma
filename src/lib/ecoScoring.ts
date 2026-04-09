import { ProductMaterial } from '@/types';

export interface EcoAnalysisResult {
  score: number;
  tierTag: string;
  specificTags: string[];
}

export function analyzeEcoImpact(productMaterials: ProductMaterial[] | undefined): EcoAnalysisResult {
  if (!productMaterials || productMaterials.length === 0) {
    return {
      score: 0,
      tierTag: 'Pending',
      specificTags: [],
    };
  }

  // 1. Calculate weights
  let givenSum = 0;
  let missingCount = 0;

  productMaterials.forEach((pm) => {
    if (pm.percentage !== null && pm.percentage !== undefined && pm.percentage > 0) {
      givenSum += pm.percentage;
    } else {
      missingCount++;
    }
  });

  const weights: number[] = [];
  productMaterials.forEach((pm) => {
    if (pm.percentage !== null && pm.percentage !== undefined && pm.percentage > 0) {
      if (givenSum > 100) {
        weights.push(pm.percentage / givenSum); // Normalize if over 100
      } else {
        weights.push(pm.percentage / 100);
      }
    } else {
      if (givenSum >= 100) {
        weights.push(0); // Cannot assign if sum >= 100
      } else {
        weights.push((100 - givenSum) / 100 / missingCount);
      }
    }
  });

  // 2. Compute Eco Score
  let totalScore = 0;
  productMaterials.forEach((pm, index) => {
    const matScore = pm.material?.eco_score ?? 0;
    totalScore += matScore * weights[index];
  });

  const finalScore = Math.round(totalScore);

  // 3. Score-based tier tags
  // If all material scores are 0 (not yet configured), treat as pending
  const allScoresZero = productMaterials.every(pm => (pm.material?.eco_score ?? 0) === 0);
  let tierTag = 'Pending';
  if (allScoresZero) {
    tierTag = 'Pending';
  } else if (finalScore >= 85) tierTag = '🌍 Eco Champion';
  else if (finalScore >= 65) tierTag = '🌿 Eco Friendly';
  else if (finalScore >= 45) tierTag = '🍃 Moderately Green';
  else if (finalScore >= 25) tierTag = '⚠️ Eco Concern';
  else tierTag = '🔴 High Impact';

  // 4. Property-based specific tags
  const specificTags: string[] = [];
  
  const allBiodegradable = productMaterials.every(pm => pm.material?.is_biodegradable);
  if (allBiodegradable) specificTags.push('♻️ Fully Biodegradable');

  const anyRecyclable = productMaterials.some(pm => pm.material?.is_recyclable);
  if (anyRecyclable) specificTags.push('🔁 Recyclable');

  const allOrganic = productMaterials.every(pm => pm.material?.is_organically_sourced);
  if (allOrganic) specificTags.push('🌾 100% Organic');

  const anyAnimal = productMaterials.some(pm => pm.material?.is_animal_derived);
  if (anyAnimal) specificTags.push('🐄 Contains Animal Products');

  const anySynthetic = productMaterials.some(pm => pm.material?.is_synthetic);
  if (anySynthetic) specificTags.push('🧪 Contains Synthetic Materials');

  const allOceanSafe = productMaterials.every(pm => pm.material?.is_ocean_safe);
  if (allOceanSafe) specificTags.push('🌊 Ocean Safe');

  const anyHarmful = productMaterials.some(pm => pm.material?.has_harmful_chemicals);
  if (anyHarmful) specificTags.push('☠️ Contains Regulated Chemicals');

  const allPlantBased = productMaterials.every(pm => pm.material?.is_plant_based);
  if (allPlantBased) specificTags.push('🌱 Plant Based');

  return {
    score: finalScore,
    tierTag,
    specificTags,
  };
}
