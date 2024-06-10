import { authOptions } from "@/app/api/auth/auth.options";
import LoginForm from "@/components/auth/auth.signin";
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation";
const SignInPage = async () => {
    const session = await getServerSession(authOptions)
    if (session) {
        redirect('/subject')
    }
    return (
        <div>
            <LoginForm/>
        </div>
    )
}
export default SignInPage