import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
interface IUser {
    "userId": string,
    "name": string,
    "userName": string,
    "email": string,
    "password": string,
    "role": string,
    "departmentId": string,
}
declare module "next-auth/jwt" {
    interface JWT {
        access_token: string,
        refresh_token: string,
        user: IUser
    }
}
declare module "next-auth" {
    interface Session {
        access_token: string,
        refresh_token: string,
        user: IUser
    }

}