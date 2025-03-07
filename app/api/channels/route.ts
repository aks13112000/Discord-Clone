import { NextResponse } from "next/server";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";

export async function POST(req:Request){
    try{
        const profile=await currentProfile();
        const {name,type}=await req.json();
        const {searchParams}= new URL(req.url);
        const serverId=searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized",{status:401});
        }

        if(!serverId){
            return new NextResponse("Server ID missing",{status:400});
        }

        if(name==="general"){
            return new NextResponse("Channel name cannot be 'general'",{status:400});
        }
        const server = await db.server.findFirst({
            where: {
                id: serverId,
                OR: [
                    { profileId: profile.id }, // Allow the server owner
                    {
                        members: {
                            some: {
                                profileId: profile.id,
                                role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] }
                            }
                        }
                    }
                ]
            }
        });
        
        if (!server) {
            return new NextResponse("Server not found or user lacks permissions", { status: 403 });
        }
        const updatedServer = await db.server.update({
            where: { id: serverId },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        });
        
        return NextResponse.json(updatedServer);
        
        
}
    catch(error){
        console.log("[CHANNELS_POST]",error);
        return new NextResponse("Internal Error",{status:500});
    }
}