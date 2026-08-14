import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  X,
  ShieldCheck,
  Cpu,
  Clock,
  Terminal,
} from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';
import { runAllUnitTests, TestResult } from '../../lib/tests';

export const TestRunnerModal: React.FC = () => {
  const { isTestRunnerOpen, setIsTestRunnerOpen } = useFinance();
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [runTimestamp, setRunTimestamp] = useState<string>('');

  const executeTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const testResults = runAllUnitTests();
      setResults(testResults);
      setIsRunning(false);
      setRunTimestamp(new Date().toLocaleTimeString());
    }, 200);
  };

  useEffect(() => {
    if (isTestRunnerOpen && results.length === 0) {
      executeTests();
    }
  }, [isTestRunnerOpen]);

  if (!isTestRunnerOpen) return null;

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.length - passedCount;
  const totalDuration = results.reduce((sum, r) => sum + r.durationMs, 0).toFixed(2);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-mono text-slate-100">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
        onClick={() => setIsTestRunnerOpen(false)}
      />

      <div className="relative w-full max-w-2xl rounded-lg border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
                Algorithm Verification Suite
              </h3>
              <p className="text-[10px] text-slate-500">
                Deterministic mathematical integrity & formula checks
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTestRunnerOpen(false)}
            className="rounded p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action & Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{passedCount} Passed</span>
            </div>
            {failedCount > 0 && (
              <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                <XCircle className="h-3.5 w-3.5" />
                <span>{failedCount} Failed</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-slate-500 text-[11px]">
              <Clock className="h-3 w-3" />
              <span>{totalDuration}ms</span>
            </div>
          </div>

          <button
            onClick={executeTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-2.5 py-1 text-xs font-bold text-white shadow-xs transition-colors"
          >
            <RotateCcw className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing...' : 'Re-run Tests'}</span>
          </button>
        </div>

        {/* Test Results Output List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-950/60">
          {results.map((test) => (
            <div
              key={test.id}
              className={`p-3 rounded border text-xs transition-colors ${
                test.passed
                  ? 'border-slate-800 bg-slate-900/60 text-slate-200'
                  : 'border-rose-500/40 bg-rose-500/10 text-rose-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {test.passed ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100">{test.name}</span>
                      <span className="rounded px-1.5 py-0.2 text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                        {test.category}
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] text-slate-400 space-y-0.5">
                      <p>
                        <span className="text-slate-500">Expected:</span> {test.expected}
                      </p>
                      <p>
                        <span className="text-slate-500">Actual:</span>{' '}
                        <span className={test.passed ? 'text-slate-300' : 'text-rose-400 font-bold'}>
                          {test.actual}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{test.durationMs}ms</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-500">
          <span>Executed locally in browser runtime</span>
          <button
            onClick={() => setIsTestRunnerOpen(false)}
            className="rounded border border-slate-700 bg-slate-800 px-3 py-1 text-slate-300 hover:bg-slate-700 font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
