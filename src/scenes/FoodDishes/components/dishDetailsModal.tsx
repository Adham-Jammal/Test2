/* eslint-disable */

import * as React from 'react';
import { Tabs, Image, Spin, Modal, Tag, Table } from 'antd';
import { L } from '../../../i18next';
import './dishDetailsModal.css';
import { ApartmentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import localization from '../../../lib/localization';
import { FoodDishDto } from '../../../services/foodDishes/dto/DishDto';
import ParagWithSeeMore from '../../../components/ParagWithSeeMore';
import { NutritionsDto } from '../../../services/foodRecipe/dto/nutritionsDto';

const { TabPane } = Tabs;

// eslint-disable-next-line no-shadow

interface DishDetailsModalProps {
  loading: boolean;
  visible: boolean;
  onCancel: () => void;
  foodDishesModel: FoodDishDto | undefined;
}

const DishDetails: React.FC<DishDetailsModalProps> = ({
  loading,
  visible,
  onCancel,
  foodDishesModel,
}) => {
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
                  <span className="detail-value">{foodDishesModel?.arName}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('EnName')}:</span>
                  <span className="detail-value">{foodDishesModel?.enName}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('ArAbout')}:</span>
                  <span className="detail-value">
                    {foodDishesModel?.arAbout && (
                      <ParagWithSeeMore textLength={50} text={foodDishesModel.arAbout} />
                    )}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('EnAbout')}:</span>
                  <span className="detail-value">
                    {foodDishesModel?.enAbout && (
                      <ParagWithSeeMore textLength={50} text={foodDishesModel.enAbout} />
                    )}
                  </span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Category')}:</span>
                  <span className="detail-value">{foodDishesModel?.foodCategoryName}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('IsActive')}:</span>
                  <span className="detail-value">
                    {foodDishesModel?.isActive ? (
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
                  <span className="detail-value">{foodDishesModel?.amountOfCalories}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('StandardServingAmount')}:</span>
                  <span className="detail-value">{foodDishesModel?.standardServingAmount}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('CreatedBy')}:</span>
                  <span className="detail-value">{foodDishesModel?.createdBy}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('CreationTime')}:</span>
                  <span className="detail-value">{foodDishesModel?.creationTime}</span>
                </div>
                <div className="detail-wrapper">
                  <span className="detail-label">{L('Image')}:</span>
                  <span className="detail-value">
                    <Image
                      width={50}
                      height={50}
                      className="event-cover"
                      src={foodDishesModel?.imageUrl}
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
                dataSource={foodDishesModel?.nutritions || []}
              />
            </TabPane>
          </Tabs>
        </div>
      )}
    </Modal>
  );
};

export default DishDetails;
