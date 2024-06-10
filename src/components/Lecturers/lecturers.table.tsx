'use client'

import Form from "antd/es/form"
import Table, { TablePaginationConfig } from "antd/es/table"
import React, { useEffect, useState } from 'react';
import { Button, FormProps, GetProp, Select, Typography, notification, theme, type TableProps } from 'antd';
import EditOutlined from '@ant-design/icons/EditOutlined'
import SearchOutlined from '@ant-design/icons/SearchOutlined'
import Input from "antd/es/input/Input";
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import { CreateUser, DeleteUser, GetAllRoles, GetUserSubjects, UpdateUser } from "@/utils/action/action";
import ModalUser from "./modal.user";
import DrawerSubject from "./drawer.subject";
import DrawerClass from "./drawer.class";
import { useRouter } from "next/navigation";
import { LabeledValue } from "antd/es/select";

interface IProps{
  users : IUser[],
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

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
}
const LecturersTable=(props :IProps)=>{
    const {users,queryStringForm} = props
    const [form] = Form.useForm();
    const router = useRouter();
    const [loading,setLoading] = useState(false)
    const [userId,setUserId] = useState<string>("")
    const [userName,setUserName] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingKey, setEditingKey] = useState('');
    const [openDrawerSubject, setOpenDrawerSubject] = useState(false);
    const [openDrawerClass, setOpenDrawerClass] = useState(false);
    const [data,setData] = useState<ISemesterSubject_1[]>([])
    const [listRoles,setListRoles] = useState<LabeledValue[]>([])
    const [queryString,setQueryString] = useState<string>(`current=1&pageSize=5`)
    const [tableParams, setTableParams] = useState<TableParams>({
      pagination: {
        current: 1,
        pageSize: 5,
      },
      sortField:"",
      sortOrder:""
    });
    const handleRoles= async()=>{
          const result = await GetAllRoles()
          if(result.statusCode === "200"){
            const convertedData = result.data!.map(item => ({
              value: item.roleName,
              label: item.roleName
          }));
          setListRoles(convertedData)
          }
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
              { value: 'KTT', label: 'Khoa toán tin' },
              { value: 'KKT', label: 'Khoa kinh tế' },
              { value: 'KNN', label: 'Khoa ngôn ngữ' },
              { value: 'KTNDS', label: 'Khoa tài năng và đời sống' },
              { value: 'KTDTT', label: 'Khoa thể dục và thể thao' },
              { value: 'KTH', label: 'Khoa toán học' }
            ]}
          />
        );
      } else if (inputType === 'select1'){
        inputNode = (
          <Select
            options={listRoles}
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
        await router.push(`/lecturers?${queryString}&${queryStringForm}`)
      }else{
        await router.push(`/lecturers?${queryString}`)
      }
      setLoading(false)
    }
    const handleData = async (id:string) => {
      try {
        const result = await GetUserSubjects(id)
        console.log(result)
        if(result.statusCode === "200"){
            setData(result.data ?? [])
        }
      } catch (error) {
        notification.error({
          message:"Thất bại!!!",
          description:"Bạn không có quyền!!!",
          duration:2
        })
      }
        
    }
    const showDrawerSubject = async (id :string,userName: string) => {
      setOpenDrawerSubject(true);
      setUserId(id)
      setUserName(userName)
      await handleData(id)
    };

    const onCloseDrawerSubject = () => {
      setOpenDrawerSubject(false);
      setUserId("")
      setUserName("")
      setData([])
    };
    const showDrawerClass = async (id :string,userName: string) => {
      setOpenDrawerClass(true);
      setUserId(id)
      setUserName(userName)
    };

    const onCloseDrawerClass = () => {
      setOpenDrawerClass(false);
      setUserId("")
      setUserName("")
    };
    const showModal = () => {
      setIsModalOpen(true);
    };
    const onFinish: FormProps<ICreateUser>["onFinish"] = async (values) => {
      setLoading(true)
      const result = await CreateUser(values)
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
      setIsModalOpen(false);
      setLoading(false)
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const handleDeleteSubject = async (userId :string) => {
        setLoading(true)
        const result = await DeleteUser(userId)
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
        setLoading(false)
    }
    const isEditing = (record: IUser) => record.userId === editingKey;
  
    const edit = (record: Partial<IUser> & { userId: React.Key }) => {
      form.setFieldsValue({ ...record });
      setEditingKey(record.userId ?? '');
    };
  
    const cancel = () => {
      setEditingKey('');
    };
  
    const save = async (key: React.Key) => {
      try {
        const row = (await form.validateFields()) as IUser;
        setLoading(true)
        const result = await UpdateUser(key.toString(),row)
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
        setLoading(false)
        setEditingKey('');
      } catch (errInfo) {
        console.log('Validate Failed:', errInfo);
      }
    };
  
    const columns = [
      {
        title: 'Tên',
        dataIndex: 'name',
        width: '12%',
        editable: true,
      },
      {
        title: 'Biệt danh',
        dataIndex: 'userName',
        width: '12%',
        editable: true,
      },
      {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        editable: true,
      },
      {
        title: 'Mật khẩu',
        dataIndex: 'password',
        width: '10%',
        editable: true,
      },
      {
        title: 'Chức vụ',
        dataIndex: 'role',
        render: (text: string) => {
          return (
            <a style={{ color: "black" }}>{text}</a>
          );
        },   
        width: '10%',
        editable: true,
      },
      {
        title: 'Khoa',
        dataIndex: 'departmentName',
        render: (text: string) => {
          let checked;
          switch (text) {
            case 'KTT':
              checked = 'Khoa toán tin';
              break;
            case 'KKT':
              checked = 'Khoa kinh tế';
              break;
            case 'KNN':
              checked = 'Khoa ngôn ngữ';
              break;
            case 'KTNDS':
              checked = 'Khoa tài năng và đời sống';
              break;
            case 'KTDTT':
              checked = 'Khoa thể dục và thể thao';
              break;
            case 'KTH':
              checked = 'Khoa toán học';
              break;
            default:
              checked = '';
              break;
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
        render: (_: any, record: IUser) => {
          const editable = isEditing(record);
          return editable ? (
            <div style={{display:'flex',gap:7,cursor:'pointer'}}>
              <div onClick={() => save(record.userId)} style={{ marginRight: 8 }}>
                Lưu
              </div>
              <div  onClick={cancel}>
                <a>Hủy</a>
              </div>
            </div>
          ) : (
            <Typography.Link disabled={editingKey !== ''} onClick={() =>{ edit(record);handleRoles()}}>
               <EditOutlined />
            </Typography.Link>
          );
        },
      },
      {
        title: 'Xóa',
        dataIndex: 'delete',
        render: (_: any, record: IUser) => {
          return(
            <DeleteOutlined onClick={()=>handleDeleteSubject(record.userId)}/>
          )
        },
        width:"6%"
      },
      {
        title: 'Môn',
        dataIndex: 'check',
        render: (_: any, record: IUser) => {
          return(
            <SearchOutlined onClick={()=>showDrawerSubject(record.userId,record.userName)}/>
          )
        },
        width:"4%"
      },
      {
        title: 'Lớp',
        dataIndex: 'check',
        render: (_: any, record: IUser) => {
          return(
            <SearchOutlined onClick={()=>showDrawerClass(record.userId,record.userName)}/>
          )
        },
        width:"4%"
      },
    ];
    const mergedColumns: TableProps['columns'] = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: IUser) => {
          let inputNode;
          if (col.dataIndex === 'departmentName') {
            inputNode = "select";
          } else if (col.dataIndex === 'role'){
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
                rowKey={"userId"}
                bordered={false}
                loading={loading}
                dataSource={users}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100 }}
                onChange={handleTableChange}
            />
        </Form>
        <ModalUser
           isModalOpen={isModalOpen}
           loading={loading}
           handleCancel={handleCancel}
           handleOk={onFinish}
        />
      <DrawerSubject 
            open={openDrawerSubject} 
            onClose={onCloseDrawerSubject}
            userId={userId}
            userName={userName}
            data={data}
            handleData={handleData}
            />
      <DrawerClass
            open={openDrawerClass}
            onClose={onCloseDrawerClass}
            userName={userName}
            userId={userId}
      />
      </div>
    )
}
export default LecturersTable