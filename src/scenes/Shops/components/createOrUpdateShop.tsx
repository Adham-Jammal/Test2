/* eslint-disable */

import React from 'react';
import {
  Form,
  Button,
  Steps,
  Modal,
  Input,
  Select,
  Row,
  Col,
  Radio,
  RadioChangeEvent,
  Spin,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { L } from '../../../i18next';
import * as rules from '../../ShopManagerCompleteRegisteration/validations';
import localization from '../../../lib/localization';
import { LiteEntityDto } from '../../../services/dto/liteEntityDto';
import { useStepsForm } from 'sunflower-antd';
import { arabicNameRules, countriesCodes, countyCode, englishNameRules } from '../../../constants';
import { IndexType, LocationType, ShopType } from '../../../lib/types';
import GoogleMapComp from '../../../components/GoogleMap';
import EditableImage from '../../../components/EditableImage';
import { CreateOrUpdateShopDto } from '../../../services/shops/dto/createShopDto';
import {
  ExpectedMonthlySales,
  ReasonCreatingShop,
  ShopDto,
} from '../../../services/shops/dto/shopDto';
import indexesService from '../../../services/indexes/indexesService';
import categoriesService from '../../../services/categories/categoriesService';
import locationsService from '../../../services/locations/locationsService';
import './index.less';

interface CreateOrUpdateShopProps {
  visible: boolean;
  onCancel: () => void;
  modalType: string;
  onOk: (values: CreateOrUpdateShopDto) => void;
  isSubmittingShop: boolean;
  shopData?: ShopDto;
  isGettingData: boolean;
}

const shopTypeOptions = [
  { label: L('Individual'), value: ShopType.Individual },
  { label: L('Charity'), value: ShopType.Charity },
  { label: L('Corporation'), value: ShopType.Corporation },
  { label: L('Company'), value: ShopType.Company },
];
const creationPurposeOptions = [
  { label: L('MovingFromAnotherPlatform'), value: ReasonCreatingShop.MovingFromAnotherPlatform },
  { label: L('Exploration'), value: ReasonCreatingShop.Exploration },
  { label: L('SettingUpForAnotherShop'), value: ReasonCreatingShop.SettingUpForAnotherShop },
  {
    label: L('TransferringTraditionalCommerceToElectronic'),
    value: ReasonCreatingShop.TransferringTraditionalCommerceToElectronic,
  },
];
const salesExpectationInMonthOptions = [
  { label: L('LessThanTenThousand'), value: ExpectedMonthlySales.LessThanTenThousand },
  { label: L('LessThanHundredThousand'), value: ExpectedMonthlySales.LessThanHundredThousand },
  {
    label: L('FiveHundredThousandAndMore'),
    value: ExpectedMonthlySales.FiveHundredThousandAndMore,
  },
];

const { Step } = Steps;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const CreateOrUpdateShop: React.FC<CreateOrUpdateShopProps> = ({
  visible,
  onCancel,
  modalType,
  onOk,
  isSubmittingShop,
  isGettingData,
  shopData,
}) => {
  const [banks, setBanks] = React.useState<LiteEntityDto[]>([]);
  const [categories, setCategories] = React.useState<LiteEntityDto[]>([]);
  const [cities, setCities] = React.useState<LiteEntityDto[]>([]);
  const [arLogo, setArLogo] = React.useState<string | undefined>(undefined);
  const [enLogo, setEnLogo] = React.useState<string | undefined>(undefined);
  const [arCover, setArCover] = React.useState<string | undefined>(undefined);
  const [enCover, setEnCover] = React.useState<string | undefined>(undefined);
  const [shopType, setShopType] = React.useState<number>(-1);
  const [creationPurpose, setCreationPurpose] = React.useState<number | undefined>(undefined);
  const [bundleId, setBundleId] = React.useState<number | undefined>(undefined);
  const [salesExpectationInMonth, setSalesExpectationInMonth] = React.useState<number | undefined>(
    undefined
  );
  const [lat, setLat] = React.useState<number>(0);
  const [lng, setLng] = React.useState<number>(0);

  React.useEffect(() => {
    async function getBanksAndCategoriesAndCities(): Promise<void> {
      const result = await indexesService.getAllLite({
        maxResultCount: 100,
        skipCount: 0,
        type: IndexType.Bank,
      });
      setBanks(result.items);
      const result2 = await categoriesService.getAllLite();
      setCategories(result2.items);
      const result3 = await locationsService.getAllLite({
        type: LocationType.City,
      });
      setCities(result3.items);
    }
    getBanksAndCategoriesAndCities();
  }, []);

  React.useEffect(() => {
    if (modalType === 'edit' && shopData) {
      setArLogo(shopData.arLogoUrl);
      setEnLogo(shopData.enLogoUrl);
      setArCover(shopData.arCoverUrl);
      setEnCover(shopData.enCoverUrl);
      setLat(shopData.latitude);
      setLng(shopData.longitude);
    } else if (modalType === 'create') {
      form.resetFields();
    }
    gotoStep(0);
  }, [shopData, modalType]);

  const handleCancelModal = async () => {
    await form.resetFields();
    onCancel();
  };

  const {
    form,
    current = 0,
    gotoStep,
    stepsProps,
    formProps,
    submit,
  } = useStepsForm({
    async submit(values) {
      const {
        arName,
        enName,
        arLogoUrl,
        enLogoUrl,
        arCoverUrl,
        enCoverUrl,
        arDescription,
        enDescription,
        cityId,
        placeDescription,
        categories,
        banks,
        ownerCountryCode,
        ownerEmail,
        ownerName,
        ownerPhoneNumber,
        password,
      } = values;

      type A = {
        lat: string;
        lng: string;
      };
      const { lat, lng } = placeDescription as A;
      let banksTemp = banks as Array<string>;
      let newBanks: Array<number> = [];
      banksTemp.map((bank: string) => newBanks.push(+bank));
      let catsTemp = categories as Array<string>;
      let newCats: Array<number> = [];
      catsTemp.map((cat: string) => newCats.push(+cat));
      const newValues: CreateOrUpdateShopDto = {
        enName: enName?.toString(),
        arName: arName?.toString(),
        type: shopType,
        arLogoUrl: arLogoUrl?.toString(),
        enLogoUrl: enLogoUrl?.toString(),
        arCoverUrl: arCoverUrl?.toString(),
        enCoverUrl: enCoverUrl?.toString(),
        arDescription: arDescription?.toString(),
        enDescription: enDescription?.toString(),
        cityId: +cityId?.toString(),
        latitude: +lat,
        longitude: +lng,
        categories: newCats,
        banks: newBanks,
        reasonCreatingShop: creationPurpose!,
        expectedMonthlySales: salesExpectationInMonth!,
        bundleId: bundleId!,
        ownerCountryCode: ownerCountryCode?.toString(),
        ownerEmail: ownerEmail?.toString(),
        ownerName: ownerName?.toString(),
        ownerPhoneNumber: ownerPhoneNumber?.toString(),
        password: password?.toString(),
      };

      const submitData = modalType === 'edit' ? { ...newValues, id: shopData!.id } : newValues;
      await onOk(submitData);
      return 'ok';
    },
    total: 5,
  });

  const formList = [
    <>
      <Form.Item
        name="ownerName"
        initialValue={shopData ? shopData.name : undefined}
        label={L('Name')}
        rules={rules.firstName}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="ownerEmail"
        initialValue={shopData && shopData.manager ? shopData.manager.emailAddress : undefined}
        label={L('Email')}
        rules={rules.email}
      >
        <Input />
      </Form.Item>
      <Row>
        <Col md={{ span: 9, offset: 0 }} xs={{ span: 9, offset: 0 }}>
          {' '}
          <Form.Item
            initialValue={shopData ? shopData.ownerCountryCode : '+966'}
            name="ownerCountryCode"
            label={L('CountryCode')}
          >
            <Select
              className="country-code-dropdown"
              optionFilterProp="children"
              filterOption={(input, option: any) =>
                option.children[2].props.children[1].indexOf(input.toLowerCase()) >= 0
              }
              filterSort={(optionA: any, optionB: any) =>
                optionA.children[2].props.children[1].localeCompare(
                  optionB.children[2].props.children[1]
                )
              }
              showSearch
            >
              {countriesCodes.map((country: countyCode, index: number) => {
                return (
                  <Select.Option value={country.dial_code} key={index}>
                    <i className={'famfamfam-flags ' + country.code.toLowerCase()} />{' '}
                    <span className="code-opt"> {country.dial_code}</span>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={{ span: 14, offset: 1 }} md={{ span: 14, offset: 1 }}>
          <Form.Item
            name="ownerPhoneNumber"
            initialValue={shopData ? shopData.ownerPhoneNumber : undefined}
            label={L('PhoneNumber')}
            rules={rules.phoneNumber}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      {modalType === 'create' && (
        <Form.Item name="password" label={L('Password')} rules={rules.password}>
          <Input.Password visibilityToggle />
        </Form.Item>
      )}
    </>,
    <>
      <Form.Item
        name="email"
        initialValue={shopData ? shopData.email : undefined}
        label={L('ShopEmail')}
        rules={rules.email}
      >
        <Input />
      </Form.Item>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item
            name="arName"
            rules={[...arabicNameRules, ...rules.ShopName]}
            label={L('ShopArName')}
            initialValue={shopData ? shopData.arName : undefined}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            name="enName"
            rules={[...englishNameRules, ...rules.ShopName]}
            label={L('ShopEnName')}
            initialValue={shopData ? shopData.enName : undefined}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name="type"
        label={L('ShopType')}
        initialValue={shopData ? shopData.type : undefined}
        rules={[rules.required]}
      >
        <Radio.Group
          options={shopTypeOptions}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setShopType(value);
          }}
          optionType="button"
        />
      </Form.Item>
      <Form.Item
        name="CreationPurpose"
        initialValue={shopData ? shopData.reasonCreatingShop : undefined}
        label={L('CreationPurpose')}
      >
        <Radio.Group
          options={creationPurposeOptions}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setCreationPurpose(value);
          }}
          optionType="button"
        />
      </Form.Item>
      <Form.Item
        name="SalesExpectationInMonth"
        initialValue={shopData ? shopData.expectedMonthlySales : undefined}
        label={L('SalesExpectationInMonth')}
      >
        <Radio.Group
          options={salesExpectationInMonthOptions}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setSalesExpectationInMonth(value);
          }}
          optionType="button"
        />
      </Form.Item>
    </>,

    <>
      <Form.Item
        name="categories"
        initialValue={shopData ? shopData.categories.map((cat) => cat.value + '') : undefined}
        label={L('Categories')}
        rules={[rules.required]}
      >
        <Select placeholder={L('PleaseSelectTheCategories')} mode="multiple">
          {categories &&
            categories?.length > 0 &&
            categories.map((category: LiteEntityDto) => (
              <Select.Option key={category.value} value={category.value}>
                {category.text}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item
            name="arLogoUrl"
            initialValue={shopData && shopData.arLogoUrl ? shopData.arLogoUrl : undefined}
            label={L('ShopArLogo')}
          >
            <EditableImage
              defaultFileList={
                arLogo !== null && arLogo !== undefined
                  ? [
                      {
                        uid: '1',
                        status: 'done',
                        url: arLogo,
                      },
                    ]
                  : []
              }
              onSuccess={(url: string) => {
                form.setFieldsValue({ arLogoUrl: url });
                setArLogo(url);
              }}
              onRemove={() => {
                setArLogo(undefined);
                form.setFieldsValue({ arLogoUrl: undefined });
              }}
            />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            name="enLogoUrl"
            initialValue={shopData && shopData.enLogoUrl ? shopData.enLogoUrl : undefined}
            label={L('ShopEnLogo')}
          >
            <EditableImage
              defaultFileList={
                enLogo !== null && enLogo !== undefined
                  ? [
                      {
                        uid: '1',
                        status: 'done',
                        url: enLogo,
                      },
                    ]
                  : []
              }
              onSuccess={(url: string) => {
                form.setFieldsValue({ enLogoUrl: url });
                setEnLogo(url);
              }}
              onRemove={() => {
                setEnLogo(undefined);
                form.setFieldsValue({ enLogoUrl: undefined });
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item
            name="arCoverUrl"
            initialValue={shopData && shopData.arCoverUrl ? shopData.arCoverUrl : undefined}
            label={L('ShopArCover')}
          >
            <EditableImage
              defaultFileList={
                arCover !== null && arCover !== undefined
                  ? [
                      {
                        uid: '1',
                        status: 'done',
                        url: arCover,
                      },
                    ]
                  : []
              }
              onSuccess={(url: string) => {
                form.setFieldsValue({ arCoverUrl: url });
                setArCover(url);
              }}
              onRemove={() => {
                setArCover(undefined);
                form.setFieldsValue({ arCoverUrl: undefined });
              }}
            />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            name="enCoverUrl"
            initialValue={shopData && shopData.enCoverUrl ? shopData.enCoverUrl : undefined}
            label={L('ShopEnCover')}
          >
            <EditableImage
              defaultFileList={
                enCover !== null && enCover !== undefined
                  ? [
                      {
                        uid: '1',
                        status: 'done',
                        url: enCover,
                      },
                    ]
                  : []
              }
              onSuccess={(url: string) => {
                form.setFieldsValue({ enCoverUrl: url });
                setEnCover(url);
              }}
              onRemove={() => {
                setEnCover(undefined);
                form.setFieldsValue({ enCoverUrl: undefined });
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item
            name="arDescription"
            rules={[rules.required]}
            label={L('ShopArDescription')}
            initialValue={shopData ? shopData.arDescription : undefined}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            name="enDescription"
            rules={[rules.required]}
            label={L('ShopEnDescription')}
            initialValue={shopData ? shopData.enDescription : undefined}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>
    </>,
    <>
      <Form.Item
        name="cityId"
        label={L('City')}
        initialValue={shopData ? shopData.city.value : undefined}
        rules={[rules.required]}
      >
        <Select placeholder={L('PleaseSelectTheCity')}>
          {cities &&
            cities?.length > 0 &&
            cities.map((city: LiteEntityDto) => (
              <Select.Option key={city.value} value={city.value}>
                {city.text}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="placeDescription"
        initialValue={{
          lat: shopData ? shopData.latitude : undefined,
          lng: shopData ? shopData.longitude : undefined,
        }}
        label={L('Location')}
        rules={[rules.required]}
      >
        <small className="map-hint-text">{L('pleaseSelectThePositionFromMap')}</small>
        <GoogleMapComp
          withClick={false}
          centerLatLng={{ lat, lng }}
          position={lat && lng ? { lat, lng } : undefined}
          handlePointClick={(val: google.maps.LatLngLiteral) => {
            form.setFieldsValue({ placeDescription: val });
            setLat(val.lat);
            setLng(val.lng);
          }}
        />
      </Form.Item>
    </>,
    <>
      <Form.Item
        name="banks"
        label={L('Banks')}
        initialValue={shopData ? shopData.banks.map((item) => item.bankId + '') : undefined}
        rules={[rules.required]}
      >
        <Select placeholder={L('PleaseSelectTheBanks')} mode="multiple">
          {banks &&
            banks?.length > 0 &&
            banks.map((bank: LiteEntityDto) => (
              <Select.Option key={bank.value} value={bank.value}>
                {bank.text}
              </Select.Option>
            ))}
        </Select>
      </Form.Item>
      {/* bundle */}
      <div className="bundles-wrapper">
        <div className="bundle">
          <div className="bundle-header">
            <h3>{L('BulndleTitle')}</h3>
            <p>{L('BundleDesc')}</p>
            <h2>
              {L('BundleT1')}
              <span>{L('BundleT2')}</span>
            </h2>
          </div>
          <div className="bundle-content">
            <ul>
              <li>
                <i
                  className="fas fa-check"
                  style={{ margin: localization.isRTL() ? '0 0 0 4px' : '0 4px 0 0' }}
                ></i>
                {L('BundleO1')}
              </li>
              <li>
                <i
                  className="fas fa-check"
                  style={{ margin: localization.isRTL() ? '0 0 0 4px' : '0 4px 0 0' }}
                ></i>
                {L('BundleO2')}
              </li>
              <li>
                <i
                  className="fas fa-check"
                  style={{ margin: localization.isRTL() ? '0 0 0 2px' : '0 2px 0 0' }}
                ></i>
                {L('BundleO3')}
              </li>
              <li>
                <i
                  className="fas fa-check"
                  style={{ margin: localization.isRTL() ? '0 0 0 2px' : '0 2px 0 0' }}
                ></i>
                {L('BundleO4')}
              </li>
            </ul>
          </div>
          <div className="bundle-footer">
            <Radio.Group
              options={[{ label: L('SelectBundle'), value: 1 }]}
              onChange={({ target: { value } }: RadioChangeEvent) => {
                setBundleId(value);
              }}
              defaultValue={shopData ? 1 : undefined}
              optionType="button"
            />
          </div>
        </div>
      </div>
    </>,
  ];

  return (
    <>
      <Modal
        width="95%"
        visible={visible}
        title={modalType === 'create' ? L('CreateShop') : L('EditShop')}
        onCancel={handleCancelModal}
        centered
        maskClosable={false}
        destroyOnClose
        className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
        footer={[
          <Button key="back" onClick={handleCancelModal}>
            {L('Cancel')}
          </Button>,
          <Button
            key="ddd"
            style={{
              margin: !localization.isRTL() ? '0 0 0 8px' : '0 8px 0 0',
              display: current === 0 ? 'none' : 'inline-block',
            }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
              document.querySelector('.scrollable-modal')!.scrollTop = 0;
            }}
          >
            {!localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
            <span>{L('Back')}</span>
          </Button>,
          <Button
            type="primary"
            key="dd"
            loading={isSubmittingShop}
            onClick={() => {
              current !== 4 ? gotoStep(current + 1) : submit();
              document.querySelector('.scrollable-modal')!.scrollTop = 0;
            }}
          >
            <span>
              {current === 4 && modalType == 'create'
                ? L('Create')
                : current === 4 && modalType !== 'create'
                ? L('Save')
                : L('SaveAndContinue')}
            </span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>,
        ]}
      >
        <div className="scrollable-modal">
          {isGettingData ? (
            <div className="loading-comp">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="custom-steps" style={{ display: current === 5 ? 'none' : 'grid' }}>
                <div className="steps-indicators">
                  {' '}
                  <Steps {...stepsProps} direction="vertical" className="steps-wrapper">
                    <Step
                      title={L('RegisterShopStep0Title')}
                      description={L('RegisterShopStep0Description')}
                    />
                    <Step
                      title={L('RegisterShopStep1Title')}
                      description={L('RegisterShopStep1Description')}
                    />
                    <Step
                      title={L('RegisterShopStep2Title')}
                      description={L('RegisterShopStep2Description')}
                    />
                    <Step
                      title={L('RegisterShopStep3Title')}
                      description={L('RegisterShopStep3Description')}
                    />
                    <Step
                      title={L('RegisterShopStep4Title')}
                      description={L('RegisterShopStep4Description')}
                    />
                  </Steps>
                </div>

                <div className={!localization.isRTL() ? 'steps-form rtl' : 'steps-form'}>
                  <Form {...layout} {...formProps}>
                    {formList[current]}
                  </Form>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default CreateOrUpdateShop;
