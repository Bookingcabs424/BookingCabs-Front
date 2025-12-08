// models/associatejs
import MasterVehicleType from './masterVehicleTypeModel.js';
import BaseVehicleType from './baseVehicleTypeModel.js';
import OnewayCityRoutePackage from './oneWayCityRoutePackage.js';
import CityDistanceList from './cityDistanceModel.js';
import MasterCity from './masterCityModel.js';
import DispatchLocation from './dispatchLocationModel.js';
import CompanySetup from './companySetupModel.js';
import MasterPackage from './masterPackageModel.js';
import MasterPackageMode from './masterPackageModeModel.js';
import User from './userModel.js';
import MasterCurrency from './masterCurrencyModel.js';
import BaseCombination from './baseCombinationModel.js';
import UserCancellationFare from './userCancellationFareModel.js';
import MasterCancellation from './masterCancellationModel.js';
try {
    
    BaseCombination.hasMany(BaseVehicleType, {
        foreignKey: 'base_comb_id',
        as: 'baseVehicleTypes'
      });
      
    //   BaseCombination.hasOne(DispatchLocation, {
    //     foreignKey: 'base_comb_id',
    //     as: 'dispatchLocation'
    //   });
      BaseVehicleType.hasOne(OnewayCityRoutePackage, {
        foreignKey: 'base_vehicle_id',
        as: 'onewayRoutePackage'
      });
      
      BaseVehicleType.belongsTo(MasterVehicleType, {
        foreignKey: 'vehicle_type_id',
        as: 'vehicleType'
      });
          DispatchLocation.belongsTo(BaseCombination, {
        foreignKey: 'base_comb_id',
        as: 'baseCombination'
      });
      
      BaseCombination.hasOne(DispatchLocation, {
        foreignKey: 'base_comb_id',
        as: 'dispatchLocation'
      });
      
// Define associations
    OnewayCityRoutePackage.belongsTo(CityDistanceList, {
      foreignKey: 'city_distance_id',
      as: 'cityDistance'
    });
    
    OnewayCityRoutePackage.belongsTo(BaseVehicleType, {
      foreignKey: 'base_vehicle_id',
      as: 'vehicle'
    });
    CityDistanceList.hasMany(OnewayCityRoutePackage, {
        foreignKey: 'city_distance_id',
        as: 'onewayRoutePackages'
      });
      
      CityDistanceList.belongsTo(MasterCity, {
        foreignKey: 'destination_city',
        targetKey: 'id',
        as: 'destinationCity'
      });
          BaseCombination.belongsTo(CompanySetup, { as: 'company', foreignKey: 'company_id' });
    BaseCombination.belongsTo(MasterCity, { as: 'city', foreignKey: 'city_id' });
    BaseCombination.belongsTo(MasterPackage, { as: 'masterPackage', foreignKey: 'master_package_id' });
    BaseCombination.belongsTo(MasterPackageMode, { as: 'masterPackageMode', foreignKey: 'master_package_mode_id' });
    BaseCombination.belongsTo(User, { as: 'vendor', foreignKey: 'vendor_id' });
    BaseCombination.belongsTo(User, { as: 'client', foreignKey: 'client_id' });
    BaseCombination.belongsTo(MasterCurrency, { as: 'currencyDetails', foreignKey: 'currency' });
    
    // BaseVehicleType.belongsTo(BaseCombination, { foreignKey: 'base_comb_id' });
// MasterCancellation ⬅️ UserCancellationFare (foreignKey: cancellation_master_id)
UserCancellationFare.belongsTo(MasterCancellation, {
  foreignKey: 'cancellation_master_id',
  as: 'cancellation',
});

// MasterCurrency ⬅️ UserCancellationFare (foreignKey: currency_id)
UserCancellationFare.belongsTo(MasterCurrency, {
  foreignKey: 'currency_id',
  as: 'currency',
});
  
} catch (error) {
    console.error(error)
}