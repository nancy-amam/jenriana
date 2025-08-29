'use client';

import { Loader2 } from 'lucide-react';

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  residentialAddress: string;
  specialRequest: string;
}

interface GuestInfoFormProps {
  guestInfo: GuestInfo;
  setGuestInfo: React.Dispatch<React.SetStateAction<GuestInfo>>;
  formErrors: { [key: string]: string };
  isSubmitting: boolean;
}

export default function GuestInfoForm({
  guestInfo,
  setGuestInfo,
  formErrors,
  isSubmitting,
}: GuestInfoFormProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <label className="block text-base font-medium">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={guestInfo.name}
          onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
          className={`w-full px-4 py-2 rounded border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} text-black`}
          disabled={isSubmitting}
        />
        {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
      </div>
      <div className="space-y-1">
        <label className="block text-base font-medium">Email Address</label>
        <input
          type="email"
          placeholder="your.email@example.com"
          value={guestInfo.email}
          onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
          className={`w-full px-4 py-2 rounded border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} text-black`}
          disabled={isSubmitting}
        />
        {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
      </div>
      <div className="space-y-1">
        <label className="block text-base font-medium">Phone Number</label>
        <input
          type="tel"
          placeholder="+234 800 000 0000"
          value={guestInfo.phone}
          onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
          className={`w-full px-4 py-2 rounded border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} text-black`}
          disabled={isSubmitting}
        />
        {formErrors.phone && <p className="text-red-500 text-sm">{formErrors.phone}</p>}
      </div>
      <div className="space-y-1">
        <label className="block text-base font-medium">Residential Address</label>
        <input
          type="text"
          placeholder="Enter your complete address"
          value={guestInfo.residentialAddress}
          onChange={(e) => setGuestInfo({ ...guestInfo, residentialAddress: e.target.value })}
          className={`w-full px-4 py-2 rounded border ${formErrors.residentialAddress ? 'border-red-500' : 'border-gray-300'} text-black`}
          disabled={isSubmitting}
        />
        {formErrors.residentialAddress && <p className="text-red-500 text-sm">{formErrors.residentialAddress}</p>}
      </div>
      <div className="space-y-1">
        <label className="block text-base font-medium">Special Request (Optional)</label>
        <textarea
          rows={3}
          placeholder="Any special requirements or requests for your stay"
          value={guestInfo.specialRequest}
          onChange={(e) => {
            if (e.target.value.length <= 200) {
              setGuestInfo({ ...guestInfo, specialRequest: e.target.value });
            }
          }}
          className="w-full px-4 py-2 rounded border border-gray-300 text-black"
          disabled={isSubmitting}
          maxLength={200}
        ></textarea>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Maximum 200 characters</span>
          <span className={`${guestInfo.specialRequest.length >= 200 ? 'text-red-500' : ''}`}>
            {guestInfo.specialRequest.length}/200
          </span>
        </div>
      </div>
    </div>
  );
}