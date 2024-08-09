import React from "react";
import "./table.css";
import { DingdingOutlined, SettingOutlined } from "@ant-design/icons";
import { Tag, Select, Form, Button, Modal,message, Input } from "antd";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import HeaderNav from "../header/header";
const Table = () => {
  const dataSearch = [
    {value: 'intern','label': 'tập sự'},
    {value: 'official','label': 'chính thức'}
  ]
  const [dataTable, setDataTable] = useState([]);
  const navigate = useNavigate();
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
    <HeaderNav dataTable={dataTable}/>
      <div className="table-container">
        <table className="config-table">
          <thead>
            <tr className="text-wrap">
              <th>
                <input type="checkbox" />
              </th>
              <th>STT</th>
              <th>
                <DingdingOutlined />
              </th>
              <th>Trang thái</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Ngày tập sự</th>
              <th>Năm Tập sự</th>
              <th>Số CCCD</th>
              <th>Ngày cấp CCCD</th>
              <th>Tổ chức hành nghề (TC)</th>
              <th>Chứng chỉ</th>
              <th>Thời gian học</th>
            </tr>
            <tr className="filters">
           
              <th colSpan={3}>
                <Button className="spacing-button" type="primary">Làm mới</Button>
              </th>
              <th>
                <Form.Item name="status">
                  <Select placeholder='nhập giá trị'>
                    {dataSearch.map((data, index) => {
                      return (
                        <option key={index}>{data.label}</option>
                      );
                    })}
                  </Select>
                </Form.Item>
              </th>
              <th>
                <Form.Item>
                  <Input placeholder="abc"/>
                </Form.Item>
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
            {dataTable.map((data, index) => {
              return (
                <tr>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{index + 1}</td>
                  <td>
                    <button className="status-btn"onClick={()=>{handleDelete(data.id)}}>
                      <SettingOutlined />

                    </button>
                  </td>
                  <td>
                    <Tag color={data.status === "intern" ? "gold" : "green"}>
                      {data.status === "intern" ? "tập sự" : "chính thức"}
                    </Tag>
                  </td>
                  <td>{data.fullName}</td>
                  <td>{data.birthDay}</td>
                  <td>{data.probationDay}</td>
                  <td>{data.probationYear}</td>
                  <td>{data.identifyNumber}</td>
                  <td>{data.identifyDay}</td>
                  <td>
                    <Tag
                      color={data.organization === "black" ? "red" : "green"}
                    >
                      {data.organization === "black"
                        ? "xã hội đen"
                        : "xã hội đỏ"}
                    </Tag>
                  </td>
                  <td>{data.certificate}</td>
                  <td>{data.TimeOfLearning}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
    </>
  );
};

export default Table
