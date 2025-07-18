import { currentProfile } from "@/lib/current-profile";
import { RedirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChannelType } from "@prisma/client";
import { MediaRoom } from "@/components/media-room";

interface ChannelIdPageProps {
    params: Promise<{
        serverId: string;
        channelId: string;
    }>;
}

const ChannelIdPage = async ({params}:ChannelIdPageProps) => {
    const {serverId, channelId}=await params;
    const profile=await currentProfile();
    if(!profile){
        return RedirectToSignIn({});
    }
    const channel=await db.channel.findUnique({
        where:{
            id:channelId,
        },
    });

    const member=await db.member.findFirst({
        where:{
            serverId:serverId,
            profileId:profile.id,
        }
    });
    if(!member||!channel){
        redirect("/");
    }
    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
        <ChatHeader name={channel.name} serverId={channel.serverId} type="channel"/>
        {channel.type===ChannelType.TEXT&&(
            <>
            <ChatMessages member={member} name={channel.name} type="channel" apiUrl="/api/messages" socketUrl="/api/socket/messages" socketQuery={{channelId:channel.id,serverId:channel.serverId}} paramKey="channelId" paramValue={channel.id} chatId={channel.id}/>
        <ChatInput name={channel.name} type="channel" apiUrl="/api/socket/messages" query={{
            channelId:channel.id,
            serverId:channel.serverId,
        }}/>
            </>
        )}
        {channel.type===ChannelType.AUDIO&&(
            <MediaRoom chatId={channel.id} video={false} audio={true}/>
        )}
         {channel.type===ChannelType.VIDEO&&(
            <MediaRoom chatId={channel.id} video={true} audio={true}/>
        )}
        </div>
        
    );
    }

    export default ChannelIdPage;
