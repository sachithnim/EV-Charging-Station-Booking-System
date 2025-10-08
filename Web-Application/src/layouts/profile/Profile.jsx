import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User, Mail, Phone, Shield, Lock, Eye, EyeOff, Save, Key, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react';


import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { changeUserPassword, updateUser } from '../../services/users/users';
import toast from 'react-hot-toast';

export default function Profile() {
  const { currentUser } = useOutletContext();
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    username: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });
  
  // Password form state
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // UI state
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle profile form changes
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle password form changes
  const handlePasswordChangeData = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    if (!profileData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!profileData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    if (!passwordData.oldPassword) {
      errors.oldPassword = 'Current password is required';
    }
    
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setProfileLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await updateUser(currentUser.identifier, {
        username: profileData.username,
        email: profileData.email
      });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
      setErrorMessage(error?.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setPasswordLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      await changeUserPassword(currentUser.identifier, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });
      
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    
      toast.success('Password changed successfully!');
        setSuccessMessage('Password changed successfully!');
    } catch (error) {
      setErrorMessage('Failed to change password. Please check your current password.');
      toast.error(error?.response?.data?.message || 'Failed to change password. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
      
    } finally {
      setPasswordLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Backoffice':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account information and security settings.</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-800 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {currentUser?.name || currentUser?.name}
              </h3>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(currentUser?.role)}`}>
                <Shield className="w-4 h-4 mr-1" />
                {currentUser?.role}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{currentUser?.email}</span>
              </div>
              {currentUser?.phone && (
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {/* <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${currentUser?.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>{currentUser?.isActive ? 'Active' : 'Inactive'}</span>
              </div> */}
            </div>

            {/* Functions/Permissions */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser?.functions?.map((func, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {func}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form and Password Change */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={profileData.username}
                  onChange={(e) => handleProfileChange('username', e.target.value)}
                  error={profileErrors.username}
                  icon={User}
                  placeholder="Enter username"
                  required
                />

                <Input
                  type="email"
                  label="Email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  error={profileErrors.email}
                  icon={Mail}
                  placeholder="Enter email"
                  required
                />
              </div>

              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  icon={User}
                  placeholder="Enter full name"
                />

                <Input
                  label="Phone Number"
                  value={profileData.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  icon={Phone}
                  placeholder="Enter phone number"
                />
              </div> */}

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  loading={profileLoading}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Update Profile
                </Button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                type="password"
                label="Current Password"
                value={passwordData.oldPassword}
                onChange={(e) => handlePasswordChangeData('oldPassword', e.target.value)}
                error={passwordErrors.oldPassword}
                icon={Lock}
                placeholder="Enter current password"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChangeData('newPassword', e.target.value)}
                  error={passwordErrors.newPassword}
                  icon={Lock}
                  placeholder="Enter new password"
                  required
                />

                <Input
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChangeData('confirmPassword', e.target.value)}
                  error={passwordErrors.confirmPassword}
                  icon={Lock}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• At least 6 characters long</li>
                  <li>• Must be different from your current password</li>
                  <li>• Should contain a mix of letters and numbers</li>
                </ul>
              </div>

              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  loading={passwordLoading}
                  className="flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}