import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DEFAULT_PLACE_ID } from '@/config/places';
import { AppShell } from '@/components/layout/AppShell';

// Lazy-load route pages so heavy deps (recharts, leaflet) split into on-demand chunks.
const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));
const ReportIssuePage = lazy(() => import('@/pages/ReportIssuePage').then((m) => ({ default: m.ReportIssuePage })));
const IssueDetailPage = lazy(() => import('@/pages/IssueDetailPage').then((m) => ({ default: m.IssueDetailPage })));
const DiscussPage = lazy(() => import('@/pages/DiscussPage').then((m) => ({ default: m.DiscussPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const MobilizationPage = lazy(() => import('@/pages/MobilizationPage').then((m) => ({ default: m.MobilizationPage })));
const AuthorityDirectoryPage = lazy(() =>
  import('@/pages/AuthorityDirectoryPage').then((m) => ({ default: m.AuthorityDirectoryPage })),
);
const AdoptStreetPage = lazy(() => import('@/pages/AdoptStreetPage').then((m) => ({ default: m.AdoptStreetPage })));
const AdoptionDashboardPage = lazy(() =>
  import('@/pages/AdoptionDashboardPage').then((m) => ({ default: m.AdoptionDashboardPage })),
);
const PitchPage = lazy(() => import('@/pages/PitchPage').then((m) => ({ default: m.PitchPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

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
        <Route path="issues/:issueId/discuss" element={<IssueDetailPage />} />
        <Route path="issues/:issueId/mobilize" element={<MobilizationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to={`/${DEFAULT_PLACE_ID}`} replace />} />
    </Routes>
  );
}
