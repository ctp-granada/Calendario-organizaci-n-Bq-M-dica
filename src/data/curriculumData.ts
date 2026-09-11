import { TemplateWeek } from '../types';

export const COURSE_INFO = {
  subject: 'Bioquímica Médica',
  degree: 'Grado en Medicina',
  faculty: 'Facultad de Medicina',
  university: 'Universidad de Granada',
  academicYear: 2026,
  semester: '2º Semestre (Febrero a Mayo)',
  groups: 'Grupos A y B (Subgrupos 1 al 15)',
  rooms: {
    practice: 'LAB L-5/6',
    seminar: 'AULA S3',
  },
  timeSlots: {
    morning: {
      label: 'Mañana (8:30 - 11:00 h)',
      range: '8:30 - 11:00 h',
      start: '08:30',
      end: '11:00',
    },
    afternoon: {
      label: 'Tarde (16:00 - 18:30 h)',
      range: '16:00 - 18:30 h',
      start: '16:00',
      end: '18:30',
    },
  },
  blocks: [
    {
      number: 1,
      practice: 'ELECTROFORESIS DE PROTEÍNAS',
      seminar: 'NUTRICIÓN Y NUTRIENTES',
    },
    {
      number: 2,
      practice: 'GLUCEMIA. PERFIL Y SIGNIFICACIÓN',
      seminar: 'ERRORES DEL MET DE HDC',
    },
    {
      number: 3,
      practice: 'PERFIL LIPÍDICO. SIGNIFICACIÓN',
      seminar: 'ERRORES DEL MET LIPÍDICO',
    },
    {
      number: 4,
      practice: 'DETERMINACIONES EN BIOQUÍMICA CLÍNICA',
      seminar: 'ALTERACIONES DEL MET DEL HEMO',
    },
  ],
};

// Official list of professors provided by the department
export const PROFESSORS_LIST: string[] = [
  'Patricia Porras',
  'Álvaro Ruiz San José',
  'Carolina Torres',
  'Francisco Hernández Torres',
  'Ana Ariza Cosano',
  'María Esther Farez Vidal',
  'Sergio Martínez Rodríguez',
  'Jesus Torres de Pinedo',
];

// Official departmental email mapping
export const PROFESSOR_EMAILS: Record<string, string> = {
  'Patricia Porras': 'pmporras@ugr.es',
  'Álvaro Ruiz San José': 'aruizsj@ugr.es',
  'Carolina Torres': 'ctp@ugr.es',
  'Francisco Hernández Torres': 'fhtorres@ugr.es',
  'Ana Ariza Cosano': 'anacosano@ugr.es',
  'María Esther Farez Vidal': 'efarez@ugr.es',
  'Sergio Martínez Rodríguez': 'sergio@ugr.es',
  'Jesus Torres de Pinedo': 'torrespi@ugr.es',
};

// Subgroups 1 to 15 assigned to Groups A and B
export const GROUP_CONFIG: Record<number, { groupLetter: 'A' | 'B'; label: string }> = {
  1: { groupLetter: 'A', label: 'Subgrupo 1 (Grupo A)' },
  2: { groupLetter: 'A', label: 'Subgrupo 2 (Grupo A)' },
  3: { groupLetter: 'A', label: 'Subgrupo 3 (Grupo A)' },
  4: { groupLetter: 'A', label: 'Subgrupo 4 (Grupo A)' },
  5: { groupLetter: 'A', label: 'Subgrupo 5 (Grupo A)' },
  6: { groupLetter: 'A', label: 'Subgrupo 6 (Grupo A)' },
  7: { groupLetter: 'A', label: 'Subgrupo 7 (Grupo A)' },
  8: { groupLetter: 'B', label: 'Subgrupo 8 (Grupo B)' },
  9: { groupLetter: 'B', label: 'Subgrupo 9 (Grupo B)' },
  10: { groupLetter: 'B', label: 'Subgrupo 10 (Grupo B)' },
  11: { groupLetter: 'B', label: 'Subgrupo 11 (Grupo B)' },
  12: { groupLetter: 'B', label: 'Subgrupo 12 (Grupo B)' },
  13: { groupLetter: 'B', label: 'Subgrupo 13 (Grupo B)' },
  14: { groupLetter: 'B', label: 'Subgrupo 14 (Grupo B)' },
  15: { groupLetter: 'B', label: 'Subgrupo 15 (Grupo B)' },
};

// 14-week schedule directly mapped from the official Medicina UGR cronograma diagram:
// Each week has 5 days (1: Lunes, 2: Martes, 3: Miércoles, 4: Jueves, 5: Viernes).
// Shift is initially 'mañana' (8:30-11:00), and professors are initially unassigned ("Sin asignar")
// so coordinators/teachers can select and assign them with the dropdown!
export const INITIAL_TEMPLATE_WEEKS: TemplateWeek[] = [
  // --- SEMANA 1: 15-19 FEBRERO (Sin prácticas ni seminarios) ---
  {
    weekIndex: 1,
    weekOffsetFromStart: 0,
    dateLabel: '15-19 febrero',
    practiceTitle: '',
    practiceRoom: '',
    seminarTitle: '',
    seminarRoom: '',
    theoryTopic: 'Introducción. Comunicación celular',
    isHolidayWeek: true,
    holidayReason: 'Semana sin prácticas ni seminarios (Comienzo del 2º cuatrimestre / Solo clases teóricas)',
    notes: 'Del 15 al 19 de febrero no hay docencia práctica ni seminarios. Las prácticas de laboratorio y seminarios comienzan la semana del 22 de febrero.',
    assignments: {
      practice: {},
      seminar: {},
    },
  },

  // --- BLOQUE 1: Electroforesis de Proteínas & Nutrición y Nutrientes (Semanas 2 a 4) ---
  {
    weekIndex: 2,
    weekOffsetFromStart: 1,
    dateLabel: '22-26 febrero',
    blockNumber: 1,
    practiceTitle: 'Electroforesis de Proteínas',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Nutrición y Nutrientes',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Digestión. Demanda energética.',
    notes: 'Comienzo oficial de las prácticas de laboratorio y seminarios.',
    assignments: {
      practice: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 3,
    weekOffsetFromStart: 2,
    dateLabel: '1-5 marzo*',
    blockNumber: 1,
    practiceTitle: 'Electroforesis de Proteínas',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Nutrición y Nutrientes',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Musc. Reg. Metabol. de h de carbono',
    notes: '* Semana con festivo autonómico (Día de Andalucía). Adaptado según docencia lectiva.',
    assignments: {
      practice: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 4,
    weekOffsetFromStart: 3,
    dateLabel: '8-12 marzo',
    blockNumber: 1,
    practiceTitle: 'Electroforesis de Proteínas',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Nutrición y Nutrientes',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Reg. Metabol. de h de carbono.',
    assignments: {
      practice: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
    },
  },

  // --- BLOQUE 2: Glucemia. Perfil y Significación & Errores del Met de HDC ---
  {
    weekIndex: 5,
    weekOffsetFromStart: 4,
    dateLabel: '15-19 marzo',
    blockNumber: 2,
    practiceTitle: 'Glucemia. Perfil y Significación',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Errores del Met de HDC',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Reg. Metabol. de h de carbono.',
    assignments: {
      practice: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 6,
    weekOffsetFromStart: 6, // Offset con Semana Santa intermedia
    dateLabel: '30 marzo - 2 abril*',
    blockNumber: 2,
    practiceTitle: 'Glucemia. Perfil y Significación',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Errores del Met de HDC',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Reg. Metabol. de lípidos',
    notes: '* Semana en la que no están disponibles los 5 días lectivos de la semana (Semana Santa / Pascua).',
    assignments: {
      practice: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 7,
    weekOffsetFromStart: 7,
    dateLabel: '5-9 abril',
    blockNumber: 2,
    practiceTitle: 'Glucemia. Perfil y Significación',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Errores del Met de HDC',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Reg. Metabol. de lípidos / Reg. Metabol. de aa',
    assignments: {
      practice: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
    },
  },

  // --- BLOQUE 3: Perfil Lipídico. Significación & Errores del Met Lipídico ---
  {
    weekIndex: 8,
    weekOffsetFromStart: 8,
    dateLabel: '12-16 abril',
    blockNumber: 3,
    practiceTitle: 'Perfil Lipídico. Significación',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Errores del Met Lipídico',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Reg. Metabol. de aa',
    assignments: {
      practice: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 9,
    weekOffsetFromStart: 9,
    dateLabel: '19-23 abril',
    blockNumber: 3,
    practiceTitle: 'Perfil Lipídico. Significación',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Errores del Met Lipídico',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Neurotransmisores',
    assignments: {
      practice: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 10,
    weekOffsetFromStart: 10,
    dateLabel: '26-30 abril',
    blockNumber: 3,
    practiceTitle: 'Perfil Lipídico. Significación',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Errores del Met Lipídico',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Reg. Metabol. de nucleótidos',
    assignments: {
      practice: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
    },
  },

  // --- BLOQUE 4: Determinaciones en Bioquímica Clínica & Alteraciones del Met del Hemo ---
  {
    weekIndex: 11,
    weekOffsetFromStart: 11,
    dateLabel: '3-7 mayo',
    blockNumber: 4,
    practiceTitle: 'Determinaciones en Bioquímica Clínica',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Alteraciones del Met del Hemo',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Integración metabólica',
    assignments: {
      practice: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 12,
    weekOffsetFromStart: 12,
    dateLabel: '10-14 mayo',
    blockNumber: 4,
    practiceTitle: 'Determinaciones en Bioquímica Clínica',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Alteraciones del Met del Hemo',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Sangre',
    assignments: {
      practice: {
        1: { groupNumber: 5, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 14, professor: '', shift: 'mañana' },
        4: { groupNumber: 11, professor: '', shift: 'mañana' },
        5: { groupNumber: 8, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 13,
    weekOffsetFromStart: 13,
    dateLabel: '17-21 mayo',
    blockNumber: 4,
    practiceTitle: 'Determinaciones en Bioquímica Clínica',
    practiceRoom: 'LAB L-5/6',
    seminarTitle: 'Alteraciones del Met del Hemo',
    seminarRoom: 'AULA S3',
    theoryTopic: 'Sangre',
    assignments: {
      practice: {
        1: { groupNumber: 6, professor: '', shift: 'mañana' },
        2: { groupNumber: 3, professor: '', shift: 'mañana' },
        3: { groupNumber: 15, professor: '', shift: 'mañana' },
        4: { groupNumber: 12, professor: '', shift: 'mañana' },
        5: { groupNumber: 9, professor: '', shift: 'mañana' },
      },
      seminar: {
        1: { groupNumber: 4, professor: '', shift: 'mañana' },
        2: { groupNumber: 1, professor: '', shift: 'mañana' },
        3: { groupNumber: 13, professor: '', shift: 'mañana' },
        4: { groupNumber: 10, professor: '', shift: 'mañana' },
        5: { groupNumber: 7, professor: '', shift: 'mañana' },
      },
    },
  },
  {
    weekIndex: 14,
    weekOffsetFromStart: 14,
    dateLabel: '24-28 mayo',
    practiceTitle: 'Examen de Prácticas de Bioquímica Médica',
    practiceRoom: 'LAB L-5/6 / AULA',
    seminarTitle: '',
    seminarRoom: '',
    theoryTopic: 'Regulación metabólica general / Bioquímica clínica',
    isExamWeek: true,
    notes: 'El examen oficial de las prácticas se realizará en la semana del 24 al 28 de mayo.',
    assignments: {
      practice: {
        1: { groupNumber: 1, professor: '', shift: 'mañana' },
        2: { groupNumber: 2, professor: '', shift: 'mañana' },
        3: { groupNumber: 3, professor: '', shift: 'mañana' },
        4: { groupNumber: 4, professor: '', shift: 'mañana' },
        5: { groupNumber: 5, professor: '', shift: 'mañana' },
      },
      seminar: {},
    },
  },
];

export const TEMPLATE_WEEKS = INITIAL_TEMPLATE_WEEKS;
