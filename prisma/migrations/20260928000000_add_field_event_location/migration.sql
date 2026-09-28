-- Keep location columns nullable for existing historical entries. Application
-- validation requires every newly created field event to carry these values.
ALTER TABLE "FieldEvent" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "FieldEvent" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
ALTER TABLE "FieldEvent" ADD COLUMN IF NOT EXISTS "locationAccuracyMeters" DOUBLE PRECISION;
ALTER TABLE "FieldEvent" ADD COLUMN IF NOT EXISTS "locationCapturedAt" TIMESTAMP(3);
