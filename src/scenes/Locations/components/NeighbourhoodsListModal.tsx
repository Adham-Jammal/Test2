import * as React from 'react';
import {
  EditOutlined,
  PlusOutlined,
  CaretDownOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import { Button, Dropdown, Menu, Table, Modal, Tag } from 'antd';
import { inject, observer } from 'mobx-react';
import AppComponentBase from '../../../components/AppComponentBase';
import { L } from '../../../i18next';
import { CreateLocationDto } from '../../../services/locations/dto/createLocationDto';
import { LocationDto } from '../../../services/locations/dto/locationDto';
import { UpdateLocationDto } from '../../../services/locations/dto/updateLocationDto';
import LocationStore from '../../../stores/locationStore';
import Stores from '../../../stores/storeIdentifier';
import localization from '../../../lib/localization';
import CreateOrUpdateLocation from './createOrUpdateLocation';
import { popupConfirm } from '../../../lib/popupMessages';
import utils from '../../../utils/utils';
import userService from '../../../services/user/userService';
import { LocationType } from '../../../lib/types';

export interface INeighbourhoodsListModalProps {
  locationStore?: LocationStore;
  parentId: number;
  visible: boolean;
  onCancel: () => void;
  isSubmittingLocation: boolean;
}

export interface INeighbourhoodsListModalState {
  locationModalVisible: boolean;
  locationsModalId: number;
  locationsModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    total: number;
    skipCount: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
  parentId: number;
}

declare var abp: any;
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.LocationStore)
@observer
export class NeighbourhoodsListModal extends AppComponentBase<
  INeighbourhoodsListModalProps,
  INeighbourhoodsListModalState
> {
  formRef = React.createRef<FormInstance>();
  currentUser: any = undefined;

  state = {
    locationModalVisible: false,
    locationsModalId: 0,
    locationsModalType: 'create',
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      skipCount: 0,
      total: 0,
    },
    parentId: 0,
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
  };

  async componentDidMount() {
    this.currentUser = await userService.get({ id: abp.session.userId });
    this.setState({
      permisssionsGranted: {
        update: (await utils.checkIfGrantedPermission('Locations.Update')).valueOf(),
        create: (await utils.checkIfGrantedPermission('Locations.Create')).valueOf(),
        activation: (await utils.checkIfGrantedPermission('Locations.Activation')).valueOf(),
      },
    });
  }
  // async componentDidUpdate() {
  //   if(this.props.parentId!== 0 && this.props.locationStore?.neighbourhoods.length === 0)
  //   this.updateLocationsList(this.state.meta.pageSize, 0);
  // }

  async updateLocationsList(maxResultCount: number, skipCount: number) {
    this.props.locationStore!.maxResultCount = maxResultCount;
    this.props.locationStore!.skipCount = skipCount;
    this.props.locationStore!.parentId = this.props.parentId;
    this.props.locationStore!.getNeighbourhoods();
  }

  async openLocationModal(locationObj: any) {
    if (locationObj.id === 0) {
      this.props.locationStore!.locationModel = undefined;
      this.setState({
        locationsModalType: 'create',
        locationsModalId: locationObj.id,
        parentId: locationObj.parentId,
      });
    } else {
      await this.props.locationStore!.getNeighbourhood(locationObj.id);
      this.setState({ locationsModalType: 'edit', locationsModalId: locationObj.id });
    }
    this.setState({
      locationModalVisible: !this.state.locationModalVisible,
      locationsModalId: locationObj.id,
    });
  }

  createOrUpdateLocation = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.locationsModalId === 0) {
        await this.props.locationStore!.createLocation(values as CreateLocationDto);
      } else {
        values.id = this.state.locationsModalId;
        await this.props.locationStore!.updateLocation(values as UpdateLocationDto);
      }

      this.props.locationStore!.parentId = this.props.parentId;
      await this.props.locationStore!.getNeighbourhoods();
      this.setState({ locationModalVisible: false });
      form!.resetFields();
    });
  };
  onSwitchLocationActivation = async (location: LocationDto) => {
    popupConfirm(
      async () => {
        if (location.isActive)
          await this.props.locationStore!.locationDeactivation({ id: location.id });
        else await this.props.locationStore!.locationActivation({ id: location.id });
        await this.updateLocationsList(this.state.meta.pageSize, this.state.meta.skipCount);
      },
      location.isActive
        ? L('AreYouSureYouWantToDeactivateThisLocation')
        : L('AreYouSureYouWantToActivateThisLocation')
    );
  };

  locationsTableColumns = [
    {
      title: L('ArName'),
      dataIndex: 'arName',
      key: 'arName',
      width: '30%',
    },
    {
      title: L('EnName'),
      dataIndex: 'enName',
      key: 'enName',
      width: '30%',
    },
    {
      title: L('IsActive'),
      dataIndex: 'isActive',
      key: 'isActive',
      width: '30%',
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
      render: (text: string, item: LocationDto) => (
        <div>
          <Dropdown
            trigger={['click']}
            overlay={
              <Menu>
                {this.state.permisssionsGranted.update ? (
                  <Menu.Item
                    onClick={() =>
                      this.openLocationModal({
                        id: item.id,
                        module: LocationType.Neighbourhood,
                        parentId: this.props.parentId,
                      })
                    }
                  >
                    <EditOutlined className="action-icon" />
                    <button className="inline-action">{L('Edit')}</button>
                  </Menu.Item>
                ) : null}
                {this.state.permisssionsGranted.activation ? (
                  <Menu.Item onClick={() => this.onSwitchLocationActivation(item)}>
                    <CheckSquareOutlined className="action-icon" />
                    <button className="inline-action">
                      {item.isActive ? L('Deactivate') : L('Activate')}
                    </button>
                  </Menu.Item>
                ) : null}
              </Menu>
            }
            placement="bottomLeft"
          >
            <Button type="primary" icon={<CaretDownOutlined />} />
          </Dropdown>
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
      this.updateLocationsList(pageSize, 0);
    },
    onChange: async (page: any) => {
      const temp = this.state;
      temp.meta.page = page;
      this.setState(temp);
      await this.updateLocationsList(
        this.state.meta.pageSize,
        (page - 1) * this.state.meta.pageSize
      );
    },
    pageSizeOptions: this.state.meta.pageSizeOptions,
    showTotal: (total: any, range: any) => `${range[0]} ${L('To')} ${range[1]} ${L('Of')} ${total}`,
  };

  public render() {
    const locations = this.props.locationStore!.neighbourhoods;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.locationStore!.neighbourhoodsTotalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Modal
        visible={this.props.visible}
        title={L('NeighbourhoodsManagement')}
        onCancel={this.props.onCancel}
        centered
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        destroyOnClose
        width="70%"
        footer={[
          <Button key="back" onClick={this.props.onCancel}>
            {L('Close')}
          </Button>,
        ]}
      >
        {this.state.permisssionsGranted.create ? (
          <Button
            type="primary"
            style={{ float: localization.getFloat(), margin: '0 5px' }}
            icon={<PlusOutlined />}
            onClick={() => this.openLocationModal({ id: 0, parentId: this.props.parentId })}
          >
            {L('AddNeighbourhood')}
          </Button>
        ) : null}
        <Table
          pagination={pagination}
          rowKey={(record) => record.id + ''}
          style={{ marginTop: '12px' }}
          loading={this.props.locationStore!.loadingLocations}
          dataSource={locations === undefined ? [] : locations}
          columns={this.locationsTableColumns}
        />

        <CreateOrUpdateLocation
          formRef={this.formRef}
          visible={this.state.locationModalVisible}
          onCancel={() =>
            this.setState({
              locationModalVisible: false,
            })
          }
          modalType={this.state.locationsModalType}
          onOk={this.createOrUpdateLocation}
          isSubmittingLocation={this.props.locationStore!.isSubmittingLocation}
          locationStore={this.props.locationStore}
          module={LocationType.Neighbourhood}
          parentId={this.state.parentId}
        />
      </Modal>
    );
  }
}

export default NeighbourhoodsListModal;
