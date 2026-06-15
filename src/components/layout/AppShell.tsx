import { Suspense, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import type { PlaceId } from '@/types';
import { getPlace } from '@/config/places';
import { usePlaceStore } from '@/store/usePlaceStore';
import { TopBar } from './TopBar';
import { SideNav } from './SideNav';
import { BottomTabNav } from './BottomTabNav';
import { Loading } from '@/components/ui/Loading';

/** Responsive frame: top bar everywhere, sidebar on desktop, bottom tabs on mobile. */
export function AppShell() {
  const { placeId } = useParams();
  const activePlaceId = usePlaceStore((s) => s.activePlaceId);
  const setActivePlace = usePlaceStore((s) => s.setActivePlace);

  // Keep the store in sync with the URL so deep links select the right place.
  useEffect(() => {
    if (placeId && getPlace(placeId as PlaceId) && placeId !== activePlaceId) {
      setActivePlace(placeId as PlaceId);
    }
  }, [placeId, activePlaceId, setActivePlace]);

  return (
    <div className="min-h-screen bg-white text-ink">
      <TopBar />
      <div className="mx-auto flex w-full max-w-app">
        <SideNav />
        <main className="min-w-0 flex-1 px-3 pb-24 pt-4 sm:px-4 md:pb-10">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <BottomTabNav />
    </div>
  );
}
