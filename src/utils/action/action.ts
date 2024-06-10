"use server"

import { revalidateTag } from "next/cache"
import { sendRequest } from "../api"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/auth.options"
interface IUser{
  userId : string,
  userName : string
}
export async function UpdateSubject(row :ISubject,key :string,check1 :boolean,check2 :boolean,id :string) {
    const session = await getServerSession(authOptions)
    const result = await sendRequest<IBackendRes<ISubject[]>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/update`,
        method: "POST",
        body:{
          majorsId:id,
          subjectId:key,
          subjectName: row.subjectName,
          numberOfCredits: row.numberOfCredits,
          majorName: row.majorName,
          subjectCode: row.subjectCode,
          check1:check1,
          check2:check2,
          category:row.category
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
          cache: 'no-store',
        }
    })
    revalidateTag("subjectlistpagination")
    return result
}
export async function CreateSubject(values :ICreateSubject) {
    const session = await getServerSession(authOptions)
    const result = await sendRequest<IBackendRes<ICreateSubject>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/create`,
      method: "POST",
      body:values,
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
      nextOption: {
        cache: 'no-store',
      }
    })
    revalidateTag("subjectlistpagination")
    return result
}
export async function DeleteSubject(values :string[]) {
  const session = await getServerSession(authOptions)
  const result = await sendRequest<IBackendRes<ISubject>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/delete`,
    method: "POST",
    body:values,
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  revalidateTag("subjectlistpagination")
  return result
}
export async function SemesterClassSubject(semesterId :string,subjectId :string) {
  const result = await sendRequest<IBackendRes<ISemesterClass[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/SemesterClass`,
    method: "POST",
    body:{
      semesterId: semesterId,
      subjectId: subjectId
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function GetSemesterSubject(
  semesterName: string,
  majorsCode: string,
  category: string
) {
  const result = await sendRequest<IBackendRes<ISemesterSubject_1[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Semester/subject`,
    method: "POST",
    body:{
      semesterName: semesterName,
      majorsCode: majorsCode,
      category: category
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function CreateSemesterSubject(
  subjectId :string[],
  semesterName:string
) {
  const result = await sendRequest<IBackendRes<ISemesterSubject_1[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Semester/create`,
    method: "POST",
    body:{
      subjectId: subjectId,
      semesterName: semesterName
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  revalidateTag("semesterClassList")
  return result
}
export async function DeleteSemesterSubject(
   id:string
) {
  const result = await sendRequest<IBackendRes<ISemesterSubject_1[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/semester/delete`,
    method: "POST",
    body:{
      semesterSubject_Id: id
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  revalidateTag("semesterClassList")
  return result
}
export async function GetClassSubject(
  subjectId:string,semesterId: string,userId:string
) {
 const result = await sendRequest<IBackendRes<IClass[]>>({
   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/subject/class`,
   method: "POST",
   body:{
    subjectId: subjectId,
    semesterId: semesterId,
    userId: userId
   },
   nextOption: {
    //  next : {tags: ['classlist']},
     cache: 'no-store',
   }
 })
 return result
}
export async function UpdateClassSubject(
  subjectId:string,semesterId: string,userId:string,classNumber:number,isChecked:boolean
) {
 const session = await getServerSession(authOptions);
 const result = await sendRequest<IBackendClass>({
   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/update/class`,
   method: "POST",
   headers: {
    Authorization: `Bearer ${session?.access_token}`,
   },
   body:{
    subjectId: subjectId,
    semesterId: semesterId,
    userId: userId,
    classNumber: classNumber,
    isChecked: isChecked
   },
   nextOption: {
     cache: 'no-store',
   }
 })
 revalidateTag("classlist")
 return result
}
export async function GetAllUsers() {
 const result = await sendRequest<IBackendRes<IUser[]>>({
   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/all`,
   method: "GET",
   nextOption: {
     cache: 'no-store',
   }
 })
 return result
}
export async function UpdateSemesterClass(key :string,data :ISemesterClass) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/SemesterClass/update`,
    method: "POST",
    body:{
        "semesterClass_Id":key,
        "name": data.name,
        "classNumber": data.classNumber,
        "classroom": data.classroom,
        "weekDay": data.weekDay,
        "onShift": data.onShift,
        "endShift": data.endShift,
        "numberStudent": data.numberStudent,
        "number": data.number,
        "describe": data.describe,
        "semesterId": data.semesterId,
        "subjectId": data.subjectId,
        "userId": null,
        "userName": data.userName
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
 }
export async function CreateSemesterClass(semesterName :string,subjectId :string,data :ICreateClass) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/SemesterClass/create`,
    method: "POST",
    body:{
        "name": data.name,
        "classNumber": data.classNumber,
        "classroom": data.classroom,
        "weekDay": data.weekDay,
        "onShift": data.onShift,
        "endShift": data.endShift,
        "numberStudent": data.numberStudent,
        "describe": data.describe,
        "semesterName": semesterName,
        "subjectId": subjectId
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
// user

export async function UpdateUser(userId :string,row :any) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/update`,
    method: "POST",
    body:{
      "userId": userId,
      "name": row.name,
      "userName": row.userName,
      "email": row.email,
      "password": row.password,
      "role": row.role,
      "departmentCode": row.departmentName
    },
  })
  revalidateTag("userlistpagination")
  return result
}

export async function DeleteUser(userId :string) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/delete/${userId}`,
    method: "GET",
  })
  revalidateTag("userlistpagination")
  return result
}

export async function CreateUser(values :ICreateUser) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/signup`,
    method: "POST",
    body:{
      "name": values.name,
      "userName": values.userName,
      "email": values.email,
      "password": values.password,
      "role": values.role,
      "departmentCode": values.departmentCode
    },
  })
  revalidateTag("userlistpagination")
  return result
}
export async function GetUserSubjects(userId :string) {
  const session = await getServerSession(authOptions);
  const result = await sendRequest<IBackendRes<ISemesterSubject_1[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/subject/${userId}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function GetUserNoSubjects(userId :string) {
  const result = await sendRequest<IBackendRes<ISemesterSubject_1[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/no/subject/${userId}`,
    method: "GET",
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function AddRangeSubjects(values :IUserSubject[]) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/add/subject`,
    method: "POST",
    body:values,
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function DeleteUserSubjects(userId: string,subjectId :string) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/subject/delete`,
    method: "POST",
    body:{
      subjectId : subjectId,
      userId : userId
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function GetUserClasses(userId: string,semesterName :string) {
  const result = await sendRequest<IBackendRes<IMyClass_1[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/class/${userId}`,
    method: "POST",
    body:semesterName,
    nextOption: {
      cache: 'no-store'
   }
  })
  return result
}

// student

export async function UpdateStudent(studentId :string,row :any) {
  const session = await getServerSession(authOptions);
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/update`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    body:{
      "studentId": studentId,
      "userName": row.userName,
      "email": row.email,
      "password": row.password,
      "status":row.status,
      "majorsCode": row.majorsCode
    },
  })
  revalidateTag("studentlistpagination")
  return result
}

export async function DeleteStudent(studentId :string) {
  const session = await getServerSession(authOptions);
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/delete/${studentId}`,
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    method: "GET",
  })
  revalidateTag("studentlistpagination")
  return result
}

export async function CreateStudent(values :ICreateStudent) {
  const session = await getServerSession(authOptions);
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/create`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    body:{
      "userName": values.userName,
      "email": values.email,
      "password": values.password,
      "majorsCode": values.majorsCode
    },
  })
  revalidateTag("studentlistpagination")
  return result
}

export async function GetSubjectStudent(studentId :string,semesterName: string) {
  const session = await getServerSession(authOptions);
  const result = await sendRequest<IBackendRes<IStudentSubject[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/subject_1`,
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
    body:{
      studentId: studentId,
      semesterName: semesterName 
    },
  })
  return result
}

export async function UpdateStudentClassSubject(
  subjectId:string,semesterId: string,studentId:string,classNumber:number,isChecked:boolean
) {
 const session = await getServerSession(authOptions);
 const result = await sendRequest<IBackendClass>({
   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/update/class`,
   method: "POST",
   headers: {
    Authorization: `Bearer ${session?.access_token}`,
   },
   body:{
    subjectId: subjectId,
    semesterId: semesterId,
    userId: studentId,
    classNumber: classNumber,
    isChecked: isChecked
   },
   nextOption: {
     cache: 'no-store',
   }
 })
 return result
}
export async function GetSemester(
   code:string
) {
 const result = await sendRequest<IBackendRes<ISemester>>({
   url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Semester/${code}`,
   method: "GET",
   nextOption: {
     cache: 'no-store',
   }
 })
 return result
}

export async function GetClassGroupWithSubject(
  subjectId:string,semesterId:string
) {
const result = await sendRequest<IBackendRes<IClass_1[]>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/group`,
  method: "POST",
  body:{
    subjectId:subjectId ,
    semesterId:semesterId 
  },
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function GetStudentWithClass(
  subjectId:string,semesterId:string,classNumber:number
) {
const session = await getServerSession(authOptions);
const result = await sendRequest<IBackendRes<IStudent_1[]>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Subject/class/student`,
  method: "POST",
  body:{
    semesterId: semesterId,
    subjectId: subjectId,
    classNumber: classNumber
  },
  headers: {
    Authorization: `Bearer ${session?.access_token}`,
  },
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function GetStudent(
  studentName:string
) {
const result = await sendRequest<IBackendRes<IStudent_1>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/one/${studentName}`,
  method: "GET",
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

// semesterClass

export async function DeleteSemesterClass(
  id:string
) {
const result = await sendRequest<IBackendClass>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/SemesterClass/${id}`,
  method: "GET",
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

// Notification

export async function CreateNotification(
  semesterName:string,userName:string,creatorName:string,content:string
) {
const result = await sendRequest<IBackendClass>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Notification/create`,
  method: "POST",
  body:{
    semesterName: semesterName,
    userName: userName,
    creatorName: creatorName,
    content: content
  },
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function GetNotification(
  userId: string,
  semesterName: string
) {
const result = await sendRequest<IBackendRes<INotification[]>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Notification`,
  method: "POST",
  body:{
    userId: userId,
    semesterName: semesterName
  },
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function GetClassWithUser(
  userId: string,
  semesterName: string
) {
const result = await sendRequest<IBackendRes<IMyClass[]>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/User/classes`,
  method: "POST",
  body:{
    userId: userId,
    semesterName: semesterName
  },
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function UpdateStudentSubject(
  studentId: string,
  subjectId: string
) {
const result = await sendRequest<IBackendClass>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Student/subject/update`,
  method: "POST",
  body:{
    studentId: studentId,
    subjectId: subjectId
  },
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function GetAllSemester(
) {
const result = await sendRequest<IBackendRes<ISemester[]>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Semester/all`,
  method: "GET",
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function UpdateSemester(
  semesterName:string
) {
const result = await sendRequest<IBackendClass>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Semester/update/${semesterName}`,
  method: "GET",
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

//roles

export async function GetAllRoles() {
const result = await sendRequest<IBackendRes<IRole[]>>({
  url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/all`,
  method: "GET",
  nextOption: {
    cache: 'no-store',
  }
})
return result
}

export async function GetRolePermission(id:string) {
  const result = await sendRequest<IBackendRes<IPermission[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/permission/${id}`,
    method: "GET",
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}
export async function UpdateRole(id:string,roleName:string,creatorName:string) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/update`,
    method: "POST",
    body:{
      id: id,
      roleName: roleName,
      creatorName: creatorName
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  revalidateTag("rolelistpagination")
  return result
}

export async function DeleteRole(roleId:string) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/delete/${roleId}`,
    method: "GET",
    nextOption: {
      cache: 'no-store',
    }
  })
  revalidateTag("rolelistpagination")
  return result
}

export async function CreateRole(roleName:string,creatorName:string) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/create`,
    method: "POST",
    body:{
      roleName: roleName,
      creatorName: creatorName
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  revalidateTag("rolelistpagination")
  return result
}

export async function DeleteRolePermission(roleId:string,permissionId:string) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/permission/delete`,
    method: "POST",
    body:{
      roleId: roleId,
      permissionId: permissionId
    },
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}

export async function GetPermissionNotYetRole(roleId:string) {
  const result = await sendRequest<IBackendRes<IPermission[]>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/permission/not/yet/${roleId}`,
    method: "GET",
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}

export async function CreateRolePermission(listRoleId:any) {
  const result = await sendRequest<IBackendClass>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/Role/permission/create`,
    method: "POST",
    body:listRoleId,
    nextOption: {
      cache: 'no-store',
    }
  })
  return result
}



