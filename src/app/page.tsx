import { Metadata } from "next";
import Home from "@/app/components/Home/Home";

export const metadata: Metadata = {
  title: "DocConnect - Home",
  description: "Connect with doctors online",
};

export default function HomePage() {
  return <Home />;
}
