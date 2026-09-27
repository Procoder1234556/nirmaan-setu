'use client';

import React from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: any) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = usePathname() || '/';
  return {
    pathname,
    search: typeof window !== 'undefined' ? window.location.search : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null,
    key: 'default',
  };
}

export function useSearchParams() {
  const searchParams = useNextSearchParams();
  const setSearchParams = (params: any) => {
    // No-op or update url
  };
  return [searchParams, setSearchParams] as const;
}

export function Link({ to, href, children, className, ...props }: any) {
  return (
    <NextLink href={to || href || '/'} className={className} {...props}>
      {children}
    </NextLink>
  );
}

export interface NavLinkRenderProps {
  isActive: boolean;
}

export interface NavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  to?: string;
  href?: string;
  end?: boolean;
  className?: string | ((props: NavLinkRenderProps) => string | undefined);
  children?: React.ReactNode;
}

export function NavLink({ to, href, end, children, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const target = to || href || '/';
  const isActive = end ? pathname === target : pathname.startsWith(target);
  const computedClass = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <NextLink href={target} className={computedClass} {...props}>
      {children}
    </NextLink>
  );
}

export function Outlet() {
  return null;
}
