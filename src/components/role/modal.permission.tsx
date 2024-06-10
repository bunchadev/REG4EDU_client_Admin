'use client'

import { AddRangeSubjects, CreateRolePermission } from "@/utils/action/action"
import { Button, Divider, notification } from "antd"
import Checkbox from "antd/es/checkbox"
import Modal from "antd/es/modal"
import { useEffect, useState } from "react"
interface IProps{
    isModalOpen : boolean,
    handleCancel:(v :any) => void,
    permissions:IPermission[],
    roleId:string,
    setIsModalOpen:(v: boolean) => void,
    setListPermission:(v:any) => void
}
const ModalPermissions=(props :IProps)=>{
    const {isModalOpen,handleCancel,permissions,roleId,setListPermission,setIsModalOpen} = props
    const [permissions_1,setPermissions_1] = useState<ICreateRolePermission[]>([])
    const [checkedRoles, setCheckedRoles] = useState<{ [key: string]: boolean }>({});
    const onChange = (e :boolean,item :IPermission) => {
      setCheckedRoles(prev => ({
        ...prev,
        [item.id]: e
      }));
      if (e === true) {
        const isPermissionIdExists = permissions_1.some(p => p.permissionId === item.id);
        if (!isPermissionIdExists) {
            setPermissions_1(prevData => [...prevData, {roleId:roleId,permissionId:item.id}]);
        }
      } else if (e === false) {
        setPermissions_1(prevData => prevData.filter(id => id.permissionId !== item.id));
      }
    };
    const handleOk = async () => {
        const result = await CreateRolePermission(permissions_1)
        if(result.statusCode === "200"){
          notification.success({
            message:"Add!!!",
            description:"Thêm mới thành công!!!",
            duration:1
          })
        }
        setListPermission([])
        setIsModalOpen(false)
    };
    useEffect(() => {
      if (!isModalOpen) {
          setCheckedRoles({});
          setPermissions_1([])
      }
    }, [isModalOpen]);
    return(
      <Modal footer={null} title="Thêm mới quyền" open={isModalOpen} onCancel={handleCancel}>
        <Divider/>
        <div style={{display:'flex',flexDirection:'column',gap:15,marginLeft:-25}}>
         {permissions.map((item,index)=>{
                  return(
                    <div key={index} style={{
                       display:'flex',
                       gap:15,
                       margin:'-10px 0px 0px 30px'
                    }}>
                       <Checkbox onChange={(e)=>onChange(e.target.checked,item)} checked={checkedRoles[item.id] || false}/>
                       <div style={{fontSize:16}}>{item.description}</div>
                    </div>
                  )
        })}
        </div>
        <Divider/>
        <Button type="primary" style={{marginLeft:370}} onClick={handleOk}>Thêm mới</Button>
      </Modal>
    )
}
export default ModalPermissions