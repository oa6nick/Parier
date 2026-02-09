--liquibase formatted sql
--changeset artemov_i:init_parier_2_db_schema dbms:postgresql splitStatements:false stripComments:false

-- Таблица: t_d_category - Категория ставок
CREATE TABLE IF NOT EXISTS t_d_category (
    ck_id varchar(255) PRIMARY KEY,
    ck_name varchar(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_category_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_category_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_category IS 'Категории ставок';
COMMENT ON COLUMN t_d_category.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_category.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_category.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_category.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_category.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_category.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_category.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_category.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_d_category_ck_id ON t_d_category(UPPER(TRIM(ck_id)));

-- Таблица: t_d_verification_source - Тип источника проверки
CREATE TABLE IF NOT EXISTS t_d_verification_source (
    ck_id varchar(255) PRIMARY KEY,
    ck_name varchar(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_verification_source_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_verification_source_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_verification_source IS 'Тип источника проверки';
COMMENT ON COLUMN t_d_verification_source.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_verification_source.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_verification_source.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_verification_source.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_verification_source.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_verification_source.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_verification_source.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_verification_source.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_d_verification_source_ck_id ON t_d_verification_source(UPPER(TRIM(ck_id)));

-- Таблица: t_d_bet_status - Статус ставки
CREATE TABLE IF NOT EXISTS t_d_bet_status (
    ck_id varchar(255) PRIMARY KEY,
    ck_name varchar(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_bet_status_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_bet_status_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_bet_status IS 'Статус ставки';
COMMENT ON COLUMN t_d_bet_status.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_bet_status.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_bet_status.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_bet_status.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_bet_status.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_bet_status.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_bet_status.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_bet_status.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_d_bet_status_ck_id ON t_d_bet_status(UPPER(TRIM(ck_id)));

-- Таблица: t_d_bet_type - Тип ставки
CREATE TABLE IF NOT EXISTS t_d_bet_type (
    ck_id varchar(255) PRIMARY KEY,
    ck_name varchar(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_bet_type_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_bet_type_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_bet_type IS 'Тип ставки';
COMMENT ON COLUMN t_d_bet_type.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_bet_type.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_bet_type.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_bet_type.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_bet_type.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_bet_type.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_bet_type.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_bet_type.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_d_bet_type_ck_id ON t_d_bet_type(UPPER(TRIM(ck_id)));

-- Таблица: t_d_like_type - Тип лайка
CREATE TABLE IF NOT EXISTS t_d_like_type (
    ck_id varchar(255) PRIMARY KEY,
    ck_name varchar(255) NOT NULL,
    ck_description VARCHAR(255) NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_d_like_type_ck_name FOREIGN KEY (ck_name) REFERENCES t_localization(ck_id),
    CONSTRAINT fk_t_d_like_type_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_d_like_type IS 'Тип лайка';
COMMENT ON COLUMN t_d_like_type.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_d_like_type.ck_name IS 'Наименование';
COMMENT ON COLUMN t_d_like_type.ck_description IS 'Описание';
COMMENT ON COLUMN t_d_like_type.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_d_like_type.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_d_like_type.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_d_like_type.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_d_like_type.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_d_like_type_ck_id ON t_d_like_type(UPPER(TRIM(ck_id)));

-- Таблица: t_bet - Ставка
CREATE TABLE IF NOT EXISTS t_bet (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_author uuid NOT NULL,
    ck_category varchar(255) NOT NULL,
    ck_type varchar(255) NOT NULL,
    ck_status varchar(255) NOT NULL,
    ck_verification_source varchar(255) NOT NULL,
    cn_coefficient DECIMAL NOT NULL,
    ct_deadline TIMESTAMP NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_bet_ck_category FOREIGN KEY (ck_category) REFERENCES t_d_category(ck_id),
    CONSTRAINT fk_t_bet_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_bet_type(ck_id),
    CONSTRAINT fk_t_bet_ck_status FOREIGN KEY (ck_status) REFERENCES t_d_bet_status(ck_id),
    CONSTRAINT fk_t_bet_ck_verification_source FOREIGN KEY (ck_verification_source) REFERENCES t_d_verification_source(ck_id)
);

COMMENT ON TABLE t_bet IS 'Ставка';
COMMENT ON COLUMN t_bet.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_bet.ck_category IS 'Идентификатор категории';
COMMENT ON COLUMN t_bet.ck_type IS 'Идентификатор типа';
COMMENT ON COLUMN t_bet.ck_status IS 'Идентификатор статуса';
COMMENT ON COLUMN t_bet.ck_verification_source IS 'Идентификатор источника';
COMMENT ON COLUMN t_bet.cn_coefficient IS 'Коэффициент';
COMMENT ON COLUMN t_bet.ct_deadline IS 'Срок';
COMMENT ON COLUMN t_bet.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet.ct_delete IS 'Дата логического удаления';

-- Таблица: t_bet_tag - Теги ставки
CREATE TABLE IF NOT EXISTS t_bet_tag (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    cv_tag varchar(255) NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_tag_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id)
);

COMMENT ON TABLE t_bet_tag IS 'Теги ставки';
COMMENT ON COLUMN t_bet_tag.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_tag.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_tag.cv_tag IS 'Тег';
COMMENT ON COLUMN t_bet_tag.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_tag.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_tag.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_tag.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_tag.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_bet_tag_ck_bet_and_cv_tag ON t_bet_tag(ck_bet, cv_tag);

--Таблица: t_bet_media - Вложения ставки
CREATE TABLE IF NOT EXISTS t_bet_media (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    ck_media uuid NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_media_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_media_ck_media FOREIGN KEY (ck_media) REFERENCES t_media(ck_id)
);

COMMENT ON TABLE t_bet_media IS 'Вложения ставки';
COMMENT ON COLUMN t_bet_media.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_media.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_media.ck_media IS 'Идентификатор вложения';
COMMENT ON COLUMN t_bet_media.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_media.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_media.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_media.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_media.ct_delete IS 'Дата логического удаления';

--Таблица: t_bet_comment - Комментарии к ставкам
CREATE TABLE IF NOT EXISTS t_bet_comment (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    cv_content text NOT NULL,
    ck_parent uuid NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_comment_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_comment_ck_parent FOREIGN KEY (ck_parent) REFERENCES t_bet_comment(ck_id)
);

COMMENT ON TABLE t_bet_comment IS 'Комментарии к ставкам';
COMMENT ON COLUMN t_bet_comment.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_comment.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_comment.cv_content IS 'Контент комментария';
COMMENT ON COLUMN t_bet_comment.ck_parent IS 'Идентификатор родительского комментария';
COMMENT ON COLUMN t_bet_comment.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_comment.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_comment.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_comment.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_comment.ct_delete IS 'Дата логического удаления';

--Таблица: t_bet_comment_like - Лайки к комментариям
CREATE TABLE IF NOT EXISTS t_bet_comment_like (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_comment uuid NOT NULL,
    ck_author uuid NOT NULL,
    ck_type varchar(255) NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_comment_like_ck_comment FOREIGN KEY (ck_comment) REFERENCES t_bet_comment(ck_id),
    CONSTRAINT fk_t_bet_comment_like_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_bet_comment_like_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_like_type(ck_id)
);

COMMENT ON TABLE t_bet_comment_like IS 'Лайки к комментариям';
COMMENT ON COLUMN t_bet_comment_like.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_comment_like.ck_comment IS 'Идентификатор комментария';
COMMENT ON COLUMN t_bet_comment_like.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_bet_comment_like.ck_type IS 'Идентификатор типа';
COMMENT ON COLUMN t_bet_comment_like.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_comment_like.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_comment_like.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_comment_like.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_comment_like.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_bet_comment_like_ck_comment_and_ck_author_and_ck_type ON t_bet_comment_like(ck_comment, ck_author);

--Таблица: t_bet_comment_media - Вложения к комментариям
CREATE TABLE IF NOT EXISTS t_bet_comment_media (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_comment uuid NOT NULL,
    ck_media uuid NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_comment_media_ck_comment FOREIGN KEY (ck_comment) REFERENCES t_bet_comment(ck_id),
    CONSTRAINT fk_t_bet_comment_media_ck_media FOREIGN KEY (ck_media) REFERENCES t_media(ck_id)
);

COMMENT ON TABLE t_bet_comment_media IS 'Вложения к комментариям';
COMMENT ON COLUMN t_bet_comment_media.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_comment_media.ck_comment IS 'Идентификатор комментария';
COMMENT ON COLUMN t_bet_comment_media.ck_media IS 'Идентификатор вложения';
COMMENT ON COLUMN t_bet_comment_media.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_comment_media.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_comment_media.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_comment_media.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_comment_media.ct_delete IS 'Дата логического удаления';


--Таблица: t_bet_like - Лайки к ставкам
CREATE TABLE IF NOT EXISTS t_bet_like (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    ck_author uuid NOT NULL,
    ck_type varchar(255) NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_like_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_like_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_bet_like_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_like_type(ck_id)
);

COMMENT ON TABLE t_bet_like IS 'Лайки к ставкам';
COMMENT ON COLUMN t_bet_like.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_like.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_like.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_bet_like.ck_type IS 'Идентификатор типа';
COMMENT ON COLUMN t_bet_like.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_like.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_like.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_like.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_like.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_bet_like_ck_bet_and_ck_author_and_ck_type ON t_bet_like(ck_bet, ck_author);

--Таблица: t_bet_properties - Ставки в ставках
CREATE TABLE IF NOT EXISTS t_bet_properties (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    ck_property_type varchar(100) NOT NULL,
    cv_text TEXT NULL,
    ck_localization VARCHAR(255) NULL,
    cn_decimal DECIMAL NULL,
    cn_number INT NULL,
    ct_date TIMESTAMP NULL,
    cl_bool BOOLEAN NULL,
    ck_media UUID NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_properties_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_properties_ck_property_type FOREIGN KEY (ck_property_type) REFERENCES t_d_properties_type(ck_id)
);

COMMENT ON TABLE t_bet_properties IS 'Свойства ставки';
COMMENT ON COLUMN t_bet_properties.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_properties.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_properties.ck_property_type IS 'Идентификатор типа свойства';
COMMENT ON COLUMN t_bet_properties.cv_text IS 'Текст';
COMMENT ON COLUMN t_bet_properties.ck_localization IS 'Идентификатор перевода';
COMMENT ON COLUMN t_bet_properties.cn_decimal IS 'Число с плавающей точкой';
COMMENT ON COLUMN t_bet_properties.cn_number IS 'Число';
COMMENT ON COLUMN t_bet_properties.ct_date IS 'Дата';
COMMENT ON COLUMN t_bet_properties.cl_bool IS 'Логическое значение';
COMMENT ON COLUMN t_bet_properties.ck_media IS 'Идентификатор медиа';
COMMENT ON COLUMN t_bet_properties.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_properties.ct_create IS 'Дата создания';

CREATE UNIQUE INDEX uk_t_bet_properties_ck_bet_and_ck_property_type ON t_bet_properties(ck_bet, ck_property_type);

--Таблица: t_bet_amount - Сумма ставки
CREATE TABLE IF NOT EXISTS t_bet_amount (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    ck_user uuid NOT NULL,
    cn_amount DECIMAL NOT NULL,
    cl_true BOOLEAN NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_amount_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_amount_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);

COMMENT ON TABLE t_bet_amount IS 'Сумма ставки';
COMMENT ON COLUMN t_bet_amount.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_amount.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_amount.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_amount.cn_amount IS 'Сумма';
COMMENT ON COLUMN t_bet_amount.cl_true IS 'Для выигрыша';
COMMENT ON COLUMN t_bet_amount.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_amount.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_amount.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_amount.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_bet_amount_ck_bet_and_ck_user ON t_bet_amount(ck_bet, ck_user);

--Таблица: t_bet_amount_history - История сумм ставок
CREATE TABLE IF NOT EXISTS t_bet_amount_history (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    ck_author uuid NOT NULL,
    cn_amount DECIMAL NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_amount_history_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_amount_history_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id)
);
COMMENT ON TABLE t_bet_amount_history IS 'История сумм ставок';
COMMENT ON COLUMN t_bet_amount_history.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_amount_history.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_amount_history.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_bet_amount_history.cn_amount IS 'Сумма';
COMMENT ON COLUMN t_bet_amount_history.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_amount_history.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_amount_history.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_amount_history.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_amount_history.ct_delete IS 'Дата логического удаления';

--Таблица: t_bet_rating - Рейтинг ставок
CREATE TABLE IF NOT EXISTS t_bet_rating (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_bet uuid NOT NULL,
    ck_user uuid NOT NULL,
    cn_rating INT NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_bet_rating_ck_bet FOREIGN KEY (ck_bet) REFERENCES t_bet(ck_id),
    CONSTRAINT fk_t_bet_rating_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);
COMMENT ON TABLE t_bet_rating IS 'Рейтинг ставок';
COMMENT ON COLUMN t_bet_rating.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_bet_rating.ck_bet IS 'Идентификатор ставки';
COMMENT ON COLUMN t_bet_rating.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_rating.cn_rating IS 'Рейтинг';
COMMENT ON COLUMN t_bet_rating.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_bet_rating.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_bet_rating.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_bet_rating.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_bet_rating.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_bet_rating_ck_bet_and_ck_user ON t_bet_rating(ck_bet, ck_user);    

--Таблица: t_chat - Чаты
CREATE TABLE IF NOT EXISTS t_chat (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_author uuid NOT NULL,
    ck_description VARCHAR(255) NULL,
    cr_type VARCHAR(20) NOT NULL CHECK (cr_type IN ('PUBLIC', 'PRIVATE')),
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_chat_ck_description FOREIGN KEY (ck_description) REFERENCES t_localization(ck_id)
);

COMMENT ON TABLE t_chat IS 'Чаты';
COMMENT ON COLUMN t_chat.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_chat.ck_description IS 'Идентификатор описания';
COMMENT ON COLUMN t_chat.cr_type IS 'Тип чата';
COMMENT ON COLUMN t_chat.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat.ct_delete IS 'Дата логического удаления';

--Таблица: t_chat_credentials - Credentials чата
CREATE TABLE IF NOT EXISTS t_chat_credentials (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_chat uuid NOT NULL,
    cv_credentials TEXT NOT NULL,
    cr_type VARCHAR(20) NOT NULL CHECK (cr_type IN ('TOKEN', 'API_KEY', 'PASSWORD')),
    ct_start TIMESTAMP NOT NULL,
    ct_end TIMESTAMP NULL,
    cl_one_time BOOLEAN NOT NULL DEFAULT FALSE,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_credentials_ck_chat FOREIGN KEY (ck_chat) REFERENCES t_chat(ck_id)
);
COMMENT ON TABLE t_chat_credentials IS 'Credentials чата';
COMMENT ON COLUMN t_chat_credentials.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_credentials.ck_chat IS 'Идентификатор чата';
COMMENT ON COLUMN t_chat_credentials.cv_credentials IS 'Credentials';
COMMENT ON COLUMN t_chat_credentials.cr_type IS 'Тип credentials';
COMMENT ON COLUMN t_chat_credentials.ct_start IS 'Дата начала';
COMMENT ON COLUMN t_chat_credentials.ct_end IS 'Дата окончания';
COMMENT ON COLUMN t_chat_credentials.cl_one_time IS 'Одноразовые credentials';
COMMENT ON COLUMN t_chat_credentials.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat_credentials.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat_credentials.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_credentials.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat_credentials.ct_delete IS 'Дата логического удаления';

--Таблица: t_chat_user - Пользователи в чате
CREATE TABLE IF NOT EXISTS t_chat_user (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_chat uuid NOT NULL,
    ck_user uuid NOT NULL,
    cl_admin BOOLEAN NOT NULL DEFAULT FALSE,
    cl_moderator BOOLEAN NOT NULL DEFAULT FALSE,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_user_ck_chat FOREIGN KEY (ck_chat) REFERENCES t_chat(ck_id),
    CONSTRAINT fk_t_chat_user_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);

COMMENT ON TABLE t_chat_user IS 'Пользователи в чате';
COMMENT ON COLUMN t_chat_user.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_user.ck_chat IS 'Идентификатор чата';
COMMENT ON COLUMN t_chat_user.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_user.cl_admin IS 'Администратор';
COMMENT ON COLUMN t_chat_user.cl_moderator IS 'Модератор';
COMMENT ON COLUMN t_chat_user.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat_user.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat_user.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_user.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat_user.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_chat_user_ck_chat_and_ck_user ON t_chat_user(ck_chat, ck_user);

--Таблица: t_chat_user_ban - Бан пользователей
CREATE TABLE IF NOT EXISTS t_chat_user_ban (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_chat uuid NOT NULL,
    ck_user uuid NOT NULL,
    ct_start TIMESTAMP NOT NULL DEFAULT now(),
    ct_end TIMESTAMP NULL,
    cr_type VARCHAR(20) NOT NULL CHECK (cr_type IN ('BAN', 'MUTE')),
    cv_reason TEXT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_user_ban_ck_chat FOREIGN KEY (ck_chat) REFERENCES t_chat(ck_id),
    CONSTRAINT fk_t_chat_user_ban_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);

COMMENT ON TABLE t_chat_user_ban IS 'Бан пользователей';
COMMENT ON COLUMN t_chat_user_ban.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_user_ban.ck_chat IS 'Идентификатор чата';
COMMENT ON COLUMN t_chat_user_ban.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_user_ban.ct_start IS 'Дата начала';
COMMENT ON COLUMN t_chat_user_ban.ct_end IS 'Дата окончания';
COMMENT ON COLUMN t_chat_user_ban.cr_type IS 'Тип бана';
COMMENT ON COLUMN t_chat_user_ban.cv_reason IS 'Причина бана';
COMMENT ON COLUMN t_chat_user_ban.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat_user_ban.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat_user_ban.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_user_ban.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat_user_ban.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_chat_user_ban_ck_chat_and_ck_user ON t_chat_user_ban(ck_chat, ck_user);

--Таблица: t_chat_message - Сообщения в чате
CREATE TABLE IF NOT EXISTS t_chat_message (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_chat uuid NOT NULL,
    ck_author uuid NOT NULL,
    cv_content text NOT NULL,
    ck_parent uuid NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_message_ck_chat FOREIGN KEY (ck_chat) REFERENCES t_chat(ck_id),
    CONSTRAINT fk_t_chat_message_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_chat_message_ck_parent FOREIGN KEY (ck_parent) REFERENCES t_chat_message(ck_id)
);

COMMENT ON TABLE t_chat_message IS 'Сообщения в чате';
COMMENT ON COLUMN t_chat_message.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_message.ck_chat IS 'Идентификатор чата';
COMMENT ON COLUMN t_chat_message.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_chat_message.cv_content IS 'Контент сообщения';
COMMENT ON COLUMN t_chat_message.ck_parent IS 'Идентификатор родительского сообщения';
COMMENT ON COLUMN t_chat_message.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat_message.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat_message.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_message.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat_message.ct_delete IS 'Дата логического удаления';

--Таблица: t_chat_message_media - Вложения к сообщениям
CREATE TABLE IF NOT EXISTS t_chat_message_media (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_message uuid NOT NULL,
    ck_media uuid NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_message_media_ck_message FOREIGN KEY (ck_message) REFERENCES t_chat_message(ck_id),
    CONSTRAINT fk_t_chat_message_media_ck_media FOREIGN KEY (ck_media) REFERENCES t_media(ck_id)
);

COMMENT ON TABLE t_chat_message_media IS 'Вложения к сообщениям';
COMMENT ON COLUMN t_chat_message_media.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_message_media.ck_message IS 'Идентификатор сообщения';
COMMENT ON COLUMN t_chat_message_media.ck_media IS 'Идентификатор вложения';
COMMENT ON COLUMN t_chat_message_media.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat_message_media.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat_message_media.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_message_media.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat_message_media.ct_delete IS 'Дата логического удаления';

--Таблица: t_chat_message_like - Лайки к сообщениям
CREATE TABLE IF NOT EXISTS t_chat_message_like (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_message uuid NOT NULL,
    ck_author uuid NOT NULL,
    ck_type varchar(255) NOT NULL,
    ck_create VARCHAR(255) NOT NULL,
    ct_create TIMESTAMP NOT NULL DEFAULT now(),
    ck_modify VARCHAR(255) NOT NULL,
    ct_modify TIMESTAMP NOT NULL DEFAULT now(),
    ct_delete TIMESTAMP NULL,
    CONSTRAINT fk_t_chat_message_like_ck_message FOREIGN KEY (ck_message) REFERENCES t_chat_message(ck_id),
    CONSTRAINT fk_t_chat_message_like_ck_author FOREIGN KEY (ck_author) REFERENCES t_user(ck_id),
    CONSTRAINT fk_t_chat_message_like_ck_type FOREIGN KEY (ck_type) REFERENCES t_d_like_type(ck_id)
);

COMMENT ON TABLE t_chat_message_like IS 'Лайки к сообщениям';
COMMENT ON COLUMN t_chat_message_like.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_message_like.ck_message IS 'Идентификатор сообщения';
COMMENT ON COLUMN t_chat_message_like.ck_author IS 'Идентификатор автора';
COMMENT ON COLUMN t_chat_message_like.ck_type IS 'Идентификатор типа';
COMMENT ON COLUMN t_chat_message_like.ck_create IS 'Идентификатор создателя';
COMMENT ON COLUMN t_chat_message_like.ct_create IS 'Дата создания';
COMMENT ON COLUMN t_chat_message_like.ck_modify IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_message_like.ct_modify IS 'Дата модификации';
COMMENT ON COLUMN t_chat_message_like.ct_delete IS 'Дата логического удаления';

CREATE UNIQUE INDEX uk_t_chat_message_like_ck_message_and_ck_author_and_ck_type ON t_chat_message_like(ck_message, ck_author);

--Таблица: t_chat_message_read - Прочтение сообщений
CREATE TABLE IF NOT EXISTS t_chat_message_read (
    ck_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    ck_message uuid NOT NULL,
    ck_user uuid NOT NULL,
    ct_read TIMESTAMP NOT NULL,
    CONSTRAINT fk_t_chat_message_read_ck_message FOREIGN KEY (ck_message) REFERENCES t_chat_message(ck_id),
    CONSTRAINT fk_t_chat_message_read_ck_user FOREIGN KEY (ck_user) REFERENCES t_user(ck_id)
);

COMMENT ON TABLE t_chat_message_read IS 'Прочтение сообщений';
COMMENT ON COLUMN t_chat_message_read.ck_id IS 'Идентификатор';
COMMENT ON COLUMN t_chat_message_read.ck_message IS 'Идентификатор сообщения';
COMMENT ON COLUMN t_chat_message_read.ck_user IS 'Идентификатор пользователя';
COMMENT ON COLUMN t_chat_message_read.ct_read IS 'Дата прочтения';

CREATE UNIQUE INDEX uk_t_chat_message_read_ck_message_and_ck_user ON t_chat_message_read(ck_message, ck_user);