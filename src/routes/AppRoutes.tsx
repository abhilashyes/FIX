import { Navigate, Route, Routes } from 'react-router-dom';
import { DEFAULT_PLACE_ID } from '@/config/places';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ReportIssuePage } from '@/pages/ReportIssuePage';
import { IssueDetailPage } from '@/pages/IssueDetailPage';
import { DiscussPage } from '@/pages/DiscussPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MobilizationPage } from '@/pages/MobilizationPage';
import { AuthorityDirectoryPage } from '@/pages/AuthorityDirectoryPage';
import { AdoptStreetPage } from '@/pages/AdoptStreetPage';
import { AdoptionDashboardPage } from '@/pages/AdoptionDashboardPage';
import { PitchPage } from '@/pages/PitchPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

/** Central URL → page map. Place lives in the URL so deep links stay in sync. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${DEFAULT_PLACE_ID}`} replace />} />
      <Route path="/:placeId" element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="report" element={<ReportIssuePage />} />
        <Route path="discuss" element={<DiscussPage />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="authorities" element={<AuthorityDirectoryPage />} />
        <Route path="adopt" element={<AdoptStreetPage />} />
        <Route path="adopt/:adoptionId" element={<AdoptionDashboardPage />} />
        <Route path="pitch" element={<PitchPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="issues/:issueId" element={<IssueDetailPage />} />
        <Route path="issues/:issueId/discuss" element={<DiscussPage />} />
        <Route path="issues/:issueId/mobilize" element={<MobilizationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${DEFAULT_PLACE_ID}`} replace />} />
    </Routes>
  );
}
