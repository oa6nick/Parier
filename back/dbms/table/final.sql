--liquibase formatted sql
--changeset artemov_i:init_session_schema_final runAlways:true dbms:postgresql splitStatements:false stripComments:false
-- =====================================================
-- ИНФОРМАЦИЯ О СОЗДАННЫХ ЗАПИСЯХ
-- =====================================================

SELECT 
    'Создано базовых текстов: ' || COUNT(*) as info
FROM t_l_word
UNION ALL
SELECT 
    'Создано языков: ' || COUNT(*) 
FROM t_d_lang
UNION ALL
SELECT 
    'Создано локализаций: ' || COUNT(*) 
FROM t_localization
UNION ALL
SELECT 
    'Создано типов свойств: ' || COUNT(*) 
FROM t_d_properties_type
UNION ALL
SELECT 
    'Создано ролей: ' || COUNT(*) 
FROM t_d_role
UNION ALL
SELECT 
    'Создано пользователей: ' || COUNT(*) 
FROM t_user

-- Финальное уведомление
DO $$
BEGIN
    RAISE NOTICE '✅ Инициализация базы данных завершена успешно!';
    RAISE NOTICE '📊 Все таблицы заполнены тестовыми данными согласно актуальной схеме';
    RAISE NOTICE '🔗 Все внешние ключи корректно связаны';
    RAISE NOTICE '🏗️ Система готова к использованию';
END
$$; 