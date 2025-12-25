"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  MdDashboard,
  MdOutlineJoinFull,
  MdPayments,
  MdSettings,
  MdHistory,
  MdWorkOutline,
} from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { FaUserPlus } from "react-icons/fa";
import { 
  HiOutlineChatBubbleLeftRight,
} from "react-icons/hi2";
import { FiLogOut } from "react-icons/fi";
import { authService } from "@/services";
import { toast } from "react-toastify";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

type UserRole = 'superAdmin' | 'admin' | 'users';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole>('users');
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // User navigation items
  const userNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: MdDashboard, roles: ['users', 'admin', 'superAdmin'] },
    { label: 'Matches', path: '/dashboard/matches', icon: MdOutlineJoinFull, roles: ['users', 'admin', 'superAdmin'] },
    { label: 'Chats', path: '/dashboard/chats', icon: HiOutlineChatBubbleLeftRight, roles: ['users', 'admin', 'superAdmin'] },
    { label: 'Payment', path: '/dashboard/payment', icon: MdPayments, roles: ['users', 'admin', 'superAdmin'] },
    { label: 'History', path: '/dashboard/history', icon: MdHistory, roles: ['users', 'admin', 'superAdmin'] },
    { label: 'Settings', path: '/dashboard/settings', icon: MdSettings, roles: ['users', 'admin', 'superAdmin'] },
  ];

  // Admin navigation items - in the exact order specified
  const adminNavItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: MdDashboard, roles: ['admin', 'superAdmin'] },
    { label: 'Matches', path: '/dashboard/matches', icon: MdOutlineJoinFull, roles: ['admin', 'superAdmin'] },
    { label: 'Payments', path: '/dashboard/payments', icon: MdPayments, roles: ['admin', 'superAdmin'] },
    { label: 'Users', path: '/dashboard/users', icon: CiUser, roles: ['admin', 'superAdmin'] },
    { label: 'Admin', path: '/dashboard/admin', icon: FaUserPlus, roles: ['admin', 'superAdmin'] },
    { label: 'Interviews', path: '/dashboard/interviews', icon: MdWorkOutline, roles: ['admin', 'superAdmin'] },
    { label: 'Chats', path: '/dashboard/chats', icon: HiOutlineChatBubbleLeftRight, roles: ['admin', 'superAdmin'] },
    { label: 'Settings', path: '/dashboard/settings', icon: MdSettings, roles: ['admin', 'superAdmin'] },
  ];

  // Notification counts (can be fetched from API later)
  const notificationCounts: Record<string, number> = {
    '/dashboard/interviews': 2,
    '/dashboard/chats': 2,
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await authService.getCurrentUser();
        if (result.success && result.user) {
          const role = result.user.role || 'users';
          setUserRole(role as UserRole);
          
          // Redirect to login if not authenticated
          if (!result.user) {
            router.push('/login');
            return;
          }
        } else {
          router.push('/login');
          return;
        }
      } catch (error) {
        router.push('/login');
        return;
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [router]);

  // Listen for mobile menu toggle events from header
  useEffect(() => {
    const handleToggleMenu = (event: Event) => {
      setMobileMenuOpen(prev => !prev);
    };

    window.addEventListener('toggleMobileMenu', handleToggleMenu as EventListener);
    return () => {
      window.removeEventListener('toggleMobileMenu', handleToggleMenu as EventListener);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
    router.push('/login');
  };

  const isAdmin = userRole === 'admin' || userRole === 'superAdmin';
  const navItems = isAdmin ? adminNavItems : userNavItems;
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(userRole)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EDD4D3] flex items-center justify-center">
        <div className="text-[#702C3E]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDD4D3] flex relative">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          bg-[#F5E5E4] border-r border-[#E6DADA] transition-all duration-300
          fixed lg:static inset-y-0 left-0 z-50
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        <div className="p-4 h-full flex flex-col overflow-y-auto">
          {/* Collapse/Expand Button - Hidden on mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 p-2 text-[#702C3E] hover:bg-white/60 rounded-md transition w-full flex items-center justify-center hidden lg:flex"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <span className="text-2xl">☰</span>
          </button>

          {/* Close Button - Mobile Only */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="mb-4 p-2 text-[#702C3E] hover:bg-white/60 rounded-md transition w-full flex items-center justify-center lg:hidden"
            aria-label="Close menu"
          >
            <span className="text-2xl">✕</span>
          </button>

          {/* Navigation Items */}
          <nav className="space-y-1 flex-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              // Improved active state detection - normalize paths to handle trailing slashes
              const normalizedPathname = pathname.replace(/\/$/, '') || '/';
              const normalizedItemPath = item.path.replace(/\/$/, '') || '/';
              
              // For dashboard root, only match exact path
              // For other routes, match exact or sub-routes
              const isActive = normalizedItemPath === '/dashboard' 
                ? normalizedPathname === normalizedItemPath
                : normalizedPathname === normalizedItemPath || normalizedPathname.startsWith(normalizedItemPath + '/');
              const notificationCount = notificationCounts[item.path] || 0;
              
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md transition relative ${
                    isActive
                      ? 'bg-white text-[#702C3E] font-semibold'
                      : 'text-[#5A4A4A] hover:bg-white/60'
                  }`}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-[#702C3E]' : 'text-[#5A4A4A]'}`} />
                  </div>
                  {sidebarOpen && (
                    <div className="flex items-center justify-between flex-1 min-w-0">
                      <span className="text-sm truncate">{item.label}</span>
                      {notificationCount > 0 && (
                        <span className="bg-[#702C3E] text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                          {notificationCount}
                        </span>
                      )}
                    </div>
                  )}
                  {!sidebarOpen && notificationCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#702C3E] text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {notificationCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout Button at Bottom */}
          <div className="mt-auto pt-4 border-t border-[#E6DADA]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-md transition text-[#5A4A4A] hover:bg-white/60 hover:text-[#702C3E]"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <FiLogOut className="w-5 h-5" />
              </div>
              {sidebarOpen && (
                <span className="text-sm">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full lg:w-auto">
        {children}
      </div>
    </div>
  );
}

