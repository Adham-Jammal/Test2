/* eslint-disable */

import React, { useEffect, useState } from 'react';
import { Form, Modal, Button, Input, Select, Row, Col, InputNumber, Divider } from 'antd';

import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import './index.less';
import { CreateOrUpdateQuestionDto, QuestionDto } from '../../../services/questions/dto';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import FormItem from 'antd/lib/form/FormItem';
import EditableImage from '../../../components/EditableImage';
import { QuestionType } from '../../../lib/types';
import { convertImageToImageArr } from '../../../helpers';

interface CreateOrUpdateQuestionProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateQuestionDto) => void;
  isSubmittingQuestion: boolean;
  questionData?: QuestionDto;
}

const formLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 8 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
    md: { span: 16 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};

const choiceItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 24 },
    xl: { span: 24 },
    xxl: { span: 24 },
  },
};

const CreateOrUpdateQuestion: React.FC<CreateOrUpdateQuestionProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingQuestion,
  questionData,
}) => {
  const [form] = Form.useForm();
  const [choicesData, setChoicesData] = useState<
    Array<{ key: number; enContent: string; arContent: string; imageUrl: string | undefined }>
  >([]);

  useEffect(() => {
    if (questionData && modalType === 'update') {
      const { choices } = questionData;
      let newChoices: Array<{
        key: number;
        enContent: string;
        arContent: string;
        imageUrl: string;
      }> = [];
      choices.map((choice: any, index: number) =>
        newChoices.push({
          key: index,
          enContent: choice.enContent,
          arContent: choice.arContent,
          imageUrl: choice.imageUrl,
        })
      );
      setChoicesData(newChoices);
      // setChoiceImages(imgs);
      form.setFieldsValue(questionData);
    }
  }, [questionData]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      values.isActive = true;
      values.choices = choicesData;
      onOk(modalType === 'update' ? { ...values, id: questionData!.id } : values);
    });
  };
  const required = { required: true, message: L('ThisFieldIsRequired') };

  return (
    <Modal
      width="85%"
      style={{ padding: '20px' }}
      visible={visible}
      title={modalType === 'create' ? L('AddQuestion') : L('EditQuestion')}
      onCancel={onCancel}
      centered
      maskClosable={false}
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingQuestion} onClick={handleSubmit}>
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
            <Form.Item label={L('ArContent')} name="arContent" rules={[required]}>
              <Input.TextArea dir="auto" rows={5} />
            </Form.Item>

            <Form.Item name={'type'} rules={[required]} label={L('Type')}>
              <Select placeholder={L('PleaseSelectQuestionType')}>
                <Select.Option key={QuestionType.Personality} value={QuestionType.Personality}>
                  {L('Personality')}
                </Select.Option>
                <Select.Option key={QuestionType.Preference} value={QuestionType.Preference}>
                  {L('Preference')}
                </Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 20, offset: 0 }}
            lg={{ span: 11, offset: 2 }}
          >
            <Form.Item label={L('EnContent')} name="enContent" rules={[required]}>
              <Input.TextArea dir="auto" rows={5} />
            </Form.Item>

            <Form.Item name={'order'} rules={[required]} label={L('Order')}>
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Divider />
          <h4>
            {L('ManageChoices')}
            <br />
            <br />
          </h4>
          <Col
            xs={{ span: 24, offset: 0 }}
            md={{ span: 24, offset: 0 }}
            lg={{ span: 24, offset: 0 }}
          >
            <Form.List
              // {...formItemLayout}
              name="choices"
              initialValue={questionData?.choices}
              children={(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                <>
                  {fields.map((field: FormListFieldData, index) => (
                    <div className="main-nutritions" key={index}>
                      <Row>
                        <Col
                          xs={{ span: 24, offset: 0 }}
                          md={{ span: 24, offset: 0 }}
                          lg={{ span: 9, offset: 0 }}
                        >
                          {' '}
                          <FormItem
                            {...choiceItemLayout}
                            {...field}
                            name={[field.name, 'enContent']}
                            fieldKey={[field.key, 'enContent']}
                            rules={[required]}
                            label={L('EnContent')}
                            initialValue={
                              choicesData && choicesData.length > 0
                                ? choicesData.filter((item: any) => item.key === field.key)[0]
                                    ?.enContent
                                : undefined
                            }
                          >
                            <Input.TextArea
                              rows={4}
                              dir="auto"
                              onChange={(e) => {
                                const oldChoices = choicesData;
                                const newChoices = oldChoices.filter(
                                  (item: any) => item.key !== field.key
                                );
                                const oldChoice = oldChoices.filter(
                                  (item: any) => item.key === field.key
                                )[0];
                                setChoicesData([
                                  ...newChoices,
                                  {
                                    key: field.key,
                                    arContent: oldChoice?.arContent,
                                    enContent: e.target.value,
                                    imageUrl: oldChoice?.imageUrl,
                                  },
                                ]);
                              }}
                            />
                          </FormItem>
                        </Col>
                        <Col
                          xs={{ span: 24, offset: 0 }}
                          md={{ span: 24, offset: 0 }}
                          lg={{ span: 9, offset: 2 }}
                        >
                          {' '}
                          <FormItem
                            {...choiceItemLayout}
                            {...field}
                            name={[field.name, 'arContent']}
                            fieldKey={[field.key, 'arContent']}
                            rules={[required]}
                            label={L('ArContent')}
                            initialValue={
                              choicesData && choicesData.length > 0
                                ? choicesData.filter((item: any) => item.key === field.key)[0]
                                    ?.arContent
                                : undefined
                            }
                          >
                            <Input.TextArea
                              rows={4}
                              dir="auto"
                              onChange={(e) => {
                                const oldChoices = choicesData;
                                const newChoices = oldChoices.filter(
                                  (item: any) => item.key !== field.key
                                );
                                const oldChoice = oldChoices.filter(
                                  (item: any) => item.key === field.key
                                )[0];
                                setChoicesData([
                                  ...newChoices,
                                  {
                                    key: field.key,
                                    arContent: e.target.value,
                                    enContent: oldChoice?.enContent,
                                    imageUrl: oldChoice?.imageUrl,
                                  },
                                ]);
                              }}
                            />
                          </FormItem>
                        </Col>
                        <Col
                          xs={{ span: 24, offset: 0 }}
                          md={{ span: 24, offset: 0 }}
                          lg={{ span: 3, offset: 1 }}
                        >
                          <Form.Item
                            {...choiceItemLayout}
                            {...field}
                            name={[field.name, 'imageUrl']}
                            fieldKey={[field.key, 'imageUrl']}
                            required
                            label={L('ChoiceImage')}
                            initialValue={
                              choicesData && choicesData.length > 0
                                ? choicesData.filter((item: any) => item.key === field.key)[0]
                                    ?.imageUrl
                                : undefined
                            }
                          >
                            <EditableImage
                              defaultFileList={
                                choicesData && choicesData.length > 0
                                  ? convertImageToImageArr(
                                      choicesData.filter((item: any) => item.key === field.key)[0]
                                        ?.imageUrl!,
                                      'imageUrl'
                                    )
                                  : []
                              }
                              onSuccess={(url: string) => {
                                const oldChoices = choicesData;
                                const newChoices = oldChoices.filter(
                                  (item: any) => item.key !== field.key
                                );
                                const oldChoice = oldChoices.filter(
                                  (item: any) => item.key === field.key
                                )[0];
                                setChoicesData([
                                  ...newChoices,
                                  {
                                    key: field.key,
                                    arContent: oldChoice?.arContent,
                                    enContent: oldChoice?.enContent,
                                    imageUrl: url,
                                  },
                                ]);
                              }}
                              onRemove={() => {
                                const oldChoices = choicesData;
                                const newChoices = oldChoices.filter(
                                  (item: any) => item.key !== index
                                );
                                const oldChoice = oldChoices.filter(
                                  (item: any) => item.key === index
                                )[0];
                                setChoicesData([
                                  ...newChoices,
                                  {
                                    key: index,
                                    arContent: oldChoice?.arContent,
                                    enContent: oldChoice?.enContent,
                                    imageUrl: undefined,
                                  },
                                ]);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <Button
                        onClick={() => {
                          remove(field.name);
                          const newChoices = choicesData.filter(
                            (item: any) => item.key !== field.key
                          );
                          setChoicesData(newChoices);
                        }}
                        danger
                        className="nutritions-btn"
                      >
                        <MinusCircleOutlined />
                        {`${L('DeleteChoice')} ${index + 1}`}
                      </Button>
                      <Divider />
                    </div>
                  ))}
                  <Button type="dashed" onClick={() => add()} block>
                    <PlusOutlined /> {L('AddChoice')}
                  </Button>
                </>
              )}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateQuestion;
