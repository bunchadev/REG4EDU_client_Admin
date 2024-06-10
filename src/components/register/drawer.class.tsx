'use client'

import Divider from "antd/es/divider"
import Drawer from "antd/es/drawer"
import Table from "antd/es/table"
import HighlightOutlined from '@ant-design/icons/HighlightOutlined'
import { GetStudentWithClass } from "@/utils/action/action"
import { useState } from "react"
import ModalStudent from "./modal.student"
interface Iprops{
    onClose:(v :any) => void
    open:boolean,
    subjectName:string,
    subjectId:string,
    data: IClass_1[],
    semesterId:string
}

const DrawerClass=(props :Iprops)=>{
    const {onClose,open,subjectName,subjectId,data,semesterId} = props
    const [dataStudent,setStudent] = useState<IStudent_1[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [myClass,setMyClass] = useState<number>(0)
    const handleStudent = async (num :number) => {
        const result = await GetStudentWithClass(subjectId,semesterId,num)
        if(result.statusCode === "200"){
            setStudent(result.data ?? [])
        }
    }
    const showModal = async (num:number) => {
      await handleStudent(num)
      setMyClass(num)
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const columns = [
      {
        title: 'Lớp',
        dataIndex: 'classNumber',
      },
      {
        title: 'Tên',
        dataIndex: 'name',
      },
      {
        title: 'Sinh viên',
        render: (_: any, record: IClass_1) => {
          return(
            <HighlightOutlined onClick={()=>showModal(record.classNumber)}
            />
          )
        },
      }
    ];
    return(
        <Drawer width={700} title={`Các lớp của môn ${subjectName}`} onClose={onClose} open={open}>
          <Divider/>
          <Table style={{marginTop:20}} columns={columns} dataSource={data} pagination={false} rowKey={"id"}/>
          <ModalStudent
            data={dataStudent}
            handleCancel={handleCancel}
            isModalOpen={isModalOpen}
            handleData={handleStudent}
            semesterId={semesterId}
            subjectId={subjectId}
            classNumber={myClass}
          />
        </Drawer>
    )
}
export default DrawerClass