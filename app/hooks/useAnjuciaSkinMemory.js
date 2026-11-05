"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

const STORAGE_KEY = "anjucia_dermoscan_profile";

const DEFAULT_PROFILE = {
  wilaya: "16 - Alger",
  allergies: [],
  memories: [],
  scanHistory: [],
  updatedAt: null
};

/**
 * Persistent Long-Term User Memory & Clinical Progress Tracker Hook
 * Synced to localStorage under `anjucia_dermoscan_profile`.
 */
export function useAnjuciaSkinMemory() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile({
          wilaya: parsed.wilaya || "16 - Alger",
          allergies: Array.isArray(parsed.allergies) ? parsed.allergies : [],
          memories: Array.isArray(parsed.memories) ? parsed.memories : [],
          scanHistory: Array.isArray(parsed.scanHistory) ? parsed.scanHistory : [],
          updatedAt: parsed.updatedAt || null
        });
      }
    } catch (err) {
      console.warn("Could not read anjucia_dermoscan_profile:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const persistProfile = useCallback((nextProfile) => {
    setProfile(nextProfile);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile));
      } catch (err) {
        console.warn("Could not save anjucia_dermoscan_profile:", err);
      }
    }
  }, []);

  const updateWilaya = useCallback(
    (wilaya) => {
      setProfile((prev) => {
        const next = { ...prev, wilaya, updatedAt: new Date().toISOString() };
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch (_) {}
        }
        return next;
      });
    },
    []
  );

  const appendMemories = useCallback((newMemories = [], newAllergies = []) => {
    if ((!Array.isArray(newMemories) || newMemories.length === 0) && (!Array.isArray(newAllergies) || newAllergies.length === 0)) {
      return;
    }
    setProfile((prev) => {
      const existingMemLower = new Set(prev.memories.map((m) => String(m).toLowerCase().trim()));
      const mergedMemories = [...prev.memories];
      (newMemories || []).forEach((m) => {
        const cleaned = String(m || "").trim();
        if (cleaned && !existingMemLower.has(cleaned.toLowerCase())) {
          existingMemLower.add(cleaned.toLowerCase());
          mergedMemories.push(cleaned);
        }
      });

      const existingAllergiesLower = new Set(prev.allergies.map((a) => String(a).toLowerCase().trim()));
      const mergedAllergies = [...prev.allergies];
      (newAllergies || []).forEach((a) => {
        const cleaned = String(a || "").trim();
        if (cleaned && !existingAllergiesLower.has(cleaned.toLowerCase())) {
          existingAllergiesLower.add(cleaned.toLowerCase());
          mergedAllergies.push(cleaned);
        }
      });

      const next = {
        ...prev,
        memories: mergedMemories.slice(-25),
        allergies: mergedAllergies.slice(-15),
        updatedAt: new Date().toISOString()
      };

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (_) {}
      }
      return next;
    });
  }, []);

  const recordScan = useCallback(
    ({ telemetry, wilaya, extractedNewMemories = [], mode = "camera" }) => {
      if (!telemetry) return;
      setProfile((prev) => {
        const existingMemLower = new Set(prev.memories.map((m) => String(m).toLowerCase().trim()));
        const mergedMemories = [...prev.memories];
        (extractedNewMemories || []).forEach((m) => {
          const cleaned = String(m || "").trim();
          if (cleaned && !existingMemLower.has(cleaned.toLowerCase())) {
            existingMemLower.add(cleaned.toLowerCase());
            mergedMemories.push(cleaned);
          }
        });

        const scanEntry = {
          id: `SCAN-${Date.now()}`,
          timestamp: new Date().toISOString(),
          mode,
          wilaya: wilaya || prev.wilaya,
          skinType: telemetry.skinType || "Mixte",
          hydrationScore: Number(telemetry.hydrationScore) || 65,
          barrierIntegrityScore: Number(telemetry.barrierIntegrityScore) || 68,
          sebumLevel: telemetry.sebumLevel || "Modéré",
          rednessLevel: telemetry.rednessLevel || "Faible"
        };

        const nextHistory = [...prev.scanHistory, scanEntry].slice(-20);
        const next = {
          ...prev,
          wilaya: wilaya || prev.wilaya,
          memories: mergedMemories.slice(-25),
          scanHistory: nextHistory,
          updatedAt: new Date().toISOString()
        };

        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch (_) {}
        }
        return next;
      });
    },
    []
  );

  const removeMemory = useCallback((index) => {
    setProfile((prev) => {
      const nextMemories = prev.memories.filter((_, idx) => idx !== index);
      const next = { ...prev, memories: nextMemories, updatedAt: new Date().toISOString() };
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (_) {}
      }
      return next;
    });
  }, []);

  const clearProfile = useCallback(() => {
    persistProfile({ ...DEFAULT_PROFILE, updatedAt: new Date().toISOString() });
  }, [persistProfile]);

  // Compute progress comparison between latest 2 scans
  const progressComparison = useMemo(() => {
    const history = profile.scanHistory || [];
    if (history.length < 2) return null;
    const latest = history[history.length - 1];
    const previous = history[history.length - 2];
    const hydrationDelta = Math.round((latest.hydrationScore || 0) - (previous.hydrationScore || 0));
    const barrierDelta = Math.round((latest.barrierIntegrityScore || 0) - (previous.barrierIntegrityScore || 0));

    return {
      hydrationDelta,
      barrierDelta,
      previousTimestamp: previous.timestamp,
      latestTimestamp: latest.timestamp,
      totalScans: history.length
    };
  }, [profile.scanHistory]);

  return {
    profile,
    isLoaded,
    updateWilaya,
    appendMemories,
    recordScan,
    removeMemory,
    clearProfile,
    progressComparison
  };
}

