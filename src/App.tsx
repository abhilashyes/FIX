import { HashRouter } from 'react-router-dom';
import { AppRoutes } from '@/routes/AppRoutes';

/** Root app: hash router (deep-link friendly without server config) + routes. */
export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}
