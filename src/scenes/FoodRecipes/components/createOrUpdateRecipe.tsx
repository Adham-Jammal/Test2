/* eslint-disable */

import * as React from 'react';
import { Form, Modal, Button, Input, Select, Col, Row, InputNumber, Divider } from 'antd';
import { inject, observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import { CKEditor } from 'ckeditor4-react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList';
import { L } from '../../../i18next';
import localization from '../../../lib/localization';
import EditableImage from '../../../components/EditableImage';
import { ImageAttr } from '../../../services/dto/imageAttr';
import Stores from '../../../stores/storeIdentifier';
import FoodCategoryStore from '../../../stores/foodCategoryStore';
import { FoodCategoryDto } from '../../../services/foodCategory/dto/foodCategoryDto';
import FoodRecipesStore from '../../../stores/foodRecipeStore';
import './createOrUpdateRecipe.css';

export interface ICreateOrUpdateRecipeProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (editors: any) => void;
  isSubmittingRecipe: boolean;
  formRef: React.RefObject<FormInstance>;
  foodCategoryStore: FoodCategoryStore;
  foodRecipesStore: FoodRecipesStore;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 5 },
    sm: { span: 5 },
    md: { span: 5 },
    lg: { span: 5 },
    xl: { span: 5 },
    xxl: { span: 5 },
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

export interface ICreateOrUpdateRecipeState {
  defaultImage: Array<ImageAttr>;
  arName: { value: string; validateStatus?: string; errorMsg: string | null };
  enName: { value: string; validateStatus?: string; errorMsg: string | null };
  nutritionsLength: any;
  arAbout: { value: string; validateStatus?: string; errorMsg: string | null };
  enAbout: { value: string; validateStatus?: string; errorMsg: string | null };
}

@inject(Stores.FoodCategoryStore)
@observer
class CreateOrUpdateRecipe extends React.Component<
  ICreateOrUpdateRecipeProps,
  ICreateOrUpdateRecipeState
> {
  formRef = React.createRef<FormInstance>();

  async componentDidMount() {
    await this.props.foodCategoryStore!.getFoodCategories(true);
  }

  arAboutEditor = null;

  enAboutEditor = null;

  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
    arAbout: { value: '', validateStatus: undefined, errorMsg: null },
    enAbout: { value: '', validateStatus: undefined, errorMsg: null },
    defaultImage: [],
    nutritionsLength: [0],
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
    const { foodRecipesModel } = this.props.foodRecipesStore!;

    if (this.props.visible === false && document.getElementById('recipe-image') != null) {
      document.getElementById('recipe-image')!.setAttribute('value', '');
    }

    return (
      <Modal
        width="60%"
        visible={visible}
        title={modalType === 'create' ? L('CreateRecipe') : L('EditRecipe')}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingRecipe}
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
            {/* Title In Arabic */}
            <Col {...colLayout}>
              <FormItem
                label={L('ArName')}
                name="arName"
                initialValue={foodRecipesModel?.arName}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                validateStatus={this.state.arName.validateStatus}
                help={this.state.arName.errorMsg}
                {...formItemLayout}
              >
                <Input type="text" onChange={this.onArChange} />
              </FormItem>
            </Col>
            {/* Title In English */}
            <Col {...colLayout}>
              <FormItem
                label={L('EnName')}
                name="enName"
                initialValue={foodRecipesModel?.enName}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
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
                initialValue={foodRecipesModel?.isActive}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Select>
                  <Select.Option value={false}>{L('Inactive')}</Select.Option>
                  <Select.Option value>{L('Active')}</Select.Option>
                </Select>
              </FormItem>
            </Col>
            {/* Period Time */}
            <Col {...colLayout}>
              <FormItem required label={L('PeriodTime')} {...formItemLayout}>
                <FormItem
                  name="periodTime"
                  initialValue={foodRecipesModel?.periodTime}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  noStyle
                >
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">{L('Minutes')}</span>
              </FormItem>
            </Col>
            {/* Food Categories */}
            <Col {...colLayout}>
              <FormItem
                label={L('FoodCategory')}
                name="foodCategoryId"
                initialValue={foodRecipesModel?.foodCategoryId}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <Select>
                  {foodCategories.map((category: FoodCategoryDto) => (
                    <Select.Option value={category.id}>{category.title}</Select.Option>
                  ))}
                </Select>
              </FormItem>
            </Col>
            {/* Amount Of Calories */}
            <Col {...colLayout}>
              <FormItem required label={L('AmountOfCalories')} {...formItemLayout}>
                <FormItem
                  name="amountOfCalories"
                  initialValue={foodRecipesModel?.amountOfCalories}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  noStyle
                >
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">{L('kcal')}</span>
              </FormItem>
            </Col>
            {/* Standard Serving Amount */}
            <Col {...colLayout}>
              <FormItem required label={L('StandardServingAmount')} {...formItemLayout}>
                <FormItem
                  name="standardServingAmount"
                  initialValue={foodRecipesModel?.standardServingAmount}
                  rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                  noStyle
                >
                  <InputNumber min={0} />
                </FormItem>
                <span className="ant-form-text">{L('Grams')}</span>
              </FormItem>
            </Col>
            {/* About In Arabic */}
            <Col {...colLayout}>
              <FormItem
                label={L('AboutTheFoodInArabic')}
                name="arAbout"
                initialValue={foodRecipesModel?.arAbout}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                className="cke_rtl"
              >
                <CKEditor
                  onInstanceReady={({ editor }) => {
                    this.arAboutEditor = editor;
                  }}
                  initData={foodRecipesModel?.arAbout}
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
                name="enAbout"
                initialValue={foodRecipesModel?.enAbout}
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              >
                <CKEditor
                  onInstanceReady={({ editor }) => {
                    this.enAboutEditor = editor;
                  }}
                  initData={foodRecipesModel?.enAbout}
                  config={config}
                  onChange={(event) => {
                    this.onEnAboutChange(event.editor.getData());
                  }}
                />
              </FormItem>
            </Col>
            {/* Recipe Image */}
            <Col {...colLayout}>
              <FormItem
                label={L('Image')}
                name="imageUrl"
                {...formItemLayout}
                rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                initialValue={foodRecipesModel?.imageUrl}
              >
                <EditableImage
                  defaultFileList={
                    foodRecipesModel?.imageUrl
                      ? [
                          {
                            uid: 1,
                            name: 'food Recipes Image',
                            status: 'done',
                            url: foodRecipesModel?.imageUrl,
                            thumbUrl: foodRecipesModel?.imageUrl,
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
            <Divider />
            {/* Main Nutritions Form Array */}
            <Col {...colLayout}>
              <Form.List
                name="nutritions"
                initialValue={foodRecipesModel?.nutritions}
                children={(fields: FormListFieldData[], operation: FormListOperation) => {
                  return (
                    <>
                      {fields.map((field: FormListFieldData, index) => (
                        <div className="main-nutritions">
                          <h2>{`${L('MainNutritions')} ${index + 1}`}</h2>
                          <FormItem
                            {...formItemLayout1}
                            {...field}
                            name={[field.name, 'name']}
                            fieldKey={[field.key, 'name']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={L('Name')}
                            initialValue={foodRecipesModel?.nutritions[field.key]?.name}
                          >
                            <Input type="text" />
                          </FormItem>
                          <FormItem
                            {...formItemLayout1}
                            name={[field.name, 'totalWeight']}
                            fieldKey={[field.key, 'totalWeight']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={`${L('TotalWeight')} (${L('Grams')})`}
                            extra={L('TotalMainNutritionsWeightMustEqualTotalSubNutritionsWeight')}
                            initialValue={foodRecipesModel?.nutritions[field.key]?.totalWeight}
                          >
                            <InputNumber min={0} />
                          </FormItem>
                          {/* Sub Nutritions Form Array */}
                          <Form.List
                            name={[field.name, 'subNutritions']}
                            key={field.key}
                            initialValue={foodRecipesModel?.nutritions[field.key]?.subNutritions}
                            {...formItemLayout}
                            children={(
                              subNutritions: FormListFieldData[],
                              { add, remove }: FormListOperation
                            ) => {
                              return (
                                <>
                                  {subNutritions.map(
                                    (subNutrition: FormListFieldData, subIndex) => (
                                      <>
                                        <Divider>{`${L('SubNutritions')} ${subIndex + 1}`}</Divider>

                                        <FormItem
                                          {...formItemLayout1}
                                          name={[subNutrition.name, 'name']}
                                          fieldKey={[subNutrition.key, 'name']}
                                          rules={[
                                            {
                                              required: true,
                                              message: L('ThisFieldIsRequired'),
                                            },
                                          ]}
                                          label={L('Name')}
                                          initialValue={
                                            foodRecipesModel?.nutritions[field.key]?.subNutritions[
                                              subNutrition.key
                                            ]?.name
                                          }
                                        >
                                          <Input type="text" />
                                        </FormItem>
                                        <FormItem
                                          {...formItemLayout1}
                                          name={[subNutrition.name, 'totalWeight']}
                                          fieldKey={[subNutrition.key, 'totalWeight']}
                                          rules={[
                                            {
                                              required: true,
                                              message: L('ThisFieldIsRequired'),
                                            },
                                          ]}
                                          label={`${L('Weight')} (${L('Grams')})`}
                                          initialValue={Number(
                                            foodRecipesModel?.nutritions[field.key]?.subNutritions[
                                              subNutrition.key
                                            ]?.totalWeight
                                          )}
                                        >
                                          <InputNumber min={0} />
                                        </FormItem>
                                        <Button
                                          onClick={() => {
                                            remove(subNutrition.name);
                                          }}
                                          danger
                                          className="nutritions-btn"
                                        >
                                          <MinusCircleOutlined />
                                          {`${L('Delete')} ${L('SubNutritions')} ${subIndex + 1}`}
                                        </Button>
                                        <Divider />
                                      </>
                                    )
                                  )}
                                  <Button type="dashed" onClick={() => add()} block>
                                    <PlusOutlined /> {L('AddSubNutorition')}
                                  </Button>
                                  <Divider />
                                </>
                              );
                            }}
                          />
                          <Button
                            onClick={() => {
                              operation.remove(field.name);
                            }}
                            danger
                            className="nutritions-btn"
                          >
                            <MinusCircleOutlined />
                            {`${L('Delete')} ${L('MainNutritions')} ${index + 1}`}
                          </Button>
                        </div>
                      ))}
                      <Button type="dashed" onClick={() => operation.add()} block>
                        <PlusOutlined /> {L('AddNutorition')}
                      </Button>
                    </>
                  );
                }}
              />
            </Col>
            <Divider />
            {/* Ingredients Form Array */}
            <Col {...colLayout}>
              <Form.List
                name="ingredients"
                initialValue={foodRecipesModel?.ingredients}
                {...formItemLayout}
                children={(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((field, index) => (
                        <div className="main-nutritions">
                          <h2>{`${L('IngredientNumber')} ${index + 1}`}</h2>
                          <FormItem
                            {...formItemLayout1}
                            name={[field.name, 'name']}
                            fieldKey={[field.key, 'name']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            initialValue={foodRecipesModel?.ingredients[field.key]?.name}
                            label={L('Name')}
                          >
                            <Input type="text" />
                          </FormItem>

                          <FormItem
                            {...formItemLayout1}
                            name={[field.name, 'amount']}
                            fieldKey={[field.key, 'amount']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={L('Amount')}
                            initialValue={foodRecipesModel?.ingredients[field.key]?.amount}
                          >
                            <InputNumber min={0} />
                          </FormItem>
                          <FormItem
                            {...formItemLayout1}
                            name={[field.name, 'unitOfMeasurement']}
                            fieldKey={[field.key, 'unitOfMeasurement']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={L('UnitOfMeasurement')}
                            initialValue={
                              foodRecipesModel?.ingredients[field.key]?.unitOfMeasurement
                            }
                          >
                            <Input type="text" />
                          </FormItem>
                          <Button
                            onClick={() => {
                              remove(field.name);
                            }}
                            danger
                            className="nutritions-btn"
                          >
                            <MinusCircleOutlined />
                            {`${L('Delete')} ${L('IngredientNumber')} ${index + 1}`}
                          </Button>
                          <Divider />
                        </div>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        <PlusOutlined /> {L('AddIngredient')}
                      </Button>
                    </>
                  );
                }}
              />
            </Col>
            <Divider />
            {/* Steps Form Array */}
            <Col {...colLayout}>
              <Form.List
                name="steps"
                initialValue={foodRecipesModel?.steps}
                {...formItemLayout}
                children={(fields, { add, remove }) => {
                  return (
                    <>
                      {fields.map((field, index) => (
                        <div className="main-nutritions">
                          <h2>{`${L('StepNumber')} ${index + 1}`}</h2>
                          <FormItem
                            {...formItemLayout1}
                            name={[field.name, 'number']}
                            fieldKey={[field.key, 'number']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={L('StepNumber')}
                            initialValue={foodRecipesModel?.steps[field.key]?.number}
                          >
                            <InputNumber min={1} />
                          </FormItem>
                          <FormItem
                            {...formItemLayout1}
                            name={[field.name, 'description']}
                            fieldKey={[field.key, 'description']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={L('Description')}
                            initialValue={foodRecipesModel?.steps[field.key]?.description}
                          >
                            <Input.TextArea rows={7} />
                          </FormItem>
                          <FormItem
                            name={[field.name, 'imageUrl']}
                            fieldKey={[field.key, 'imageUrl']}
                            rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
                            label={L('StepImage')}
                            initialValue={foodRecipesModel?.steps[field.key]?.imageUrl}
                            {...formItemLayout1}
                          >
                            <EditableImage
                              defaultFileList={
                                foodRecipesModel?.steps[field.key]?.imageUrl
                                  ? [
                                      {
                                        uid: 1,
                                        name: `Step Number ${field.key} Image`,
                                        status: 'done',
                                        url: foodRecipesModel?.steps[field.key]?.imageUrl,
                                        thumbUrl: foodRecipesModel?.steps[field.key]?.imageUrl,
                                      },
                                    ]
                                  : []
                              }
                              onSuccess={(url: string) => {
                                const prevSteps: any[] =
                                  this.props.formRef.current?.getFieldValue('steps');
                                const newSteps: any[] = prevSteps;
                                if (field.key !== undefined) {
                                  newSteps[field.key] = {
                                    ...newSteps[field.key],
                                    imageUrl: url,
                                  };
                                  return this.props.formRef.current?.setFieldsValue({
                                    steps: newSteps,
                                  });
                                }
                              }}
                              onRemove={() => {
                                const prevSteps: any[] =
                                  this.props.formRef.current?.getFieldValue('steps');
                                const newSteps: any[] = prevSteps;
                                if (field.key !== undefined) {
                                  newSteps[field.key] = {
                                    ...newSteps[field.key],
                                    imageUrl: undefined,
                                  };
                                  return this.props.formRef.current?.setFieldsValue({
                                    steps: newSteps,
                                  });
                                }
                              }}
                            />
                          </FormItem>
                          <Button
                            onClick={() => {
                              remove(field.name);
                            }}
                            danger
                            className="nutritions-btn"
                          >
                            <MinusCircleOutlined />
                            {`${L('Delete')} ${L('Step')} ${index + 1}`}
                          </Button>
                          <Divider />
                        </div>
                      ))}
                      <Button type="dashed" onClick={() => add()} block>
                        <PlusOutlined /> {L('AddStep')}
                      </Button>
                    </>
                  );
                }}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateRecipe;
