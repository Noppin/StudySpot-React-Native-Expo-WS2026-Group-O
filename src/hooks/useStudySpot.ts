import { useContext } from 'react';

import { StudySpotContext } from '../store/StudySpotContext';

export function useStudySpot() {
  const context = useContext(StudySpotContext);

  if (!context) {
    throw new Error('useStudySpot must be used inside StudySpotProvider.');
  }

  return context;
}
