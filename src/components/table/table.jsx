import React from "react";
import "./table.css";
import {  SettingOutlined } from "@ant-design/icons";
import {
  Tag,
  Select,
  Form,
  Button,
  Modal,
  message,
  Input,
  Checkbox,
  Spin
} from "antd";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import HeaderNav from "../header/header";
const Table = () => {
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading,setLoading] = useState(false)
  const [columns, setColumns] = useState([
    {title:'STT',dataIndex: "select", hidden: false },
    { title: "hoho", dataIndex: "STT", hidden: false },
    {
      dataIndex: <SettingOutlined />,
      hidden: false,
    },
    { title: "Trạng thái", dataIndex: "status", hidden: false },
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
  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:3000/user");
      const data = await response.json();
      setDataTable(data);
    } catch (error) {
      message.error("Không thể tải dữ liệu.");
    }finally{
      setLoading(false)
    }
  };
  const reloadData = () => {
    fetchData()
    setSelectedRowKeys([])
    setSelectAll(false)
  }
  useEffect(()=>{
    fetchData()
  },[])
  const handleDeleteSelectdRows = (id) => {
    Modal.confirm({
      title: `Bạn có chắc muốn xoá các mục đã chọn?`,
      onOk: () => {
        setDataTable((prev) =>
          prev.filter((user) => !selectedRowKeys.includes(user.id))
        );
        setSelectedRowKeys([]);
        setSelectAll(false);
        message.success("Xóa các mục đã chọn thành công");
      },
    });
  };

  const handleSelectAllChange = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedRowKeys(dataTable.map((data) => data.id))
    } else {
      setSelectedRowKeys([]);
    }
  };
  const handleRowSelectChange = (id) => {
    setSelectedRowKeys((prev) => {
      if (prev.includes.id) {
        return prev.filter((key) => key !== key.id);
      } else {
        return [...prev, id];
      }
    });
    if (selectAll) {
      setSelectAll(false);
    }
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
  //fetch data render table
  useEffect(() => {
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((dataTable) => {
        setDataTable(dataTable);
      });
  }, []);
  //fetch checkbox select all or break
  useEffect(() => {
    if (selectedRowKeys.length === dataTable.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRowKeys, dataTable.length]);
  return (
    <>
      <HeaderNav
        dataTable={dataTable}
        columns={columns}
        setColumns={setColumns}
        onDeleteSelectdRows={handleDeleteSelectdRows}
      />
      <div className="table-container">
        {loading?(
          <div className="loading-container">
          <Spin size="large" />
        </div>
        ):(
<table className="config-table">
          <thead>
            <tr className="text-wrap">
              <th>
                <Checkbox
                  onChange={handleSelectAllChange}
                  checked={selectAll}
                  indeterminate={
                    selectedRowKeys.length > 0 &&
                    selectedRowKeys.length < dataTable.length
                  }
                />
              </th>
              {columns.map((col, index) =>
                !col.hidden && <th key={index + 1}>{col.title}</th> 
              )}
            </tr>
            <tr className="filters">
              <th colSpan={3}>
                <Button className="spacing-button" onClick={reloadData}>
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
                <td>
                  <Checkbox
                    checked={selectedRowKeys.includes(data.id)}
                    onChange={() => handleRowSelectChange(data.id)}
                  />
                </td>
                {!columns[1].hidden && <td>{index + 1}</td>}
                {!columns[2].hidden && <td><SettingOutlined/></td>}
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
        )}
        
      </div>
    </>
  );
};

export default Table;
