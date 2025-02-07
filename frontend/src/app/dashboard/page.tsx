import ProjectsDashboard from "@/components/ProjectsDashboard";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* Your other content goes here */}
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
       <ProjectsDashboard />;
      </main>
    </div>
  );



}
