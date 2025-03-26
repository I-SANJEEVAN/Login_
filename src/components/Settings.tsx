import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName, avatar_url: avatarUrl });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>

          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-purple-100 flex items-center justify-center">
                  <User size={48} className="text-purple-600" />
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter avatar URL"
              />
              <p className="mt-2 text-sm text-gray-500">
                Tip: Use an image URL from Unsplash or any other image hosting service
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};