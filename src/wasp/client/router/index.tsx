'use client';

import React from 'react';
import NextLink from 'next/link';

export function Link({
  to,
  params,
  children,
  className,
  ...props
}: any) {
  let href = '/';
  if (typeof to === 'string') {
    href = to;
  } else if (to?.to) {
    href = to.to;
  }

  if (params && to?.build) {
    href = to.build(params);
  } else if (params) {
    for (const [key, val] of Object.entries(params)) {
      href = href.replace(`:${key}`, String(val));
    }
  }

  return (
    <NextLink href={href} className={className} {...props}>
      {children}
    </NextLink>
  );
}

export const routes = {
  LandingPageRoute: { to: '/' },
  ProjectsRoute: { to: '/projects' },
  ProjectDetailsRoute: {
    to: '/projects/:projectId',
    build: (params: { projectId: string }) => `/projects/${params.projectId}`,
  },
  ReviewerQueueRoute: { to: '/reviewer-queue' },
  FieldLogRoute: { to: '/field-log' },
  KnowledgeBaseRoute: { to: '/knowledge-base' },
  LoginRoute: { to: '/login' },
  SignupRoute: { to: '/signup' },
  EmailVerificationRoute: { to: '/email-verification' },
  PasswordResetRoute: { to: '/password-reset' },
  RequestPasswordResetRoute: { to: '/request-password-reset' },
  AdminRoute: { to: '/admin' },
  AdminUsersRoute: { to: '/admin/users' },
  AdminSettingsRoute: { to: '/admin/settings' },
  AdminCalendarRoute: { to: '/admin/calendar' },
  AdminUIButtonsRoute: { to: '/admin/ui/buttons' },
  AdminMessagesRoute: { to: '/admin/messages' },
  PricingPageRoute: { to: '/pricing' },
  CheckoutResultRoute: { to: '/checkout' },
  AccountRoute: { to: '/account' },
  DemoAppRoute: { to: '/demo-app' },
  FileUploadRoute: { to: '/file-upload' },
  NotFoundRoute: { to: '/404' },
};
