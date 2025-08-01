import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  ClipboardList,
  CheckCircle,
  Settings,
} from 'lucide-react';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/dashboard/workspaces', label: 'Workspaces', icon: Users },
  { to: '/dashboard/tasks', label: 'My Tasks', icon: ClipboardList },
  { to: '/dashboard/achieved', label: 'Achieved', icon: CheckCircle },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow px-4 py-6 flex flex-col gap-4">
      <div className="text-2xl font-bold text-blue-600 mb-6">TaskHub</div>
      {menuItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg ${
              isActive
                ? 'bg-blue-100 text-blue-700 font-medium'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;
