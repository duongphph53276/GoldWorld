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
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentStatus: newStatus }),
      });

      if (!res.ok) throw new Error("Cập nhật thất bại");

      const updatedOrder = await res.json();
      console.log("Cập nhật thành công:", updatedOrder);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    }
  };

  // Các trạng thái thanh toán và đơn hàng
  const paymentStatusOptions = [
    { value: 1, label: "Chưa thanh toán" },
    { value: 2, label: "Đã thanh toán" },
  ];

  const orderStatusOptions = [
    { value: 1, label: "Chưa xác nhận" },
    { value: 2, label: "Đã xác nhận" },
    { value: 3, label: "Đang giao" },
    { value: 4, label: "Đã giao" },
    { value: 5, label: "Giao thành công" },
    { value: 6, label: "Hoàn thành đơn hàng" },
    { value: 7, label: "Đã hủy" },
  ];

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
            <Select value={formData.paymentMethod} disabled>
              <Option value={1}>Chuyển khoản</Option>
              <Option value={2}>Thanh toán khi nhận hàng</Option>
              <Option value={3}>Thẻ tín dụng</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái thanh toán">
            <Select
              value={formData.paymentStatus}
              onChange={(value) => handleChange("paymentStatus", value)}
            >
              {paymentStatusOptions.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  disabled={option.value < formData.paymentStatus} // Chặn các trạng thái cũ
                  style={{
                    opacity: option.value < formData.paymentStatus ? 0.5 : 1, // Làm mờ trạng thái bị chặn
                  }}
                >
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Trạng thái đơn hàng">
            <Select
              value={formData.orderStatus}
              onChange={(value) => handleChange("orderStatus", value)}
            >
              {orderStatusOptions.map((option) => (
                <Option
                  key={option.value}
                  value={option.value}
                  disabled={option.value < formData.orderStatus} // Chặn các trạng thái cũ
                  style={{
                    opacity: option.value < formData.orderStatus ? 0.5 : 1, // Làm mờ trạng thái bị chặn
                  }}
                >
                  {option.label}
                </Option>
              ))}
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
