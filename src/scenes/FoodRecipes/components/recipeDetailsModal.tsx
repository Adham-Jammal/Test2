/* eslint-disable */

import * as React from 'react';
import { Tabs, Image, Spin, Modal, Tag, Table } from 'antd';
import { L } from '../../../i18next';
import './recipeDetailsModal.css';
import {
  ApartmentOutlined,
  CoffeeOutlined,
  InfoCircleOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import localization from '../../../lib/localization';
import { NutritionsDto } from '../../../services/foodRecipe/dto/nutritionsDto';
import { FoodRecipeDto } from '../../../services/foodRecipe/dto/recipeDto';
import timingHelper from '../../../lib/timingHelper';
import moment from 'moment';

const { TabPane } = Tabs;

interface RecipeDetailsModalProps {
  loading: boolean;
  visible: boolean;
  onCancel: () => void;
  foodRecipesModel: FoodRecipeDto | undefined;
}

const RecipeDetails: React.FC<RecipeDetailsModalProps> = ({
  loading,
  visible,
  onCancel,
  foodRecipesModel,
}) => {
  const ingredientsColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },

    {
      title: L('Amount'),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: L('UnitOfMeasurement'),
      dataIndex: 'unitOfMeasurement',
      key: 'unitOfMeasurement',
    },
  ];

  const stepsColumns = [
    {
      title: L('Number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: L('Image'),
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (image: string) => (
        <Image width={50} height={50} className="event-cover" src={image} />
      ),
    },
    {
      title: L('Description'),
      dataIndex: 'description',
      key: 'description',
    },
  ];

  const nutrationsColumns = [
    {
      title: L('Name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: L('Weight'),
      dataIndex: 'totalWeight',
      key: 'totalWeight',
    },
    {
      title: L('SubNutritions'),
      dataIndex: 'SubNutrations',
      key: 'SubNutrations',
      render: (_: any, item: NutritionsDto) => (
        <ol className="nutritions">
          {item.subNutritions.length > 0
            ? item.subNutritions.map((sub) => (
                <>
                  <li>
                    {L('Name')}: {sub.name}
                  </li>
                  <li>
                    {L('Weight')}: {sub.totalWeight}
                  </li>
                  <hr style={{ width: 120, margin: '10px 0' }} />
                </>
              ))
            : L('NotAvailable')}
        </ol>
      ),
    },
  ];
  return (
    <Modal
      width="80%"
      style={{ padding: '20px' }}
      visible={visible}
      title={L('Details')}
      onCancel={onCancel}
      centered
      destroyOnClose
      className={localization.isRTL() ? 'rtl-modal' : 'ltr-modal'}
      footer={false}
    >
      {loading ? (
        <div className="loading-comp">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          <Tabs defaultActiveKey="1">
            <TabPane
              tab={
                <span>
                  <InfoCircleOutlined />
                  {L('General')}
                </span>
              }
              key="1"
            >
              <div className="details-wrapper">
                <div className="detail-wrapper">
                  <span className="detail-label">{L('ArName')}:</span>
                  <span className="detail-value">{foodRecipesModel?.arName}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('EnName')}:</span>
                  <span className="detail-value">{foodRecipesModel?.enName}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('AboutTheFoodInArabic')}:</span>
                  <span
                    className="detail-value"
                    dangerouslySetInnerHTML={{ __html: foodRecipesModel?.arAbout || '' }}
                  ></span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('AboutTheFoodInEnglish')}:</span>
                  <span
                    className="detail-value"
                    dangerouslySetInnerHTML={{ __html: foodRecipesModel?.enAbout || '' }}
                  ></span>
                </div>

                <div className="detail-wrapper">
                  <span className="detail-label">{L('IsActive')}:</span>
                  <span className="detail-value">
                    {foodRecipesModel?.isActive ? (
                      <Tag color="green" className="ant-tag-disable-pointer">
                        {L('Active')}
                      </Tag>
                    ) : (
                      <Tag color="red" className="ant-tag-disable-pointer">
                        {L('Inactive')}
                      </Tag>
                    )}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('AmountOfCalories')}:</span>
                  <span className="detail-value">{foodRecipesModel?.amountOfCalories}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('StandardServingAmount')}:</span>
                  <span className="detail-value">{foodRecipesModel?.standardServingAmount}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('CreatedBy')}:</span>
                  <span className="detail-value">{foodRecipesModel?.createdBy}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('CreationDate')}:</span>
                  <span className="detail-value">
                    {moment(foodRecipesModel?.creationTime).format(timingHelper.defaultDateFormat)}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Image')}:</span>
                  <span className="detail-value">
                    <Image
                      width={50}
                      height={50}
                      className="event-cover"
                      src={foodRecipesModel?.imageUrl}
                    />
                  </span>
                </div>
              </div>
            </TabPane>
            <TabPane
              tab={
                <span>
                  <ApartmentOutlined />
                  {L('Nutritions')}
                </span>
              }
              key="2"
            >
              <Table
                columns={nutrationsColumns}
                pagination={false}
                style={{ width: '100%', marginTop: 12 }}
                dataSource={foodRecipesModel?.nutritions || []}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <CoffeeOutlined />
                  {L('Ingredients')}
                </span>
              }
              key="3"
            >
              <Table
                columns={ingredientsColumns}
                pagination={false}
                style={{ width: '100%', marginTop: 12 }}
                dataSource={foodRecipesModel?.ingredients || []}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <OrderedListOutlined />
                  {L('Steps')}
                </span>
              }
              key="4"
            >
              <Table
                columns={stepsColumns}
                pagination={false}
                style={{ width: '100%', marginTop: 12 }}
                dataSource={foodRecipesModel?.steps || []}
              />
            </TabPane>
          </Tabs>
        </div>
      )}
    </Modal>
  );
};

export default RecipeDetails;
