'use client';

interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: 'perNight' | 'oneTime';
  active: boolean;
  description?: string;
}

interface Apartment {
  addons?: Addon[];
}

interface AddonSelectionProps {
  apartment: Apartment;
  selectedServices: string[];
  handleCheckboxChange: (addonId: string) => void;
  isSubmitting: boolean;
  nights: number;
}

export default function AddonSelection({
  apartment,
  selectedServices,
  handleCheckboxChange,
  isSubmitting,
  nights,
}: AddonSelectionProps) {
  const displayPricingType = (pricingType: string) => {
    switch (pricingType) {
      case 'perNight':
        return 'Per night';
      case 'oneTime':
        return 'One-time';
      default:
        return pricingType;
    }
  };

  return (
    <div className="px-4 mb-10">
      <h2 className="text-[20px] font-normal text-[#111827] text-left mb-2">Enhance Your Stay</h2>
      <p className="text-base text-[#4b5563] text-left mb-6">Select optional services to upgrade your experience</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {apartment.addons && apartment.addons.length > 0 ? (
          apartment.addons
            .filter((addon) => addon.active)
            .map((addon) => (
              <div
                key={addon._id}
                className="flex justify-between items-center border border-gray-200 rounded-[12px] p-6"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={addon._id}
                    checked={selectedServices.includes(addon._id)}
                    onChange={() => handleCheckboxChange(addon._id)}
                    className="mt-1 w-5 h-5"
                    disabled={isSubmitting}
                  />
                  <div className="flex flex-col">
                    <label
                      htmlFor={addon._id}
                      className="font-normal text-base text-[#111827] cursor-pointer"
                    >
                      {addon.name}
                    </label>
                    <p className="text-sm text-[#4b5566]">
                      {addon.description || displayPricingType(addon.pricingType)}
                    </p>
                  </div>
                </div>
                <div className="text-base font-normal text-[#111827] flex-shrink-0 ml-4">
                  ₦{(addon.pricingType === 'perNight' ? addon.price * nights : addon.price).toLocaleString()}
                  <span className="text-sm font-normal text-[#4b5566]">
                    {addon.pricingType === 'perNight' ? '/night' : ''}
                  </span>
                </div>
              </div>
            ))
        ) : (
          <p className="text-sm text-[#4b5563]">No add-ons available.</p>
        )}
      </div>
    </div>
  );
}