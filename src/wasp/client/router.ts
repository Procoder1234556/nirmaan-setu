import React from "react";
export const Link = (props: any) => React.createElement("a", props);
export const routes = {
  AccountRoute: { to: '/account', build: (args?: any) => '/account' },
  CheckoutResultRoute: { to: '/checkout', build: (args?: any) => '/checkout' },
  PricingPageRoute: { to: '/pricing', build: (args?: any) => '/pricing' },
  DemoAppRoute: { to: '/demo', build: (args?: any) => '/demo' },
  FileUploadRoute: { to: '/file-upload', build: (args?: any) => '/file-upload' },
  AdminRoute: { to: '/admin', build: (args?: any) => '/admin' },
} as any;
