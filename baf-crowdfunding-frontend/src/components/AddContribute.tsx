import React, { useState } from "react";

interface IAddCampaignProps {
  onContribute: (amount: number) => void;
  onCancel?: () => void;
}

function AddContribute({ onContribute, onCancel }: IAddCampaignProps) {
  const [amount, setAmount] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Contribution amount must be a positive number");
      return;
    }
    onContribute(amount);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block font-semibold mb-1" htmlFor="minDonation">
          Amount to contribute (XLM)
        </label>
        <input
          id="minDonation"
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div className="flex space-x-4 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 cursor-pointer font-medium"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 cursor-pointer font-medium"
        >
          Create Campaign
        </button>
      </div>
    </form>
  );
}

export default AddContribute;
