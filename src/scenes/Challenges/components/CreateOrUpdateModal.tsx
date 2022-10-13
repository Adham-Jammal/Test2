/* eslint-disable */

import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, Row, Col, InputNumber, DatePicker } from 'antd';

import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import { convertImageToImageArr, validateArName, validateEnName } from '../../Events/helpers';
import './index.less';
import { ChallengeDto, CreateOrUpdateChallengeDto } from '../../../services/challenges/dto';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';
import GoogleMapComp from '../../../components/GoogleMap';
import moment from 'moment';

interface CreateOrUpdateChallengeProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateChallengeDto) => void;
  isSubmittingChallenge: boolean;
  challengeData?: ChallengeDto;
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

const CreateOrUpdateChallenge: React.FC<CreateOrUpdateChallengeProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingChallenge,
  challengeData,
}) => {
  const [form] = Form.useForm();
  const [challengeImage, setChallengeImage] = useState<ImageAttr[]>([]);
  const [firstLat, setFirstLat] = useState<number>(24.633333);
  const [firstLng, setFirstLng] = useState<number>(46.716667);
  const [targetLat, setTargetLat] = useState<number>(24.633333);
  const [targetLng, setTargetLng] = useState<number>(46.716667);
  const [arabicTitle, setArabicTitle] = useState<ItemValidation>();

  const [englishTitle, setEnglishTitle] = useState<ItemValidation>();

  useEffect(() => {
    if (challengeData && modalType === 'update') {
      setFirstLat(+challengeData!.firstLocationLatitude);
      setFirstLng(+challengeData!.firstLocationLongitude);
      setTargetLat(+challengeData!.targetLocationLatitude);
      setTargetLng(+challengeData!.targetLocationLongitude);
      setChallengeImage(convertImageToImageArr(challengeData!.imageUrl, 'imageUrl'));

      const newData = {
        ...challengeData,
        firstLocationDescription: { lat: firstLat, lng: firstLng },
        targetLocationDescription: { lat: targetLat, lng: targetLng },
        date: moment(challengeData!.date),
      };
      form.setFieldsValue(newData);
    }
  }, [challengeData]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      values.firstLocationLatitude = values.firstLocationDescription.lat;
      values.firstLocationLongitude = values.firstLocationDescription.lng;
      values.targetLocationLongitude = values.targetLocationDescription.lng;
      values.targetLocationLatitude = values.targetLocationDescription.lat;

      onOk(modalType === 'update' ? { ...values, id: challengeData!.id } : values);
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
      title={modalType === 'create' ? L('AddChallenge') : L('EditChallenge')}
      onCancel={onCancel}
      centered
      maskClosable={false}
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingChallenge} onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      {' '}
      <div className="scrollable-modal">
        <Form preserve={false} form={form} {...formLayout} scrollToFirstError>
          {/* arabic title  */}
          <Row>
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 20, offset: 0 }}
              lg={{ span: 11, offset: 0 }}
            >
              <Form.Item
                label={L('ArTitle')}
                name="arTitle"
                rules={[required]}
                validateStatus={arabicTitle?.validateStatus}
                help={arabicTitle?.errorMsg}
              >
                <Input type="text" onChange={handleArTitleChange} />
              </Form.Item>
              {/* english title  */}
              <Form.Item
                label={L('EnTitle')}
                name="enTitle"
                rules={[required]}
                validateStatus={englishTitle?.validateStatus}
                help={englishTitle?.errorMsg}
              >
                <Input type="text" onChange={handleEnTitleChange} />
              </Form.Item>
              {/* arabic content */}
              <Form.Item label={L('ArabicDescription')} name="arDescription" rules={[required]}>
                <Input.TextArea dir="auto" rows={5} />
              </Form.Item>

              {/* english content */}
              <Form.Item label={L('EnglishDescription')} name="enDescription" rules={[required]}>
                <Input.TextArea dir="auto" rows={5} />
              </Form.Item>
            </Col>
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 20, offset: 0 }}
              lg={{ span: 11, offset: 2 }}
            >
              <Form.Item name={'points'} rules={[required]} label={L('Points')}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name={'minNumOfInvitee'} rules={[required]} label={L('MinNumOfInvitee')}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label={L('OrganizerName')} name="organizer" rules={[required]}>
                <Input type="text" />
              </Form.Item>

              <Form.Item name="date" rules={[required]} label={L('ChallengeDate')}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item label={L('ChallengeImage')} name="imageUrl" rules={[required]}>
                <EditableImage
                  defaultFileList={challengeData! ? challengeImage : []}
                  onSuccess={(url: string) => form.setFieldsValue({ imageUrl: url })}
                  onRemove={() => form.setFieldsValue({ imageUrl: undefined })}
                />
              </Form.Item>
            </Col>
            <Col
              style={{ marginTop: '15px' }}
              xs={{ span: 24, offset: 0 }}
              md={{ span: 18, offset: 0 }}
              lg={{ span: 18, offset: 0 }}
            >
              <Form.Item label={L('FirstLocationName')} name="firstLocationName" rules={[required]}>
                <Input type="text" />
              </Form.Item>

              <Form.Item
                label={L('FirstLocationOnTheMap')}
                name="firstLocationDescription"
                rules={[required]}
              >
                <small className="map-hint-text">{L('pleaseSelectThePositionFromMap')}</small>
                <GoogleMapComp
                  withClick={false}
                  position={firstLat && firstLng ? { lat: firstLat, lng: firstLng } : undefined}
                  handlePointClick={(val: google.maps.LatLngLiteral) =>
                    form.setFieldsValue({ firstLocationDescription: val })
                  }
                />
              </Form.Item>
              <Form.Item
                label={L('TargetLocationName')}
                name="targetLocationName"
                rules={[required]}
              >
                <Input type="text" />
              </Form.Item>

              <Form.Item
                label={L('TargetLocationOnTheMap')}
                name="targetLocationDescription"
                rules={[required]}
              >
                <small className="map-hint-text">{L('pleaseSelectThePositionFromMap')}</small>
                <GoogleMapComp
                  withClick={false}
                  position={targetLat && targetLng ? { lat: targetLat, lng: targetLng } : undefined}
                  handlePointClick={(val: google.maps.LatLngLiteral) =>
                    form.setFieldsValue({ targetLocationDescription: val })
                  }
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default CreateOrUpdateChallenge;
