import React, { useState } from "react";
import "./header.css";
import {
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import {message, Checkbox,Modal } from "antd"
import ModalAdd from "../modal/modal";


const HeaderNav = ({dataTable, columns, setColumns, onDeleteSelectdRows }) => {


  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const headers = columns.filter(col => !col.hiden).map(col => col.title)

  const handleAddNewClick = () =>{
    setIsAdding(true)
  }
  const handleCloseModal = () =>{
    setIsAdding(false)
  }
  const exportData = dataTable.map((data, index) => {
    const rowData = {
      STT: index + 1
    }
    columns.forEach(col => {
      if (!col.hiden) {
        rowData[col.title] = data[col.dataIndex]
      }
    })
    return rowData
  })
  const handleSettingClick = () =>{
    setIsModalVisible(true)
  }
  const handleChangeColumns = (checkedValues) =>{
    const updatedColumns = columns.map(col=>({
      ...col,
      hidden: !checkedValues.includes(col.title)
    }))
    setColumns(updatedColumns)
  }
  const handleExport = () => {
    if (dataTable.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    const headers = [
      "STT",
      "Trạng thái",
      "Họ và tên",
      "Ngày sinh",
      "Ngày tập sự",
      "Năm Tập sự",
      "Số CCCD",
      "Ngày cấp CCCD",
      "Tổ chức hành nghề (TC)",
      "Chứng chỉ",
      "Thời gian học",
    ];

    const exportData = dataTable.map((data, index) => ({
      STT: index + 1,
      "Trạng thái": data.status === "intern" ? "tập sự" : "chính thức",
      "Họ và tên": data.fullName,
      "Ngày sinh": data.birthDay,
      "Ngày tập sự": data.probationDay,
      "Năm Tập sự": data.probationYear,
      "Số CCCD": data.identifyNumber,
      "Ngày cấp CCCD": data.identifyDay,
      "Tổ chức hành nghề (TC)":
        data.organization === "black" ? "xã hội đen" : "xã hội đỏ",
      "Chứng chỉ": data.certificate,
      "Thời gian học": data.TimeOfLearning,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData, { header: headers });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachTapSu");
    XLSX.writeFile(wb, "DanhSachTapSu.xlsx");
    message.success("Xuất file thành công");
  };
  return (
    <>
      <div className="flex border-header">
        <span className="title-header">Danh sách tập sự(446)</span>
        <div>
          <button className="button-header button-primary spacing"onClick={handleAddNewClick}>
            <PlusOutlined />
            Thêm mới
          </button>
          <button className="button-header button-primary spacing"onClick={handleExport}>
            <UploadOutlined />
          </button>
          <button className="button-header button-gray spacing"onClick={onDeleteSelectdRows}>
            <MailOutlined />
          </button>
          <button className="button-header button-primary spacing"onClick={handleSettingClick}>
            <SettingOutlined />
          </button>
        </div>
      </div>
      <ModalAdd isAdding={isAdding} closeModal={handleCloseModal} />
      <Modal title="tùy chọn cột"
            open={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={() => setIsModalVisible(false)}
      >
      <Checkbox.Group
        options={columns.map(col => col.title)}
        defaultValue={columns.filter(col=> !col.hidden).map(col=>col.title)}
        onChange={handleChangeColumns}
        />
      </Modal>
    </>
  );
};
export default HeaderNav;
