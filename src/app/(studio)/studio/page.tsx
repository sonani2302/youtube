import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic";

interface pageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>
}

export const Page = async ({searchParams}: pageProps) => {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch()

  return(
    <div>
      studio
    </div>
 )
}

export default Page;