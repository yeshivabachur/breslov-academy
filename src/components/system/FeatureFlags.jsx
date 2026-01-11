import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from '@/components/hooks/useSession';
import { buildCacheKey, scopedFilter } from '@/components/api/scoped';

const FeatureFlagContext = createContext({});

export function FeatureFlagProvider({ children }) {
  const { activeSchoolId } = useSession();

  const { data: flags = {} } = useQuery({
    queryKey: buildCacheKey('feature-flags', activeSchoolId),
    queryFn: async () => {
      if (!activeSchoolId) return {};
      
      const settings = await scopedFilter('SchoolSetting', activeSchoolId, {
        key: { $startsWith: 'feature_' }
      });
      
      const flagMap = {};
      settings.forEach(s => {
        flagMap[s.key.replace('feature_', '')] = s.value === 'true' || s.value === true;
      });
      
      return flagMap;
    },
    enabled: !!activeSchoolId
  });

  // Default flags (always on for testing/admins)
  const effectiveFlags = useMemo(() => {
    const defaults = {
      ai_tutor: true,
      adaptive_learning: false,
      grading_v2: true,
      gamification: true
    };
    
    // Merge school-specific flags
    return { ...defaults, ...flags };
  }, [flags]);

  return (
    <FeatureFlagContext.Provider value={effectiveFlags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flagName) {
  const flags = useContext(FeatureFlagContext);
  return !!flags[flagName];
}

export function FeatureGate({ flag, children, fallback = null }) {
  const enabled = useFeatureFlag(flag);
  if (!enabled) return fallback;
  return <>{children}</>;
}
