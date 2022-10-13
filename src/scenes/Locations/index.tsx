import * as React from 'react';
import { Button, Card, Dropdown, Menu, Table, Tag } from 'antd';
import { inject, observer } from 'mobx-react';
import Stores from '../../stores/storeIdentifier';
import AppComponentBase from '../../components/AppComponentBase';
import { L } from '../../i18next';
import localization from '../../lib/localization';
import {
  EditOutlined,
  PlusOutlined,
  CaretDownOutlined,
  SettingOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
import LocationStore from '../../stores/locationStore';
import { CreateLocationDto } from '../../services/locations/dto/createLocationDto';
import { UpdateLocationDto } from '../../services/locations/dto/updateLocationDto';
import { LocationDto } from '../../services/locations/dto/locationDto';
import CreateOrUpdateLocation from './components/createOrUpdateLocation';
import CitiesListModal from './components/CitiesListModal';
import { EntityDto } from '../../services/dto/entityDto';
import { popupConfirm } from '../../lib/popupMessages';
import utils from '../../utils/utils';
import userService from '../../services/user/userService';
import { LocationType } from '../../lib/types';

export interface ILocationsProps {
  locationStore?: LocationStore;
}

export interface ILocationsState {
  locationModalVisible: boolean;
  citiesModalVisible: boolean;
  neighbourhoodModalVisible: boolean;
  locationsModalId: number;
  locationsModalType: string;
  meta: {
    page: number;
    pageSize: number | undefined;
    pageSizeOptions: string[];
    pageTotal: number;
    skipCount: number;
    total: number;
  };
  permisssionsGranted: {
    update: boolean;
    create: boolean;
    activation: boolean;
  };
}

declare var abp: any;
const INDEX_PAGE_SIZE_DEFAULT = 4;
const INDEX_PAGE_SIZE_OPTIONS = ['4', '8', '12', '16', '20'];

@inject(Stores.LocationStore)
@observer
export class Locations extends AppComponentBase<ILocationsProps, ILocationsState> {
  formRef = React.createRef<FormInstance>();
  currentUser: any = undefined;

  state = {
    locationModalVisible: false,
    citiesModalVisible: false,
    neighbourhoodModalVisible: false,
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
    permisssionsGranted: {
      update: false,
      create: false,
      activation: false,
    },
    // module:LocationType.Country,
    // parentId:0
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
    this.updateLocationsList(this.state.meta.pageSize, 0);
  }

  async updateLocationsList(maxResultCount: number, skipCount: number) {
    this.props.locationStore!.maxResultCount = maxResultCount;
    this.props.locationStore!.skipCount = skipCount;
    this.props.locationStore!.getCountries();
  }

  async openLocationModal(input: EntityDto) {
    if (input.id === 0) {
      this.props.locationStore!.locationModel = undefined;
      this.setState({ locationsModalType: 'create', locationsModalId: input.id });
    } else {
      await this.props.locationStore!.getCountry(input.id);
      this.setState({ locationsModalType: 'edit', locationsModalId: input.id });
    }
    this.setState({
      locationModalVisible: !this.state.locationModalVisible,
      locationsModalId: input.id,
    });
  }

  openCitiesManagementModal(id: number) {
    this.props.locationStore!.maxResultCount = 1000;
    this.props.locationStore!.skipCount = 0;
    this.props.locationStore!.parentId = id;
    this.props.locationStore!.getCities();
    this.setState({ citiesModalVisible: true, locationsModalId: id });
  }

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

  createOrUpdateLocation = () => {
    const form = this.formRef.current;
    form!.validateFields().then(async (values: any) => {
      if (this.state.locationsModalId === 0) {
        await this.props.locationStore!.createLocation(values as CreateLocationDto);
      } else {
        values.id = this.state.locationsModalId;
        await this.props.locationStore!.updateLocation(values as UpdateLocationDto);
      }
      await this.props.locationStore!.getCountries();
      this.setState({ locationModalVisible: false });
      form!.resetFields();
    });
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
                  <Menu.Item onClick={() => this.openLocationModal({ id: item.id })}>
                    <EditOutlined className="action-icon" />
                    <button className="inline-action">{L('Edit')}</button>
                  </Menu.Item>
                ) : null}
                <Menu.Item onClick={() => this.openCitiesManagementModal(item.id)}>
                  <SettingOutlined className="action-icon" />
                  <button className="inline-action">{L('CitiesManagement')}</button>
                </Menu.Item>
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
    const locations = this.props.locationStore!.countries;
    const pagination = {
      ...this.paginationOptions,
      total: this.props.locationStore!.countriesTotalCount,
      current: this.state.meta.page,
      pageSize: this.state.meta.pageSize,
    };
    return (
      <Card
        title={
          <div>
            <span>{L('Locations')}</span>
            {this.state.permisssionsGranted.create ? (
              <Button
                type="primary"
                style={{ float: localization.getFloat(), margin: '0 5px' }}
                icon={<PlusOutlined />}
                onClick={() => this.openLocationModal({ id: 0 })}
              >
                {L('AddCountry')}
              </Button>
            ) : null}
          </div>
        }
      >
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
          module={LocationType.Country}
          parentId={0}
        />

        <CitiesListModal
          parentId={this.state.locationsModalId}
          locationStore={this.props.locationStore}
          isSubmittingLocation={this.props.locationStore!.isSubmittingLocation}
          visible={this.state.citiesModalVisible}
          onCancel={() => {
            this.setState({ citiesModalVisible: !this.state.citiesModalVisible });
          }}
        />
      </Card>
    );
  }
}

export default Locations;
