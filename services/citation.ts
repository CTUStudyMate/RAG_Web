import { mutate } from "swr";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export interface CitationChunk {
    id: number;
    chunkId: string;
    rawContent: string;
    cleanedContent: string;
    metadata: any;
}

export interface CitationImage {
    imageId: string;
    objectUrl: string;
}

export async function fetchCitationData(citationObj: {
    textChunkIds: string[];
    imgIds: string[];
}) {
    //
    // Fetch chunks
    //
    let chunks: CitationChunk[] = [];

    if (citationObj.textChunkIds.length > 0) {
        console.log("fetch chunk texts");

        const query = new URLSearchParams();

        for (const id of citationObj.textChunkIds) {
            query.append("chunkIds", id);
        }

        const res = await fetch(
            `${backendUrl}/api/rag/chunks/text?${query.toString()}`,
            {
                credentials: "include",
            }
        );

        if (!res.ok) {
            throw new Error("Failed to fetch chunk texts.");
        }

        const data = await res.json();

        chunks = data.map((row: any[]) => ({
            id: row[0],
            chunkId: row[1],
            rawContent: row[2],
            cleanedContent: row[3],
            metadata: row[4],
        }));
    }

    //
    // Fetch images
    //
    let images: CitationImage[] = [];

    if (citationObj.imgIds.length > 0) {
        console.log("fetch images");

        const results = await Promise.allSettled(
            citationObj.imgIds.map(async (imgId) => {
                const res = await fetch(
                    `${backendUrl}/api/rag/chunks/images/${imgId}`,
                    {
                        credentials: "include",
                    }
                );

                if (!res.ok) {
                    throw new Error(`Failed to fetch image ${imgId}`);
                }

                const blob = await res.blob();

                return {
                    imageId: imgId,
                    objectUrl: URL.createObjectURL(blob),
                };

            })
        );

        images = results
            .filter(
                (
                    r
                ): r is PromiseFulfilledResult<CitationImage> =>
                    r.status === "fulfilled"
            )
            .map((r) => r.value);
    }

    return {
        chunks,
        images,
    };
}

export async function storeCitationDataToSWR(data: {
    chunks: CitationChunk[];
    images: CitationImage[];
}) {
    await Promise.all([
        ...data.chunks.map(chunk =>
            mutate(`chunk_${chunk.chunkId}`, chunk, false)
        ),

        ...data.images.map(image =>
            mutate(`image_${image.imageId}`, image, false)
        )
    ]);
    console.log("Cached citation:", data)
}

export async function cacheCitation(citationObj: {
    textChunkIds: string[];
    imgIds: string[];
}) {

    const data = await fetchCitationData(citationObj);
    await storeCitationDataToSWR(data);
}

export async function fetchChunk(chunkKey: string): Promise<CitationChunk> {
    // chunk_xxx -> xxx
    const chunkId = chunkKey.replace("chunk_", "");

    const query = new URLSearchParams();
    query.append("chunkIds", chunkId);

    const res = await fetch(
        `${backendUrl}/api/rag/chunks/text?${query.toString()}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch chunk.");
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Chunk not found.");
    }

    const row = data[0];

    return {
        id: row[0],
        chunkId: row[1],
        rawContent: row[2],
        cleanedContent: row[3],
        metadata: row[4],
    };
}

export async function fetchImage(imageKey: string): Promise<CitationImage> {
    // image_xxx -> xxx
    const imageId = imageKey.replace("image_", "");

    const res = await fetch(
        `${backendUrl}/api/rag/chunks/images/${imageId}`,
        {
            credentials: "include",
        }
    );

    if (!res.ok) {
        throw new Error("Failed to fetch image.");
    }

    const blob = await res.blob();

    return {
        imageId,
        objectUrl: URL.createObjectURL(blob),
    };
}

// use:
// const { data: chunk } = useSWR(
//     `chunk_${chunkId}`,
//     fetchChunk
// );

// const { data: image } = useSWR(
//     `image_${imgId}`,
//     fetchImage
// );

