/* eslint-disable */
import * as React from 'react';
import { Form, Modal, Button, Input, Select } from 'antd';
import Stores from '../../../stores/storeIdentifier';
import { inject, observer } from 'mobx-react';
import { L } from '../../../i18next';
import FormItem from 'antd/lib/form/FormItem';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../../stores/locationStore';
import localization from '../../../lib/localization';
import { LiteEntityDto } from '../../../services/locations/dto/liteEntityDto';
import locationsService from '../../../services/locations/locationsService';
import { LocationType } from '../../../lib/types';

export interface ICreateOrUpdateLocationProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  locationStore?: LocationStore;
  onOk: () => void;
  isSubmittingLocation: boolean;
  formRef: React.RefObject<FormInstance>;
}

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
    md: { span: 6 },
    lg: { span: 6 },
    xl: { span: 6 },
    xxl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 18 },
    md: { span: 18 },
    lg: { span: 18 },
    xl: { span: 18 },
    xxl: { span: 18 },
  },
};

@inject(Stores.LocationStore)
@observer
class CreateOrUpdateNeighbouhood extends React.Component<ICreateOrUpdateLocationProps, any> {
  cities: LiteEntityDto[] = [];

  async componentDidMount() {
    let result = await locationsService.getAllLite({ type: LocationType.City });
    this.cities = result.items;
  }
  state = {
    arName: { value: '', validateStatus: undefined, errorMsg: null },
    enName: { value: '', validateStatus: undefined, errorMsg: null },
  };

  handleSubmit = async () => {
    await this.props.onOk();
  };

  validateArName = (value: string) => {
    let reqex = /^[\u0600-\u06FF0-9\s.\-_()+]+$/;
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
    let reqex = /^[A-Za-z0-9\s.\-_()+]+$/;
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
    let value = e.target.value;
    this.setState({ arName: { ...this.validateArName(value), value } });
  };

  onEnChange = (e: any) => {
    let value = e.target.value;
    this.setState({ enName: { ...this.validateEnName(value), value } });
  };

  handleCancel = () => {
    this.props.onCancel();
    this.props.locationStore!.locationModel = undefined;
  };

  render() {
    const { visible, modalType } = this.props;
    const { locationModel } = this.props.locationStore!;

    return (
      <Modal
        visible={visible}
        title={modalType === 'create' ? L('CreateNeighbourhood') : L('EditNeighbourhood')}
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        onCancel={this.handleCancel}
        centered
        destroyOnClose
        footer={[
          <Button key="back" onClick={this.handleCancel}>
            {L('Cancel')}
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={this.props.isSubmittingLocation}
            onClick={this.handleSubmit}
          >
            {modalType === 'create' ? L('Create') : L('Save')}
          </Button>,
        ]}
      >
        <Form ref={this.props.formRef}>
          <>
            <FormItem
              label={L('ArName')}
              name="arName"
              {...formItemLayout}
              validateStatus={this.state.arName.validateStatus}
              help={this.state.arName.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={locationModel !== undefined ? locationModel.arName : undefined}
            >
              <Input onChange={this.onArChange} />
            </FormItem>
            <FormItem
              label={L('EnName')}
              name="enName"
              {...formItemLayout}
              validateStatus={this.state.enName.validateStatus}
              help={this.state.enName.errorMsg}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={locationModel !== undefined ? locationModel.enName : undefined}
            >
              <Input onChange={this.onEnChange} />
            </FormItem>

            <FormItem
              name="parentId"
              {...formItemLayout}
              label={L('City')}
              rules={[{ required: true, message: L('ThisFieldIsRequired') }]}
              initialValue={locationModel !== undefined ? locationModel.parent.value : undefined}
            >
              <Select
                placeholder={L('PleaseSelectCity')}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.cities.length > 0 &&
                  this.cities.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </FormItem>
          </>
        </Form>
      </Modal>
    );
  }
}

export default CreateOrUpdateNeighbouhood;
