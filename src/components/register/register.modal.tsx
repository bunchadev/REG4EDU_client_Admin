'use client'

import Button from "antd/es/button"
import Form from "antd/es/form"
import Input from "antd/es/input"
import InputNumber from "antd/es/input-number"
import Modal from "antd/es/modal"
import Select from "antd/es/select"
interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void
}
const RegisterModal=(props :Iprops)=>{
    const {isModalOpen,handleOk, handleCancel} = props
    return(
      <Modal footer={null} title="Tạo mới lớp" open={isModalOpen} onCancel={handleCancel}>
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
            <Form.Item<ICreateClass>
            name="name"
            rules={[{ required: true, message: 'Tên lớp không được để trống!' }]}
            >
               <Input placeholder="Tên lớp học"/>
            </Form.Item>
            <Form.Item<ICreateClass>
            name="classroom"
            rules={[{ required: true, message: 'Phòng học không được để trống!' }]}
            >
               <Input placeholder="Phòng học"/>
            </Form.Item>
            <Form.Item<ICreateClass> 
            name="describe"
            >
               <Select placeholder="Mô tả môn">
                  <Select.Option value="BT">Bài tập</Select.Option>
                  <Select.Option value="LT">Lý thuyết</Select.Option>
                  <Select.Option value={null}>Chưa có</Select.Option>
              </Select>
            </Form.Item>
            <div style={{display:'flex',gap:20}}>
                <Form.Item<ICreateClass> 
                name="classNumber"
                rules={[{ required: true }]}
                >
                    <InputNumber placeholder="Số lớp"/>
                </Form.Item> 
                <Form.Item<ICreateClass> name="weekDay" rules={[{type: 'number', min: 2, max: 8 }]}>
                    <InputNumber placeholder="Thứ học"/>
                </Form.Item>
                <Form.Item<ICreateClass> name="onShift" rules={[{type: 'number', min: 1, max: 10 }]}>
                    <InputNumber placeholder="Ca vào"/>
                </Form.Item>
                <Form.Item<ICreateClass> name="endShift" rules={[{type: 'number', min: 1, max: 10 }]}>
                    <InputNumber placeholder="Ca ra"/>
                </Form.Item>
            </div>
            <Form.Item<ICreateClass> name="numberStudent" rules={[{ type: 'number', min: 1, max: 60 }]}>
                <InputNumber style={{width:120}} placeholder="Số học sinh"/>
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
export default RegisterModal