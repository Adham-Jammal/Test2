/* eslint-disable */
import * as React from 'react';
import {
  Button,
  Form,
  Input,
  Steps,
  Result,
  Select,
  Row,
  Col,
  Radio,
  RadioChangeEvent,
} from 'antd';
import { useStepsForm } from 'sunflower-antd';
import * as rules from './validations';
import './index.less';
import { LiteEntityDto } from './../../services/dto/liteEntityDto';
import localization from '../../lib/localization';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { L } from '../../i18next';
import GoogleMapComp from '../../components/GoogleMap';
import EditableImage from '../../components/EditableImage';
import indexesService from '../../services/indexes/indexesService';
import categoriesService from '../../services/categories/categoriesService';
import locationsService from '../../services/locations/locationsService';
import { arabicNameRules, englishNameRules } from '../../constants';

import {
  CompletShopRegistrationDto,
  ExpectedMonthlySales,
  ReasonCreatingShop,
} from '../../services/shops/dto/shopDto';
import shopManagersService from '../../services/shopManagers/shopManagersService';
import { IndexType, LocationType, ShopType } from '../../lib/types';

const { Step } = Steps;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};
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

export default () => {
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

  const {
    form,
    current = 0,
    gotoStep,
    stepsProps,
    formProps,
    submit,
    formLoading,
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
      const newValues: CompletShopRegistrationDto = {
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
      };

      await shopManagersService.CompletShopRegistration(newValues);
      return 'ok';
    },
    total: 5,
  });

  const formList = [
    <>
      <Form.Item className="step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
      <Row>
        <Col md={{ span: 11, offset: 0 }} xs={24}>
          <Form.Item
            name="arName"
            rules={[...arabicNameRules, ...rules.ShopName]}
            label={L('ShopArName')}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            name="enName"
            rules={[...englishNameRules, ...rules.ShopName]}
            label={L('ShopEnName')}
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item name="type" label={L('ShopType')} rules={[rules.required]}>
        <Radio.Group
          options={shopTypeOptions}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setShopType(value);
          }}
          optionType="button"
        />
      </Form.Item>
      <Form.Item name="CreationPurpose" label={L('CreationPurpose')}>
        <Radio.Group
          options={creationPurposeOptions}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setCreationPurpose(value);
          }}
          optionType="button"
        />
      </Form.Item>
      <Form.Item name="SalesExpectationInMonth" label={L('SalesExpectationInMonth')}>
        <Radio.Group
          options={salesExpectationInMonthOptions}
          onChange={({ target: { value } }: RadioChangeEvent) => {
            setSalesExpectationInMonth(value);
          }}
          optionType="button"
        />
      </Form.Item>

      <Form.Item className="mobile-step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
    </>,

    <>
      <Form.Item className="step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
      <Form.Item name="categories" label={L('Categories')} rules={[rules.required]}>
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
          <Form.Item name="arLogoUrl" label={L('ShopArLogo')}>
            <EditableImage
              defaultFileList={
                arLogo !== undefined
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
          <Form.Item name="enLogoUrl" label={L('ShopEnLogo')}>
            <EditableImage
              defaultFileList={
                enLogo !== undefined
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
          <Form.Item name="arCoverUrl" label={L('ShopArCover')}>
            <EditableImage
              defaultFileList={
                arCover !== undefined
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
          <Form.Item name="enCoverUrl" label={L('ShopEnCover')}>
            <EditableImage
              defaultFileList={
                enCover !== undefined
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
            rules={rules.ShopDescription}
            label={L('ShopArDescription')}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
        <Col md={{ span: 11, offset: 2 }} xs={24}>
          <Form.Item
            name="enDescription"
            rules={rules.ShopDescription}
            label={L('ShopEnDescription')}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item className="mobile-step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
    </>,
    <>
      <Form.Item className="step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
      <Form.Item name="cityId" label={L('City')} rules={[rules.required]}>
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
      <Form.Item name="placeDescription" label={L('Location')} rules={[rules.required]}>
        <small className="map-hint-text">{L('pleaseSelectThePositionFromMap')}</small>
        <GoogleMapComp
          withClick={false}
          position={{ lat: 24.633333, lng: 46.716667 }}
          handlePointClick={(val: google.maps.LatLngLiteral) =>
            form.setFieldsValue({ placeDescription: val })
          }
        />
      </Form.Item>

      <Form.Item className="mobile-step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button type="primary" onClick={() => gotoStep(current + 1)}>
            <span>{L('Next')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
    </>,
    <>
      <Form.Item className="step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            type="default"
            onClick={() => {
              gotoStep(current - 1);
            }}
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
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
          </Button>
          <Button
            type="primary"
            loading={formLoading}
            onClick={() => {
              submit().then((result) => {
                if (result === 'ok') {
                  gotoStep(current + 1);
                }
              });
            }}
          >
            <span>{L('Save')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
      <Form.Item name="banks" label={L('Banks')} rules={[rules.required]}>
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
              optionType="button"
            />
          </div>
        </div>
      </div>
      <Form.Item className="mobile-step-actions" {...tailLayout}>
        <div style={{ float: !localization.isRTL() ? 'right' : 'left' }}>
          <Button
            style={{ margin: !localization.isRTL() ? '0 10px 0 0' : '0 0 0 10px' }}
            type="default"
            onClick={() => {
              gotoStep(current - 1);
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
          </Button>
          <Button
            type="primary"
            loading={formLoading}
            onClick={() => {
              submit().then((result) => {
                if (result === 'ok') {
                  gotoStep(current + 1);
                }
              });
            }}
          >
            <span>{L('Save')}</span>
            {localization.isRTL() ? (
              <LeftOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
              />
            ) : (
              <RightOutlined
                style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
              />
            )}
          </Button>
        </div>
      </Form.Item>
    </>,
  ];
  return (
    <>
      <div className="custom-steps" style={{ display: current === 4 ? 'none' : 'grid' }}>
        <div className="steps-indicators">
          {' '}
          <Steps {...stepsProps} direction="vertical" className="steps-wrapper">
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
      {current === 4 && (
        <Result
          status="success"
          className="steps-result"
          title={L('ShopCreatedSuccessfully')}
          extra={
            <>
              <Button
                type="primary"
                onClick={() => setTimeout(() => (window.location.href = '/shop-dashboard'), 500)}
              >
                <span>{L('GoToDashboard')}</span>
                {localization.isRTL() ? (
                  <LeftOutlined
                    style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '2px' }}
                  />
                ) : (
                  <RightOutlined
                    style={{ color: '#fff', fontWeight: 'bold', position: 'relative', top: '.5px' }}
                  />
                )}
              </Button>
            </>
          }
        />
      )}
    </>
  );
};
