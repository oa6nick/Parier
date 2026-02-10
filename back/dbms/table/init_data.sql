--liquibase formatted sql
--changeset artemov_i:init_localization_data_fn dbms:postgresql splitStatements:false stripComments:false
select 'Создание функции для создания или выбора слова';
CREATE OR REPLACE FUNCTION f_create_or_select_word(pv_word varchar)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
declare
  ck_id uuid;
begin
  select ck_id into ck_id from t_l_word where cv_text = trim(pv_word);
  if not found then
    insert into t_l_word (cv_text, ck_create, ck_modify) 
    values (trim(pv_word), 'system', 'system') 
    returning ck_id into ck_id;
  end if;
  return ck_id;
end;$$;

--rollback DROP FUNCTION f_create_or_select_word(varchar);

--changeset artemov_i:init_localization_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 1. БАЗОВЫЕ ТЕКСТЫ ДЛЯ ЛОКАЛИЗАЦИИ
-- =====================================================

select 'Создание базовых текстов для локализации';
INSERT INTO t_l_word (ck_id, cv_text, ck_create, ck_modify) VALUES 
    -- Языки
    ('11111111-1111-1111-1111-111111111111', 'English', 'system', 'system'),
    ('11111111-1111-1111-1111-111111111112', 'Русский', 'system', 'system')
    ON CONFLICT (ck_id)
    DO UPDATE SET cv_text=EXCLUDED.cv_text;

-- =====================================================
-- 2. ЯЗЫКИ СИСТЕМЫ
-- =====================================================
select 'Создание языков системы';
INSERT INTO t_d_lang (ck_id, ck_name, cl_default, cv_code_android, cv_code_ios, cv_code_browser, cr_direction, ck_create, ck_modify) VALUES 
    ('EN', '11111111-1111-1111-1111-111111111111', true, 'en', 'en', 'en-US', 'LEFT_TO_RIGHT', 'system', 'system'),
    ('RU', '11111111-1111-1111-1111-111111111112', false, 'ru', 'ru', 'ru-RU', 'LEFT_TO_RIGHT', 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

-- =====================================================
-- 3. СЛОВА ДЛЯ ЛОКАЛИЗАЦИИ
-- =====================================================
select 'Создание слов для локализации';
INSERT INTO t_localization (ck_id, cr_type, ck_create, ck_modify) VALUES 
    ('locale', 'STATIC', 'system', 'system'),
    ('category.crypto', 'STATIC', 'system', 'system'),
    ('category.sports', 'STATIC', 'system', 'system'),
    ('category.politics', 'STATIC', 'system', 'system'),
    ('category.technology', 'STATIC', 'system', 'system'),
    ('category.entertainment', 'STATIC', 'system', 'system'),
    ('category.stock-market', 'STATIC', 'system', 'system'),
    ('category.economy', 'STATIC', 'system', 'system'),
    ('verification-source.nasdaq', 'STATIC', 'system', 'system'),
    ('verification-source.nyse', 'STATIC', 'system', 'system'),
    ('verification-source.binance', 'STATIC', 'system', 'system'),
    ('verification-source.coinbase', 'STATIC', 'system', 'system'),
    ('verification-source.coingecko', 'STATIC', 'system', 'system'),
    ('verification-source.yahoo-finance', 'STATIC', 'system', 'system'),
    ('verification-source.bloomberg', 'STATIC', 'system', 'system'),
    ('verification-source.rosstat', 'STATIC', 'system', 'system'),
    ('verification-source.fifa', 'STATIC', 'system', 'system'),
    ('verification-source.iihf', 'STATIC', 'system', 'system'),
    ('verification-source.apple', 'STATIC', 'system', 'system'),
    ('verification-source.official-election-results', 'STATIC', 'system', 'system'),
    ('bet-status.open', 'STATIC', 'system', 'system'),
    ('bet-status.closed', 'STATIC', 'system', 'system'),
    ('bet-status.cancelled', 'STATIC', 'system', 'system'),
    ('bet-status.pending', 'STATIC', 'system', 'system'),
    ('bet-status.confirmed', 'STATIC', 'system', 'system'),
    ('bet-status.rejected', 'STATIC', 'system', 'system'),
    ('bet-status.expired', 'STATIC', 'system', 'system'),
    ('bet-status.cancelled', 'STATIC', 'system', 'system'),
    ('bet-type.single', 'STATIC', 'system', 'system'),
    ('bet-type.multiple', 'STATIC', 'system', 'system'),
    ('bet-type.system', 'STATIC', 'system', 'system'),
    ('like-type.like', 'STATIC', 'system', 'system'),
    ('like-type.dislike', 'STATIC', 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

INSERT INTO t_localization_word (ck_localization, ck_lang, ck_text, ck_create, ck_modify) VALUES 
    ('locale', 'EN', '11111111-1111-1111-1111-111111111111', 'system', 'system'),
    ('locale', 'RU', '11111111-1111-1111-1111-111111111112', 'system', 'system'),
    ('category.crypto', 'EN', f_create_or_select_word('Cryptocurrency'), 'system', 'system'),
    ('category.crypto', 'RU', f_create_or_select_word('Криптовалюты'), 'system', 'system'),
    ('category.sports', 'EN', f_create_or_select_word('Sports'), 'system', 'system'),
    ('category.sports', 'RU', f_create_or_select_word('Спорт'), 'system', 'system'),
    ('category.politics', 'EN', f_create_or_select_word('Politics'), 'system', 'system'),
    ('category.politics', 'RU', f_create_or_select_word('Политика'), 'system', 'system'),
    ('category.technology', 'EN', f_create_or_select_word('Technology'), 'system', 'system'),
    ('category.technology', 'RU', f_create_or_select_word('Технологии'), 'system', 'system'),
    ('category.entertainment', 'EN', f_create_or_select_word('Entertainment'), 'system', 'system'),
    ('category.entertainment', 'RU', f_create_or_select_word('Развлечения'), 'system', 'system'),
    ('category.stock-market', 'EN', f_create_or_select_word('Stock Market'), 'system', 'system'),
    ('category.stock-market', 'RU', f_create_or_select_word('Фондовый рынок'), 'system', 'system'),
    ('category.economy', 'EN', f_create_or_select_word('Economy'), 'system', 'system'),
    ('category.economy', 'RU', f_create_or_select_word('Экономика'), 'system', 'system'),
    ('verification-source.nasdaq', 'EN', f_create_or_select_word('NASDAQ'), 'system', 'system'),
    ('verification-source.nasdaq', 'RU', f_create_or_select_word('NASDAQ'), 'system', 'system'),
    ('verification-source.nyse', 'EN', f_create_or_select_word('NYSE'), 'system', 'system'),
    ('verification-source.nyse', 'RU', f_create_or_select_word('NYSE'), 'system', 'system'),
    ('verification-source.binance', 'EN', f_create_or_select_word('Binance'), 'system', 'system'),
    ('verification-source.binance', 'RU', f_create_or_select_word('Binance'), 'system', 'system'),
    ('verification-source.coinbase', 'EN', f_create_or_select_word('Coinbase'), 'system', 'system'),
    ('verification-source.coinbase', 'RU', f_create_or_select_word('Coinbase'), 'system', 'system'),
    ('verification-source.coingecko', 'EN', f_create_or_select_word('Coingecko'), 'system', 'system'),
    ('verification-source.coingecko', 'RU', f_create_or_select_word('Coingecko'), 'system', 'system'),
    ('verification-source.yahoo-finance', 'EN', f_create_or_select_word('Yahoo Finance'), 'system', 'system'),
    ('verification-source.yahoo-finance', 'RU', f_create_or_select_word('Yahoo Finance'), 'system', 'system'),
    ('verification-source.bloomberg', 'EN', f_create_or_select_word('Bloomberg'), 'system', 'system'),
    ('verification-source.bloomberg', 'RU', f_create_or_select_word('Bloomberg'), 'system', 'system'),
    ('verification-source.rosstat', 'EN', f_create_or_select_word('Rosstat'), 'system', 'system'),
    ('verification-source.rosstat', 'RU', f_create_or_select_word('Rosstat'), 'system', 'system'),
    ('verification-source.fifa', 'EN', f_create_or_select_word('FIFA'), 'system', 'system'),
    ('verification-source.fifa', 'RU', f_create_or_select_word('FIFA'), 'system', 'system'),
    ('verification-source.iihf', 'EN', f_create_or_select_word('IIHF'), 'system', 'system'),
    ('verification-source.iihf', 'RU', f_create_or_select_word('IIHF'), 'system', 'system'),
    ('verification-source.apple', 'EN', f_create_or_select_word('Apple'), 'system', 'system'),
    ('verification-source.apple', 'RU', f_create_or_select_word('Apple'), 'system', 'system'),
    ('verification-source.official-election-results', 'EN', f_create_or_select_word('Official Election Results'), 'system', 'system'),
    ('verification-source.official-election-results', 'RU', f_create_or_select_word('Официальные результаты выборов'), 'system', 'system'),
    ('bet-status.open', 'EN', f_create_or_select_word('Open'), 'system', 'system'),
    ('bet-status.open', 'RU', f_create_or_select_word('Открыто'), 'system', 'system'),
    ('bet-status.closed', 'EN', f_create_or_select_word('Closed'), 'system', 'system'),
    ('bet-status.closed', 'RU', f_create_or_select_word('Закрыто'), 'system', 'system'),
    ('bet-status.cancelled', 'EN', f_create_or_select_word('Cancelled'), 'system', 'system'),
    ('bet-status.cancelled', 'RU', f_create_or_select_word('Отменено'), 'system', 'system'),
    ('bet-status.pending', 'EN', f_create_or_select_word('Pending'), 'system', 'system'),
    ('bet-status.pending', 'RU', f_create_or_select_word('Ожидается'), 'system', 'system'),
    ('bet-status.confirmed', 'EN', f_create_or_select_word('Confirmed'), 'system', 'system'),
    ('bet-status.confirmed', 'RU', f_create_or_select_word('Подтверждено'), 'system', 'system'),
    ('bet-status.rejected', 'EN', f_create_or_select_word('Rejected'), 'system', 'system'),
    ('bet-status.rejected', 'RU', f_create_or_select_word('Отклонено'), 'system', 'system'),
    ('bet-status.expired', 'EN', f_create_or_select_word('Expired'), 'system', 'system'),
    ('bet-status.expired', 'RU', f_create_or_select_word('Истекло'), 'system', 'system'),
    ('bet-status.cancelled', 'EN', f_create_or_select_word('Cancelled'), 'system', 'system'),
    ('bet-status.cancelled', 'RU', f_create_or_select_word('Отменено'), 'system', 'system'),
    ('bet-type.single', 'EN', f_create_or_select_word('Single'), 'system', 'system'),
    ('bet-type.single', 'RU', f_create_or_select_word('Одиночная'), 'system', 'system'),
    ('bet-type.multiple', 'EN', f_create_or_select_word('Multiple'), 'system', 'system'),
    ('bet-type.multiple', 'RU', f_create_or_select_word('Многократная'), 'system', 'system'),
    ('bet-type.system', 'EN', f_create_or_select_word('System'), 'system', 'system'),
    ('bet-type.system', 'RU', f_create_or_select_word('Системная'), 'system', 'system'),
    ('like-type.like', 'EN', f_create_or_select_word('Like'), 'system', 'system'),
    ('like-type.like', 'RU', f_create_or_select_word('Нравится'), 'system', 'system'),
    ('like-type.dislike', 'EN', f_create_or_select_word('Dislike'), 'system', 'system'),
    ('like-type.dislike', 'RU', f_create_or_select_word('Не нравится'), 'system', 'system')
    ON CONFLICT (ck_localization, ck_lang) DO NOTHING;

--changeset artemov_i:init_categories_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 4. КАТЕГОРИЙ СТАВОК
-- =====================================================
select 'Создание категорий ставок';
INSERT INTO t_d_category (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('CRYPTO', 'category.crypto', null, 'system', 'system'),
    ('SPORTS', 'category.sports', null, 'system', 'system'),
    ('POLITICS', 'category.politics', null, 'system', 'system'),
    ('TECHNOLOGY', 'category.technology', null, 'system', 'system'),
    ('ENTERTAINMENT', 'category.entertainment', null, 'system', 'system'),
    ('STOCK-MARKET', 'category.stock-market', null, 'system', 'system'),
    ('ECONOMY', 'category.economy', null, 'system', 'system'),
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_category;

--changeset artemov_i:init_verification_sources_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 5. ИСТОЧНИКИ ПРОВЕРКИ
-- =====================================================
select 'Создание источников проверки';
INSERT INTO t_d_verification_source (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('NASDAQ', 'verification-source.nasdaq', null, 'system', 'system'),
    ('NYSE', 'verification-source.nyse', null, 'system', 'system'),
    ('BINANCE', 'verification-source.binance', null, 'system', 'system'),
    ('COINBASE', 'verification-source.coinbase', null, 'system', 'system'),
    ('COINGECKO', 'verification-source.coingecko', null, 'system', 'system'),
    ('YAHOO-FINANCE', 'verification-source.yahoo-finance', null, 'system', 'system'),
    ('BLOOMBERG', 'verification-source.bloomberg', null, 'system', 'system'),
    ('ROSSTAT', 'verification-source.rosstat', null, 'system', 'system'),
    ('FIFA', 'verification-source.fifa', null, 'system', 'system'),
    ('IIHF', 'verification-source.iihf', null, 'system', 'system'),
    ('APPLE', 'verification-source.apple', null, 'system', 'system'),
    ('OFFICIAL-ELECTION-RESULTS', 'verification-source.official-election-results', null, 'system', 'system'),
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_verification_source;

--changeset artemov_i:init_bet_statuses_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 6. СТАТУСЫ СТАВОК
-- =====================================================
select 'Создание статусов ставок';
INSERT INTO t_d_bet_status (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('OPEN', 'bet-status.open', null, 'system', 'system'),
    ('CLOSED', 'bet-status.closed', null, 'system', 'system'),
    ('CANCELLED', 'bet-status.cancelled', null, 'system', 'system'),
    ('PENDING', 'bet-status.pending', null, 'system', 'system'),
    ('CONFIRMED', 'bet-status.confirmed', null, 'system', 'system'),
    ('REJECTED', 'bet-status.rejected', null, 'system', 'system'),
    ('EXPIRED', 'bet-status.expired', null, 'system', 'system'),
    ('CANCELLED', 'bet-status.cancelled', null, 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_bet_status;

--changeset artemov_i:init_bet_types_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 7. ТИПЫ СТАВОК
-- =====================================================
select 'Создание типов ставок';
INSERT INTO t_d_bet_type (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('SINGLE', 'bet-type.single', null, 'system', 'system'),
    ('MULTIPLE', 'bet-type.multiple', null, 'system', 'system'),
    ('SYSTEM', 'bet-type.system', null, 'system', 'system'),
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_bet_type;

--changeset artemov_i:init_like_types_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 8. ТИПЫ ЛАЙКОВ
-- =====================================================
select 'Создание типов лайков';
INSERT INTO t_d_like_type (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('LIKE', 'like-type.like', null, 'system', 'system'),
    ('DISLIKE', 'like-type.dislike', null, 'system', 'system'),
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_like_type;
