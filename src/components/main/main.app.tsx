'use client'
import React from "react"
import MenuApp from "../menu/menu"
import Layout, { Content } from "antd/es/layout/layout"
import Sider from "antd/es/layout/Sider"
import '../../styles/app.css'
import { useCheckContext } from "@/lib/check.wrapper"
const MainApp=({children,}: {children: React.ReactNode})=>{
    const {checked} = useCheckContext() as IChecked
    return(
       <Layout style={{marginTop:60}}>
          <Sider trigger={null} collapsible collapsed={checked} style={{background:"#E8E8E8",height:"100vh",position:"fixed",border:"1px solid #D8D8D8"}} width={256}>
            <MenuApp />
          </Sider>
          <Layout style={{background:"#F0F0F0"}}>
            <Content style={{margin:`25px 50px 0 ${checked ? '115px' : '295px'}`}}>
              {children}
            </Content>
          </Layout>
       </Layout>
    )
}
export default MainApp