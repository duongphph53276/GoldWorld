import { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Button } from "antd";
import { Link, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const SidebarAdmin = () => {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const [selectedKey, setSelectedKey] = useState("1"); // State để lưu key được chọn

  // Cập nhật selectedKey dựa trên pathname khi URL thay đổi
  useEffect(() => {
    const pathname = location.pathname;
    switch (pathname) {
      case "/admin":
        setSelectedKey("1");
        break;
      case "/admin/products":
      case "/admin/addproducts":
        setSelectedKey("2");
        break;
      case "/admin/cart":
      case "/admin/addorders":
        setSelectedKey("3");
        break;
      case "/admin/category":
      case "/admin/addcategory":
        setSelectedKey("4");
        break;
      case "/admin/users":
      case "/admin/addusers":
        setSelectedKey("5");
        break;
      default:
        setSelectedKey("1"); // Mặc định về Dashboard nếu không khớp
    }
  }, [location.pathname]); // Chạy lại khi pathname thay đổi

  const productMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/admin/products">Danh sách</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/admin/addproducts">Thêm mới</Link>
      </Menu.Item>
    </Menu>
  );

  const categoryMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/admin/category">Danh sách</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/admin/addcategory">Thêm mới</Link>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item>
        <Link to="/admin/users">Danh sách</Link>
      </Menu.Item>
      <Menu.Item>
        <Link to="/admin/addusers">Thêm mới</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <Sider width={250} className="h-screen bg-white p-4 shadow-md">
      <Menu
        mode="vertical"
        className="text-center"
        selectedKeys={[selectedKey]} // Sử dụng selectedKeys thay vì defaultSelectedKeys
      >
        <Menu.Item key="1" className="font-bold">
          <Link to="/admin">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" className="font-bold">
          <Dropdown overlay={productMenu} trigger={["click"]}>
            <Button type="text">
              Quản lý sản phẩm <DownOutlined />
            </Button>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key="3" className="font-bold">
          <a href="/admin/order">
            <Button type="text">
              Quản lý đơn hàng  
            </Button>
            </a>
        </Menu.Item>
        <Menu.Item key="4" className="font-bold">
          <Dropdown overlay={categoryMenu} trigger={["click"]}>
            <Button type="text">
              Quản lý danh mục <DownOutlined />
            </Button>
          </Dropdown>
        </Menu.Item>
        <Menu.Item key="5" className="font-bold">
          <Dropdown overlay={userMenu} trigger={["click"]}>
            <Button type="text">
              Quản lý người dùng <DownOutlined />
            </Button>
          </Dropdown>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default SidebarAdmin;