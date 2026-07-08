import urologicalCancer from "@/data/treatments/urological-cancer.json";
import prostateProblems from "@/data/treatments/prostate-problems.json";
import kidneyStones from "@/data/treatments/kidney-stones.json";
import bladderProblems from "@/data/treatments/bladder-problems.json";
import maleInfertility from "@/data/treatments/male-infertility.json";
import erectileDysfunction from "@/data/treatments/erectile-dysfunction.json";
import urinaryTractInfection from "@/data/treatments/urinary-tract-infection.json";
import urethralStricture from "@/data/treatments/urethral-stricture.json";

export type TreatmentData = typeof urologicalCancer;

const treatments = [
  urologicalCancer,
  prostateProblems,
  kidneyStones,
  bladderProblems,
  maleInfertility,
  erectileDysfunction,
  urinaryTractInfection,
  urethralStricture,
] satisfies TreatmentData[];

export function getAllTreatments() {
  return treatments;
}

export function getTreatmentBySlug(slug: string) {
  return treatments.find((treatment) => treatment.slug === slug) ?? null;
}
