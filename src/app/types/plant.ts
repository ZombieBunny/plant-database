export interface Plant {
  id: string;
  expectedHarvest: string;
  dateObtained: string;
  category: 'Plant' | 'Flower' | '';
  plantName: string;
  plantType: string;
  phase: 'Origin' | 'Propagation' | 'Mature' | 'Stem and Roots' | 'Seed' | '';
  origin: string;
  originalHeight: string;
  potentialHeight: string;
  location: string;
  locationCategory: string;
  locationSubArea: string;
  lightConditions: string;
  germinationDays: string;
  harvestDays: string;
  repotDate: string;
  originalPotSize: string;
  potUse: 'Single' | 'Shared' | '';
  repots: Array<{ date: string; size: string; note: string }>;
  notes: string;
  channel: string;
  wateringFrequency: string;
}

export const initialPlantData: Plant[] = [
  {
    id: '1',
    expectedHarvest: '',
    dateObtained: '08-Dec-25',
    category: '',
    plantName: '',
    plantType: '',
    phase: '',
    origin: '',
    originalHeight: '',
    potentialHeight: '',
    location: 'SunSpace Studio',
    locationCategory: '',
    locationSubArea: '',
    lightConditions: '',
    germinationDays: '',
    harvestDays: '',
    repotDate: '',
    originalPotSize: '',
    potUse: '',
    repots: [],
    notes: '',
    channel: '',
    wateringFrequency: ''
  },
  {
    id: '2',
    expectedHarvest: '',
    dateObtained: '27-Sep-25',
    category: 'Plant',
    plantName: '',
    plantType: 'Plant',
    phase: 'Propagation',
    origin: '',
    originalHeight: '',
    potentialHeight: '',
    location: 'SunSpace Studio',
    locationCategory: '',
    locationSubArea: '',
    lightConditions: '',
    germinationDays: '',
    harvestDays: '',
    repotDate: '29-Nov-25',
    originalPotSize: '14cm',
    potUse: 'Shared',
    repots: [
      { date: '2024-11-29', size: '21cm', note: 'Tolerance - Detailed' },
      { date: '2024-12-15', size: '21cm', note: 'Tolerance - Detailed' }
    ],
    notes: 'Tolerance - Detailed',
    channel: 'Shared',
    wateringFrequency: 'Weekly'
  },
  {
    id: '3',
    expectedHarvest: '',
    dateObtained: '27-Sep-25',
    category: 'Plant',
    plantName: '',
    plantType: 'Plant',
    phase: 'Mature',
    origin: '',
    originalHeight: '',
    potentialHeight: '',
    location: 'SunSpace Studio',
    locationCategory: '',
    locationSubArea: '',
    lightConditions: '',
    germinationDays: '',
    harvestDays: '',
    repotDate: '',
    originalPotSize: '',
    potUse: 'Shared',
    repots: [{ date: '2024-12-10', size: '21cm', note: 'Tolerance - Detailed' }],
    notes: '',
    channel: 'Shared',
    wateringFrequency: 'Bi-weekly'
  },
  {
    id: '4',
    expectedHarvest: '',
    dateObtained: '13-Dec-25',
    category: '',
    plantName: '',
    plantType: '',
    phase: '',
    origin: '',
    originalHeight: '',
    potentialHeight: '',
    location: '',
    locationCategory: '',
    locationSubArea: '',
    lightConditions: '',
    germinationDays: '',
    harvestDays: '',
    repotDate: '',
    originalPotSize: '',
    potUse: '',
    repots: [],
    notes: '',
    channel: '',
    wateringFrequency: ''
  },
  {
    id: '5',
    expectedHarvest: '',
    dateObtained: '04-Oct-25',
    category: 'Flower',
    plantName: '',
    plantType: 'Flower',
    phase: 'Seed',
    origin: '',
    originalHeight: '',
    potentialHeight: '',
    location: '',
    locationCategory: '',
    locationSubArea: '',
    lightConditions: '',
    germinationDays: '10',
    harvestDays: '70',
    repotDate: '16-Nov-25',
    originalPotSize: 'Pot',
    potUse: 'Single',
    repots: [],
    notes: 'Tolerance - Detailed',
    channel: '07-Feb-26',
    wateringFrequency: 'Daily'
  }
];