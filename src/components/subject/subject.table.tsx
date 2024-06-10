'use client'
import React, { use, useEffect, useState } from 'react';
import Input from 'antd/es/input/Input';
import InputNumber from 'antd/es/input-number';
import Form, { FormProps } from 'antd/es/form';
import Typography from 'antd/es/typography';
import Table, { TableProps } from 'antd/es/table';
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import RedoOutlined from '@ant-design/icons/RedoOutlined'
import EditOutlined from '@ant-design/icons/EditOutlined'
import './subjectable.css'
import { CreateSubject, DeleteSubject, UpdateSubject } from '@/utils/action/action';
import { Button, GetProp, Select, notification, theme } from 'antd';
import { TablePaginationConfig, TableRowSelection } from 'antd/es/table/interface';
import ModalCreateSubject from './modal.subject';
import { useRouter } from 'next/navigation';
import { json } from 'stream/consumers';
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text' | 'select1' | 'select2';
  record: ISubject;
  index: number;
  children: React.ReactNode;
}
interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Parameters<GetProp<TableProps, 'onChange'>>[1];
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
  let inputNode
  if (inputType === 'number') {
    inputNode = <InputNumber />;
  } else if (inputType === 'select1') {
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
  } else if (inputType === "select2"){
    inputNode = (
      <Select
        options={[
          { value: 'NN', label: 'Ngôn ngữ' },
          { value: 'TT', label: 'Thể dục' },
          { value: 'TA', label: 'Tiếng anh' },
          { value: 'CN', label: 'Chuyên ngành'},
          { value: 'TD', label: 'Tự do' },
          { value: 'CN_TD', label: 'Chuyên ngành tự do'},
        ]}
      />)
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
interface IProps{
  ListData : ISubject[] | undefined,
  queryStringForm:string
}
const SubjectTable = (props :IProps) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const {ListData,queryStringForm} = props
  const [form] = Form.useForm();
  const router = useRouter()
  const [editingKey, setEditingKey] = useState<string>('');
  const [data,SetData] = useState<ISubject[] | undefined>([])
  const [loading,setLoading] = useState<boolean>(false)
  const [idDelete,setIdDelete] = useState<string[]>([])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const isEditing = (record: ISubject) => record.subjectId === editingKey;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [queryString,setQueryString] = useState<string>(`current=1&pageSize=10`)
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    sortField:"",
    sortOrder:""
  });
  const showModal = () => {
    setIsModalOpen(true);
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
      await router.push(`/subject?${queryString}&${queryStringForm}`)
    }else{
      await router.push(`/subject?${queryString}`)
    }
    setLoading(false)
  }
  const onFinish: FormProps<ICreateSubject>["onFinish"] = async (values) => {
    setLoading(true)
    try {
      const result = await CreateSubject(values)
      if(result.statusCode === "200"){
        notification.success({
          message:"Create success!!!",
          description:"Tạo mới thành công!!!",
          duration:2
        })
      } else{
        notification.error({
          message:"Create failed!!!",
          description:"Xóa không thành công!!!",
          duration:2
        })
      }
    } catch (error) {
      notification.error({
        message:"Create failed!!!",
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
  const edit = (record: Partial<ISubject> & { subjectId: React.Key }) => {
    const { subjectId, subjectName, numberOfCredits, majorName,category, subjectCode } = record;
    form.setFieldsValue({ subjectId, subjectName, numberOfCredits, category,majorName, subjectCode });
    setEditingKey(record.subjectId ?? '');
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      setLoading(true)
      let check1 :boolean = false;
      let check2 :boolean = false;
      const row = (await form.validateFields()) as ISubject;
      const subject = ListData?.find(k=>k.subjectId === key)
      if(subject?.category !== row.category || subject.majorName !== row.majorName){
        check1 = true
      }
      if(subject?.majorName !== row.majorName){
        check2 = true
      }
      if(subject?.subjectName !== row.subjectName || subject.subjectCode !== row.subjectCode || subject.numberOfCredits !== row.numberOfCredits || subject.majorName !== row.majorName || subject?.majorName !== row.majorName || subject.category !== row.category)
       {
          try {
            const result = await UpdateSubject(row,key.toString(),check1,check2,subject?.majorsId!)
            if(result.statusCode === "200"){
              notification.success({
                message:"Update!!!",
                description:"Cập nhật thành công!!!",
                duration:2
              })
            }
          } catch (error) {
            notification.error({
              message:"Update!!!",
              description:"Bạn không có quyền update!!!",
              duration:2
            })
          }
       } 
      setLoading(false)
      setEditingKey('');
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Mã môn',
      dataIndex: 'subjectCode',
      render: (text: string) => <a>{text}</a>,
      width: '9%',
      editable: true,
    },
    {
      title: 'Tên môn',
      dataIndex: 'subjectName',
      sorter: (a :ISubject, b :ISubject) => 0,
      width: '17%',
      editable: true,
    },
    {
      title: 'Số tín chỉ',
      dataIndex: 'numberOfCredits',
      render: (text: string) => <a style={{color:"red"}}>{text}</a>,
      sorter: (a :ISubject, b :ISubject) => 0,
      width: '10%',
      editable: true,
    },
    {
      title: 'Tên ngành',
      dataIndex: 'majorName',
      render: (text: string) => {
        let checked
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
          <a style={{color:"black"}}>{checked}</a>
        )
      },
      width: '20%',
      editable: true,
    },
    {
      title: 'Thể loại',
      dataIndex: 'category',
      render: (text: string) => {
        let checked
        if(text === "NN"){
          checked = "Ngôn ngữ"
        } else if (text === "TA") {
          checked = "Tiếng anh"
        } else if (text === "TT"){
          checked = "Thể dục"
        } else if (text === "CN"){
          checked = "Chuyên ngành"
        } else if (text === "TD"){
          checked = "Tự do"
        } else if (text === "CN_TD"){
          checked = "Chuyên ngành tự do"
        }
        return (
          <a style={{color:"black"}}>{checked}</a>
        )
      },
      width: '15%',
      editable: true,
    },
    {
      title: 'Lần cập nhật cuối',
      dataIndex: 'createdAt',
      render: (text: string) => <a style={{color:"green"}}>{text}</a>,
      width: '16%',
      editable: false,
      sorter: (a :ISubject, b :ISubject)  => 0 
    },
    {
      title: 'Cập nhật',
      dataIndex: 'operation',
      render: (index: number, record: ISubject) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={{display:'flex',gap:5}} key={index}>
            <Typography.Link onClick={() => save(record.subjectId)} style={{ marginRight: 8 }}>
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
    }
  ];
  const mergedColumns: TableProps['columns'] = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: ISubject) => {
        let inputNode;
        if (col.dataIndex === 'numberOfCredits') {
          inputNode = "number";
        } else if (col.dataIndex === 'majorName'){
          inputNode = "select1";
        } else if (col.dataIndex === 'category'){
          inputNode = "select2";
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
  const rowSelection: TableRowSelection<ISubject> = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys)
      SetData(selectedRows)
      setIdDelete(selectedRows.map(row=>row.majorsId))
    }
  };
  const handleDeleteSubject=async()=>{
    setLoading(true)
    try {
      var result = await DeleteSubject(idDelete)
      if(result.statusCode === "200"){
        SetData([])
        setSelectedRowKeys([])
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
    } catch (error) {
      notification.error({
        message:"Delete!!!",
        description:"Bạn không có quyền xóa!!!",
        duration:2 
      })
    }
    setLoading(false)
  }
  useEffect(()=>{
   fetchData() 
  },[JSON.stringify(tableParams),queryStringForm])
  return (
    <div style={{width:'100%',marginTop:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:20}}>
          <div style={{fontWeight:"bolder",opacity:0.5,fontSize:16}}>Pro Form</div>
          <div style={{display:"flex",gap:10}}>
              <Button type="primary" onClick={showModal}><PlusOutlined /> Tạo mới</Button>
              <RedoOutlined style={{fontSize:19,opacity:0.9}}/>
          </div>
      </div>
      {
        data?.length! > 0 ?
        <div style={{borderRadius:borderRadiusLG,background:"#E8E8E8",height:50,display:'flex',justifyContent:'space-between'}}>
           <div style={{padding:"15px 0 0 25px"}}>Đã chọn {data?.length} môn</div>
           <div style={{padding:"15px 25px 0 0px",color:"blue",fontSize:16}} onClick={()=>{setSelectedRowKeys([]);SetData([])}}>clear</div>
        </div>
        :
        <></>
      }
      {
        data?.length! > 0 ?
        <div style={{position: "fixed",left:80,bottom: 0,width: "94.8%",backgroundColor: 'white',zIndex:10,transition: 'opacity 0.3s ease',opacity: 0.9,height:60}}>
         <div style={{display:"flex",justifyContent:"space-between"}}>
          <div style={{fontSize:16,fontWeight:'bold',fontFamily:"monospace",opacity:0.8,margin:"20px 20px 0 20px"}}>Đã chọn {data?.length} / {ListData?.length} môn</div>
          <Button type='primary' size='middle' style={{margin:"15px 20px 0 20px"}} onClick={handleDeleteSubject}>Xóa tất cả</Button>
         </div>
        </div>
        :
        <></>
      }
      <Form form={form} component={false}>
        <Table
          style={{width:'100%',marginTop:data?.length! > 0 ? 20 : 0}}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowSelection={rowSelection}
          loading={loading}
          dataSource={ListData}
          rowKey={"subjectId"}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{ current:tableParams.pagination?.current, pageSize: tableParams.pagination?.pageSize, total: 100 }}
          onChange={handleTableChange}
        />
      </Form>
      <ModalCreateSubject isModalOpen={isModalOpen}
        handleOk={onFinish}
        handleCancel={handleCancel}
        loading={loading}
      />
    </div> 
  );
};

export default SubjectTable;