import React from "react";
import "./table.css";
import { SettingOutlined } from "@ant-design/icons";
import {
  Tag,
  Select,
  Form,
  Button,
  Modal,
  message,
  Input,
  Checkbox,
  Spin,
  Pagination,
} from "antd";
import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import HeaderNav from "../header/header";
import ModalAdd from "../modal/modal";
const Table = () => {
  const [form] = Form.useForm();
  const [dataTable, setDataTable] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [edittingRecord, setEditingRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [columns, setColumns] = useState([
    { title: "STT", dataIndex: "id", hidden: false },
    { title: "option", dataIndex: "", hidden: false },
    { title: "Trạng thái", dataIndex: "status", hidden: false },
    { title: "Họ và tên", dataIndex: "fullName", hidden: false },
    { title: "Ngày sinh", dataIndex: "birthDay", hidden: false },
    { title: "Ngày tập sự", dataIndex: "probationDay", hidden: false },
    { title: "Năm Tập sự", dataIndex: "probationYear", hidden: false },
    { title: "Số CCCD", dataIndex: "identifyNumber", hidden: false },
    { title: "Ngày cấp CCCD", dataIndex: "identifyDay", hidden: false },
    {
      title: "Tổ chức hành nghề",
      dataIndex: "organization",
      hidden: false,
    },
    { title: "Chứng chỉ", dataIndex: "certificate", hidden: false },
    { title: "Thời gian học", dataIndex: "TimeOfLearning", hidden: false },
  ]);

  const handleEdit = (record) => {
    setIsAdding(false);
    setEditingRecord(record);
    setIsModalVisible(true);
  };
  const closeModal = () => {
    setIsEditting(false);
    setEditingRecord(null);
  };

  const dataSearch = [
    { value: "intern", label: "tập sự" },
    { value: "official", label: "chính thức" },
  ];
  const dataSeachCommunity = [
    { value: "black", label: "Xã hội đen" },
    { value: "red", label: "Xã hội đỏ" },
  ];

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user");
      const data = await response.json();
      setTimeout(() => {
        setDataTable(data);
        setFilteredData(data);
        setLoading(false);
      }, 1000);
    } catch (error) {
      message.error("Không thể tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  const reloadData = () => {
    fetchData();
    setSelectedRowKeys([]);
    setSelectAll(false);
  };

  const showModal = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      setSelectedRowKeys(dataTable.map((data) => data.id));
    } else {
      setSelectedRowKeys([]);
    }
  };
  const handleRowSelectChange = (id) => {
    setSelectedRowKeys((prev) => {
      if (prev.includes(id)) {
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

  useEffect(() => {
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((dataTable) => {
        setDataTable(dataTable);
      });
  }, []);

  useEffect(() => {
    if (selectedRowKeys.length === filteredData.length) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedRowKeys, filteredData.length]);

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const currentPageData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  const handleSearch = (e, dataIndex) => {
    if (e.key === "Enter") {
      const value = e.target?.value?.toLowerCase() || "";
      const filtered = dataTable.filter((item) => {
        const matchValue = item[dataIndex]
          ?.toString()
          .toLowerCase()
          .includes(value);
        const matchStatus = selectedStatus
          ? item.status === selectedStatus
          : true;
        const matchOrganization = selectedOrganization
          ? item.organization === selectedOrganization
          : true;
        return matchValue && matchOrganization && matchStatus;
      });
      setFilteredData(filtered);
    }
  };
  return (
    <>
      <HeaderNav
        dataTable={dataTable}
        columns={columns}
        setColumns={setColumns}
        onDeleteSelectdRows={handleDeleteSelectdRows}
      />
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <>
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
                  {columns.map(
                    (col, index) =>
                      !col.hidden && <th key={index + 1}>{col.title}</th>
                  )}
                </tr>
                <tr className="filters">
                  <th colSpan={3}>
                    <Button className="spacing-button" onClick={reloadData}>
                      Làm mới
                    </Button>
                  </th>

                  {/* {columns[0] && !columns[0].hidden && <th><Form>
                      <Form.Item name="status">
                        <Select placeholder="nhập giá trị">
                          {dataSearch.map((data, index) => {
                            return <option key={index}>{data.label}</option>;
                          })}
                        </Select>
                      </Form.Item>
                    </Form>} </th>*/}
                  <th>
                    {/* {columns[0] && !columns[0].hidden && <Form>
                      <Form.Item name="status">
                        <Select placeholder="nhập giá trị">
                          {dataSearch.map((data, index) => {
                            return <option key={index}>{data.label}</option>;
                          })}
                        </Select>
                      </Form.Item>
                    </Form>} */}
                    <Form>
                      <Form.Item name="status">
                        <Select
                          placeholder="nhập giá trị"
                          onChange={(value) => {
                            setSelectedStatus(value);
                            handleSearch({ key: "Enter",target: { value } }, "status");
                          }}
                        >
                          {dataSearch.map((data, index) => {
                            return (
                              <Select.Option key={index} value={data.value}>
                                {data.label}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      </Form.Item>
                    </Form>
                  </th>
                  <th>
                    <Form>
                      <Form.Item>
                        <Input
                          placeholder="abc"
                          onKeyDown={(e) => handleSearch(e, "fullName")}
                        />
                      </Form.Item>
                    </Form>
                  </th>
                  <th>
                    <input type="date" placeholder="Nhập giá trị" 
                    onKeyDown={(e) => handleSearch(e, "birthDay")}
                    />
                    
                  </th>
                  <th>
                    <input
                      type="date"
                      placeholder="Chọn giá trị"
                      onKeyDown={(e) => handleSearch(e, "probationDay")}
                    />
                  </th>
                  <th>
                  <Form>
                      <Form.Item>
                        <Input
                          placeholder="abc"
                          onKeyDown={(e) => handleSearch(e, "probationYear")}
                        />
                      </Form.Item>
                    </Form>
                  </th>
                  <th>
                  <Form>
                      <Form.Item>
                        <Input
                          placeholder="abc"
                          onKeyDown={(e) => handleSearch(e, "identifyNumber")}
                        />
                      </Form.Item>
                    </Form>
                  </th>
                  <th>
                    <input type="date" placeholder="Nhập giá trị" 
                    onKeyDown={(e) => handleSearch(e, "identifyDay")}
                    />
                  </th>
                  <th>
                    <Form>
                      <Form.Item name="organization">
                        <Select
                          placeholder="nhập giá trị"
                          onChange={(value) => {
                            setSelectedOrganization(value);
                            handleSearch({ key: "Enter",target: { value } }, "organization");
                          }}
                        >
                          {dataSeachCommunity.map((data, index) => {
                             return (                      
                              <Select.Option key={index} value={data.value}>
                                {data.label}
                              </Select.Option>
                             )
                          })}
                        </Select>
                      </Form.Item>
                    </Form>
                  </th>
                  <th></th>
                  <th>
                  <Form>
                      <Form.Item>
                        <Input
                          placeholder="abc"
                          onKeyDown={(e) => handleSearch(e, "timeOfLearning")}
                        />
                      </Form.Item>
                    </Form>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentPageData.map((data, index) => (
                  <tr key={data.id}>
                    <td>
                      <Checkbox
                        checked={selectedRowKeys.includes(data.id)}
                        onChange={() => handleRowSelectChange(data.id)}
                      />
                    </td>
                    {columns[0] && !columns[0].hidden && <td>{index + 1}</td>}
                    {columns[1] && !columns[1].hidden && (
                      <td>
                        <Button onClick={() => handleEdit(data)}>
                          <SettingOutlined />
                        </Button>
                      </td>
                    )}
                    {columns[2] && !columns[2].hidden && (
                      <td>
                        <Tag
                          color={data.status === "intern" ? "gold" : "green"}
                        >
                          {data.status === "intern" ? "tập sự" : "chính thức"}
                        </Tag>
                      </td>
                    )}
                    {columns[3] && !columns[3].hidden && (
                      <td>{data.fullName}</td>
                    )}
                    {columns[4] && !columns[4].hidden && (
                      <td>{data.birthDay}</td>
                    )}
                    {columns[5] && !columns[5].hidden && (
                      <td>{data.probationDay}</td>
                    )}
                    {columns[6] && !columns[6].hidden && (
                      <td>{data.probationYear}</td>
                    )}
                    {columns[7] && !columns[7].hidden && (
                      <td>{data.identifyNumber}</td>
                    )}
                    {columns[8] && !columns[8].hidden && (
                      <td>{data.identifyDay}</td>
                    )}
                    {columns[9] && !columns[9].hidden && (
                      <td>
                        <Tag
                          color={
                            data.organization === "black" ? "red" : "green"
                          }
                        >
                          {data.organization === "black"
                            ? "xã hội đen"
                            : "xã hội đỏ"}
                        </Tag>
                      </td>
                    )}
                    {columns[10] && !columns[10].hidden && (
                      <td>{data.certificate}</td>
                    )}
                    {columns[11] && !columns[11].hidden && (
                      <td>{data.TimeOfLearning}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <div className="totalUser">Tổng số user: {dataTable.length}</div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                onChange={handlePageChange}
                total={filteredData.length}
              />
            </div>
          </>
        )}
      </div>
      <Modal
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        destroyOnClose
      > 
          <ModalAdd
            record={edittingRecord}
            isAdding={isAdding}
            closeModal={() => setIsModalVisible(false)}
          />
      </Modal>
    </>
  );
};

export default Table;
