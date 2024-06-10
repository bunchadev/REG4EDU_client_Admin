'use client'

import theme from "antd/es/theme";
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined'
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined'
import Input from "antd/es/input/Input";
import Select from "antd/es/select";
import InputNumber, { InputNumberProps } from "antd/es/input-number";
import Button from "antd/es/button/button";
import { useState } from "react";
import SubjectTable from "./subject.table";
import { useCheckContext } from "@/lib/check.wrapper";
interface IProps{
    ListData : ISubject[] | undefined
}

const SubjectList=(props :IProps)=>{
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const {checked,setChecked} = useCheckContext() as IChecked
    const [checkHTMLSearch,setCheckHTMLSearch] = useState<boolean>(false)
    const onChange: InputNumberProps['onChange'] = (value :any) => {
        setNumberOfCredits(value)
    };
    const [subjectName,setSubjectName] = useState<string>("")
    const [majorName,setMajorName] = useState<string>("")
    const [numberOfCredits,setNumberOfCredits] = useState<number>(0)
    const [subjectCode,setSubjectCode] = useState<string>("")
    const [category,setCategory] = useState<string>("")
    const [queryStringForm,setQueryStringForm] = useState<string>("")
    const handleSubmitForm=()=>{
        let queryString = '';
        if (subjectName) queryString += `subjectName=${encodeURIComponent(subjectName)}&`;
        if (majorName) queryString += `majorName=${encodeURIComponent(majorName)}&`;
        if (numberOfCredits > 0) queryString += `numberOfCredits=${numberOfCredits}&`;
        if (subjectCode) queryString += `subjectCode=${encodeURIComponent(subjectCode)}&`;
        if (category) queryString += `category=${encodeURIComponent(category)}&`;
        if (queryString !== '' && queryString.endsWith('&')) {
          queryString = queryString.slice(0, -1);
        }
        setQueryStringForm(queryString)
    }
    const hanleClearForm=()=>{
        setSubjectName("")
        setMajorName("")
        setNumberOfCredits(0)
        setSubjectCode("")
        setCategory("")
        setQueryStringForm("")
    }
    const handleChangeMajors = (value: string) => {
        setMajorName(value)
    };
    const handleChangeCategory = (value: string) => {
        setCategory(value)
    };
    return(
        <div style={{width:"100%"}}>
            <div style={{display:'flex',gap:7}}>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.5}}>Danh sách</div>
                <div style={{marginTop:-3}}>/</div>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.9}}>Danh sách môn học</div>
            </div>
            <div style={{marginTop:20,fontSize:20,fontWeight:"bolder",fontStyle:"italic",opacity:0.8}}>
                Tìm kiếm môn học
            </div>
            <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,margin:"30px 0 0 0",height:"auto"}}>
                <div style={{display:"flex",gap:50,marginLeft:checked ? 80 : -7,paddingBottom:checkHTMLSearch === false ? 20 : 0}}>
                    <div style={{display:'flex',gap:31,paddingTop:27,marginLeft:50}}>
                        <div>
                            <div style={{display:"flex",gap:5}}>
                                <div style={{fontFamily:'cursive'}}>Tên môn</div>
                                <div>
                                <QuestionCircleOutlined style={{opacity:0.7}}/> :
                                </div>
                                <div style={{marginTop:-5}}>
                                <Input placeholder="Nhập tên môn" value={subjectName} style={{width:235}} onChange={(e)=>setSubjectName(e.target.value)} allowClear/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{display:"flex",gap:5}}>
                                <div style={{fontFamily:'cursive'}}>Chuyên ngành :</div>
                                <div style={{marginTop:-5.7}}>
                                <Select
                                    style={{ width: 235 }}
                                    placeholder="Chọn 1 ngành"
                                    optionFilterProp="children"
                                    value={majorName}
                                    onChange={handleChangeMajors}
                                    filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                    filterSort={(optionA, optionB) =>
                                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                                    }
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
                        </div>
                        <div style={{display:"flex",gap:5}}>
                            <div style={{fontFamily:'cursive'}}>Số tín :</div>
                            <div style={{marginTop:-5.7}}>
                            <InputNumber min={-1} max={10} defaultValue={numberOfCredits} value={numberOfCredits} onChange={onChange} changeOnWheel size="middle"/>
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex",gap:8,paddingTop:20}}>
                        <Button  size="middle" onClick={hanleClearForm}>Đặt lại</Button>
                        <Button type="primary" onClick={handleSubmitForm}>Tìm kiếm</Button>
                        {
                            !checkHTMLSearch ? <PlusCircleOutlined onClick={()=>setCheckHTMLSearch(true)} style={{fontSize:18,opacity:0.8}}/> : <MinusCircleOutlined onClick={()=>setCheckHTMLSearch(false)} style={{fontSize:18,opacity:0.7}}/>
                        }
                    </div>
                </div>
                {
                    checkHTMLSearch ?
                    <div style={{display:"flex",gap:70,paddingTop:27,marginLeft:135,paddingBottom:20}}>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Mã môn</div>
                        <div>
                            <QuestionCircleOutlined style={{opacity:0.7}}/> :
                        </div>
                        <div style={{marginTop:-5}}>
                            <Input placeholder="Nhập mã môn" value={subjectCode} onChange={(e)=>setSubjectCode(e.target.value)} style={{width:235}} allowClear/>
                        </div>
                    </div>
                    <div style={{display:"flex",gap:5}}>
                        <div style={{fontFamily:'cursive'}}>Thể loại :</div>
                        <div style={{marginTop:-5.7}}>
                        <Select
                            style={{ width: 235 }}
                            placeholder="Chọn 1 thể loại"
                            optionFilterProp="children"
                            value={category}
                            onChange={handleChangeCategory}
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                            }
                            options={[
                            {
                                value: 'CN',
                                label: 'Chuyên ngành',
                            },
                            {
                                value: 'MATH',
                                label: 'Toán',
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
                            }
                            ]}
                        />
                        </div>
                    </div>
                    </div> 
                    :
                    <></>
                }
                
            </div>
            <div style={{background:colorBgContainer,borderRadius:borderRadiusLG,marginTop:10,height:"auto",marginBottom:100,display:"flex",gap:80}}>
                <div style={{width:'100%',paddingTop:20,margin:"0 35px 0 20px"}}>
                        <SubjectTable 
                         ListData={props.ListData}
                         queryStringForm={queryStringForm}
                         />
                </div>
            </div>
        </div>
    )
}
export default SubjectList