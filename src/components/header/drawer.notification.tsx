'use client'

import { GetNotification } from "@/utils/action/action"
import Button from "antd/es/button"
import Divider from "antd/es/divider"
import Drawer from "antd/es/drawer"
import notification from "antd/es/notification"
import Select from "antd/es/select"
import Table from "antd/es/table"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
interface IProps {
    onClose:(v :any) => void
    open:boolean,
}
const DrawerNotification = (props :IProps)=>{
  const {data:session} = useSession()
  const {onClose,open} = props
  const [semester,setSemester] = useState<string>("")
  const [data,setData] = useState<INotification[]>([])
  const handleChangeSemester = (value: string) => {
      setSemester(value)
  };
  const handleSubjectWithUser = async () => {
    if(semester !== "")
    {
        const result = await GetNotification(session?.user.userId ?? '',semester)
        if(result.statusCode === "200"){
           setData(result.data ?? [])
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
    const columns = [
        {
          title: 'Tên',
          dataIndex: 'creatorName',
          key: 'creatorName',
          render: (text :any) => <a style={{color:"red"}}>{text}</a>,
        },
        {
          title: 'Nội dung',
          dataIndex: 'content',
          key: 'content',
        },
        {
            title: 'Thời gian',
            dataIndex: 'createAt',
            key: 'createAt',
            render: (text :any) => <a style={{color:"green"}}>{text}</a>,
        },
    ]
    useEffect(()=>{
        if(!open){
           setSemester("")
           setData([])
        }
     },[open])
    return(
        <Drawer width={700} title={`Các thông báo về đăng ký lịch`} onClose={onClose} open={open}>
         <div style={{display:'flex',gap:10,marginTop:20,marginBottom:40}}>
          <Select
                placeholder = "Hãy chọn 1 kì"
                style={{ width: 200 }}
                optionFilterProp="children"
                value={semester}
                onChange={handleChangeSemester}
                options={[
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
          <Table columns={columns} dataSource={data} bordered={false} pagination={false} rowKey={"subjectId"}/>
          :
          <></>
        }
      </Drawer>
    )
}
export default DrawerNotification