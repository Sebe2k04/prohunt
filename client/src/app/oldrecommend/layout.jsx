import { Suspense } from "react";

export default function Layout({ children }) {
  return (
    <section>
      <Suspense> {children}</Suspense>
    </section>
  );
}
