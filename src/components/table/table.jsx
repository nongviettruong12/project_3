import React from "react";
import "./table.css";
import { SettingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
const Table = () => {
  const [dataTable, setDataTable] = useState([]);

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
      <div className="table-container">
        <table className="config-table">
          <thead>
            <tr className="text-wrap">
              <th>
                <input type="checkbox" />
              </th>
              <th>STT</th>
              <th>[]</th>
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
                <button className="spacing-button">Làm mới</button>
              </th>
              <th>
                <input type="text" placeholder="Chọn giá trị" />
              </th>
              <th>
                <input type="text" placeholder="Chọn giá trị" />
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
                <input type="text" placeholder="Chọn giá trị" />
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
                    <button className="status-btn">
                      <SettingOutlined />
                    </button>
                  </td>
                  <td>{data.status}</td>
                  <td>{data.fullName}</td>
                  <td>{data.birthDay}</td>
                  <td>{data.probationDay}</td>
                  <td>{data.probationYear}</td>
                  <td>{data.identifyNumber}</td>
                  <td>{data.identifyDay}</td>
                  <td>{data.organization}</td>
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

export default Table;
