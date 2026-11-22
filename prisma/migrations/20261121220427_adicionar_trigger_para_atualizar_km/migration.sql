CREATE OR REPLACE FUNCTION update_vehicle_km()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.km_maintenance IS NOT NULL THEN
    UPDATE "Vehicles"
    SET current_km = GREATEST(COALESCE(current_km, 0), NEW.km_maintenance)
    WHERE id = NEW."vehicleId";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_vehicle_km_insert
AFTER INSERT ON "Maintenance"
FOR EACH ROW
EXECUTE FUNCTION update_vehicle_km();

CREATE TRIGGER trg_update_vehicle_km_update
AFTER UPDATE OF km_maintenance ON "Maintenance"
FOR EACH ROW
EXECUTE FUNCTION update_vehicle_km();
