import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "./api/auth/auth.options"

const HomeApp=async()=>{
   const session = await getServerSession(authOptions)
   if (!session) {
     redirect("/auth/signin")
   }else{
     redirect("/home")
   }
   return(
        <></>
   )
}
export default HomeApp