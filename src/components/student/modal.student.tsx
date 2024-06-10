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
const ModalStudent=(props :Iprops)=>{
    const {isModalOpen,handleOk, handleCancel} = props
    return(
     <Modal footer={null} title="Tạo mới sinh viên" open={isModalOpen} onCancel={handleCancel}>
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
            <Form.Item<ICreateStudent>
            name="userName"
            rules={[{ required: true, message: 'Tên sinh viên không được để trống!' }]}
            >
            <Input placeholder="Tên sinh viên"/>
            </Form.Item>
            <Form.Item<ICreateStudent>
            name="email"
            rules={[{ required: true, message: 'Email không được để trống!' }]}
            >
            <Input placeholder="Email người dùng"/>
            </Form.Item>
            <Form.Item<ICreateStudent>
            name="password"
            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
            >
            <Input placeholder="Mật khẩu sinh viên"/>
            </Form.Item>
            <Form.Item<ICreateStudent> 
            name="majorsCode"
            rules={[{ required: true, message: 'Chức vụ không được để trống!' }]}
            >
                <Select placeholder="Ngành của môn">
                  <Select.Option value="TI">Khoa học máy tính</Select.Option>
                  <Select.Option value="CNTT">Công nghệ thông tin</Select.Option>
                  <Select.Option value="KTQT">Kinh tế quốc tế</Select.Option>
                  <Select.Option value="NNH">Ngôn ngữ hàn</Select.Option>
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
export default ModalStudent
