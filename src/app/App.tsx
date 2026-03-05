import { useState, useEffect } from 'react';
import { Plant, initialPlantData } from './types/plant';
import { PlantForm } from './components/PlantForm';
import { PlantTable } from './components/PlantTable';
import { ConfirmDialog } from './components/ConfirmDialog';
import { Button } from './components/ui/button';
import { Plus } from 'lucide-react';

type PhaseFilter = 'all' | 'Propagation' | 'Mature' | 'Seed';

const STORAGE_KEY = 'plant-database';

function App() {
  const [plants, setPlants] = useState<Plant[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as Plant[]) : initialPlantData;
    } catch {
      return initialPlantData;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
    } catch {
      // Storage quota exceeded or unavailable
    }
  }, [plants]);
  const [phaseFilter] = useState<PhaseFilter>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlant, setEditingPlant] = useState<Plant | undefined>(undefined);
  const [deletingPlantId, setDeletingPlantId] = useState<string | null>(null);

  const handleAddPlant = () => {
    setEditingPlant(undefined);
    setIsFormOpen(true);
  };

  const handleEditPlant = (plant: Plant) => {
    setEditingPlant(plant);
    setIsFormOpen(true);
  };

  const handleSavePlant = (plantData: Omit<Plant, 'id'>) => {
    if (editingPlant) {
      setPlants(plants.map(p => 
        p.id === editingPlant.id ? { ...plantData, id: editingPlant.id } : p
      ));
    } else {
      const newPlant: Plant = {
        ...plantData,
        id: Date.now().toString()
      };
      setPlants([...plants, newPlant]);
    }
    setIsFormOpen(false);
    setEditingPlant(undefined);
  };

  const handleCancelForm = () => {
    setIsFormOpen(false);
    setEditingPlant(undefined);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingPlantId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingPlantId) {
      setPlants(plants.filter(p => p.id !== deletingPlantId));
      setDeletingPlantId(null);
    }
  };

  const handleCancelDelete = () => {
    setDeletingPlantId(null);
  };

  const filteredPlants = plants.filter(plant => {
    if (phaseFilter !== 'all') {
      return plant.phase === phaseFilter;
    }
    return true;
  });

  const deletingPlant = plants.find(p => p.id === deletingPlantId);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-700 to-green-600 border-b shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Plant Database</h1>
              <p className="text-green-50 mt-1">Track your plants from propagation to harvest</p>
            </div>
            <Button onClick={handleAddPlant} size="lg" className="bg-white text-green-700 hover:bg-green-50">
              <Plus className="h-5 w-5 mr-2" />
              Add Plant
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold mb-4 text-green-800">Gardening Plant Database</h2>
          <PlantTable
            plants={filteredPlants}
            onEdit={handleEditPlant}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {isFormOpen && (
        <PlantForm
          plant={editingPlant}
          onSave={handleSavePlant}
          onCancel={handleCancelForm}
        />
      )}

      {deletingPlantId && deletingPlant && (
        <ConfirmDialog
          title="Delete Plant"
          message={`Are you sure you want to delete "${deletingPlant.plantName || 'this plant'}"? This action cannot be undone.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

export default App;