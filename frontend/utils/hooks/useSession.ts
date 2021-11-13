import { JWTPayload } from "@pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/client";

type UseGradeBookSessionReturnType = [{ user: JWTPayload, exp?: any } | null, boolean]

export const useGradeBookSession = (): UseGradeBookSessionReturnType => {
    return useSession() as UseGradeBookSessionReturnType

}