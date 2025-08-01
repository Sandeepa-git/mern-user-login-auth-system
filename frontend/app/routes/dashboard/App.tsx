import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './dashboard';
import DashboardHome from './routes/DashboardHome';
import Workspaces from './routes/Workspaces';
import MyTasks from './routes/MyTasks';
import Achieved from './routes/Achieved';
import Settings from './routes/Settings';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="workspaces" element={<Workspaces />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="achieved" element={<Achieved />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
