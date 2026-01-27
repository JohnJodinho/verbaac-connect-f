import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Tag, X, Plus, ShoppingBag, Home } from 'lucide-react';
import { useProfileStore } from '../store/useProfileStore';

const POPULAR_ZONES = [
  'Naraguta', 'Village', 'Angwan Rukuba', 'Tudun Wada', 
  'Bauchi Road', 'Farin Gada', 'Terminus', 'Bukuru'
];

const MARKETPLACE_CATEGORIES = [
  'Electronics', 'Furniture', 'Textbooks', 'Kitchenware', 
  'Fashion', 'Sports', 'Appliances', 'Gadgets'
];

export function PreferencesSection() {
  const { formData, setField } = useProfileStore();
  const [newZone, setNewZone] = useState('');
  const [showZoneSuggestions, setShowZoneSuggestions] = useState(false);

  const handleAddZone = (zone: string) => {
    if (zone && !formData.preferredZones.includes(zone)) {
      setField('preferredZones', [...formData.preferredZones, zone]);
    }
    setNewZone('');
    setShowZoneSuggestions(false);
  };

  const handleRemoveZone = (zone: string) => {
    setField('preferredZones', formData.preferredZones.filter((z) => z !== zone));
  };

  const toggleCategory = (category: string) => {
    if (formData.savedCategories.includes(category)) {
      setField('savedCategories', formData.savedCategories.filter((c) => c !== category));
    } else {
      setField('savedCategories', [...formData.savedCategories, category]);
    }
  };

  const availableZones = POPULAR_ZONES.filter(
    (z) => !formData.preferredZones.includes(z) && z.toLowerCase().includes(newZone.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-6 shadow-sm"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-role-consumer/10 rounded-lg">
          <Tag className="w-5 h-5 text-role-consumer" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Preferences</h2>
          <p className="text-sm text-muted-foreground">
            Customize your housing and marketplace experience
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Housing Preferences */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Home className="w-4 h-4 text-muted-foreground" />
            Preferred Zones
          </div>
          
          {/* Tag Cloud */}
          <div className="flex flex-wrap gap-2 min-h-[44px]">
            {formData.preferredZones.map((zone) => (
              <span
                key={zone}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-role-consumer/10 text-role-consumer text-sm font-medium rounded-full"
              >
                <MapPin className="w-3 h-3" />
                {zone}
                <button
                  onClick={() => handleRemoveZone(zone)}
                  className="ml-1 hover:bg-role-consumer/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {formData.preferredZones.length === 0 && (
              <span className="text-sm text-muted-foreground italic">
                No zones selected
              </span>
            )}
          </div>

          {/* Add Zone Input */}
          <div className="relative">
            <input
              type="text"
              value={newZone}
              onChange={(e) => {
                setNewZone(e.target.value);
                setShowZoneSuggestions(true);
              }}
              onFocus={() => setShowZoneSuggestions(true)}
              placeholder="Add a zone..."
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-role-consumer/30 focus:border-role-consumer transition-colors"
            />
            {showZoneSuggestions && availableZones.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                {availableZones.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => handleAddZone(zone)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-3 h-3 text-muted-foreground" />
                    {zone}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Marketplace Interests */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            Marketplace Interests
          </div>
          
          {/* Category Grid */}
          <div className="flex flex-wrap gap-2">
            {MARKETPLACE_CATEGORIES.map((category) => {
              const isSelected = formData.savedCategories.includes(category);
              return (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
                    isSelected
                      ? 'bg-role-consumer text-primary-foreground border-role-consumer'
                      : 'bg-background text-muted-foreground border-border hover:border-role-consumer hover:text-foreground'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Selected categories appear first in your marketplace feed
          </p>
        </div>
      </div>
    </motion.div>
  );
}
