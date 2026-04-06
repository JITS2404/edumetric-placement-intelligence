import React, { useState } from 'react';
import { getFormulaConfig, updateFormulaConfig, FormulaConfig } from '../services/formulaConfig';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [masterKey, setMasterKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [config, setConfig] = useState<FormulaConfig>(getFormulaConfig());
  const [activeSection, setActiveSection] = useState<'placement' | 'internship'>('placement');

  const MASTER_KEY = 'EDUMETRIC2024';

  const handleAuth = () => {
    if (masterKey === MASTER_KEY) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid master key');
    }
  };

  const handleSave = () => {
    updateFormulaConfig(config);
    alert('Formula configuration saved successfully!');
    onClose();
  };

  const handleReset = () => {
    setMasterKey('');
    setIsAuthenticated(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="text-xl font-bold text-white">Formula Settings</h2>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-lg p-2 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-yellow-800">Authentication Required</h3>
                    <p className="text-sm text-yellow-700 mt-1">Enter the master key to access formula settings.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Master Key</label>
                  <input
                    type="password"
                    value={masterKey}
                    onChange={(e) => setMasterKey(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter master key"
                  />
                  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                </div>
                <button
                  onClick={handleAuth}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Authenticate
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Section Tabs */}
              <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                <button
                  onClick={() => setActiveSection('placement')}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    activeSection === 'placement' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Placement Formulas
                </button>
                <button
                  onClick={() => setActiveSection('internship')}
                  className={`px-6 py-2 rounded-md font-medium transition ${
                    activeSection === 'internship' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-600'
                  }`}
                >
                  Internship Formulas
                </button>
              </div>

              {/* Placement Formulas */}
              {activeSection === 'placement' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Placement Score Components</h3>
                    <p className="text-sm text-blue-700">Configure the weights and caps for placement metrics.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">P - Percentage Cap</label>
                      <input
                        type="number"
                        value={config.placement.pCap}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, pCap: parseFloat(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">Max score for placement percentage</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Q - Quality Cap</label>
                      <input
                        type="number"
                        value={config.placement.qCap}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, qCap: parseFloat(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">Max score for quality metric</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">D - Dream Cap</label>
                      <input
                        type="number"
                        value={config.placement.dCap}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, dCap: parseFloat(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">Max score for dream offers</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">1 Offer Weight</label>
                      <input
                        type="number"
                        value={config.placement.offer1Weight}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, offer1Weight: parseFloat(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">Points per student with 1 offer</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">2 Offers Weight</label>
                      <input
                        type="number"
                        value={config.placement.offer2Weight}
                        onChange={(e) => setConfig({ ...config, placement: { ...config.placement, offer2Weight: parseFloat(e.target.value) } })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-2">Points per student with 2 offers</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Internship Formulas */}
              {activeSection === 'internship' && (
                <div className="space-y-6">
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Internship Target Percentages</h3>
                    <p className="text-sm text-purple-700">Configure target percentages for each year and department.</p>
                  </div>

                  {/* Engineering */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4">Engineering Department</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Year II Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.engineering.year2Target * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, year2Target: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Year III Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.engineering.year3Target * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, year3Target: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Year IV Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.engineering.year4Target * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, year4Target: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Conversion Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.engineering.conversionTarget * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, engineering: { ...config.internship.engineering, conversionTarget: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Arts */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4">Arts Department</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Year II Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.arts.year2Target * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, year2Target: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Year III Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.arts.year3Target * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, year3Target: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Conversion Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.arts.conversionTarget * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, arts: { ...config.internship.arts, conversionTarget: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* PG */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-4">PG Department</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Year I/II Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.pg.year1Target * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, year1Target: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <label className="block text-xs font-medium text-gray-600 mb-2">Conversion Target (%)</label>
                        <input
                          type="number"
                          value={config.internship.pg.conversionTarget * 100}
                          onChange={(e) => setConfig({ ...config, internship: { ...config.internship, pg: { ...config.internship.pg, conversionTarget: parseFloat(e.target.value) / 100 } } })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {isAuthenticated && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Lock Settings
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsModal;
