import React from "react";
import { Table, Typography, InputNumber, Button, Image, Card, Empty } from "antd";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: ["product", "image"],
      key: "image",
      render: (image: string) => (
        <Image src={image} alt="product" width={60} height={60} style={{ objectFit: "cover" }} />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: ["product", "name"],
      key: "name",
      render: (_: any, record: any) => (
        <div>
          <Text strong>{record.product.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.product.description}
          </Text>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity: number, record: any) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) =>
            updateQuantity(record.product.id, value as number)
          }
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price: number) => <Text>{price.toLocaleString()} VND</Text>,
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_: any, record: any) =>
        <Text strong style={{ color: "#d4380d" }}>
          {(record.product.price * record.quantity).toLocaleString()} VND
        </Text>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Button danger type="link" onClick={() => removeFromCart(record.product.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>🛒 Giỏ Hàng</Title>
      {cartItems.length === 0 ? (
        <Empty description="Giỏ hàng của bạn đang trống." />
      ) : (
        <>
          <Table
            dataSource={cartItems}
            columns={columns}
            rowKey={(record) => record.product.id}
            pagination={false}
          />
          <Card style={{ marginTop: 24, textAlign: "right" }}>
            <Title level={4}>Tổng cộng: {totalPrice.toLocaleString()} VND</Title>
            <Link to="/checkout">
              <Button type="primary" size="large">
                Tiến hành thanh toán
              </Button>
            </Link>
          </Card>
        </>
      )}
    </div>
  );
};

export default Cart;
