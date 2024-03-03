// @refresh reload
import { QueryClientProvider, QueryClient } from '@tanstack/solid-query'
import { For, Suspense } from "solid-js";
import {
  useLocation,
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "./root.css";

const Paths = [
  {
    label: 'Home',
    url: '/',
  },
  {
    label: 'About',
    url: '/about',
  },
  {
    label: 'Image',
    url: '/generate/image',
  },
  {
    label: 'Basic Chat',
    url: '/generate/chat',
  },

] as const;

const client = new QueryClient();

export default function Root() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-sky-600"
      : "border-transparent hover:border-sky-600";
  return (
    <Html lang="en">
      <Head>
        <Title>Solid GPT</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="bg-slate-800 text-white">
        <QueryClientProvider client={client}>
          <Suspense>
            <ErrorBoundary>
              <nav class="bg-sky-800">
                <ul class="container flex items-center p-3 text-gray-200">
                  <For each={Paths}>
                    {({ label, url}) => (
                      <li class={`border-b-2 ${active(url)} mx-1.5 sm:mx-6`}>
                        <A href={url}>{label}</A>
                      </li>
                    )}
                  </For>
                </ul>
              </nav>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
          <Scripts />
        </QueryClientProvider>
      </Body>
    </Html>
  );
}
