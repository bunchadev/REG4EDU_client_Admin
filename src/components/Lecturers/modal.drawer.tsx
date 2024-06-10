'use client'

import { AddRangeSubjects } from "@/utils/action/action"
import { Button, Divider, notification } from "antd"
import Checkbox from "antd/es/checkbox"
import Modal from "antd/es/modal"
import { useEffect, useState } from "react"
interface IProps{
    isModalOpen : boolean,
    handleCancel:(v :any) => void,
    subjects:ISemesterSubject_1[],
    userId:string,
    setIsModalOpen:(v: boolean) => void,
    handleData:(v:any) => void,
    setSubjects:(v:any) => void
}
const ModalDrawerLecturers=(props :IProps)=>{
    const {isModalOpen,handleCancel,subjects,userId,setIsModalOpen} = props
    const [subjects_1,setSubjects_1] = useState<IUserSubject[]>([])
    const [checkedSubjects, setCheckedSubjects] = useState<{ [key: string]: boolean }>({});
    const onChange = (e :boolean,item :ISemesterSubject_1) => {
      setCheckedSubjects(prev => ({
        ...prev,
        [item.subjectId]: e
      }));
      if (e === true) {
        const isSubjectIdExists = subjects_1.some(subject => subject.subjectId === item.subjectId);
        if (!isSubjectIdExists) {
            setSubjects_1(prevData => [...prevData, {userId:userId,subjectId:item.subjectId}]);
        }
      } else if (e === false) {
          setSubjects_1(prevData => prevData.filter(id => id.subjectId !== item.subjectId));
      }
    };
    const handleOk = async () => {
        const result = await AddRangeSubjects(subjects_1)
        if(result.statusCode === "200"){
          props.handleData(userId)
          notification.success({
            message:"Add!!!",
            description:"Thêm mới thành công!!!",
            duration:1
          })
        }
        props.setSubjects([])
        setIsModalOpen(false)
    };
    useEffect(() => {
      if (!isModalOpen) {
          setCheckedSubjects({});
      }
    }, [isModalOpen]);
    return(
      <Modal footer={null} title="Thêm mới môn" open={isModalOpen} onCancel={handleCancel}>
        <Divider/>
        <div style={{display:'flex',flexDirection:'column',gap:15,marginLeft:-25}}>
         {subjects.map((item,index)=>{
                  return(
                    <div key={index} style={{
                       display:'flex',
                       gap:15,
                       margin:'-10px 0px 0px 30px'
                    }}>
                       <Checkbox onChange={(e)=>onChange(e.target.checked,item)} checked={checkedSubjects[item.subjectId] || false}/>
                       <div style={{fontSize:16}}>{item.subjectName}</div>
                    </div>
                  )
        })}
        </div>
        <Divider/>
        <Button type="primary" style={{marginLeft:370}} onClick={handleOk}>Thêm mới</Button>
      </Modal>
    )
}
export default ModalDrawerLecturers