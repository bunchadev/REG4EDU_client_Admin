'use client'

import Button from "antd/es/button"
import Divider from "antd/es/divider"
import Modal from "antd/es/modal"
import Table from "antd/es/table"
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import { useState } from "react"
import notification from "antd/es/notification"
import { GetStudent, UpdateStudentClassSubject } from "@/utils/action/action"
import Input from "antd/es/input"
interface IProps{
    isModalOpen : boolean,
    handleCancel:(v :any) => void,
    data:IStudent_1[],
    semesterId:string,
    subjectId:string,
    classNumber:number,
    handleData:(v:any) => void
}
const ModalStudent=(props:IProps)=>{
    const {isModalOpen,handleCancel,data,subjectId,semesterId,classNumber,handleData} = props
    const [studentName,setStudentName] = useState<string>("")
    const handleStudent = async () => {
         if(!studentName){
            notification.error({
                message:"Error!!!",
                description:"Bạn phải nhập mã sinh viên!!!",
                duration:1
            })
            return
         }
        const res = await GetStudent(studentName)
        if(res.statusCode === "200"){
            const result = await UpdateStudentClassSubject(subjectId,semesterId,res.data?.studentId ?? "",classNumber,true)
            if(result.statusCode === "200" || result.statusCode === "201"){
                notification.success({
                    message:"Thành công!!!",
                    description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
                    duration:2,
                    placement:"topRight"
                })
              }else if(result.statusCode === "400" || result.statusCode === "401"){
                notification.error({
                    message:"Thất bại!!!",
                    description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
                    duration:5,
                    placement:"topRight"
                })
              }
            await handleData(classNumber)
        }else{
          notification.error({
            message:"Error!!!",
            description:"Không tìm thấy sinh viên!!!",
            duration:1
        })
        }
      setStudentName("")
    }
    const handleDelete = async (id:string) =>{
      const result = await UpdateStudentClassSubject(subjectId,semesterId,id ?? "",classNumber,false)
      if(result.statusCode === "200" || result.statusCode === "201"){
          notification.success({
              message:"Thành công!!!",
              description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
              duration:2,
              placement:"topRight"
          })
        }
      await handleData(classNumber)
    }
    const columns = [
        {
          title: 'Tên',
          dataIndex: 'userName',
        },
        {
          title: 'Xóa',
          render: (_: any, record: IStudent_1) => {
            return(
              <DeleteOutlined onClick={()=>handleDelete(record.studentId)}/>
            )
          },
        },
    ];
    return(
      <Modal footer={null} title="Danh sách sinh viên đã đăng ký lớp" open={isModalOpen} onCancel={handleCancel}>
        <Divider/>
        <div style={{display:'flex',gap:10,marginTop:30,marginBottom:40}}>
          <Input placeholder="Nhập mã sinh viên" style={{width:140,height:32}} value={studentName} onChange={(e)=>setStudentName(e.target.value)}/>
          <Button onClick={handleStudent}>Thêm mới</Button>
        </div>
        <Table style={{margin:"30px 0 30px 0"}} columns={columns} dataSource={data} pagination={false} rowKey={"id"}/>
      </Modal>
    )
}
export default ModalStudent