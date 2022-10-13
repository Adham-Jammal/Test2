/* eslint-disable */
import * as React from 'react';
import { Button, Card, Table, Tag, Select, Row, Col, Avatar, Tooltip, FormInstance } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import { EntityDto } from '../../services/dto/entityDto';
import moment from 'moment';
import {
  CheckSquareOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
} from '@ant-design/icons';
import timingHelper from '../../lib/timingHelper';
import SearchComponent from '../../components/SearchComponent';
import FilterationBox from '../../components/FilterationBox';
import { LiteEntityDto } from '../../services/dto/liteEntityDto';
import SliderImageStore from '../../stores/sliderImageStore';
import { SliderImageDto } from '../../services/sliderImages/dto/sliderImageDto';
import ImageModal from '../../components/ImageModal';
import SliderImageDetailsModal from './components/sliderImageDetialsModal';
import { ShopDto } from '../../services/shops/dto/shopDto';
import shopsService from '../../services/shops/shopsService';
import localization from '../../lib/localization';
import { popupConfirm } from '../../lib/popupMessages';
import CreateOrUpdateSliderImage from './components/createOrUpdateSliderImage';

export interface ISliderImagesProps {
  sliderImageStore?: SliderImageStore;
}

export interface ISliderImagesState {
  sliderImageModalId: number;
  sliderImageDetailsModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    skipCount: number;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
  };
  sliderImageModalType: string;
  sliderImageModalVisible: boolean;
  isImageModalOpened: boolean;
  imageModalCaption: string;
  imageModalUrl: string;
  keyword?: string;
  isActive?: boolean;
}

const filterationColLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 8 },
  lg: { span: 7 },
  xl: { span: 7 },
  xxl: { span: 7 },
};

const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.SliderImageStore)
@observer
export class MyPromotions extends AppComponentBase<ISliderImagesProps, ISliderImagesState> {
  products: LiteEntityDto[] = [];
  currentUser: any = undefined;
  formRef = React.createRef<FormInstance>();

  state = {
    isImageModalOpened: false,
    imageModalCaption: '',
    sliderImageModalType: 'create',
    imageModalUrl: '',
    sliderImageModalId: 0,
    sliderImageDetailsModalVisible: false,
    sliderImageModalVisible: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },

    keyword: undefined,
    isActive: undefined,
  };
  shopInfo: ShopDto | undefined = undefined;

  async componentDidMount() {
    //this.currentUser = await userService.get({ id: abp.session.userId });
    try {
      let result2 = await shopsService.getCurrentShopInfo();
      this.shopInfo = result2;
    } catch {
      window.location.href = '/user/shop/complete-registeration';
    }

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
    this.props.sliderImageStore!.keyword = this.state.keyword;
    this.props.sliderImageStore!.myPromotions = true;
    //  this.props.sliderImageStore!.shopId = this.shopInfo.i;

    this.props.sliderImageStore!.getSliderImages();
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
  sliderImagesTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
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
          <Tooltip title={L('Edit')}>
            <EditOutlined
              className="action-icon "
              onClick={() => this.openSliderImageModal({ id: item.id })}
            />
          </Tooltip>
          {item.isActive ? (
            <Tooltip title={L('Deactivate')}>
              <StopOutlined
                className="action-icon  red-text"
                onClick={() => this.onSwitchSliderImageActivation(item)}
              />
            </Tooltip>
          ) : (
            <Tooltip title={L('Activate')}>
              <CheckSquareOutlined
                className="action-icon  green-text"
                onClick={() => this.onSwitchSliderImageActivation(item)}
              />
            </Tooltip>
          )}
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
            <span>{L('MyPromotions')}</span>
            <Button
              type="primary"
              style={{ float: localization.getFloat() }}
              icon={<PlusOutlined />}
              onClick={() => this.openSliderImageModal({ id: 0 })}
            >
              {L('AddSliderImage')}
            </Button>
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
                this.setState({ isActive: undefined }, async () => {
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
          shopId={this.shopInfo?.id!}
        />
      </Card>
    );
  }
}

export default MyPromotions;
