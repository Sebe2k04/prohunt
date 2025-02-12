import { Suspense } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <Suspense>{children}</Suspense>
    </section>
  );
}
