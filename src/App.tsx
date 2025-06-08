import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ElectoralRollPage from './pages/ElectoralRollPage';
import VoterRegistrationPage from './pages/VoterRegistrationPage';
import PartyRegistrationPage from './pages/PartyRegistrationPage';
import PartyRegistrationFormPage from './pages/PartyRegistrationFormPage';
import PartyReviewPage from './pages/PartyReviewPage';
import AcademicAdminPage from './pages/AcademicAdminPage';
import PrecinctAdminPage from './pages/PrecinctAdminPage';
import VotingPage from './pages/VotingPage';
import ResultsPage from './pages/ResultsPage';
import ElectionManagementPage from './pages/ElectionManagementPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="electoral-roll" element={<ElectoralRollPage />} />
        <Route path="voter-registration" element={<VoterRegistrationPage />} />
        <Route path="party-registration" element={<PartyRegistrationPage />} />
        <Route path="party-registration-form" element={<PartyRegistrationFormPage />} />
        <Route path="party-review" element={<PartyReviewPage />} />
        <Route path="academic-admin" element={<AcademicAdminPage />} />
        <Route path="precinct-admin" element={<PrecinctAdminPage />} />
        <Route path="voting" element={<VotingPage />} />
        <Route path="results" element={<ResultsPage />} />
        <Route path="election-management" element={<ElectionManagementPage />} />
      </Route>
    </Routes>
  );
}

export default App;