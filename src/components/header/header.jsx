import React from "react";
import "./header.css";
import {
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
const HeaderNav = () => {
  return (
    <>
      <div className="flex border-header">
        <span className="title-header">Danh sách tập sự(446)</span>
        <div>
          <button className="button-header button-primary spacing">
            <PlusOutlined />
            Thêm mới
          </button>
          <button className="button-header button-primary spacing">
            <UploadOutlined />
          </button>
          <button className="button-header button-gray spacing">
            <MailOutlined />
          </button>
          <button className="button-header button-primary spacing">
            <SettingOutlined />
          </button>
        </div>
      </div>
    </>
  );
};
export default HeaderNav;
