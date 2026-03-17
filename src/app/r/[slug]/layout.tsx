import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function RestaurantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    select: {
      primaryColor: true,
      secondaryColor: true,
      accentColor: true,
    },
  });

  if (!restaurant) {
    notFound();
  }

  return (
    <div
      style={
        {
          "--r-primary": restaurant.primaryColor,
          "--r-secondary": restaurant.secondaryColor,
          "--r-accent": restaurant.accentColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
