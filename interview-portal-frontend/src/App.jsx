import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './styles/global.css'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import QuestionsList from './pages/QuestionsList'
import QuestionDetail from './pages/QuestionDetail'
import Results from './pages/Results'
import AdminQuestions from './pages/AdminQuestions'
import QuestionForm from './pages/QuestionForm'
import CandidateDashboard from './pages/CandidateDashboard'
import CandidateProfile from './pages/CandidateProfile'
import BrowseJobs from './pages/BrowseJobs'
import CandidateInterviewScores from './pages/CandidateInterviewScores'
import AIInterviewMultimedia from './pages/AIInterviewMultimedia'
import InterviewerDashboard from './pages/InterviewerDashboard'
import AIInterviewerDashboard from './pages/AIInterviewerDashboard'
import InterviewerAIChat from './pages/InterviewerAIChat'
import CandidateAIChat from './pages/CandidateAIChat'
import CandidateAIInterview from './pages/CandidateAIInterview'
import InterviewerSessions from './pages/InterviewerSessions'
import CompanyDashboard from './pages/CompanyDashboard'
import CompanyPostJob from './pages/CompanyPostJob'
import CompanyCandidateReview from './pages/CompanyCandidateReview'
import CandidateInterviews from './pages/CandidateInterviews'
import CandidateHistory from './pages/CandidateHistory'
import CandidateScore from './pages/CandidateScore'
import CandidateJobs from './pages/CandidateJobs'
import CandidateMaterials from './pages/CandidateMaterials'
import CandidatePerformance from './pages/CandidatePerformance'
import ResumeUpload from './pages/ResumeUpload'
import CreateInterview from './pages/CreateInterview'
import InterviewerInterviews from './pages/InterviewerInterviews'
import CandidatesView from './pages/CandidatesView'
import InterviewerAnalytics from './pages/InterviewerAnalytics'
import TakeInterviewTest from './pages/TakeInterviewTest'
import AIInterview from './pages/AIInterview'
import AIInterviewRealtime from './pages/AIInterviewRealtime'
import CreateSession from './pages/CreateSession'
import AllSessions from './pages/AllSessions'
import CompanyUserManagement from './pages/CompanyUserManagement'
import AIInterviewWithChat from './pages/AIInterviewWithChat'
import CandidateRecruitment from './pages/CandidateRecruitment'
import InterviewReports from './pages/InterviewReports'
import DynamicAIInterview from './pages/DynamicAIInterview'
import InterviewSession from './pages/InterviewSession'
import AuthTest from './pages/AuthTest'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Candidate Routes */}
        <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
        <Route path="/candidate/profile" element={<CandidateProfile />} />
        <Route path="/candidate/ai-chat" element={<CandidateAIChat />} />
        <Route path="/candidate/ai-interview" element={<CandidateAIInterview />} />
        <Route path="/browse-jobs" element={<BrowseJobs />} />
        <Route path="/candidate-interview-scores" element={<CandidateInterviewScores />} />
        <Route path="/interview/:jobId/ai-multimedia" element={<AIInterviewMultimedia />} />
        <Route path="/candidate/interviews" element={<CandidateInterviews />} />
        <Route path="/candidate/history" element={<CandidateHistory />} />
        <Route path="/candidate/score" element={<CandidateScore />} />
        <Route path="/candidate/performance" element={<CandidatePerformance />} />
        <Route path="/candidate/jobs" element={<CandidateJobs />} />
        <Route path="/materials" element={<CandidateMaterials />} />
        <Route path="/resume-upload" element={<ResumeUpload />} />
        
        {/* Interviewer Routes */}
        <Route path="/interviewer-dashboard" element={<InterviewerDashboard />} />
        <Route path="/ai-interviewer-dashboard" element={<AIInterviewerDashboard />} />
        <Route path="/ai/chat" element={<InterviewerAIChat />} />
        <Route path="/ai/sessions" element={<InterviewerSessions />} />
        <Route path="/interviewer/create-interview" element={<CreateInterview />} />
        <Route path="/interviewer/interviews" element={<InterviewerInterviews />} />
        <Route path="/interviewer/candidates/:id" element={<CandidatesView />} />
        <Route path="/interviewer/analytics" element={<InterviewerAnalytics />} />
        
        {/* Company Routes */}
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
        <Route path="/company/post-job" element={<CompanyPostJob />} />
        <Route path="/company/candidates" element={<CompanyCandidateReview />} />
        <Route path="/company/recruitment" element={<CandidateRecruitment />} />
        <Route path="/company/interview-reports" element={<InterviewReports />} />
        <Route path="/company/users" element={<CompanyUserManagement />} />
        
        {/* Questions & Admin */}
        <Route path="/questions" element={<QuestionsList />} />
        <Route path="/question/:id" element={<QuestionDetail />} />
        <Route path="/results" element={<Results />} />
        <Route path="/admin/questions" element={<AdminQuestions />} />
        <Route path="/admin/questions/create" element={<QuestionForm />} />
        <Route path="/admin/questions/:id/edit" element={<QuestionForm />} />
        <Route path="/interview/:id/test" element={<TakeInterviewTest />} />
        <Route path="/interview/:id/ai" element={<AIInterview />} />
        <Route path="/interview/:jobId/realtime" element={<AIInterviewRealtime />} />
        
        {/* AI Interview Routes */}
        <Route path="/ai/create-session" element={<CreateSession />} />
        <Route path="/ai/all-sessions" element={<AllSessions />} />
        <Route path="/ai/interview-chat" element={<AIInterviewWithChat />} />
        <Route path="/ai/dynamic-interview" element={<DynamicAIInterview />} />
        <Route path="/interview-session/:interviewId" element={<InterviewSession />} />
        
        {/* Test Routes */}
        <Route path="/auth-test" element={<AuthTest />} />
        
        {/* Company Management Routes */}
        <Route path="/company/users" element={<CompanyUserManagement />} />
      </Routes>
    </Router>
  )
}

export default App
