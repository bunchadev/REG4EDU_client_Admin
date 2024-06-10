import Button from 'antd/es/button'
import Result from 'antd/es/result'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, hệ thống đang bị lỗi"
      extra={<Button type="primary">
        <Link href={"/home"}>
           Back home
        </Link>
      </Button>}
  />
  )
}