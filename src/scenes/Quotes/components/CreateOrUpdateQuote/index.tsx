/* eslint-disable */
import React from 'react';
import { Button, Modal, Form, Input } from 'antd';
import { L } from '../../../../i18next';
import localization from '../../../../lib/localization';
import { UpdateIndexDto } from '../../../../services/indexes/dto/updateIndexDto';
import { CreateIndexDto } from '../../../../services/indexes/dto/createIndexDto';
import { IndexDto } from '../../../../services/indexes/dto/IndexDto';
import { arabicNameRules, englishNameRules } from '../../../../constants';
import { IndexType } from '../../../../lib/types';

interface CreateOrUpdateQuoteProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: UpdateIndexDto | CreateIndexDto) => void;
  quoteData?: IndexDto;
  loading: boolean;
}

const CreateOrUpdateQuote: React.FC<CreateOrUpdateQuoteProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  quoteData,
  loading,
}) => {
  const [form] = Form.useForm();

  // handle submit the form
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (modalType !== 'create') {
        values.id = quoteData!.id;
      }
      values.type = IndexType.Quote;
      onOk(values);
    });
  };

  return (
    <Modal
      visible={visible}
      title={modalType === 'create' ? L('AddQuote') : L('UpdateQuote')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button loading={loading} key="submit" type="primary" onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      <Form
        initialValues={quoteData}
        preserve={false}
        form={form}
        layout="vertical"
        scrollToFirstError
      >
        {/* Ar Name */}
        <Form.Item
          label={L('ArName')}
          name="arName"
          rules={[
            ...arabicNameRules,
            { max: 100, message: L('quoteNameMustBeLessThanHundredCharacters') },
          ]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
        {/* En Name */}
        <Form.Item
          label={L('EnName')}
          name="enName"
          rules={[
            ...englishNameRules,
            { max: 100, message: L('quoteNameMustBeLessThanHundredCharacters') },
          ]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateQuote;
