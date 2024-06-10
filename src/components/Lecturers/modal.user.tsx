'use client'

import Button from "antd/es/button"
import Form from "antd/es/form"
import Input from "antd/es/input"
import Modal from "antd/es/modal"
import Select from "antd/es/select"

interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void
}
const ModalUser=(props :Iprops)=>{
    const {isModalOpen,handleOk, handleCancel} = props
    return(
     <Modal footer={null} title="Tạo mới người dùng" open={isModalOpen} onCancel={handleCancel}>
        <Form
            layout="vertical"
            name="basic"
            size="large"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 18 }}
            style={{ width:600,marginTop:20 }}
            initialValues={{ remember: true }}
            onFinish={handleOk}
            autoComplete="off"
            
        >
            <Form.Item<ICreateUser>
            name="name"
            rules={[{ required: true, message: 'Tên môn không được để trống!' }]}
            >
            <Input placeholder="Tên người dùng"/>
            </Form.Item>
            <Form.Item<ICreateUser>
            name="userName"
            rules={[{ required: true, message: 'Biệt danh không được để trống!' }]}
            >
            <Input placeholder="Biệt danh người dùng"/>
            </Form.Item>
            <Form.Item<ICreateUser>
            name="password"
            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
            >
            <Input placeholder="Mật khẩu người dùng"/>
            </Form.Item>
            <Form.Item<ICreateUser>
            name="email"
            rules={[{ required: true, message: 'Email không được để trống!' }]}
            >
            <Input placeholder="Email người dùng" type="password"/>
            </Form.Item>
            <Form.Item<ICreateUser> 
            name="role"
            rules={[{ required: true, message: 'Chức vụ không được để trống!' }]}
            >
                <Select placeholder="Chức vụ">
                  <Select.Option value="admin">Quản trị hệ thống</Select.Option>
                  <Select.Option value="manager">Quản lý</Select.Option>
                  <Select.Option value="user">Giảng viên</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item<ICreateUser> 
            name="departmentCode"
            rules={[{ required: true, message: 'Thể loại môn không được để trống!' }]}
            >
                <Select placeholder="Thể loại của môn">
                  <Select.Option value="KTT">Khoa toán tin</Select.Option>
                  <Select.Option value="KKT">Khoa kinh tế</Select.Option>
                  <Select.Option value="KNN">Khoa ngôn ngữ</Select.Option>
                  <Select.Option value="KTNDS">Khoa đời sống</Select.Option>
                  <Select.Option value="KTDTT">Khoa thể thao</Select.Option>
                  <Select.Option value="KTH">Khoa toán học</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <div style={{display:'flex',gap:30,marginLeft:-70}}>
                <Button type="primary" htmlType="submit" loading={props.loading}>
                    Tạo mới
                </Button>
                <Button type="default" htmlType="reset" loading={props.loading}>
                    Clear
                </Button>
            </div>
            </Form.Item>
        </Form>
      </Modal>
    )
}
export default ModalUser