import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Form, Input, Select, Button, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { useOrders } from "../client/OrderContext";

const { Option } = Select;

const UpdateOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrder } = useOrders();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const order = orders.find((o) => o.id === Number(id));
    if (order) setFormData(order);
  }, [id, orders]);

  if (!formData) return <div>Không tìm thấy đơn hàng</div>;

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    updateOrder(formData);
    message.success("Cập nhật đơn hàng thành công!");
    navigate("/admin/order");
  };
  const updatePaymentStatus = async (orderId: number, newStatus: number) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/${orderId}`, {
        method: "PATCH", // hoặc "PUT"
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });
  
      if (!res.ok) throw new Error("Cập nhật thất bại");
  
      const updatedOrder = await res.json();
      console.log("Cập nhật thành công:", updatedOrder);
      // Nếu cần, gọi lại fetchOrders() để cập nhật UI
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    }
  };
  

  return (
    <div style={{ padding: 24 }}>
      <Card title={`Chỉnh sửa đơn hàng: ${formData.orderCode}`}>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Mã đơn hàng">
            <Input value={formData.orderCode} disabled />
          </Form.Item>
          <Form.Item label="Ngày đặt hàng">
            <DatePicker
              value={dayjs(formData.orderDate)}
              onChange={(date) => handleChange("orderDate", date?.format("YYYY-MM-DD"))}
              format="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item label="Phương thức thanh toán">
            <Select value={formData.paymentMethod} onChange={(value) => handleChange("paymentMethod", value)}>
              <Option value={1}>Chuyển khoản</Option>
              <Option value={2}>Thanh toán khi nhận hàng</Option>
              <Option value={3}>Thẻ tín dụng</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái thanh toán">
            <Select value={formData.paymentStatus} onChange={(value) => handleChange("paymentStatus", value)}>
              <Option value={1}>Chưa thanh toán</Option>
              <Option value={2}>Đã thanh toán</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng">
            <Select value={formData.orderStatus} onChange={(value) => handleChange("orderStatus", value)}>
              <Option value={1}>Chưa xác nhận</Option>
              <Option value={2}>Đã xác nhận</Option>
              <Option value={3}>Đang giao</Option>
              <Option value={4}>Đã giao</Option>
              <Option value={5}>Giao thành công</Option>
              <Option value={6}>Hoàn thành đơn hàng</Option>
              <Option value={7}>Đã hủy</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => updatePaymentStatus(formData.id, formData.paymentStatus)}>
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateOrder;