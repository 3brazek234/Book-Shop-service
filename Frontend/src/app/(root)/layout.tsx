import Header from "@/components/Header";
import img from "@/assets/images/pattern.webp";
import Footer from "@/components/Footer";
import WaveBackground from "@/assets/images/wave-bg.svg";
import { Toaster } from "react-hot-toast";
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main
        style={{ backgroundImage: `url(${img.src})` }}
        className="bg-cover bg-top bg-dark-100 "
      >
        <div className="flex min-h-screen flex-1 flex-col  px-5 xs:px-10 md:px-16">
          <Header />
          <div className="mt-20 pb-20">{children}</div>
        </div>

        <Footer />
      </main>
      <Toaster />
    </>
  );
}

export default Layout;
