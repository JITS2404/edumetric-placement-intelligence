import React, { useState, useEffect } from 'react';
import { getFormulaConfig, updateFormulaConfig, FormulaConfig } from '../services/formulaConfig';

interface FormulaSettingsProps {
  onBack: () => void;
}

const FormulaSettings: React.FC<FormulaSettingsProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [error, setError] = useState('');
  const [config, setConfig] = useState<FormulaConfig | null>(null);

  useEffect(() => {
    getFormulaConfig().then(cfg => {
      if (!cfg.placementRate) {
        cfg.placementRate = {
          formula: '(Total Placed / Total Enrolled) × 100',
          description: 'Calculates the percentage of students placed out of total enrolled students'
        };
      }
      setConfig(cfg);
    });
  }, []);
  const [MASTER_KEY, setMASTER_KEY] = useState('123');

  useEffect(() => {
    fetch('http://localhost:3001/api/master-key')
      .then(res => res.json())
      .then(data => setMASTER_KEY(data.key_value))
      .catch(() => setMASTER_KEY('123'));
  }, []);
  const [clickCount, setClickCount] = useState(0);
  const [shiftHoldTime, setShiftHoldTime] = useState(0);
  const [showSecretPanel, setShowSecretPanel] = useState(false);
  const [newMasterKey, setNewMasterKey] = useState('');
  const [confirmMasterKey, setConfirmMasterKey] = useState('');
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleAuth = () => {
    if (masterKey === MASTER_KEY) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid master key');
    }
  };

  const handleLockClick = () => {
    setClickCount(prev => prev + 1);
    setTimeout(() => setClickCount(0), 2000);
    if (clickCount === 2) {
      setIsUnlocking(true);
      setTimeout(() => {
        setIsUnlocking(false);
        setShowSecretPanel(true);
      }, 800);
    }
  };

  const handleChangeMasterKey = async () => {
    if (newMasterKey.length < 3) {
      alert('Master key must be at least 3 characters!');
      return;
    }
    if (newMasterKey !== confirmMasterKey) {
      alert('Keys do not match!');
      return;
    }
    try {
      await fetch('http://localhost:3001/api/master-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key_value: newMasterKey })
      });
      setMASTER_KEY(newMasterKey);
      setShowSecretPanel(false);
      setNewMasterKey('');
      setConfirmMasterKey('');
      alert('🎉 Master Key Changed Successfully!');
    } catch (error) {
      alert('Failed to update master key');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 rounded-3xl blur-2xl"></div>
          <div className="relative bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/60 p-10">
            <div className="text-center mb-8">
              <div 
                onClick={handleLockClick}
                className={`bg-gradient-to-br from-indigo-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 cursor-pointer hover:scale-110 hover:rotate-6 transition-all shadow-xl ${
                  isUnlocking ? 'animate-[wiggle_0.3s_ease-in-out_2]' : ''
                }`}
              >
                {isUnlocking ? (
                  <svg className="w-10 h-10 text-white animate-[unlock_0.8s_ease-in-out]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                )}
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Formula Settings Access</h2>
              <p className="text-gray-600 mt-2 font-medium">Enter master key to edit formulas</p>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h3 className="font-bold text-yellow-900 text-sm">Authentication Required</h3>
                  <p className="text-xs text-yellow-800 mt-1 font-medium">Only authorized users can modify formulas.</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Master Key</label>
                <input
                  type="password"
                  value={masterKey}
                  onChange={(e) => setMasterKey(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                  className="w-full px-4 py-3 bg-white/60 backdrop-blur-xl border-2 border-indigo-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
                  placeholder="Enter master key"
                />
                {error && <p className="text-red-600 text-sm mt-2 font-semibold">{error}</p>}
              </div>
              <div className="flex gap-3 pt-2">
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-400/30 to-gray-500/30 rounded-xl blur-md"></div>
                  <button
                    onClick={onBack}
                    className="relative w-full bg-white/60 backdrop-blur-xl text-gray-700 py-3 rounded-xl font-bold hover:bg-white/80 transition-all border-2 border-white/60 hover:scale-105 active:scale-95 shadow-lg"
                  >
                    Back
                  </button>
                </div>
                <div className="relative flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 rounded-xl blur-md"></div>
                  <button
                    onClick={handleAuth}
                    className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all border-2 border-white/40 hover:scale-105 active:scale-95 shadow-xl"
                  >
                    Authenticate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showSecretPanel && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl shadow-2xl border-4 border-purple-400 p-8 max-w-md w-full mx-4 animate-scaleIn">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500">🔐 SECRET PANEL</h2>
                <p className="text-purple-200 mt-2">Change Master Key</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">New Master Key</label>
                  <input
                    type="password"
                    value={newMasterKey}
                    onChange={(e) => setNewMasterKey(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-400 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter new key"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">Confirm Master Key</label>
                  <input
                    type="password"
                    value={confirmMasterKey}
                    onChange={(e) => setConfirmMasterKey(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border-2 border-purple-400 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Confirm new key"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowSecretPanel(false)}
                    className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleChangeMasterKey}
                    className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 py-3 rounded-lg font-bold hover:from-yellow-500 hover:to-orange-600 transition shadow-lg"
                  >
                    🔑 Change Key
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSave = async () => {
    if (!config) return;
    await updateFormulaConfig(config);
    alert('Formula configuration saved successfully!');
  };

  if (!config) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Settings
      </button>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <div>
            <h3 className="text-xl font-bold text-white">Formula Settings</h3>
            <p className="text-blue-100 text-sm">Configure calculation formulas and parameters</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* 1. Placement Percentage */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-orange-500 pb-2">PLACEMENT / PERCENTAGE</h2>
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
            <div className="space-y-4">
              {/* P Component */}
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Label:</span>
                    <input
                      type="text"
                      value={config.placement.pLabel}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, pLabel: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Formula:</span>
                    <input
                      type="text"
                      value={config.placement.pFormula}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, pFormula: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Max Cap:</span>
                    <input
                      type="number"
                      value={config.placement.pCap}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, pCap: parseFloat(e.target.value) } })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Q Component */}
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Label:</span>
                    <input
                      type="text"
                      value={config.placement.qLabel}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, qLabel: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Formula:</span>
                    <input
                      type="text"
                      value={config.placement.qFormula}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, qFormula: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24 mt-2">Description:</span>
                    <textarea
                      value={config.placement.qDescription}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, qDescription: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Max Cap:</span>
                    <input
                      type="number"
                      value={config.placement.qCap}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, qCap: parseFloat(e.target.value) } })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* D Component */}
              <div className="bg-white rounded-lg p-4 border border-orange-100">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Label:</span>
                    <input
                      type="text"
                      value={config.placement.dLabel}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, dLabel: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Formula:</span>
                    <input
                      type="text"
                      value={config.placement.dFormula}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, dFormula: e.target.value } })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">1 Offer Weight:</span>
                      <input
                        type="number"
                        value={config.placement.offer1Weight}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, offer1Weight: parseFloat(e.target.value) } })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600">2 Offers Weight:</span>
                      <input
                        type="number"
                        value={config.placement.offer2Weight}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, offer2Weight: parseFloat(e.target.value) } })}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-orange-700 w-24">Max Cap:</span>
                    <input
                      type="number"
                      value={config.placement.dCap}
                      onChange={(e) => setConfig({ ...config, placement: { ...config.placement, dCap: parseFloat(e.target.value) } })}
                      className="w-32 px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Total Formula:</span>
                  <input
                    type="text"
                    value={config.placement.totalFormula}
                    onChange={(e) => setConfig({ ...config, placement: { ...config.placement, totalFormula: e.target.value } })}
                    className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded text-sm font-mono text-white placeholder-white/70"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/40 to-red-500/40 rounded-xl blur-lg"></div>
              <button
                onClick={handleSave}
                className="relative px-8 py-3 bg-white/50 backdrop-blur-xl border-2 border-white/60 text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-bold hover:bg-white/70 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Save Placement Settings
              </button>
            </div>
          </div>
        </div>

        {/* 2. Internship Parameter (Engineering) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-purple-500 pb-2">Internship Parameter (For Engineering)</h2>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <textarea
                  value={config.internship.engineering.componentALabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, componentALabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Year II Target (%)</label>
                <input
                  type="number"
                  value={config.internship.engineering.year2Target * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, year2Target: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <textarea
                  value={config.internship.engineering.componentBLabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, componentBLabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Year III Target (%)</label>
                <input
                  type="number"
                  value={config.internship.engineering.year3Target * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, year3Target: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <textarea
                  value={config.internship.engineering.componentCLabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, componentCLabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Year IV Target (%)</label>
                <input
                  type="number"
                  value={config.internship.engineering.year4Target * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, year4Target: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-purple-100">
                <textarea
                  value={config.internship.engineering.componentDLabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, componentDLabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Conversion Target (%)</label>
                <input
                  type="number"
                  value={config.internship.engineering.conversionTarget * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, conversionTarget: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="bg-purple-600 rounded-lg p-4 text-white">
              <label className="block text-xs font-semibold mb-2">Final Formula:</label>
              <input
                type="text"
                value={config.internship.engineering.finalFormula}
                onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, finalFormula: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-sm font-mono text-white"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 rounded-xl blur-lg"></div>
              <button
                onClick={handleSave}
                className="relative px-8 py-3 bg-white/50 backdrop-blur-xl border-2 border-white/60 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-bold hover:bg-white/70 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Save Engineering Settings
              </button>
            </div>
          </div>
        </div>

        {/* 3. For Arts Courses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-green-500 pb-2">For Arts Courses</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <textarea
                  value={config.internship.arts.componentALabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, componentALabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Year II Target (%)</label>
                <input
                  type="number"
                  value={config.internship.arts.year2Target * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, year2Target: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100">
                <textarea
                  value={config.internship.arts.componentBLabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, componentBLabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Year III Target (%)</label>
                <input
                  type="number"
                  value={config.internship.arts.year3Target * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, year3Target: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-green-100 col-span-2">
                <textarea
                  value={config.internship.arts.componentCLabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, componentCLabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Conversion Target (%)</label>
                <input
                  type="number"
                  value={config.internship.arts.conversionTarget * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, conversionTarget: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
            <div className="bg-green-600 rounded-lg p-4 text-white">
              <label className="block text-xs font-semibold mb-2">Final Formula:</label>
              <input
                type="text"
                value={config.internship.arts.finalFormula}
                onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, finalFormula: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-sm font-mono text-white"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-xl blur-lg"></div>
              <button
                onClick={handleSave}
                className="relative px-8 py-3 bg-white/50 backdrop-blur-xl border-2 border-white/60 text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-bold hover:bg-white/70 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Save Arts Settings
              </button>
            </div>
          </div>
        </div>

        {/* 4. For PG Courses */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2">For PG Courses</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <textarea
                  value={config.internship.pg.componentALabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, componentALabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                  placeholder="Component A Label"
                />
                <textarea
                  value={config.internship.pg.componentAFormula}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, componentAFormula: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2 font-mono"
                  rows={1}
                  placeholder="Formula"
                />
                <textarea
                  value={config.internship.pg.componentADescription}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, componentADescription: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                  placeholder="Description"
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Year I/II Target (%)</label>
                <input
                  type="number"
                  value={config.internship.pg.year1Target * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, year1Target: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <textarea
                  value={config.internship.pg.componentBLabel}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, componentBLabel: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                  placeholder="Component B Label"
                />
                <textarea
                  value={config.internship.pg.componentBFormula}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, componentBFormula: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2 font-mono"
                  rows={1}
                  placeholder="Formula"
                />
                <textarea
                  value={config.internship.pg.componentBDescription}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, componentBDescription: e.target.value } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm mb-2"
                  rows={2}
                  placeholder="Description"
                />
                <label className="block text-xs font-medium text-gray-600 mb-1">Conversion Target (%)</label>
                <input
                  type="number"
                  value={config.internship.pg.conversionTarget * 100}
                  onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, conversionTarget: parseFloat(e.target.value) / 100 } } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-900 mb-2">C = MAX 100 MARKS</div>
                  <div className="text-sm text-gray-600">A+B</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <label className="block text-xs font-medium text-gray-600 mb-2">Strength Note:</label>
              <input
                type="text"
                value={config.internship.pg.strengthNote}
                onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, strengthNote: e.target.value } } })}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="e.g., S1 are Strength Second Years"
              />
            </div>
            <div className="bg-blue-600 rounded-lg p-4 text-white">
              <label className="block text-xs font-semibold mb-2">Final Formula:</label>
              <input
                type="text"
                value={config.internship.pg.finalFormula}
                onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, finalFormula: e.target.value } } })}
                className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded text-sm font-mono text-white"
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-cyan-500/40 rounded-xl blur-lg"></div>
              <button
                onClick={handleSave}
                className="relative px-8 py-3 bg-white/50 backdrop-blur-xl border-2 border-white/60 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-bold hover:bg-white/70 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Save PG Settings
              </button>
            </div>
          </div>
        </div>

        {/* 5. Placement Rate Formula */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 border-b-2 border-teal-500 pb-2">Placement Rate Formula</h2>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
            <div className="bg-white rounded-lg p-4 border border-teal-100 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Formula:</label>
                <input
                  type="text"
                  value={config.placementRate?.formula || ''}
                  onChange={(e) => setConfig({ ...config, placementRate: { ...config.placementRate!, formula: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono"
                  placeholder="e.g., (Total Placed / Total Enrolled) × 100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-teal-700 mb-2">Description:</label>
                <textarea
                  value={config.placementRate?.description || ''}
                  onChange={(e) => setConfig({ ...config, placementRate: { ...config.placementRate!, description: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  rows={2}
                  placeholder="Describe what this formula calculates"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/40 to-cyan-500/40 rounded-xl blur-lg"></div>
              <button
                onClick={handleSave}
                className="relative px-8 py-3 bg-white/50 backdrop-blur-xl border-2 border-white/60 text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl font-bold hover:bg-white/70 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Save Placement Rate Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default FormulaSettings;
