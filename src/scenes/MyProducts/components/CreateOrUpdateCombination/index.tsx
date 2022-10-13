/* eslint-disable */
import React, { useEffect } from 'react';
import { Button, Modal, Form, InputNumber, Select } from 'antd';
import { ProductCombinationCreationDto } from '../../../../services/products/dto';
import { LiteEntityDto } from '../../../../services/dto/liteEntityDto';
import { L } from '../../../../i18next';
import localization from '../../../../lib/localization';

interface CreateOrUpdateCombinationProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: ProductCombinationCreationDto) => void;
  combination?: ProductCombinationCreationDto;
  classifications?: LiteEntityDto[];
  colors?: LiteEntityDto[];
  sizes?: LiteEntityDto[];
}

const formLayout = {
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
    lg: { span: 14 },
    xl: { span: 14 },
    xxl: { span: 14 },
  },
};

const CreateOrUpdateCombination: React.FC<CreateOrUpdateCombinationProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  colors,
  sizes,
  combination,
}) => {
  const [form] = Form.useForm();
  const required = { required: true, message: L('ThisFieldIsRequired') };

  // set the data in the form if it an edit type
  useEffect(() => {
    if (modalType === 'update' && combination) {
      form.setFieldsValue(combination);
    }
  }, [form, combination, modalType]);

  // handle submit the form
  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onOk(values);
    });
  };

  return (
    <Modal
      visible={visible}
      title={modalType === 'create' ? L('createCombination') : L('editCombination')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={[
        <Button key="back" onClick={onCancel}>
          {L('Cancel')}
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {modalType === 'create' ? L('Create') : L('Save')}
        </Button>,
      ]}
    >
      <Form preserve={false} form={form} {...formLayout} scrollToFirstError>
        {/* Price */}
        <Form.Item label={L('Price')} name="price" rules={[required]}>
          <InputNumber type="number" min={1} />
        </Form.Item>
        {/* quantity */}
        <Form.Item label={L('Quantity')} name="quantity" rules={[required]}>
          <InputNumber type="number" min={0} />
        </Form.Item>
        {/* quantity */}
        <Form.Item label={L('color')} name="colorId" rules={[required]}>
          <Select
            placeholder={L('SelectColor')}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {colors &&
              colors?.length > 0 &&
              colors?.map((element: LiteEntityDto) => (
                <Select.Option key={element?.value} value={Number(element?.value)}>
                  {element?.text}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
        {/* sizes */}
        <Form.Item label={L('size')} name="sizeId" rules={[required]}>
          <Select
            placeholder={L('SelectSize')}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option: any) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {sizes &&
              sizes?.length > 0 &&
              sizes?.map((element: LiteEntityDto) => (
                <Select.Option key={element?.value} value={Number(element?.value)}>
                  {element?.text}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOrUpdateCombination;
