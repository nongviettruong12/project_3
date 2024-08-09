import React from "react";
import "./header.css";
import {
  MailOutlined,
  PlusOutlined,
  SettingOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
const HeaderNav = ({dataTable}) => {
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
          <button className="button-header button-primary spacing">
            <PlusOutlined />
            Thêm mới
          </button>
          <button className="button-header button-primary spacing"onClick={handleExport}>
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
