import { authOptions } from "@/app/api/auth/auth.options";
import SubjectList from "@/components/subject/subject.list";
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import { Result, Button } from 'antd';

const SubjectsApp = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined | number };
}) => {
  try {
    const session = await getServerSession(authOptions);
    const subjects = await sendRequest<IBackendRes<ISubject[]>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/pagination?current=${searchParams.current}&pageSize=${searchParams.pageSize}&order=${searchParams.order ?? ''}&field=${searchParams.field ?? ''}&subjectName=${searchParams.subjectName ?? ''}&majorName=${searchParams.majorName ?? ''}&numberOfCredits=${searchParams.numberOfCredits ?? 0}&subjectCode=${searchParams.subjectCode ?? ''}&category=${searchParams.category ?? ''}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        next: { tags: ['subjectlistpagination'] },
        cache: 'no-store',
      }
    });

    if (!subjects || !subjects.data) {
      notFound();
    }

    return (
      <>
        <SubjectList ListData={subjects.data} />
      </>
    );
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
};

export default SubjectsApp;

