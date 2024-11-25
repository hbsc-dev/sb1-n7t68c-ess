import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home,
  BarChart3,
  CheckSquare,
  Settings,
  Sliders,
  Package2
} from 'lucide-react';

export default function BottomNav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center text-sm ${
      isActive 
        ? 'text-[#007AFF] dark:text-[#0A84FF]' 
        : 'text-[#8E8E93] dark:text-[#98989D] hover:text-[#007AFF] dark:hover:text-[#0A84FF]'
    } transition-colors duration-200`;

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        <NavLink to="/" className={linkClass} end>
          <Home className="h-6 w-6 stroke-[1.5]" />
          <span>Service</span>
        </NavLink>
        <NavLink to="/completed" className={linkClass}>
          <CheckSquare className="h-6 w-6 stroke-[1.5]" />
          <span>Completed</span>
        </NavLink>
        <NavLink to="/parts" className={linkClass}>
          <Package2 className="h-6 w-6 stroke-[1.5]" />
          <span>Parts</span>
        </NavLink>
        <NavLink to="/stats" className={linkClass}>
          <BarChart3 className="h-6 w-6 stroke-[1.5]" />
          <span>Stats</span>
        </NavLink>
        <NavLink to="/preferences" className={linkClass}>
          <Sliders className="h-6 w-6 stroke-[1.5]" />
          <span>Preferences</span>
        </NavLink>
        <NavLink to="/admin" className={linkClass}>
          <Settings className="h-6 w-6 stroke-[1.5]" />
          <span>Admin</span>
        </NavLink>
      </div>
    </nav>
  );
}