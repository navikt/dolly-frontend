-----------------------------
-- A L T E R   T A B L E S --
-----------------------------
ALTER TABLE T_BESTILLING_PROGRESS ADD (IDENT_TEMP VARCHAR2(11));
UPDATE T_BESTILLING_PROGRESS SET IDENT_TEMP = IDENT;
ALTER TABLE T_BESTILLING_PROGRESS DROP COLUMN IDENT;
ALTER TABLE T_BESTILLING_PROGRESS RENAME COLUMN IDENT_TEMP TO IDENT;