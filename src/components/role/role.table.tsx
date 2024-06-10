'use client'

import Form from "antd/es/form";
import Input from "antd/es/input/Input";
import Table, { TablePaginationConfig, TableProps } from "antd/es/table"
import Typography from "antd/es/typography";
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import PlusSquareOutlined from '@ant-design/icons/PlusSquareOutlined'
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, FormProps, GetProp, notification } from "antd";
import { CreateRole, DeleteRole, DeleteRolePermission, GetPermissionNotYetRole, GetRolePermission, UpdateRole } from "@/utils/action/action";
import ModalCreateRole from "./modal.create";
import { useSession } from "next-auth/react";
import ModalPermissions from "./modal.permission";
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType:'text';
  record: ISemesterClass;
  index: number;
  children: React.ReactNode;
}
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
    let inputNode = <Input />;
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
interface Iprops {
  roles:IRole[] | undefined,
  queryStringForm:string,
}
interface TableParams {
    pagination?: TablePaginationConfig;
    sortField?: string;
    sortOrder?: string;
    filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
  }
const RoleTable=(props: Iprops)=>{
    const {data:session} = useSession()
    const {roles,queryStringForm} = props
    const [form] = Form.useForm();
    const [loading,setLoading] = useState<boolean>(false)
    const [listPermission, setListPermission] = useState<IPermission[]>([]);
    const [queryString,setQueryString] = useState<string>(`current=1&pageSize=5`)
    const [editingKey, setEditingKey] = useState('');
    const [checkId,setCheckId] = useState<IRole>()
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isModalOpen_1, setIsModalOpen_1] = useState<boolean>(false);
    const [roleId,setRoleId] = useState<string>("")
    const [listPermission_1,setListPermission_1] = useState<IPermission[]>([])
    const router = useRouter();
    const isEditing = (record: IRole) => record.id === editingKey;
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
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
    const expandedRowRender = () => { 
      const columns = [
        {
          title: 'Tên',
          dataIndex: 'permissionName',
          render:(text:string) => <a style={{color:"blue",fontSize:16}}>{text}</a>,
        },
        {
          title: 'Đường dẫn',
          dataIndex: 'apiEndpoint',
          render:(text:string) => <a style={{fontSize:16,color:"#8B4513"}}>{text}</a>,
        },
        {
          title: 'Mô tả',
          dataIndex: 'description',
          render:(text:string) => <a style={{color:"green",fontSize:16}}>{text}</a>
        },
        {
          title: 'Lần cập nhật cuối',
          dataIndex: 'updatedAt',
          render:(text:string) => <a style={{fontSize:16}}>{text}</a>,
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IPermission) => {
            return(
              <DeleteOutlined style={{color:'red'}} onClick={()=>handleDeleteRolePermiss(record.id)}/>
            )
          },
        },
      ];
      return (
        <Form form={form} component={false}>
            <Table
              bordered
              dataSource={listPermission}
              columns={columns}
              rowKey={"id"}
              pagination={false}
            />
        </Form>
      );
    };
    const edit = (record: Partial<IRole> & { id: React.Key }) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id ?? "");
    };
    const cancel = () => {
    setEditingKey('');
    };
    const save = async (key: React.Key) => {
        setLoading(true)
        const row = (await form.validateFields()) as IRole;
        const result = await UpdateRole(key as string,row.roleName,row.creatorName)
        if(result.statusCode === "200")
        {
        notification.success({
            message:"Thành công!!!",
            description: "Cập nhật thành công",
            duration:1,
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
        setLoading(false)
    };
    const columns = [
        { 
          title: 'Tên', 
          dataIndex: 'roleName',
          render:(text:string) => <a style={{color:"orange",fontSize:17}}>{text}</a>,
          editable: true,
        },
        { 
          title: 'Người tạo', 
          dataIndex: 'creatorName',
          editable: true,
          render:(text:string) => <a style={{fontSize:16}}>{text}</a>
        },
        { 
          title: 'Giờ cập nhật', 
          dataIndex: 'updateHours',
          render:(text:string) => <a style={{color:"red",fontSize:16}}>{text}</a>
        },
        { 
            title: 'Giờ ngày cập nhật', 
            dataIndex: 'updateDay',
            render:(text:string) => <a style={{color:"green",fontSize:16}}>{text}</a>
        },
        {
            title: 'Cập nhật',
            dataIndex: 'operation',
            render: (_: any, record: IRole) => {
              const editable = isEditing(record);
              return editable ? (
                <div style={{display:'flex',gap:4}}>
                  <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
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
          },
        { 
          title: 'Thêm quyền', 
          render: (_: any, record: IRole) => {
            return(
              <PlusSquareOutlined onClick={()=>showModal_1(record.id)}/>
            )
          },
        },
        {
          title: 'Xóa',
          dataIndex: 'delete',
          render: (_: any, record: IRole) => {
            return(
              <DeleteOutlined onClick={()=>handleDeleteRole(record.id)}/>
            )
          },
        },
    ];
    const mergedColumns: TableProps['columns'] = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record: IRole) => {
            return {
              record,
              inputType: "text",
              dataIndex: col.dataIndex,
              title: col.title,
              editing: isEditing(record),
            }
          },
        };
      });
    
    const handleExpand = async (expanded :boolean, record :IRole) => {
      setCheckId(record)
      setLoading(true)
        if (expanded) {
            const result = await GetRolePermission(record.id)
            if(result.statusCode === "200"){
              setExpandedRowKeys([record.id]);
              setListPermission(result.data ?? [])
            }
        } else {
            setExpandedRowKeys([]);
        }
      setLoading(false)
    };
    const fetchData = () => {
        if(queryStringForm){
          router.push(`/role?${queryString}&${queryStringForm}`)
        }else{
          router.push(`/role?${queryString}`)
        }
    }
    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const showModal_1 = async(id:string) => {
      setRoleId(id)
      const result = await GetPermissionNotYetRole(id)
      if(result.statusCode === "200"){
        setListPermission_1(result.data ?? [])
      }
      setIsModalOpen_1(true);
    };
    const handleCancel_1 = () => {
      setListPermission_1([])
      setIsModalOpen_1(false);
    };
    const onFinish: FormProps<ICreateRole>["onFinish"] = async (values) => {
      setLoading(true)
      const result = await CreateRole(values.roleName,session?.user.userName ?? "")
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
    const handleDeleteRole=async(id:string)=>{
      setLoading(true)
      const result = await DeleteRole(id)
      if(result.statusCode === "200"){
        notification.success({
          message:"Delete success!!!",
          description:"Xóa thành công!!!",
          duration:2
        })
      }else{
        notification.error({
          message:"Delete failed!!!",
          description:"Xóa không thành công!!!",
          duration:2
        })
      }
      setLoading(false)
    }
    const handleDeleteRolePermiss=async(id:string)=>{
       const result = await DeleteRolePermission(checkId?.id ?? '',id)
       if(result.statusCode === "200"){
        notification.success({
          message:"Delete success!!!",
          description:"Xóa thành công!!!",
          duration:1
        })
        handleExpand(true,checkId!)
       }else{
        notification.error({
          message:"Delete error!!!",
          description:"Xóa không thành công!!!",
          duration:1
        })
       }
    }
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
                columns={mergedColumns}
                expandable={{ expandedRowRender,onExpand:handleExpand,expandedRowKeys: expandedRowKeys }}
                dataSource={roles}
                rowClassName="editable-row"
                loading={loading}
                rowKey={"id"}
                pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100 }}
                onChange={handleTableChange}
            />
            </Form>
            <ModalCreateRole
              handleCancel={handleCancel}
              handleOk={onFinish}
              isModalOpen={isModalOpen}
              loading={loading}
            />
            <ModalPermissions
              handleCancel={handleCancel_1}
              isModalOpen={isModalOpen_1}
              permissions={listPermission_1}
              setIsModalOpen={setIsModalOpen_1}
              setListPermission={setListPermission_1}
              roleId={roleId}
            />
        </div>
    )
}
export default RoleTable

