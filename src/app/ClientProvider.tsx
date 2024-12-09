"use client";

import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { JSX, ReactNode } from "react";

// ایجاد cache برای RTL
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// تعریف نوع برای props
interface ClientProviderProps {
  children: ReactNode;
}

// کامپوننت ClientProvider
export default function ClientProvider({ children }: ClientProviderProps): JSX.Element {
  return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
}
