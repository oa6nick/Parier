import { redirect } from "@/navigation";

export default async function AuthLoginRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/login", locale });
}
