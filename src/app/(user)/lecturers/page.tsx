import AppLecturers from "@/components/Lecturers/app.lecturers";
import { sendRequest } from "@/utils/api";

const Lecturers= async ({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined | number };
  })=>{
    const users = await sendRequest<IBackendRes<IUser[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/pagination?current=${searchParams.current ?? 1}&pageSize=${searchParams.pageSize ?? 7}&order=${searchParams.order ?? ''}&field=${searchParams.field ?? ''}&name=${searchParams.name ?? ''}&userName=${searchParams.userName ?? ''}`,
        method: "GET",
        nextOption: {
          next : {tags: ['userlistpagination']},
          cache: 'no-store',
        }
      });
    return(
        <>
           <AppLecturers users={users.data ? users.data : []}/>
        </>
    )
}
export default Lecturers