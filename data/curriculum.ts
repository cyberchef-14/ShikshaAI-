import { ConceptNode, LessonSegment, Quiz, QuizType } from '../types';

// The "Concept Knowledge Graph" - Class 10 Science
export const CONCEPT_GRAPH: ConceptNode[] = [
  {
    id: 'c10_chem_rxn_full',
    title: 'Chemical Reactions',
    description: 'Complete NCERT Chapter 1: Line-by-Line coverage.',
    microNote: 'Chemical Change = New Substance formed. It is Permanent! (Unlike melting ice)',
    flashcard: {
        front: "What are the 4 main observations of a Chemical Reaction?",
        back: "1. Change in State\n2. Change in Color\n3. Evolution of Gas\n4. Change in Temperature"
    },
    xpValue: 500,
    prerequisites: [],
    category: 'Chemistry'
  },
  {
    id: 'c10_acids_bases',
    title: 'Acids, Bases & Salts',
    description: 'Understanding pH, Indicators, and salt formation.',
    microNote: 'Acids = Sour + Red Litmus. Bases = Bitter + Blue Litmus. pH 7 is Neutral.',
    flashcard: {
        front: "What is the result of a Neutralization Reaction?",
        back: "Acid + Base → Salt + Water\n(Example: HCl + NaOH → NaCl + H₂O)"
    },
    xpValue: 450,
    prerequisites: ['c10_chem_rxn_full'],
    category: 'Chemistry'
  },
  {
    id: 'c10_life_proc',
    title: 'Life Processes',
    description: 'Nutrition, Respiration, Transportation, and Excretion.',
    microNote: '4 Pillars of Life: Eat (Nutrition), Breathe (Respiration), Flow (Transport), Clean (Excretion).',
    flashcard: {
        front: "Difference between Aerobic and Anaerobic Respiration?",
        back: "Aerobic uses Oxygen (High Energy/ATP).\nAnaerobic is without Oxygen (Low Energy, produces Lactic Acid/Ethanol)."
    },
    xpValue: 600,
    prerequisites: [],
    category: 'Biology'
  },
  {
    id: 'c10_light',
    title: 'Light: Reflection',
    description: 'Laws of reflection, spherical mirrors, and lenses.',
    microNote: 'Reflection bounces back. Refraction bends. Light always travels in a straight line!',
    flashcard: {
        front: "What is the relationship between Radius of Curvature (R) and Focal Length (f)?",
        back: "R = 2f\n(The focus is exactly halfway between the pole and the center of curvature)."
    },
    xpValue: 400,
    prerequisites: [],
    category: 'Physics'
  }
];

// QUIZ DATA
export const QUIZZES: Record<string, Quiz> = {
  'c10_chem_rxn_full': {
    id: 'quiz_chem_1',
    chapterId: 'c10_chem_rxn_full',
    type: QuizType.STANDARD,
    title: 'Chemical Reactions Mastery Test',
    durationMinutes: 10,
    questions: [
      {
        id: 'q1',
        text: 'In the reaction: Fe2O3 + 2Al -> Al2O3 + 2Fe. What type of reaction is this?',
        options: ['Combination Reaction', 'Double Displacement', 'Displacement Reaction', 'Decomposition'],
        correctIndex: 2,
        conceptTag: 'Reaction Types',
        explanation: 'Aluminum is more reactive than Iron, so it displaces Iron from its oxide.'
      },
      {
        id: 'q2',
        text: 'Which of the following is a balanced equation?',
        options: ['Mg + O2 -> MgO', '2Mg + O2 -> 2MgO', 'Mg + O2 -> 2MgO', 'Mg + 2O2 -> MgO'],
        correctIndex: 1,
        conceptTag: 'Balancing Equations',
        explanation: 'Count atoms: Left (2 Mg, 2 O), Right (2 Mg, 2 O). It is balanced.'
      },
      {
        id: 'q3',
        text: 'When Ferrous Sulphate is heated, it decomposes to release:',
        options: ['O2 gas', 'SO2 and SO3 gas', 'H2 gas', 'Cl2 gas'],
        correctIndex: 1,
        conceptTag: 'Decomposition',
        explanation: 'Thermal decomposition of FeSO4 yields Ferric Oxide, SO2, and SO3.'
      },
      {
        id: 'q4',
        text: 'Adding Dilute HCl to Zinc granules results in:',
        options: ['Hydrogen Gas', 'Oxygen Gas', 'Chlorine Gas', 'No Reaction'],
        correctIndex: 0,
        conceptTag: 'Reaction Types',
        explanation: 'Metal + Acid -> Salt + Hydrogen Gas.'
      },
      {
        id: 'q5',
        text: 'In Redox terms, gain of Oxygen is called:',
        options: ['Reduction', 'Oxidation', 'Corrosion', 'Rancidity'],
        correctIndex: 1,
        conceptTag: 'Redox',
        explanation: 'Oxidation is defined as the gain of Oxygen or loss of Hydrogen.'
      },
      {
        id: 'q6',
        text: 'Balance: _Fe + 4H2O -> Fe3O4 + 4H2',
        options: ['1', '2', '3', '4'],
        correctIndex: 2,
        conceptTag: 'Balancing Equations',
        explanation: 'We need 3 Iron (Fe) atoms on the LHS to match Fe3O4 on the RHS.'
      }
    ]
  },
  // NEW: Diagnostic Quiz (Baseline)
  'diagnostic_start': {
    id: 'quiz_diag_1',
    chapterId: 'diagnostic_start',
    type: QuizType.DIAGNOSTIC,
    title: 'Science Baseline Check',
    durationMinutes: 5,
    questions: [
        {
            id: 'd1',
            text: 'Which state of matter has a definite shape and volume?',
            options: ['Solid', 'Liquid', 'Gas', 'Plasma'],
            correctIndex: 0,
            conceptTag: 'Basic Matter',
            explanation: 'Solids have fixed particle arrangement.'
        },
        {
            id: 'd2',
            text: 'What is the powerhouse of the cell?',
            options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Cytoplasm'],
            correctIndex: 1,
            conceptTag: 'Cell Biology',
            explanation: 'Mitochondria generate most of the chemical energy (ATP).'
        },
        {
            id: 'd3',
            text: 'Force is defined as:',
            options: ['Mass x Velocity', 'Mass x Acceleration', 'Mass / Volume', 'Speed / Time'],
            correctIndex: 1,
            conceptTag: 'Newton Laws',
            explanation: 'F = ma (Newton\'s Second Law).'
        }
    ]
  },
  // NEW: Micro Quiz (Concept Check)
  'micro_chem_1': {
      id: 'quiz_micro_chem',
      chapterId: 'c10_chem_rxn_full',
      type: QuizType.MICRO,
      title: 'Quick Check: Balancing',
      durationMinutes: 2,
      questions: [
          {
              id: 'm1',
              text: 'Is H2 + O2 -> H2O balanced?',
              options: ['Yes', 'No'],
              correctIndex: 1,
              conceptTag: 'Balancing Basics',
              explanation: 'No. Reactants have 2 Oxygen atoms, Product has only 1.'
          },
          {
              id: 'm2',
              text: 'What is the coefficient of H2 in: N2 + _H2 -> 2NH3',
              options: ['1', '2', '3', '4'],
              correctIndex: 2,
              conceptTag: 'Coefficients',
              explanation: 'To have 6 Hydrogen atoms (2*3) on right, we need 3 H2 on left.'
          }
      ]
  },
  // NEW: Confidence Quiz (Anxiety Check)
  'conf_chem_1': {
      id: 'quiz_conf_chem',
      chapterId: 'c10_chem_rxn_full',
      type: QuizType.CONFIDENCE,
      title: 'Confidence Builder: Reactions',
      durationMinutes: 3,
      questions: [
          {
              id: 'c1',
              text: 'Burning of paper is a _____ change.',
              options: ['Physical', 'Chemical'],
              correctIndex: 1,
              conceptTag: 'Chemical Change',
              explanation: 'Ash cannot be turned back into paper. New substance is formed.'
          },
          {
              id: 'c2',
              text: 'Iron rusting in air is an example of:',
              options: ['Corrosion', 'Reduction', 'Displacement', 'None'],
              correctIndex: 0,
              conceptTag: 'Corrosion',
              explanation: 'Rust is Hydrated Iron Oxide formed due to attack by moisture.'
          }
      ]
  }
};

// Content Bank: FULL CHAPTER FLOW (Line by Line NCERT)
export const LESSON_CONTENT: Record<string, LessonSegment[]> = {
  'c10_chem_rxn_full': [
    // --- SECTION 1: CHEMICAL CHANGES & OBSERVATIONS ---
    {
      id: 'cr_1',
      type: 'explanation',
      contentEn: "Welcome to a detailed walkthrough of Chapter 1. We will read between the lines of NCERT. First, consider daily situations: Milk left open in summer, Grapes fermenting, Food cooking. These are all CHEMICAL CHANGES.",
      contentHi: "Chapter 1 ke vistrit walkthrough mein swagat hai. Hum NCERT ki har line samjhenge. Pehle, roz ki baatein: Garmi mein doodh khula chhodna, Angoor ka sadna, Khana pakna. Yeh sab CHEMICAL CHANGES hain.",
      visualAsset: '⚗️'
    },
    {
      id: 'cr_2',
      type: 'explanation',
      contentEn: "Activity 1.1: Burn a Magnesium ribbon. Rub it with sandpaper first (to remove the oxide layer). It burns with a dazzling WHITE FLAME and changes into white powder (Magnesium Oxide).",
      contentHi: "Activity 1.1: Magnesium ribbon ko jalayein. Pehle sandpaper se ragad lein (oxide layer hatane ke liye). Yeh chamakdar WHITE FLAME ke saath jalta hai aur white powder (Magnesium Oxide) banta hai.",
      visualAsset: '🔥'
    },
    {
      id: 'cr_3',
      type: 'explanation',
      contentEn: "Activity 1.2: Take Lead Nitrate solution (Colorless) and add Potassium Iodide solution. You will see a YELLOW precipitate of Lead Iodide. This color change indicates a chemical reaction.",
      contentHi: "Activity 1.2: Lead Nitrate solution lein aur usme Potassium Iodide milayein. Aapko ek YELLOW precipitate (Lead Iodide) dikhega. Rang badalna chemical reaction ka sanket hai.",
      visualAsset: '🧪 🟡'
    },
    {
      id: 'cr_4',
      type: 'explanation',
      contentEn: "Activity 1.3: Zinc granules + Dilute Sulphuric Acid/HCl. You will see bubbles. This is HYDROGEN gas. Touch the flask—it feels HOT. Reaction is Exothermic.",
      contentHi: "Activity 1.3: Zinc ke tukde + Dilute Sulphuric Acid/HCl. Bulboole dikhenge. Yeh HYDROGEN gas hai. Flask ko chhune par GARM lagega. Reaction Exothermic hai.",
      visualAsset: '🌡️'
    },
    {
      id: 'cr_5',
      type: 'mini_game',
      contentEn: "So, how do we know a Chemical Reaction has taken place? Select the correct observation:",
      contentHi: "Toh, humein kaise pata chalta hai ki Chemical Reaction hua hai? Sahi observation chunein:",
      question: "Signs of Chemical Reaction:",
      options: ["Change in State & Color", "Evolution of Gas & Change in Temp", "All of the Above"],
      correctIndex: 2,
      visualAsset: '🧐'
    },

    // --- SECTION 2: CHEMICAL EQUATIONS ---
    {
      id: 'cr_6',
      type: 'explanation',
      contentEn: "Writing sentences is long. We use Word Equations: Magnesium + Oxygen → Magnesium oxide. (Reactants on Left, Products on Right).",
      contentHi: "Sentences likhna lamba hai. Hum Word Equations use karte hain: Magnesium + Oxygen → Magnesium oxide. (Reactants Left mein, Products Right mein).",
      visualAsset: '📝'
    },
    {
      id: 'cr_7',
      type: 'explanation',
      contentEn: "Even shorter: Chemical Formulae. Mg + O2 → MgO. This is a 'Skeletal Equation' because it's not balanced yet. Mass is not equal on both sides.",
      contentHi: "Aur chhota: Chemical Formulae. Mg + O2 → MgO. Yeh 'Skeletal Equation' hai kyunki yeh abhi balanced nahi hai. Dono taraf mass barabar nahi hai.",
      visualAsset: '☠️'
    },
    {
      id: 'cr_8',
      type: 'explanation',
      contentEn: "Why Balance? 'Law of Conservation of Mass'. Mass can neither be created nor destroyed. Total mass of elements in products MUST equal total mass in reactants.",
      contentHi: "Balance kyun karein? 'Law of Conservation of Mass'. Mass na banaya ja sakta hai na mitaya. Products ka total mass Reactants ke barabar HONA chahiye.",
      visualAsset: '⚖️'
    },
    {
      id: 'cr_9',
      type: 'explanation',
      contentEn: "Let's balance: Fe + H2O → Fe3O4 + H2. (Iron + Steam). Step 1: Count atoms. Fe: 1 (L) vs 3 (R). Oxygen: 1 (L) vs 4 (R).",
      contentHi: "Chalo balance karein: Fe + H2O → Fe3O4 + H2. (Loha + Bhaap). Step 1: Atoms gino. Fe: 1 (L) vs 3 (R). Oxygen: 1 (L) vs 4 (R).",
      visualAsset: '🧮'
    },
    {
      id: 'cr_10',
      type: 'explanation',
      contentEn: "Start with the biggest compound (Fe3O4). Balance Oxygen first by putting '4' before H2O. Now: Fe + 4H2O → Fe3O4 + H2. Oxygen is balanced (4=4).",
      contentHi: "Sabse bade compound (Fe3O4) se shuru karein. Pehle Oxygen balance karein H2O ke aage '4' lagakar. Ab: Fe + 4H2O → Fe3O4 + H2. Oxygen barabar hai (4=4).",
      visualAsset: '4️⃣'
    },
    {
      id: 'cr_11',
      type: 'explanation',
      contentEn: "Now Hydrogen is 8 on Left (4*2). Put '4' before H2 on Right. Finally, put '3' before Fe. Balanced: 3Fe + 4H2O → Fe3O4 + 4H2.",
      contentHi: "Ab Hydrogen Left mein 8 hai (4*2). Right mein H2 ke aage '4' lagayein. Aakhri mein Fe ke aage '3'. Balanced: 3Fe + 4H2O → Fe3O4 + 4H2.",
      visualAsset: '✅'
    },
    {
      id: 'cr_12',
      type: 'explanation',
      contentEn: "Don't forget Physical States! (s) solid, (l) liquid, (g) gas, (aq) aqueous/solution in water. 3Fe(s) + 4H2O(g) → Fe3O4(s) + 4H2(g). Note: H2O is (g) because it's steam here.",
      contentHi: "Physical States mat bhoolna! (s) solid, (l) liquid, (g) gas, (aq) aqueous/pani mein ghula. 3Fe(s) + 4H2O(g) → Fe3O4(s) + 4H2(g). Note: H2O (g) hai kyunki yeh bhaap hai.",
      visualAsset: '💨'
    },
    {
      id: 'cr_13',
      type: 'explanation',
      contentEn: "Sometimes we write reaction conditions (temp, pressure, catalyst) on the arrow. Example: Photosynthesis equation requires 'Sunlight' and 'Chlorophyll' on the arrow.",
      contentHi: "Kabhi hum reaction conditions (taapman, pressure, catalyst) arrow par likhte hain. Jaise Photosynthesis equation mein 'Sunlight' aur 'Chlorophyll' likhte hain.",
      visualAsset: '☀️'
    },

    // --- SECTION 3: COMBINATION REACTIONS ---
    {
      id: 'cr_14',
      type: 'explanation',
      contentEn: "Type 1: Combination Reaction. Activity 1.4: Calcium Oxide (Quick Lime) + Water. It reacts VIGOROUSLY to form Calcium Hydroxide (Slaked Lime) and releases HUGE HEAT.",
      contentHi: "Type 1: Combination Reaction. Activity 1.4: Calcium Oxide (Quick Lime) + Pani. Yeh zor se react karke Calcium Hydroxide (Slaked Lime) banata hai aur bohot GARMI nikalti hai.",
      visualAsset: '🧱'
    },
    {
      id: 'cr_15',
      type: 'explanation',
      contentEn: "Equation: CaO(s) + H2O(l) → Ca(OH)2(aq) + Heat. 'Slaked Lime' is used for whitewashing walls.",
      contentHi: "Equation: CaO(s) + H2O(l) → Ca(OH)2(aq) + Heat. 'Slaked Lime' ka upyog diwaro ki putai (whitewashing) ke liye hota hai.",
      visualAsset: '🏠'
    },
    {
      id: 'cr_16',
      type: 'surprise_question',
      contentEn: "Why do whitewashed walls shine after 2-3 days? Because Ca(OH)2 reacts with CO2 in air to form a thin layer of...?",
      contentHi: "Putai ki hui diwarein 2-3 din baad kyun chamakti hain? Kyunki Ca(OH)2 hawa ki CO2 se react karke kya banata hai?",
      question: "Shiny layer on walls is:",
      options: ["Calcium Oxide", "Calcium Carbonate (Marble)"],
      correctIndex: 1,
      visualAsset: '✨'
    },
    {
      id: 'cr_17',
      type: 'explanation',
      contentEn: "Burning of Coal (C + O2 → CO2) and Formation of Water (2H2 + O2 → 2H2O) are also Combination reactions. Simply: Two reactants become One product.",
      contentHi: "Koyle ka jalna (C + O2 → CO2) aur Pani ka banna (2H2 + O2 → 2H2O) bhi Combination reactions hain. Seedha sa: Do cheezein milkar Ek ban gayi.",
      visualAsset: '➕'
    },
    {
      id: 'cr_18',
      type: 'explanation',
      contentEn: "Since heat is released in Quick Lime reaction, it is EXOTHERMIC. Other Exothermic examples: Burning natural gas (CH4 + 2O2 → CO2 + 2H2O), and RESPIRATION.",
      contentHi: "Kyunki Quick Lime reaction mein garmi nikli, yeh EXOTHERMIC hai. Aur examples: Natural gas ka jalna, aur RESPIRATION (Saans lena).",
      visualAsset: '🔥'
    },
    {
      id: 'cr_19',
      type: 'explanation',
      contentEn: "Wait, Respiration is Exothermic? Yes! Glucose breaks down with Oxygen to give Energy. C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy.",
      contentHi: "Kya Respiration Exothermic hai? Haan! Glucose Oxygen ke saath toot kar Energy deta hai. C6H12O6 + 6O2 → 6CO2 + 6H2O + Energy.",
      visualAsset: '🏃'
    },

    // --- SECTION 4: DECOMPOSITION REACTIONS ---
    {
      id: 'cr_20',
      type: 'explanation',
      contentEn: "Type 2: Decomposition. Activity 1.5: Heat Ferrous Sulphate crystals (Green). Water evaporates, color changes to white, then decomposes to Ferric Oxide (Red-Brown) + SO2 + SO3.",
      contentHi: "Type 2: Decomposition. Activity 1.5: Ferrous Sulphate crystals (Hare) ko garm karein. Pani ud jata hai, rang safed hota hai, phir Ferric Oxide (Lal-Brown) + SO2 + SO3 banta hai.",
      visualAsset: '🧪'
    },
    {
      id: 'cr_21',
      type: 'explanation',
      contentEn: "Smell that? It smells like burning sulphur. 2FeSO4(s) → Fe2O3(s) + SO2(g) + SO3(g). Reaction involves HEAT, so it is 'Thermal Decomposition'.",
      contentHi: "Woh smell aayi? Jale hue sulphur jaisi. 2FeSO4(s) → Fe2O3(s) + SO2(g) + SO3(g). Isme HEAT use hui, toh yeh 'Thermal Decomposition' hai.",
      visualAsset: '👃'
    },
    {
      id: 'cr_22',
      type: 'explanation',
      contentEn: "Another Example: Heating Limestone (CaCO3) gives Quick Lime (CaO) + CO2. Used in Cement industry.",
      contentHi: "Ek aur Example: Limestone (CaCO3) ko garm karne par Quick Lime (CaO) + CO2 milta hai. Cement industry mein use hota hai.",
      visualAsset: '🏗️'
    },
    {
      id: 'cr_23',
      type: 'explanation',
      contentEn: "Activity 1.6: Heat Lead Nitrate powder. You will hear cracking sounds and see BROWN FUMES. These fumes are Nitrogen Dioxide (NO2).",
      contentHi: "Activity 1.6: Lead Nitrate powder ko garm karein. Chat-chat ki awaaz aayegi aur BROWN FUMES (dhuan) dikhenge. Yeh Nitrogen Dioxide (NO2) hai.",
      visualAsset: '🌫️'
    },
    {
      id: 'cr_24',
      type: 'explanation',
      contentEn: "What about Electricity? Activity 1.7: Electrolysis of Water. Hydrogen collects at Cathode, Oxygen at Anode. Volume of H2 is DOUBLE of O2 (Because H2O has 2 H and 1 O).",
      contentHi: "Bijli ka kya? Activity 1.7: Pani ka Electrolysis. Cathode par Hydrogen, Anode par Oxygen. Hydrogen ka volume O2 se DUGNA hota hai (Kyunki H2O mein 2 H aur 1 O hai).",
      visualAsset: '⚡'
    },
    {
      id: 'cr_25',
      type: 'explanation',
      contentEn: "What about Sunlight? Activity 1.8: Put Silver Chloride (White) in sun. It turns GREY. 2AgCl → 2Ag + Cl2. Used in Black & White Photography.",
      contentHi: "Suraj ki roshni? Activity 1.8: Silver Chloride (Safed) ko dhoop mein rakhein. Woh GREY ho jata hai. 2AgCl → 2Ag + Cl2. Black & White Photography mein use hota hai.",
      visualAsset: '📸'
    },
    {
      id: 'cr_26',
      type: 'mini_game',
      contentEn: "Decomposition reactions require energy to break bonds. Reactions that ABSORB energy are called...?",
      contentHi: "Decomposition mein bonds todne ke liye energy chahiye. Jo reactions energy SOKH lete hain unhe kya kehte hain...?",
      question: "Reactions absorbing energy:",
      options: ["Exothermic", "Endothermic"],
      correctIndex: 1,
      visualAsset: '🔋'
    },

    // --- SECTION 5: DISPLACEMENT REACTIONS ---
    {
      id: 'cr_27',
      type: 'explanation',
      contentEn: "Type 3: Displacement. Activity 1.9: Put Iron nails in Copper Sulphate solution (Blue). After 20 mins, solution turns GREEN (Iron Sulphate) and nails become Brownish.",
      contentHi: "Type 3: Displacement. Activity 1.9: Lohe ki keelein Copper Sulphate (Neela) mein daalein. 20 min baad, solution HARA ho jata hai (Iron Sulphate) aur keelein Brownish.",
      visualAsset: '🔩'
    },
    {
      id: 'cr_28',
      type: 'explanation',
      contentEn: "Why? Iron is more reactive than Copper. It kicked Copper out. Fe(s) + CuSO4(aq) → FeSO4(aq) + Cu(s).",
      contentHi: "Kyun? Iron Copper se zyada reactive (takatwar) hai. Usne Copper ko bahar nikal diya. Fe(s) + CuSO4(aq) → FeSO4(aq) + Cu(s).",
      visualAsset: '🥊'
    },
    {
      id: 'cr_29',
      type: 'explanation',
      contentEn: "Other examples: Zinc + CuSO4 → ZnSO4 + Cu. Lead + CuCl2 → PbCl2 + Cu. Zinc and Lead are also more reactive than Copper.",
      contentHi: "Aur examples: Zinc + CuSO4 → ZnSO4 + Cu. Lead + CuCl2 → PbCl2 + Cu. Zinc aur Lead bhi Copper se zyada takatwar hain.",
      visualAsset: '🥈'
    },

    // --- SECTION 6: DOUBLE DISPLACEMENT ---
    {
      id: 'cr_30',
      type: 'explanation',
      contentEn: "Type 4: Double Displacement. Activity 1.10: Mix Sodium Sulphate and Barium Chloride. You see a WHITE substance formed that is insoluble in water.",
      contentHi: "Type 4: Double Displacement. Activity 1.10: Sodium Sulphate aur Barium Chloride milayein. Ek SAFED cheez banti hai jo pani mein nahi ghulti.",
      visualAsset: '🥛'
    },
    {
      id: 'cr_31',
      type: 'explanation',
      contentEn: "This insoluble solid is called a PRECIPITATE. Na2SO4 + BaCl2 → BaSO4 (White ppt) + 2NaCl. The ions switched partners (SO4 went to Ba, Cl went to Na).",
      contentHi: "Is na ghulne wale thos ko PRECIPITATE kehte hain. Na2SO4 + BaCl2 → BaSO4 (Safed ppt) + 2NaCl. Ions ne partner badal liye.",
      visualAsset: '🔄'
    },
    {
      id: 'cr_32',
      type: 'explanation',
      contentEn: "Recall Activity 1.2? Lead Nitrate + Potassium Iodide. The Yellow Precipitate was Lead Iodide (PbI2). That was also Double Displacement!",
      contentHi: "Activity 1.2 yaad hai? Lead Nitrate + Potassium Iodide. Woh Peela Precipitate Lead Iodide (PbI2) tha. Woh bhi Double Displacement tha!",
      visualAsset: '💡'
    },

    // --- SECTION 7: OXIDATION & REDUCTION ---
    {
      id: 'cr_33',
      type: 'explanation',
      contentEn: "Activity 1.11: Heat Copper powder. It becomes coated with BLACK Copper Oxide. 2Cu + O2 → 2CuO. Copper gained Oxygen -> Oxidation.",
      contentHi: "Activity 1.11: Copper powder ko garm karein. Woh KALA pad jata hai (Copper Oxide). 2Cu + O2 → 2CuO. Copper ko Oxygen mila -> Oxidation.",
      visualAsset: '⚫'
    },
    {
      id: 'cr_34',
      type: 'explanation',
      contentEn: "Now pass Hydrogen gas over this hot black CuO. It turns BROWN (back to Copper)! CuO + H2 → Cu + H2O.",
      contentHi: "Ab is kale CuO par Hydrogen gas chhodein. Yeh wapas BROWN ho jata hai! CuO + H2 → Cu + H2O.",
      visualAsset: '🔙'
    },
    {
      id: 'cr_35',
      type: 'explanation',
      contentEn: "In CuO + H2 → Cu + H2O: Copper Oxide lost Oxygen (Reduced). Hydrogen gained Oxygen (Oxidized). Since both happen, it is a REDOX reaction.",
      contentHi: "CuO + H2 → Cu + H2O mein: Copper Oxide ne Oxygen khoya (Reduced). Hydrogen ko Oxygen mila (Oxidized). Kyunki dono hue, yeh REDOX reaction hai.",
      visualAsset: '⚖️'
    },
    {
      id: 'cr_36',
      type: 'mini_game',
      contentEn: "Identify the substance Oxidized in: ZnO + C → Zn + CO",
      contentHi: "Isme Oxidized kya hua pehchano: ZnO + C → Zn + CO",
      question: "Substance Oxidized:",
      options: ["ZnO", "C (Carbon)"],
      correctIndex: 1,
      visualAsset: '🕵️'
    },

    // --- SECTION 8: CORROSION & RANCIDITY ---
    {
      id: 'cr_37',
      type: 'explanation',
      contentEn: "Everyday Oxidation: 1. Corrosion. When a metal is attacked by moisture/acids. Rusting of Iron (Red-brown), Black coating on Silver, Green coating on Copper.",
      contentHi: "Rozmarra ki Oxidation: 1. Corrosion. Jab metal nami/acid se kharab hota hai. Lohe ka Jung (Lal-brown), Chandi par kaali parat, Tambe par hari parat.",
      visualAsset: '🗽'
    },
    {
      id: 'cr_38',
      type: 'explanation',
      contentEn: "2. Rancidity. Have you tasted chips left open for days? Bad taste/smell. Fats/Oils get oxidized.",
      contentHi: "2. Rancidity. Khule chips ka taste kharab laga hai? Badboo aati hai. Tel/Fats oxidize ho jate hain.",
      visualAsset: '🍟'
    },
    {
      id: 'cr_39',
      type: 'explanation',
      contentEn: "Prevention: We add ANTIOXIDANTS to food. Or flush bags with NITROGEN gas (like in chips packets) to remove Oxygen.",
      contentHi: "Roktham: Hum khane mein ANTIOXIDANTS milate hain. Ya packets mein NITROGEN gas bharte hain (chips ki tarah) taaki Oxygen hat jaye.",
      visualAsset: '🛡️'
    },
    {
      id: 'cr_40',
      type: 'explanation',
      contentEn: "You have now covered EVERY line of Chapter 1! From Magnesium ribbon to Nitrogen in chips. You are a Master of Chemical Reactions!",
      contentHi: "Aapne Chapter 1 ki HAR line padh li hai! Magnesium ribbon se lekar Chips ki Nitrogen tak. Aap Chemical Reactions ke Master hain!",
      visualAsset: '🏆'
    }
  ],
  // ... (Keep other chapters as is or expand similarly in future) ...
  'c10_acids_bases': [
    {
      id: 'ab1',
      type: 'explanation',
      contentEn: "Welcome to Chapter 2: Acids, Bases and Salts! Acids are sour (like lemon) and turn Blue Litmus Red. Bases are bitter (like soap) and turn Red Litmus Blue.",
      contentHi: "Chapter 2: Acids, Bases aur Salts mein swagat hai! Acids khatte hote hain (nimbu jaise) aur Neela Litmus Laal karte hain. Bases kadve hote hain (sabun jaise) aur Laal Litmus Neela karte hain.",
      visualAsset: '🍋 🧼'
    },
    {
      id: 'ab2',
      type: 'explanation',
      contentEn: "Indicators tell us if something is Acid or Base. Natural: Turmeric (turns red in base). Synthetic: Phenolphthalein (Pink in base, Colorless in acid).",
      contentHi: "Indicators batate hain ki cheez Acid hai ya Base. Natural: Haldi (base mein laal). Synthetic: Phenolphthalein (Base mein Gulabi, Acid mein Rang-heen).",
      visualAsset: '🎨'
    },
    {
      id: 'ab3',
      type: 'explanation',
      contentEn: "Chemical Properties: Acid + Metal → Salt + Hydrogen Gas. (Pop sound test!). Base + Metal also gives H2 gas (e.g., Zinc + NaOH).",
      contentHi: "Chemical Properties: Acid + Metal → Salt + Hydrogen Gas. (Pop sound test!). Base + Metal bhi H2 gas deta hai (Jaise Zinc + NaOH).",
      visualAsset: '💥'
    },
    {
      id: 'ab4',
      type: 'explanation',
      contentEn: "Neutralization: Acid + Base → Salt + Water. Example: HCl + NaOH → NaCl (Common Salt) + H2O. They cancel each other out.",
      contentHi: "Neutralization: Acid + Base → Salt + Water. Example: HCl + NaOH → NaCl (Namak) + H2O. Woh ek dusre ko cancel kar dete hain.",
      visualAsset: '🤝'
    },
    {
      id: 'ab5',
      type: 'mini_game',
      contentEn: "What gas is released when an Acid reacts with a Metal?",
      contentHi: "Jab Acid Metal ke saath react karta hai toh kaunsi gas nikalti hai?",
      question: "Gas released:",
      options: ["Oxygen", "Hydrogen"],
      correctIndex: 1,
      visualAsset: '🎈'
    }
  ],
  'c10_life_proc': [
    {
      id: 'lp1',
      type: 'explanation',
      contentEn: "Biology Chapter 1: Life Processes. These are processes essential for maintaining life: Nutrition, Respiration, Transportation, Excretion.",
      contentHi: "Biology Chapter 1: Life Processes. Yeh woh kaam hain jo zinda rehne ke liye zaroori hain: Nutrition, Saans lena, Transport, aur Excretion.",
      visualAsset: '❤️'
    },
    {
      id: 'lp2',
      type: 'explanation',
      contentEn: "Nutrition: Autotrophic (Plants make food via Photosynthesis using Sunlight, CO2, H2O). Heterotrophic (Animals eat plants/others).",
      contentHi: "Nutrition: Autotrophic (Plants khana banate hain Photosynthesis se). Heterotrophic (Janwar plants/dusro ko khate hain).",
      visualAsset: '🌱 🦁'
    },
    {
      id: 'lp3',
      type: 'explanation',
      contentEn: "Human Digestion: Mouth (Saliva) → Oesophagus → Stomach (Acid kills bacteria) → Small Intestine (Complete digestion) → Large Intestine.",
      contentHi: "Insaani Pachan: Munh (Laar) → Oesophagus → Pet (Acid bacteria maarta hai) → Choti Aanth (Pura pachan) → Badi Aanth.",
      visualAsset: '🧍‍♂️'
    },
    {
      id: 'lp4',
      type: 'explanation',
      contentEn: "Respiration: Breaking down glucose to get energy (ATP). Aerobic (with Oxygen) gives more energy. Anaerobic (without Oxygen) gives less (like in muscles causing cramps).",
      contentHi: "Respiration: Glucose tod kar energy (ATP) lena. Aerobic (Oxygen ke saath) zyada energy deta hai. Anaerobic (bina Oxygen) kam deta hai (jaise muscles mein cramps).",
      visualAsset: '⚡'
    },
    {
      id: 'lp5',
      type: 'mini_game',
      contentEn: "Where does complete digestion of food take place?",
      contentHi: "Khane ka pura pachan kahan hota hai?",
      question: "Site of complete digestion:",
      options: ["Stomach", "Small Intestine"],
      correctIndex: 1,
      visualAsset: '🌭'
    }
  ],
  'c10_light': [
    {
      id: 'phy1',
      type: 'explanation',
      contentEn: "Physics: Light - Reflection & Refraction. Light travels in straight lines. Reflection is bouncing back of light from a shiny surface.",
      contentHi: "Physics: Light - Reflection & Refraction. Roshni seedhi chalti hai. Reflection matlab chamakdar satah se roshni ka wapas aana.",
      visualAsset: '🔦'
    },
    {
      id: 'phy2',
      type: 'explanation',
      contentEn: "Spherical Mirrors: Concave (Converging, focuses light). Convex (Diverging, spreads light). Rear-view mirrors in cars are CONVEX to see more area.",
      contentHi: "Gool Sheeshe: Concave (Roshni ikhattha karta hai). Convex (Roshni phailata hai). Gaadi ke side mirror CONVEX hote hain taaki zyada dikhe.",
      visualAsset: '🚗'
    },
    {
      id: 'phy3',
      type: 'explanation',
      contentEn: "Refraction: Bending of light when going from one medium to another (Air to Water). Swimming pools look shallower due to refraction.",
      contentHi: "Refraction: Roshni ka mudna jab woh ek madhyam se dusre mein jati hai (Hawa se Paani). Swimming pool kam gehra dikhta hai refraction ki wajah se.",
      visualAsset: '🏊'
    },
    {
      id: 'phy4',
      type: 'explanation',
      contentEn: "Lenses: Convex Lens (Magnifying glass). Concave Lens. Power of lens is measured in Dioptre (D).",
      contentHi: "Lenses: Convex Lens (Magnifying glass). Concave Lens. Lens ki power Dioptre (D) mein naapi jati hai.",
      visualAsset: '🔍'
    },
    {
      id: 'phy5',
      type: 'mini_game',
      contentEn: "Which mirror is used as a rear-view mirror in vehicles?",
      contentHi: "Gaadiyon mein peeche dekhne ke liye kaunsa mirror use hota hai?",
      question: "Rear-view mirror:",
      options: ["Concave", "Convex"],
      correctIndex: 1,
      visualAsset: '🪞'
    }
  ]
};
