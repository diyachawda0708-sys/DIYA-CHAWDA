import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../../context/EcommerceContext';
import { analytics } from '../../services/analytics';
import { AnalyticsEvent } from '../../types';
import { Activity, X, Trash2, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

export const AnalyticsInspector: React.FC = () => {
  const { isAnalyticsOpen, setIsAnalyticsOpen } = useEcommerce();
  const [events, setEvents] = useState<AnalyticsEvent[]>(() => analytics.getEvents());
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to live events
    const unsubscribe = analytics.subscribe(() => {
      setEvents(analytics.getEvents());
    });
    return unsubscribe;
  }, []);

  if (!isAnalyticsOpen) return null;

  const handleCopyJson = (event: AnalyticsEvent) => {
    navigator.clipboard.writeText(JSON.stringify(event, null, 2));
    setCopiedId(event.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="analytics-inspector-heading"
    >
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity duration-200"
        onClick={() => setIsAnalyticsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-stone-900 text-stone-100 shadow-2xl flex flex-col justify-between border-l border-stone-800 font-mono text-xs">
          {/* Header */}
          <div className="p-4 border-b border-stone-800 flex items-center justify-between bg-stone-950">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <h3 id="analytics-inspector-heading" className="text-sm font-bold text-white tracking-wide">
                  GA4 DataLayer Live Stream
                </h3>
                <span className="text-[10px] text-stone-400 font-sans">
                  Capturing e-commerce & interaction telemetry
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  analytics.clearEvents();
                  setEvents([]);
                }}
                className="p-1.5 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition-colors"
                title="Clear event stream"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsAnalyticsOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded hover:bg-stone-800 transition-colors"
                aria-label="Close Inspector"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Event Stream List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {events.length === 0 ? (
              <div className="text-center py-16 text-stone-500 font-sans text-xs">
                No events recorded yet. Interact with the website (click goods, add to cart, search, apply filters) to see live telemetry stream.
              </div>
            ) : (
              events.map((evt) => {
                const isExpanded = expandedEventId === evt.id;
                const isEcommerceCore = [
                  'view_item',
                  'select_item',
                  'add_to_cart',
                  'remove_from_cart',
                  'view_cart',
                  'begin_checkout',
                  'purchase',
                ].includes(evt.name);

                return (
                  <div
                    key={evt.id}
                    className="border border-stone-800 rounded-lg bg-stone-950/80 overflow-hidden"
                  >
                    <div
                      onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                      className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-stone-800/60 transition-colors select-none"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                        )}
                        <span
                          className={`font-bold truncate ${
                            isEcommerceCore
                              ? 'text-emerald-400'
                              : evt.name.startsWith('page_')
                              ? 'text-sky-400'
                              : 'text-amber-300'
                          }`}
                        >
                          {evt.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 shrink-0 ml-2">
                        {evt.timestamp}
                      </span>
                    </div>

                    {isExpanded && (
                      <div className="p-3 bg-black/60 border-t border-stone-800 text-[11px] text-stone-300 space-y-2">
                        <div className="flex justify-between items-center text-stone-500 text-[10px]">
                          <span>Event ID: {evt.id}</span>
                          <button
                            onClick={() => handleCopyJson(evt)}
                            className="flex items-center gap-1 text-stone-400 hover:text-white"
                          >
                            {copiedId === evt.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>{copiedId === evt.id ? 'Copied' : 'Copy JSON'}</span>
                          </button>
                        </div>
                        <pre className="overflow-x-auto p-2 bg-stone-900/90 rounded text-emerald-300 font-mono text-[11px] leading-relaxed">
                          {JSON.stringify(evt.params, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="p-3 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-500 font-sans flex items-center justify-between">
            <span>Total Events: {events.length}</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              window.dataLayer active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
