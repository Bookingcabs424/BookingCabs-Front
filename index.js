import sequelize from "./config/clientDbManager.js";
import axios from "axios";
import XLSX from "xlsx";

const GEOCODE_API_KEY = process.env.GKEY;
const GEOCODE_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${GEOCODE_API_KEY}&address=`;

// ---- Fetch latitude & longitude ----
export const getLatLon = async (address) => {
  try {
    const response = await axios.get(`${GEOCODE_URL}${encodeURIComponent(address)}`);
    const result = response.data.results[0];
    if (result && result.geometry?.location) {
      return {
        lat: result.geometry.location.lat,
        lon: result.geometry.location.lng
      };
    }
    console.warn(`No geocode result for address: ${address}`);
    return { lat: null, lon: null };
  } catch (err) {
    console.error('Error fetching geocode:', address, err.message);
    return { lat: null, lon: null };
  }
};

// ---- Convert location name to IDs ----
const getLocationIds = async (locationName) => {
  if (!locationName || typeof locationName !== 'string') {
    console.warn(`[SKIP] Invalid or missing location name:`, locationName);
    return null;
  }

  // Trim leading/trailing spaces
  const cleanLocationName = locationName.trim();

  try {
    // Step 1: Try to match by city name
    const cityResult = await sequelize.query(`
      SELECT id AS city_id, state_id, country_id
      FROM master_city
      WHERE LOWER(name) = LOWER(:locationName)
      LIMIT 1
    `, {
      replacements: { locationName: cleanLocationName },
      type: sequelize.QueryTypes.SELECT
    });

    if (cityResult.length > 0) {
      const result = cityResult[0];
      if (result.city_id && result.state_id && result.country_id) {
        return result; // All 3 IDs present
      } else {
        console.warn(`[SKIP] Incomplete data for city "${cleanLocationName}":`, result);
        return null;
      }
    }

    // Step 2: Try to match by state name
    const stateResult = await sequelize.query(`
      SELECT id AS city_id, state_id, country_id
      FROM master_city
      WHERE LOWER(state_name) = LOWER(:locationName)
      LIMIT 1
    `, {
      replacements: { locationName: cleanLocationName },
      type: sequelize.QueryTypes.SELECT
    });

    if (stateResult.length > 0) {
      const result = stateResult[0];
      if (result.city_id && result.state_id && result.country_id) {
        return result;
      } else {
        console.warn(`[SKIP] Incomplete data for state "${cleanLocationName}":`, result);
        return null;
      }
    }

    // Step 3: Not found
    console.warn(`[SKIP] Location not found: "${cleanLocationName}" (checked city & state)`);
    return null;

  } catch (err) {
    console.error(`[ERROR] DB error while fetching location IDs for "${cleanLocationName}":`, err.message);
    return null;
  }
};

// ---- Main processing function ----
export const processExcelFile = async (filePath, outputFilePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  const updatedData = [];

  for (let row of data) {
    const address = row['airport_railway_bus_cruise terminal name'];
    const locationName = row['city_id'];

    const locationInfo = await getLocationIds(locationName);

    if (locationInfo) {
      row['city_id'] = locationInfo.city_id;
      row['state_id'] = locationInfo.state_id;
      row['country_id'] = locationInfo.country_id;
    } else {
      row['city_id'] = row['state_id'] = row['country_id'] = null;
    }

    const { lat, lon } = await getLatLon(address);
    row['latitude'] = lat;
    row['longitude'] = lon;

    updatedData.push({ ...row, entry_type: 'ARRIVAL' });
    updatedData.push({ ...row, entry_type: 'DEPARTURE' });
  }

  // const updatedSheet = XLSX.utils.json_to_sheet(updatedData);
  // const newWorkbook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(newWorkbook, updatedSheet, sheetName);
  // XLSX.writeFile(newWorkbook, outputFilePath);

  return updatedData
};
