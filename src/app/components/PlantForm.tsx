import { useState, useEffect } from 'react';
import { Plant } from '../types/plant';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface PlantFormProps {
  plant?: Plant;
  onSave: (plant: Omit<Plant, 'id'>) => void;
  onCancel: () => void;
}

// Generate pot sizes from 1cm to 100cm
const POT_SIZES = Array.from({ length: 100 }, (_, i) => `${i + 1}cm`);

// Location sub-areas based on category
const LOCATION_SUB_AREAS: Record<string, string[]> = {
  Indoor: [
    'Living Room',
    'Bedroom',
    'Kitchen',
    'Bathroom',
    'Home Office',
    'Hallway',
    'Sunroom',
    'Plant Shelf / Stand',
    'Windowsill (N/E/S/W optional)'
  ],
  Outdoor: [
    'Balcony',
    'Patio',
    'Porch',
    'Garden Bed',
    'Courtyard'
  ],
  Special: [
    'Propagation Station',
    'Indoor Greenhouse'
  ]
};

export function PlantForm({ plant, onSave, onCancel }: PlantFormProps) {
  const [formData, setFormData] = useState<Omit<Plant, 'id'>>(({
    expectedHarvest: '',
    dateObtained: '',
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
  }));

  const [expandedRepots, setExpandedRepots] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (plant) {
      const { id, ...rest } = plant;
      setFormData(rest);
    }
  }, [plant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.plantName || !formData.phase || !formData.location || 
        !formData.lightConditions || !formData.wateringFrequency || !formData.dateObtained) {
      alert('Please fill in all required fields: Plant Name, Phase, Location, Light Conditions, Watering Frequency, and Date Obtained');
      return;
    }
    
    onSave(formData);
  };

  const handleChange = (field: keyof Omit<Plant, 'id'>, value: string | Array<{ date: string; size: string; note: string }>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationCategoryChange = (category: string) => {
    setFormData(prev => ({
      ...prev,
      locationCategory: category === 'none' ? '' : category,
      locationSubArea: '', // Reset sub-area when category changes
      location: '' // Reset combined location
    }));
  };

  const handleLocationSubAreaChange = (subArea: string) => {
    const subAreaValue = subArea === 'none' ? '' : subArea;
    const combinedLocation = formData.locationCategory && subAreaValue 
      ? `${formData.locationCategory} - ${subAreaValue}`
      : formData.locationCategory || subAreaValue;
    
    setFormData(prev => ({
      ...prev,
      locationSubArea: subAreaValue,
      location: combinedLocation
    }));
  };

  const addRepot = () => {
    const newIndex = formData.repots.length;
    setFormData(prev => ({
      ...prev,
      repots: [...prev.repots, { date: '', size: '', note: '' }]
    }));
    // Auto-expand the newly added repot
    setExpandedRepots(prev => new Set([...prev, newIndex]));
  };

  const updateRepot = (index: number, field: 'date' | 'size' | 'note', value: string) => {
    const newRepots = [...formData.repots];
    newRepots[index] = { ...newRepots[index], [field]: value };
    setFormData(prev => ({ ...prev, repots: newRepots }));
  };

  const removeRepot = (index: number) => {
    const newRepots = formData.repots.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, repots: newRepots }));
    // Remove from expanded set
    const newExpanded = new Set(expandedRepots);
    newExpanded.delete(index);
    setExpandedRepots(newExpanded);
  };

  const toggleRepot = (index: number) => {
    const newExpanded = new Set(expandedRepots);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRepots(newExpanded);
  };

  const handlePotSizeInput = (value: string, field: 'originalPotSize' | { type: 'repot'; index: number }) => {
    // Remove any non-digit characters
    const numericValue = value.replace(/\D/g, '');
    
    // Format as "Xcm" if there's a number
    const formattedValue = numericValue ? `${numericValue}cm` : '';
    
    if (field === 'originalPotSize') {
      handleChange('originalPotSize', formattedValue);
    } else {
      updateRepot(field.index, 'size', formattedValue);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {plant ? 'Edit Plant' : 'Add New Plant'}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dateObtained">
                Date Obtained <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dateObtained"
                type="date"
                value={formData.dateObtained}
                onChange={(e) => handleChange('dateObtained', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category || 'none'} 
                onValueChange={(value) => handleChange('category', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Plant">Plant</SelectItem>
                  <SelectItem value="Flower">Flower</SelectItem>
                  <SelectItem value="Chilli">Chilli</SelectItem>
                  <SelectItem value="Herbs">Herbs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="plantName">
                Plant Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="plantName"
                value={formData.plantName}
                onChange={(e) => handleChange('plantName', e.target.value)}
                placeholder="e.g., Basil, Rose, Bird of Paradise"
                required
              />
            </div>

            <div>
              <Label htmlFor="plantType">Plant Type</Label>
              <Input
                id="plantType"
                value={formData.plantType}
                onChange={(e) => handleChange('plantType', e.target.value)}
                placeholder="e.g., Perennial, Annual"
              />
            </div>

            <div>
              <Label htmlFor="phase">
                Phase <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.phase || 'none'} 
                onValueChange={(value) => handleChange('phase', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Seed">Seed</SelectItem>
                  <SelectItem value="Propagation">Propagation</SelectItem>
                  <SelectItem value="Mature">Mature</SelectItem>
                  <SelectItem value="Harvest">Harvest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="origin">Origin</Label>
              <Input
                id="origin"
                value={formData.origin}
                onChange={(e) => handleChange('origin', e.target.value)}
                placeholder="e.g., Home Depot, Friend's garden"
              />
            </div>

            <div>
              <Label htmlFor="originalHeight">Height at Acquisition</Label>
              <Input
                id="originalHeight"
                value={formData.originalHeight}
                onChange={(e) => handleChange('originalHeight', e.target.value)}
                placeholder="e.g., 10cm, 4in"
              />
            </div>

            <div>
              <Label htmlFor="potentialHeight">Current Height</Label>
              <Input
                id="potentialHeight"
                value={formData.potentialHeight}
                onChange={(e) => handleChange('potentialHeight', e.target.value)}
                placeholder="e.g., 25cm, 10in"
              />
            </div>

            <div>
              <Label htmlFor="locationCategory">
                Location Category <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.locationCategory || 'none'} 
                onValueChange={handleLocationCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Indoor">Indoor</SelectItem>
                  <SelectItem value="Outdoor">Outdoor</SelectItem>
                  <SelectItem value="Special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationSubArea">
                Location Sub-Area <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.locationSubArea || 'none'} 
                onValueChange={handleLocationSubAreaChange}
                disabled={!formData.locationCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.locationCategory ? "Select sub-area" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {LOCATION_SUB_AREAS[formData.locationCategory] && LOCATION_SUB_AREAS[formData.locationCategory].map(subArea => (
                    <SelectItem key={subArea} value={subArea}>{subArea}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.location && (
              <div>
                <Label>Combined Location</Label>
                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md border">
                  {formData.location}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="lightConditions">
                Light Conditions <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.lightConditions || 'none'} 
                onValueChange={(value) => handleChange('lightConditions', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select light conditions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Full Sun">
                    <div className="flex flex-col">
                      <span className="font-medium">Full Sun</span>
                      <span className="text-xs text-gray-500">6+ hrs direct sunlight</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Partial Sun/Shade">
                    <div className="flex flex-col">
                      <span className="font-medium">Partial Sun/Shade</span>
                      <span className="text-xs text-gray-500">3–6 hrs direct sun</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Bright Indirect">
                    <div className="flex flex-col">
                      <span className="font-medium">Bright Indirect</span>
                      <span className="text-xs text-gray-500">Bright, no direct rays</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium Light">
                    <div className="flex flex-col">
                      <span className="font-medium">Medium Light</span>
                      <span className="text-xs text-gray-500">Filtered/moderate light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Low Light">
                    <div className="flex flex-col">
                      <span className="font-medium">Low Light</span>
                      <span className="text-xs text-gray-500">Minimal natural light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Shade">
                    <div className="flex flex-col">
                      <span className="font-medium">Shade</span>
                      <span className="text-xs text-gray-500">Mostly no sun</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Dappled Light">
                    <div className="flex flex-col">
                      <span className="font-medium">Dappled Light</span>
                      <span className="text-xs text-gray-500">Filtered outdoor light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Grow Light">
                    <div className="flex flex-col">
                      <span className="font-medium">Grow Light</span>
                      <span className="text-xs text-gray-500">Artificial lighting</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="germinationDays">Germination (Days)</Label>
              <Input
                id="germinationDays"
                type="text"
                value={formData.germinationDays}
                onChange={(e) => handleChange('germinationDays', e.target.value)}
                placeholder="Days to germinate"
              />
            </div>

            <div>
              <Label htmlFor="harvestDays">Harvest (Days)</Label>
              <Input
                id="harvestDays"
                type="text"
                value={formData.harvestDays}
                onChange={(e) => handleChange('harvestDays', e.target.value)}
                placeholder="Days to harvest"
              />
            </div>

            <div>
              <Label htmlFor="expectedHarvest">Expected Harvest</Label>
              <Input
                id="expectedHarvest"
                type="date"
                value={formData.expectedHarvest}
                onChange={(e) => handleChange('expectedHarvest', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="repotDate">Repot Date</Label>
              <Input
                id="repotDate"
                type="date"
                value={formData.repotDate}
                onChange={(e) => handleChange('repotDate', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="originalPotSize">Original Pot Size</Label>
              <Input
                id="originalPotSize"
                value={formData.originalPotSize}
                onChange={(e) => handlePotSizeInput(e.target.value, 'originalPotSize')}
                placeholder="Enter size (e.g., 14)"
              />
            </div>

            <div>
              <Label htmlFor="potUse">Pot Use</Label>
              <Select 
                value={formData.potUse || 'none'} 
                onValueChange={(value) => handleChange('potUse', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pot use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Shared">Shared</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="channel">Channel</Label>
              <Input
                id="channel"
                value={formData.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                placeholder="Channel info"
              />
            </div>

            <div>
              <Label htmlFor="wateringFrequency">
                Watering Frequency <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.wateringFrequency || 'none'} 
                onValueChange={(value) => handleChange('wateringFrequency', value === 'none' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select watering frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Repots Section */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <Label>Repots ({formData.repots.length})</Label>
              <Button type="button" size="sm" variant="outline" onClick={addRepot}>
                <Plus className="h-4 w-4 mr-1" />
                Add Repot
              </Button>
            </div>
            
            {formData.repots.length > 0 ? (
              <div className="space-y-2">
                {formData.repots.map((repot, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleRepot(index)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <span className="font-medium text-sm">Repot {index + 1}</span>
                        {repot.date && <span className="text-sm text-gray-600">{repot.date}</span>}
                        {repot.size && <span className="text-sm font-medium text-blue-600">{repot.size}</span>}
                        {repot.note && <span className="text-sm text-gray-500 italic truncate max-w-xs">- {repot.note}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeRepot(index);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        {expandedRepots.has(index) ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    {expandedRepots.has(index) && (
                      <div className="p-4 bg-white border-t">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor={`repot-date-${index}`}>Repot Date</Label>
                            <Input
                              id={`repot-date-${index}`}
                              type="date"
                              value={repot.date}
                              onChange={(e) => updateRepot(index, 'date', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`repot-size-${index}`}>Pot Size</Label>
                            <Input
                              id={`repot-size-${index}`}
                              value={repot.size}
                              onChange={(e) => handlePotSizeInput(e.target.value, { type: 'repot', index })}
                              placeholder="Enter size (e.g., 21)"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`repot-note-${index}`}>Note</Label>
                          <Textarea
                            id={`repot-note-${index}`}
                            value={repot.note}
                            onChange={(e) => updateRepot(index, 'note', e.target.value)}
                            placeholder="Add notes about this repotting..."
                            rows={3}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No repots added yet. Click "Add Repot" to add one.</p>
            )}
          </div>

          <div className="mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g., High drought tolerance, prefers bright indirect light. Sensitive to overwatering."
              rows={4}
            />
          </div>

          <div className="flex gap-3 justify-end mt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {plant ? 'Update Plant' : 'Add Plant'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}