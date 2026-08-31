import RootShell from "@/components/RootShell";
import { metadataFor, viewport as vp } from "@/lib/site";
import "../globals.css";

export const metadata = metadataFor("en");
export const viewport = vp;

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="en">{children}</RootShell>;
}
