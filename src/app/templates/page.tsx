import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { TemplatesGallery } from "@/components/templates/templates-gallery";

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-mesh-purple min-h-screen px-4 py-16 sm:px-6">
        <TemplatesGallery />
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Templates",
  description: "12 professional email signature templates with custom colors, animated logos, and interactive nav bars.",
};
