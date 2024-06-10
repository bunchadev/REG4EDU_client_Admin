export {};
declare global{
     interface ISubject {
         "majorsId":string,
         "subjectId": string,
         "subjectName": string,
         "numberOfCredits": number,
         "majorName": string,
         "subjectCode": string,
         "category": string,
         "createdAt": string
     }
     interface ISubjectSemester {
         "semesterSubject_Id": string,
         "semesterId": string,
         "subjectId": string,
         "semesterName": string,
         "subjectName": string,
         "subjectCode": string,
         "createdAt": string
      }
     interface IBackendRes<T> {
          status:number,
          statusCode?: number | string;
          data?: T;
     }
     interface ICreateSubject {
          "subjectName": string,
          "numberOfCredits": number,
          "subjectCode": string,
          "majorsCode": string,
          "category": string
     }
     interface ISemesterClass{
          "semesterClass_Id": string,
          "name": string,
          "classNumber": number,
          "classroom": string,
          "weekDay": number,
          "onShift": number,
          "endShift": number,
          "numberStudent": number,
          "number": number,
          "describe": string,
          "semesterId": string,
          "subjectId": string,
          "userId": null,
          "userName": string
     }
     interface ISemesterSubject_1 {
          subjectId :string
          subjectName :string
     }
     interface ISemester {
          "semesterId": string,
          "name": string,
          "semesterName":string
          "level": number,
          "status": boolean
     }
     interface IClass {
         "name": string,
         "classNumber": number,
         "isChecked": boolean
     }
     interface IClass_1 {
          "id":string
          "name": string,
          "classNumber": number,
      }
     interface IBackendClass {
         "statusCode": string,
         "message": string,
         "subjectName": string
     }
     interface IClassUser{
          "name": string,
          "classNumber": number,
          "classroom": string,
          "weekDay": number,
          "onShift": number,
          "endShift": number,
          "describe": number
     }
     interface IMyClass{
          "subjectId":string
          "name": string,
          "classNumber": number,
          "classroom": string,
          "weekDay": number,
          "onShift": number,
          "endShift": number,
          "userName":string,
          "describe": string,
          "hours":number,
          "hours_1":number
     }
     interface IMyClass_1{
          "id":string
          "name": string,
          "classNumber": number,
          "classroom": string,
          "weekDay": number,
          "onShift": number,
          "endShift": number,
          "describe": string
     }
     interface ICreateClass{
          "name": string,
          "classNumber": number,
          "classroom": string,
          "weekDay": number,
          "onShift": number,
          "endShift": number,
          "numberStudent": number,
          "describe": string,
     }
     interface IUser{
          "userId": string,
          "name": string,
          "userName": string,
          "email": string,
          "password": string,
          "role": string,
          "departmentName": string
     }
     interface ICreateUser{
          "name": string,
          "userName": string,
          "email": string,
          "password": string,
          "role": string,
          "departmentCode": string
     }
     interface IUserSubject{
          "subjectId": string,
          "userId": string
     }
     interface IStudent{
          "studentId": string,
          "userName": string,
          "email": string,
          "password": string,
          "numberOfCredits": number,
          "status": string,
          "majorsCode": string
     }
     interface ICreateStudent{
          "userName": string,
          "email": string,
          "password": string,
          "majorsCode": string
     }
     interface IStudentSubject{
          "subjectId": string,
          "subjectName": string,
          "classNumber": number
     }
     interface IStudent_1 {
          "studentId": string,
          "userName": string
          "majorName":string
     }
     interface INotification{
          "id": string,
          "creatorName": string,
          "content": string,
          "createAt": string
     }
     interface IRole {
          "id": string,
          "roleName": string,
          "creatorName": string,
          "updateHours": string,
          "updateDay": string
     }
     interface IPermission{
          "id": string,
          "permissionName": string,
          "apiEndpoint": string,
          "description": string,
          "updatedAt": string
     }
     interface ICreateRole{
          roleName: string,
          creatorName: string
     }
     interface ICreateRolePermission{
          "roleId": string,
          "permissionId": string
     }
     interface IChecked{
          checked:boolean
          setChecked:(v: boolean) => void
      }
}