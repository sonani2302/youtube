"use client"

import { trpc } from "@/trpc/client"

export const PageClient = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "Jaimin" })

  return(
    <div>
      Page-client component says: { data?.greeting }
    </div>
 )
}
