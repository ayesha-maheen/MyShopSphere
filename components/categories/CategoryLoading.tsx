
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CategoryLoading() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen w-full bg-[#F9F7F2] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl animate-pulse">
          <div className="h-48 rounded-3xl bg-[#EEE8F7]" />

          <div className="mt-8 h-8 w-48 rounded bg-[#E6E0F5]" />

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[#E7E0EF] bg-white"
              >
                <div className="aspect-[4/3] bg-[#EEE8F7]" />

                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-[#EEE8F7]" />
                  <div className="h-4 w-2/3 rounded bg-[#E6E0F5]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
