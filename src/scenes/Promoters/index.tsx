/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Select, Tag, Col, Row, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import localization from '../../lib/localization';
import ImageModel from '../../components/ImageModal';
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckSquareOutlined,
  LockOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import ResetPasswordModal from '../../components/ResetPasswordModal';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import PromoterStore from '../../stores/promoterStore';
import { UpdatePromoterDto } from '../../services/promoters/dto/updatePromoterDto';
import { CreatePromoterDto } from '../../services/promoters/dto/createPromoterDto';
import { PromoterDto } from '../../services/promoters/dto/promoterDto';
import CreateOrUpdatePromoter from './components/createOrUpdatePromoter';
import PromoterDetailsModal from './components/promoterDetailsModal';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import FilterationBox from '../../components/FilterationBox';
import { VehicleType } from '../../lib/types';
export interface IPromoterProps {
  promoterStore?: PromoterStore;
}
const colLayout2 = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 9, offset: 2 },
  lg: { span: 7, offset: 1 },
  xl: { span: 7, offset: 1 },
  xxl: { span: 7, offset: 1 },
};
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 6 },
};

export interface IPromotersState {
  promoterModalVisible: boolean;
  resetPasswordModalVisible: boolean;
  promoterDetailsModalVisible: boolean;
  promoterId: number;
  promotersModalId: number;
  promotersModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    skipCount: number;
    pageTotal: number;
    total: number;
  };
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    resetPassword: boolean;
    activation: boolean;
  };
  isActiveFilter?: boolean;
  keyword?: string;
  vehicleType?: number;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.PromoterStore)
@observer
export class Promoters extends AppComponentBase<IPromoterProps, IPromotersState> {
  formRef = React.createRef<FormInstance>();
  resetPasswordFormRef = React.createRef<FormInstance>();
  currentUser: any = undefined;

  state = {
    promoterModalVisible: false,
    resetPasswordModalVisible: false,
    promoterDetailsModalVisible: false,
    promoterId: 0,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    promotersModalId: 0,
    promotersModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      skipCount: 0,
      pageTotal: 1,
      total: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      resetPassword: false,
      activation: false,
    },
    isActiveFilter: undefined,
    keyword: undefined,
    vehicleType: undefined,
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Promoters.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Promoters.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Promoters.Activation')).valueOf(),
        resetPassword: (await utils.checkIfGrantedPermission('Promoters.ResetPassword')).valueOf(),
      },
    });
    this.updatePromotersList(this.state.meta.pageSize, 0);
  }

  async updatePromotersList(maxResultCount: number, skipCount: number) {
    this.props.promoterStore!.maxResultCount = maxResultCount;
    this.props.promoterStore!.skipCount = skipCount;
    this.props.promoterStore!.keyword = this.state.keyword;
    this.props.promoterStore!.isActiveFilter = this.state.isActiveFilter;
    this.props.promoterStore!.vehicleType = this.state.vehicleType;

    this.props.promoterStore!.getPromoters();
  }

  async openPromoterModal(entityDto: EntityDto) {
    if (entityDto.id === 0) {
      this.props.promoterStore!.promoterModel = undefined;
      this.setState({ promotersModalType: 'create', promotersModalId: entityDto.id });
    } else {
      await this.props.promoterStore!.getPromoter(entityDto);
      this.setState({ promotersModalType: 'edit', promotersModalId: entityDto.id });
    }
    this.setState({
      promoterModalVisible: !this.state.promoterModalVisible,
      promotersModalId: entityDto.id,
    });
  }

  openResetPasswordModal(promoterId: number) {
    this.setState({ promoterId: promoterId, resetPasswordModalVisible: true });
  }

  async openPromoterDetailsModal(entityDto: EntityDto) {
    await this.props.promoterStore!.getPromoter(entityDto);
    this.setState({
      promoterDetailsModalVisible: !this.state.promoterDetailsModalVisible,
      promotersModalId: entityDto.id,
    });
  }

  createOrUpdatePromoter = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.drivingLicenseUrl = document
        .getElementById('drivingLicense-image')!
        .getAttribute('value')
        ? document.getElementById('drivingLicense-image')!.getAttribute('value')
        : this.props.promoterStore!.promoterModel?.drivingLicenseUrl;
      values.identityUrl = document.getElementById('identity-image')!.getAttribute('value')
        ? document.getElementById('identity-image')!.getAttribute('value')
        : this.props.promoterStore!.promoterModel?.identityUrl;
      values.passportUrl = document.getElementById('passport-image')!.getAttribute('value')
        ? document.getElementById('passport-image')!.getAttribute('value')
        : this.props.promoterStore!.promoterModel?.passportUrl;
      values.vehicleImageUrl = document.getElementById('vehicle-image')!.getAttribute('value')
        ? document.getElementById('vehicle-image')!.getAttribute('value')
        : this.props.promoterStore!.promoterModel?.vehicleImageUrl;
      if (this.state.promotersModalId === 0) {
        await this.props.promoterStore!.createPromoter(values as CreatePromoterDto);
      } else {
        values.id = this.state.promotersModalId;
        await this.props.promoterStore!.updatePromoter(values as UpdatePromoterDto);
      }
      await this.props.promoterStore!.getPromoters();
      this.setState({ promoterModalVisible: false });
      form!.resetFields();
    });
  };

  onSwitchPromoterActivation = async (promoter: PromoterDto) => {
    popupConfirm(
      async () => {
        if (promoter.isActive)
          await this.props.promoterStore!.promoterDeactivation({ id: promoter.id });
        else await this.props.promoterStore!.promoterActivation({ id: promoter.id });
        await this.updatePromotersList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      promoter
        ? L('AreYouSureYouWantToBlockThisPromoter')
        : L('AreYouSureYouWantToUnblockThisPromoter')
    );
  };

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }
  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  promotersTableColumns = [
    {
      title: L('Name'),
      dataIndex: 'fullName',
      key: 'fullName',
    },

    {
      title: L('PhoneNumber'),
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: L('VehicleType'),
      dataIndex: 'vehicleType',
      key: 'vehicleType',
      render: (vehicleType: number) => {
        let vehicleTypeName = undefined;
        switch (vehicleType) {
          case VehicleType.Bicycle:
            vehicleTypeName = L('Bicycle');
            break;
          case VehicleType.Bus:
            vehicleTypeName = L('Bus');
            break;
          case VehicleType.Car:
            vehicleTypeName = L('Car');
            break;
          case VehicleType.Motorcycle:
            vehicleTypeName = L('Motorcycle');
            break;
          case VehicleType.Truck:
            vehicleTypeName = L('Truck');
            break;
          case VehicleType.Van:
            vehicleTypeName = L('Van');
        }
        return (
          <Tag color={'processing'} className="ant-tag-disable-pointer">
            {vehicleTypeName}
          </Tag>
        );
      },
    },
    {
      title: L('VehicleNumber'),
      dataIndex: 'vehicleNumber',
      key: 'vehicleNumber',
    },
    {
      title: L('Blocked?'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Unblocked') : L('Blocked')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      render: (text: string, item: PromoterDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openPromoterDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openPromoterModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Block')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchPromoterActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchPromoterActivation(item)}
              />
            </Tooltip>
          ) : null}
          {this.state.permisssionsGranted.resetPassword ? (
            <Tooltip title={L('ResetPassword')}>
              <LockOutlined
                className="action-icon "
                onClick={() => this.openResetPasswordModal(item.id)}
              />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
  ];

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (page: any, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updatePromotersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updatePromotersList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const promoters = this.props.promoterStore!.promoters;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.promoterStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Promoters')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<PlusOutlined />}
                onClick={() => this.openPromoterModal({ id: 0 })}
              >
                {L('AddPromoter')}
              </Button>
            ) : null}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updatePromotersList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row>
            <Col {...colLayout}>
              <label>{L('VehicleType')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectVehicleType')}
                optionFilterProp="children"
                filterOption={(input: any, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.vehicleType}
                onChange={(value: any) => {
                  this.setState({ vehicleType: value });
                }}
              >
                <Select.Option value={0} key={0}>
                  {L('Car')}
                </Select.Option>
                <Select.Option value={1} key={1}>
                  {L('Motorcycle')}
                </Select.Option>
                <Select.Option value={2} key={2}>
                  {L('Bicycle')}
                </Select.Option>
                <Select.Option value={3} key={3}>
                  {L('Van')}
                </Select.Option>
                <Select.Option value={4} key={4}>
                  {L('Truck')}
                </Select.Option>
                <Select.Option value={5} key={5}>
                  {L('Bus')}
                </Select.Option>
              </Select>
            </Col>

            <Col {...colLayout2}>
              <label>{L('IsActive')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
                  this.setState({
                    isActiveFilter: value === 3 ? undefined : value === 1 ? true : false,
                  });
                }}
                value={
                  this.state.isActiveFilter === undefined ? 3 : !this.state.isActiveFilter ? 0 : 1
                }
              >
                <Select.Option key={1} value={1}>
                  {L('Unblocked')}
                </Select.Option>
                <Select.Option key={0} value={0}>
                  {L('Blocked')}
                </Select.Option>
                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updatePromotersList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ isActiveFilter: undefined, vehicleType: undefined }, async () => {
                  await this.updatePromotersList(
                    this.state.meta.pageSize,
                    this.state.meta.skipCount
                  );
                });
              }}
              style={{ width: 90, marginRight: 4, marginLeft: 4 }}
            >
              {L('ResetFilter')}
            </Button>
          </Row>
        </FilterationBox>

        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.promoterStore!.loadingPromoters}
          dataSource={promoters === undefined ? [] : promoters}
          columns={this.promotersTableColumns}
        />

        <CreateOrUpdatePromoter
          formRef={this.formRef}
          visible={this.state.promoterModalVisible}
          onCancel={() =>
            this.setState({
              promoterModalVisible: false,
            })
          }
          modalType={this.state.promotersModalType}
          onOk={this.createOrUpdatePromoter}
          isSubmittingPromoter={this.props.promoterStore!.isSubmittingPromoter}
          promoterStore={this.props.promoterStore}
        />

        <ResetPasswordModal
          formRef={this.resetPasswordFormRef}
          isOpen={this.state.resetPasswordModalVisible}
          userId={this.state.promoterId}
          onClose={() =>
            this.setState({
              resetPasswordModalVisible: false,
            })
          }
        />

        <ImageModel
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />

        <PromoterDetailsModal
          visible={this.state.promoterDetailsModalVisible}
          onCancel={() =>
            this.setState({
              promoterDetailsModalVisible: false,
            })
          }
          promoterStore={this.props.promoterStore!}
        />
      </Card>
    );
  }
}

export default Promoters;
