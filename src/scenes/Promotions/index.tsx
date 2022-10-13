/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Avatar, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import localization from '../../lib/localization';
import moment from 'moment';
import {
  EditOutlined,
  PlusOutlined,
  EyeOutlined,
  CheckSquareOutlined,
  DeleteOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import timingHelper from '../../lib/timingHelper';
import userService from '../../services/user/userService';
import utils from '../../utils/utils';
import SearchComponent from '../../components/SearchComponent';
import FilterationBox from '../../components/FilterationBox';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import SliderImageStore from '../../stores/sliderImageStore';
import { SliderImageDto } from '../../services/sliderImages/dto/sliderImageDto';
import ImageModal from '../../components/ImageModal';
import { popupConfirm } from '../../lib/popupMessages';
import SliderImageDetailsModal from './components/sliderImageDetialsModal';
import CreateOrUpdateSliderImage from './components/createOrUpdateSliderImage';
import shopsService from '../../services/shops/shopsService';

export interface ISliderImagesProps {
  sliderImageStore?: SliderImageStore;
}

export interface ISliderImagesState {
  sliderImageModalVisible: boolean;
  sliderImageModalId: number;
  sliderImageModalType: string;
  sliderImageDetailsModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    delete: boolean;
    activation: boolean;
  };
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  keyword?: string;
  isActive?: boolean;
  shopId?: number;
}
declare var abp: any;
const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

const filterationColLayout2 = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 9, offset: 2 },
  lg: { span: 7, offset: 1 },
  xl: { span: 7, offset: 1 },
  xxl: { span: 7, offset: 1 },
};

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.SliderImageStore)
@observer
export class SliderImages extends AppComponentBase<ISliderImagesProps, ISliderImagesState> {
  formRef = React.createRef<FormInstance>();
  currentUser: any = undefined;
  shops: LiteEntityDto[] = [];
  state = {
    sliderImageModalVisible: false,
    isImageModalOpened: false,
    imageModalCaption: '',
    imageModalUrl: '',
    sliderImageModalId: 0,
    sliderImageModalType: 'create',
    sliderImageDetailsModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    permisssionsGranted: {
      update: false,
      create: false,
      delete: false,
      activation: false,
    },
    keyword: undefined,
    shopId: undefined,
    isActive: undefined,
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('SliderImages.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('SliderImages.Create')).valueOf(),
        delete: (await utils.checkIfGrantedPermission('SliderImages.Delete')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('SliderImages.Activation')).valueOf(),
      },
    });
    let result = await shopsService.getAllLite({ isActive: true });
    this.shops = result.items;
    await this.updateSliderImagesList(this.state.meta.pageSize, 0);
  }

  openImageModal(image: string, caption: string) {
    this.setState({ isImageModalOpened: true, imageModalCaption: caption, imageModalUrl: image });
  }

  closeImageModal() {
    this.setState({ isImageModalOpened: false, imageModalCaption: '', imageModalUrl: '' });
  }

  async updateSliderImagesList(maxResultCount: number, skipCount: number) {
    this.props.sliderImageStore!.maxResultCount = maxResultCount;
    this.props.sliderImageStore!.skipCount = skipCount;
    this.props.sliderImageStore!.isActiveFilter = this.state.isActive;
    this.props.sliderImageStore!.shopId = this.state.shopId;
    this.props.sliderImageStore!.keyword = this.state.keyword;
    this.props.sliderImageStore!.getSliderImages();
  }

  async openSliderImageModal(entityDto: EntityDto) {
    this.props.sliderImageStore!.SliderImageModel = undefined;
    if (entityDto.id === 0) {
      this.setState({ sliderImageModalType: 'create' });
    } else {
      await this.props.sliderImageStore!.getSliderImage(entityDto);
      this.setState({ sliderImageModalType: 'edit' });
    }

    this.setState({
      sliderImageModalVisible: !this.state.sliderImageModalVisible,
      sliderImageModalId: entityDto.id,
    });
  }

  async openSliderImageDetailsModal(entityDto: EntityDto) {
    await this.props.sliderImageStore!.getSliderImage(entityDto);

    this.setState({
      sliderImageDetailsModalVisible: !this.state.sliderImageDetailsModalVisible,
      sliderImageModalId: entityDto.id,
    });
  }

  onSwitchSliderImageActivation = async (sliderImage: SliderImageDto) => {
    popupConfirm(
      async () => {
        if (sliderImage.isActive)
          await this.props.sliderImageStore!.sliderImageDeactivation({ id: sliderImage.id });
        else await this.props.sliderImageStore!.sliderImageActivation({ id: sliderImage.id });
        await this.updateSliderImagesList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      sliderImage.isActive
        ? L('AreYouSureYouWantToDeactivateThisSliderImage')
        : L('AreYouSureYouWantToActivateThisSliderImage')
    );
  };

  onDeleteSliderImage = async (input: EntityDto) => {
    popupConfirm(async () => {
      await this.props.sliderImageStore!.deleteSliderImage({ id: input.id });
      await this.updateSliderImagesList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouWantToDeleteThisSliderImage'));
  };

  sliderImagesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Shop'),
      dataIndex: 'shopId',
      key: 'shopId',
      // render: (shopId: number) => {
      //   return shopId ? <a href={`/product/${productId}`}>{productId}</a> : undefined;
      // },
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string, item: SliderImageDto) => {
        return (
          <div
            onClick={() => this.openImageModal(item.imageUrl!, item.shopId + '')}
            style={{ display: 'inline-block', cursor: 'zoom-in' }}
          >
            <Avatar shape="square" size={50} src={item.imageUrl} />
          </div>
        );
      },
    },
    {
      title: L('Status'),
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
      title: L('Action'),
      key: 'action',
      render: (text: string, item: SliderImageDto) => (
        <div>
          <Tooltip title={L('Details')}>
            <EyeOutlined
              className="action-icon "
              onClick={() => this.openSliderImageDetailsModal({ id: item.id })}
            />
          </Tooltip>
          {this.state.permisssionsGranted.update ? (
            <Tooltip title={L('Edit')}>
              <EditOutlined
                className="action-icon "
                onClick={() => this.openSliderImageModal({ id: item.id })}
              />
            </Tooltip>
          ) : null}
          {item.isActive ? (
            this.state.permisssionsGranted.activation ? (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.onSwitchSliderImageActivation(item)}
                />
              </Tooltip>
            ) : null
          ) : this.state.permisssionsGranted.activation ? (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchSliderImageActivation(item)}
              />
            </Tooltip>
          ) : null}
          {this.state.permisssionsGranted.delete ? (
            <Tooltip title={L('Delete')}>
              <DeleteOutlined
                className="action-icon  red-text"
                onClick={() => this.onDeleteSliderImage({ id: item.id })}
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
      this.updateSliderImagesList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateSliderImagesList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const sliderImages = this.props.sliderImageStore!.sliderImages;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.sliderImageStore!.totalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('SliderImages')}</span>
            {this.state.permisssionsGranted.create && (
              <Button
                type="primary"
                style={{ float: localization.getFloat() }}
                icon={<PlusOutlined />}
                onClick={() => this.openSliderImageModal({ id: 0 })}
              >
                {L('AddSliderImage')}
              </Button>
            )}
          </div>
        }
      >
        <SearchComponent
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateSliderImagesList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />
        <FilterationBox>
          <Row>
            <Col {...filterationColLayout}>
              <label>{L('ShopName')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                allowClear
                placeholder={L('PleaseSelectShop')}
                optionFilterProp="children"
                filterOption={(input, option: any) =>
                  option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                value={this.state.shopId}
                onChange={(value: any) => {
                  this.setState({ shopId: value });
                }}
              >
                {this.shops.length > 0 &&
                  this.shops.map((element: LiteEntityDto) => (
                    <Select.Option key={element.value} value={element.value}>
                      {element.text}
                    </Select.Option>
                  ))}
              </Select>
            </Col>
            <Col {...filterationColLayout2}>
              <label>{L('IsActive')}</label>
              <Select
                style={{ display: 'block' }}
                showSearch
                optionFilterProp="children"
                onChange={(value: any) => {
                  this.setState({ isActive: value === 3 ? undefined : value === 1 ? true : false });
                }}
                value={this.state.isActive === undefined ? 3 : !this.state.isActive ? 0 : 1}
              >
                <Select.Option key={1} value={1}>
                  {L('Activated')}
                </Select.Option>
                <Select.Option key={0} value={0}>
                  {L('Deactivated')}
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
                await this.updateSliderImagesList(
                  this.state.meta.pageSize,
                  this.state.meta.skipCount
                );
              }}
              style={{ width: 90 }}
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState({ shopId: undefined, isActive: undefined }, async () => {
                  await this.updateSliderImagesList(
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
          loading={this.props.sliderImageStore!.loadingSliderImages}
          dataSource={sliderImages === undefined ? [] : sliderImages}
          columns={this.sliderImagesTableColumns}
        />

        <CreateOrUpdateSliderImage
          formRef={this.formRef}
          visible={this.state.sliderImageModalVisible}
          onCancel={() =>
            this.setState({
              sliderImageModalVisible: false,
            })
          }
          sliderImageModalId={this.state.sliderImageModalId}
          modalType={this.state.sliderImageModalType}
          isSubmittingSliderImage={this.props.sliderImageStore!.isSubmittingSliderImage}
          sliderImageStore={this.props.sliderImageStore!}
        />

        <SliderImageDetailsModal
          visible={this.state.sliderImageDetailsModalVisible}
          onCancel={() =>
            this.setState({
              sliderImageDetailsModalVisible: false,
            })
          }
          sliderImageStore={this.props.sliderImageStore!}
        />

        <ImageModal
          isOpen={this.state.isImageModalOpened}
          caption={this.state.imageModalCaption}
          src={this.state.imageModalUrl}
          onClose={() => {
            this.closeImageModal();
          }}
        />
      </Card>
    );
  }
}

export default SliderImages;
