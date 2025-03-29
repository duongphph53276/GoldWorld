import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useAuth } from "../auth/AuthContext";
import { useOrders } from "./OrderContext";
import {
  Typography,
  List,
  Input,
  Button,
  Form,
  message,
  Modal,
  Select,
  Image,
  Card,
  Divider,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { Option } = Select;

type DiscountCode = "SAVE10" | "SAVE20" | "FIXED50000";
const discountCodes: Record<DiscountCode, number> = {
  SAVE10: 10,
  SAVE20: 20,
  FIXED50000: 50000,
};

const Checkout: React.FC = () => {
  const { cartItems, setCartItems } = useCart();
  const { user } = useAuth();
  const { updateOrder } = useOrders();
  const navigate = useNavigate();
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const total = subtotal - discountAmount > 0 ? subtotal - discountAmount : 0;

  const applyDiscount = () => {
    const code = discountCode.trim().toUpperCase() as DiscountCode;
    if (code in discountCodes) {
      const discountValue = discountCodes[code];
      const discount = code.startsWith("SAVE")
        ? (subtotal * discountValue) / 100
        : discountValue;
      setDiscountAmount(discount);
      message.success(`Áp dụng mã giảm giá ${code} thành công!`);
    } else {
      setDiscountAmount(0);
      message.error("Mã giảm giá không hợp lệ!");
    }
  };

  const handleCheckout = async () => {
    setIsModalVisible(false);
  
    const newOrder = {
      id: Date.now(),
      orderCode: `DH${Date.now()}`,
      orderDate: new Date().toISOString().split("T")[0],
      paymentMethod: paymentMethod === "cash" ? 2 : 1,
      paymentStatus: paymentMethod === "cash" ? 1 : 2,
      orderStatus: 1,
      userId: user?.id || 1,
      items: cartItems,
      totalAmount: total,
      discountCode: discountCode || "Không sử dụng",
      discountAmount: discountAmount,
    };
  
    try {
      const response = await fetch("http://localhost:3000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder),
      });
  
      if (!response.ok) throw new Error("Lỗi khi đặt hàng!");
  
      const responseData = await response.json();
      console.log("Đơn hàng đã lưu từ API:", responseData);
  
      updateOrder(responseData);
      setCartItems([]);
      localStorage.setItem("cartItems", JSON.stringify([]));
      message.success("Đã đặt hàng thành công!");
      navigate("/order");
    } catch (error) {
      console.error("Lỗi khi gửi đơn hàng:", error);
      message.error("Có lỗi xảy ra khi đặt hàng, vui lòng thử lại!");
    }
  };
  

  if (cartItems.length === 0) return <Text>Giỏ hàng trống.</Text>;

  return (
    <Card title="Thanh Toán" style={{ maxWidth: "800px", margin: "0 auto", padding: 20 }}>
      <Title level={4}>Thông tin khách hàng</Title>
      <Card bordered>
        <Text><strong>Tên:</strong> {user?.username || "Khách"}</Text><br />
        <Text><strong>Số điện thoại:</strong> {user?.phone || "Chưa cung cấp"}</Text><br />
        <Text><strong>Địa chỉ:</strong> {user?.address || "Chưa cung cấp"}</Text>
      </Card>

      <Divider />

      <Title level={4}>Sản phẩm</Title>
      <List
        bordered
        dataSource={cartItems}
        renderItem={(item) => (
          <List.Item>
            <Row style={{ width: "100%" }}>
              <Col span={4}><Image src={item.product.image} width={50} /></Col>
              <Col span={14}><Text>{item.product.name} - SL: {item.quantity}</Text></Col>
              <Col span={6} style={{ textAlign: "right" }}><Text>{(item.product.price * item.quantity).toLocaleString()} VND</Text></Col>
            </Row>
          </List.Item>
        )}
      />

      <Divider />
      <Text strong>Tổng tiền trước giảm giá: {subtotal.toLocaleString()} VND</Text><br />
      <Text strong>Số tiền giảm: {discountAmount.toLocaleString()} VND</Text><br />
      <Title level={3}>Tổng cộng: {total.toLocaleString()} VND</Title>

      <Divider />
      <Form layout="inline">
        <Form.Item label="Mã giảm giá">
          <Input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={applyDiscount}>Áp dụng</Button>
        </Form.Item>
      </Form>

      <Form.Item label="Phương thức thanh toán" style={{ marginTop: "20px" }}>
        <Select value={paymentMethod} onChange={setPaymentMethod} style={{ width: "100%" }}>
          <Option value="cash">Thanh toán khi nhận hàng</Option>
          <Option value="online">Thanh toán online</Option>
        </Select>
      </Form.Item>

      <Button type="primary" size="large" block onClick={() => setIsModalVisible(true)}>
        Xác nhận thanh toán
      </Button>

      <Modal
        title="Xác nhận đơn hàng"
        visible={isModalVisible}
        onOk={handleCheckout}
        onCancel={() => setIsModalVisible(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn đặt hàng?</p>
        <p><strong>Tổng tiền:</strong> {total.toLocaleString()} VND</p>
        <p><strong>Phương thức thanh toán:</strong> {paymentMethod === "cash" ? "Thanh toán khi nhận hàng" : "Thanh toán online"}</p>
      </Modal>
    </Card>
  );
};

export default Checkout;