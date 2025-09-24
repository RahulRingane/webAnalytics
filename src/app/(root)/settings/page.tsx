import { auth } from "@/auth";
import { Incidents } from "./_components/incidents"; // <-- adjust import path to your client component

const IncidentsPage = async () => {
  const session = await auth();

  if (!session) {
    return <p className="text-muted-foreground">You must be logged in to view incidents.</p>;
  }

  return <Incidents userId={session.user.id} />;
};

export default IncidentsPage;
