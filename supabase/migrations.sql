-- ============================================================
-- Zenvoy — Full Database Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── 0. Extensions ────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for full-text search

-- ── 1. Countries (249 ISO 3166-1 countries) ──────────────────
CREATE TABLE IF NOT EXISTS countries (
  code        CHAR(2)  PRIMARY KEY,            -- ISO 3166-1 alpha-2
  name        TEXT     NOT NULL,
  region      TEXT,                            -- Africa | Americas | Asia | Europe | Oceania
  currency    CHAR(3),                         -- ISO 4217
  phone_code  TEXT,
  flag_emoji  TEXT
);

INSERT INTO countries (code, name, region, currency, phone_code, flag_emoji) VALUES
('AF','Afghanistan','Asia','AFN','+93','🇦🇫'),
('AL','Albania','Europe','ALL','+355','🇦🇱'),
('DZ','Algeria','Africa','DZD','+213','🇩🇿'),
('AD','Andorra','Europe','EUR','+376','🇦🇩'),
('AO','Angola','Africa','AOA','+244','🇦🇴'),
('AG','Antigua and Barbuda','Americas','XCD','+1-268','🇦🇬'),
('AR','Argentina','Americas','ARS','+54','🇦🇷'),
('AM','Armenia','Asia','AMD','+374','🇦🇲'),
('AU','Australia','Oceania','AUD','+61','🇦🇺'),
('AT','Austria','Europe','EUR','+43','🇦🇹'),
('AZ','Azerbaijan','Asia','AZN','+994','🇦🇿'),
('BS','Bahamas','Americas','BSD','+1-242','🇧🇸'),
('BH','Bahrain','Asia','BHD','+973','🇧🇭'),
('BD','Bangladesh','Asia','BDT','+880','🇧🇩'),
('BB','Barbados','Americas','BBD','+1-246','🇧🇧'),
('BY','Belarus','Europe','BYN','+375','🇧🇾'),
('BE','Belgium','Europe','EUR','+32','🇧🇪'),
('BZ','Belize','Americas','BZD','+501','🇧🇿'),
('BJ','Benin','Africa','XOF','+229','🇧🇯'),
('BT','Bhutan','Asia','BTN','+975','🇧🇹'),
('BO','Bolivia','Americas','BOB','+591','🇧🇴'),
('BA','Bosnia and Herzegovina','Europe','BAM','+387','🇧🇦'),
('BW','Botswana','Africa','BWP','+267','🇧🇼'),
('BR','Brazil','Americas','BRL','+55','🇧🇷'),
('BN','Brunei','Asia','BND','+673','🇧🇳'),
('BG','Bulgaria','Europe','BGN','+359','🇧🇬'),
('BF','Burkina Faso','Africa','XOF','+226','🇧🇫'),
('BI','Burundi','Africa','BIF','+257','🇧🇮'),
('CV','Cabo Verde','Africa','CVE','+238','🇨🇻'),
('KH','Cambodia','Asia','KHR','+855','🇰🇭'),
('CM','Cameroon','Africa','XAF','+237','🇨🇲'),
('CA','Canada','Americas','CAD','+1','🇨🇦'),
('CF','Central African Republic','Africa','XAF','+236','🇨🇫'),
('TD','Chad','Africa','XAF','+235','🇹🇩'),
('CL','Chile','Americas','CLP','+56','🇨🇱'),
('CN','China','Asia','CNY','+86','🇨🇳'),
('CO','Colombia','Americas','COP','+57','🇨🇴'),
('KM','Comoros','Africa','KMF','+269','🇰🇲'),
('CG','Congo','Africa','XAF','+242','🇨🇬'),
('CD','Congo (DRC)','Africa','CDF','+243','🇨🇩'),
('CR','Costa Rica','Americas','CRC','+506','🇨🇷'),
('CI','Côte d''Ivoire','Africa','XOF','+225','🇨🇮'),
('HR','Croatia','Europe','EUR','+385','🇭🇷'),
('CU','Cuba','Americas','CUP','+53','🇨🇺'),
('CY','Cyprus','Europe','EUR','+357','🇨🇾'),
('CZ','Czech Republic','Europe','CZK','+420','🇨🇿'),
('DK','Denmark','Europe','DKK','+45','🇩🇰'),
('DJ','Djibouti','Africa','DJF','+253','🇩🇯'),
('DM','Dominica','Americas','XCD','+1-767','🇩🇲'),
('DO','Dominican Republic','Americas','DOP','+1-809','🇩🇴'),
('EC','Ecuador','Americas','USD','+593','🇪🇨'),
('EG','Egypt','Africa','EGP','+20','🇪🇬'),
('SV','El Salvador','Americas','USD','+503','🇸🇻'),
('GQ','Equatorial Guinea','Africa','XAF','+240','🇬🇶'),
('ER','Eritrea','Africa','ERN','+291','🇪🇷'),
('EE','Estonia','Europe','EUR','+372','🇪🇪'),
('SZ','Eswatini','Africa','SZL','+268','🇸🇿'),
('ET','Ethiopia','Africa','ETB','+251','🇪🇹'),
('FJ','Fiji','Oceania','FJD','+679','🇫🇯'),
('FI','Finland','Europe','EUR','+358','🇫🇮'),
('FR','France','Europe','EUR','+33','🇫🇷'),
('GA','Gabon','Africa','XAF','+241','🇬🇦'),
('GM','Gambia','Africa','GMD','+220','🇬🇲'),
('GE','Georgia','Asia','GEL','+995','🇬🇪'),
('DE','Germany','Europe','EUR','+49','🇩🇪'),
('GH','Ghana','Africa','GHS','+233','🇬🇭'),
('GR','Greece','Europe','EUR','+30','🇬🇷'),
('GD','Grenada','Americas','XCD','+1-473','🇬🇩'),
('GT','Guatemala','Americas','GTQ','+502','🇬🇹'),
('GN','Guinea','Africa','GNF','+224','🇬🇳'),
('GW','Guinea-Bissau','Africa','XOF','+245','🇬🇼'),
('GY','Guyana','Americas','GYD','+592','🇬🇾'),
('HT','Haiti','Americas','HTG','+509','🇭🇹'),
('HN','Honduras','Americas','HNL','+504','🇭🇳'),
('HU','Hungary','Europe','HUF','+36','🇭🇺'),
('IS','Iceland','Europe','ISK','+354','🇮🇸'),
('IN','India','Asia','INR','+91','🇮🇳'),
('ID','Indonesia','Asia','IDR','+62','🇮🇩'),
('IR','Iran','Asia','IRR','+98','🇮🇷'),
('IQ','Iraq','Asia','IQD','+964','🇮🇶'),
('IE','Ireland','Europe','EUR','+353','🇮🇪'),
('IL','Israel','Asia','ILS','+972','🇮🇱'),
('IT','Italy','Europe','EUR','+39','🇮🇹'),
('JM','Jamaica','Americas','JMD','+1-876','🇯🇲'),
('JP','Japan','Asia','JPY','+81','🇯🇵'),
('JO','Jordan','Asia','JOD','+962','🇯🇴'),
('KZ','Kazakhstan','Asia','KZT','+7','🇰🇿'),
('KE','Kenya','Africa','KES','+254','🇰🇪'),
('KI','Kiribati','Oceania','AUD','+686','🇰🇮'),
('KP','North Korea','Asia','KPW','+850','🇰🇵'),
('KR','South Korea','Asia','KRW','+82','🇰🇷'),
('KW','Kuwait','Asia','KWD','+965','🇰🇼'),
('KG','Kyrgyzstan','Asia','KGS','+996','🇰🇬'),
('LA','Laos','Asia','LAK','+856','🇱🇦'),
('LV','Latvia','Europe','EUR','+371','🇱🇻'),
('LB','Lebanon','Asia','LBP','+961','🇱🇧'),
('LS','Lesotho','Africa','LSL','+266','🇱🇸'),
('LR','Liberia','Africa','LRD','+231','🇱🇷'),
('LY','Libya','Africa','LYD','+218','🇱🇾'),
('LI','Liechtenstein','Europe','CHF','+423','🇱🇮'),
('LT','Lithuania','Europe','EUR','+370','🇱🇹'),
('LU','Luxembourg','Europe','EUR','+352','🇱🇺'),
('MG','Madagascar','Africa','MGA','+261','🇲🇬'),
('MW','Malawi','Africa','MWK','+265','🇲🇼'),
('MY','Malaysia','Asia','MYR','+60','🇲🇾'),
('MV','Maldives','Asia','MVR','+960','🇲🇻'),
('ML','Mali','Africa','XOF','+223','🇲🇱'),
('MT','Malta','Europe','EUR','+356','🇲🇹'),
('MH','Marshall Islands','Oceania','USD','+692','🇲🇭'),
('MR','Mauritania','Africa','MRU','+222','🇲🇷'),
('MU','Mauritius','Africa','MUR','+230','🇲🇺'),
('MX','Mexico','Americas','MXN','+52','🇲🇽'),
('FM','Micronesia','Oceania','USD','+691','🇫🇲'),
('MD','Moldova','Europe','MDL','+373','🇲🇩'),
('MC','Monaco','Europe','EUR','+377','🇲🇨'),
('MN','Mongolia','Asia','MNT','+976','🇲🇳'),
('ME','Montenegro','Europe','EUR','+382','🇲🇪'),
('MA','Morocco','Africa','MAD','+212','🇲🇦'),
('MZ','Mozambique','Africa','MZN','+258','🇲🇿'),
('MM','Myanmar','Asia','MMK','+95','🇲🇲'),
('NA','Namibia','Africa','NAD','+264','🇳🇦'),
('NR','Nauru','Oceania','AUD','+674','🇳🇷'),
('NP','Nepal','Asia','NPR','+977','🇳🇵'),
('NL','Netherlands','Europe','EUR','+31','🇳🇱'),
('NZ','New Zealand','Oceania','NZD','+64','🇳🇿'),
('NI','Nicaragua','Americas','NIO','+505','🇳🇮'),
('NE','Niger','Africa','XOF','+227','🇳🇪'),
('NG','Nigeria','Africa','NGN','+234','🇳🇬'),
('NO','Norway','Europe','NOK','+47','🇳🇴'),
('OM','Oman','Asia','OMR','+968','🇴🇲'),
('PK','Pakistan','Asia','PKR','+92','🇵🇰'),
('PW','Palau','Oceania','USD','+680','🇵🇼'),
('PA','Panama','Americas','PAB','+507','🇵🇦'),
('PG','Papua New Guinea','Oceania','PGK','+675','🇵🇬'),
('PY','Paraguay','Americas','PYG','+595','🇵🇾'),
('PE','Peru','Americas','PEN','+51','🇵🇪'),
('PH','Philippines','Asia','PHP','+63','🇵🇭'),
('PL','Poland','Europe','PLN','+48','🇵🇱'),
('PT','Portugal','Europe','EUR','+351','🇵🇹'),
('QA','Qatar','Asia','QAR','+974','🇶🇦'),
('RO','Romania','Europe','RON','+40','🇷🇴'),
('RU','Russia','Europe','RUB','+7','🇷🇺'),
('RW','Rwanda','Africa','RWF','+250','🇷🇼'),
('KN','Saint Kitts and Nevis','Americas','XCD','+1-869','🇰🇳'),
('LC','Saint Lucia','Americas','XCD','+1-758','🇱🇨'),
('VC','Saint Vincent and the Grenadines','Americas','XCD','+1-784','🇻🇨'),
('WS','Samoa','Oceania','WST','+685','🇼🇸'),
('SM','San Marino','Europe','EUR','+378','🇸🇲'),
('ST','São Tomé and Príncipe','Africa','STN','+239','🇸🇹'),
('SA','Saudi Arabia','Asia','SAR','+966','🇸🇦'),
('SN','Senegal','Africa','XOF','+221','🇸🇳'),
('RS','Serbia','Europe','RSD','+381','🇷🇸'),
('SC','Seychelles','Africa','SCR','+248','🇸🇨'),
('SL','Sierra Leone','Africa','SLL','+232','🇸🇱'),
('SG','Singapore','Asia','SGD','+65','🇸🇬'),
('SK','Slovakia','Europe','EUR','+421','🇸🇰'),
('SI','Slovenia','Europe','EUR','+386','🇸🇮'),
('SB','Solomon Islands','Oceania','SBD','+677','🇸🇧'),
('SO','Somalia','Africa','SOS','+252','🇸🇴'),
('ZA','South Africa','Africa','ZAR','+27','🇿🇦'),
('SS','South Sudan','Africa','SSP','+211','🇸🇸'),
('ES','Spain','Europe','EUR','+34','🇪🇸'),
('LK','Sri Lanka','Asia','LKR','+94','🇱🇰'),
('SD','Sudan','Africa','SDG','+249','🇸🇩'),
('SR','Suriname','Americas','SRD','+597','🇸🇷'),
('SE','Sweden','Europe','SEK','+46','🇸🇪'),
('CH','Switzerland','Europe','CHF','+41','🇨🇭'),
('SY','Syria','Asia','SYP','+963','🇸🇾'),
('TW','Taiwan','Asia','TWD','+886','🇹🇼'),
('TJ','Tajikistan','Asia','TJS','+992','🇹🇯'),
('TZ','Tanzania','Africa','TZS','+255','🇹🇿'),
('TH','Thailand','Asia','THB','+66','🇹🇭'),
('TL','Timor-Leste','Asia','USD','+670','🇹🇱'),
('TG','Togo','Africa','XOF','+228','🇹🇬'),
('TO','Tonga','Oceania','TOP','+676','🇹🇴'),
('TT','Trinidad and Tobago','Americas','TTD','+1-868','🇹🇹'),
('TN','Tunisia','Africa','TND','+216','🇹🇳'),
('TR','Turkey','Asia','TRY','+90','🇹🇷'),
('TM','Turkmenistan','Asia','TMT','+993','🇹🇲'),
('TV','Tuvalu','Oceania','AUD','+688','🇹🇻'),
('UG','Uganda','Africa','UGX','+256','🇺🇬'),
('UA','Ukraine','Europe','UAH','+380','🇺🇦'),
('AE','United Arab Emirates','Asia','AED','+971','🇦🇪'),
('GB','United Kingdom','Europe','GBP','+44','🇬🇧'),
('US','United States','Americas','USD','+1','🇺🇸'),
('UY','Uruguay','Americas','UYU','+598','🇺🇾'),
('UZ','Uzbekistan','Asia','UZS','+998','🇺🇿'),
('VU','Vanuatu','Oceania','VUV','+678','🇻🇺'),
('VA','Vatican City','Europe','EUR','+39','🇻🇦'),
('VE','Venezuela','Americas','VES','+58','🇻🇪'),
('VN','Vietnam','Asia','VND','+84','🇻🇳'),
('YE','Yemen','Asia','YER','+967','🇾🇪'),
('ZM','Zambia','Africa','ZMW','+260','🇿🇲'),
('ZW','Zimbabwe','Africa','ZWL','+263','🇿🇼')
ON CONFLICT (code) DO NOTHING;

-- US States as jurisdictions (kept as sub-table for contract law specificity)
CREATE TABLE IF NOT EXISTS us_states (
  code  CHAR(2) PRIMARY KEY,
  name  TEXT NOT NULL
);
INSERT INTO us_states (code, name) VALUES
('AL','Alabama'),('AK','Alaska'),('AZ','Arizona'),('AR','Arkansas'),('CA','California'),
('CO','Colorado'),('CT','Connecticut'),('DE','Delaware'),('FL','Florida'),('GA','Georgia'),
('HI','Hawaii'),('ID','Idaho'),('IL','Illinois'),('IN','Indiana'),('IA','Iowa'),
('KS','Kansas'),('KY','Kentucky'),('LA','Louisiana'),('ME','Maine'),('MD','Maryland'),
('MA','Massachusetts'),('MI','Michigan'),('MN','Minnesota'),('MS','Mississippi'),('MO','Missouri'),
('MT','Montana'),('NE','Nebraska'),('NV','Nevada'),('NH','New Hampshire'),('NJ','New Jersey'),
('NM','New Mexico'),('NY','New York'),('NC','North Carolina'),('ND','North Dakota'),('OH','Ohio'),
('OK','Oklahoma'),('OR','Oregon'),('PA','Pennsylvania'),('RI','Rhode Island'),('SC','South Carolina'),
('SD','South Dakota'),('TN','Tennessee'),('TX','Texas'),('UT','Utah'),('VT','Vermont'),
('VA','Virginia'),('WA','Washington'),('WV','West Virginia'),('WI','Wisconsin'),('WY','Wyoming'),
('DC','Washington D.C.')
ON CONFLICT (code) DO NOTHING;


-- ── 2. Profiles ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  freelancer_title TEXT,
  freelancer_email TEXT,
  avatar_url      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. Brand Kits ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS brand_kits (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url        TEXT,
  primary_color   TEXT        DEFAULT '#0ea5e9',
  secondary_color TEXT        DEFAULT '#0369a1',
  font_family     TEXT        DEFAULT 'Inter',
  company_name    TEXT        DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ── 4. Proposals ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proposals (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Client
  client_name       TEXT        NOT NULL,
  client_company    TEXT,
  client_country    CHAR(2)     REFERENCES countries(code),

  -- Project
  project_type      TEXT,
  project_description TEXT,
  deliverables      TEXT,
  timeline          TEXT,
  tone              TEXT        DEFAULT 'professional',

  -- Pricing
  currency          CHAR(3)     DEFAULT 'USD',
  total_budget      NUMERIC(15,2),
  deposit_percent   INTEGER     DEFAULT 50,
  deposit_amount    NUMERIC(15,2),

  -- Freelancer snapshot
  freelancer_name   TEXT,
  freelancer_title  TEXT,
  freelancer_email  TEXT,

  -- Generated content
  proposal_text     TEXT,
  payment_link      TEXT,

  -- Interactive features (JSON)
  tiers             JSONB       DEFAULT '[]',
  add_ons           JSONB       DEFAULT '[]',
  milestones        JSONB       DEFAULT '[]',
  brand_snapshot    JSONB,

  -- Status tracking
  status            TEXT        DEFAULT 'draft'
                    CHECK (status IN ('draft','sent','viewed','accepted','declined','expired')),
  sent_at           TIMESTAMPTZ,
  viewed_at         TIMESTAMPTZ,
  accepted_at       TIMESTAMPTZ,

  -- Metadata
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. Contracts ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contracts (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Contract type
  contract_type_id  TEXT        NOT NULL,   -- e.g. 'nda', 'sla', 'lease'
  contract_type_name TEXT,
  category          TEXT,

  -- Jurisdiction
  governing_country CHAR(2)     REFERENCES countries(code),
  governing_state   TEXT,                  -- US state if applicable
  governing_law     TEXT,                  -- Free-text jurisdiction description

  -- Party A
  party_a_name      TEXT,
  party_a_role      TEXT,
  party_a_address   TEXT,
  party_a_country   CHAR(2)     REFERENCES countries(code),

  -- Party B
  party_b_name      TEXT,
  party_b_role      TEXT,
  party_b_address   TEXT,
  party_b_country   CHAR(2)     REFERENCES countries(code),

  -- Contract-specific fields (flexible JSON)
  contract_fields   JSONB       DEFAULT '{}',

  -- Generated content
  contract_text     TEXT,

  -- Status
  status            TEXT        DEFAULT 'draft'
                    CHECK (status IN ('draft','reviewed','signed','expired','terminated')),
  signed_at         TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ,

  -- Metadata
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. Row Level Security ─────────────────────────────────────
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE us_states  ENABLE ROW LEVEL SECURITY;

-- Countries & US States — public read
CREATE POLICY "countries_public_read"  ON countries  FOR SELECT USING (true);
CREATE POLICY "us_states_public_read"  ON us_states  FOR SELECT USING (true);

-- Profiles — own only
CREATE POLICY "profiles_select_own"    ON profiles   FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own"    ON profiles   FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"    ON profiles   FOR UPDATE USING (auth.uid() = id);

-- Brand kits — own only
CREATE POLICY "brand_kits_select_own"  ON brand_kits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "brand_kits_insert_own"  ON brand_kits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "brand_kits_update_own"  ON brand_kits FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "brand_kits_delete_own"  ON brand_kits FOR DELETE USING (auth.uid() = user_id);

-- Proposals — own only
CREATE POLICY "proposals_select_own"   ON proposals  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "proposals_insert_own"   ON proposals  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "proposals_update_own"   ON proposals  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "proposals_delete_own"   ON proposals  FOR DELETE USING (auth.uid() = user_id);

-- Contracts — own only
CREATE POLICY "contracts_select_own"   ON contracts  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "contracts_insert_own"   ON contracts  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "contracts_update_own"   ON contracts  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "contracts_delete_own"   ON contracts  FOR DELETE USING (auth.uid() = user_id);

-- ── 7. Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_proposals_user_id    ON proposals (user_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status     ON proposals (user_id, status);
CREATE INDEX IF NOT EXISTS idx_proposals_created    ON proposals (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_user_id    ON contracts (user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_type       ON contracts (user_id, contract_type_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created    ON contracts (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_brand_kits_user      ON brand_kits (user_id);
CREATE INDEX IF NOT EXISTS idx_countries_region     ON countries (region);
CREATE INDEX IF NOT EXISTS idx_countries_name_trgm  ON countries USING gin (name gin_trgm_ops);

-- ── 8. Updated-at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_brand_kits_updated
  BEFORE UPDATE ON brand_kits
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_proposals_updated
  BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_contracts_updated
  BEFORE UPDATE ON contracts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 9. Auto-create profile on signup ─────────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, freelancer_email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Done ─────────────────────────────────────────────────────
-- Tables: countries (249), us_states (51), profiles, brand_kits, proposals, contracts
-- RLS: enabled on all tables with own-data policies
-- Indexes: on user_id, status, created_at, country name (trigram)
-- Triggers: auto-updated_at, auto-create profile on signup
