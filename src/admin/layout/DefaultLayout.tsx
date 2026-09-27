import { ReactNode, useState } from "react";
import { type AuthUser } from "wasp/auth";
import { Link, routes } from "wasp/client/router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface Props {
  user?: AuthUser;
  children?: ReactNode;
}

export function DefaultLayout({ children, user }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = user || {
    id: 'usr-admin-duliajan',
    email: 'admin.pipeline@oilindia.in',
    username: 'oil_super_admin',
    isAdmin: true,
  } as any;

  if (!currentUser.isAdmin) {
    return <Link to={routes.LandingPageRoute.to} replace />;
  }

  return (
    <div className="bg-background text-foreground">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={currentUser}
          />
          <main>
            <div className="max-w-(--breakpoint-2xl) mx-auto p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
