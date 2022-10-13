/* eslint-disable */

import React, { useState, useEffect } from 'react';
import {
  Form,
  Tabs,
  Modal,
  Space,
  Table,
  message,
  Button,
  Divider,
  Tooltip,
  Input,
  Select,
  InputNumber,
  Spin,
  Switch,
} from 'antd';
import {
  InstagramOutlined,
  InfoCircleOutlined,
  PartitionOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import { ValidateStatus } from 'antd/lib/form/FormItem';
import { L } from '../../../../i18next';
import localization from '../../../../lib/localization';
import EditableImage from '../../../../components/EditableImage';
import { LiteEntityDto } from '../../../../services/dto/liteEntityDto';
import { ImageAttr } from '../../../../services/dto/imageAttr';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductDto,
  ProductCombinationCreationDto,
} from '../../../../services/products/dto';

import {
  validateArName,
  validateEnName,
  convertImageToImageArr,
  convertImagesUrlsToImageArr,
} from '../../../../helpers';
import UploadImage from '../../../../components/UploadImage';
import CreateOrUpdateCombination from '../CreateOrUpdateCombination';
import './index.less';

const { TabPane } = Tabs;

interface CreateOrUpdateProductProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateProductDto | UpdateProductDto) => void;
  isSubmittingProduct: boolean;
  isGettingData: boolean;
  productData?: ProductDto;
  classifications?: LiteEntityDto[];
  colors?: LiteEntityDto[];
  sizes?: LiteEntityDto[];
  product?: ProductDto;
  shopId: number;
}

interface ItemValidation {
  value: string;
  validateStatus: ValidateStatus;
  errorMsg: string | null;
}

const CreateOrUpdateProduct: React.FC<CreateOrUpdateProductProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingProduct,
  isGettingData,
  productData,
  classifications = [],
  shopId,
  colors = [],
  sizes = [],
}) => {
  const [form] = Form.useForm();
  const [arabicName, setArabicName] = useState<ItemValidation>();
  const [combinationModalVisible, setCombinationModalVisible] = useState<boolean>(false);
  const [notifyAllFollowers, setNotifyAllFollowers] = useState<boolean>(false);
  const [combinations, setCombinations] = useState<ProductCombinationCreationDto[]>([]);
  const [currentCombination, setCurrentCombination] = useState<ProductCombinationCreationDto>();
  const [currentCombinationIndex, setCurrentCombinationIndex] = useState<number>();
  const [combinationModalType, setCombinationModalType] = useState<string>('create');
  const [englishName, setEnglishName] = useState<ItemValidation>();
  const [arDesc, setArDesc] = useState<ItemValidation>();
  const [enDesc, setEnDesc] = useState<ItemValidation>();
  const [defaultImage, setDefaultImage] = useState<ImageAttr[]>([]);
  const [galleryImages, setGalleryImages] = useState<ImageAttr[]>([]);

  useEffect(() => {
    if (modalType === 'update' && productData) {
      const {
        imageUrl,
        gallery,
        combinations: productCombinations,
        classificationId,
      } = productData || {};
      const formattedCombinations = productCombinations?.map(
        ({ price, quantity, colorId, sizeId }) => ({ price, quantity, colorId, sizeId })
      );
      setCombinations(formattedCombinations);
      form.setFieldsValue({
        ...productData,
        combinations: formattedCombinations,
        classificationId: classificationId + '',
      });
      if (imageUrl !== null) {
        setDefaultImage(convertImageToImageArr(imageUrl, 'defaultImage'));
      }
      setGalleryImages(convertImagesUrlsToImageArr(gallery, 'galleryItem'));
    } else {
      form.resetFields();
    }
  }, [form, productData, modalType]);

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

  // handle name change
  const handleArNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setArabicName({ ...validateArName(value), value });
  };

  // handle En Name change
  const handleEnNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value } = event.target;
    setEnglishName({ ...validateEnName(value), value });
  };

  // handle arabic description change
  const handleArDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setArDesc({ ...validateArName(value), value });
  };

  // handle english description change
  const handleEnDescChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const { value } = event.target;
    setEnDesc({ ...validateEnName(value), value });
  };

  // handle cancel modal
  const handleCancelModal = async () => {
    await form.resetFields();
    setDefaultImage([]);
    setGalleryImages([]);
    setCombinations([]);
    onCancel();
  };

  // handle submit
  const handleSubmit = async (): Promise<void> => {
    try {
      const values = await form.validateFields();
      values.shopId = shopId;
      values.combinations = combinations;

      const submitValues = modalType === 'update' ? { ...values, id: productData?.id } : values;

      await onOk(submitValues);
      handleCancelModal();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error?.message || L('somethingWentWrongWhileSubmittingData'));
      }
    }
  };

  // handle delete combination
  const deleteCombination = (itemIndex: number): void => {
    const newCombination = combinations.filter((_, index) => itemIndex !== index);
    setCombinations([...newCombination]);
    form.setFieldsValue({ combinations: [...newCombination] });
  };

  // handle edit combination
  const editCombination = (
    itemIndex: number,
    combinationData: ProductCombinationCreationDto
  ): void => {
    setCurrentCombination(combinationData);
    setCombinationModalType('update');
    setCurrentCombinationIndex(itemIndex);
    setCombinationModalVisible(true);
  };

  const onOkCombination = (values: ProductCombinationCreationDto) => {
    if (
      currentCombinationIndex !== undefined &&
      combinationModalType === 'update' &&
      currentCombination
    ) {
      const newCombination = combinations;
      newCombination[currentCombinationIndex] = values;

      setCombinations([...newCombination]);
      form.setFieldsValue({ combinations: [...newCombination] });
    } else {
      setCombinations((prevState) => [values, ...prevState]);
      form.setFieldsValue({ combinations: [values, ...combinations] });
    }
    setCurrentCombination(undefined);
    setCurrentCombinationIndex(undefined);
    setCombinationModalVisible(false);
  };

  const combinationColumns = [
    {
      title: L('Price'),
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: L('Quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: L('color'),
      dataIndex: 'colorId',
      key: 'colorId',
      render: (colorId: number): string | null => {
        const foundColor = colors?.find((color) => Number(color?.value) === colorId);
        if (foundColor) {
          return foundColor.text;
        }
        return null;
      },
    },
    {
      title: L('size'),
      key: 'sizeId',
      dataIndex: 'sizeId',
      render: (sizeId: number): string | null => {
        const foundSize = sizes?.find((size) => Number(size?.value) === sizeId);
        if (foundSize) {
          return foundSize.text;
        }
        return null;
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (_: any, record: ProductCombinationCreationDto, index: number): JSX.Element => (
        <div>
          <Tooltip title={L('Edit')}>
            <EditOutlined className="action-icon " onClick={() => editCombination(index, record)} />
          </Tooltip>
          <Tooltip title={L('Delete')}>
            <DeleteOutlined
              className="action-icon  red-text"
              onClick={() => deleteCombination(index)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const required = { required: true, message: L('ThisFieldIsRequired') };
  // const { number ,gallery,shopId,arName,enName,classificationId,arDescription,enDescription,minRequestQuantity,maxRequestQuantity} = productData ?? {};
  return (
    <Modal
      width="90%"
      style={{ padding: '20px' }}
      visible={visible}
      title={modalType === 'create' ? L('CreateProduct') : L('EditProduct')}
      onCancel={handleCancelModal}
      centered
      maskClosable={false}
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={handleCancelModal}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={isSubmittingProduct} onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      <div className="scrollable-modal">
        {isGettingData ? (
          <div className="loading-comp">
            <Spin size="large" />
          </div>
        ) : (
          <Form className="form" preserve={false} form={form} {...formLayout} scrollToFirstError>
            <Tabs defaultActiveKey="1" className="product-tabs">
              <TabPane
                tab={
                  <span>
                    <InfoCircleOutlined />
                    {L('General')}
                  </span>
                }
                key="1"
              >
                {/* number */}
                <Form.Item label={L('Number')} name="number" rules={[required]}>
                  <Input type="text" />
                </Form.Item>

                {/* shop */}
                {/* <Form.Item label={L('Shop')} rules={[required]} name="shopId">
                <Select
                  placeholder={L('PleaseSelectShop')}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option: any) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                >
                  {shops?.length > 0 &&
                  shops?.map((element: LiteEntityDto) => (
                    <Select.Option key={element?.value} value={element?.value}>
                      {element?.text}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item> */}

                {/* arabic name */}
                <Form.Item
                  label={L('ArName')}
                  name="arName"
                  validateStatus={arabicName?.validateStatus}
                  help={arabicName?.errorMsg}
                  rules={[required]}
                >
                  <Input type="text" onChange={handleArNameChange} />
                </Form.Item>

                {/* english name */}
                <Form.Item
                  label={L('EnName')}
                  name="enName"
                  rules={[required]}
                  validateStatus={englishName?.validateStatus}
                  help={englishName?.errorMsg}
                >
                  <Input type="text" onChange={handleEnNameChange} />
                </Form.Item>
                {/* arabic description */}
                <Form.Item
                  label={L('ArDescription')}
                  name="arDescription"
                  rules={[required]}
                  validateStatus={arDesc?.validateStatus}
                  help={arDesc?.errorMsg}
                >
                  <Input.TextArea dir="auto" rows={5} onChange={handleArDescChange} />
                </Form.Item>

                {/* english description */}
                <Form.Item
                  label={L('EnDescription')}
                  name="enDescription"
                  rules={[required]}
                  validateStatus={enDesc?.validateStatus}
                  help={enDesc?.errorMsg}
                >
                  <Input.TextArea dir="auto" rows={5} onChange={handleEnDescChange} />
                </Form.Item>

                {/* minimum request quantity  */}
                <Form.Item
                  label={L('AvailableStock')}
                  colon={false}
                  name="availableStock"
                  rules={[required]}
                >
                  <InputNumber type="number" min={1} style={{ width: '100%' }} />
                </Form.Item>

                {/* classification  */}
                <Form.Item label={L('Classification')} rules={[required]} name="classificationId">
                  <Select
                    placeholder={L('PleaseSelectClassification')}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option: any) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {classifications?.length > 0 &&
                      classifications?.map((element: LiteEntityDto) => (
                        <Select.Option key={element?.value} value={element?.value}>
                          {element?.text}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>

                {/* image url  */}
                <Form.Item name="imageUrl" label={L('Image')} colon={false} rules={[required]}>
                  <EditableImage
                    defaultFileList={defaultImage}
                    onSuccess={(url: string) => form.setFieldsValue({ imageUrl: url })}
                    onRemove={() => form.setFieldsValue({ imageUrl: undefined })}
                  />
                </Form.Item>
                {/* notifyAllFollowers */}
                <Form.Item
                name="notifyAllFollowers"
                rules={[required]}
                colon={false}
                label={L('notifyAllFollowers')}
                initialValue ={notifyAllFollowers}
              >
                <Switch
                  checkedChildren={L('Yes')}
                  unCheckedChildren={L('No')}
                  defaultChecked={notifyAllFollowers}
                  onChange={(checked: boolean) =>{
                    setNotifyAllFollowers(checked);
                    form.setFieldsValue(notifyAllFollowers)}
                  }
                />
              </Form.Item>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <PartitionOutlined />
                    {L('Attributes')}
                  </span>
                }
                key="2"
              >
                <Divider>{L('Combinations')}</Divider>

                <Button
                  type="primary"
                  style={{ float: localization.getFloat(), margin: '0 5px 15px' }}
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setCombinationModalType('create');
                    setCombinationModalVisible(true);
                    setCurrentCombination(undefined);
                    setCurrentCombinationIndex(undefined);
                  }}
                >
                  {L('AddCombinations')}
                </Button>

                <Table
                  dataSource={combinations}
                  columns={combinationColumns}
                  rowKey={(record: ProductCombinationCreationDto) => record.colorId}
                />
                {/* combination  */}
                <Form.Item name="combinations" rules={[required]} />
                <Divider className="attributes-title">{L('Attributes')}</Divider>
                {/* <h3 className='attributes-title'></h3>  */}
                <Form.List name="attributes">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={key}
                          style={{ display: 'flex', marginBottom: 8 }}
                          align="baseline"
                        >
                          <Form.Item {...restField} name={[name, 'key']} rules={[required]}>
                            <Input placeholder={L('attribute')} />
                          </Form.Item>
                          <Form.Item {...restField} name={[name, 'value']} rules={[required]}>
                            <Input placeholder={L('value')} />
                          </Form.Item>
                          <MinusCircleOutlined onClick={() => remove(name)} />
                        </Space>
                      ))}
                      <Form.Item>
                        <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                          {L('AddNewAttribute')}
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <InstagramOutlined />
                    {L('Gallery')}
                  </span>
                }
                key="3"
              >
                {/* event gallery images */}
                <Form.Item label={L('Gallery')} name="gallery">
                  <UploadImage
                    defaultFileList={galleryImages}
                    currentCount={galleryImages.length}
                    onUploadComplete={(fileName: string) => {
                      const oldGalleryImages = form.getFieldValue('gallery') ?? [];
                      form.setFieldsValue({ gallery: [...oldGalleryImages, fileName] });
                    }}
                    onRemoveImage={(fileName: string) => {
                      const oldGalleryImages = form.getFieldValue('gallery') ?? [];
                      const newGalleryFiles = oldGalleryImages.filter(
                        (file: string) => file !== fileName
                      );
                      form.setFieldsValue({ gallery: newGalleryFiles });
                    }}
                  >
                    <PlusOutlined />
                  </UploadImage>
                </Form.Item>
              </TabPane>
              <CreateOrUpdateCombination
                onCancel={() => {
                  setCombinationModalVisible(false);
                  setCurrentCombinationIndex(undefined);
                }}
                onOk={onOkCombination}
                visible={combinationModalVisible}
                modalType={combinationModalType}
                colors={colors}
                sizes={sizes}
                combination={currentCombination}
              />
            </Tabs>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default CreateOrUpdateProduct;
