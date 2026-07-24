import { PreviewBanner } from "@/components/PreviewBanner";

export default function PreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <PreviewBanner />
      {children}
    </div>
  );
}
