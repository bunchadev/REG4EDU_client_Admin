import RoleApp from "@/components/role/role.app"
import { sendRequest } from "@/utils/api"

const Role = async ({
    searchParams,
  }: {
    searchParams: { [key: string]: string | string[] | undefined | number };
}) => {
    const roles = await sendRequest<IBackendRes<IRole[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/pagination?current=${searchParams.current ?? 1}&pageSize=${searchParams.pageSize ?? 3}&order=${searchParams.order ?? ''}&field=${searchParams.field ?? ''}&roleName=${searchParams.roleName ?? ''}&creatorName=${searchParams.creatorName ?? ''}`,
        method: "GET",
        nextOption: {
          next : {tags: ['rolelistpagination']},
          cache: 'no-store',
        }
      });
    return(
        <>
           <RoleApp roles={roles ? roles.data : []}/>
        </>
    )
}
export default Role