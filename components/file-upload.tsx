"use client"

import { FileIcon, X } from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";
import { useEffect, useState } from "react";




interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

const getFileTypeFromUrl = async (url: string): Promise<string | undefined> => {
    try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("Content-Type");
        console.log(contentType?.includes("pdf"));

        if (!contentType) return undefined;

        if (contentType?.includes("image")) return "image";
        if (contentType?.includes("pdf")) return "pdf";
        return "unknown";
    } catch (error) {
        console.error("Error detecting file type:", error);
        return undefined;
    }
}

export const FileUpload = ({ onChange, value, endpoint }: FileUploadProps) => {
    const [fileType, setFileType] = useState<string | undefined>();

    useEffect(() => {
        if (!value) return;

        const detectType = async () => {
            const result = await getFileTypeFromUrl(value);
            console.log("result",result)
            setFileType(result);
        };

        detectType();
    }, [value]);
    console.log("FileUpload value:", fileType);

    if (value && fileType==="image") {
        return (
            <div className="relative h-20 w-20 ">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full" />
                <button onClick={() => onChange("")}
                    className="absolute top-0 right-0 p-1 rounded-full bg-rose-500 text-white shadow-sm">
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    if (value && fileType==="pdf") {
        return (
            <div className="relative flex iems-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
                <a href={value} target="_blank" rel="noopener noreferrer" className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline break-all">{value}</a>
                <button onClick={() => onChange("")}
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-rose-500 text-white shadow-sm">
                    <X className="h-4 w-4" />
                </button>
            </div>
        );
    }

    return (
        <div>
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    console.log("Upload complete:", res);
                    onChange(res?.[0].ufsUrl);
                }}
                onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                }} />
        </div>
    )
}