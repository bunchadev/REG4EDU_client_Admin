
import { authOptions } from "@/app/api/auth/auth.options";
import StudentApp from "@/components/student/student.app";
import { sendRequest } from "@/utils/api";
import Button from "antd/es/button";
import Result from "antd/es/result";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
const Student= async ({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined | number };
  })=>{
    try {
    const session = await getServerSession(authOptions);
    const students = await sendRequest<IBackendRes<IStudent[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/pagination?current=${searchParams.current ?? 1}&pageSize=${searchParams.pageSize ?? 3}&order=${searchParams.order ?? ''}&field=${searchParams.field ?? ''}&email=${searchParams.email ?? ''}&userName=${searchParams.userName ?? ''}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
          next : {tags: ['studentlistpagination']},
          cache: 'no-store',
        }
      });
    if(!students){
       notFound()
    }
    return(
        <>
           <StudentApp students={students.data ? students.data : []}/>
        </>
    )
  }catch(error){
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
export default Student