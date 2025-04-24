import ProtectedRoute from "@/components/secure/ProtectedRoute";
import UserNavbar from "@/components/UserNavbar";

export default function Layout({ children }) {
  return (
    <section>
        <div className="flex">
          <UserNavbar />
          <div className="w-full h-full pt-[70px]">{children}</div>
        </div>
    </section>
  );
}
