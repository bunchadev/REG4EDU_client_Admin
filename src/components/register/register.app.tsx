'use client'

import Button from "antd/es/button";
import notification from "antd/es/notification";
import Select from "antd/es/select";
import theme from "antd/es/theme";
import PlusCircleOutlined from '@ant-design/icons/PlusCircleOutlined'
import MinusCircleOutlined from '@ant-design/icons/MinusCircleOutlined'
import ClockCircleOutlined from '@ant-design/icons/ClockCircleOutlined'
import { useState } from "react";
import RegisterTable from "./register.table";
import { GetAllSemester, GetSemesterSubject } from "@/utils/action/action";
import ModalSemester from "./modal.semester";
import { useCheckContext } from "@/lib/check.wrapper";
interface Iprops {
    data:ISubjectSemester[]
}
const RegisterApp=(props: Iprops)=>{
    const {data} = props
    const {checked,setChecked} = useCheckContext() as IChecked
    const [majorName,setMajorName] = useState<string>("")
    const [semester,setSemester] = useState<string>("")
    const [category,setCategory] = useState<string>("")
    const [queryString,setQueryString] = useState<string>("")
    const [checkAdd,setCheckAdd] = useState<boolean>(false)
    const [dataAdd,setDataAdd] = useState<ISemesterSubject_1[]>([])
    const [listSemester,setListSemester] = useState<ISemester[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleShowModalSemester= async ()=>{
        const result = await GetAllSemester()
        if(result.statusCode === "200"){
            setListSemester(result.data ?? [])
        }
        setIsModalOpen(true)
    }
    const handleCancel = () => {
        setListSemester([])
        setIsModalOpen(false);
      };
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
    const handleDataAdd= async ()=>{
        const result = await GetSemesterSubject(semester,majorName,category)
        if(result.statusCode === "200"){
            setCheckAdd(true)
            setDataAdd(result.data ?? [])
        }
    }
    return(
        <div style={{width:"100%",marginBottom:300}}>
            <div style={{display:'flex',gap:7}}>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.5}}>Quản lý</div>
                <div style={{marginTop:-3}}>/</div>
                <div style={{fontFamily:"monospace",fontSize:15,opacity:0.9}}>Quản lý đăng ký học</div>
            </div>
            <div style={{marginTop:20,fontSize:20,fontWeight:"bolder",fontStyle:"italic",opacity:0.8}}>
                Quản lý và phân môn 
            </div>
            <div style={{display:'flex',gap:5,marginTop:30,marginBottom:10}}>
              <div style={{paddingTop:5,display:'flex',gap:40,justifyContent:'center',alignItems:'center',height:70,width:'82%',background:colorBgContainer,borderRadius:borderRadiusLG}}>  
                <div style={{display:"flex",gap:checked ? 10 : 5}}>
                    <div style={{fontFamily:'cursive'}}>Kì học :</div>
                    <div style={{marginTop:-5.7}}>
                        <Select
                            style={{ width:checked ? 200 : 180 }}
                            optionFilterProp="children"
                            value={semester}
                            onChange={handleChangeSemester}
                            options={[
                            {
                                value: 'K3N3',
                                label: 'Kì 3 nhóm 3',
                            },
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
                    <div style={{fontFamily:'cursive'}}>Chuyên ngành :</div>
                    <div style={{marginTop:-5.7}}>
                        <Select
                            style={{ width:checked ? 200 : 180 }}
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
                            style={{ width:checked ? 200 : 180 }}
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
              <div style={{display:"flex",gap:12,background:colorBgContainer,borderRadius:borderRadiusLG,justifyContent:'center',alignItems:'center',height:70,width:'24%'}}>
                  <Button  size="middle" onClick={handleClearData}>Đặt lại</Button>
                  <Button type="primary" onClick={handleSubmitForm}>Tìm kiếm</Button>
                  {
                    !checkAdd ? <PlusCircleOutlined onClick={handleDataAdd} style={{fontSize:18,opacity:0.8}}/> : <MinusCircleOutlined onClick={()=>{setCheckAdd(false);setDataAdd([]);}} style={{fontSize:18,opacity:0.7}}/>
                  }
                  <ClockCircleOutlined style={{fontSize:18,opacity:0.7,cursor:"pointer"}} onClick={handleShowModalSemester}/>
              </div>  
            </div>
            <div style={{width:'100%',background:colorBgContainer,borderRadius:borderRadiusLG,paddingBottom:50}}>
               <RegisterTable 
                  data={data}
                  queryString={queryString}
                  checkAdd={checkAdd}
                  dataAdd={dataAdd}
                  semester={semester}
                  setCheckAdd={setCheckAdd}
               />
            </div>
            <ModalSemester
              isModalOpen={isModalOpen}
              handleCancel={handleCancel}
              data={listSemester}
              handleShowModalSemester={handleShowModalSemester}
            />
        </div>
    )
}
export default RegisterApp