'use client'

import Drawer from "antd/es/drawer"
import Table from "antd/es/table"
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import { DeleteUserSubjects, GetUserNoSubjects } from "@/utils/action/action"
import Button from "antd/es/button"
import { useState } from "react"
import ModalDrawerLecturers from "./modal.drawer"
interface IProps {
    onClose:(v :any) => void
    open:boolean,
    userId:string,
    userName:string ,
    data:ISemesterSubject_1[],
    handleData:(v:any) => void
}

const DrawerSubject=(props :IProps)=>{ 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjects,setSubjects] = useState<ISemesterSubject_1[]>([])
    const showModal = async () => {
      const result = await GetUserNoSubjects(props.userId)
      if(result.data){
        setSubjects(result.data)
      }
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const handleDeleteSubject = async (id:string) => {
        const result = await DeleteUserSubjects(props.userId,id)
        if(result.statusCode === "200"){
          await  props.handleData(props.userId)
        }
    }
    const columns = [
        {
          title: 'Tên môn',
          dataIndex: 'subjectName',
          key: 'name',
          render: (text :any) => <a>{text}</a>,
        },
        {
            title: 'Xóa',
            dataIndex: 'delete',
            render: (_: any, record: ISemesterSubject_1) => {
              return(
                <DeleteOutlined onClick={()=>handleDeleteSubject(record.subjectId)}/>
              )
            },
            width:"6%"
          },
    ]
    return(
      <Drawer width={600} title={`Các môn mà ${props.userName} được dạy`} onClose={props.onClose} open={props.open}>
          <Button type="primary" onClick={showModal} style={{marginBottom:10}}>Thêm mới</Button>
          <Table columns={columns} dataSource={props.data} pagination={false} rowKey={"subjectId"}/>
          <ModalDrawerLecturers
             subjects={subjects} 
             isModalOpen={isModalOpen}
             handleCancel={handleCancel}
             userId={props.userId}
             setIsModalOpen={setIsModalOpen}
             handleData={props.handleData}
             setSubjects={setSubjects} 
          />
      </Drawer>
    )
}
export default DrawerSubject