CREATE TRIGGER trg_update_vehicle_km_insert
AFTER INSERT ON "Maintenance"
FOR EACH ROW
WHEN NEW.km_maintenance IS NOT NULL
BEGIN
  UPDATE "Vehicles"
  SET current_km = MAX(COALESCE(current_km, 0), NEW.km_maintenance)
  WHERE id = NEW."vehicleId";
END;

CREATE TRIGGER trg_update_vehicle_km_update
AFTER UPDATE OF km_maintenance ON "Maintenance"
FOR EACH ROW
WHEN NEW.km_maintenance IS NOT NULL
BEGIN
  UPDATE "Vehicles"
  SET current_km = MAX(COALESCE(current_km, 0), NEW.km_maintenance)
  WHERE id = NEW."vehicleId";
END;