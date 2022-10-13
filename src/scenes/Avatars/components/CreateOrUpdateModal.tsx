/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Select, Row, Col } from 'antd';

import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { convertImageToImageArr, validateArName, validateEnName } from '../../Events/helpers';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';
import { AvatarDto, CreateOrUpdateAvatarDto } from '../../../services/avatars/dto';
import { GenderType, MonthName } from '../../../lib/types';

interface CreateOrUpdateAvatarProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateAvatarDto) => void;
  isSubmittingAvatar: boolean;
  avatarData?: AvatarDto;
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
    md: { span: 10 },
    lg: { span: 9 },
    xl: { span: 9 },
    xxl: { span: 9 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 14 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const CreateOrUpdateAvatar: React.FC<CreateOrUpdateAvatarProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingAvatar,
  avatarData,
}) => {
  const [form] = Form.useForm();
  const [avatarImage, setAvatarImage] = useState<ImageAttr[]>([]);

  const [arabicTitle, setArabicTitle] = useState<ItemValidation>();

  const [englishTitle, setEnglishTitle] = useState<ItemValidation>();

  useEffect(() => {
    if (avatarData && modalType === 'update') {
      setAvatarImage(convertImageToImageArr(avatarData!.image, 'image'));
      form.setFieldsValue(avatarData);
    }
  }, [avatarData]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onOk(modalType === 'update' ? { ...values, id: avatarData!.id } : values);
    });
  };
  const required = { required: true, message: L('ThisFieldIsRequired') };

  // handle name change
  const handleArTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setArabicTitle({ ...validateArName(value), value });
  };

  // handle En Name change
  const handleEnTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setEnglishTitle({ ...validateEnName(value), value });
  };

  return (
    <Modal
      width="95%"
      style={{ padding: '20px' }}
      visible={visible}
      title={modalType === 'create' ? L('AddAvatar') : L('EditAvatar')}
      onCancel={onCancel}
      centered
      maskClosable={false}
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingAvatar} onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      <Form preserve={false} form={form} {...formLayout} scrollToFirstError>
        <Row>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 11, offset: 0 }}
          >
            <Form.Item
              label={L('ArabicName')}
              name="arName"
              rules={[required]}
              validateStatus={arabicTitle?.validateStatus}
              help={arabicTitle?.errorMsg}
            >
              <Input type="text" onChange={handleArTitleChange} />
            </Form.Item>
            <Form.Item
              label={L('EnglishName')}
              name="enName"
              rules={[required]}
              validateStatus={englishTitle?.validateStatus}
              help={englishTitle?.errorMsg}
            >
              <Input type="text" onChange={handleEnTitleChange} />
            </Form.Item>
            <Form.Item label={L('ArabicDescription')} name="arDescription">
              <Input.TextArea dir="auto" rows={5} />
            </Form.Item>

            <Form.Item label={L('EnglishDescription')} name="enDescription">
              <Input.TextArea dir="auto" rows={5} />
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 11, offset: 2 }}
          >
            <Form.Item label={L('Gender')} name="gender">
              <Select placeholder={L('PleaseSelectGender')}>
                <Select.Option key={GenderType.Male} value={GenderType.Male}>
                  {L('Male')}
                </Select.Option>
                <Select.Option key={GenderType.Female} value={GenderType.Female}>
                  {L('Female')}
                </Select.Option>{' '}
              </Select>
            </Form.Item>
            <Form.Item label={L('BirthMonth')} name="month">
              <Select defaultValue={MonthName.NotSet}>
                <Select.Option key={MonthName.NotSet} value={MonthName.NotSet}>
                  {L('NotSet')}
                </Select.Option>
                <Select.Option key={MonthName.January} value={MonthName.January}>
                  {L('January')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.February} value={MonthName.February}>
                  {L('February')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.March} value={MonthName.March}>
                  {L('March')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.April} value={MonthName.April}>
                  {L('April')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.May} value={MonthName.May}>
                  {L('May')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.June} value={MonthName.June}>
                  {L('June')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.July} value={MonthName.July}>
                  {L('July')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.August} value={MonthName.August}>
                  {L('August')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.September} value={MonthName.September}>
                  {L('September')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.October} value={MonthName.October}>
                  {L('October')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.November} value={MonthName.November}>
                  {L('November')}
                </Select.Option>{' '}
                <Select.Option key={MonthName.December} value={MonthName.December}>
                  {L('December')}
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={L('Image')}
              initialValue={avatarData! ? avatarData!.image : undefined}
              name="image"
              rules={[required]}
            >
              <EditableImage
                defaultFileList={avatarData! ? avatarImage : []}
                onSuccess={(url: string) => form.setFieldsValue({ image: url })}
                onRemove={() => form.setFieldsValue({ image: undefined })}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateAvatar;
