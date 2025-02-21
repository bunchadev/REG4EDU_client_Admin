'use client'

import Input from "antd/es/input";
import theme from "antd/es/theme";
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined'
import { useState } from "react"
import Button from "antd/es/button";
import LecturersTable from "./lecturers.table";

interface Iprops{
    users : IUser[]
}
const AppLecturers=(props : Iprops)=>{
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const {users} = props
    const [queryStringForm,setQueryStringForm] = useState<string>("")
    const [name,setName] = useState<string>("")
    const [userName,setUserName] = useState<string>("")
    const [userCode,setUserCode] = useState<string>("")
    const handleSubmitForm=()=>{
        let queryString = '';
        if (name) queryString += `name=${encodeURIComponent(name)}&`;
        if (userName) queryString += `userName=${encodeURIComponent(userName)}&`;
        if (queryString !== '' && queryString.endsWith('&')) {
          queryString = queryString.slice(0, -1);
        }
        setQueryStringForm(queryString)
    }
    const hanleClearForm=()=>{
        setName("")
        setUserName("")
        setUserCode("")
        setQueryStringForm("")
    }
    return(
        <div style={{width:"100%"}}>
            <div style={{display:'flex',gap:7}}>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.5}}>Nhân sự</div>
                <div style={{marginTop:-3}}>/</div>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.9}}>Danh sách nhân sự</div>
            </div>
            <div style={{marginTop:20,fontSize:20,fontWeight:"bolder",fontStyle:"italic",opacity:0.8}}>
                Quản lý nhân sự
            </div>
            <div style={{display:'flex',gap:7,marginBottom:10,height:100}}>
                <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,marginTop:30,
                    height:"auto",width:"82%",
                    display:'flex',justifyContent:"center",alignItems:"center",gap:20
                    }}>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Tên giảng viên</div>
                        <div>
                        <QuestionCircleOutlined style={{opacity:0.7}}/> :
                        </div>
                        <div style={{marginTop:-5}}>
                        <Input placeholder="Tên giảng viên" value={name} style={{width:190}} onChange={(e)=>setName(e.target.value)} allowClear/>
                        </div>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Biệt danh</div>
                        <div>
                        <QuestionCircleOutlined style={{opacity:0.7}}/> :
                        </div>
                        <div style={{marginTop:-5}}>
                        <Input placeholder="Biệt danh giảng viên" value={userName} style={{width:180}} onChange={(e)=>setUserName(e.target.value)} allowClear/>
                        </div>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Mã giảng viên</div>
                        <div>
                        <QuestionCircleOutlined style={{opacity:0.7}}/> :
                        </div>
                        <div style={{marginTop:-5}}>
                        <Input placeholder="Mã giảng viên" value={userCode} style={{width:150}} onChange={(e)=>setUserCode(e.target.value)} allowClear/>
                        </div>
                    </div>
                </div>
                <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,marginTop:30,height:"auto",width:"18%",display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{display:"flex",gap:8,marginTop:-5}}>
                        <Button  size="middle" onClick={hanleClearForm}>Đặt lại</Button>
                        <Button type="primary" onClick={handleSubmitForm}>Tìm kiếm</Button>
                    </div>
                </div>
            </div>
            <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,marginBottom:50}}>
                <LecturersTable users={users}
                                queryStringForm={queryStringForm}
                />
            </div>
        </div>
    )
}
export default AppLecturers