import React from "react";
import "./table.css";
import { DingdingOutlined, SettingOutlined } from "@ant-design/icons";
import { Tag, Select, Form, Button, Modal, message, Input } from "antd";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import HeaderNav from "../header/header";
const Table = () => {
  const [dataTable, setDataTable] = useState([]);
  const [columns, setColumns] = useState([
    {title: '',dataIndex: 'checkbox',hidden: false},
    { title: "STT", dataIndex: "STT", hidden: false },
    {title: '', dataIndex:'logo', hidden: false},
    { title: "Trang thái", dataIndex: "status", hidden: false },
    { title: "Họ và tên", dataIndex: "fullName", hidden: false },
    { title: "Ngày sinh", dataIndex: "birthDay", hidden: false },
    { title: "Ngày tập sự", dataIndex: "probationDay", hidden: false },
    { title: "Năm Tập sự", dataIndex: "probationYear", hidden: false },
    { title: "Số CCCD", dataIndex: "identifyNumber", hidden: false },
    { title: "Ngày cấp CCCD", dataIndex: "identifyDay", hidden: false },
    {
      title: "Tổ chức hành nghề (TC)",
      dataIndex: "organization",
      hidden: false,
    },
    { title: "Chứng chỉ", dataIndex: "certificate", hidden: false },
    { title: "Thời gian học", dataIndex: "TimeOfLearning", hidden: false },
  ]);
  const dataSearch = [
    { value: "intern", label: "tập sự" },
    { value: "official", label: "chính thức" },
  ];

  const handleDelete = (id) => {
    Modal.confirm({
      title: `Bạn có chắc muốn xoá?`,
      onOk: () => {
        setDataTable((prev) => prev.filter((user) => user.id !== id));
        message.success("xoa thanh cong");
      },
    });
  };

  const handleExport = () => {
    if (dataTable.length === 0) {
      message.warning("Không có dữ liệu để xuất");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(dataTable);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DanhSachTapSu");
    XLSX.writeFile(wb, "DanhSachTapSu.xlsx");
    message.success("Xuất file thành công");
  };

  useEffect(() => {
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((dataTable) => {
        setDataTable(dataTable);
        console.log("data:", dataTable);
      });
  }, []);
  return (
    <>
      <HeaderNav
        dataTable={dataTable}
        columns={columns}
        setColumns={setColumns}
      />
      <div className="table-container">
        <table className="config-table">
          <thead>
            <tr className="text-wrap">
              {columns.map((col, index) =>
                !col.hidden ? <th key={index}>{col.title}</th> : null
              )}
              
            </tr>
            <tr className="filters">
              <th colSpan={3}>
                <Button className="spacing-button" type="primary">
                  Làm mới
                </Button>
              </th>
              <th>
                <Form>
                <Form.Item name="status">
                  <Select placeholder="nhập giá trị">
                    {dataSearch.map((data, index) => {
                      return <option key={index}>{data.label}</option>;
                    })}
                  </Select>
                </Form.Item>
                </Form>
              </th>
              <th>
                <Form>
                <Form.Item>
                  <Input placeholder="abc" />
                </Form.Item>
                </Form>
              </th>
              <th>
                <input type="date" placeholder="Nhập giá trị" />
              </th>
              <th>
                <input type="date" placeholder="Chọn giá trị" />
              </th>
              <th>
                <input type="text" placeholder="Nhập giá trị" />
              </th>
              <th>
                <input type="text" placeholder="Nhập giá trị" />
              </th>
              <th>
                <input type="text" placeholder="Nhập giá trị" />
              </th>
              <th>
                <input type="text" placeholder="abc" />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Chọn giá trị"
                  className="hidden"
                />
              </th>
              <th>
                <input type="text" placeholder="Chọn giá trị" />
              </th>
            </tr>
          </thead>
          <tbody>
            {dataTable.map((data, index) => (
              <tr key={data.id}>
                {!columns[0].hidden && <td>{data.checkbox}</td>}
                {!columns[1].hidden && <td>{index + 1}</td>}
                {!columns[2].hidden && <td>{data.logo}</td>}
                {!columns[3].hidden && (
                  <td>
                    <Tag color={data.status === "intern" ? "gold" : "green"}>
                      {data.status === "intern" ? "tập sự" : "chính thức"}
                    </Tag>
                  </td>
                )}
                {!columns[4].hidden && <td>{data.fullName}</td>}
                {!columns[5].hidden && <td>{data.birthDay}</td>}
                {!columns[6].hidden && <td>{data.probationDay}</td>}
                {!columns[7].hidden && <td>{data.probationYear}</td>}
                {!columns[8].hidden && <td>{data.identifyNumber}</td>}
                {!columns[9].hidden && <td>{data.identifyDay}</td>}
                {!columns[10].hidden && (
                  <td>
                    <Tag
                      color={data.organization === "black" ? "red" : "green"}
                    >
                      {data.organization === "black"
                        ? "xã hội đen"
                        : "xã hội đỏ"}
                    </Tag>
                  </td>
                )}
                {!columns[11].hidden && <td>{data.certificate}</td>}
                {!columns[12].hidden && <td>{data.TimeOfLearning}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
