import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

interface InviteCodePageProps {
    params: Promise<{
    inviteCode: string;
    }>;
};


const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {
    const { inviteCode } = await params;
    const profile = await currentProfile();

    if(!profile) {
        return RedirectToSignIn({});
    }
    if(!inviteCode) {
        return redirect("/")
    }

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    if (existingServer) {
        return redirect(`/server/${existingServer.id}`)
    }

    const server = await db.server.update({
        where: {
            inviteCode: inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    })

    if (server) {
        return redirect(`/server/${server.id}`);
    }

 return null;

}

export default InviteCodePage;
