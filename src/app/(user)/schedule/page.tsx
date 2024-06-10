import { authOptions } from "@/app/api/auth/auth.options"
import ScheduleApp from "@/components/schedule/schedule.app"
import { sendRequest } from "@/utils/api"
import Button from "antd/es/button"
import Result from "antd/es/result"
import { getServerSession } from "next-auth/next"
import { notFound } from "next/navigation"

const Schedule = async ()=>{
    try {
      const session = await getServerSession(authOptions)
    const subjects = await sendRequest<IBackendRes<ISemesterSubject_1[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/subject/${session?.user.userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
          cache: 'no-store',
        }
      })
    const semester = await sendRequest<IBackendRes<ISemester>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Semester/one`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            cache: 'no-store',
       }
    })
    const myClass = await sendRequest<IBackendRes<IMyClass[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/class/${session?.user.userId}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next : {tags: ['classlist']},
        cache: 'no-store'
     }
    })
    if(!subjects || !semester || !myClass){
      notFound()
    }
    return(
        <>
           <ScheduleApp 
              subjects={subjects.data ? subjects.data : []}
              semester={semester.data ? semester.data : null}
              myClass={myClass.data ? myClass.data : []}
           />
        </>
    )
    } catch (error) {
      return (
        <Result
          style={{height:620}}
          status="500"
          title="500"
          subTitle="Xin lỗi, bạn không có quyền truy cập trang này !!!"
          extra={<Button type="primary" href="/home">Back Home</Button>}
        />
      );
    }
    
}
export default Schedule