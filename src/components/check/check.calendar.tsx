'use client'

import Button from "antd/es/button";
import notification from "antd/es/notification";
import Select from "antd/es/select";
import theme from "antd/es/theme";
import { useState } from "react";
import CheckTable from "./check.table";
interface Iprops {
    data:ISubjectSemester[]
}
const CheckCalendar=(props: Iprops)=>{
    const {data} = props
    const [majorName,setMajorName] = useState<string>("")
    const [semester,setSemester] = useState<string>("")
    const [category,setCategory] = useState<string>("")
    const [queryString,setQueryString] = useState<string>("")
    
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const handleChangeMajors = (value: string) => {
        if(semester === ""){
            notification.error({
                message:"Cảnh báo",
                description:"Bạn phải chọn 1 kì!!!",
                duration:1
            })
        }else{
            setMajorName(value)
        }
    };
    const handleChangeSemester = (value: string) => {
        setSemester(value)
    };
    const handleChangeCategory = (value: string) => {
        if(majorName === ""){
            notification.error({
                message:"Cảnh báo",
                description:"Bạn phải chọn 1 ngành!!!",
                duration:1
            })
        }else{
            setCategory(value)
        }
    };
    const handleSubmitForm=()=>{
        let queryString = '';
        if (semester) queryString += `semesterName=${encodeURIComponent(semester)}&`;
        if (majorName) queryString += `majorsCode=${encodeURIComponent(majorName)}&`;
        if (category) queryString += `category=${encodeURIComponent(category)}&`;
        if (queryString !== '' && queryString.endsWith('&')) {
          queryString = queryString.slice(0, -1);
        }
        setQueryString(queryString)
    }
    const handleClearData=()=>{
        setMajorName("")
        setSemester("")
        setCategory("")
        setQueryString("")
    }
    return(
        <div style={{width:"100%",marginBottom:220}}>
            <div style={{display:'flex',gap:7}}>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.5}}>Xem lịch</div>
                <div style={{marginTop:-3}}>/</div>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.9}}>Xem lịch đăng ký dạy học</div>
            </div>
            <div style={{marginTop:20,fontSize:20,fontWeight:"bolder",fontStyle:"italic",opacity:0.8}}>
                Xem môn và lịch dạy 
            </div>
            <div style={{display:'flex',gap:5,marginTop:30,marginBottom:10}}>
              <div style={{display:'flex',gap:40,justifyContent:'center',alignItems:'center',height:70,width:'82%',background:colorBgContainer,borderRadius:borderRadiusLG}}>  
                <div style={{display:"flex",gap:10}}>
                    <div style={{fontFamily:'cursive'}}>Kì học :</div>
                    <div style={{marginTop:-5.7}}>
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
                    </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                    <div style={{fontFamily:'cursive'}}>Ngành :</div>
                    <div style={{marginTop:-5.7}}>
                        <Select
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            value={majorName}
                            onChange={handleChangeMajors}
                            options={[
                            {
                                value: 'TI',
                                label: 'Khoa học và máy tính',
                            },
                            {
                                value: 'CNTT',
                                label: 'Công nghệ thông tin',
                            },
                            {
                                value: 'KTQT',
                                label: 'Kinh tế quôc tế',
                            },
                            {
                                value: 'NNH',
                                label: 'Ngôn ngữ hàn',
                            }
                            ]}
                        />
                    </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                    <div style={{fontFamily:'cursive'}}>Thể loại :</div>
                    <div style={{marginTop:-5.7}}>
                        <Select
                            style={{ width: 200 }}
                            optionFilterProp="children"
                            value={category}
                            onChange={handleChangeCategory}
                            options={[
                                {
                                    value: 'CN',
                                    label: 'Chuyên ngành',
                                },
                                {
                                    value: 'CN_TD',
                                    label: 'Chuyên ngành tự do',
                                },
                                {
                                    value: 'TA',
                                    label: 'Tiếng anh bắt buộc',
                                },
                                {
                                    value: 'TT',
                                    label: 'Thể dục',
                                },
                                {
                                    value: 'TD',
                                    label: 'Tự do',
                                },
                                {
                                    value: 'NN',
                                    label: 'Ngôn ngữ bắt buộc',
                                }
                            ]}
                        />
                    </div>
                </div>
              </div>
              <div style={{display:"flex",gap:12,background:colorBgContainer,borderRadius:borderRadiusLG,justifyContent:'center',alignItems:'center',height:70,width:'20%'}}>
                  <Button  size="middle" onClick={handleClearData}>Đặt lại</Button>
                  <Button type="primary" onClick={handleSubmitForm}>Tìm kiếm</Button>
              </div>  
            </div>
            <div style={{width:'100%',background:colorBgContainer,borderRadius:borderRadiusLG,paddingBottom:50}}>
               <CheckTable 
                  data={data}
                  queryString={queryString}
               />
            </div>
        </div>
    )
}
export default CheckCalendar