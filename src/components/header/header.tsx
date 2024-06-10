'use client'
import { Header } from "antd/es/layout/layout";
import { signOut, useSession } from "next-auth/react";
import GithubOutlined from '@ant-design/icons/GithubOutlined'
import BellOutlined from '@ant-design/icons/BellOutlined'
import LogoutOutlined from '@ant-design/icons/LogoutOutlined'
import Popover from "antd/es/popover";
import { useState } from "react";
import DrawerNotification from "./drawer.notification";
const HeaderApp=()=>{
    const {data:session} = useSession()
    const [openDrawerNotification, setOpenDrawerNotification] = useState(false);
    const showDrawerSubject = () => {
        setOpenDrawerNotification(true);
      };
      const onCloseDrawerSubject = () => {
        setOpenDrawerNotification(false);
      };
    const handleSigout=()=>{
        signOut({
            redirect: true,
            callbackUrl: 'http://localhost:3000/auth/signin',
        })
    }
    
    return(
        <Header style={{background:"white",height:60,
            position:"fixed",top:0,
            zIndex:10,width:"100%",
            borderBottom:"1px solid #D8D8D8",
            }}>
            <div style={{marginRight:100,display:'flex',gap:10,justifyContent:'space-between'}}>
               <div style={{color:"#888888",fontSize:28,fontFamily:"cursive"}}>REG4EDU</div>
               <div style={{display:'flex',gap:17,marginTop:4}}>
                   <div style={{display:'flex',gap:5,fontSize:17,cursor:"pointer"}}>
                     <BellOutlined style={{marginTop:3}} onClick={showDrawerSubject}/>
                   </div>
                   <Popover placement="bottom" content={<div style={{display:'flex',gap:5,cursor:"pointer"}}
                      onClick={handleSigout}
                   >
                       <LogoutOutlined />
                       <div>Đăng suất</div>
                   </div>} trigger={"click"}>
                   <div style={{display:'flex',gap:6,cursor:'pointer'}}>
                     <GithubOutlined style={{fontSize:21}}/>
                     <div style={{color:"#6A5ACD",fontSize:17,marginTop:3}}>
                        {session?.user.userName}
                     </div>
                   </div>
                   </Popover>
               </div>
            </div>
            <DrawerNotification
               open={openDrawerNotification}
               onClose={onCloseDrawerSubject}
            />       
        </Header>
    )
}
export default HeaderApp