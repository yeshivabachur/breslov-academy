import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PortalGate from '@/components/routing/PortalGate';
import PortalPageResolver from '@/portals/shared/PortalPageResolver';
import TeacherLayout from './TeacherLayout';

export default function TeacherPortal() {
  return (
    <PortalGate
      portalPrefix="/teacher"
      intendedAudience="teacher"
      allowedAudiences={['teacher','admin']}
    >
      <TeacherLayout>
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="teach/quizzes" element={<PortalPageResolver portalHome="dashboard" audience="teacher" pageKeyOverride="TeachQuizzes" />} />
          <Route path="teach/quizzes/new" element={<PortalPageResolver portalHome="dashboard" audience="teacher" pageKeyOverride="TeachQuizEditor" />} />
          <Route path="teach/quizzes/:quizId" element={<PortalPageResolver portalHome="dashboard" audience="teacher" pageKeyOverride="TeachQuizEditor" />} />
          <Route path="teach/grading" element={<PortalPageResolver portalHome="dashboard" audience="teacher" pageKeyOverride="TeachGrading" />} />
          <Route path="quiz/:quizId" element={<PortalPageResolver portalHome="dashboard" audience="teacher" pageKeyOverride="QuizTake" />} />
          <Route path=":pageName" element={<PortalPageResolver portalHome="dashboard" audience="teacher" />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </TeacherLayout>
    </PortalGate>
  );
}
