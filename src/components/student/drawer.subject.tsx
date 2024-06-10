'use client'

import Drawer from "antd/es/drawer"
import Table from "antd/es/table"
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import Button from "antd/es/button"
import Select from "antd/es/select"
import { useEffect, useState } from "react"
import notification from "antd/es/notification"
import { GetSemester, GetSubjectStudent, UpdateStudentClassSubject, UpdateStudentSubject } from "@/utils/action/action"
import { Divider } from "antd"
interface IProps {
    onClose:(v :any) => void
    open:boolean,
    studentId:string,
    userName:string 
}

const DrawerSubject=(props :IProps)=>{ 
  const {onClose,open,userName} = props
  const [semester,setSemester] = useState<string>("")
  const [semesterId,setSemesterId] = useState<string>("")
  const [data,setData] = useState<IStudentSubject[]>([])
  const handleChangeSemester = async (value: string) => {
    const result = await GetSemester(value)
    if(result.statusCode === "200"){
      setSemesterId(result.data?.semesterId ?? "")
      setSemester(value)
    }
  };
  const handleSubjectWithUser = async () => {
    if(semester !== "" && semesterId !== "")
    {   
        try {
          const result = await GetSubjectStudent(props.studentId,semester)
          if(result.statusCode === "200"){
            setData(result.data ?? [])
          }
        } catch (error) {
          notification.error({
            message:"Failed!!!",
            description:"Bạn không có quyền xem!!!",
            duration:2
          })
        }
    }else{
      notification.error({
        message:"Cảnh báo !!!",
        description:"Bạn phải chọn 1 kì!!!",
        placement:"top",
        duration:1
      })
    }  
  }
   const handleDeleteSubject = async (id:string,classNumber :number)=>{
        try {
          const result = await UpdateStudentClassSubject(id,semesterId,props.studentId,classNumber,false)
          if(result.statusCode === "200" || result.statusCode === "201"){
            notification.success({
                message:"Thành công!!!",
                description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
                duration:2,
                placement:"topRight"
            })
            await handleSubjectWithUser()
          }
        } catch (error) {
          notification.error({
            message:"Thất bại!!!",
            description:"Bạn không có quyền xóa",
            duration:1,
            placement:"topRight"
        })
        }
   }
   const handleUpdateSubject = async (id:string) => {
        const result = await UpdateStudentSubject(props.studentId,id)
        if(result.statusCode === "200"){
          notification.success({
            message:"Thành công!!!",
            description: "Cập nhật thành công!!!",
            duration:1,
            placement:"topRight"
        })
        }
   }
    const columns = [
        {
          title: 'Tên môn',
          dataIndex: 'subjectName',
          key: 'subjectName',
          render: (text :any) => <a>{text}</a>,
        },
        {
          title: 'Cập nhật',
          key: '1',
          render: (_: any, record: IStudentSubject) => {
            return(
              <EditOutlined onClick={()=>handleUpdateSubject(record.subjectId)}/>
            )
          },
        },
        {
          title: 'Lớp',
          dataIndex: 'classNumber',
          key: 'classNumber',
        },
        {
            title: 'Xóa',
            dataIndex: 'delete',
            render: (_: any, record: IStudentSubject) => {
              return(
                <DeleteOutlined onClick={()=>handleDeleteSubject(record.subjectId,record.classNumber)}/>
              )
            },
            width:"6%"
          },
    ]
    useEffect(()=>{
      if(!open){
         setSemester("")
         setData([])
      }
   },[open])
    return(
      <Drawer width={600} title={`Các môn mà ${userName} đã đăng ký`} onClose={onClose} open={open}>
         <div style={{display:'flex',gap:10,marginTop:30,marginBottom:40}}>
          <Select
                style={{ width: 200 }}
                placeholder="Chọn 1 kì"
                optionFilterProp="children"
                value={semester}
                onChange={handleChangeSemester}
                options={[
                {
                    value: 'K3N3',
                    label: 'Kì 3 nhóm 3',
                },
                {
                    value: 'K1N2',
                    label: 'Kì 1 nhóm 2',
                },
                {
                    value: 'K2N2',
                    label: 'Kì 2 nhóm 2',
                },
                {
                    value: 'K3N2',
                    label: 'Kì 3 nhóm 2',
                },
                {
                    value: 'K1N1',
                    label: 'Kì 1 nhóm 1',
                },
                {
                    value: 'K2N1',
                    label: 'Kì 2 nhóm 1',
                },
                {
                    value: 'K3N1',
                    label: 'Kì 3 nhóm 1',
                },
                ]}
          />
          <Button onClick={handleSubjectWithUser}>Tìm kiếm</Button>
        </div>
        <Divider/>
        {
          data.length > 0
          ?
          <Table columns={columns} dataSource={data} pagination={false} rowKey={"subjectId"}/>
          :
          <></>
        }
      </Drawer>
    )
}
export default DrawerSubject