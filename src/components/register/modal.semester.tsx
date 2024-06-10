'use client'

import { Divider, Table, notification } from "antd"
import EditOutlined from '@ant-design/icons/EditOutlined'
import Modal from "antd/es/modal"
import { UpdateSemester } from "@/utils/action/action"
interface IProps{
    isModalOpen : boolean,
    handleCancel:(v :any) => void,
    data:ISemester[],
    handleShowModalSemester:()=>void
}
const ModalSemester=(props:IProps)=>{
    const {isModalOpen,handleCancel,data,handleShowModalSemester} = props
    const handleUpdateSemester= async (name:string)=>{
        const result = await UpdateSemester(name)
        if(result.statusCode === "200"){
            notification.success({
                message:"Thành công",
                description:"Cập nhật kì thành công",
                duration:1
            })
           await handleShowModalSemester()
        }
    }
    const columns = [
        {
          title: 'Tên',
          dataIndex: 'semesterName',
        },
        {
          title: 'Trạng thái',
          dataIndex: 'status',
          render: (text:any) => {
            let check
            if(text === true){
                check = "Đang mở"
            }else{
                check = "Đang đóng"
            }
            return(
              <a style={{color:"red"}}>{check}</a>
            )
          },
        },
        {
            title: 'Cập nhật',
            render: (_: any, record: ISemester) => {
                return(
                  <EditOutlined onClick={()=>handleUpdateSemester(record.name)}/>
                )
            },
        },
    ];
    return(
      <Modal footer={null} title="Mở và đóng đăng ký học" open={isModalOpen} onCancel={handleCancel}>
        <Divider/>
        <Table style={{margin:"30px 0 30px 0"}} columns={columns} dataSource={data} pagination={false} rowKey={"semesterId"}/>
      </Modal>
    )
}
export default ModalSemester