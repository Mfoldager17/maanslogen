import Link from "next/link";
import { PageHeading } from "@/app/components/ui";

export default function HomePage() {
  return (
    <div>
      <PageHeading>Velkommen til Maanslogen Admin</PageHeading>
      <p className="text-foreground-muted mb-8">
        Her kan du administrere kategorier, typer, drikke, attributedefinitioner og
        se anmeldelser.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { href: "/categories", label: "Kategorier", desc: "Se og opret beverage-kategorier" },
          { href: "/types", label: "Typer", desc: "Se og opret beverage-typer" },
          { href: "/beverages", label: "Drikke", desc: "Se og opret drikkevarer" },
          { href: "/attributes", label: "Attribute", desc: "Se og opret attributedefinitioner" },
          { href: "/questions", label: "Spørgsmål", desc: "Se og tilføj spørgsmål til kategorier/typer" },
          { href: "/reviews", label: "Anmeldelser", desc: "Se anmeldelser" },
        ].map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="block p-5 transition-shadow border border-border rounded-lg shadow-sm bg-background-elevated"
          >
            <h2 className="text-foreground font-semibold">{label}</h2>
            <p className="text-foreground-muted mt-1 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
