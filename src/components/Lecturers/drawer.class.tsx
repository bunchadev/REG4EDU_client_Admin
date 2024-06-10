'use client'

import { GetUserClasses } from "@/utils/action/action"
import { Divider } from "antd"
import Button from "antd/es/button"
import Drawer from "antd/es/drawer"
import notification from "antd/es/notification"
import Select from "antd/es/select"
import Table from "antd/es/table"
import { useEffect, useState } from "react"
interface IProps {
    onClose:(v :any) => void
    open:boolean,
    userName:string,
    userId:string
}
const columns = [
  {
    title: 'Tên',
    dataIndex: 'name',
    width: '10%',
    editable: true,
  },
  {
    title: 'Lớp',
    dataIndex: 'classNumber',
    width: '5%',
    editable: true,
  },
  {
    title: 'Phòng học',
    dataIndex: 'classroom',
    width: '8%',
    editable: true,
  },
  {
    title: 'Thứ',
    dataIndex: 'weekDay',
    width: '6%',
    editable: true,
  },
  {
    title: 'Ca vào',
    dataIndex: 'onShift',
    width: '7%',
    editable: true,
  },
  {
    title: 'Ca ra',
    dataIndex: 'endShift',
    width: '7%',
    editable: true,
  }
];
const DrawerClass=(props: IProps)=>{
    const {onClose,open,userName} = props
    const [semester,setSemester] = useState<string>("")
    const [data,setData] = useState<IMyClass_1[]>([])
    const handleChangeSemester = (value: string) => {
      setSemester(value)
    };
    const handleClassWithUser = async () => {
      if(semester !== "")
      {
          const result = await GetUserClasses(props.userId,semester)
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
    useEffect(()=>{
       if(!open){
          setSemester("")
          setData([])
       }
    },[open])
    return(
      <Drawer width={600} title={`Các lớp mà ${userName} đã đăng ký`} onClose={onClose} open={open}>
        <div style={{display:'flex',gap:20,marginTop:20}}>
          <div style={{fontSize:20,marginTop:5}}>Kì :</div>
          <Select
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
          <Button onClick={handleClassWithUser}>Tìm kiếm</Button>
        </div>
        <Divider/>
        {
          data.length > 0 ?
          <Table style={{marginTop:20}} columns={columns} dataSource={data} pagination={false} rowKey={"id"}/>
          :
          <></>
        }
      </Drawer>
    )
}
export default DrawerClass