import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Users, 
  ShieldCheck, 
  Bell, 
  Globe, 
  RefreshCcw, 
  LogOut,
  Sliders,
  Wallet,
  CheckCircle2
} from 'lucide-react';

interface ProfileSettingsProps {
  onResetData: () => void;
  currency: string;
  setCurrency: (curr: string) => void;
}

export default function ProfileSettings({
  onResetData,
  currency,
  setCurrency
}: ProfileSettingsProps) {
  // Config state
  const [userName, setUserName] = useState('Sarah Jenkins');
  const [userRole, setUserRole] = useState('Senior Logistics & ERP Officer');
  const [facilityAlertThreshold, setFacilityAlertThreshold] = useState(25);
  const [enablePush, setEnablePush] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);
  const [showNotification, setShowNotification] = useState(false);

  const triggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 2500);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Mini Screen Header */}
      <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded-lg -mx-2 -mt-2 border-b border-slate-200">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">ENTERPRISE IDENTITY</span>
          <h2 className="text-sm font-bold text-slate-800">Profile & ERP Settings</h2>
        </div>
      </div>

      {showNotification && (
        <div id="settings-save-success" className="bg-emerald-50 text-emerald-800 border-l-4 border-emerald-500 p-2 text-xs rounded-r-lg flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
          <span>Local configuration fields updated successfully!</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xs border border-sky-950 flex gap-4 items-center">
        <div className="h-14 w-14 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-lg border border-slate-700">
          SJ
        </div>
        <div className="space-y-0.5">
          <input 
            type="text" 
            value={userName} 
            onChange={(e) => setUserName(e.target.value)}
            className="text-sm font-bold bg-transparent border-b border-transparent hover:border-slate-600 focus:border-sky-500 outline-none w-full text-slate-100"
          />
          <input 
            type="text" 
            value={userRole} 
            onChange={(e) => setUserRole(e.target.value)}
            className="text-[11px] text-sky-400 font-mono bg-transparent border-b border-transparent hover:border-slate-600 focus:border-sky-500 outline-none w-full"
          />
          <p className="text-[10px] text-slate-400">License ID: <span className="font-mono">ERP-DAL-2026-X8</span></p>
        </div>
      </div>

      {/* Enterprise Workspace specs */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-xs space-y-3 text-xs">
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-50 pb-1.5 uppercase font-mono">
          <Building2 size={13} className="text-sky-600" /> Enterprise Workspace
        </h3>
        
        <div className="grid grid-cols-2 gap-3 pb-1 text-slate-600">
          <div className="space-y-1">
            <span className="font-medium text-slate-400 block text-[10px]">ORGANIZATION</span>
            <p className="font-bold text-slate-700">Dallas Components Corp</p>
          </div>
          <div className="space-y-1">
            <span className="font-medium text-slate-400 block text-[10px]">FACILITY SITE</span>
            <p className="font-bold text-slate-700 flex items-center gap-0.5"><MapPin size={10} className="text-rose-500" /> HQ Distro-01</p>
          </div>
        </div>

        <form onSubmit={triggerSave} className="space-y-3 pt-2">
          <div className="space-y-1">
            <label className="font-semibold block text-slate-600">Preferred ERP Currency</label>
            <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-0.5">
              {['USD ($)', 'EUR (€)', 'JPY (¥)', 'GBP (£)'].map((curr) => {
                const isSelected = currency === curr.split(' ')[0];
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr.split(' ')[0])}
                    className={`flex-1 text-[11px] font-semibold py-1.5 rounded transition ${
                      isSelected 
                        ? 'bg-slate-800 text-white shadow-xs' 
                        : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {curr}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-semibold block text-slate-600">Reorder Alert Lead-time (Days)</label>
              <span className="font-mono font-bold text-sky-600">{facilityAlertThreshold} Days</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="60" 
              value={facilityAlertThreshold}
              onChange={(e) => setFacilityAlertThreshold(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* System Toggles */}
          <div className="space-y-2 pt-1 border-t border-slate-50">
            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-slate-600">Stock Outflow Notifications</span>
              <button
                type="button"
                id="toggle-push"
                onClick={() => setEnablePush(!enablePush)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                  enablePush ? 'bg-sky-600' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                  enablePush ? 'translate-x-[22px]' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-slate-600">Weekly PO Expenses Digest</span>
              <button
                type="button"
                id="toggle-digest"
                onClick={() => setEmailDigest(!emailDigest)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                  emailDigest ? 'bg-sky-600' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                  emailDigest ? 'translate-x-[22px]' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="font-semibold text-slate-600">Enforce Multi-Factor Auth (MFA)</span>
              <button
                type="button"
                id="toggle-mfa"
                onClick={() => setTwoFactor(!twoFactor)}
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                  twoFactor ? 'bg-sky-600' : 'bg-slate-200'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition ${
                  twoFactor ? 'translate-x-[22px]' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-2 rounded-lg py-2 shadow-xs transition"
          >
            Save Profile Configurations
          </button>
        </form>
      </div>

      {/* Database Operations */}
      <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl space-y-2">
        <h4 className="text-xs font-bold text-rose-800 flex items-center gap-1">
          <RefreshCcw size={12} /> Critical Admin Actions
        </h4>
        <p className="text-[11px] text-rose-600 leading-normal">
          Wipe locally stored session state databases (Items, Supplier list logs, active Customer orders, Adjustments log) and reconstruct the baseline enterprise blueprints.
        </p>
        <button 
          onClick={() => {
            if(window.confirm('Are you sure you want to restore the entire ERP local database to standard demo values?')) {
              onResetData();
            }
          }}
          className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow-sm transition"
        >
          Reset Demo Databases
        </button>
      </div>
    </div>
  );
}
