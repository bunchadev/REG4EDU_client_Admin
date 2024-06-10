'use client'

import { Divider } from "antd";
import Button from "antd/es/button";
import Form from "antd/es/form";
import InputNumber from "antd/es/input-number";
import Input from "antd/es/input/Input"
import Modal from "antd/es/modal/Modal"
import Select from "antd/es/select";
interface Iprops{
    isModalOpen:boolean,
    loading:boolean,
    handleOk:(v : any) => void,
    handleCancel:(v :any) => void
}
const ModalCreateSubject=(props :Iprops)=>{
    const {isModalOpen,handleOk, handleCancel} = props
    return(
      <Modal footer={null} title="Tạo mới môn" open={isModalOpen} onCancel={handleCancel}>
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
            <Form.Item<ICreateSubject>
            name="subjectCode"
            rules={[{ required: true, message: 'Mã môn không được để trống!' }]}
            >
            <Input placeholder="Mã môn học"/>
            </Form.Item>
            <Form.Item<ICreateSubject>
            name="subjectName"
            rules={[{ required: true, message: 'Tên môn không được để trống!' }]}
            >
            <Input placeholder="Tên môn học"/>
            </Form.Item>
            <Form.Item<ICreateSubject> 
            name="majorsCode"
            rules={[{ required: true, message: 'Ngành không được để trống!' }]}
            >
                <Select placeholder="Ngành của môn">
                  <Select.Option value="TI">Khoa học máy tính</Select.Option>
                  <Select.Option value="CNTT">Công nghệ thông tin</Select.Option>
                  <Select.Option value="KTQT">Kinh tế quốc tế</Select.Option>
                  <Select.Option value="NNH">Ngôn ngữ hàn</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item<ICreateSubject> 
            name="category"
            rules={[{ required: true, message: 'Thể loại môn không được để trống!' }]}
            >
                <Select placeholder="Thể loại của môn">
                  <Select.Option value="CN">Chuyên ngành</Select.Option>
                  <Select.Option value="CN_TD">Chuyên ngành tự do</Select.Option>
                  <Select.Option value="TD">Tự do</Select.Option>
                  <Select.Option value="TT">Thể thao</Select.Option>
                  <Select.Option value="NN">Ngôn ngữ</Select.Option>
                  <Select.Option value="TA">Tiếng anh</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item<ICreateSubject> name="numberOfCredits" rules={[{ type: 'number', min: 1, max: 5 }]}>
                <InputNumber placeholder="Số tín"/>
            </Form.Item>
            <Divider/>
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
export default ModalCreateSubject