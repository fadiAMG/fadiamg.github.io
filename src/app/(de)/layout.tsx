import RootShell from "@/components/RootShell";
import { metadataFor, viewport as vp } from "@/lib/site";
import "../globals.css";

export const metadata = metadataFor("de");
export const viewport = vp;

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <RootShell lang="de">{children}</RootShell>;
}
