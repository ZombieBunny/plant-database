import { useState, useMemo } from 'react';
import { Plant } from '../types/plant';
import { Pencil, Trash2, Search, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface PlantTableProps {
  plants: Plant[];
  onEdit: (plant: Plant) => void;
  onDelete: (id: string) => void;
}

export function PlantTable({ plants, onEdit, onDelete }: PlantTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlants = useMemo(() => {
    if (!searchQuery) return plants;

    const query = searchQuery.toLowerCase();
    return plants.filter(plant => {
      // Search across all text fields
      const searchableFields = [
        plant.dateObtained,
        plant.category,
        plant.plantName,
        plant.plantType,
        plant.phase,
        plant.origin,
        plant.originalHeight,
        plant.potentialHeight,
        plant.location,
        plant.lightConditions,
        plant.germinationDays,
        plant.harvestDays,
        plant.expectedHarvest,
        plant.repotDate,
        plant.originalPotSize,
        plant.potUse,
        plant.wateringFrequency,
        plant.channel,
        plant.notes,
        // Also search in repots
        ...plant.repots.map(r => `${r.date} ${r.size} ${r.note}`).join(' ')
      ].join(' ').toLowerCase();

      return searchableFields.includes(query);
    });
  }, [plants, searchQuery]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (plants.length === 0) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="text-center py-12 text-gray-500">
          No plants found. Add your first plant to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search across all fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <span className="text-sm text-gray-600">
          {filteredPlants.length === plants.length ? (
            `${plants.length} plants`
          ) : (
            `Showing ${filteredPlants.length} of ${plants.length} plants`
          )}
        </span>
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-green-50 to-green-100 border-b-2 border-green-200">
                <th className="px-3 py-2 text-left font-semibold text-green-800 whitespace-nowrap">Date Obtained</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Category</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Plant Name</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Plant Type</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Phase</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Origin</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Orig. H</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Pot. H</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Location</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Light</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Germ</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Harv</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800 whitespace-nowrap">Exp. Harvest</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800 whitespace-nowrap">Repot Date</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Orig. Pot</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Pot Use</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Repots</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Water</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Channel</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800">Notes</th>
                <th className="px-3 py-2 text-left font-semibold text-green-800 sticky right-0 bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlants.map((plant, idx) => (
                <tr key={plant.id} className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-3 py-2.5 whitespace-nowrap">{plant.dateObtained || '-'}</td>
                  <td className="px-3 py-2.5">{plant.category || '-'}</td>
                  <td className="px-3 py-2.5">{plant.plantName || '-'}</td>
                  <td className="px-3 py-2.5">{plant.plantType || '-'}</td>
                  <td className="px-3 py-2.5">
                    {plant.phase && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs">
                        {plant.phase}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">{plant.origin || '-'}</td>
                  <td className="px-3 py-2.5">{plant.originalHeight || '-'}</td>
                  <td className="px-3 py-2.5">{plant.potentialHeight || '-'}</td>
                  <td className="px-3 py-2.5">{plant.location || '-'}</td>
                  <td className="px-3 py-2.5">{plant.lightConditions || '-'}</td>
                  <td className="px-3 py-2.5">{plant.germinationDays || '-'}</td>
                  <td className="px-3 py-2.5">{plant.harvestDays || '-'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{plant.expectedHarvest || '-'}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{plant.repotDate || '-'}</td>
                  <td className="px-3 py-2.5">{plant.originalPotSize || '-'}</td>
                  <td className="px-3 py-2.5">
                    {plant.potUse && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                        plant.potUse === 'Single' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {plant.potUse}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 min-w-[120px]">
                    {plant.repots.length > 0 ? (
                      <div className="space-y-1">
                        {plant.repots.map((repot, idx) => (
                          <div key={idx} className="text-xs border-l-2 border-blue-400 pl-2 py-1 bg-blue-50">
                            <div className="flex items-center gap-1.5">
                              {repot.date && <span className="text-gray-600">{repot.date}</span>}
                              <span className="font-medium text-blue-600">{repot.size}</span>
                            </div>
                            {repot.note && (
                              <div className="text-gray-500 text-xs italic mt-0.5 line-clamp-1" title={repot.note}>{repot.note}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : '-'}
                  </td>
                  <td className="px-3 py-2.5">{plant.wateringFrequency || '-'}</td>
                  <td className="px-3 py-2.5">{plant.channel || '-'}</td>
                  <td className="px-3 py-2.5 max-w-[150px]">
                    {plant.notes ? (
                      <div className="truncate" title={plant.notes}>{plant.notes}</div>
                    ) : '-'}
                  </td>
                  <td className={`px-3 py-2.5 whitespace-nowrap sticky right-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(plant)}
                        className="h-7 w-7 p-0 hover:bg-blue-100"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(plant.id)}
                        className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}