/* eslint-disable */
import React from 'react';
import { Form, Modal, Button, Input } from 'antd';
import { L } from '../../../../i18next';
import {
  EventCategoryDto,
  CreateOrUpdateEventCategoryDto,
} from '../../../../services/eventCategory/dto';
import localization from '../../../../lib/localization';
import { arabicNameRules, englishNameRules } from '../../../../constants';

interface CreateOrUpdateEventCategoryProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: CreateOrUpdateEventCategoryDto) => void;
  isSubmittingEventCategory: boolean;
  categoryData?: EventCategoryDto;
  modalType: string;
}

const CreateOrUpdateEventCategory: React.FC<CreateOrUpdateEventCategoryProps> = ({
  visible,
  onCancel,
  onOk,
  isSubmittingEventCategory,
  categoryData,
  modalType,
}) => {
  const [form] = Form.useForm();
  // Handle Form Submit
  const handleSubmit = async () => {
    const values = await form.validateFields();
    try {
      if (categoryData?.id && modalType === 'update') {
        values.id = categoryData.id;
      }
      await onOk(values);
      await form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      visible={visible}
      title={L('CreateEventCategory')}
      onCancel={onCancel}
      centered
      destroyOnClose
      width={'80%'}
      maskClosable={false}
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={isSubmittingEventCategory}
          onClick={handleSubmit}
        >
          {modalType === 'create' ? L('CreateEventCategory') : L('UpdateEventCategory')}
        </Button>,
      ]}
    >
      {' '}
      <div className="scrollable-modal">
        <Form
          initialValues={categoryData}
          name="basic"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          form={form}
        >
          {/* Arabic Title */}
          <Form.Item label={L('ArName')} name="arName" rules={arabicNameRules}>
            <Input type="text" dir="auto" />
          </Form.Item>

          {/* English Title */}
          <Form.Item label={L('EnName')} name="enName" rules={englishNameRules}>
            <Input type="text" dir="auto" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};
export default CreateOrUpdateEventCategory;
