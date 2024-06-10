'use client'

import Form from "antd/es/form"
import Table, { TablePaginationConfig } from "antd/es/table"
import React, { useEffect, useState } from 'react';
import { Button, FormProps, GetProp, Select, Typography, notification, theme, type TableProps } from 'antd';
import EditOutlined from '@ant-design/icons/EditOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import Input from "antd/es/input/Input";
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import { useRouter } from "next/navigation";
import { CreateStudent, DeleteStudent, UpdateStudent } from "@/utils/action/action";
import ModalStudent from "./modal.student";
import DrawerSubject from "./drawer.subject";

interface IProps{
  students : IStudent[],
  queryStringForm:string,
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'text' | 'select' | 'select1';
  record: IUser;
  index: number;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
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
  if (inputType === 'text') {
    inputNode = <Input />;
  } else if (inputType === 'select') {
    inputNode = (
      <Select
        options={[
            { value: 'TI', label: 'Khoa học và máy tính' },
            { value: 'CNTT', label: 'Công nghệ thông tin' },
            { value: 'KTQT', label: 'Kinh tế quốc tế' },
            { value: 'NNH', label: 'Ngôn ngữ hàn' },
        ]}
      />
    );
  } else if (inputType === 'select1'){
    inputNode = (
      <Select
        options={[
          { value: 'BT', label: 'Bình thường' },
          { value: 'TH', label: 'Thôi học' },
          { value: 'RT', label: 'Ra trường' },
        ]}
      />
    );
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
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}
const StudentTable=(props :IProps)=>{
    const {students,queryStringForm} = props
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading,setLoading] = useState(false)
    const [studentId,setStudentId] = useState<string>("")
    const [userName,setUserName] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingKey, setEditingKey] = useState('');
    const [openDrawerSubject, setOpenDrawerSubject] = useState(false);
    const [queryString,setQueryString] = useState<string>(`current=1&pageSize=5`)
    const [tableParams, setTableParams] = useState<TableParams>({
      pagination: {
        current: 1,
        pageSize: 5,
      },
      sortField:"",
      sortOrder:""
    });
    const handleTableChange: TableProps['onChange'] = (pagination, _ , sorter :any) => {
      setTableParams({
        pagination,
        sortOrder:sorter.order,
        sortField:sorter.field
      });
      let queryString = '';
      if (pagination.current !== undefined) queryString += `current=${pagination.current}&`;
      if (pagination.pageSize !== undefined) queryString += `pageSize=${pagination.pageSize}&`;
      if (sorter.order) queryString += `order=${sorter.order}&`;
      if (sorter.field) queryString += `field=${sorter.field}&`;
        if (queryString !== '' && queryString.endsWith('&')) {
          queryString = queryString.slice(0, -1);
        }
      setQueryString(queryString)
    };
    const fetchData = async () => {
      setLoading(true)
      if(queryStringForm){
        await router.push(`/student?${queryString}&${queryStringForm}`)
      }else{
        await router.push(`/student?${queryString}`)
      }
      setLoading(false)
    }
    const showDrawerSubject = async (id :string,userName: string) => {
      setOpenDrawerSubject(true);
      setStudentId(id)
      setUserName(userName)
    };
    const onCloseDrawerSubject = () => {
      setOpenDrawerSubject(false);
      setStudentId("")
      setUserName("")
    };
    const showModal = () => {
      setIsModalOpen(true);
    };
    const onFinish: FormProps<ICreateStudent>["onFinish"] = async (values) => {
      setLoading(true)
      try {
        const result = await CreateStudent(values)
      if(result.statusCode === "200"){
        notification.success({
          message:"Create success!!!",
          description:"Tạo mới thành công!!!",
          duration:2
        })
      }else{
        notification.error({
          message:"Create failed!!!",
          description:"Tạo mới không thành công!!!",
          duration:2
        })
      }
      } catch (error) {
        notification.error({
          message:"Failed!!!",
          description:"Bạn không có quyền tạo mới!!!",
          duration:2
        })
      }
      setIsModalOpen(false);
      setLoading(false)
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const handleDeleteSubject = async (studentId :string) => {
        setLoading(true)
        try{
          const result = await DeleteStudent(studentId)
          if(result.statusCode === "200"){
            notification.success({
              message:"Delete!!!",
              description:"Xóa thành công!!!",
              duration:2
            })
          }else{
            notification.error({
              message:"Delete!!!",
              description:"Xóa không thành công!!!",
              duration:2
            })
          }
        }catch(error){
          notification.error({
            message:"Failed!!!",
            description:"Bạn không có quyền xóa!!!",
            duration:2
          })
        }
        setLoading(false)
    }
    const isEditing = (record: IStudent) => record.studentId === editingKey;
  
    const edit = (record: Partial<IStudent> & { studentId: React.Key }) => {
      form.setFieldsValue({ ...record });
      setEditingKey(record.studentId ?? '');
    };
  
    const cancel = () => {
      setEditingKey('');
    };
  
    const save = async (key: React.Key) => {
      try {
        const row = (await form.validateFields()) as IStudent;
        setLoading(true)
        try {
          const result = await UpdateStudent(key.toString(),row)
          if(result.statusCode === "200"){
            notification.success({
              message:"Update!!!",
              description:"Cập nhật thành công!!!",
              duration:2
            })
          }else{
            notification.error({
              message:"Update!!!",
              description:"Cập nhật không thành công!!!",
              duration:2
            })
          }
        } catch (error) {
          notification.error({
            message:"Failed!!!",
            description:"Bạn không có quyền cập nhật!!!",
            duration:2
          })
        }
        
        setLoading(false)
        setEditingKey('');
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };
  
    const columns = [
      {
        title: 'Tên',
        dataIndex: 'userName',
        width: '12%',
        editable: true,
        sorter: (a :IStudent, b :IStudent) => 0,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        editable: true,
        sorter: (a :IStudent, b :IStudent) => 0,
      },
      {
        title: 'Mật khẩu',
        dataIndex: 'password',
        width: '10%',
        editable: true,
      },
      {
        title: 'Số tín',
        dataIndex: 'numberOfCredits',
        width: '10%',
        editable: false,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        render: (text: string) => {
          let checked;
          switch (text) {
            case 'BT':
              checked = 'Bình thường';
              break;
            case 'TH':
              checked = 'Thôi học';
              break;
            case 'RT':
              checked = 'Ra trường';
              break;
            default:
              checked = '';
              break;
          }
          return (
            <a style={{ color: "black" }}>{checked}</a>
          );
        },   
        width: '10%',
        editable: true,
      },
      {
        title: 'Khoa',
        dataIndex: 'majorsCode',
        render: (text: string) => {
          let checked;
          if(text === "TI"){
            checked = "Khoa học máy tính"
          } else if (text === "CNTT") {
            checked = "Công nghệ thông tin"
          } else if (text === "KTQT"){
            checked = "Kinh tế quốc tế"
          } else if (text === "NNH"){
            checked = "Ngôn ngữ hàn"
          }
          return (
            <a style={{ color: "black" }}>{checked}</a>
          );
        },        
        width: '15%',
        editable: true,
      },
      {
        title: 'Sửa',
        dataIndex: 'operation',
        render: (_: any, record: IStudent) => {
          const editable = isEditing(record);
          return editable ? (
            <div style={{display:'flex',gap:7,cursor:'pointer'}}>
              <div onClick={() => save(record.studentId)} style={{ marginRight: 8 }}>
                Lưu
              </div>
              <div  onClick={cancel}>
                <a>Hủy</a>
              </div>
            </div>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
               <EditOutlined />
            </Typography.Link>
          );
        },
      },
      {
        title: 'Xóa',
        dataIndex: 'delete',
        render: (_: any, record: IStudent) => {
          return(
            <DeleteOutlined onClick={()=>handleDeleteSubject(record.studentId)}/>
          )
        },
        width:"6%"
      },
      {
        title: 'Môn',
        dataIndex: 'check',
        render: (_: any, record: IStudent) => {
          return(
            <SearchOutlined 
            onClick={()=>showDrawerSubject(record.studentId,record.userName)}
            />
          )
        },
        width:"4%"
      }
    ];
    const mergedColumns: TableProps['columns'] = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: IStudent) => {
          let inputNode;
          if (col.dataIndex === 'majorsCode') {
            inputNode = "select";
          } else if (col.dataIndex === 'status'){
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
    useEffect(()=>{
      fetchData() 
     },[JSON.stringify(tableParams),queryStringForm])
    return(
      <div style={{margin:"0 35px 0 20px"}}>
        <div style={{display:'flex',justifyContent:"end",margin:"0 0px 10px 0",paddingTop:10}}>
          <Button type="default" onClick={showModal}>Tạo mới</Button>
        </div>
        <Form form={form} component={false}>
            <Table
                components={{
                body: {
                    cell: EditableCell,
                },
                }}
                rowKey={"studentId"}
                bordered={false}
                loading={loading}
                dataSource={students}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100 }}
                onChange={handleTableChange}
            />
        </Form>
        <ModalStudent
           isModalOpen={isModalOpen}
           loading={loading}
           handleCancel={handleCancel}
           handleOk={onFinish}
        />
        <DrawerSubject
          onClose={onCloseDrawerSubject}
          open={openDrawerSubject}
          studentId={studentId}
          userName={userName}
        />
      </div>
    )
}
export default StudentTable