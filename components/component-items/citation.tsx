import { ChatMessage } from "@/types/chat-related";
import { ExternalLink } from "lucide-react";
import { RagSegment } from "@/types/chat-related";
import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import useSWR from "swr";
import { Button } from "@/components/ui/button";
import {
    CitationChunk,
    CitationDocument,
    CitationImage,
    fetchChunk,
    fetchDocument,
    fetchImage,
} from "@/services/citation";

function parseChunkContent(chunk: CitationChunk | undefined) {
    if (!chunk) {
        return {
            document: "",
            section: "",
            content: "",
        };
    }

    const metadata = chunk.metadata;
    const rawContent = chunk.rawContent;

    if (!rawContent || typeof rawContent !== "string") {
        return {
            document: metadata?.document ?? "",
            section: metadata?.section ?? "",
            content: chunk.cleanedContent ?? "",
        };
    }

    const contentMatch = rawContent.match(/\[CONTENT\]:([\s\S]*)/);

    return {
        document: metadata?.document ?? "",
        section: metadata?.section ?? "",
        content: contentMatch ? contentMatch[1].trim() : chunk.cleanedContent,
    };
}


function highlightEvidence(
    content: string,
    evidences: string[]
) {
    const matches: {
        start: number;
        end: number;
    }[] = [];

    for (const evidence of evidences) {
        if (!evidence) continue;

        const index = content
            .toLowerCase()
            .indexOf(evidence.toLowerCase());

        if (index !== -1) {
            matches.push({
                start: index,
                end: index + evidence.length
            });
        }
    }

    // không có match
    if (matches.length === 0) {
        console.log("no match")
        console.log(content)
        console.log(evidences)
        return content;
    }


    // sort theo vị trí xuất hiện
    matches.sort(
        (a, b) => a.start - b.start
    );


    const result: React.ReactNode[] = [];

    let cursor = 0;

    for (const match of matches) {

        // tránh overlap
        if (match.start < cursor) {
            continue;
        }

        // text trước highlight
        if (match.start > cursor) {
            result.push(
                content.slice(
                    cursor,
                    match.start
                )
            );
        }


        result.push(
            <span
                key={`${match.start}-${match.end}`}
                className="
                    bg-yellow-200
                    rounded-sm
                    px-0.5
                "
            >
                {
                    content.slice(
                        match.start,
                        match.end
                    )
                }
            </span>
        );

        cursor = match.end;
    }


    // phần còn lại
    if (cursor < content.length) {
        result.push(
            content.slice(cursor)
        );
    }


    return result;
}


// var chunk_evidence = ["the Unified Modeling Language (UML) (OMG 2003) is a collection of notations used to document software  specifications  and  designs", "It  is  the software designer's task to take a class-diagram specification and construct a suitable design model of the implementation's class structure."]
// var chunk_text = [
//     [
//         1804,
//         "se_theory_practice.pdf__chunk_1396_1399_335",
//         "[SECTION]: Capturing the Requirements > 4.5 Modeling Notations > Example: UML Class Diagrams\n[CONTENT]: An ER notation is often used by more complex approaches. For example, the Unified Modeling Language (UML) (OMG 2003) is a collection of notations used to document software  specifications  and  designs. We  will  use  UML  extensively  in  Chapter  6 to describe object-oriented specifications and designs. Because UML was originally conceived  for  object-oriented  systems, it  represents  systems  in  terms  of  objects  and methods. Objects are akin to entities; they are organized in classes that have an inheritance hierarchy. Each object provides methods that perform actions on the object's variables. As  objects  execute, they  send  messages  to  invoke  each  other's  methods, acknowledge actions, and transmit data.\nThe flagship model in any UML specification is the class diagram , a sophisticated ER diagram relating the classes (entities) in the specification. Although most UML texts treat class diagrams primarily as a design notation, it is possible and convenient to use UML class diagrams as a conceptual modeling notation, in which classes represent real-world entities in the problem to be modeled. It may be that a class in the conceptual model, such as a Customer class, corresponds to a program class in the implementation, such  as  a  CustomerRecord, but  this  need  not  always  be  the  case. It  is  the software designer's task to take a class-diagram specification and construct a suitable design model of the implementation's class structure.\nIn general, the kinds of real-world entities that we would want to represent in a class diagram include actors (e.g., patrons, operators, personnel); complex data to be stored, analyzed, transformed, or displayed; or records of transient events (e.g., business  transactions, phone  conversations). The  entities  in  our  library  problem  include people, like the patrons and librarians; the items in the library's inventory, like books and periodicals; and loan transactions.",
//         "[SECTION]: Capturing the Requirements > 4.5 Modeling Notations > Example: UML Class Diagrams\n[CONTENT]: An ER notation is often used by more complex approaches. For example, the Unified Modeling Language (UML) (OMG 2003) is a collection of notations used to document software  specifications  and  designs. We  will  use  UML  extensively  in  Chapter  6 to describe object-oriented specifications and designs. Because UML was originally conceived  for  object-oriented  systems, it  represents  systems  in  terms  of  objects  and methods. Objects are akin to entities; they are organized in classes that have an inheritance hierarchy. Each object provides methods that perform actions on the object's variables. As  objects  execute, they  send  messages  to  invoke  each  other's  methods, acknowledge actions, and transmit data.\nThe flagship model in any UML specification is the class diagram , a sophisticated ER diagram relating the classes (entities) in the specification. Although most UML texts treat class diagrams primarily as a design notation, it is possible and convenient to use UML class diagrams as a conceptual modeling notation, in which classes represent real-world entities in the problem to be modeled. It may be that a class in the conceptual model, such as a Customer class, corresponds to a program class in the implementation, such  as  a  CustomerRecord, but  this  need  not  always  be  the  case. It  is  the software designer's task to take a class-diagram specification and construct a suitable design model of the implementation's class structure.\nIn general, the kinds of real-world entities that we would want to represent in a class diagram include actors (e.g., patrons, operators, personnel); complex data to be stored, analyzed, transformed, or displayed; or records of transient events (e.g., business  transactions, phone  conversations). The  entities  in  our  library  problem  include people, like the patrons and librarians; the items in the library's inventory, like books and periodicals; and loan transactions.",
//         {
//             "section": "Capturing the Requirements > 4.5 Modeling Notations > Example: UML Class Diagrams",
//             "chunk_id": "se_theory_practice.pdf__chunk_1396_1399",
//             "document": "se_theory_practice.pdf",
//             "token_count": 550,
//             "embeded_content": "[SECTION]: Capturing the Requirements > 4.5 Modeling Notations > Example: UML Class Diagrams\n[CONTENT]: An ER notation is often used by more complex approaches. For example, the Unified Modeling Language (UML) (OMG 2003) is a collection of notations used to document software  specifications  and  designs. We  will  use  UML  extensively  in  Chapter  6 to describe object-oriented specifications and designs. Because UML was originally conceived  for  object-oriented  systems, it  represents  systems  in  terms  of  objects  and methods. Objects are akin to entities; they are organized in classes that have an inheritance hierarchy. Each object provides methods that perform actions on the object's variables. As  objects  execute, they  send  messages  to  invoke  each  other's  methods, acknowledge actions, and transmit data.\nThe flagship model in any UML specification is the class diagram , a sophisticated ER diagram relating the classes (entities) in the specification. Although most UML texts treat class diagrams primarily as a design notation, it is possible and convenient to use UML class diagrams as a conceptual modeling notation, in which classes represent real-world entities in the problem to be modeled. It may be that a class in the conceptual model, such as a Customer class, corresponds to a program class in the implementation, such  as  a  CustomerRecord, but  this  need  not  always  be  the  case. It  is  the software designer's task to take a class-diagram specification and construct a suitable design model of the implementation's class structure.\nIn general, the kinds of real-world entities that we would want to represent in a class diagram include actors (e.g., patrons, operators, personnel); complex data to be stored, analyzed, transformed, or displayed; or records of transient events (e.g., business  transactions, phone  conversations). The  entities  in  our  library  problem  include people, like the patrons and librarians; the items in the library's inventory, like books and periodicals; and loan transactions."
//         }
//     ]
// ]

// const demoChunk: CitationChunk = {
//     id: chunk_text[0][0] as number,
//     chunkId: chunk_text[0][1] as string,
//     rawContent: chunk_text[0][2] as string,
//     cleanedContent: chunk_text[0][3] as string,
//     metadata: chunk_text[0][4],
// };

function TextCitationBadge({
    mark,
    docId,
    evidences
}: {
    mark: number;
    docId: string;
    evidences: string[]
}) {
    const swrKey = `chunk_${docId}`;
    const { data, isLoading, error } = useSWR<CitationChunk>(
        swrKey,
        fetchChunk
    );
    const documentId = data?.metadata?.document;
    const { data: document, isLoading: isDocumentLoading } = useSWR<CitationDocument>(
        documentId ? `document_${documentId}` : null,
        fetchDocument
    );

    console.log("with evidence")
    console.log(evidences)
    console.log("chunk is")
    console.log(parseChunkContent(data).content)
    const chunkInfo = parseChunkContent(data);
    return (
        <Popover>
            <PopoverTrigger asChild>
                <span className="ml-1 inline-flex w-4 h-4 items-center justify-center align-middle rounded-sm bg-main-secondary text-[10px] leading-none text-white font-mono cursor-pointer">
                    {mark}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-[500px] max-h-[500px] overflow-y-auto">
                <PopoverHeader>
                    <PopoverTitle className="text-main-navy">
                        {isLoading || isDocumentLoading
                            ? "Loading citation..."
                            : document?.documentTitle || "Citation source"}
                    </PopoverTitle>
                    <PopoverDescription>
                        {error ? "Failed to load citation." : chunkInfo.section || docId}
                    </PopoverDescription>
                </PopoverHeader>

                <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">
                    {error
                        ? "Unable to load citation content."
                        : isLoading
                            ? "Loading citation content..."
                            : highlightEvidence(
                                parseChunkContent(data).content,
                                evidences
                            )}
                </div>

                {document?.fileUrl && (
                    <Button asChild variant="outline" size="sm" className="mt-4">
                        <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                            Open document
                            <ExternalLink />
                        </a>
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
}


function ImageCitationBadge({
    mark,
    docId,
    imageId,
}: {
    mark: number;
    docId: string;
    imageId: string;
}) {
    const swrKey = `chunk_${docId}`;
    const { data: chunk, isLoading: isChunkLoading, error: chunkError } = useSWR<CitationChunk>(
        swrKey,
        fetchChunk
    );
    const { data: image, isLoading: isImageLoading, error: imageError } = useSWR<CitationImage>(
        `image_${imageId}`,
        fetchImage
    );
    const documentId = chunk?.metadata?.document;
    const { data: document, isLoading: isDocumentLoading } = useSWR<CitationDocument>(
        documentId ? `document_${documentId}` : null,
        fetchDocument
    );
    const chunkInfo = parseChunkContent(chunk);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <span className="ml-1 inline-flex w-4 h-4 items-center justify-center align-middle rounded-sm bg-main-secondary text-[10px] leading-none text-white font-mono cursor-pointer">
                    {mark}
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-auto max-w-[66.666vw] max-h-[60vh] overflow-auto">
                <PopoverHeader>
                    <PopoverTitle className="text-main-navy">
                        {isChunkLoading || isDocumentLoading
                            ? "Loading citation..."
                            : document?.documentTitle || "Citation source"}
                    </PopoverTitle>
                    <PopoverDescription>
                        {chunkError ? "Failed to load citation." : chunkInfo.section || docId}
                    </PopoverDescription>
                </PopoverHeader>

                <div className="mt-4 flex justify-center">
                    {imageError
                        ? "Unable to load citation image."
                        : isImageLoading
                            ? "Loading citation image..."
                            : image && (
                                <img
                                    src={image.objectUrl}
                                    alt={document?.documentTitle || "Citation image"}
                                    className="h-auto max-h-[50vh] max-w-[66.666vw] rounded-sm object-contain"
                                />
                            )}
                </div>

                {document?.fileUrl && (
                    <Button asChild variant="outline" size="sm" className="mt-4">
                        <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                            Open document
                            <ExternalLink />
                        </a>
                    </Button>
                )}
            </PopoverContent>
        </Popover>
    );
}

export function CitationBadge({
    mark,
    type,
    docId,
    segment
}: {
    mark: number;
    type: "text" | "image";
    docId: string;
    segment: RagSegment
}) {
    if (type === "text") {
        console.log(segment)
        console.log("cite obj")
        console.log(segment.processedCiteObj)
        const evidences = segment.processedCiteObj?.texts?.[docId] ?? [];
        return <TextCitationBadge mark={mark} docId={docId} evidences={evidences} />;
    }

    const imageId = segment.processedCiteObj?.images?.[docId]?.[0];

    if (!imageId) {
        return null;
    }

    return <ImageCitationBadge mark={mark} docId={docId} imageId={imageId} />;
}
