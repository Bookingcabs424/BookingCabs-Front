import { fr } from "date-fns/locale";

const OnewayCityRoutePackage = sequelize.define(
  "oneway_city_route_package",
  {
    route_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    base_vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    city_distance_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    via_city: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 0=Inactive, 1=Active, 2=Deleted
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    modified_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    modified_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "oneway_city_route_package",
    freezeTableName: true,
    timestamps: false, // we are handling dates manually
  }
);
export default OnewayCityRoutePackage;
