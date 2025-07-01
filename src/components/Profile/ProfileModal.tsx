import React from 'react';
import { X } from 'lucide-react';
import { useProfileStore } from '../../stores/profileStore';
import Profile from '../../pages/Profile';

const ProfileModal: React.FC = () => {
  const { isOpen, toggleProfile } = useProfileStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={toggleProfile} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative bg-slate-900 w-full max-w-3xl rounded-xl overflow-y-auto max-h-full">
          <button
            onClick={toggleProfile}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700 text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="p-6">
            <Profile />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileModal;
