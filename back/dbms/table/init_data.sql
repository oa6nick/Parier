--liquibase formatted sql
--changeset artemov_i:init_localization_data_fn runOnChange:true dbms:postgresql splitStatements:false stripComments:false
select 'Создание функции для создания или выбора слова';
CREATE OR REPLACE FUNCTION f_create_or_select_word(pv_word varchar)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
declare
  vk_id uuid;
begin
  select ck_id into vk_id from t_l_word where cv_text = trim(pv_word);
  if not found then
    insert into t_l_word (cv_text, ck_create, ck_modify) 
    values (trim(pv_word), 'system', 'system') 
    returning ck_id into vk_id;
  end if;
  return vk_id;
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
    ('like-type.dislike', 'STATIC', 'system', 'system'),
    ('transaction-status.pending', 'STATIC', 'system', 'system'),
    ('transaction-status.confirmed', 'STATIC', 'system', 'system'),
    ('transaction-status.rejected', 'STATIC', 'system', 'system'),
    ('transaction-type.deposit', 'STATIC', 'system', 'system'),
    ('transaction-type.withdrawal', 'STATIC', 'system', 'system'),
    ('transaction-type.bet', 'STATIC', 'system', 'system'),
    ('transaction-type.win', 'STATIC', 'system', 'system'),
    ('transaction-type.loss', 'STATIC', 'system', 'system'),
    ('transaction-type.fee', 'STATIC', 'system', 'system'),
    ('transaction-type.refund', 'STATIC', 'system', 'system'),
    ('transaction-type.bonus', 'STATIC', 'system', 'system'),
    ('transaction-type.promo', 'STATIC', 'system', 'system'),
    ('user.avatar', 'STATIC', 'system', 'system'),
    ('user.background', 'STATIC', 'system', 'system'),
    ('user.verified', 'STATIC', 'system', 'system'),
    ('user.username', 'STATIC', 'system', 'system'),    
    ('user.email', 'STATIC', 'system', 'system'),
    ('user.phone', 'STATIC', 'system', 'system')
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
    ('like-type.dislike', 'RU', f_create_or_select_word('Не нравится'), 'system', 'system'),
    ('transaction-status.pending', 'EN', f_create_or_select_word('Pending'), 'system', 'system'),
    ('transaction-status.pending', 'RU', f_create_or_select_word('Ожидается'), 'system', 'system'),
    ('transaction-status.confirmed', 'EN', f_create_or_select_word('Confirmed'), 'system', 'system'),
    ('transaction-status.confirmed', 'RU', f_create_or_select_word('Подтверждено'), 'system', 'system'),
    ('transaction-status.rejected', 'EN', f_create_or_select_word('Rejected'), 'system', 'system'),
    ('transaction-status.rejected', 'RU', f_create_or_select_word('Отклонено'), 'system', 'system'),
    ('transaction-type.deposit', 'EN', f_create_or_select_word('Deposit'), 'system', 'system'),
    ('transaction-type.deposit', 'RU', f_create_or_select_word('Пополнение'), 'system', 'system'),
    ('transaction-type.withdrawal', 'EN', f_create_or_select_word('Withdrawal'), 'system', 'system'),
    ('transaction-type.withdrawal', 'RU', f_create_or_select_word('Вывод'), 'system', 'system'),
    ('transaction-type.bet', 'EN', f_create_or_select_word('Bet'), 'system', 'system'),
    ('transaction-type.bet', 'RU', f_create_or_select_word('Ставка'), 'system', 'system'),
    ('transaction-type.win', 'EN', f_create_or_select_word('Win'), 'system', 'system'),
    ('transaction-type.win', 'RU', f_create_or_select_word('Выигрыш'), 'system', 'system'),
    ('transaction-type.loss', 'EN', f_create_or_select_word('Loss'), 'system', 'system'),
    ('transaction-type.loss', 'RU', f_create_or_select_word('Проигрыш'), 'system', 'system'),
    ('transaction-type.fee', 'EN', f_create_or_select_word('Fee'), 'system', 'system'),
    ('transaction-type.fee', 'RU', f_create_or_select_word('Комиссия'), 'system', 'system'),
    ('transaction-type.refund', 'EN', f_create_or_select_word('Refund'), 'system', 'system'),
    ('transaction-type.refund', 'RU', f_create_or_select_word('Возврат'), 'system', 'system'),
    ('transaction-type.bonus', 'EN', f_create_or_select_word('Bonus'), 'system', 'system'),
    ('transaction-type.bonus', 'RU', f_create_or_select_word('Бонус'), 'system', 'system'),
    ('transaction-type.promo', 'EN', f_create_or_select_word('Promo'), 'system', 'system'),
    ('transaction-type.promo', 'RU', f_create_or_select_word('Промо'), 'system', 'system'),
    ('user.avatar', 'EN', f_create_or_select_word('Avatar'), 'system', 'system'),
    ('user.avatar', 'RU', f_create_or_select_word('Аватар'), 'system', 'system'),
    ('user.background', 'EN', f_create_or_select_word('Background'), 'system', 'system'),
    ('user.background', 'RU', f_create_or_select_word('Фон'), 'system', 'system'),
    ('user.verified', 'EN', f_create_or_select_word('Verified'), 'system', 'system'),
    ('user.verified', 'RU', f_create_or_select_word('Подтвержден'), 'system', 'system'),
    ('user.username', 'EN', f_create_or_select_word('Username'), 'system', 'system'),
    ('user.username', 'RU', f_create_or_select_word('Имя пользователя'), 'system', 'system'),
    ('user.email', 'EN', f_create_or_select_word('Email'), 'system', 'system'),
    ('user.email', 'RU', f_create_or_select_word('Email'), 'system', 'system'),
    ('user.phone', 'EN', f_create_or_select_word('Phone'), 'system', 'system'),
    ('user.phone', 'RU', f_create_or_select_word('Телефон'), 'system', 'system')
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
    ('ECONOMY', 'category.economy', null, 'system', 'system')
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
    ('OFFICIAL-ELECTION-RESULTS', 'verification-source.official-election-results', null, 'system', 'system')
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
    ('SYSTEM', 'bet-type.system', null, 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_bet_type;

--changeset artemov_i:init_like_types_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 8. ТИПЫ ЛАЙКОВ
-- =====================================================
select 'Создание типов лайков';
INSERT INTO t_d_like_type (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('LIKE', 'like-type.like', null, 'system', 'system'),
    ('DISLIKE', 'like-type.dislike', null, 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_like_type;

--changeset artemov_i:init_transaction_statuses_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 9. СТАТУСЫ ТРАНЗАКЦИЙ
-- =====================================================
select 'Создание статусов транзакций';
INSERT INTO t_d_transaction_status (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('PENDING', 'transaction-status.pending', null, 'system', 'system'),
    ('CONFIRMED', 'transaction-status.confirmed', null, 'system', 'system'),
    ('REJECTED', 'transaction-status.rejected', null, 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_transaction_status;

--changeset artemov_i:init_transaction_types_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 10. ТИПЫ ТРАНЗАКЦИЙ
-- =====================================================
select 'Создание типов транзакций';
INSERT INTO t_d_transaction_type (ck_id, ck_name, ck_description, ck_create, ck_modify) VALUES  
    ('DEPOSIT', 'transaction-type.deposit', null, 'system', 'system'),
    ('BET', 'transaction-type.bet', null, 'system', 'system'),
    ('WIN', 'transaction-type.win', null, 'system', 'system'),
    ('LOSS', 'transaction-type.loss', null, 'system', 'system'),
    ('FEE', 'transaction-type.fee', null, 'system', 'system'),
    ('REFUND', 'transaction-type.refund', null, 'system', 'system'),
    ('BONUS', 'transaction-type.bonus', null, 'system', 'system'),
    ('PROMO', 'transaction-type.promo', null, 'system', 'system'),
    ('WITHDRAWAL', 'transaction-type.withdrawal', null, 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_transaction_type;

--changeset artemov_i:init_properties_types_data runOnChange:true dbms:postgresql splitStatements:false stripComments:false

-- =====================================================
-- 11. ТИПЫ СВОЙСТВ
-- =====================================================
select 'Создание типов свойств';
INSERT INTO t_d_properties_type (ck_id, cr_type, cr_place, ck_name, ck_description, ck_create, ck_modify) VALUES 
    ('USER_AVATAR', 'MEDIA', 'USER', 'user.avatar', null, 'system', 'system'),
    ('USER_BACKGROUND', 'MEDIA', 'USER', 'user.background', null, 'system', 'system'),
    ('USER_VERIFIED', 'BOOLEAN', 'USER', 'user.verified', null, 'system', 'system'),
    ('USER_USERNAME', 'TEXT', 'USER', 'user.username', null, 'system', 'system'),
    ('USER_EMAIL', 'TEXT', 'USER', 'user.email', null, 'system', 'system'),
    ('USER_PHONE', 'TEXT', 'USER', 'user.phone', null, 'system', 'system')
    ON CONFLICT (ck_id) DO NOTHING;

--rollback DROP TABLE t_d_properties_type;
