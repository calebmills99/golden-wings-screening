INSERT INTO style_profiles (style_token, label, settings, is_active)
VALUES
  (
    'soaring-classic',
    'Soaring Classic',
    '{"panel-backdrop": "rgba(15, 23, 42, 0.45)", "panel-border": "rgba(255, 255, 255, 0.08)"}',
    true
  )
ON CONFLICT (style_token) DO NOTHING;

UPDATE style_profiles
SET is_active = true
WHERE style_token = 'soaring-classic';
