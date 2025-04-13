import { DEFAULT_LIMIT } from "@/constans";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { HydrateClient, trpc } from "@/trpc/server"

export const dynamic = "force-dynamic";

interface pageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>
}

const Page = async ({searchParams}: pageProps) => {
  const { categoryId } = await searchParams;
  void trpc.categories.getMany.prefetch();
  void trpc.videos.getMany.prefetch({ categoryId, limit: DEFAULT_LIMIT });

  return(
    <div>
      <HydrateClient>
        <HomeView categoryId={categoryId}/>
      </HydrateClient>
    </div>
 )
}

export default Page;