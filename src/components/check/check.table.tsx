'use client'

import { SemesterClassSubject} from "@/utils/action/action";
import Form from "antd/es/form";
import Table from "antd/es/table"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Iprops {
  data:ISubjectSemester[],
  queryString:string,
}
const CheckTable=(props: Iprops)=>{
    const {data,queryString} = props
    const [form] = Form.useForm();
    const [loading,setLoading] = useState<boolean>(false)
    const [dataList, setDataList] = useState<ISemesterClass[]>([]);
    const router = useRouter();
    const expandedRowRender = () => { 
        const columns = [
          {
            title: 'Tên',
            dataIndex: 'name',
            width: '10%',
            editable: false,
          },
          {
            title: 'Lớp',
            dataIndex: 'classNumber',
            width: '5%',
            editable: false,
          },
          {
            title: 'Mô tả',
            dataIndex: 'describe',
            width: '8%',
            render: (text: string) => {
                let check
                if(text === "BT"){
                  check = "Bài tập"
                }else if(text === "LT"){
                  check = "Lý thuyết"
                } else{
                  check = "?"
                }
              return(
                <a style={{color:"blue"}}>{check}</a>
              )},
              editable: false,
          },
          {
            title: 'Phòng học',
            dataIndex: 'classroom',
            width: '8%',
            editable: false,
          },
          {
            title: 'Thứ',
            dataIndex: 'weekDay',
            width: '6%',
            editable: false,
          },
          {
            title: 'Ca vào',
            dataIndex: 'onShift',
            width: '7%',
            editable: false,
          },
          {
            title: 'Ca ra',
            dataIndex: 'endShift',
            width: '7%',
            editable: false,
          },
          {
            title: 'Sv max',
            dataIndex: 'numberStudent',
            width: '7%',
            editable: false,
          },
          {
            title: 'Sv tham gia',
            dataIndex: 'number',
            width: '9%',
            editable: false,
          },
          {
            title: 'Giảng viên',
            dataIndex: 'userName',
            render: (text: string) => {
              let check
              if(text){
                check = text
              }else{
                check = "Chưa có"
              }
            return(
              <a style={{color:"red"}}>{check}</a>
            )},
            width: '10%',
            editable: false,
          },
        ];
        return (
          <Form form={form} component={false} key={expandedRowKeys[0]}>
              <Table
                bordered
                dataSource={dataList}
                columns={columns}
                rowClassName="editable-row"
                rowKey={"semesterClass_Id"}
                pagination={false}
              />
          </Form>
        );
      };
    const columns = [
        { 
          key:"subjectCode",
          title: 'Mã môn', 
          dataIndex: 'subjectCode'
        },
        { 
          key:"subjectName",
          title: 'Tên môn', 
          dataIndex: 'subjectName'
        },
        { 
          key:"semesterName",
          title: 'Kì học', 
          dataIndex: 'semesterName',
          render: (text: string) => {
            let checked
            if(text === "K1N2"){
              checked = "Kì 1 nhóm 2"
            } else if (text === "K2N2") {
              checked = "Kì 2 nhóm 2"
            } else if (text === "K3N2"){
              checked = "Kì 3 nhóm 3"
            } else if (text === "K1N1"){
              checked = "Kì 1 nhóm 1"
            } else if (text === "K2N1"){
              checked = "Kì 2 nhóm 1"
            } else if (text === "K3N1"){
              checked = "Kì 3 nhóm 1"
            }
            return (
              <a style={{color:"black"}} >{checked}</a>
            )
          },
        },
        { 
          key:"createdAt",
          title: 'Lần cập nhật cuối', 
          dataIndex: 'createdAt',
          render: (text: string) => <a style={{color:"green"}}>{text}</a>,
        },
    ];
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const handleExpand = async (expanded :boolean, record :ISubjectSemester) => {
      setLoading(true)
        if (expanded) {
            const result = await SemesterClassSubject(record.semesterId,record.subjectId)
            if(result.statusCode === "200"){
              setExpandedRowKeys([record.semesterSubject_Id]);
              setDataList(result.data!)
            }
        } else {
            setExpandedRowKeys([]);
        }
      setLoading(false)
    };
    const fetchData = () => {
        router.push(`/check?${queryString}`)
    }
    useEffect(()=>{
        fetchData()
    },[queryString])
    return(
        <div>
            <Table
                columns={columns}
                expandable={{ expandedRowRender,onExpand:handleExpand,expandedRowKeys: expandedRowKeys }}
                dataSource={data}
                loading={loading}
                rowKey={"semesterSubject_Id"}
                pagination={false}
            />
        </div>
    )
}
export default CheckTable

