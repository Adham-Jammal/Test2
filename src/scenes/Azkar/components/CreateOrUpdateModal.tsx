/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select, message } from 'antd';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import moment from 'moment';
import arabic from 'react-date-object/calendars/arabic';
import arabic_en from 'react-date-object/locales/arabic_en';
import arabic_ar from 'react-date-object/locales/arabic_ar';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { AzkarDto, CreateOrUpdateAzkarDto } from '../../../services/azkar/dto';
import { validateArName, validateEnName } from '../../Events/helpers';
import './index.less';
import { AzkarCategory } from '../../../lib/types';

interface CreateOrUpdateAzkarProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateAzkarDto) => void;
  isSubmittingAzkar: boolean;
  azkarData?: AzkarDto;
}
interface ItemValidation {
  value: string;
  validateStatus?: any;
  errorMsg: string | null;
}
const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    lg: { span: 5 },
    xl: { span: 5 },
    xxl: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 19 },
    xl: { span: 19 },
    xxl: { span: 19 },
  },
};
const CreateOrUpdateAzkar: React.FC<CreateOrUpdateAzkarProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingAzkar,
  azkarData,
}) => {
  const [form] = Form.useForm();
  const [arabicName, setArabicName] = useState<ItemValidation>();
  const [englishName, setEnglishName] = useState<ItemValidation>();

  useEffect(() => {
    if (azkarData && modalType === 'update') {
      const { toDate, fromDate } = azkarData;
      const newEventData = {
        ...azkarData,
        toDate: new Date(toDate),
        fromDate: new Date(fromDate),
      };
      form.setFieldsValue(newEventData);
    }
  }, [azkarData]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const { toDate, fromDate } = values;
      if (moment(fromDate).isAfter(toDate)) {
        message.error(L('TheStartDateShouldBeLessThanOrEqualEndDate'));
        return;
      }
      onOk(modalType === 'update' ? { ...values, id: azkarData!.id } : values);
    });
  };
  const required = { required: true, message: L('ThisFieldIsRequired') };

  // handle name change
  const handleArTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setArabicName({ ...validateArName(value), value });
  };

  // handle En Name change
  const handleEnTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setEnglishName({ ...validateEnName(value), value });
  };

  return (
    <Modal
      width="900px"
      style={{ padding: '20px' }}
      visible={visible}
      title={modalType === 'create' ? L('addAzkar') : L('editAzkar')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingAzkar} onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      <Form preserve={false} form={form} {...formLayout} scrollToFirstError>
        {/* category */}
        <Form.Item label={L('Category')} name="category" rules={[required]}>
          <Select>
            <Select.Option value={AzkarCategory.Morning}>{L('morning')}</Select.Option>
            <Select.Option value={AzkarCategory.Evening}>{L('evening')}</Select.Option>
            <Select.Option value={AzkarCategory.AfterPrayer}>{L('afterPrayer')}</Select.Option>
          </Select>
        </Form.Item>
        {/* arabic title  */}
        <Form.Item
          label={L('ArName')}
          name="arTitle"
          validateStatus={arabicName?.validateStatus}
          help={arabicName?.errorMsg}
        >
          <Input type="text" onChange={handleArTitleChange} />
        </Form.Item>
        {/* english title  */}
        <Form.Item
          label={L('EnName')}
          name="enTitle"
          validateStatus={englishName?.validateStatus}
          help={englishName?.errorMsg}
        >
          <Input type="text" onChange={handleEnTitleChange} />
        </Form.Item>

        {/* Azkar start time and end time  */}
        <Form.Item className="azkar-date" label={L('azkarDate(fromTo)')}>
          <Input.Group compact>
            <Form.Item className="start-date-input" name="fromDate" rules={[required]}>
              <DatePicker
                calendar={arabic}
                locale={localization.isRTL() ? arabic_ar : arabic_en}
                placeholder={L('FromDate')}
                onChange={(val) => {
                  if (val instanceof DateObject) {
                    form.setFieldsValue({ fromDate: val.toDate().toISOString() });
                  }
                }}
              />
            </Form.Item>

            {/* event end time */}
            <Form.Item className="end-date-input" name="toDate" rules={[required]}>
              <DatePicker
                calendar={arabic}
                locale={localization.isRTL() ? arabic_ar : arabic_en}
                placeholder={L('ToDate')}
                onChange={(val) => {
                  if (val instanceof DateObject) {
                    form.setFieldsValue({ toDate: val.toDate().toISOString() });
                  }
                }}
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        {/* status */}
        <Form.Item label={L('IsActive')} name="isActive" initialValue={false}>
          <Select>
            <Select.Option value={false}>{L('Inactive')}</Select.Option>
            <Select.Option value={true}>{L('Active')}</Select.Option>
          </Select>
        </Form.Item>

        {/* arabic content */}
        <Form.Item label={L('azkarArabicContent')} name="arContent" rules={[required]}>
          <Input.TextArea dir="auto" rows={5} />
        </Form.Item>

        {/* english content */}
        <Form.Item label={L('azkarEnglishContent')} name="enContent" rules={[required]}>
          <Input.TextArea dir="auto" rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateAzkar;
