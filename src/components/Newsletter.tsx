import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Newsletter: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [subscribed, setSubscribed] = useState(user?.newsletter_subscribed || false);

  const handleSubscribe = async () => {
    await updateProfile({ newsletter_subscribed: !subscribed });
    setSubscribed(!subscribed);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Newsletter Preferences</h1>
            <Link
              to="/settings"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Settings size={20} />
              Settings
            </Link>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Mail className="text-purple-600" size={24} />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Weekly Newsletter</h3>
                  <p className="text-gray-600">Get the latest updates and news every week</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={subscribed}
                  onChange={handleSubscribe}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {subscribed && (
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                <h4 className="text-purple-900 font-medium mb-2">Thank you for subscribing!</h4>
                <p className="text-purple-700">
                  You'll receive our next newsletter in your inbox. Stay tuned for exciting updates!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};