'use client'

import Menu, { MenuProps } from "antd/es/menu/menu"
import RightOutlined from '@ant-design/icons/RightOutlined'
import LeftOutlined from '@ant-design/icons/LeftOutlined'
import HomeOutlined from '@ant-design/icons/HomeOutlined'
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined'
import BarChartOutlined from '@ant-design/icons/BarChartOutlined'
import TeamOutlined from '@ant-design/icons/TeamOutlined'
import UserOutlined from '@ant-design/icons/UserOutlined'
import ScheduleOutlined from '@ant-design/icons/ScheduleOutlined'
import CalendarOutlined from '@ant-design/icons/CalendarOutlined'
import ZoomInOutlined from '@ant-design/icons/ZoomInOutlined'
import SyncOutlined from '@ant-design/icons/SyncOutlined'
import Button from "antd/es/button/button"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { useCheckContext } from "@/lib/check.wrapper"
const MenuApp=()=>{
    const {data:session} = useSession()
    const {checked,setChecked} = useCheckContext() as IChecked
    const onClick: MenuProps['onClick'] = (e) => {};
    const items = [
      {
          key: '0',
          icon: <HomeOutlined style={{fontSize:16}}/>,
          label: <Link href={"/home"} style={{fontSize:17}}>Trang chủ</Link>,
          roles: [''],
      },
      {
          key: '1',
          icon: <SyncOutlined style={{fontSize:16}}/>,
          label: <Link href={"/role"} style={{fontSize:17}}>Phân quyền</Link>,
          roles: ['admin'],
      },
      {
          key: '2',
          icon: <UnorderedListOutlined style={{fontSize:16}}/>,
          label: <Link href={"/subject?current=1&pageSize=10"} style={{fontSize:17}}>Quản lý môn học</Link>,
          roles: [''],
      },
      {
          key: '3',
          icon: <BarChartOutlined style={{fontSize:16}}/>,
          label: <Link href={"/register"} style={{fontSize:17}}>Quản lý đăng ký học</Link>,
          roles: ['admin'],
      },
      {
          key: '4',
          icon: <TeamOutlined style={{fontSize:16}}/>,
          label: <Link href={"/lecturers?current=1&pageSize=3"} style={{fontSize:17}}>Quản lý nhân sự</Link>,
          roles: ['admin'],
      },
      {
          key: '5',
          icon: <UserOutlined style={{fontSize:16}}/>,
          label: <Link href={"/student?current=1&pageSize=3"} style={{fontSize:17}}>Quản lý sinh viên</Link>,
          roles: [''],
      },
      {
          key: '6',
          icon: <ScheduleOutlined style={{fontSize:16}}/>,
          label: <Link href={"/schedule"} style={{fontSize:17}}>Lập lịch học kì</Link>,
          roles: ['1'],
      },
      {
          key: '7',
          icon: <CalendarOutlined style={{fontSize:16}}/>,
          label: <Link href={"/check"} style={{fontSize:17}}>Xem lịch học kì</Link>,
          roles: ['1'],
      },
      {
          key: '8',
          icon: <ZoomInOutlined style={{fontSize:16}}/>,
          label: <Link href={"/calendar"} style={{fontSize:17}}>Xem thời khóa biểu</Link>,
          roles: ['1'],
      },
    ];
    const [filteredItems,setFilteredItems] = useState<any>([])
    const handleItems=()=>{
      let result = items.filter(item => item.roles.includes('') || item.roles.includes(session?.user.role ?? '') || item.roles.includes('1'));
      if(session?.user.role === 'admin'){
        result = result.filter(i=> !i.roles.includes('1'))
      }
      setFilteredItems(result)
    }
    useEffect(()=>{
       handleItems()
    },[session])
    return(
      <div style={{position:"relative"}}>
          <Button
            size="small"
            shape="circle"
            icon={!checked ? <LeftOutlined style={{fontSize:10,color:"#BEBEBE"}}/> : <RightOutlined style={{fontSize:10,color:"#BEBEBE"}}/>}
            onClick={() => setChecked(!checked)}
            style={{
              position:"absolute",
              display:'flex',
              alignItems:"center",
              justifyContent:'center',
              top:30,
              left:checked ? 67 : 242,
              border:"none",
            }}
          />
          <Menu
            onClick={onClick}
            inlineCollapsed={checked}
            style={{background:"#E8E8E8",border:"none",paddingTop:9,paddingRight:10}}
            defaultOpenKeys={['sub1']}
            mode="inline"
            items={filteredItems}
          />
      </div>
    )
}
export default MenuApp