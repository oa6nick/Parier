--liquibase formatted sql
--changeset artemov_i:init_parier_db_schema dbms:postgresql splitStatements:false stripComments:false
-- =====================================================
-- Создание полной схемы базы данных для PostgreSQL
-- Система управления недвижимостью (parier)
-- Обновленная версия: 33 таблицы (новая схема)
-- =====================================================

-- Установка расширений для UUID и PostGIS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ОСНОВНЫЕ ТАБЛИЦЫ ЛОКАЛИЗАЦИИ
-- =====================================================

-- Таблица: t_l_word - Уникальные тексты
CREATE TABLE t_l_word (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cv_text TEXT NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL
);

COMMENT ON TABLE t_l_word IS 'Уникальные тексты';
COMMENT ON COLUMN t_l_word.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_l_word.cv_text IS 'Текст';
COMMENT ON COLUMN t_l_word.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_l_word.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_l_word.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_l_word.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_l_word.ct_delete IS 'Дата логического удаления';

-- Таблица: t_d_lang - Языки
CREATE TABLE t_d_lang (
    ck_id VARCHAR(20) PRIMARY KEY,
    ck_name UUID NOT NULL,
    cl_default BOOLEAN DEFAULT false,
    cv_code_android VARCHAR(255) NOT NULL,
    cv_code_ios VARCHAR(255) NOT NULL,
    cv_code_browser VARCHAR(255) NOT NULL,
    cr_direction VARCHAR(20) NOT NULL DEFAULT 'LEFT_TO_RIGHT' CHECK (cr_direction IN ('LEFT_TO_RIGHT', 'RIGHT_TO_LEFT')),
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_lang_ck_name FOREIGN KEY (ck_name) REFERENCES t_l_word(ck_id)
);

COMMENT ON TABLE t_d_lang IS 'Языки';
COMMENT ON COLUMN t_d_lang.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_lang.ck_name IS 'Текст';
COMMENT ON COLUMN t_d_lang.cl_default IS 'Язык по умолчанию';
COMMENT ON COLUMN t_d_lang.cv_code_android IS 'Код языка андройд';
COMMENT ON COLUMN t_d_lang.cv_code_ios IS 'Код языка ios';
COMMENT ON COLUMN t_d_lang.cv_code_browser IS 'Код языка browser';
COMMENT ON COLUMN t_d_lang.cr_direction IS 'Направление языка';
COMMENT ON COLUMN t_d_lang.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_lang.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_lang.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_lang.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_lang.ct_delete IS 'Дата логического удаления';

-- Таблица: t_localization - Ссылки на переводы
CREATE TABLE t_localization (
    ck_id VARCHAR(255) PRIMARY KEY DEFAULT uuid_generate_v4()::VARCHAR,
    cr_type VARCHAR(20) NOT NULL CHECK (cr_type IN ('STATIC','DYNAMIC')),
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL
);

COMMENT ON TABLE t_localization IS 'Ссылки на переводы';
COMMENT ON COLUMN t_localization.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_localization.cr_type IS 'Тип локализации';
COMMENT ON COLUMN t_localization.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_localization.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_localization.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_localization.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_localization.ct_delete IS 'Дата логического удаления';

-- Таблица: t_localization_word - Мапинг языка и перевода
CREATE TABLE t_localization_word (
    ck_localization VARCHAR(255) NOT NULL,
    ck_lang VARCHAR(20) NOT NULL,
    ck_text UUID NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT pk_t_localization_word PRIMARY KEY (ck_localization, ck_lang),
    CONSTRAINT fk_t_localization_word_ck_localization FOREIGN KEY (ck_localization) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_localization_ck_lang FOREIGN KEY (ck_lang) REFERENCES t_d_lang(ck_id),
    CONSTRAINT fk_t_localization_ck_text FOREIGN KEY (ck_text) REFERENCES t_l_word(ck_id)
);

COMMENT ON TABLE t_localization_word IS 'Ссылки на переводы';
COMMENT ON COLUMN t_localization_word.ck_localization IS 'Идентификатор локализации';
COMMENT ON COLUMN t_localization_word.ck_lang IS 'Идентификатор языка';
COMMENT ON COLUMN t_localization_word.ck_text IS 'Текст';
COMMENT ON COLUMN t_localization_word.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_localization_word.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_localization_word.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_localization_word.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_localization_word.ct_delete IS 'Дата логического удаления';

-- =====================================================
-- ТАБЛИЦЫ МЕДИА
-- =====================================================

-- Таблица: t_d_media - Тип вложений
CREATE TABLE t_d_media (
    ck_id VARCHAR(40) PRIMARY KEY,
    ck_name VARCHAR(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    cv_mime_type VARCHAR(255) NOT NULL DEFAULT 'application/octet-stream',
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_media_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_media_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id),
    CONSTRAINT uk_t_d_media_ck_id CHECK (UPPER(ck_id) = ck_id)
);

COMMENT ON TABLE t_d_media IS 'Тип вложений';
COMMENT ON COLUMN t_d_media.ck_id IS 'Идентификатор (верхний регистр)';
COMMENT ON COLUMN t_d_media.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_media.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_media.cv_mime_type IS 'Mime тип';
COMMENT ON COLUMN t_d_media.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_media.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_media.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_media.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_media.ct_delete IS 'Дата логического удаления';

-- Таблица: t_media - Ссылка на вложений
CREATE TABLE t_media (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_type VARCHAR(40) NOT NULL,
    cv_name VARCHAR(255) NOT NULL,
    cv_url VARCHAR NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_media_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_media(ck_id)
);

COMMENT ON TABLE t_media IS 'Ссылка на вложений';
COMMENT ON COLUMN t_media.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_media.ck_type IS 'Тип вложения';
COMMENT ON COLUMN t_media.cv_name IS 'Наименование';
COMMENT ON COLUMN t_media.cv_url IS 'Ссылка';
COMMENT ON COLUMN t_media.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_media.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_media.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_media.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_media.ct_delete IS 'Дата логического удаления';

-- =====================================================
-- ТАБЛИЦЫ СВОЙСТВ
-- =====================================================

-- Таблица: t_d_properties_type - Тип свойства
CREATE TABLE t_d_properties_type (
    ck_id VARCHAR(100) PRIMARY KEY,
    cr_type VARCHAR(20) NOT NULL CHECK (cr_type IN ('DATE','DECIMAL', 'INTEGER', 'LOCALIZATION', 'BOOLEAN', 'TEXT', 'JSONOBJECT', 'JSONARRAY', 'MEDIA', 'ENUM')),
    cr_place VARCHAR(100) NOT NULL CHECK (cr_place IN ('AGENT','UNIT','USER')),
    ck_name VARCHAR(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_properties_type_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_properties_type_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_properties_type IS 'Тип свойства';
COMMENT ON COLUMN t_d_properties_type.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_properties_type.cr_type IS 'Формат данных';
COMMENT ON COLUMN t_d_properties_type.cr_place IS 'Область';
COMMENT ON COLUMN t_d_properties_type.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_properties_type.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_properties_type.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_properties_type.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_properties_type.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_properties_type.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_properties_type.ct_delete IS 'Дата логического удаления';

-- Таблица: t_d_properties_type_group - Группы свойств
CREATE TABLE t_d_properties_type_group (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_name VARCHAR(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_properties_type_group_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_properties_type_group_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_properties_type_group IS 'Группы свойств';
COMMENT ON COLUMN t_d_properties_type_group.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_properties_type_group.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_properties_type_group.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_properties_type_group.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_properties_type_group.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_properties_type_group.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_properties_type_group.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_properties_type_group.ct_delete IS 'Дата логического удаления';

-- Таблица: t_d_properties_enum - Значения enum свойства
CREATE TABLE t_d_properties_enum (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_property_type VARCHAR(100) NOT NULL,
    cr_value_type VARCHAR(20) NOT NULL CHECK (cr_value_type IN ('DATE','DECIMAL', 'INTEGER', 'LOCALIZATION', 'BOOLEAN', 'TEXT', 'JSONOBJECT', 'JSONARRAY', 'MEDIA')),
    ck_name VARCHAR(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    cv_text TEXT NULL,
    ck_localization VARCHAR(255) NULL,
    cn_decimal DECIMAL NULL,
    cn_number INT NULL,
    ct_date TIMESTAMP NULL,
    cl_bool BOOLEAN NULL,
    ck_media UUID NULL,
    cn_order INT NOT NULL DEFAULT 100,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_properties_enum_ck_property_type FOREIGN KEY (ck_property_type) REFERENCES t_d_properties_type(ck_id),
    CONSTRAINT fk_t_d_properties_enum_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_properties_enum_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_properties_enum_ck_localization FOREIGN KEY (ck_localization) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_properties_enum_ck_media FOREIGN KEY (ck_media) REFERENCES t_media(ck_id)
);

COMMENT ON TABLE t_d_properties_enum IS 'Значения enum свойства';
COMMENT ON COLUMN t_d_properties_enum.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_properties_enum.ck_property_type IS 'Тип свойства';
COMMENT ON COLUMN t_d_properties_enum.cr_value_type IS 'Формат значения';
COMMENT ON COLUMN t_d_properties_enum.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_properties_enum.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_properties_enum.cv_text IS 'Текст';
COMMENT ON COLUMN t_d_properties_enum.ck_localization IS 'Перевод';
COMMENT ON COLUMN t_d_properties_enum.cn_decimal IS 'Число с плавающей точкой';
COMMENT ON COLUMN t_d_properties_enum.cn_number IS 'Число';
COMMENT ON COLUMN t_d_properties_enum.ct_date IS 'Дата';
COMMENT ON COLUMN t_d_properties_enum.cl_bool IS 'Логические данные';
COMMENT ON COLUMN t_d_properties_enum.ck_media IS 'Ссылка на вложение';
COMMENT ON COLUMN t_d_properties_enum.cn_order IS 'Сортировка';
COMMENT ON COLUMN t_d_properties_enum.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_properties_enum.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_properties_enum.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_properties_enum.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_properties_enum.ct_delete IS 'Дата логического удаления';

-- Таблица: t_properties_type_group - Группа свойств

CREATE TABLE t_properties_type_group (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_group UUID NOT NULL,
    ck_property_type VARCHAR(100) NOT NULL,
    cn_order INT NOT NULL DEFAULT 100,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_properties_type_group_ck_group FOREIGN KEY (ck_group) REFERENCES t_d_properties_type_group(ck_id),
    CONSTRAINT fk_t_properties_type_group_ck_property_type FOREIGN KEY (ck_property_type) REFERENCES t_d_properties_type(ck_id)
);

COMMENT ON TABLE t_properties_type_group IS 'Группа свойств';
COMMENT ON COLUMN t_properties_type_group.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_properties_type_group.ck_group IS 'Идентификатор группы';
COMMENT ON COLUMN t_properties_type_group.ck_property_type IS 'Идентификатор свойства';
COMMENT ON COLUMN t_properties_type_group.cn_order IS 'Сортировка';
COMMENT ON COLUMN t_properties_type_group.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_properties_type_group.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_properties_type_group.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_properties_type_group.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_properties_type_group.ct_delete IS 'Дата логического удаления';

-- =====================================================
-- ТАБЛИЦЫ РОЛЕЙ И ПОЛЬЗОВАТЕЛЕЙ
-- =====================================================

-- Таблица: t_d_role - Роли
CREATE TABLE t_d_role (
    ck_id VARCHAR(255) PRIMARY KEY,
    ck_name VARCHAR(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    cl_default BOOLEAN NOT NULL DEFAULT false,
    cr_place VARCHAR(20) NOT NULL CHECK (cr_place IN ('GLOBAL', 'AGENT')),
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_role_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_role_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_role IS 'Роли';
COMMENT ON COLUMN t_d_role.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_role.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_role.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_role.cl_default IS 'Роль по умолчанию';
COMMENT ON COLUMN t_d_role.cr_place IS 'Область работы роли';
COMMENT ON COLUMN t_d_role.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_role.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_role.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_role.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_role.ct_delete IS 'Дата логического удаления';

-- Таблица: t_user - Пользователи
CREATE TABLE t_user (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_external VARCHAR(255) NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL
);

COMMENT ON TABLE t_user IS 'Пользователи';
COMMENT ON COLUMN t_user.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_user.ck_external IS 'Внешний идентификатор';
COMMENT ON COLUMN t_user.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_user.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_user.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_user.ct_delete IS 'Дата логического удаления';

-- Таблица: t_session - Сессии
CREATE TABLE t_session (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_user UUID NULL,
    cv_data TEXT NOT NULL CHECK (cv_data::jsonb IS NOT NULL),
    ct_expire TIMESTAMP NOT NULL,
    ck_ip VARCHAR(255) NULL,
    ck_user_agent VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_session_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);

COMMENT ON TABLE t_session IS 'Сессии';
COMMENT ON COLUMN t_session.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_session.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_session.cv_data IS 'Данные';
COMMENT ON COLUMN t_session.ct_expire IS 'Дата истечения';
COMMENT ON COLUMN t_session.ck_ip IS 'IP-адрес';
COMMENT ON COLUMN t_session.ck_user_agent IS 'User-Agent';
COMMENT ON COLUMN t_session.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_session.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_session.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_session.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_session.ct_delete IS 'Дата логического удаления';

-- Таблица: t_user_role - Роли пользователей
CREATE TABLE t_user_role (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_user UUID NOT NULL,
    ck_role VARCHAR(255) NOT NULL,
    ct_start TIMESTAMP NOT NULL DEFAULT now(),
    ct_end TIMESTAMP NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_user_role_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_user_role_ck_role FOREIGN KEY (ck_role) REFERENCES t_d_role(ck_id)
);

COMMENT ON TABLE t_user_role IS 'Роли пользователей';
COMMENT ON COLUMN t_user_role.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_user_role.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user_role.ck_role IS 'Идентификатор роли';
COMMENT ON COLUMN t_user_role.ct_start IS 'Дата начала действия роли';
COMMENT ON COLUMN t_user_role.ct_end IS 'Дата окончания действия роли';
COMMENT ON COLUMN t_user_role.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_user_role.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_user_role.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user_role.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_user_role.ct_delete IS 'Дата логического удаления';

-- Таблица: t_d_table_role - Права доступа к таблицам
CREATE TABLE t_d_table_role (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_role VARCHAR(255) NOT NULL,
    ck_table VARCHAR(255) NOT NULL,
    cr_action VARCHAR(10) NOT NULL CHECK (cr_action IN ('INSERT', 'UPDATE', 'DELETE', 'ALL', 'VIEW')),
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_table_role_ck_role FOREIGN KEY (ck_role) REFERENCES t_d_role(ck_id)
);

COMMENT ON TABLE t_d_table_role IS 'Доступы ролей к таблицам';
COMMENT ON COLUMN t_d_table_role.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_table_role.ck_role IS 'Идентификатор роли';
COMMENT ON COLUMN t_d_table_role.ck_table IS 'Идентификатор таблицы';
COMMENT ON COLUMN t_d_table_role.cr_action IS 'Тип доступа';
COMMENT ON COLUMN t_d_table_role.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_table_role.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_table_role.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_table_role.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_table_role.ct_delete IS 'Дата логического удаления';

-- Таблица: t_properties_role - Доступы ролей к свойствам
CREATE TABLE t_properties_role (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_role VARCHAR(255) NOT NULL,
    ck_type VARCHAR(100) NOT NULL,
    cr_action VARCHAR(10) NOT NULL CHECK (cr_action IN ('INSERT', 'UPDATE', 'DELETE', 'ALL', 'VIEW')),
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_properties_role_ck_role FOREIGN KEY (ck_role) REFERENCES t_d_role(ck_id),
    CONSTRAINT fk_t_properties_role_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_properties_type(ck_id)
);

COMMENT ON TABLE t_properties_role IS 'Доступы ролей к таблицам к свойствам';
COMMENT ON COLUMN t_properties_role.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_properties_role.ck_role IS 'Идентификатор роли';
COMMENT ON COLUMN t_properties_role.ck_type IS 'Идентификатор таблицы';
COMMENT ON COLUMN t_properties_role.cr_action IS 'Тип доступа';
COMMENT ON COLUMN t_properties_role.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_properties_role.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_properties_role.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_properties_role.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_properties_role.ct_delete IS 'Дата логического удаления';

-- Таблица: t_user_properties - Свойства пользователя
CREATE TABLE t_user_properties (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_type VARCHAR(100) NOT NULL,
    ck_user UUID NOT NULL,
    cv_text TEXT NULL,
    ck_localization VARCHAR(255) NULL,
    cn_decimal DECIMAL NULL,
    cn_number INT NULL,
    ct_date TIMESTAMP NULL,
    cl_bool BOOLEAN NULL,
    ck_media UUID NULL,
    ck_enum UUID NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_user_properties_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_properties_type(ck_id),
    CONSTRAINT fk_t_user_properties_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_user_properties_ck_localization FOREIGN KEY (ck_localization) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_user_properties_ck_media FOREIGN KEY (ck_media) REFERENCES t_media(ck_id),
    CONSTRAINT fk_t_user_properties_ck_enum FOREIGN KEY (ck_enum) REFERENCES t_d_properties_enum(ck_id)
);

COMMENT ON TABLE t_user_properties IS 'Свойства пользователей';
COMMENT ON COLUMN t_user_properties.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_user_properties.ck_type IS 'Тип';
COMMENT ON COLUMN t_user_properties.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user_properties.cv_text IS 'Текст';
COMMENT ON COLUMN t_user_properties.ck_localization IS 'Перевод';
COMMENT ON COLUMN t_user_properties.cn_decimal IS 'Число с плавающей точкой';
COMMENT ON COLUMN t_user_properties.cn_number IS 'Число';
COMMENT ON COLUMN t_user_properties.ct_date IS 'Дата';
COMMENT ON COLUMN t_user_properties.cl_bool IS 'Логические данные';
COMMENT ON COLUMN t_user_properties.ck_media IS 'Ссылка на вложение';
COMMENT ON COLUMN t_user_properties.ck_enum IS 'Идентификатор enum';
COMMENT ON COLUMN t_user_properties.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_user_properties.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_user_properties.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user_properties.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_user_properties.ct_delete IS 'Дата логического удаления';

-- Таблица: t_user_wallet - Кошельки пользователей
CREATE TABLE t_user_wallet (
    ck_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_user UUID NOT NULL,
    cn_value DECIMAL NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_user_wallet_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);

COMMENT ON TABLE t_user_wallet IS 'Кошельки пользователей';
COMMENT ON COLUMN t_user_wallet.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_user_wallet.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user_wallet.cn_value IS 'Значение';
COMMENT ON COLUMN t_user_wallet.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_user_wallet.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_user_wallet.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_user_wallet.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_user_wallet.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_user_wallet_ck_user ON t_user_wallet(ck_user);


-- =====================================================
-- ИНДЕКСЫ
-- =====================================================

-- Индексы для t_l_word
CREATE UNIQUE INDEX uk_t_l_word_cv_text ON t_l_word(TRIM(cv_text));
CREATE INDEX idx_t_l_word_cv_text ON t_l_word(cv_text);
CREATE INDEX idx_t_l_word_ct_delete ON t_l_word(ct_delete) WHERE ct_delete IS NULL;

-- Индексы для t_d_lang
CREATE INDEX idx_t_d_lang_ck_name ON t_d_lang(ck_name);
CREATE INDEX idx_t_d_lang_ct_delete ON t_d_lang(ct_delete) WHERE ct_delete IS NULL;

-- Индексы для t_localization
CREATE INDEX idx_t_localization_ct_delete ON t_localization(ct_delete) WHERE ct_delete IS NULL;

-- Индексы для t_d_properties_type
CREATE INDEX idx_t_d_properties_type_cr_place ON t_d_properties_type(cr_place);
CREATE INDEX idx_t_d_properties_type_ct_delete ON t_d_properties_type(ct_delete) WHERE ct_delete IS NULL;

-- Индексы для t_d_properties_type_group
CREATE INDEX idx_t_d_properties_type_group_ct_delete ON t_d_properties_type_group(ct_delete) WHERE ct_delete IS NULL;
CREATE INDEX idx_t_properties_type_group_ck_group ON t_properties_type_group(ck_group);
CREATE INDEX idx_t_properties_type_group_ck_property_type ON t_properties_type_group(ck_property_type);
CREATE INDEX idx_t_properties_type_group_cn_order ON t_properties_type_group(cn_order);
CREATE INDEX idx_t_properties_type_group_ct_delete ON t_properties_type_group(ct_delete) WHERE ct_delete IS NULL;
CREATE UNIQUE INDEX uk_t_properties_type_group_ck_group_and_ck_property_type ON t_properties_type_group(ck_group, ck_property_type);

-- Индексы для t_d_properties_enum
CREATE INDEX idx_t_d_properties_enum_ck_property_type ON t_d_properties_enum(ck_property_type);
CREATE INDEX idx_t_d_properties_enum_cn_order ON t_d_properties_enum(cn_order);
CREATE INDEX idx_t_d_properties_enum_ct_delete ON t_d_properties_enum(ct_delete) WHERE ct_delete IS NULL;

-- Индексы для t_d_role
CREATE UNIQUE INDEX uk_t_d_role_ck_id ON t_d_role(UPPER(ck_id));
CREATE INDEX idx_t_d_role_cr_place ON t_d_role(cr_place);
CREATE INDEX idx_t_d_role_cl_default ON t_d_role(cl_default) WHERE cl_default = true;
CREATE INDEX idx_t_d_role_ct_delete ON t_d_role(ct_delete) WHERE ct_delete IS NULL;
CREATE INDEX idx_t_user_ck_external ON t_user(ck_external);
CREATE INDEX idx_t_user_ct_delete ON t_user(ct_delete) WHERE ct_delete IS NULL;
CREATE INDEX idx_t_user_role_ck_user ON t_user_role(ck_user);
CREATE INDEX idx_t_user_role_ck_role ON t_user_role(ck_role);
CREATE INDEX idx_t_user_role_ct_start ON t_user_role(ct_start);
CREATE INDEX idx_t_user_role_ct_end ON t_user_role(ct_end);
CREATE INDEX idx_t_user_role_ct_delete ON t_user_role(ct_delete) WHERE ct_delete IS NULL;
CREATE INDEX idx_t_d_table_role_ck_role ON t_d_table_role(ck_role);
CREATE INDEX idx_t_d_table_role_ck_table ON t_d_table_role(ck_table);
CREATE INDEX idx_t_d_table_role_ct_delete ON t_d_table_role(ct_delete) WHERE ct_delete IS NULL;
CREATE UNIQUE INDEX uk_t_d_table_role_ck_role_and_ck_table ON t_d_table_role(ck_role, ck_table);

-- Индексы для t_properties_role
CREATE INDEX idx_t_properties_role_ck_role ON t_properties_role(ck_role);
CREATE INDEX idx_t_properties_role_ck_type ON t_properties_role(ck_type);
CREATE INDEX idx_t_properties_role_ct_delete ON t_properties_role(ct_delete) WHERE ct_delete IS NULL;
CREATE UNIQUE INDEX uk_t_properties_role_ck_role_and_ck_type ON t_properties_role(ck_role, ck_type);
CREATE INDEX idx_t_user_properties_ck_user ON t_user_properties(ck_user);
CREATE INDEX idx_t_user_properties_ck_type ON t_user_properties(ck_type);
CREATE INDEX idx_t_user_properties_ct_delete ON t_user_properties(ct_delete) WHERE ct_delete IS NULL;

-- Индексы для медиа
CREATE INDEX idx_t_d_media_ct_delete ON t_d_media(ct_delete) WHERE ct_delete IS NULL;
CREATE INDEX idx_t_media_ck_type ON t_media(ck_type);
CREATE INDEX idx_t_media_ct_delete ON t_media(ct_delete) WHERE ct_delete IS NULL;
CREATE INDEX idx_t_media_cv_url ON t_media(cv_url);
CREATE UNIQUE INDEX uk_t_media_cv_url ON t_media(UPPER(cv_url));

-- =====================================================
-- ФУНКЦИИ И ТРИГГЕРЫ
-- =====================================================

-- Функция для автоматического обновления времени модификации
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ct_modify = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


