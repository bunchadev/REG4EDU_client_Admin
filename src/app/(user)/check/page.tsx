import CheckCalendar from "@/components/check/check.calendar";
import { sendRequest } from "@/utils/api";

const Check = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
})=>{
  const semesterClass = await sendRequest<IBackendRes<ISubjectSemester[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/semester?semesterName=${searchParams.semesterName}&majorsCode=${searchParams.majorsCode}&category=${searchParams.category ?? ''}&order=${searchParams.order ?? ''}&field=${searchParams.field ?? ''}&subjectCode=${searchParams.subjectCode ?? ''}`,
    method: "GET",
    nextOption: {
      next : {tags: ['semesterClassList']},
    }
  });
    return(
        <>
          <CheckCalendar data={semesterClass.data ? semesterClass.data : [] }/>
        </>
    )
}
export default Check