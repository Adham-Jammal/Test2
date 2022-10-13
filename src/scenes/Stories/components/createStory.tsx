/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Form, Modal, Button, Input, InputNumber, Radio, Row, Col } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { CKEditor } from 'ckeditor4-react';
import { L } from '../../../i18next';
import { CreateStoryDto, StoryDto, UpdateStoryDto } from '../../../services/story/dto';
import localization from '../../../lib/localization';
import { arabicNameRules, englishNameRules } from '../../../constants';
import UploadMedia from './uploadMedia';
import AppConsts from '../../../lib/appconst';

interface CreateOrUpdateStoryProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: CreateStoryDto | UpdateStoryDto) => void;
  isSubmittingStory: boolean;
  storyModel?: StoryDto;
  modalType: string;
}

const CreateOrUpdateStory: React.FC<CreateOrUpdateStoryProps> = ({
  visible,
  onCancel,
  onOk,
  isSubmittingStory,
  storyModel,
  modalType,
}) => {
  const [form] = Form.useForm();
  const [mediaType, setMediaType] = useState<number>(1);
  const [mediaTypePrefer, setMediaTypePrefer] = useState<number>(2);
  const [url, setURL] = useState<string | undefined>(undefined);
  const [uploadAction, setUploadAction] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (storyModel) {
      if (storyModel!.videoLink) {
        setMediaType(1);
        setUploadAction(AppConsts.uploadVideoEndpoint);
      } else if (storyModel!.imageUrl) {
        setMediaType(2);
        setUploadAction(AppConsts.uploadImageEndpoint);
      } else if (storyModel!.voiceLink) {
        setMediaType(3);
        setUploadAction(AppConsts.uploadVoiceEndpoint);
      }
    } else {
      setMediaType(1);
      setUploadAction(AppConsts.uploadVideoEndpoint);
    }
  }, [storyModel]);

  // Handle Form Submit
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (mediaTypePrefer === 1) {
        if (mediaType === 1) values.videoLink = url;
        if (mediaType === 2) values.imageUrl = url;
        if (mediaType === 3) values.voiceLink = url;
      }
      await onOk(values);
      await form.resetFields();
    } catch (error) {
      console.error(error);
    }
  };

  // Form Basic Empty Validation
  const required = { required: true, message: L('PleaseFillThisField') };

  const config = {
    format_tags: 'p;h1;h2;h3;h4;h5;h6',
  };

  return (
    <Modal
      visible={visible}
      title={modalType === 'Create' ? L('CreateStory') : L('updateStory')}
      onCancel={onCancel}
      width={'90%'}
      centered
      destroyOnClose
      maskClosable={false}
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingStory} onClick={handleSubmit}>
          {L(`${modalType}`)}
        </Button>,
      ]}
    >
      <Form name="basic" layout="vertical" onFinish={handleSubmit} autoComplete="off" form={form}>
        <Row>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 10, offset: 0 }}
          >
            <Form.Item
              label={L('ArTitle')}
              name="arTitle"
              rules={arabicNameRules}
              initialValue={storyModel?.arTitle}
            >
              <Input type="text" dir="auto" />
            </Form.Item>

            <Form.Item
              label={L('EnTitle')}
              name="enTitle"
              rules={englishNameRules}
              initialValue={storyModel?.enTitle}
            >
              <Input type="text" dir="auto" />
            </Form.Item>

            <Form.Item
              name="hours"
              rules={[required]}
              initialValue={storyModel?.hours}
              label={`${L('StoryTime')} (${L('Hour')})`}
            >
              <InputNumber style={{ width: '100%' }} min={0} defaultValue={storyModel?.hours} />
            </Form.Item>
            <Form.Item label={L('mediaType')} initialValue={1}>
              <Radio.Group
                value={mediaType}
                onChange={(e: RadioChangeEvent) => {
                  setMediaType(e.target.value);
                  if (e.target.value === 1) setUploadAction(AppConsts.uploadVideoEndpoint);
                  if (e.target.value === 2) setUploadAction(AppConsts.uploadImageEndpoint);
                  if (e.target.value === 3) setUploadAction(AppConsts.uploadVoiceEndpoint);
                }}
              >
                <Radio value={1}>{L('video')}</Radio>
                <Radio value={2}>{L('image')}</Radio>
                <Radio value={3}>{L('audio')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={L('WhichPrefer')} initialValue={2}>
              <Radio.Group
                defaultValue={2}
                onChange={(e: RadioChangeEvent) => {
                  setMediaTypePrefer(e.target.value);
                  if (mediaType === 1) setUploadAction(AppConsts.uploadVideoEndpoint);
                  if (mediaType === 2) setUploadAction(AppConsts.uploadImageEndpoint);
                  if (mediaType === 3) setUploadAction(AppConsts.uploadVoiceEndpoint);
                }}
              >
                <Radio value={1}>{L('UploadMediaToServer')}</Radio>
                <Radio value={2}>{L('ExternalLink')}</Radio>
              </Radio.Group>
            </Form.Item>

            {mediaTypePrefer === 1 ? (
              <div style={{ marginBottom: 20 }}>
                <UploadMedia setURL={setURL} mediaType={mediaType} action={uploadAction!} />
              </div>
            ) : (
              <>
                {/* English Title */}
                {mediaType === 1 && (
                  <Form.Item
                    label={`${L('VideoLink')}`}
                    name="videoLink"
                    rules={[
                      required,
                      // {
                      //   pattern:
                      //     /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/,
                      //   message: L('PLeaseAddYouTubeLink'),
                      // },
                    ]}
                    initialValue={storyModel?.videoLink}
                  >
                    <Input type="text" dir="auto" />
                  </Form.Item>
                )}

                {/* Upload Story Image */}
                {mediaType === 2 && (
                  <Form.Item
                    label={L('ImageLink')}
                    name="imageUrl"
                    rules={[required]}
                    initialValue={storyModel?.imageUrl}
                  >
                    <Input type="text" dir="auto" />
                  </Form.Item>
                )}
                {mediaType === 3 && (
                  <Form.Item
                    label={L('voiceLink')}
                    name="voiceLink"
                    rules={[required]}
                    initialValue={storyModel?.voiceLink}
                  >
                    <Input type="text" dir="auto" />
                  </Form.Item>
                )}
              </>
            )}
          </Col>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 10, offset: 2 }}
          >
            <Form.Item
              label={L('ArDescription')}
              name="arDescription"
              rules={[required]}
              initialValue={storyModel?.arDescription}
            >
              <CKEditor
                initData={storyModel?.arDescription}
                config={{ ...config, contentsLangDirection: 'rtl' }}
                onChange={(event) => {
                  form.setFieldsValue({ arDescription: event.editor.getData() });
                }}
              />
            </Form.Item>

            <Form.Item
              label={L('EnDescription')}
              name="enDescription"
              rules={[required]}
              initialValue={storyModel?.enDescription}
            >
              <CKEditor
                initData={storyModel?.enDescription}
                config={config}
                onChange={(event) => {
                  form.setFieldsValue({ enDescription: event.editor.getData() });
                }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
export default CreateOrUpdateStory;
