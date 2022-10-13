import * as React from 'react';
import { Button, Card, Table, Select, Row, Col, Tag, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import {
  EyeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { popupConfirm } from '../../lib/popupMessages';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import { EntityDto } from '../../services/dto/entityDto';
import { LiteEntityDto } from '../../services/locations/dto/liteEntityDto';
import localization from '../../lib/localization';
import FilterationBox from '../../components/FilterationBox';
import OffersStore from '../../stores/offersStore';
import productsService from '../../services/products/productsService';
import { OfferDto } from '../../services/offers/dto/OfferDto';
import moment from 'moment';
import timingHelper from '../../lib/timingHelper';
import CreateOrUpdateOffer from './components/createOrUpdateOffer';
import { FormInstance } from 'antd/lib/form';
import { CreateOfferDto } from '../../services/offers/dto/createOfferDto';
import { UpdateOfferDto } from '../../services/offers/dto/updateOfferDto';
import OfferDetailsModal from './components/offerDetailsModal';
import { OfferType } from '../../lib/types';

export interface IOffersProps {
  offersStore: OffersStore;
}

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

export interface IOffersState {
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  offerDetailsModalVisible: boolean;

  permisssionsGranted: {
    delete: boolean;
    create: boolean;
    update: boolean;
    activation: boolean;
  };
  type?: number;
  offerModalVisible: boolean;
  offerModalId: number;
  offerModalType: string;
}

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];
declare var abp: any;

@inject(Stores.OffersStore)
@observer
export class Offers extends AppComponentBase<IOffersProps, IOffersState> {
  currentUser: any = undefined;
  products: LiteEntityDto[] = [];
  formRef = React.createRef<FormInstance>();

  state = {
    offerModalVisible: false,
    offerModalId: 0,
    offerModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    offerDetailsModalVisible: false,
    permisssionsGranted: {
      delete: false,
      create: false,
      update: false,
      activation: false,
    },
    type: undefined,
  };

  async openOfferDetailsModal(entityDto: EntityDto) {
    await this.props.offersStore!.getOffer(entityDto);
    this.setState({ offerDetailsModalVisible: !this.state.offerDetailsModalVisible });
  }

  async openOfferModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.offersStore!.offerModel = undefined;
      this.setState({ offerModalType: 'create', offerModalId: input.id });
    } else {
      await this.props.offersStore!.getOffer({ id: input.id });
      this.setState({ offerModalType: 'edit', offerModalId: input.id });
    }
    this.setState({ offerModalVisible: !this.state.offerModalVisible });
  }

  async componentDidMount() {
    let result = await productsService.getAllLite({});
    this.products = result.items;

    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        delete: (await utils.checkIfGrantedPermission('Offers.Delete')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Offers.Create')).valueOf(),
        update: (await utils.checkIfGrantedPermission('Offers.Update')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Offers.Activation')).valueOf(),
      },
    });
    await this.updateOffersList(this.state.meta.pageSize, 0);
  }

  createOrUpdateOffer = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      values.type = values.type ? 0 : 1;
      values.percentage = +values.percentage;
      if (values.type === 0) {
        values.orderMinValue = +values.orderMinValue;
      } else {
        values.productIDs = values.products;
        delete values.products;
      }
      if (this.state.offerModalId === 0) {
        await this.props.offersStore!.createOffer(values as CreateOfferDto);
      } else {
        values.id = this.state.offerModalId;
        await this.props.offersStore!.updateOffer(values as UpdateOfferDto);
      }
      this.setState({ offerModalVisible: false });
      form!.resetFields();
    });
  };

  async updateOffersList(maxResultCount: number, skipCount: number) {
    this.props.offersStore!.maxResultCount = maxResultCount;
    this.props.offersStore!.skipCount = skipCount;
    this.props.offersStore!.type = this.state.type;
    await this.props.offersStore!.getAllOffers();
  }

  deleteOffer = async (offer: OfferDto) => {
    popupConfirm(async () => {
      await this.props.offersStore!.deleteOffer({ id: offer.id });
      await this.updateOffersList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouWantToDeleteThisOffer'));
  };

  onSwitchOfferActivation = async (offer: OfferDto) => {
    popupConfirm(
      async () => {
        if (offer.isActive) await this.props.offersStore!.offerDeactivation({ id: offer.id });
        else await this.props.offersStore!.offerAactivation({ id: offer.id });
        await this.updateOffersList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      offer.isActive
        ? L('AreYouSureYouWantToDeactivateThisOffer')
        : L('AreYouSureYouWantToActivateThisOffer')
    );
  };

  offersTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Type'),
      dataIndex: 'type',
      key: 'type',
      render: (type: number) => {
        switch (type) {
          case OfferType.Order:
            return <Tag color={'processing'}>{L('ForOrder')}</Tag>;
          case OfferType.Product:
            return <Tag color={'processing'}>{L('ForProduct')}</Tag>;
        }
        return '';
      },
    },
    {
      title: L('DiscountPercentage'),
      dataIndex: 'percentage',
      key: 'percentage',
      render: (percentage: number) => {
        return `${percentage}%`;
      },
    },
    {
      title: L('StartDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      render: (startDate: string) => {
        return moment(startDate).format(timingHelper.defaultDateFormat);
      },
    },
    {
      title: L('EndDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      render: (endDate: string) => {
        return moment(endDate).format(timingHelper.defaultDateFormat);
      },
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => {
        return (
          <Tag color={isActive ? 'green' : 'volcano'} className="ant-tag-disable-pointer">
            {isActive ? L('Active') : L('Inactive')}
          </Tag>
        );
      },
    },
    {
      title: L('Action'),
      key: 'action',
      width: '10%',
      render: (text: string, item: OfferDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openOfferDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openOfferModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchOfferActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchOfferActivation(item)}
              />
            </Tooltip>
          ) : null}
          {this.state.permisssionsGranted.delete ? (
            <Tooltip title={L('Delete')}>
              <DeleteOutlined
                className="action-icon  red-text"
                onClick={() => this.deleteOffer(item)}
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
      this.updateOffersList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateOffersList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const offers = this.props.offersStore!.offers;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.offersStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Offers')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openOfferModal({ id: 0 })}
              >
                {L('AddOffer')}
              </Button>
            ) : null}
          </div>
        }
      >
        <FilterationBox>
          <Row>
            <Col {...filterationColLayout}>
              <label>{L('Type')}</label>

              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectType')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.type}
                onChange={(value: any) => {
                  this.setState({ type: value });
                }}
              >
                <Select.Option value={0} key={0}>
                  {L('Order')}
                </Select.Option>
                <Select.Option value={1} key={1}>
                  {L('Product')}
                </Select.Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: '15px' }}>
            <Button
              type="primary"
              onClick={async () => {
                await this.updateOffersList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ type: undefined }, async () => {
                  await this.updateOffersList(this.state.meta.pageSize, this.state.meta.skipCount);
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
          loading={this.props.offersStore!.loadingOffers}
          dataSource={offers === undefined ? [] : offers}
          columns={this.offersTableColumns}
        />

        <CreateOrUpdateOffer
          visible={this.state.offerModalVisible}
          onCancel={() =>
            this.setState({
              offerModalVisible: false,
            })
          }
          formRef={this.formRef}
          onOk={this.createOrUpdateOffer}
          modalType={this.state.offerModalType}
          isSubmittingOffer={this.props.offersStore!.isSubmittingOffer}
          offersStore={this.props.offersStore!}
        />

        <OfferDetailsModal
          visible={this.state.offerDetailsModalVisible}
          onCancel={() =>
            this.setState({
              offerDetailsModalVisible: false,
            })
          }
          offerStore={this.props.offersStore!}
        />
      </Card>
    );
  }
}

export default Offers;
