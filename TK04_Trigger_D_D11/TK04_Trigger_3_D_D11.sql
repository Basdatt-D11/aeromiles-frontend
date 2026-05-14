CREATE OR REPLACE FUNCTION public.trg_validasi_redeem()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_saldo_sekarang INT;
    v_miles_dibutuhkan INT;
    v_nama_hadiah VARCHAR(100);
    v_valid_start DATE;
    v_program_end DATE;
BEGIN
    SELECT nama, miles, valid_start_date, program_end
    INTO v_nama_hadiah, v_miles_dibutuhkan, v_valid_start, v_program_end
    FROM HADIAH
    WHERE kode = NEW.kode_hadiah;

    SELECT award_miles INTO v_saldo_sekarang
    FROM MEMBER
    WHERE email = NEW.email_member;

    IF v_saldo_sekarang IS NULL THEN
        RAISE EXCEPTION 'ERROR: Member dengan email "%" tidak ditemukan!', NEW.email_member;
    END IF;

    IF CURRENT_DATE < v_valid_start OR CURRENT_DATE > v_program_end THEN
        RAISE EXCEPTION 'ERROR: Hadiah "%" tidak tersedia pada periode ini.', v_nama_hadiah;
    END IF;

    IF v_saldo_sekarang < v_miles_dibutuhkan THEN
        RAISE EXCEPTION 'ERROR: Saldo award miles tidak mencukupi. Dibutuhkan % miles, saldo Anda: % miles.', v_miles_dibutuhkan, v_saldo_sekarang;
    END IF;

    UPDATE MEMBER
    SET award_miles = award_miles - v_miles_dibutuhkan
    WHERE email = NEW.email_member;

    RAISE NOTICE 'SUKSES: Redeem hadiah "%" berhasil. Award miles Anda berkurang % miles.', v_nama_hadiah, v_miles_dibutuhkan;

    RETURN NEW;
END;
$function$

CREATE OR REPLACE FUNCTION public.trg_sinkronisasi_package()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_jumlah_miles INT;
BEGIN
    SELECT jumlah_award_miles INTO v_jumlah_miles
    FROM AWARD_MILES_PACKAGE
    WHERE id = NEW.id_award_miles_package;

    UPDATE MEMBER
    SET award_miles = award_miles + v_jumlah_miles,
        total_miles = total_miles + v_jumlah_miles
    WHERE email = NEW.email_member;

    RAISE NOTICE 'SUKSES: Pembelian package berhasil. Award miles dan total miles Anda bertambah % miles.', v_jumlah_miles;

    RETURN NEW;
END;
$function$

CREATE TRIGGER trigger_redeem_hadiah
BEFORE INSERT ON REDEEM
FOR EACH ROW
EXECUTE FUNCTION trg_validasi_redeem();

