'use client'

import Divider from "antd/es/divider"
import Drawer from "antd/es/drawer"
import Table from "antd/es/table"
interface IProps {
    onClose:(v :any) => void
    open:boolean,
    data:IStudent_1[],
    dataItem:IMyClass | undefined
}
const DrawerSchedule=(props :IProps)=>{
    const {onClose,open,data,dataItem} = props
    const columns = [
        {
          title: 'Tên',
          dataIndex: 'userName',
          key: 'userName',
          render: (text :any) => <a style={{color:"red"}}>{text}</a>,
        },
        {
          title: 'Ngành',
          dataIndex: 'majorName',
          key: 'majorName',
        }
    ]
    return(
      <Drawer width={500} title={`Các thông tin thêm về lớp`} onClose={onClose} open={open}>
        <div style={{display:'flex',gap:220,marginBottom:10}}>
          <div style={{display:'flex',gap:5,fontSize:16}}>
            <div>Lớp:</div>
            <div>{dataItem?.classNumber}</div>
          </div>
          <div style={{display:'flex',gap:5,fontSize:16}}>
            <div>Tên:</div>
            <div>{dataItem?.name}</div> 
          </div>
        </div>
        <div style={{display:'flex',gap:220,fontSize:16,marginBottom:10}}>
          <div style={{display:'flex',gap:5}}>
            <div>Thứ:</div> 
            <div>{dataItem?.weekDay}</div>
          </div>
          <div style={{display:'flex',gap:5}}>
            <div>Giờ học:</div>
            <div>{dataItem?.hours}h-{dataItem?.hours_1}h</div> 
          </div>
        </div>
        <div style={{display:'flex',gap:145,fontSize:16,marginBottom:20}}>
          <div style={{display:'flex',gap:5}}>
            <div>Phòng học:</div> 
            <div>{dataItem?.classroom}</div>
          </div>
          <div style={{display:'flex',gap:5}}>
            <div>Ca:</div>
            <div>{dataItem?.onShift} - {dataItem?.endShift}</div> 
          </div>
        </div>
        <div style={{fontSize:17,fontStyle:"italic",marginBottom:8}}>Giảng viên: {dataItem?.userName ?? "Chưa có"}</div>
        <div style={{fontSize:17,fontStyle:"italic"}}>Số học sinh đã tham gia: {data.length}</div>
        <Divider/>
        {
          data.length > 0
          ?
          <div>
            <div style={{fontSize:18,marginBottom:13,fontFamily:"monospace",color:"green",fontStyle:"italic"}}>Danh sách sinh viên</div>
             <Table columns={columns} dataSource={data} bordered={false} pagination={false} rowKey={"subjectId"}/>
            </div>
          :
            <div style={{fontSize:20,fontStyle:"italic"}}>Chưa có sinh viên nào đăng ký lớp này</div>
        }
        
      </Drawer>
    )
}
export default DrawerSchedule
