'use client'

import {
  Applicant
} from './page';
import {
  FC as ReactFC
} from 'react';

interface ApplicantFormProps {
  applicant: Applicant;
  updateApplicant: (updates: Partial<Applicant>, isFormSubmit?: boolean) => void;
}

export const ApplicantForm: ReactFC<ApplicantFormProps> = (
  { applicant, updateApplicant }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateApplicant({ 
      [name]: name === 'dependents' || name.match(/automobiles|houses|debt|liquidity|income|pension/) 
        ? parseInt(value, 10) || 0 
        : value,
    }, false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateApplicant({}, true);
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto pr-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="font-bold">Name:</label>
            <input type="text" name="name" value={applicant.name} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Gender:</label>
            <input type="text" name="gender" value={applicant.gender} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Occupation:</label>
            <input type="text" name="occupation" value={applicant.occupation} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Dependents:</label>
            <input type="number" name="level" value={applicant.dependents} onChange={handleChange} min="1" className="p-2 border rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-bold">automobiles:</label>
              <input type="number" name="automobiles" value={applicant.automobiles} onChange={handleChange} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">houses:</label>
              <input type="number" name="houses" value={applicant.houses} onChange={handleChange} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">debt:</label>
              <input type="number" name="debt" value={applicant.debt} onChange={handleChange} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">liquidity:</label>
              <input type="number" name="liquidity" value={applicant.liquidity} onChange={handleChange} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">income:</label>
              <input type="number" name="income" value={applicant.income} onChange={handleChange} className="p-2 border rounded" />
            </div>
            <div className="flex flex-col">
              <label className="font-bold">pension:</label>
              <input type="number" name="pension" value={applicant.pension} onChange={handleChange} className="p-2 border rounded" />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="font-bold">Applicant History:</label>
            <textarea name="history" value={applicant.history} onChange={handleChange} className="p-2 border rounded" />
          </div>
          <div className="flex flex-col">
            <label className="font-bold">reason:</label>
            <textarea name="reason" value={applicant.reason} onChange={handleChange} className="p-2 border rounded" />
          </div>
        </form>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          onClick={(e) => handleSubmit(e as React.FormEvent)}
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400">
          Send Applicant Updates
        </button>
      </div>
    </div>
  );
};