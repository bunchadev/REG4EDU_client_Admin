'use client'

import { CreateNotification, CreateSemesterClass, CreateSemesterSubject, DeleteSemesterClass, DeleteSemesterSubject, GetAllUsers, GetClassGroupWithSubject, GetSemester, SemesterClassSubject, UpdateSemesterClass } from "@/utils/action/action";
import Form, { FormProps } from "antd/es/form";
import InputNumber from "antd/es/input-number";
import Input from "antd/es/input/Input";
import Table, { TableProps } from "antd/es/table"
import Typography from "antd/es/typography";
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined'
import HighlightOutlined from '@ant-design/icons/HighlightOutlined'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "antd/es/button";
import theme from "antd/es/theme";
import Checkbox from "antd/es/checkbox";
import { Divider, Select, message, notification } from "antd";
import RegisterModal from "./register.modal";
import DrawerClass from "./drawer.class";
import { LabeledValue } from "antd/es/select";
import { useSession } from "next-auth/react";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'select1';
  record: ISemesterClass;
  index: number;
  children: React.ReactNode;
}
interface Iprops {
  data:ISubjectSemester[],
  queryString:string,
  checkAdd:boolean,
  dataAdd:ISemesterSubject_1[],
  semester:string,
  setCheckAdd:(v: boolean) => void,
}
const RegisterTable=(props: Iprops)=>{
    const {data:session} = useSession()
    const {
       token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const {data,queryString,checkAdd,dataAdd,semester,setCheckAdd} = props
    const [form] = Form.useForm();
    const [loading,setLoading] = useState<boolean>(false)
    const [dataList, setDataList] = useState<ISemesterClass[]>([]);
    const [editingKey, setEditingKey] = useState('');
    const [dataAdd_1,setDataAdd_1] = useState<string[]>([])
    const [data_2,setData_2] = useState<IClass_1[]>([])
    const [users,setUsers] = useState<LabeledValue[]>([])
    const router = useRouter();
    const isEditing = (record: ISemesterClass) => record.semesterClass_Id === editingKey;
    const [checkId,setCheckId] = useState<ISubjectSemester>()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectId,setSubjectId] = useState<string>("")
    const [subjectId_1,setSubjectId_1] = useState<string>("")
    const [subjectName,setSubjectName] = useState<string>("")
    const [openDrawerClass, setOpenDrawerClass] = useState(false);
    const [semesterId,setSemesterId] = useState<string>("")
    const handleData = async (id:string) => {
      const res = await GetSemester(semester)
      if(res.statusCode === "200"){
        setSemesterId(res.data?.semesterId ?? '')
        const result = await GetClassGroupWithSubject(id,res.data?.semesterId ?? "")
        if(result.statusCode === "200"){
            setData_2(result.data ?? [])
        }
      }
  }
  const showDrawerClass = async (id :string,subjectName: string) => {
    await handleData(id)
    setSubjectId_1(id)
    setSubjectName(subjectName)
    setOpenDrawerClass(true);
  };

  const onCloseDrawerClass = () => {
    setOpenDrawerClass(false);
    setSubjectId_1("")
    setSubjectName("")
    setData_2([])
  };
    const onFinish: FormProps<ICreateSubject>["onFinish"] = async (values:any) => {
      setLoading(true)
      const result = await CreateSemesterClass(semester,subjectId,values)
      if(result.statusCode === "200"){
        notification.success({
          message:"Thành công!!!",
          description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
          duration:2,
          placement:"topRight"
       })
      }else{
        notification.error({
          message:"Thất bại!!!",
          description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
          duration:2,
          placement:"topRight"
       })
      }
      setIsModalOpen(false);
      setLoading(false)
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const EditableCell: React.FC<EditableCellProps> = ({
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    }) => {
      let inputNode
      if (inputType === 'number') {
        inputNode = <InputNumber />;
      } else if (inputType === 'select1') {
        inputNode = (
          <Select
            defaultValue={"none"}
            options={users}
          />
        );
      }
      else {
        inputNode = <Input />;
      }
      return (
        <td {...restProps}>
          {editing ? (
            <Form.Item
              name={dataIndex}
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ]}
            >
              {inputNode}
            </Form.Item>
          ) : (
            children
          )}
        </td>
      );
    };
    const expandedRowRender = () => { 
      const edit = (record: Partial<ISemesterClass> & { semesterClass_Id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.semesterClass_Id ?? "");
      };
      const cancel = () => {
        setEditingKey('');
      };
      const save = async (key: React.Key) => {
        try {
          const row = (await form.validateFields()) as ISemesterClass;
          const semesterClass = dataList.find(k=>k.semesterClass_Id === key)
          if(row.userName !== "none" && semesterClass?.userName && row.userName !== semesterClass?.userName){
            await CreateNotification(semester,row.userName,session?.user.userName ?? '',
            `Đã ép cứng bạn vào lớp .${row.classNumber} môn ${row.name} thứ ${row.weekDay} ca(${row.onShift}->${row.endShift})`)
            await CreateNotification(semester,semesterClass?.userName,session?.user.userName ?? '',
            `Đã đá bạn ra khỏi lớp .${row.classNumber} môn ${row.name} thứ ${row.weekDay} ca(${row.onShift}->${row.endShift})`)
          }else if (row.userName !== "none" && semesterClass?.userName === null){
            await CreateNotification(semester,row.userName,session?.user.userName ?? '',
            `Đã ép cứng bạn vào lớp .${row.classNumber} môn ${row.name} thứ ${row.weekDay} ca(${row.onShift}->${row.endShift})`)
          }else if (row.userName === "none" && semesterClass?.userName){
            await CreateNotification(semester,semesterClass?.userName,session?.user.userName ?? '',
            `Đã đá bạn khỏi lớp .${row.classNumber} môn ${row.name} thứ ${row.weekDay} ca(${row.onShift}->${row.endShift})`)
          }
          const result = await UpdateSemesterClass(key as string,row)
          if(result.statusCode === "200")
          {
            notification.success({
                message:"Thành công!!!",
                description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
                duration:2,
                placement:"topRight"
             })
            handleExpand(true,checkId!)
          }else if(result.statusCode === "400"){
            notification.error({
              message:"Thất bại!!!",
              description: result.message + ` ${result.subjectName ?? result.subjectName ?? ""}`,
              duration:5,
              placement:"topRight"
           })
          }else{
            notification.error({
              message:"Thất bại!!!",
              description: "Cập nhật thất bại",
              duration:2,
              placement:"topRight"
           })
          }
          setEditingKey('');
        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }
      };
      const columns = [
        {
          title: 'Tên',
          dataIndex: 'name',
          width: '10%',
          editable: true,
          render:(text:string) => <a style={{color:"blue"}}>{text}</a>
        },
        {
          title: 'Lớp',
          dataIndex: 'classNumber',
          width: '5%',
          editable: true,
        },
        {
          title: 'Phòng học',
          dataIndex: 'classroom',
          width: '8%',
          editable: true,
          render:(text:string) => <a style={{color:"green"}}>{text}</a>
        },
        {
          title: 'Thứ',
          dataIndex: 'weekDay',
          width: '6%',
          editable: true,
        },
        {
          title: 'Ca vào',
          dataIndex: 'onShift',
          width: '7%',
          editable: true,
        },
        {
          title: 'Ca ra',
          dataIndex: 'endShift',
          width: '7%',
          editable: true,
        },
        {
          title: 'Sv max',
          dataIndex: 'numberStudent',
          width: '7%',
          editable: true,
          render:(text:string) => <a style={{color:"orange"}}>{text}</a>
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
          editable: true,
        },
        {
          title: 'Cập nhật',
          dataIndex: 'operation',
          render: (_: any, record: ISemesterClass) => {
            const editable = isEditing(record);
            return editable ? (
              <div style={{display:'flex',gap:4}}>
                <Typography.Link onClick={() => save(record.semesterClass_Id)} style={{ marginRight: 8 }}>
                  Lưu
                </Typography.Link>
                <div onClick={cancel}>
                  <a>Hủy</a>
                </div>
              </div>
            ) : (
              <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                <EditOutlined />
              </Typography.Link>
            );
          },
          width:'8%'
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: ISemesterClass) => {
            return(
              <DeleteOutlined onClick={()=>handleDeleteSemesterClass(record)}/>
            )
          },
          width:"6%"
        },
      ];
      const mergedColumns: TableProps['columns'] = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: ISemesterClass) => {
            let inputNode;
            if (col.dataIndex === 'classNumber' || col.dataIndex === "weekDay" || col.dataIndex === "onShift" || col.dataIndex === "endShift" || col.dataIndex === "numberStudent") {
              inputNode = "number";
            } else if (col.dataIndex === 'userName'){
              inputNode = "select1";
            } else {
              inputNode = "text";
            }
            return {
              record,
              inputType: inputNode,
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
            }
          },
        };
      });
      return (
        <Form form={form} component={false} key={expandedRowKeys[0]}>
            <Table
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={dataList}
              columns={mergedColumns}
              rowClassName="editable-row"
              rowKey={"semesterClass_Id"}
              pagination={false}
            />
        </Form>
      );
    };
    const handleDeleteSemesterClass = async (values :ISemesterClass) => {
        const result = await DeleteSemesterClass(values.semesterClass_Id)
        if(result.statusCode === "200"){
          handleExpand(true,checkId!)
          if(values.userName){
            const res = await CreateNotification(semester,values.userName,session?.user.userName ?? '',
              `Đã hủy lớp .${values.classNumber} môn ${values.name} thứ ${values.weekDay} ca(${values.onShift}->${values.endShift})`
            )
            if(res.statusCode === "200"){
              message.success("hihihi")
            }
          }
        }
    }
    const columns = [
        { 
          key:"subjectCode",
          title: 'Mã môn', 
          dataIndex: 'subjectCode',
          render:(text:string) => <a style={{color:"blue"}}>{text}</a>
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
              <a style={{color:"blueviolet"}} >{checked}</a>
            )
          },
        },
        { 
          key:"createdAt",
          title: 'Lần cập nhật cuối', 
          dataIndex: 'createdAt',
          render:(text:string) => <a style={{color:"green"}}>{text}</a>
        },
        { 
          key:"hihi",
          title: 'Ép cứng', 
          render: (_: any, record: ISubjectSemester) => {
            return(
              <HighlightOutlined 
                onClick={()=>showDrawerClass(record.subjectId,record.subjectName)}
              />
            )
          },
        },
        { 
          title: 'Thêm lớp', 
          render: (_: any, record: ISubjectSemester) => {
            return(
              <PlusSquareOutlined style={{color:"red"}} onClick={()=>{setIsModalOpen(true);setSubjectId(record.subjectId)}}/>
            )
          },
          width:"10%"
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: ISubjectSemester) => {
            return(
              <DeleteOutlined onClick={()=>handleDeleteSemesterSubject(record.semesterSubject_Id)}/>
            )
          },
          width:"6%"
        },
    ];
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const handleExpand = async (expanded :boolean, record :ISubjectSemester) => {
      setCheckId(record)
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
        router.push(`/register?${queryString}`)
    }
    const onChange = (e :boolean,item :ISemesterSubject_1) => {
      if (e === true) {
        if (!dataAdd_1.includes(item.subjectId)) {
            setDataAdd_1(prevData => [...prevData, item.subjectId]);
        }
      } else if (e === false) {
          setDataAdd_1(prevData => prevData.filter(id => id !== item.subjectId));
      }
    };
    const handleAddDataWithFetch = async ()=>{
      if(dataAdd_1.length > 0){
        setLoading(true)
        const result = await CreateSemesterSubject(dataAdd_1,semester)
        if(result.statusCode === "200"){
          notification.success({
            message:"Add success!!!",
            description:"Thêm mới thành công!!!",
            duration:2
          })
          setCheckAdd(false)
        }
        setDataAdd_1([])
        setLoading(false)
      }else{
        notification.error({
          message:"Error add!!!",
          description:"Chưa có môn nào được chọn!!!",
          duration:2
        })
      }
    }
    const handleDeleteSemesterSubject = async (id:string)=>{
      setLoading(true)
      const result = await DeleteSemesterSubject(id)
      if(result.statusCode === "200"){
        notification.success({
          message:"Xóa success!!!",
          description:"Xóa thành công!!!",
          duration:2
        })
      }
      setLoading(false)
    }
    const handleGetAllUser = async () => {
      const result = await GetAllUsers()
      if(result.statusCode === "200"){
        const convertedData = result.data!.map(item => ({
          value: item.userName,
          label: item.userName
      }));
      convertedData.unshift({ value: "none", label: "Chưa có" });
      setUsers(convertedData)
      }
    }
    useEffect(()=>{
        handleGetAllUser()
        fetchData()
    },[queryString])
    return(
        <div>
          {
            checkAdd 
            ?
            <div style={{
                background:colorBgContainer,
                borderRadius:borderRadiusLG,margin:'10px 0 10px 0',
                padding:'20px 0 10px 0',
              }}>
                <div style={{display:'flex',justifyContent:"space-between",gap:10}}>
                  <div style={{margin:"8px 0 0 16px",fontSize:17,fontStyle:"normal",opacity:0.9}}>Các môn chưa có trong kì</div>
                  <div style={{marginRight:30,display:'flex',gap:8}}>
                      <Button type="primary" onClick={handleAddDataWithFetch}>Thêm mới</Button>
                  </div>
                </div>
                <div style={{margin:"-10px 20px 0px 16px"}}>
                  <Divider />
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:13}}>
                {dataAdd.map((item,index)=>{
                  return(
                    <div key={index} style={{
                       display:'flex',
                       gap:15,
                       margin:'-10px 0px 0px 30px'
                    }}>
                       <Checkbox onChange={(e)=>onChange(e.target.checked,item)}/>
                       <div style={{fontSize:16,fontStyle:'italic',color:"red"}}>{item.subjectName}</div>
                    </div>
                  )
                })}
                </div>
            </div>
            :
            <></>
          } 
            <Table
                columns={columns}
                expandable={{ expandedRowRender,onExpand:handleExpand,expandedRowKeys: expandedRowKeys }}
                dataSource={data}
                loading={loading}
                rowKey={"semesterSubject_Id"}
                pagination={false}
            />
            <RegisterModal 
              loading={loading}
              isModalOpen={isModalOpen}
              handleOk={onFinish}
              handleCancel={handleCancel}
            />
            <DrawerClass
              data={data_2}
              onClose={onCloseDrawerClass}
              open={openDrawerClass}
              subjectName={subjectName}
              subjectId={subjectId_1}
              semesterId={semesterId}
            />
        </div>
    )
}
export default RegisterTable

