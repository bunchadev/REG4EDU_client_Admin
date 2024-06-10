'use client'
import Input from "antd/es/input";
import theme from "antd/es/theme";
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined'
import { useState } from "react"
import Button from "antd/es/button";
import RoleTable from "./role.table";
interface Iprops{
    roles :IRole[] | undefined
}
const RoleApp=(props :Iprops)=>{
    const { roles } = props
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [queryStringForm,setQueryStringForm] = useState<string>("")
    const [roleName,setRoleName] = useState<string>("")
    const [creatorName,setCreatorName] = useState<string>("")
    const handleSubmitForm=()=>{
        let queryString = '';
        if (roleName) queryString += `roleName=${encodeURIComponent(roleName)}&`;
        if (creatorName) queryString += `creatorName=${encodeURIComponent(creatorName)}&`;
        if (queryString !== '' && queryString.endsWith('&')) {
          queryString = queryString.slice(0, -1);
        }
        setQueryStringForm(queryString)
    }
    const hanleClearForm=()=>{
        setRoleName("")
        setCreatorName("")
        setQueryStringForm("")
    }
    return(
        <div style={{width:"100%",marginBottom:220}}>
            <div style={{display:'flex',gap:7}}>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.5}}>Phân quyền</div>
                <div style={{marginTop:-3}}>/</div>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.9}}>Danh sách phân quyền</div>
            </div>
            <div style={{marginTop:20,fontSize:20,fontWeight:"bolder",fontStyle:"italic",opacity:0.8}}>
                Quản lý Quyền Người Dùng
            </div>
            <div style={{display:'flex',gap:7,marginBottom:10,height:100}}>
                <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,marginTop:30,
                    height:"auto",width:"80%",
                    display:'flex',justifyContent:"center",alignItems:"center",gap:100
                    }}>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Tên role:</div>
                        <div>
                        <QuestionCircleOutlined style={{opacity:0.7}}/> :
                        </div>
                        <div style={{marginTop:-5}}>
                        <Input placeholder="Tên role" value={roleName} style={{width:190}} onChange={(e)=>setRoleName(e.target.value)} allowClear/>
                        </div>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Tên người tạo:</div>
                        <div>
                        <QuestionCircleOutlined style={{opacity:0.7}}/> :
                        </div>
                        <div style={{marginTop:-5}}>
                        <Input placeholder="Tên người tạo" value={creatorName} style={{width:180}} onChange={(e)=>setCreatorName(e.target.value)} allowClear/>
                        </div>
                    </div>
                </div>
                <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,marginTop:30,height:"auto",width:"20%",display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{display:"flex",gap:8,marginTop:-5}}>
                        <Button  size="middle" onClick={hanleClearForm}>Đặt lại</Button>
                        <Button type="primary" onClick={handleSubmitForm}>Tìm kiếm</Button>
                    </div>
                </div>
            </div>
            <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,width:"100%"}}>
                <RoleTable
                  roles={roles}
                  queryStringForm={queryStringForm}
                />
            </div>
        </div>
    )
}
export default RoleApp