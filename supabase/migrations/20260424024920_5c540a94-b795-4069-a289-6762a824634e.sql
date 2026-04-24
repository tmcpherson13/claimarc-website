DROP POLICY IF EXISTS "Content assets are publicly readable" ON storage.objects;
CREATE POLICY "Content assets are publicly downloadable"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'content-assets'
    AND name IS NOT NULL
    AND name <> ''
  );