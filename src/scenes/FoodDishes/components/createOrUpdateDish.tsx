/* eslint-disable */

import * as React from 'react';
import { Form, Modal, Button, Input, Select, Col, Row, InputNumber, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import { CKEditor } from 'ckeditor4-react';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';
import FoodDishesStore from '../../../stores/foodDishesStore';
import FoodCategoryStore from '../../../stores/foodCategoryStore';
import Stores from '../../../stores/storeIdentifier';
import { FoodCategoryDto } from '../../../services/foodCategory/dto/foodCategoryDto';

const required = {
  required: true,
  message: L('ThisFieldIsRequired'),
};
export interface ICreateOrUpdateDishProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (editors: any) => void;
  isSubmittingDish: boolean;
  formRef: React.RefObject<FormInstance>;
  foodDishesStore: FoodDishesStore;
  foodCategoryStore: FoodCategoryStore;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 8 },
    xl: { span: 8 },
    xxl: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 16 },
    xl: { span: 16 },
    xxl: { span: 16 },
  },
};
const formItemLayout1 = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 24 },
  lg: { span: 24 },
  xl: { span: 24 },
  xxl: { span: 24 },
};

const config = {
  format_tags: 'p;h1;h2;h3;h4;h5;h6',
};

export interface ICreateOrUpdateDishState {
  defaultImage: Array<ImageAttr>;
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enName: { value: string; validateStatus?: string; errorMsg: string | null };
  arAbout: { value: string; validateStatus?: string; errorMsg: string | null };
  enAbout: { value: string; validateStatus?: string; errorMsg: string | null };
}

@inject(Stores.FoodCategoryStore)
@observer
class CreateOrUpdateDish extends React.Component<
  ICreateOrUpdateDishProps,
  ICreateOrUpdateDishState
> {
  formRef = React.createRef<FormInstance>();

  async componentDidMount() {
    await this.props.foodCategoryStore!.getFoodCategories(true);
  }

  componentDidUpdate() {
    const { foodDishesModel } = this.props.foodDishesStore!;
    if (
      this.state.defaultImage.length === 0 &&
      foodDishesModel !== undefined &&
      foodDishesModel.imageUrl !== null
    ) {
      this.setState({
        defaultImage: [
          {
            uid: 1,
            name: `newsImage.png`,
            status: 'done',
            url: foodDishesModel.imageUrl,
            thumbUrl: foodDishesModel.imageUrl,
          },
        ],
      });
    }
  }

  arAboutEditor = null;

  enAboutEditor = null;

  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
    arAbout: { value: '', validateStatus: undefined, errorMsg: null },
    enAbout: { value: '', validateStatus: undefined, errorMsg: null },
    defaultImage: [],
  };

  validateArName = (value: string) => {
    const reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingEnglishSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }

    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  validateEnName = (value: string) => {
    const reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
    if (value !== '' && !reqex.test(value)) {
      return {
        validateStatus: 'warning',
        errorMsg: L('YouAreWritingArabicSymbols'),
      };
    }
    if (value !== '') {
      return {
        validateStatus: 'success',
        errorMsg: null,
      };
    }
    return {
      validateStatus: 'error',
      errorMsg: L('ThisFieldIsRequired'),
    };
  };

  onArChange = (e: any) => {
    const { value } = e.target;
    this.setState({ arName: { ...this.validateArName(value), value } });
  };

  onEnChange = (e: any) => {
    const { value } = e.target;
    this.setState({ enName: { ...this.validateEnName(value), value } });
  };

  onArAboutChange = (value: any) => {
    this.setState({ arAbout: { validateStatus: undefined, errorMsg: null, value } });
  };

  onEnAboutChange = (value: any) => {
    this.setState({ enAbout: { validateStatus: undefined, errorMsg: null, value } });
  };

  handleSubmit = async (editors: any) => {
    await this.props.onOk(editors);
  };

  handleCancel = () => {
    this.props.onCancel();
  };

  render() {
    const { visible, modalType } = this.props;
    const { foodCategories } = this.props.foodCategoryStore!;
    const { foodDishesModel } = this.props.foodDishesStore!;

    return (
      <Modal
        width="90%"
        visible={visible}
        title={modalType === 'create' ? L('CreateDish') : L('EditDish')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        maskClosable={false}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingDish}
            onClick={() =>
              this.handleSubmit({
                arEditor: this.arAboutEditor,
                enEditor: this.enAboutEditor,
              })
            }
          >
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <Row>
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 20, offset: 0 }}
              lg={{ span: 12, offset: 0 }}
            >
              <Row>
                {/* Name In Arabic */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('ArName')}
                    name="arName"
                    initialValue={foodDishesModel?.arName}
                    rules={[required]}
                    validateStatus={this.state.arName.validateStatus}
                    help={this.state.arName.errorMsg}
                    {...formItemLayout}
                  >
                    <Input type="text" onChange={this.onArChange} />
                  </FormItem>
                </Col>
                {/* Name In English */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('EnName')}
                    name="enName"
                    initialValue={foodDishesModel?.enName}
                    {...formItemLayout}
                    rules={[required]}
                    validateStatus={this.state.enName.validateStatus}
                    help={this.state.enName.errorMsg}
                  >
                    <Input type="text" onChange={this.onEnChange} />
                  </FormItem>
                </Col>
                {/* Status */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('IsActive')}
                    name="isActive"
                    initialValue={foodDishesModel?.isActive}
                    {...formItemLayout}
                  >
                    <Select>
                      <Select.Option value={false}>{L('Inactive')}</Select.Option>
                      <Select.Option value>{L('Active')}</Select.Option>
                    </Select>
                  </FormItem>
                </Col>
                {/* Food Categories */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('FoodCategory')}
                    name="foodCategoryId"
                    initialValue={foodDishesModel?.foodCategoryId}
                    {...formItemLayout}
                    rules={[required]}
                  >
                    <Select>
                      {foodCategories.map((category: FoodCategoryDto) => (
                        <Select.Option key={category.id} value={category.id}>
                          {category.title}
                        </Select.Option>
                      ))}
                    </Select>
                  </FormItem>
                </Col>
                {/* Amount Of Calories */}
                <Col {...colLayout}>
                  <FormItem label={L('AmountOfCalories')} {...formItemLayout}>
                    <FormItem
                      name="amountOfCalories"
                      initialValue={foodDishesModel?.amountOfCalories}
                      noStyle
                    >
                      <InputNumber min={0} style={{ width: '80%' }} />
                    </FormItem>
                    <span className="ant-form-text">{L('kcal')}</span>
                  </FormItem>
                </Col>
                {/* Standard Serving Amount */}
                <Col {...colLayout}>
                  <FormItem label={L('StandardServingAmount')} {...formItemLayout}>
                    <FormItem
                      name="standardServingAmount"
                      initialValue={foodDishesModel?.standardServingAmount}
                      noStyle
                    >
                      <InputNumber min={0} style={{ width: '80%' }} />
                    </FormItem>
                    <span className="ant-form-text">{L('Grams')}</span>
                  </FormItem>
                </Col>
                {/* About In Arabic */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('AboutTheFoodInArabic')}
                    initialValue={foodDishesModel?.arAbout}
                    name="arAbout"
                    {...formItemLayout}
                  >
                    <CKEditor
                      onInstanceReady={({ editor }) => {
                        this.arAboutEditor = editor;
                      }}
                      initData={foodDishesModel?.arAbout}
                      config={{ ...config, contentsLangDirection: 'rtl' }}
                      onChange={(event) => {
                        this.onArAboutChange(event.editor.getData());
                      }}
                    />
                  </FormItem>
                </Col>
                {/* About In English */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('AboutTheFoodInEnglish')}
                    initialValue={foodDishesModel?.enAbout}
                    name="enAbout"
                    {...formItemLayout}
                  >
                    <CKEditor
                      onInstanceReady={({ editor }) => {
                        this.enAboutEditor = editor;
                      }}
                      initData={foodDishesModel?.enAbout}
                      config={config}
                      onChange={(event) => {
                        this.onEnAboutChange(event.editor.getData());
                      }}
                    />
                  </FormItem>
                </Col>
                {/* Dish Image */}
                <Col {...colLayout}>
                  <FormItem
                    label={L('Image')}
                    name="imageUrl"
                    {...formItemLayout}
                    rules={[required]}
                    initialValue={foodDishesModel?.imageUrl}
                  >
                    <EditableImage
                      defaultFileList={
                        foodDishesModel?.imageUrl
                          ? [
                              {
                                uid: 1,
                                name: 'food Recipes Image',
                                status: 'done',
                                url: foodDishesModel?.imageUrl,
                                thumbUrl: foodDishesModel?.imageUrl,
                              },
                            ]
                          : []
                      }
                      onSuccess={(url: string) =>
                        this.props.formRef.current?.setFieldsValue({ imageUrl: url })
                      }
                      onRemove={() =>
                        this.props.formRef.current?.setFieldsValue({
                          imageUrl: undefined,
                        })
                      }
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
            <Col
              xs={{ span: 24, offset: 0 }}
              md={{ span: 20, offset: 0 }}
              lg={{ span: 10, offset: 2 }}
            >
              <Row>
                <h2>{L('ManageNutorition')}</h2>
                <Divider />
                <Col {...colLayout}>
                  <h3>{`${L('MainNutritions')} 1 (${L('Fat')})`}</h3>
                  <FormItem
                    {...formItemLayout}
                    name={'fatTotalWeight'}
                    rules={[required]}
                    label={`${L('TotalWeight')} (${L('Grams')})`}
                    initialValue={foodDishesModel?.nutritions[0]?.totalWeight}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <h3>{`${L('MainNutritions')} 2 (${L('Carbs')})`}</h3>

                  <FormItem
                    {...formItemLayout}
                    name={'carbsTotalWeight'}
                    rules={[required]}
                    label={`${L('TotalWeight')} (${L('Grams')})`}
                    initialValue={foodDishesModel?.nutritions[1]?.totalWeight}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </FormItem>
                </Col>
                <Col {...colLayout}>
                  <h3>{`${L('MainNutritions')} 3 (${L('Protein')})`}</h3>

                  <FormItem
                    {...formItemLayout}
                    name={'proteinTotalWeight'}
                    rules={[required]}
                    label={`${L('TotalWeight')} (${L('Grams')})`}
                    initialValue={foodDishesModel?.nutritions[2]?.totalWeight}
                  >
                    <InputNumber min={0} style={{ width: '100%' }} />
                  </FormItem>
                </Col>
                {/* Main Nutritions Form Array */}
                <Col {...colLayout}>
                  <Form.List
                    {...formItemLayout}
                    name="nutritions"
                    initialValue={foodDishesModel?.nutritions.slice(3)}
                    children={(fields: FormListFieldData[], { add, remove }: FormListOperation) => (
                      <>
                        {fields.map((field: FormListFieldData, index) => (
                          <div className="main-nutritions">
                            <h3>{`${L('MainNutritions')} ${index + 4}`}</h3>
                            <FormItem
                              {...formItemLayout}
                              {...field}
                              name={[field.name, 'name']}
                              fieldKey={[index + 3, 'name']}
                              rules={[required]}
                              label={L('Name')}
                              initialValue={foodDishesModel?.nutritions[index + 3]?.name}
                            >
                              <Input type="text" />
                            </FormItem>
                            <FormItem
                              {...formItemLayout}
                              name={[field.name, 'totalWeight']}
                              fieldKey={[index + 3, 'totalWeight']}
                              rules={[required]}
                              label={`${L('TotalWeight')} (${L('Grams')})`}
                              extra={L(
                                'TotalMainNutritionsWeightMustEqualTotalSubNutritionsWeight'
                              )}
                              initialValue={foodDishesModel?.nutritions[index + 3]?.totalWeight}
                            >
                              <InputNumber min={0} style={{ width: '100%' }} />
                            </FormItem>
                            {/* Sub Nutritions Form Array */}
                            <Form.List
                              name={[field.name, 'subNutritions']}
                              key={index + 3}
                              initialValue={foodDishesModel?.nutritions[index + 3]?.subNutritions}
                              {...formItemLayout}
                              children={(
                                subNutritions: FormListFieldData[],
                                {
                                  add: addSubNutrition,
                                  remove: removeSubNutrition,
                                }: FormListOperation
                              ) => (
                                <>
                                  {subNutritions.map(
                                    (subNutrition: FormListFieldData, subIndex) => (
                                      <div key={`${subNutrition.name}${subNutrition.key}`}>
                                        <Divider>{`${L('SubNutritions')} ${subIndex + 1}`}</Divider>
                                        <FormItem
                                          {...formItemLayout1}
                                          name={[subNutrition.name, 'name']}
                                          fieldKey={[subNutrition.key, 'name']}
                                          rules={[required]}
                                          label={L('Name')}
                                        >
                                          <Input type="text" />
                                        </FormItem>
                                        <FormItem
                                          {...formItemLayout1}
                                          name={[subNutrition.name, 'totalWeight']}
                                          fieldKey={[subNutrition.key, 'totalWeight']}
                                          rules={[required]}
                                          label={`${L('Weight')} (${L('Grams')})`}
                                        >
                                          <InputNumber min={0} style={{ width: '100%' }} />
                                        </FormItem>
                                        <Button
                                          onClick={() => {
                                            removeSubNutrition(subNutrition.name);
                                          }}
                                          danger
                                          className="nutritions-btn"
                                        >
                                          <MinusCircleOutlined />
                                          {`${L('Delete')} ${L('SubNutritions')} ${subIndex + 1}`}
                                        </Button>
                                        <Divider />
                                      </div>
                                    )
                                  )}
                                  <Button type="dashed" onClick={() => addSubNutrition()} block>
                                    <PlusOutlined /> {L('AddSubNutorition')}
                                  </Button>
                                  <Divider />
                                </>
                              )}
                            />
                            <Button
                              onClick={() => {
                                remove(field.name);
                              }}
                              danger
                              className="nutritions-btn"
                            >
                              <MinusCircleOutlined />
                              {`${L('Delete')} ${L('MainNutritions')} ${index + 4}`}
                            </Button>
                            <Divider />
                          </div>
                        ))}
                        <Button type="dashed" onClick={() => add()} block>
                          <PlusOutlined /> {L('AddNutorition')}
                        </Button>
                      </>
                    )}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateDish;
