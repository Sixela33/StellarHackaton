import React, { useState } from "react";
import { 
  X, 
  Plus, 
  Target, 
  Calendar, 
  DollarSign, 
  Image as ImageIcon,
  Upload,
  CheckCircle
} from "lucide-react";

interface Milestone {
  id: number;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  evidence: string;
}

export interface CampaignForm {
  title: string;
  description: string;
  category: string;
  goal: number;
  minDonation: number;
  endDate: string;
  image: string;
  milestones: Milestone[];
}

interface FormErrors {
  title?: string;
  description?: string;
  category?: string;
  goal?: string;
  minDonation?: string;
  endDate?: string;
  milestones?: string;
}

interface CreateCampaignProps {
  onClose: () => void;
  onSubmit: (campaign: CampaignForm) => void;
}

const CreateCampaign: React.FC<CreateCampaignProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CampaignForm>({
    title: "",
    description: "",
    category: "",
    goal: 0,
    minDonation: 0,
    endDate: "",
    image: "",
    milestones: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<FormErrors>({});

  const categories = [
    "Environment",
    "Healthcare", 
    "Education",
    "Technology",
    "Arts & Culture",
    "Community Development",
    "Animal Welfare",
    "Other"
  ];

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: Date.now(),
      title: "",
      description: "",
      amount: 0,
      dueDate: "",
      evidence: ""
    };
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, newMilestone]
    }));
  };

  const updateMilestone = (id: number, field: keyof Milestone, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map(milestone =>
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    }));
  };

  const removeMilestone = (id: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter(milestone => milestone.id !== id)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (formData.goal <= 0) newErrors.goal = "Goal must be greater than 0";
      if (formData.minDonation <= 0) newErrors.minDonation = "Minimum donation must be greater than 0";
      if (!formData.endDate) newErrors.endDate = "End date is required";
    }

    if (step === 2) {
      if (formData.milestones.length === 0) {
        newErrors.milestones = "At least one milestone is required";
      } else {
        let milestoneError = "";
        formData.milestones.forEach((milestone, index) => {
          if (!milestone.title.trim()) {
            milestoneError = `Milestone ${index + 1} title is required`;
          }
          if (milestone.amount <= 0) {
            milestoneError = `Milestone ${index + 1} amount must be greater than 0`;
          }
        });
        if (milestoneError) {
          newErrors.milestones = milestoneError;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSubmit(formData);
    }
  };

  const totalMilestoneAmount = formData.milestones.reduce((sum, milestone) => sum + milestone.amount, 0);
  const remainingAmount = formData.goal - totalMilestoneAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Start Your Fundraising Journey</h2>
            <p className="text-gray-600">Create a compelling campaign and start making a difference today</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b bg-gray-50">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-[#fac141]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 1 ? 'bg-[#fac141] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > 1 ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Basic Info</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-[#fac141]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 2 ? 'bg-[#fac141] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {currentStep > 2 ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">Milestones</span>
            </div>
            <div className="flex-1 h-px bg-gray-300"></div>
            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-[#fac141]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= 3 ? 'bg-[#fac141] text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                3
              </div>
              <span className="font-medium">Review</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter campaign title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
        </label>
        <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
          ))}
        </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Describe your campaign and its goals"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Funding Goal (XLM) *
        </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="number"
                      value={formData.goal}
                      onChange={(e) => setFormData(prev => ({ ...prev, goal: Number(e.target.value) }))}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.goal ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      min="1"
        />
      </div>
                  {errors.goal && <p className="text-red-500 text-sm mt-1">{errors.goal}</p>}
                </div>

      <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Donation (XLM) *
        </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="number"
                      value={formData.minDonation}
                      onChange={(e) => setFormData(prev => ({ ...prev, minDonation: Number(e.target.value) }))}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.minDonation ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      min="1"
                    />
                  </div>
                  {errors.minDonation && <p className="text-red-500 text-sm mt-1">{errors.minDonation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.endDate ? 'border-red-500' : 'border-gray-300'
                      }`}
        />
      </div>
                  {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Image
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload an image for your campaign</p>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Choose Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Campaign Milestones</h3>
                <button
                  type="button"
                  onClick={addMilestone}
                  className="px-4 py-2 bg-[#fac141] text-white rounded-lg hover:bg-[#f0b030] transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Milestone</span>
                </button>
              </div>

              {errors.milestones && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{errors.milestones}</p>
                </div>
              )}

              {formData.milestones.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">No milestones added yet</p>
                  <p className="text-gray-500 text-sm">Add milestones to break down your project goals</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.milestones.map((milestone, index) => (
                    <div key={milestone.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Milestone {index + 1}</h4>
          <button
            type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                          <input
                            type="text"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Milestone title"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Amount (XLM) *</label>
                          <input
                            type="number"
                            value={milestone.amount}
                            onChange={(e) => updateMilestone(milestone.id, 'amount', Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="0"
                            min="1"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Describe what this milestone will achieve"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                          <input
                            type="date"
                            value={milestone.dueDate}
                            onChange={(e) => updateMilestone(milestone.id, 'dueDate', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Evidence Required</label>
                          <input
                            type="text"
                            value={milestone.evidence}
                            onChange={(e) => updateMilestone(milestone.id, 'evidence', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="e.g., Photos, documents, etc."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Milestone Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Total Milestone Amount:</span>
                  <span className="font-semibold text-gray-900">{totalMilestoneAmount.toLocaleString()} XLM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Campaign Goal:</span>
                  <span className="font-semibold text-gray-900">{formData.goal.toLocaleString()} XLM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Remaining:</span>
                  <span className={`font-semibold ${remainingAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {remainingAmount >= 0 ? remainingAmount.toLocaleString() : Math.abs(remainingAmount).toLocaleString()} XLM
                    {remainingAmount < 0 ? ' (Over budget)' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Your Campaign</h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Campaign Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Title:</span>
                    <p className="font-medium">{formData.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span>
                    <p className="font-medium">{formData.category}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Goal:</span>
                    <p className="font-medium">{formData.goal.toLocaleString()} XLM</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Min Donation:</span>
                    <p className="font-medium">{formData.minDonation.toLocaleString()} XLM</p>
                  </div>
                  <div>
                    <span className="text-gray-600">End Date:</span>
                    <p className="font-medium">{formData.endDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Milestones:</span>
                    <p className="font-medium">{formData.milestones.length}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <span className="text-gray-600 text-sm">Description:</span>
                  <p className="text-sm mt-1">{formData.description}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Milestones</h4>
                <div className="space-y-3">
                  {formData.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div>
                        <p className="font-medium">{milestone.title}</p>
                        <p className="text-sm text-gray-600">{milestone.amount.toLocaleString()} XLM</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Due: {milestone.dueDate}</p>
                        <p className="text-xs text-gray-500">{milestone.evidence}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Ready to Submit</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      Your campaign will be reviewed by our admin team. Once approved, it will be listed on the platform and you can start receiving contributions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="flex space-x-3">
            {currentStep > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
            
            {currentStep < 3 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 bg-[#fac141] text-white rounded-lg hover:bg-[#f0b030] transition-colors"
              >
                Next
              </button>
            ) : (
        <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-[#fac141] text-white rounded-lg hover:bg-[#f0b030] transition-colors"
        >
                Submit Campaign
        </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaign;
