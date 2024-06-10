'use client'

import Button from "antd/es/button"
import Form from "antd/es/form"
import Input from "antd/es/input"
import Modal from "antd/es/modal"

interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void
}
const ModalCreateRole=(props :Iprops)=>{
    const {isModalOpen,handleOk, handleCancel} = props
    return(
     <Modal footer={null} title="Tạo mới role" open={isModalOpen} onCancel={handleCancel}>
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
            <Form.Item<ICreateRole>
            name="roleName"
            rules={[{ required: true, message: 'Tên role không được để trống!' }]}
            >
            <Input placeholder="Tên role"/>
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
export default ModalCreateRole
