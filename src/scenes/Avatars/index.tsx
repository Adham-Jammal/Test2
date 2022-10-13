/* eslint-disable */
import React from 'react';
import { Card, Button, Tooltip, Table, Tag, Row, Col, Select, Image } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  StopOutlined,
  CheckSquareOutlined,
  EditOutlined,
  DeleteOutlined,
  UpOutlined,
  DownOutlined,
} from '@ant-design/icons';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import FiltrationBox from '../../components/FilterationBox';
import { L } from '../../i18next';
import AppComponentBase from '../../components/AppComponentBase';
import { popupConfirm } from '../../lib/popupMessages';
import SearchComponent from '../../components/SearchComponent';
import { isGranted } from '../../lib/abpUtility';

import './index.less';
import AvatarStore from '../../stores/AvatarStore';
import { AvatarDto, CreateOrUpdateAvatarDto } from '../../services/avatars/dto';
import AvatarDetails from './components/AvatarDetails';
import CreateOrUpdateAvatar from './components/CreateOrUpdateModal';
import { GenderType } from '../../lib/types';

export const fallBackImage =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg==';

export interface IAvatarsProps {
  avatarStore: AvatarStore;
}
export interface IAvatarState {
  avatarModalVisible: boolean;
  avatarModalType: string;
  avatarDetailsModalVisible: boolean;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };

  permissionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
    delete: boolean;
  };

  avatarData?: AvatarDto;
  avatarDetailsData?: AvatarDto;
  statusFilter?: boolean;
  keyword?: string;
}
// pages default options
const INDEX_PAGE_SIZE_DEFAULT = 15;
const INDEX_PAGE_SIZE_OPTIONS = ['15', '30', '35', '50', '65'];

// col layout for sorter
const colLayout = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 12 },
  xl: { span: 8 },
  xxl: { span: 8 },
};

@inject(Stores.AvatarStore)
@observer
export class Avatars extends AppComponentBase<IAvatarsProps, IAvatarState> {
  state = {
    avatarModalVisible: false,
    avatarDetailsModalVisible: false,
    avatarModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      skipCount: 0,
    },
    permissionsGranted: {
      update: false,
      create: false,
      activation: false,
      delete: false,
    },
    avatarData: undefined,
    avatarDetailsData: undefined,
    statusFilter: undefined,
    keyword: undefined,
  };

  // check the permission granted to user when the comp is mount
  async componentDidMount() {
    this.setState({
      permissionsGranted: {
        update: isGranted('Avatars.Update'),
        create: isGranted('Avatars.Create'),
        activation: isGranted('Avatars.Activation'),
        delete: isGranted('Avatars.Delete'),
      },
    });
    this.updateAvatarsList(this.state.meta.pageSize, 0);
  }

  openAvatarModal = (data?: AvatarDto): void => {
    if (data) {
      this.setState({
        avatarData: data,
        avatarModalVisible: true,
        avatarModalType: 'update',
      });
    } else {
      this.setState({
        avatarModalVisible: true,
        avatarModalType: 'create',
        avatarData: undefined,
      });
    }
  };

  onDeleteAvatar = async (id: number) => {
    popupConfirm(async () => {
      await this.props.avatarStore!.avatarDelete({ id });
      await this.updateAvatarsList(this.state.meta.pageSize, this.state.meta.skipCount);
    }, L('AreYouSureYouWantToDeleteThisAvatar'));
  };

  openAvatarDetailsModal = (data: AvatarDto): void => {
    this.setState({
      avatarDetailsModalVisible: true,
      avatarDetailsData: data,
    });
  };

  changeStatus = async (id: number, status: boolean) => {
    popupConfirm(
      async () => {
        if (!status) {
          await this.props.avatarStore!.avatarActivation({ id });
        } else {
          await this.props.avatarStore!.avatarDeActivation({ id });
        }
        await this.updateAvatarsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      status
        ? L('AreYouSureYouWantToDeactivateThisAvatar')
        : L('AreYouSureYouWantToActivateThisAvatar')
    );
  };

  async updateAvatarsList(
    maxResultCount: number,
    skipCount: number,
    sorting?: string
  ): Promise<void> {
    const { keyword, statusFilter } = this.state;
    this.props.avatarStore!.maxResultCount = maxResultCount;
    this.props.avatarStore!.skipCount = skipCount;
    this.props.avatarStore!.keyword = keyword;
    this.props.avatarStore!.IsActive = statusFilter;
    this.props.avatarStore!.sorting = sorting;
    this.props.avatarStore!.getAvatars();
  }

  // handle change of sorter
  handleTableChange = (_1: any, _2: any, sorter: any): void => {
    if (sorter.order === 'ascend') {
      this.updateAvatarsList(this.state.meta.pageSize, 0, `${sorter.columnKey} ASC`);
    } else if (sorter.order === 'descend') {
      this.updateAvatarsList(this.state.meta.pageSize, 0, `${sorter.columnKey} DESC`);
    } else {
      this.updateAvatarsList(this.state.meta.pageSize, 0);
    }
  };

  avatarsTableColumns = [
    {
      title: L('ID'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('Image'),
      dataIndex: 'image',
      key: 'image',
      render: (mainPicture: string): JSX.Element => (
        <Image
          preview={!!mainPicture}
          width={50}
          height={50}
          src={mainPicture || fallBackImage}
          alt={L('Image')}
        />
      ),
    },

    {
      title: L('Status'),
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: number): JSX.Element => (
        <>
          {isActive ? (
            <Tag color="green">{L('Active')}</Tag>
          ) : (
            <Tag color="red">{L('Inactive')}</Tag>
          )}
        </>
      ),
    },

    {
      title: L('Action'),
      key: 'action',
      render: (_: string, item: AvatarDto): JSX.Element => {
        const { permissionsGranted } = this.state;
        return (
          <div>
            <Tooltip title={L('Details')}>
              <EyeOutlined
                className="action-icon"
                onClick={() => this.openAvatarDetailsModal(item)}
              />
            </Tooltip>
            {permissionsGranted.update && (
              <Tooltip title={L('Edit')}>
                <EditOutlined className="action-icon" onClick={() => this.openAvatarModal(item)} />
              </Tooltip>
            )}
            {permissionsGranted.delete && (
              <Tooltip title={L('Delete')}>
                <DeleteOutlined
                  className="action-icon"
                  onClick={() => this.onDeleteAvatar(item.id)}
                />
              </Tooltip>
            )}
            {permissionsGranted.activation && item.isActive && (
              <Tooltip title={L('Deactivate')}>
                <StopOutlined
                  className="action-icon  red-text"
                  onClick={() => this.changeStatus(item.id, item.isActive)}
                />
              </Tooltip>
            )}
            {permissionsGranted.activation && !item.isActive && (
              <Tooltip title={L('Activate')}>
                <CheckSquareOutlined
                  className="action-icon green-text"
                  onClick={() => this.changeStatus(item.id, item.isActive)}
                />
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // table paginationOptions

  paginationOptions = {
    showSizeChanger: true,
    onShowSizeChange: async (_: number, pageSize: any) => {
      const temp = this.state;
      temp.meta.pageSize = pageSize;
      this.setState(temp);
      this.updateAvatarsList(pageSize, 0);
    },
    onChange: async (page: number) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateAvatarsList(this.state.meta.pageSize, (page - 1) * this.state.meta.pageSize);
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: number, range: number[]) =>
      `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  // handle submit create or update modal
  onOk = async (values: CreateOrUpdateAvatarDto) => {
    const { avatarModalType } = this.state;
    if (avatarModalType === 'create') {
      await this.props.avatarStore!.createAvatar(values);
    } else {
      await this.props.avatarStore!.updateAvatar(values);
    }
    await this.updateAvatarsList(this.state.meta.pageSize, this.state.meta.skipCount);
    this.setState({ avatarModalVisible: false, avatarData: undefined });
  };

  public render() {
    const { avatars, totalCount, loadingAvatars, isSubmittingAvatar } =
      this.props.avatarStore! || {};
    const {
      meta: { page, pageSize },
      avatarModalVisible,
      avatarModalType,
      avatarData,
      avatarDetailsData,
      avatarDetailsModalVisible,
    } = this.state;

    const pagination = {
      ...this.paginationOptions,
      total: totalCount,
      current: page,
      pageSize,
    };
    return (
      <Card
        title={
          <div className="page-head">
            <span>{L('Avatars')}</span>
            {this.state.permissionsGranted.create && (
              <Button type="primary" icon={<PlusOutlined />} onClick={() => this.openAvatarModal()}>
                {L('AddAvatar')}
              </Button>
            )}
          </div>
        }
      >
        {/* Search Component */}
        <SearchComponent
          placeHolder={L('AvatarSearchPlaceHolder')}
          onSearch={(value: string) => {
            this.setState({ keyword: value }, () => {
              this.updateAvatarsList(this.state.meta.pageSize, this.state.meta.skipCount);
            });
          }}
        />

        {/* filter box based on status */}
        <FiltrationBox>
          <Row gutter={[15, 20]}>
            <Col {...colLayout}>
              <label>{L('Status')}</label>
              <Select
                className="filter-select"
                showSearch
                optionFilterProp="children"
                placeholder={L('selectStatus')}
                onChange={(value: any) => {
                  this.setState({
                    statusFilter: value === 3 ? undefined : value === 1 ? true : false,
                  });
                }}
                value={this.state.statusFilter === undefined ? 3 : !this.state.statusFilter ? 0 : 1}
              >
                <Select.Option key={0} value={0}>
                  {L('Inactive')}
                </Select.Option>
                <Select.Option key={1} value={1}>
                  {L('Active')}
                </Select.Option>

                <Select.Option key={3} value={3}>
                  {L('All')}
                </Select.Option>
              </Select>
            </Col>
          </Row>

          <div className="btns-wrap">
            <Button
              type="primary"
              onClick={async () => {
                await this.updateAvatarsList(this.state.meta.pageSize, this.state.meta.skipCount);
              }}
              className="filter-btn"
            >
              {L('Filter')}
            </Button>
            <Button
              onClick={() => {
                this.setState(
                  {
                    statusFilter: undefined,
                  },
                  async () => {
                    await this.updateAvatarsList(
                      this.state.meta.pageSize,
                      this.state.meta.skipCount
                    );
                  }
                );
              }}
            >
              {L('ResetFilter')}
            </Button>
          </div>
        </FiltrationBox>

        <Table
          className="avatar-table"
          pagination={pagination}
          rowKey={(record) => `${record.id}`}
          loading={loadingAvatars}
          dataSource={avatars || []}
          columns={this.avatarsTableColumns}
          onChange={this.handleTableChange}
          expandable={{
            expandIcon: ({ expanded, onExpand, record }) =>
              expanded ? (
                <UpOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ) : (
                <DownOutlined className="expand-icon" onClick={(e) => onExpand(record, e)} />
              ),
            expandedRowRender: (record) => (
              <p className="expanded-row" style={{ margin: 0 }}>
                <span>
                  <b>{L('Gender')}: </b>
                  <Tag style={{ width: 'fit-content', display: 'inline-block' }} color="blue">
                    {record.gender === GenderType.Female ? L('Female') : L('Male')}
                  </Tag>
                </span>
              </p>
            ),
            rowExpandable: (record) => true,
          }}
        />

        {/* create or update modal  */}
        <CreateOrUpdateAvatar
          visible={avatarModalVisible}
          onCancel={() => this.setState({ avatarModalVisible: false, avatarData: undefined })}
          modalType={avatarModalType}
          onOk={this.onOk}
          isSubmittingAvatar={isSubmittingAvatar}
          avatarData={avatarData}
        />
        <AvatarDetails
          avatarData={avatarDetailsData}
          visible={avatarDetailsModalVisible}
          onCancel={() =>
            this.setState({ avatarDetailsModalVisible: false, avatarDetailsData: undefined })
          }
        />
      </Card>
    );
  }
}
export default Avatars;
