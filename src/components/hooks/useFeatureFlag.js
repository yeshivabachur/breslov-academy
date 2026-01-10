import { useSession } from '@/components/hooks/useSession';
import { FEATURE_FLAGS } from '@/components/config/featureFlags';

/**
 * useFeatureFlag Hook
 * Resolves whether a specific feature is enabled for the current context.
 * 
 * Priority:
 * 1. User Override (if applicable)
 * 2. School Setting (if applicable)
 * 3. Global Default
 * 
 * @param {string} flagKey - Key from FEATURE_FLAGS
 * @returns {boolean} - Whether the feature is enabled
 */
export function useFeatureFlag(flagKey) {
  const { user, activeSchool } = useSession();
  
  const flagDef = FEATURE_FLAGS[flagKey];
  if (!flagDef) {
    console.warn(`Unknown feature flag: ${flagKey}`);
    return false;
  }

  // 1. Check User Override (e.g. for beta testers)
  // Assumes user.feature_flags is a JSON object or map
  if (user?.feature_flags && typeof user.feature_flags[flagKey] !== 'undefined') {
    return !!user.feature_flags[flagKey];
  }

  // 2. Check School Setting
  // Assumes activeSchool.feature_flags is a JSON object or map
  if (activeSchool?.feature_flags && typeof activeSchool.feature_flags[flagKey] !== 'undefined') {
    return !!activeSchool.feature_flags[flagKey];
  }

  // 3. Fallback to Default
  return flagDef.defaultValue;
}

/**
 * Helper to check multiple flags
 */
export function useFeatureFlags(flagKeys) {
  const { user, activeSchool } = useSession();
  
  return flagKeys.reduce((acc, key) => {
    acc[key] = useFeatureFlag(key);
    return acc;
  }, {});
}
