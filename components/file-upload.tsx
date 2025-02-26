"use client"

import {X} from "lucide-react";
import Image from "next/image";

import { UploadDropzone } from "@/lib/uploadthing";




interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint:"messageFile" | "serverImage"
}

export const FileUpload = ({onChange, value ,endpoint }: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    console.log("FileUpload value:", value);

    if(value && fileType !== "pdf"){
        return(
            <div className="relative h-20 w-20 ">
            <Image
                fill
                src={value}
                alt="Upload"
                className="rounded-full"/>
            <button onClick={() => onChange("")}
            className="absolute top-0 right-0 p-1 rounded-full bg-rose-500 text-white shadow-sm">
                <X className="h-4 w-4"/>
                    </button>    
            </div>
        );
    }
    return(
        <div>
            <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res)=>{
                console.log("Upload complete:", res);
                onChange(res?.[0].ufsUrl);
            }}
            onUploadError={(error:Error)=>{
                console.error("Upload error:",error);
            }}/>
        </div>
    )
}