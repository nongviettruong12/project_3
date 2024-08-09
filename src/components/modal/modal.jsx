import {
    ProForm,
    ProFormDatePicker,
    ProFormSelect,
    ProFormText,
  } from "@ant-design/pro-components";
  import { Form, message } from "antd";
  import { useNavigate, useParams } from 'react-router-dom'
  import { useState, useEffect } from "react"
  
  const ModalAdd = ({record, isAdding, closeModal}) => {
    const waitTime = (time = 100) => {
    };
    const navigate = useNavigate();
    const { id } = useParams();
    const [form] = Form.useForm();
    const [values, setValues] = useState(null);
    useEffect(() => {
      if (record && !isAdding) {
        setValues(record);
        form.setFieldsValue(record);
      } else {
        form.resetFields();
      }
    }, [record, isAdding, form]);
    const handleSubmit = async (values) => {
      try {
        const url = isAdding
          ? "http://localhost:3000/user"
          : `http://localhost:3000/user/${record?.id}`;
        const method = isAdding ? "POST" : "PUT";
  
        await waitTime(2000);
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
  
        if (!response.ok) {
          throw new Error("Failed to submit form");
        }
  
        message.success(isAdding ? "Added successfully" : "Updated successfully");
        setTimeout(() => {
          window.location.reload();
          navigate("/");
        }, 2000);
      } catch (error) {
        console.error("Error submitting form:", error);
        message.error("Error submitting form");
      }
    };
    return (
      <>
      <ProForm
        form={form}
        onFinish={handleSubmit}
        initialValues={values}
        modalProps={{
          destroyOnClose: true,
          onCancel: closeModal,
        }}
        submitTimeout={2000}
      >
        <ProForm.Group>
          <ProFormText
            name="fullName"
            label="họ và tên"
            placeholder="vui lòng nhập tên"
          />
          <ProFormDatePicker
            width="md"
            name="birthDay"
            label="Ngày sinh"
            placeholder="vui lòng nhập ngày sinh"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormSelect
            options={[
              {
                value: "intern",
                label: "tập sự",
              },
              {
                value: "official",
                label: "chính thức",
              },
            ]}
            width="xs"
            name="status"
            label="trạng thái"
          />
          <ProFormSelect
            width="xs"
            options={[
              {
                value: "black",
                label: "xã hội đen",
              },
              {
                value: "red",
                label: "xã hội đỏ",
              },
            ]}
            name="organization"
            label="Tổ chức hành nghề"
          />
        </ProForm.Group>
        <ProFormDatePicker
            width="md"
            name="probationDay"
            label="Ngày tập sự"
            placeholder="vui lòng nhập ngày tập sự"
          />
        <ProFormText
            width="md"
            name="probationYear"
            label="năm tập sự"
            placeholder="vui lòng nhập năm tập sự"
          />
        <ProFormText
            width="md"
            name="identifyNumber"
            label="Số CCCD"
            placeholder="vui lòng nhập số CCCD"
          />
          <ProFormDatePicker
            width="md"
            name="identifyDay"
            label="Ngày cấp"
            placeholder="vui lòng ngày cấp CCCD"
          />
          <ProFormText
            width="md"
            name="certificate"
            label="Chứng chỉ"
            placeholder="vui lòng nhập chứng chỉ"
          />
          <ProFormText
            width="md"
            name="TimeOfLearning"
            label="Thời gian học"
            placeholder="vui lòng nhập thời gian học"
          />
      </ProForm>
      </>
    );
  };
  export default ModalAdd;