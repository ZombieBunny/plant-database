import { Plant } from '../types/plant';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Calendar, Droplet, Sprout, Sun, Droplets, CloudSun } from 'lucide-react';

interface PlantCardProps {
  plant: Plant;
  onEdit: (plant: Plant) => void;
}

export function PlantCard({ plant, onEdit }: PlantCardProps) {
  return (
    <Card 
      className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onEdit(plant)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{plant.plantType || 'Unnamed Plant'}</h3>
          <p className="text-sm text-gray-600">{plant.location || 'No location'}</p>
        </div>
        {plant.phase && (
          <Badge variant="secondary">{plant.phase}</Badge>
        )}
      </div>

      <div className="space-y-2 text-sm">
        {plant.dateObtained && (
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="h-4 w-4" />
            <span>Obtained: {plant.dateObtained}</span>
          </div>
        )}

        {plant.lightConditions && (
          <div className="flex items-center gap-2 text-gray-700">
            <CloudSun className="h-4 w-4" />
            <span>{plant.lightConditions}</span>
          </div>
        )}

        {plant.germinationDays && (
          <div className="flex items-center gap-2 text-gray-700">
            <Sprout className="h-4 w-4" />
            <span>Germination: {plant.germinationDays} days</span>
          </div>
        )}

        {plant.harvestDays && (
          <div className="flex items-center gap-2 text-gray-700">
            <Sun className="h-4 w-4" />
            <span>Harvest: {plant.harvestDays} days</span>
          </div>
        )}

        {plant.repotDate && (
          <div className="flex items-center gap-2 text-gray-700">
            <Droplet className="h-4 w-4" />
            <span>Repotted: {plant.repotDate}</span>
          </div>
        )}

        {plant.wateringFrequency && (
          <div className="flex items-center gap-2 text-gray-700">
            <Droplets className="h-4 w-4" />
            <span>Water: {plant.wateringFrequency}</span>
          </div>
        )}

        {plant.notes && (
          <p className="text-gray-600 mt-2 line-clamp-2">{plant.notes}</p>
        )}
      </div>

      {plant.potUse && (
        <div className="mt-3 pt-3 border-t">
          <span className="text-xs text-gray-500">Pot Use: {plant.potUse}</span>
        </div>
      )}
    </Card>
  );
}