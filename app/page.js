"use client";

import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// ─── DATA ────────────────────────────────────────────────────────────────────

const FOOD_DB = {
  proteines: [
    { id: "poulet", name: "Poulet (blanc)", kcal: 165, p: 31, g: 3.6, c: 0, unit: "g", step: 10 },
    { id: "dinde", name: "Dinde (escalope)", kcal: 135, p: 30, g: 1.5, c: 0, unit: "g", step: 10 },
    { id: "boeuf5", name: "Bœuf 5% MG", kcal: 137, p: 22, g: 5, c: 0, unit: "g", step: 10 },
    { id: "saumon", name: "Saumon", kcal: 208, p: 20, g: 13, c: 0, unit: "g", step: 10 },
    { id: "sardine", name: "Sardine (conserve)", kcal: 208, p: 25, g: 11, c: 0, unit: "g", step: 10 },
    { id: "thon", name: "Thon (conserve)", kcal: 116, p: 26, g: 1, c: 0, unit: "g", step: 10 },
    { id: "crevettes", name: "Crevettes", kcal: 99, p: 24, g: 0.3, c: 0.2, unit: "g", step: 10 },
    { id: "oeuf", name: "Œuf entier", kcal: 155, p: 13, g: 11, c: 1.1, unit: "g", step: 1, displayUnit: "œuf(s)", displayPer: 60 },
    { id: "fromage_blanc", name: "Fromage blanc 0%", kcal: 48, p: 8, g: 0.2, c: 3.5, unit: "g", step: 10 },
    { id: "whey", name: "Whey protéine", kcal: 380, p: 78, g: 4, c: 7, unit: "g", step: 5 },
    { id: "tofu", name: "Tofu ferme", kcal: 144, p: 15, g: 9, c: 1.5, unit: "g", step: 10 },
    { id: "poulet_cuisse", name: "Cuisse de poulet", kcal: 209, p: 26, g: 11, c: 0, unit: "g", step: 10 },
    { id: "steak_hache", name: "Steak haché 15%", kcal: 250, p: 17, g: 20, c: 0, unit: "g", step: 10 },
    { id: "porc_filet", name: "Filet de porc", kcal: 143, p: 26, g: 3.5, c: 0, unit: "g", step: 10 },
    { id: "agneau", name: "Agneau (gigot)", kcal: 234, p: 25, g: 14, c: 0, unit: "g", step: 10 },
    { id: "cabillaud", name: "Cabillaud", kcal: 82, p: 18, g: 0.7, c: 0, unit: "g", step: 10 },
    { id: "colin", name: "Colin", kcal: 80, p: 17, g: 1, c: 0, unit: "g", step: 10 },
    { id: "merlan", name: "Merlan", kcal: 86, p: 18, g: 1.2, c: 0, unit: "g", step: 10 },
    { id: "truite", name: "Truite", kcal: 141, p: 20, g: 6, c: 0, unit: "g", step: 10 },
    { id: "jambon_blanc", name: "Jambon blanc", kcal: 107, p: 21, g: 2.5, c: 0.5, unit: "g", step: 10 },
    { id: "lardons", name: "Lardons fumés", kcal: 260, p: 15, g: 22, c: 0.5, unit: "g", step: 10 },
    { id: "mozzarella", name: "Mozzarella", kcal: 280, p: 22, g: 20, c: 2.5, unit: "g", step: 10 },
    { id: "emmental", name: "Emmental râpé", kcal: 380, p: 27, g: 29, c: 1, unit: "g", step: 10 },
    { id: "parmesan", name: "Parmesan", kcal: 431, p: 38, g: 29, c: 4, unit: "g", step: 10 },
    { id: "feta", name: "Feta", kcal: 264, p: 14, g: 21, c: 4, unit: "g", step: 10 },
    { id: "cottage_cheese", name: "Cottage cheese", kcal: 98, p: 11, g: 4.3, c: 3.4, unit: "g", step: 10 },
    { id: "skyr", name: "Skyr nature", kcal: 63, p: 11, g: 0.2, c: 4, unit: "g", step: 10 },
    { id: "blanc_oeuf", name: "Blanc d'œuf", kcal: 52, p: 11, g: 0.2, c: 0.7, unit: "g", step: 1, displayUnit: "blanc(s)", displayPer: 33 },
  ],
  feculents: [
    { id: "riz_blanc", name: "Riz blanc (cru)", kcal: 360, p: 7, g: 0.6, c: 79, unit: "g", step: 10 },
    { id: "riz_complet", name: "Riz complet (cru)", kcal: 350, p: 7.5, g: 2.5, c: 73, unit: "g", step: 10 },
    { id: "pates", name: "Pâtes (crues)", kcal: 350, p: 12, g: 1.5, c: 72, unit: "g", step: 10 },
    { id: "quinoa", name: "Quinoa (cru)", kcal: 368, p: 14, g: 6, c: 64, unit: "g", step: 10 },
    { id: "patate_douce", name: "Patate douce (crue)", kcal: 86, p: 1.6, g: 0.1, c: 20, unit: "g", step: 10 },
    { id: "pomme_terre", name: "Pomme de terre", kcal: 77, p: 2, g: 0.1, c: 17, unit: "g", step: 10 },
    { id: "boulgour", name: "Boulgour (cru)", kcal: 342, p: 12, g: 1.3, c: 76, unit: "g", step: 10 },
    { id: "lentilles", name: "Lentilles (crues)", kcal: 353, p: 25, g: 1, c: 60, unit: "g", step: 10 },
    { id: "pois_chiches", name: "Pois chiches (crus)", kcal: 364, p: 19, g: 6, c: 61, unit: "g", step: 10 },
    { id: "pain_complet", name: "Pain complet", kcal: 247, p: 13, g: 3.4, c: 41, unit: "g", step: 10 },
    { id: "semoule", name: "Semoule (crue)", kcal: 360, p: 12, g: 1.5, c: 72, unit: "g", step: 10 },
    { id: "vermicelles_riz", name: "Vermicelles de riz (crus)", kcal: 360, p: 3.4, g: 0.2, c: 83, unit: "g", step: 10 },
    { id: "gnocchi", name: "Gnocchi", kcal: 170, p: 3.5, g: 0.5, c: 37, unit: "g", step: 10 },
    { id: "tortilla", name: "Tortilla wrap", kcal: 312, p: 8, g: 8, c: 50, unit: "g", step: 10 },
    { id: "ble", name: "Blé (type Ebly, cru)", kcal: 340, p: 13, g: 2, c: 68, unit: "g", step: 10 },
    { id: "haricots_rouges", name: "Haricots rouges (crus)", kcal: 333, p: 22, g: 1.5, c: 60, unit: "g", step: 10 },
    { id: "flageolets", name: "Flageolets (crus)", kcal: 327, p: 21, g: 1.5, c: 58, unit: "g", step: 10 },
    { id: "farine_ble", name: "Farine de blé T55", kcal: 340, p: 10, g: 1.2, c: 72, unit: "g", step: 10 },
    { id: "farine_complete", name: "Farine complète", kcal: 340, p: 12, g: 2, c: 68, unit: "g", step: 10 },
    { id: "maizena", name: "Maïzena", kcal: 381, p: 0.3, g: 0, c: 91, unit: "g", step: 10 },
    { id: "chapelure", name: "Chapelure", kcal: 395, p: 13, g: 5, c: 73, unit: "g", step: 10 },
    { id: "flocons_avoine", name: "Flocons d'avoine", kcal: 367, p: 14, g: 7, c: 58, unit: "g", step: 10 },
    { id: "pain_mie", name: "Pain de mie", kcal: 274, p: 8, g: 4, c: 50, unit: "g", step: 10 },
  ],
  legumes: [
    { id: "brocolis", name: "Brocolis", kcal: 34, p: 2.8, g: 0.4, c: 7, unit: "g", step: 10 },
    { id: "courgette", name: "Courgette", kcal: 17, p: 1.2, g: 0.3, c: 3.1, unit: "g", step: 10 },
    { id: "epinards", name: "Épinards", kcal: 23, p: 2.9, g: 0.4, c: 3.6, unit: "g", step: 10 },
    { id: "haricots_verts", name: "Haricots verts", kcal: 31, p: 1.8, g: 0.1, c: 7, unit: "g", step: 10 },
    { id: "chou_fleur", name: "Chou-fleur", kcal: 25, p: 1.9, g: 0.3, c: 5, unit: "g", step: 10 },
    { id: "carottes", name: "Carottes", kcal: 41, p: 0.9, g: 0.2, c: 10, unit: "g", step: 10 },
    { id: "poivron", name: "Poivron", kcal: 31, p: 1, g: 0.3, c: 6, unit: "g", step: 10 },
    { id: "tomate", name: "Tomate", kcal: 18, p: 0.9, g: 0.2, c: 3.9, unit: "g", step: 10 },
    { id: "champignons", name: "Champignons", kcal: 22, p: 3.1, g: 0.3, c: 3.3, unit: "g", step: 10 },
    { id: "oignon", name: "Oignon", kcal: 40, p: 1.1, g: 0.1, c: 9, unit: "g", step: 10 },
    { id: "aubergine", name: "Aubergine", kcal: 25, p: 1, g: 0.2, c: 6, unit: "g", step: 10 },
    { id: "salade", name: "Salade verte", kcal: 15, p: 1.4, g: 0.2, c: 2.9, unit: "g", step: 10 },
    { id: "ail", name: "Ail", kcal: 149, p: 6, g: 0.5, c: 33, unit: "g", step: 1, displayUnit: "gousse(s)", displayPer: 4 },
    { id: "echalote", name: "Échalote", kcal: 72, p: 2.5, g: 0.1, c: 17, unit: "g", step: 10 },
    { id: "concombre", name: "Concombre", kcal: 12, p: 0.6, g: 0.1, c: 2.2, unit: "g", step: 10 },
    { id: "celeri", name: "Céleri branche", kcal: 16, p: 0.7, g: 0.2, c: 3, unit: "g", step: 10 },
    { id: "petits_pois", name: "Petits pois", kcal: 81, p: 5, g: 0.4, c: 14, unit: "g", step: 10 },
    { id: "mais", name: "Maïs (conserve)", kcal: 106, p: 3, g: 1.3, c: 22, unit: "g", step: 10 },
    { id: "poireau", name: "Poireau", kcal: 61, p: 1.5, g: 0.3, c: 14, unit: "g", step: 10 },
    { id: "fenouil", name: "Fenouil", kcal: 31, p: 1.2, g: 0.2, c: 7, unit: "g", step: 10 },
    { id: "chou_rouge", name: "Chou rouge", kcal: 31, p: 1.4, g: 0.2, c: 7, unit: "g", step: 10 },
    { id: "chou_vert", name: "Chou vert", kcal: 25, p: 1.3, g: 0.1, c: 6, unit: "g", step: 10 },
    { id: "radis", name: "Radis", kcal: 16, p: 0.7, g: 0.1, c: 3.4, unit: "g", step: 10 },
    { id: "betterave", name: "Betterave cuite", kcal: 44, p: 1.7, g: 0.1, c: 10, unit: "g", step: 10 },
    { id: "courge_butternut", name: "Butternut", kcal: 45, p: 1, g: 0.1, c: 12, unit: "g", step: 10 },
    { id: "chou_bruxelles", name: "Choux de Bruxelles", kcal: 43, p: 3.4, g: 0.3, c: 9, unit: "g", step: 10 },
    { id: "asperges", name: "Asperges", kcal: 20, p: 2.2, g: 0.1, c: 3.9, unit: "g", step: 10 },
    { id: "tomates_cerises", name: "Tomates cerises", kcal: 18, p: 0.9, g: 0.2, c: 3.9, unit: "g", step: 10 },
  ],
  matieres_grasses: [
    { id: "huile_olive", name: "Huile d'olive", kcal: 884, p: 0, g: 100, c: 0, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 14 },
    { id: "huile_coco", name: "Huile de coco", kcal: 862, p: 0, g: 100, c: 0, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 14 },
    { id: "beurre", name: "Beurre", kcal: 717, p: 0.9, g: 81, c: 0.1, unit: "g", step: 5 },
    { id: "avocat", name: "Avocat", kcal: 160, p: 2, g: 15, c: 9, unit: "g", step: 10 },
    { id: "amandes", name: "Amandes", kcal: 579, p: 21, g: 50, c: 22, unit: "g", step: 5 },
    { id: "noix", name: "Noix", kcal: 654, p: 15, g: 65, c: 14, unit: "g", step: 5 },
    { id: "beurre_cacahuete", name: "Beurre de cacahuète", kcal: 588, p: 25, g: 50, c: 20, unit: "g", step: 5 },
    { id: "graines_lin", name: "Graines de lin", kcal: 534, p: 18, g: 42, c: 29, unit: "g", step: 5 },
    { id: "huile_sesame", name: "Huile de sésame", kcal: 884, p: 0, g: 100, c: 0, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 14 },
    { id: "huile_tournesol", name: "Huile de tournesol", kcal: 884, p: 0, g: 100, c: 0, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 14 },
    { id: "creme_coco", name: "Crème de coco", kcal: 330, p: 3, g: 35, c: 2, unit: "g", step: 10 },
    { id: "graines_courge", name: "Graines de courge", kcal: 559, p: 30, g: 49, c: 5, unit: "g", step: 5 },
    { id: "graines_tournesol", name: "Graines de tournesol", kcal: 584, p: 21, g: 51, c: 20, unit: "g", step: 5 },
    { id: "graines_chia", name: "Graines de chia", kcal: 486, p: 17, g: 31, c: 42, unit: "g", step: 5 },
    { id: "noisettes", name: "Noisettes", kcal: 628, p: 15, g: 61, c: 17, unit: "g", step: 5 },
    { id: "noix_cajou", name: "Noix de cajou", kcal: 553, p: 18, g: 44, c: 30, unit: "g", step: 5 },
    { id: "pistaches", name: "Pistaches", kcal: 560, p: 20, g: 45, c: 28, unit: "g", step: 5 },
    { id: "tahini", name: "Tahini (purée sésame)", kcal: 595, p: 17, g: 54, c: 21, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
  ],
  sauces_condiments: [
    { id: "sauce_soja", name: "Sauce soja", kcal: 53, p: 5, g: 0, c: 5, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "moutarde", name: "Moutarde", kcal: 66, p: 4, g: 4, c: 4, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 5 },
    { id: "vinaigre", name: "Vinaigre", kcal: 18, p: 0, g: 0, c: 0.6, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "miel", name: "Miel", kcal: 304, p: 0.3, g: 0, c: 82, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 7 },
    { id: "creme_fraiche", name: "Crème fraîche 15%", kcal: 162, p: 2.5, g: 15, c: 3.6, unit: "g", step: 5 },
    { id: "lait_coco", name: "Lait de coco", kcal: 230, p: 2.3, g: 24, c: 3.3, unit: "g", step: 10, displayUnit: "ml", displayPer: 1 },
    { id: "concentre_tomate", name: "Concentré de tomate", kcal: 82, p: 4, g: 0.5, c: 17, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "sauce_tomate", name: "Sauce tomate (coulis)", kcal: 30, p: 1.2, g: 0.1, c: 6, unit: "g", step: 10 },
    { id: "sauce_huitre", name: "Sauce huître", kcal: 51, p: 1, g: 0, c: 11, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "sauce_sriracha", name: "Sriracha", kcal: 93, p: 2, g: 1, c: 19, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 5 },
    { id: "nuoc_mam", name: "Nuoc-mâm", kcal: 35, p: 5, g: 0, c: 3.6, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "curry_poudre", name: "Curry en poudre", kcal: 325, p: 14, g: 14, c: 42, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 3 },
    { id: "cumin", name: "Cumin moulu", kcal: 375, p: 18, g: 22, c: 44, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 3 },
    { id: "paprika", name: "Paprika", kcal: 282, p: 14, g: 13, c: 34, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 3 },
    { id: "curcuma", name: "Curcuma", kcal: 354, p: 8, g: 10, c: 65, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 3 },
    { id: "herbes_provence", name: "Herbes de Provence", kcal: 269, p: 9, g: 7, c: 43, unit: "g", step: 1, displayUnit: "c.à.c", displayPer: 2 },
    { id: "bouillon_cube", name: "Bouillon cube", kcal: 220, p: 15, g: 10, c: 18, unit: "g", step: 1, displayUnit: "cube(s)", displayPer: 10 },
    { id: "creme_soja", name: "Crème de soja", kcal: 120, p: 3, g: 8, c: 8, unit: "g", step: 10 },
    { id: "lait", name: "Lait demi-écrémé", kcal: 46, p: 3.2, g: 1.6, c: 4.8, unit: "g", step: 10, displayUnit: "ml", displayPer: 1 },
    { id: "sucre", name: "Sucre", kcal: 400, p: 0, g: 0, c: 100, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 12 },
    { id: "sirop_erable", name: "Sirop d'érable", kcal: 260, p: 0, g: 0, c: 67, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "pesto", name: "Pesto", kcal: 387, p: 5, g: 37, c: 8, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "ketchup", name: "Ketchup", kcal: 112, p: 1, g: 0.1, c: 27, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
    { id: "mayo", name: "Mayonnaise", kcal: 680, p: 1, g: 75, c: 1, unit: "g", step: 1, displayUnit: "c.à.s", displayPer: 15 },
  ],
};

// Coefficient cru→cuit (poids multiplié par ce facteur)
const COOKED_RATIO = {
  // Féculents
  riz_blanc: 2.5, riz_complet: 2.5, pates: 2.2, quinoa: 2.5, boulgour: 2.5,
  lentilles: 2.5, pois_chiches: 2.5, semoule: 2.5, vermicelles_riz: 2.2,
  ble: 2.5, haricots_rouges: 2.5, flageolets: 2.5,
  // Protéines
  poulet: 0.75, dinde: 0.75, boeuf5: 0.70, saumon: 0.80, tofu: 0.90,
  poulet_cuisse: 0.75, steak_hache: 0.70, porc_filet: 0.75, agneau: 0.75,
  cabillaud: 0.80, colin: 0.80, merlan: 0.80, truite: 0.80,
  // Tubercules
  patate_douce: 0.85, pomme_terre: 0.85,
};

const CATEGORIES = [
  { key: "proteines", label: "Protéines", icon: "🥩" },
  { key: "feculents", label: "Féculents", icon: "🍚" },
  { key: "legumes", label: "Légumes", icon: "🥦" },
  { key: "matieres_grasses", label: "Matières grasses", icon: "🫒" },
  { key: "sauces_condiments", label: "Sauces", icon: "🧂" },
];

const ACTIVITY_LEVELS = [
  { value: 1.2, label: "Sédentaire", desc: "Peu ou pas d'exercice" },
  { value: 1.375, label: "Légèrement actif", desc: "1-3x sport/sem" },
  { value: 1.55, label: "Modérément actif", desc: "3-5x sport/sem" },
  { value: 1.725, label: "Très actif", desc: "6-7x sport/sem" },
  { value: 1.9, label: "Extrêmement actif", desc: "2x/jour ou physique" },
];

const OBJECTIVES = [
  { value: -0.15, label: "Sèche douce", desc: "-15%" },
  { value: 0, label: "Maintien", desc: "Objectif cible" },
  { value: 0.1, label: "Prise légère", desc: "+10%" },
  { value: 0.15, label: "Prise de masse", desc: "+15%" },
];

const MEAL_SPLITS = [
  { value: "2meals", label: "2 repas (midi + soir)", lunch: 0.5, dinner: 0.5, snack: 0 },
  { value: "2meals_snack", label: "2 repas + collation", lunch: 0.4, dinner: 0.4, snack: 0.2 },
  { value: "3meals", label: "3 repas", lunch: 0.35, dinner: 0.35, snack: 0.3 },
];

// ─── UTILS ───────────────────────────────────────────────────────────────────

function calcBMR(sex, weight, height, age) {
  if (sex === "M") return 10 * weight + 6.25 * height - 5 * age + 5;
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

function calcMacros(tdee) {
  const protein = Math.round((tdee * 0.30) / 4);
  const fat = Math.round((tdee * 0.25) / 9);
  const carbs = Math.round((tdee - protein * 4 - fat * 9) / 4);
  return { protein, fat, carbs };
}

function getFood(id) {
  for (const cat of Object.values(FOOD_DB)) {
    const f = cat.find((x) => x.id === id);
    if (f) return f;
  }
  return null;
}

function formatQty(food, grams) {
  if (food.displayUnit && food.displayPer) {
    const count = grams / food.displayPer;
    if (food.displayUnit === "ml") {
      if (count < 0.3) return `${Math.round(grams)}g`;
      return `${Math.round(count * 10) / 10} ml`;
    }
    if (food.displayUnit === "œuf(s)") {
      return `${Math.max(1, Math.round(count))} œuf(s)`;
    }
    // c.à.s / c.à.c — arrondi au 0.5 le plus proche
    const rounded = Math.round(count * 2) / 2;
    if (rounded < 0.25) return `${Math.round(grams)}g`;
    return `${rounded} ${food.displayUnit}`;
  }
  return `${Math.round(grams)}g`;
}

function practicalRound(qty) {
  if (qty <= 0) return 0;
  if (qty < 20) return Math.round(qty / 5) * 5 || 5;
  if (qty < 200) return Math.round(qty / 10) * 10;
  return Math.round(qty / 25) * 25;
}

function displayStep(food) {
  if (!food.displayUnit || food.displayUnit === "ml") return food.step;
  if (food.displayUnit === "œuf(s)") return food.displayPer; // 1 œuf entier
  return 0.5 * food.displayPer; // 0.5 c.à.s ou 0.5 c.à.c
}

// ─── FIRESTORE SYNC ──────────────────────────────────────────────────────────

const PROFILES_DOC = doc(db, "macromeal", "profiles");
const RECIPE_DOC = doc(db, "macromeal", "recipe");

async function saveProfiles(profiles) {
  try {
    await setDoc(PROFILES_DOC, { data: JSON.stringify(profiles) });
  } catch (e) {
    console.error("Firebase save error (profiles):", e);
  }
}

async function saveRecipe(recipe) {
  try {
    await setDoc(RECIPE_DOC, { data: JSON.stringify(recipe) });
  } catch (e) {
    console.error("Firebase save error (recipe):", e);
  }
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function ProfileCard({ profile, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(!profile.name);
  const [form, setForm] = useState(profile);

  useEffect(() => { setForm(profile); }, [profile]);

  const bmr = calcBMR(form.sex, form.weight, form.height, form.age);
  const tdeeBase = Math.round(bmr * form.activity);
  const objective = OBJECTIVES.find((o) => o.value === form.objective) || OBJECTIVES[1];
  const tdee = Math.round(tdeeBase * (1 + form.objective));
  const macros = calcMacros(tdee);
  const split = MEAL_SPLITS.find((s) => s.value === form.mealSplit) || MEAL_SPLITS[0];

  const save = () => {
    setEditing(false);
    onUpdate({ ...form, tdee, macros, split });
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  if (editing) {
    return (
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>{form.sex === "M" ? "👨" : "👩"}</span>
          <input style={styles.nameInput} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Prénom" />
        </div>
        <div style={styles.formGrid}>
          <div style={styles.toggleRow}>
            {["M", "F"].map((s) => (
              <button key={s} style={{ ...styles.toggleBtn, ...(form.sex === s ? styles.toggleActive : {}) }} onClick={() => set("sex", s)}>
                {s === "M" ? "♂ Homme" : "♀ Femme"}
              </button>
            ))}
          </div>
          <div style={styles.inputRow}>
            <label style={styles.label}>Âge</label>
            <input type="number" style={styles.input} value={form.age} onChange={(e) => set("age", +e.target.value)} />
            <span style={styles.unit}>ans</span>
          </div>
          <div style={styles.inputRow}>
            <label style={styles.label}>Taille</label>
            <input type="number" style={styles.input} value={form.height} onChange={(e) => set("height", +e.target.value)} />
            <span style={styles.unit}>cm</span>
          </div>
          <div style={styles.inputRow}>
            <label style={styles.label}>Poids</label>
            <input type="number" style={styles.input} value={form.weight} onChange={(e) => set("weight", +e.target.value)} step="0.1" />
            <span style={styles.unit}>kg</span>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={styles.label}>Activité physique</label>
            <div style={styles.selectWrap}>
              <select style={styles.select} value={form.activity} onChange={(e) => set("activity", +e.target.value)}>
                {ACTIVITY_LEVELS.map((a) => (<option key={a.value} value={a.value}>{a.label} – {a.desc}</option>))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={styles.label}>Objectif</label>
            <div style={styles.selectWrap}>
              <select style={styles.select} value={form.objective} onChange={(e) => set("objective", +e.target.value)}>
                {OBJECTIVES.map((o) => (<option key={o.value} value={o.value}>{o.label} ({o.desc})</option>))}
              </select>
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <label style={styles.label}>Répartition repas</label>
            <div style={styles.selectWrap}>
              <select style={styles.select} value={form.mealSplit} onChange={(e) => set("mealSplit", e.target.value)}>
                {MEAL_SPLITS.map((s) => (<option key={s.value} value={s.value}>{s.label}</option>))}
              </select>
            </div>
          </div>
        </div>
        <div style={styles.previewBox}>
          <div style={styles.previewTitle}>Apport journalier estimé</div>
          <div style={styles.macroRow}><span style={styles.kcalBig}>{tdee} kcal</span></div>
          <div style={styles.macroRow}>
            <MacroPill label="P" value={macros.protein} color="#4ade80" suffix="g" />
            <MacroPill label="G" value={macros.fat} color="#facc15" suffix="g" />
            <MacroPill label="C" value={macros.carbs} color="#60a5fa" suffix="g" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button style={styles.btnPrimary} onClick={save}>✓ Enregistrer</button>
          {onDelete && <button style={styles.btnDanger} onClick={onDelete}>Supprimer</button>}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={styles.cardHeader}>
          <span style={styles.cardIcon}>{form.sex === "M" ? "👨" : "👩"}</span>
          <span style={styles.profileName}>{form.name}</span>
        </div>
        <button style={styles.btnSmall} onClick={() => setEditing(true)}>✏️</button>
      </div>
      <div style={styles.statRow}>
        <span>{form.age} ans</span><span>{form.height} cm</span><span>{form.weight} kg</span>
      </div>
      <div style={styles.macroRow}><span style={styles.kcalBig}>{tdee} kcal/j</span></div>
      <div style={styles.macroRow}>
        <MacroPill label="P" value={macros.protein} color="#4ade80" suffix="g" />
        <MacroPill label="G" value={macros.fat} color="#facc15" suffix="g" />
        <MacroPill label="C" value={macros.carbs} color="#60a5fa" suffix="g" />
      </div>
      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>{objective.label} · {split.label}</div>
    </div>
  );
}

function MacroPill({ label, value, color, suffix = "" }) {
  return (
    <span style={{ background: color + "22", color, padding: "3px 10px", borderRadius: 20, fontSize: 13, fontWeight: 700, letterSpacing: 0.3 }}>
      {label} {value}{suffix}
    </span>
  );
}

function IngredientPicker({ selected, onToggle }) {
  const [openCat, setOpenCat] = useState(null);
  const [search, setSearch] = useState("");
  const allFoods = Object.values(FOOD_DB).flat();
  const filtered = search.trim() ? allFoods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())) : null;

  return (
    <div>
      <input style={{ ...styles.input, width: "100%", marginBottom: 12, boxSizing: "border-box" }} placeholder="🔍 Rechercher un ingrédient…" value={search} onChange={(e) => setSearch(e.target.value)} />
      {filtered ? (
        <div style={styles.foodGrid}>
          {filtered.map((f) => {
            const active = selected.includes(f.id);
            return (<button key={f.id} style={{ ...styles.foodChip, ...(active ? styles.foodChipActive : {}) }} onClick={() => onToggle(f.id)}>{active ? "✓ " : ""}{f.name}</button>);
          })}
          {filtered.length === 0 && <div style={{ color: "#9ca3af", padding: 12, fontSize: 14 }}>Aucun résultat</div>}
        </div>
      ) : (
        CATEGORIES.map((cat) => (
          <div key={cat.key} style={{ marginBottom: 6 }}>
            <button style={styles.catHeader} onClick={() => setOpenCat(openCat === cat.key ? null : cat.key)}>
              <span>{cat.icon} {cat.label}</span>
              <span style={{ transform: openCat === cat.key ? "rotate(90deg)" : "none", transition: "0.2s" }}>›</span>
            </button>
            {openCat === cat.key && (
              <div style={styles.foodGrid}>
                {FOOD_DB[cat.key].map((f) => {
                  const active = selected.includes(f.id);
                  return (<button key={f.id} style={{ ...styles.foodChip, ...(active ? styles.foodChipActive : {}) }} onClick={() => onToggle(f.id)}>{active ? "✓ " : ""}{f.name}</button>);
                })}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function Home() {
  const [tab, setTab] = useState("profiles");
  const [profiles, setProfiles] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [recipeServings, setRecipeServings] = useState(4);
  const [loaded, setLoaded] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // Real-time listeners — data syncs instantly between devices
  useEffect(() => {
    const unsub1 = onSnapshot(PROFILES_DOC, (snap) => {
      if (snap.exists()) {
        try { setProfiles(JSON.parse(snap.data().data)); } catch {}
      }
      setSyncing(false);
      setLoaded(true);
    }, () => { setSyncing(false); setLoaded(true); });

    const unsub2 = onSnapshot(RECIPE_DOC, (snap) => {
      if (snap.exists()) {
        try {
          const parsed = JSON.parse(snap.data().data);
          if (Array.isArray(parsed)) {
            setRecipe(parsed);
          } else {
            setRecipe(parsed.items || []);
            setRecipeServings(parsed.servings || 4);
          }
        } catch {}
      }
    });

    return () => { unsub1(); unsub2(); };
  }, []);

  // Save to Firestore on changes (skip initial load)
  const [initialLoad, setInitialLoad] = useState(true);
  useEffect(() => {
    if (!loaded) return;
    if (initialLoad) { setInitialLoad(false); return; }
    saveProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    if (!loaded) return;
    saveRecipe({ items: recipe, servings: recipeServings });
  }, [recipe, recipeServings]);

  const addProfile = () => {
    setProfiles((p) => [...p, {
      id: Date.now(), name: "", sex: "M", age: 30, height: 175, weight: 75,
      activity: 1.55, objective: 0, mealSplit: "2meals", tdee: 0,
      macros: { protein: 0, fat: 0, carbs: 0 }, split: MEAL_SPLITS[0],
    }]);
  };

  const updateProfile = (idx, data) => setProfiles((p) => p.map((x, i) => (i === idx ? data : x)));
  const deleteProfile = (idx) => setProfiles((p) => p.filter((_, i) => i !== idx));
  const selectedIds = recipe.map((r) => r.id);

  const toggleIngredient = (id) => {
    if (selectedIds.includes(id)) {
      setRecipe((r) => r.filter((x) => x.id !== id));
    } else {
      const food = getFood(id);
      const defaultQty = food.displayUnit === "ml" ? 100 : food.displayUnit ? food.displayPer : 100;
      setRecipe((r) => [...r, { id, qty: defaultQty }]);
    }
  };

  const updateQty = (id, qty) => setRecipe((r) => r.map((x) => (x.id === id ? { ...x, qty: Math.max(0, qty) } : x)));

  const recipeTotals = recipe.reduce((acc, item) => {
    const food = getFood(item.id);
    if (!food) return acc;
    const factor = (item.qty / recipeServings) / 100;
    return { kcal: acc.kcal + food.kcal * factor, p: acc.p + food.p * factor, g: acc.g + food.g * factor, c: acc.c + food.c * factor };
  }, { kcal: 0, p: 0, g: 0, c: 0 });

  const getScaledRecipe = (profile, mealType) => {
    if (!profile.tdee || recipe.length === 0 || recipeTotals.kcal === 0) return null;
    const split = profile.split || MEAL_SPLITS[0];
    const mealFraction = mealType === "lunch" ? split.lunch : split.dinner;
    const mealKcal = profile.tdee * mealFraction;
    const mealMacros = { p: profile.macros.protein * mealFraction, g: profile.macros.fat * mealFraction, c: profile.macros.carbs * mealFraction };
    const scale = mealKcal / recipeTotals.kcal;
    const items = recipe.map((item) => {
      const food = getFood(item.id);
      const adjQty = Math.round((item.qty / recipeServings) * scale);
      const factor = adjQty / 100;
      return { food, baseQty: item.qty, adjQty, kcal: Math.round(food.kcal * factor), p: Math.round(food.p * factor * 10) / 10, g: Math.round(food.g * factor * 10) / 10, c: Math.round(food.c * factor * 10) / 10 };
    });
    const totals = items.reduce((a, i) => ({ kcal: a.kcal + i.kcal, p: a.p + i.p, g: a.g + i.g, c: a.c + i.c }), { kcal: 0, p: 0, g: 0, c: 0 });
    return { items, totals, target: { kcal: Math.round(mealKcal), ...mealMacros }, scale };
  };

  if (!loaded) return <div style={styles.container}><div style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>Connexion à Firebase…</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>MacroMeal</h1>
        <p style={styles.subtitle}>Portions ajustées, zéro prise de tête</p>
        {syncing && <p style={{ fontSize: 11, color: "#d1d5db", marginTop: 4 }}>Synchronisation…</p>}
      </div>

      <div style={styles.tabBar}>
        {[{ key: "profiles", label: "👤 Profils" }, { key: "recipe", label: "🍳 Recette" }, { key: "result", label: "📊 Portions" }].map((t) => (
          <button key={t.key} style={{ ...styles.tab, ...(tab === t.key ? styles.tabActive : {}) }} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      {tab === "profiles" && (
        <div>
          {profiles.map((p, i) => (
            <ProfileCard key={p.id} profile={p} onUpdate={(data) => updateProfile(i, data)} onDelete={() => deleteProfile(i)} />
          ))}
          <button style={styles.btnAdd} onClick={addProfile}>+ Ajouter un profil</button>
        </div>
      )}

      {tab === "recipe" && (
        <div>
          <div style={styles.card}>
            <h3 style={styles.sectionTitle}>Choisir les ingrédients</h3>
            <IngredientPicker selected={selectedIds} onToggle={toggleIngredient} />
          </div>
          <div style={styles.card}>
            <div style={styles.qtyRow}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>Pour combien de personnes ?</span>
              <div style={styles.qtyControls}>
                <button style={styles.qtyBtn} onClick={() => setRecipeServings((s) => Math.max(1, s - 1))}>−</button>
                <span style={styles.qtyValue}>{recipeServings} pers.</span>
                <button style={styles.qtyBtn} onClick={() => setRecipeServings((s) => s + 1)}>+</button>
              </div>
            </div>
          </div>
          {recipe.length > 0 && (
            <div style={styles.card}>
              <h3 style={styles.sectionTitle}>Quantités totales de la recette</h3>
              <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 12px" }}>
                Entre les quantités totales pour {recipeServings} personne{recipeServings > 1 ? "s" : ""}. L&apos;app calculera la portion par personne puis ajustera pour chaque profil.
              </p>
              {recipe.map((item) => {
                const food = getFood(item.id);
                if (!food) return null;
                const isDisplayUnit = !!food.displayUnit;
                return (
                  <div key={item.id} style={styles.qtyRow}>
                    <span style={styles.qtyName}>{food.name}</span>
                    {isDisplayUnit ? (
                      <div style={styles.qtyControls}>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, Math.max(displayStep(food), item.qty - displayStep(food)))}>−</button>
                        <span style={styles.qtyValue}>{formatQty(food, item.qty)}</span>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + displayStep(food))}>+</button>
                      </div>
                    ) : (
                      <div style={styles.qtyControls}>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty - food.step)}>−</button>
                        <input
                          type="number"
                          inputMode="numeric"
                          style={styles.qtyInput}
                          value={item.qty}
                          onChange={(e) => updateQty(item.id, Math.max(0, parseInt(e.target.value) || 0))}
                        />
                        <span style={{ fontSize: 13, color: "#9ca3af" }}>g</span>
                        <button style={styles.qtyBtn} onClick={() => updateQty(item.id, item.qty + food.step)}>+</button>
                      </div>
                    )}
                    <button style={styles.qtyDeleteBtn} onClick={() => toggleIngredient(item.id)}>×</button>
                  </div>
                );
              })}
              <div style={styles.totalBar}>
                <span style={{ fontWeight: 700 }}>Total recette ({recipeServings} pers.)</span>
                <div style={styles.macroRow}>
                  <span style={styles.totalKcal}>{Math.round(recipeTotals.kcal * recipeServings)} kcal</span>
                  <MacroPill label="P" value={Math.round(recipeTotals.p * recipeServings)} color="#4ade80" suffix="g" />
                  <MacroPill label="G" value={Math.round(recipeTotals.g * recipeServings)} color="#facc15" suffix="g" />
                  <MacroPill label="C" value={Math.round(recipeTotals.c * recipeServings)} color="#60a5fa" suffix="g" />
                </div>
                <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 8, marginTop: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#6b7280" }}>Par personne</span>
                  <div style={styles.macroRow}>
                    <span style={{ ...styles.totalKcal, fontSize: 13 }}>{Math.round(recipeTotals.kcal)} kcal</span>
                    <MacroPill label="P" value={Math.round(recipeTotals.p)} color="#4ade80" suffix="g" />
                    <MacroPill label="G" value={Math.round(recipeTotals.g)} color="#facc15" suffix="g" />
                    <MacroPill label="C" value={Math.round(recipeTotals.c)} color="#60a5fa" suffix="g" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "result" && (
        <div>
          {profiles.length === 0 && <div style={styles.emptyState}><p>Ajoute d&apos;abord des profils dans l&apos;onglet 👤 Profils</p></div>}
          {recipe.length === 0 && <div style={styles.emptyState}><p>Compose ta recette dans l&apos;onglet 🍳 Recette</p></div>}
          {profiles.length > 0 && recipe.length > 0 && recipeTotals.kcal > 0 && (() => {
            const allPortions = profiles.flatMap((profile) =>
              ["lunch", "dinner"].map((meal) => ({ profile, meal, result: getScaledRecipe(profile, meal) }))
            ).filter((x) => x.result);
            if (allPortions.length === 0) return null;

            // Somme de toutes les portions par ingrédient
            const totalByIngredient = {};
            allPortions.forEach(({ result }) => {
              result.items.forEach((item) => {
                totalByIngredient[item.food.id] = (totalByIngredient[item.food.id] || 0) + item.adjQty;
              });
            });
            const recipeIngredients = recipe.map((r) => getFood(r.id)).filter(Boolean);

            return (
              <>
                {/* ── TOTAL À CUISINER ── */}
                <div style={styles.card}>
                  <h3 style={styles.sectionTitle}>🍳 Quantités totales à cuisiner</h3>
                  <p style={{ fontSize: 13, color: "#9ca3af", margin: "0 0 12px" }}>
                    Ce que vous mettez dans la casserole pour tout le monde ({profiles.length} profil{profiles.length > 1 ? "s" : ""} × déj + dîner)
                  </p>
                  {recipeIngredients.map((food) => {
                    const rawTotal = practicalRound(totalByIngredient[food.id] || 0);
                    const ratio = COOKED_RATIO[food.id];
                    let qtyLabel;
                    if (food.displayUnit) {
                      qtyLabel = formatQty(food, rawTotal);
                    } else {
                      qtyLabel = `${rawTotal}g`;
                    }
                    return (
                      <div key={food.id} style={styles.portionRow}>
                        <span style={styles.portionName}>{food.name}</span>
                        <span style={{ ...styles.portionQty, fontSize: 13 }}>{qtyLabel}</span>
                      </div>
                    );
                  })}
                </div>

                {/* ── RÉPARTITION PAR PROFIL ── */}
                <div style={{ margin: "4px 12px 8px", fontSize: 13, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Répartition des portions
                </div>
                {profiles.map((profile) => {
                  if (!profile.tdee) return null;
                  return (
                    <div key={profile.id} style={styles.card}>
                      <div style={styles.cardHeader}>
                        <span style={styles.cardIcon}>{profile.sex === "M" ? "👨" : "👩"}</span>
                        <span style={styles.profileName}>{profile.name || "Sans nom"}</span>
                        <span style={{ fontSize: 13, color: "#9ca3af", marginLeft: 8 }}>{profile.tdee} kcal/jour</span>
                      </div>
                      {["lunch", "dinner"].map((meal) => {
                        const result = getScaledRecipe(profile, meal);
                        if (!result) return null;
                        return (
                          <div key={meal} style={styles.mealBlock}>
                            <div style={styles.mealHeader}>
                              <span style={styles.mealIcon}>{meal === "lunch" ? "☀️" : "🌙"}</span>
                              <span style={styles.mealTitle}>{meal === "lunch" ? "Déjeuner" : "Dîner"}</span>
                              <span style={styles.mealScale}>×{Math.round(result.scale * 100) / 100} vs base</span>
                            </div>
                            <div>
                              {result.items.map((item) => {
                                const ratio = COOKED_RATIO[item.food.id];
                                let qtyLabel;
                                if (item.food.displayUnit) {
                                  qtyLabel = formatQty(item.food, item.adjQty);
                                } else if (ratio) {
                                  qtyLabel = `≈\u00a0${Math.round(item.adjQty * ratio)}g cuit`;
                                } else {
                                  qtyLabel = `${Math.round(item.adjQty)}g`;
                                }
                                return (
                                  <div key={item.food.id} style={styles.portionRow}>
                                    <span style={styles.portionName}>{item.food.name}</span>
                                    <span style={styles.portionQty}>{qtyLabel}</span>
                                  </div>
                                );
                              })}
                            </div>
                            <div style={styles.mealTotals}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                                <span style={{ fontWeight: 700, fontSize: 15 }}>{Math.round(result.totals.kcal)} kcal</span>
                                <div style={{ display: "flex", gap: 6 }}>
                                  <MacroPill label="P" value={Math.round(result.totals.p)} color="#4ade80" suffix="g" />
                                  <MacroPill label="G" value={Math.round(result.totals.g)} color="#facc15" suffix="g" />
                                  <MacroPill label="C" value={Math.round(result.totals.c)} color="#60a5fa" suffix="g" />
                                </div>
                              </div>
                              <div style={{ marginTop: 4 }}>
                                <span style={{ color: "#6b7280", fontSize: 12 }}>
                                  Cible : {Math.round(result.target.kcal)} kcal · P {Math.round(result.target.p)}g · G {Math.round(result.target.g)}g · C {Math.round(result.target.c)}g
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const styles = {
  container: { maxWidth: 480, margin: "0 auto", color: "#1f2937", paddingBottom: 40, minHeight: "100vh" },
  header: { textAlign: "center", padding: "28px 16px 12px" },
  title: { fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -1, background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  subtitle: { fontSize: 14, color: "#9ca3af", margin: "4px 0 0", fontWeight: 400 },
  tabBar: { display: "flex", gap: 4, background: "#f3f4f6", borderRadius: 14, margin: "0 12px 16px", padding: 4 },
  tab: { flex: 1, padding: "10px 0", border: "none", background: "transparent", borderRadius: 11, fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#6b7280", transition: "all 0.2s" },
  tabActive: { background: "#fff", color: "#1f2937", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" },
  card: { background: "#fff", borderRadius: 16, padding: 16, margin: "0 12px 12px", border: "1px solid #f3f4f6", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" },
  cardHeader: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 },
  cardIcon: { fontSize: 24 },
  profileName: { fontSize: 18, fontWeight: 700 },
  nameInput: { fontSize: 18, fontWeight: 700, border: "none", borderBottom: "2px solid #e5e7eb", outline: "none", padding: "4px 0", background: "transparent", width: 160 },
  formGrid: { display: "flex", flexDirection: "column", gap: 6 },
  toggleRow: { display: "flex", gap: 6, marginBottom: 6 },
  toggleBtn: { flex: 1, padding: "8px 0", border: "2px solid #e5e7eb", borderRadius: 10, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" },
  toggleActive: { borderColor: "#f59e0b", background: "#fffbeb", color: "#b45309" },
  inputRow: { display: "flex", alignItems: "center", gap: 8 },
  label: { fontSize: 13, fontWeight: 600, color: "#6b7280", width: 70, flexShrink: 0 },
  input: { flex: 1, padding: "8px 10px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 15, outline: "none" },
  unit: { fontSize: 13, color: "#9ca3af", width: 28 },
  selectWrap: { marginTop: 4 },
  select: { width: "100%", padding: "8px 10px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, background: "#fff", outline: "none" },
  previewBox: { marginTop: 12, padding: 12, background: "#fefce8", borderRadius: 12, border: "1px solid #fde68a" },
  previewTitle: { fontSize: 12, fontWeight: 700, color: "#b45309", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 },
  macroRow: { display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center", marginTop: 4 },
  kcalBig: { fontSize: 20, fontWeight: 800, color: "#b45309" },
  statRow: { display: "flex", gap: 12, fontSize: 14, color: "#6b7280", marginBottom: 8 },
  btnPrimary: { flex: 1, padding: "10px 0", border: "none", borderRadius: 10, background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer" },
  btnDanger: { padding: "10px 16px", border: "2px solid #fca5a5", borderRadius: 10, background: "#fff", color: "#ef4444", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  btnSmall: { padding: "4px 8px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 14, cursor: "pointer" },
  btnAdd: { display: "block", width: "calc(100% - 24px)", margin: "0 12px", padding: "14px 0", border: "2px dashed #d1d5db", borderRadius: 14, background: "transparent", fontSize: 15, fontWeight: 600, color: "#6b7280", cursor: "pointer" },
  sectionTitle: { fontSize: 16, fontWeight: 700, margin: "0 0 12px" },
  catHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 12px", border: "1px solid #f3f4f6", borderRadius: 10, background: "#fafafa", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  foodGrid: { display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 0" },
  foodChip: { padding: "6px 12px", border: "1.5px solid #e5e7eb", borderRadius: 20, background: "#fff", fontSize: 13, cursor: "pointer", transition: "all 0.15s" },
  foodChipActive: { borderColor: "#f59e0b", background: "#fffbeb", color: "#b45309", fontWeight: 600 },
  qtyRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" },
  qtyName: { fontSize: 14, fontWeight: 500 },
  qtyControls: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: { width: 32, height: 32, border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" },
  qtyValue: { minWidth: 90, textAlign: "center", fontSize: 14, fontWeight: 600 },
  qtyInput: { width: 64, textAlign: "center", fontSize: 15, fontWeight: 600, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "4px 6px", outline: "none", MozAppearance: "textfield" },
  qtyDeleteBtn: { marginLeft: 6, width: 26, height: 26, border: "1.5px solid #fca5a5", borderRadius: 6, background: "#fff5f5", color: "#ef4444", fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, flexShrink: 0 },
  totalBar: { marginTop: 12, padding: 12, background: "#f9fafb", borderRadius: 10, display: "flex", flexDirection: "column", gap: 6 },
  totalKcal: { fontWeight: 800, fontSize: 15, color: "#b45309" },
  mealBlock: { margin: "12px 0", padding: 12, background: "#fafafa", borderRadius: 12, border: "1px solid #f3f4f6" },
  mealHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10 },
  mealIcon: { fontSize: 20 },
  mealTitle: { fontSize: 15, fontWeight: 700 },
  mealScale: { fontSize: 12, color: "#9ca3af", marginLeft: "auto" },
  portionRow: { display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14 },
  portionName: { color: "#374151" },
  portionQty: { fontWeight: 700, color: "#1f2937" },
  mealTotals: { marginTop: 10, padding: "8px 10px", background: "#fff", borderRadius: 8 },
  emptyState: { textAlign: "center", padding: 40, color: "#9ca3af", fontSize: 14 },
};
