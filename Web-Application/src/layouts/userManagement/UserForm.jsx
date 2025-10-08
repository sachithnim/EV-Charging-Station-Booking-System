import { useState } from 'react';
import { User, Mail } from 'lucide-react';
import Button from "../../components/button/Button";
import Input from '../../components/input/Input';
import toast from "react-hot-toast";

export default function UserForm({ 
  user = null, 
  onSubmit, 
  onCancel,
  loading = false 
}) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'Backoffice'
  });
  const [formErrors, setFormErrors] = useState({});

  const isEditMode = !!user;

  const validateForm = () => {
    const errors = {};

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!isEditMode && !formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (!isEditMode && formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!formData.role) {
      errors.role = 'Role is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = { ...formData };
    if (isEditMode && !submitData.password) {
      delete submitData.password;
      
    }

    toast.success(isEditMode ? 'User updated successfully!' : 'User created successfully!');

    onSubmit(submitData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Username"
        value={formData.username}
        onChange={(e) => handleInputChange('username', e.target.value)}
        error={formErrors.username}
        icon={User}
        placeholder="Enter username"
        required
      />

      <Input
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        error={formErrors.email}
        icon={Mail}
        placeholder="Enter email"
        required
      />

      {!isEditMode &&<Input
        type="password"
        label={isEditMode ? "Password (leave blank to keep current)" : "Password"}
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        error={formErrors.password}
        placeholder={isEditMode ? "Enter new password or leave blank" : "Enter password"}
        required={!isEditMode}
      />}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">
          Role <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200"
        >
          <option value="Backoffice">Backoffice</option>
          <option value="Admin">Admin</option>
          <option value="StationOperator">StationOperator</option>
        </select>
        {formErrors.role && (
          <span className="text-sm text-red-500">{formErrors.role}</span>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
          disabled={loading}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="flex-1"
          loading={loading}
        >
          {isEditMode ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
}