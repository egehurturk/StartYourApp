import ProjectScaffolder from "@/components/ProjectScaffolder";
import Navbar from "@/components/Navbar";
import ProjectsDashboard from "@/components/ProjectsDashboard";

export default function Home() {
  return (
    <div>
      <Navbar />
      {/* Your other content goes here */}
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
       <ProjectScaffolder />;
      </main>
    </div>
  );
}
