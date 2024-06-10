'use client'

import { GetClassWithUser, GetSemester, GetStudentWithClass } from "@/utils/action/action"
import Button from "antd/es/button"
import notification from "antd/es/notification"
import Select from "antd/es/select"
import Table from "antd/es/table"
import theme from "antd/es/theme"
import { useSession } from "next-auth/react"
import { useState } from "react"
import DrawerSchedule from "./drawer.schedule"
import { useCheckContext } from "@/lib/check.wrapper"
const columns = [
    {
        title: 'Ca',
        dataIndex: 'key',
        width:'4%'
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Thứ 2</div>,
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Thứ 3</div>,
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Thứ 4</div>,
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Thứ 5</div>,
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Thứ 6</div>,
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Thứ 7</div>,
    },
    {
        title: <div style={{display:"flex",justifyContent:'center'}}>Chủ nhật</div>,
        width:'14%'
    },
];
const data = [
    {
      key: '1',
    },
    {
      key: '2',
    },
    {
      key: '3',
    },
    {
      key: '4',
    },
    {
      key: '5',
    },
    {
      key: '6',
    },
    {
      key: '7',
    },
    {
      key: '8',
    },
    {
      key: '9',
    },
    {
      key: '10',
    },
    {
      key: '11',
    },
    {
      key: '12',
    },
    {
      key: '13',
    },
    {
      key: '14',
    },
];
const shiftClass: { [key: number]: number } = {
   1:95,2:148,3:203,4:258,6:368,8:478,9:533,10:587
}
const heightClass: { [key: number]: number } = {
  1:103,2:158,4:268
}
const weekDay1: { [key: number]: number } = {
  2:58,3:244,4:429,5:614,6:800,7:984,8:1170
}
const weekDay2: { [key: number]: number } = {
  2:54,3:215,4:375,5:535,6:695,7:855,8:1016
}
const CalendarApp=()=>{
    const {data:session} = useSession()
    const {checked} = useCheckContext() as IChecked
    const [openDrawerStudent, setOpenDrawerStudent] = useState(false);
    const [dataStudent,setDataStudent] = useState<IStudent_1[]>([])
    const [semesterId,setSemesterId] = useState<string>("")
    const [dataItem,setDataItem] = useState<IMyClass>()
    const [semester,setSemester] = useState<string>("")
    const [dataClass,setDataClass] = useState<IMyClass[]>([])
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const handleChangeSemester = async (value: string) => {
        const result = await GetSemester(value)
        if(result.statusCode === "200"){
            setSemesterId(result.data?.semesterId ?? "")
            setSemester(value)
        }
    };
    const showDrawerSubject = async (value :IMyClass) => {
        setDataItem(value)
        const result = await GetStudentWithClass(value.subjectId,semesterId ?? '',value.classNumber)
        if(result.statusCode === "200"){
           setDataStudent(result.data ?? [])
        }
        setOpenDrawerStudent(true);
      };
      const onCloseDrawerSubject = () => {
        setDataStudent([])
        setOpenDrawerStudent(false);
      };
    const handleClassWithUser = async () => {
      if(semester !== "")
      {
          const result = await GetClassWithUser(session?.user.userId ?? "",semester)
          if(result.statusCode === "200"){
             setDataClass(result.data ?? [])
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
    return(
        <div style={{width:"100%",marginBottom:600}}>
           <div style={{display:'flex',gap:7}}>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.5}}>Xem lịch</div>
                <div style={{marginTop:-3}}>/</div>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.9,color:'red'}}>Xem lịch dạy học học</div>
            </div>
            <div style={{display:'flex',gap:8,margin:"15px 0 20px 0",}}>
                <div style={{fontSize:25,fontWeight:"bolder",fontStyle:"italic",opacity:0.8}}>
                    Bạn xem lịch kì : 
                </div>
               <Select
                style={{ width: 200 }}
                placeholder="Chọn 1 kì"
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
            {
                dataClass.length > 0
                ?
                <div style={{background:colorBgContainer,
                    borderRadius:borderRadiusLG,position:'relative',marginBottom:20
                    }}>
                <div style={{display:'flex',
                    justifyContent:'center',
                    padding:"10px 0 0px 0",fontSize:19,fontWeight:'bold',
                    fontFamily:"revert-layer",
                    color:'#B22222'
                    }}>Danh sách các môn đã đăng ký</div>
                <Table columns={columns} dataSource={data} bordered={true} pagination={false}/>
                {
                    dataClass.map((item,index)=>{
                    const myTop = shiftClass[item.onShift]
                    const myHeight = heightClass[item.endShift-item.onShift]
                    const myLeft = checked ? weekDay1[item.weekDay] : weekDay2[item.weekDay]
                    return(     
                        <div key={index} style={{position:"absolute",display:"flex",cursor:"pointer",
                        flexDirection:'column',alignItems:"center",justifyContent:'center',background:"#00BFFF",
                        gap:5,width:checked ? 177 : 150,height:myHeight,top:myTop,left:myLeft,
                        borderRadius:borderRadiusLG,fontSize:16
                        }} onClick={()=>showDrawerSubject(item)}>
                        <div>{`${item.name}.${item.classNumber}${item.describe ? `_${item.describe}` : ""}`}</div>
                        <div>{item.classroom}</div>
                        </div>
                    )
                    })
                }
                </div>
                :
                <></>
            }
            <DrawerSchedule
                open={openDrawerStudent}
                onClose={onCloseDrawerSubject}
                data={dataStudent}
                dataItem={dataItem}           
            />
        </div>
    )
}
export default CalendarApp