import { redirect } from "@/navigation";

export default async function AuthRegisterRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/register", locale });
}
