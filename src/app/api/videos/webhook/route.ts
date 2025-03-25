import { db } from "@/db";
import { eq } from "drizzle-orm";
import { mux } from "@/lib/mux";
import { videos } from "@/db/schema";
import { headers } from "next/headers";

import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
    VideoAssetDeletedWebhookEvent
} from '@mux/mux-node/resources/webhooks'


const SIGNIN_SECRET = process.env.MUX_WEBHOOK_SECRET;

type WebhookEvent = 
    | VideoAssetCreatedWebhookEvent 
    | VideoAssetErroredWebhookEvent 
    | VideoAssetReadyWebhookEvent 
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent;

export const POST = async (request: Request) => {
    
    if(!SIGNIN_SECRET) {
       throw new Error("MUX_WEBHOOK_SECRET is not set");
    }
   
    const headersPayload = await headers();
    const muxSignature = headersPayload.get("mux-signature");

    if(!muxSignature) {
       return new Response("No signature found", {status: 401})
    }    

    const payload = await request.json();
    const body = JSON.stringify(payload);

    mux.webhooks.verifySignature(
        body,
        {
            "mux-signature": muxSignature,
        },
        SIGNIN_SECRET
    )
    
    switch(payload.type as WebhookEvent["type"]) {
        case "video.asset.created": {
            const data = payload.data as VideoAssetCreatedWebhookEvent["data"];

            if(!data.upload_id) {
                return new Response("No upload id found", { status: 401});
            }
            console.log("Updating database with Mux asset details:", {
                muxAssetId: data.id,
                muxStatus: data.status,
                muxUploadId: data.upload_id
            });

            console.log("Creating video with id:", { uploadId: data.upload_id } )

            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id))
            break;
        }

        case "video.asset.ready": {
            const data = payload.data as VideoAssetReadyWebhookEvent["data"];
            const playbackId = data.playback_ids?.[0].id;

            if(!data.upload_id) {
                return new Response("Missing upload Id", { status: 400 });
            }

            if(!playbackId) {
                return new Response("Missing playback Id", { status: 400 });
            }

            const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
            const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`;

            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                    muxPlaybackId: playbackId,
                    muxAssetId: data.id,
                    thumbnailUrl,
                    previewUrl,
                    duration
                })
                .where(eq(videos.muxUploadId, data.upload_id))

            break;
        }

        case "video.asset.errored": {
            const data = payload.data as VideoAssetErroredWebhookEvent["data"];

            if(!data.upload_id) {
                return new Response("Missing upload ID", { status: 400 })
            }

            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id));

            break;
        };

        case "video.asset.deleted": {
            const data = payload.data as VideoAssetDeletedWebhookEvent["data"];

            if(!data.upload_id) {
                return new Response("Missing upload ID", { status: 400 })
            }

            console.log("deleting video with id:", { uploadId: data.upload_id } )

            await db
                .delete(videos)
                .where(eq(videos.muxUploadId, data.upload_id));

            break;
        }

        case "video.asset.track.ready": {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent["data"] & {
                asset_id: string;
            };

            // Typescript incorrectly says asset id does not exist
            const { asset_id: assetId, id: muxTrackId, status } = data;

            console.log("Track Ready");

            if(!assetId) {
                return new Response("Missing asset ID", { status: 400 })
            }

            await db
                .update(videos)
                .set({
                    muxTrackId,
                    muxTrackStatus: status
                })
                .where(eq(videos.muxAssetId, assetId))
        }
    }
    console.log("Webhook event received", payload)
    return new Response("Webhook received", { status: 200 });
}