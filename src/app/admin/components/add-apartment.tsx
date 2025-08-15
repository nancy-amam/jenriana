import React, { useState, useEffect } from 'react';
import { 
  X, 
  AirVent, 
  Wifi, 
  WashingMachine, 
  Zap, 
  Tv, 
  ChefHat,
  Ban,
  PartyPopper,
  Heart,
  Baby,
  Users,
  Plus,
  Trash2,
  Upload,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { addApartment, updateApartment } from '@/services/api-services';
import { ApartmentData } from '@/lib/interface';

interface Feature {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

interface Rule {
  key: keyof RulesState;
  name: string;
  icon: React.ComponentType<any>;
}

interface AddOn {
  id: number;
  name: string;
  pricing: string;
  description: string;
  price: string;
  active: boolean;
}

interface RulesState {
  noSmoking: boolean;
  noParties: boolean;
  petsAllowed: boolean;
  childrenAllowed: boolean;
  maxGuests: boolean;
}

interface AddEditApartmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editMode?: boolean;
  apartmentData?: ApartmentData & { id?: string };
}

interface FormData {
  name: string;
  location: string;
  address: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
}

export default function AddEditApartmentModal({ 
  open, 
  onClose, 
  onSuccess,
  editMode = false,
  apartmentData 
}: AddEditApartmentModalProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [rules, setRules] = useState<RulesState>({
    noSmoking: false,
    noParties: false,
    petsAllowed: false,
    childrenAllowed: true,
    maxGuests: true
  });
  const [addOns, setAddOns] = useState<AddOn[]>([
    { id: 1, name: '', pricing: '', description: '', price: '', active: true }
  ]);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    location: '',
    address: '',
    pricePerNight: 0,
    rooms: 0,
    bathrooms: 0,
    maxGuests: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const features: Feature[] = [
    { id: 'ac', name: 'Air Conditioning', icon: AirVent },
    { id: 'wifi', name: 'WiFi', icon: Wifi },
    { id: 'washing', name: 'Washing Machine', icon: WashingMachine },
    { id: 'generator', name: 'Generator', icon: Zap },
    { id: 'tv', name: 'Smart TV', icon: Tv },
    { id: 'kitchen', name: 'Kitchen', icon: ChefHat }
  ];

  const rulesList: Rule[] = [
    { key: 'noSmoking', name: 'No Smoking', icon: Ban },
    { key: 'noParties', name: 'No Parties', icon: PartyPopper },
    { key: 'petsAllowed', name: 'Pets Allowed', icon: Heart },
    { key: 'childrenAllowed', name: 'Children Allowed', icon: Baby },
    { key: 'maxGuests', name: 'Don\'t Exceed Max Guests', icon: Users }
  ];

  // Feature mapping for API
  const featureMapping = {
    'air-conditioning': 'ac',
    'wifi': 'wifi',
    'washing-machine': 'washing',
    'generator': 'generator',
    'smart-tv': 'tv',
    'kitchen': 'kitchen'
  };

  const reverseFeatureMapping = {
    'ac': 'air-conditioning',
    'wifi': 'wifi',
    'washing': 'washing-machine',
    'generator': 'generator',
    'tv': 'smart-tv',
    'kitchen': 'kitchen'
  };

  // Rules mapping for API (updated to match backend)
  const rulesMapping = {
    'no-smoking': 'noSmoking',
    'no-parties': 'noParties',
    'pets-allowed': 'petsAllowed',
    'children-allowed': 'childrenAllowed',
    'do-not-exceed-guest-count': 'maxGuests', // Updated to match backend
    'max-guests-enforced': 'maxGuests', // Keep both for compatibility
    'check-in-3pm-11pm': 'maxGuests' // This doesn't map to our UI, handle separately
  };

  // Initialize form with existing data in edit mode
  useEffect(() => {
    if (editMode && apartmentData && open) {
      // Set form data
      setFormData({
        name: apartmentData.name || '',
        location: apartmentData.location || '',
        address: apartmentData.address || '',
        pricePerNight: apartmentData.pricePerNight || 0,
        rooms: apartmentData.rooms || 0,
        bathrooms: apartmentData.bathrooms || 0,
        maxGuests: apartmentData.maxGuests || 0
      });

      // Set features
      if (apartmentData.features) {
        const mappedFeatures = apartmentData.features
          .map(feature => featureMapping[feature as keyof typeof featureMapping])
          .filter(Boolean);
        setSelectedFeatures(mappedFeatures);
      }

      // Set rules
      const newRules: RulesState = {
        noSmoking: false,
        noParties: false,
        petsAllowed: false,
        childrenAllowed: true,
        maxGuests: true
      };

      if (apartmentData.rules) {
        apartmentData.rules.forEach(rule => {
          const ruleKey = rulesMapping[rule as keyof typeof rulesMapping];
          if (ruleKey) {
            newRules[ruleKey as keyof RulesState] = true;
          }
          // Handle the max guests rule specifically
          if (rule === 'do-not-exceed-guest-count' || rule === 'max-guests-enforced') {
            newRules.maxGuests = true;
          }
        });
      }
      setRules(newRules);

      // Set existing images
      if (apartmentData.gallery) {
        setExistingImages(apartmentData.gallery);
      }

      // Clear uploaded images when switching to edit mode
      setUploadedImages([]);
    } else if (!editMode && open) {
      // Reset form for add mode
      resetForm();
    }
  }, [editMode, apartmentData, open]);

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      address: '',
      pricePerNight: 0,
      rooms: 0,
      bathrooms: 0,
      maxGuests: 0
    });
    setSelectedFeatures([]);
    setRules({
      noSmoking: false,
      noParties: false,
      petsAllowed: false,
      childrenAllowed: true,
      maxGuests: true
    });
    setUploadedImages([]);
    setExistingImages([]);
    setAddOns([{ id: 1, name: '', pricing: '', description: '', price: '', active: true }]);
    setError(null);
    setSuccessMessage(null);
  };

  const getFeatureIconColor = (featureId: string): string => {
    const colors = {
      ac: 'text-blue-500',
      wifi: 'text-green-500',
      washing: 'text-purple-500',
      generator: 'text-yellow-500',
      tv: 'text-red-500',
      kitchen: 'text-orange-500'
    };
    return colors[featureId as keyof typeof colors] || 'text-gray-500';
  };

  const getRuleIconColor = (ruleKey: keyof RulesState): string => {
    const colors = {
      noSmoking: 'text-red-500',
      noParties: 'text-purple-500',
      petsAllowed: 'text-green-500',
      childrenAllowed: 'text-blue-500',
      maxGuests: 'text-orange-500'
    };
    return colors[ruleKey] || 'text-gray-500';
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (error) setError(null);
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const toggleRule = (ruleKey: keyof RulesState) => {
    setRules(prev => ({ ...prev, [ruleKey]: !prev[ruleKey] }));
  };

  const addNewAddOn = () => {
    setAddOns(prev => [...prev, {
      id: Date.now(),
      name: '',
      pricing: '',
      description: '',
      price: '',
      active: true
    }]);
  };

  const removeAddOn = (id: number) => {
    setAddOns(prev => prev.filter(addon => addon.id !== id));
  };

  const toggleAddOnActive = (id: number) => {
    setAddOns(prev => prev.map(addon => 
      addon.id === id ? { ...addon, active: !addon.active } : addon
    ));
  };

  const updateAddOn = (id: number, field: keyof AddOn, value: string) => {
    setAddOns(prev => prev.map(addon => 
      addon.id === id ? { ...addon, [field]: value } : addon
    ));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Selected files:', files.map(f => f.name));
    setUploadedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Apartment name is required');
      return false;
    }
    if (!formData.location.trim()) {
      setError('Location is required');
      return false;
    }
    if (!formData.address.trim()) {
      setError('Address is required');
      return false;
    }
    if (formData.pricePerNight <= 0) {
      setError('Price per night must be greater than 0');
      return false;
    }
    if (formData.maxGuests <= 0) {
      setError('Max guests must be greater than 0');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const selectedFeatureNames = selectedFeatures.map(id => 
        reverseFeatureMapping[id as keyof typeof reverseFeatureMapping] || id.toLowerCase().replace(/\s+/g, '-')
      );

      const rulesArray = [];
      if (rules.noSmoking) rulesArray.push('no-smoking');
      if (rules.noParties) rulesArray.push('no-parties');
      if (rules.petsAllowed) rulesArray.push('pets-allowed');
      if (rules.childrenAllowed) rulesArray.push('children-allowed');
      if (rules.maxGuests) rulesArray.push('do-not-exceed-guest-count'); // Updated to match backend

      const apartmentPayload: ApartmentData = {
        name: formData.name.trim(),
        location: formData.location.trim(),
        address: formData.address.trim(),
        pricePerNight: formData.pricePerNight,
        rooms: formData.rooms,
        bathrooms: formData.bathrooms,
        maxGuests: formData.maxGuests,
        features: selectedFeatureNames,
        gallery: existingImages, // Keep existing images, backend will handle new ones
        rules: rulesArray,
        isTrending: apartmentData?.isTrending || false
      };

      // Debug: Log the apartment ID for updates
      if (editMode && apartmentData?.id) {
        console.log('Apartment ID for update:', apartmentData.id);
        console.log('Clean apartment payload:', apartmentPayload);
        console.log('Images being uploaded:', uploadedImages.length);
      }

      let response;
      if (editMode && apartmentData?.id) {
        response = await updateApartment(apartmentData.id, apartmentPayload, uploadedImages);
      } else {
        response = await addApartment(apartmentPayload, uploadedImages);
      }
      
      resetForm();
      setSuccessMessage(`Apartment ${editMode ? 'updated' : 'added'} successfully!`);

      setTimeout(() => {
        setSuccessMessage(null);
        onSuccess?.();
        onClose();
      }, 3000);
    } catch (err: any) {
      console.error('Submission error:', err);
      let errorMessage = `Failed to ${editMode ? 'update' : 'add'} apartment`;
      
      if (err && typeof err === 'object') {
        if (err.status && err.message) {
          if (err.message.includes('Pinata')) {
            errorMessage = 'Failed to upload images to Pinata. Please try again or contact support.';
          } else {
            errorMessage = `Error ${err.status}: ${err.message}`;
          }
        } else if (err.message) {
          errorMessage = err.message;
        } else if (typeof err === 'string') {
          errorMessage = err;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center p-5 z-50">
      <div 
        className="bg-white w-[686px] max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl relative"
        style={{
          msOverflowStyle: 'none',
          scrollbarWidth: 'none'
        }}
      >
        {/* Success Message */}
        {successMessage && (
          <div className="absolute top-4 right-4 z-10 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="mt-1 text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-[#111827]">
            {editMode ? 'Edit Apartment' : 'Add Apartment'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <X className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error {editMode ? 'Updating' : 'Adding'} Apartment
                </h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-2 text-xs text-red-600 underline hover:text-red-800"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-left text-lg font-medium text-[#111827] mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Apartment Name*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter apartment name"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Location*
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter location"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#374151] mb-2">
                Address*
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter full address"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* 2x2 Grid for Property Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Price per Night*
            </label>
            <input
              type="number"
              value={formData.pricePerNight || ''}
              onChange={(e) => handleInputChange('pricePerNight', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="$0"
              min="0"
              step="0.01"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Number of Rooms
            </label>
            <input
              type="number"
              value={formData.rooms || ''}
              onChange={(e) => handleInputChange('rooms', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Number of Bathrooms
            </label>
            <input
              type="number"
              value={formData.bathrooms || ''}
              onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="0"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-2">
              Max Guests*
            </label>
            <input
              type="number"
              value={formData.maxGuests || ''}
              onChange={(e) => handleInputChange('maxGuests', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="0"
              min="1"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Features */}
        <div className="mb-6">
          <h3 className="text-left text-base font-semibold text-[#374151] mb-4">Features</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              const isSelected = selectedFeatures.includes(feature.id);
              return (
                <div
                  key={feature.id}
                  onClick={() => !isLoading && toggleFeature(feature.id)}
                  className={`w-[175.375px] h-[58px] p-[17px] flex items-center gap-3 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-purple-600 bg-purple-50' 
                      : 'border-gray-200 hover:border-purple-600 hover:bg-gray-50'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleFeature(feature.id)}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    disabled={isLoading}
                  />
                  <IconComponent className={`w-4 h-4 ${getFeatureIconColor(feature.id)}`} />
                  <span className="text-sm text-gray-700">{feature.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rules */}
        <div className="mb-6">
          <h3 className="text-left text-base font-semibold text-[#374151] mb-4">Rules</h3>
          <div className="max-w-[646px] space-y-2">
            {rulesList.map((rule) => {
              const IconComponent = rule.icon;
              return (
                <div
                  key={rule.key}
                  className={`h-10 flex justify-between bg-[#f9fafb] items-center rounded-lg px-4 py-2 border border-gray-200 ${
                    isLoading ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${getRuleIconColor(rule.key)}`} />
                    <span className="text-sm text-gray-700">{rule.name}</span>
                  </div>
                  <div
                    onClick={() => !isLoading && toggleRule(rule.key)}
                    className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                      rules[rule.key] ? 'bg-blue-600' : 'bg-gray-300'
                    } ${isLoading ? 'cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                        rules[rule.key] ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add-ons & Optional Services */}
        <div className="mb-6">
          <h3 className="text-left text-lg font-semibold text-[#111827] mb-2">Add-ons & Optional Services</h3>
          <p className="text-sm text-[#4b5566] mb-4">
            Attach custom services to this apartment. These will appear to users during checkout.
          </p>
          
          {addOns.map((addon, index) => (
            <div key={addon.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700">Add-on #{index + 1}</h4>
                <button
                  onClick={() => !isLoading && removeAddOn(addon.id)}
                  className={`p-1 text-sm text-red-500 hover:bg-red-50 rounded ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-[#4b5566] mb-1">
                    Add-on Name
                  </label>
                  <input
                    type="text"
                    value={addon.name}
                    onChange={(e) => !isLoading && updateAddOn(addon.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Service name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4b5566] mb-1">
                    Pricing
                  </label>
                  <input
                    type="text"
                    value={addon.pricing}
                    onChange={(e) => !isLoading && updateAddOn(addon.id, 'pricing', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="$0"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-[#4b5566] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={addon.description}
                  onChange={(e) => !isLoading && updateAddOn(addon.id, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Service description"
                  disabled={isLoading}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="text"
                    value={addon.price}
                    onChange={(e) => !isLoading && updateAddOn(addon.id, 'price', e.target.value)}
                    className="w-[90%] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="$0"
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center gap-2 pb-2 mt-7">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <div
                    onClick={() => !isLoading && toggleAddOnActive(addon.id)}
                    className={`w-11 h-6 rounded-full cursor-pointer transition-colors ${
                      addon.active ? 'bg-black' : 'bg-gray-300'
                    } ${isLoading ? 'cursor-not-allowed' : ''}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform mt-0.5 ${
                        addon.active ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => !isLoading && addNewAddOn()}
            className={`flex items-center gap-2 p-3 bg-[#d1d5db]/30 text-[#374151] rounded-lg text-sm font-medium ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="w-4 h-4" />
            Add New Add-on
          </button>
        </div>

        {/* Images */}
        <div className="mb-6">
          <h3 className="text-left text-lg font-semibold text-[#111827] mb-4">Images</h3>
          
          {/* Existing Images (Edit Mode) */}
          {editMode && existingImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Current Images</h4>
              <div className="flex gap-2 mb-4 flex-wrap">
                {existingImages.map((imageUrl, index) => (
                  <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Current apartment image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => !isLoading && removeExistingImage(index)}
                      className={`absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Images */}
          {uploadedImages.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                {editMode ? 'New Images to Add' : 'Selected Images'}
              </h4>
              <div className="flex gap-2 mb-4 flex-wrap">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`${editMode ? 'New' : 'Apartment'} image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => !isLoading && removeImage(index)}
                      className={`absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="max-w-[646px] h-[136px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isLoading}
            />
            <label htmlFor="image-upload" className={`cursor-pointer text-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Drag and drop images here or <span className="text-blue-600">browse files</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {editMode && existingImages.length > 0 && `${existingImages.length} existing image${existingImages.length > 1 ? 's' : ''}`}
                {editMode && existingImages.length > 0 && uploadedImages.length > 0 && ' • '}
                {uploadedImages.length > 0 && `${uploadedImages.length} new image${uploadedImages.length > 1 ? 's' : ''} selected`}
                {!editMode && uploadedImages.length === 0 && existingImages.length === 0 && 'No images selected'}
              </p>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 
              `${editMode ? 'Updating' : 'Adding'} Apartment...` : 
              `${editMode ? 'Update' : 'Add'} Apartment`
            }
          </button>
        </div>
      </div>
    </div>
  );
}