


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_auth_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  meta_role text := nullif(new.raw_user_meta_data ->> 'role', '');
  meta_full_name text := nullif(new.raw_user_meta_data ->> 'full_name', '');
  meta_company_name text := nullif(new.raw_user_meta_data ->> 'company_name', '');
  meta_avatar text := nullif(new.raw_user_meta_data ->> 'avatar_url', '');
  resolved_role text := coalesce(meta_role, 'student');
begin
  if resolved_role not in ('student', 'company') then
    resolved_role := 'student';
  end if;

  insert into public.users (id, email, name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(meta_full_name, meta_company_name),
    meta_avatar,
    resolved_role
  )
  on conflict (id) do nothing;

  if resolved_role = 'student' then
    insert into public.profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  else
    insert into public.companies (user_id, name, contact_email)
    values (
      new.id,
      coalesce(meta_company_name, meta_full_name, new.email),
      new.email
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_auth_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_company"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select exists (
    select 1 from public.users where id = auth.uid() and role = 'company'
  )
$$;


ALTER FUNCTION "public"."is_company"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."rls_auto_enable"() RETURNS "event_trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


ALTER FUNCTION "public"."rls_auto_enable"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."careers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "description" "text",
    "one_liner" "text",
    "day_in_the_life" "text",
    "sample_schedule" "jsonb" DEFAULT '[]'::"jsonb",
    "typical_tasks" "text"[] DEFAULT '{}'::"text"[],
    "tools" "text"[] DEFAULT '{}'::"text"[],
    "required_skills" "text"[] DEFAULT '{}'::"text"[],
    "salary_range" "jsonb" DEFAULT '{}'::"jsonb",
    "growth_outlook" "text",
    "color" "text" DEFAULT '#6366f1'::"text",
    "icon" "text" DEFAULT '💼'::"text",
    "target_vector" double precision[] DEFAULT '{}'::double precision[],
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."careers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."case_studies" (
    "id" "text" DEFAULT ("extensions"."uuid_generate_v4"())::"text" NOT NULL,
    "career_id" "uuid",
    "company_id" "uuid",
    "title" "text" NOT NULL,
    "brief" "text" NOT NULL,
    "rubric" "jsonb" DEFAULT '[]'::"jsonb",
    "time_minutes" integer DEFAULT 45 NOT NULL,
    "difficulty" "text" DEFAULT 'intermediate'::"text",
    "skills_tested" "text"[] DEFAULT '{}'::"text"[],
    "deliverable_format" "text" DEFAULT 'text'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "case_studies_deliverable_format_check" CHECK (("deliverable_format" = ANY (ARRAY['text'::"text", 'document'::"text", 'spreadsheet'::"text", 'slides'::"text"]))),
    CONSTRAINT "case_studies_difficulty_check" CHECK (("difficulty" = ANY (ARRAY['beginner'::"text", 'intermediate'::"text", 'advanced'::"text"])))
);


ALTER TABLE "public"."case_studies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "logo_url" "text",
    "description" "text",
    "contact_email" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_admin" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invitations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "submission_id" "uuid",
    "company_id" "uuid",
    "user_id" "uuid",
    "status" "text" DEFAULT 'pending'::"text",
    "message" "text",
    "sent_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "invitations_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text", 'declined'::"text"])))
);


ALTER TABLE "public"."invitations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "user_id" "uuid" NOT NULL,
    "questionnaire_answers" "jsonb" DEFAULT '{}'::"jsonb",
    "match_vector" double precision[] DEFAULT '{}'::double precision[],
    "completed_at" timestamp with time zone,
    "cv_url" "text",
    "cv_parsed" "jsonb" DEFAULT '{}'::"jsonb",
    "cv_skills" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."submissions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "case_study_id" "text" NOT NULL,
    "answer" "text",
    "integrity_signals" "jsonb" DEFAULT '{"paste_count": 0, "tab_switches": 0, "fullscreen_exits": 0, "time_spent_seconds": 0}'::"jsonb",
    "started_at" timestamp with time zone,
    "submitted_at" timestamp with time zone,
    "score" double precision,
    "score_breakdown" "jsonb",
    "status" "text" DEFAULT 'in_progress'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "cv_snapshot_url" "text",
    "reviewer_notes" "text",
    CONSTRAINT "submissions_status_check" CHECK (("status" = ANY (ARRAY['in_progress'::"text", 'submitted'::"text", 'scored'::"text", 'reviewed'::"text", 'shortlisted'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."submissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'student'::"text" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['student'::"text", 'company'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."careers"
    ADD CONSTRAINT "careers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."careers"
    ADD CONSTRAINT "careers_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."case_studies"
    ADD CONSTRAINT "case_studies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."case_studies"
    ADD CONSTRAINT "case_studies_career_id_fkey" FOREIGN KEY ("career_id") REFERENCES "public"."careers"("id");



ALTER TABLE ONLY "public"."case_studies"
    ADD CONSTRAINT "case_studies_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_submission_id_fkey" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id");



ALTER TABLE ONLY "public"."invitations"
    ADD CONSTRAINT "invitations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."submissions"
    ADD CONSTRAINT "submissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Careers public read" ON "public"."careers" FOR SELECT USING (true);



CREATE POLICY "Case studies public read" ON "public"."case_studies" FOR SELECT USING (true);



CREATE POLICY "Companies can read submitted profiles" ON "public"."profiles" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM (("public"."submissions" "s"
     JOIN "public"."case_studies" "cs" ON (("cs"."id" = "s"."case_study_id")))
     JOIN "public"."companies" "c" ON (("cs"."company_id" = "c"."id")))
  WHERE (("s"."user_id" = "profiles"."user_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies delete own case studies" ON "public"."case_studies" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "case_studies"."company_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies insert own case studies" ON "public"."case_studies" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "case_studies"."company_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies manage invitations" ON "public"."invitations" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM (("public"."submissions" "s"
     JOIN "public"."case_studies" "cs" ON (("cs"."id" = "s"."case_study_id")))
     JOIN "public"."companies" "c" ON (("cs"."company_id" = "c"."id")))
  WHERE (("s"."id" = "invitations"."submission_id") AND ("s"."user_id" = "invitations"."user_id") AND ("c"."id" = "invitations"."company_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies public read" ON "public"."companies" FOR SELECT USING (true);



CREATE POLICY "Companies see invitations" ON "public"."invitations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "invitations"."company_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies see submissions" ON "public"."submissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM ("public"."case_studies" "cs"
     JOIN "public"."companies" "c" ON (("cs"."company_id" = "c"."id")))
  WHERE (("cs"."id" = "submissions"."case_study_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies update own case studies" ON "public"."case_studies" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."companies" "c"
  WHERE (("c"."id" = "case_studies"."company_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Companies update submissions" ON "public"."submissions" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM ("public"."case_studies" "cs"
     JOIN "public"."companies" "c" ON (("cs"."company_id" = "c"."id")))
  WHERE (("cs"."id" = "submissions"."case_study_id") AND ("c"."user_id" = "auth"."uid"())))));



CREATE POLICY "Company can read students" ON "public"."users" FOR SELECT USING ("public"."is_company"());



CREATE POLICY "Profiles insert own" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Profiles select own" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Profiles update own" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Students create submissions" ON "public"."submissions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Students respond to own invitations" ON "public"."invitations" FOR UPDATE USING (("auth"."uid"() = "user_id")) WITH CHECK ((("auth"."uid"() = "user_id") AND ("status" = ANY (ARRAY['accepted'::"text", 'declined'::"text"]))));



CREATE POLICY "Students see own invitations" ON "public"."invitations" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Students see own submissions" ON "public"."submissions" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Students update own submissions" ON "public"."submissions" FOR UPDATE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can insert own" ON "public"."users" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "Users can read own" ON "public"."users" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can update own" ON "public"."users" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."careers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."case_studies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."companies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invitations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."submissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































REVOKE ALL ON FUNCTION "public"."handle_new_auth_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_auth_user"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_company"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_company"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_company"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_company"() TO "service_role";



GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "anon";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."rls_auto_enable"() TO "service_role";


















GRANT ALL ON TABLE "public"."careers" TO "anon";
GRANT ALL ON TABLE "public"."careers" TO "authenticated";
GRANT ALL ON TABLE "public"."careers" TO "service_role";



GRANT ALL ON TABLE "public"."case_studies" TO "anon";
GRANT ALL ON TABLE "public"."case_studies" TO "authenticated";
GRANT ALL ON TABLE "public"."case_studies" TO "service_role";



GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."invitations" TO "anon";
GRANT ALL ON TABLE "public"."invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."invitations" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."submissions" TO "anon";
GRANT ALL ON TABLE "public"."submissions" TO "authenticated";
GRANT ALL ON TABLE "public"."submissions" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";



































drop extension if exists "pg_net";

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();


  create policy "Companies read submission CVs"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'cvs'::text) AND (EXISTS ( SELECT 1
   FROM ((public.submissions s
     JOIN public.case_studies cs ON ((s.case_study_id = cs.id)))
     JOIN public.companies c ON ((cs.company_id = c.id)))
  WHERE ((c.user_id = auth.uid()) AND (s.cv_snapshot_url ~~ (('%'::text || c.name) || '%'::text)))))));



  create policy "Users read own CVs"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using (((bucket_id = 'cvs'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



  create policy "Users upload own CVs"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check (((bucket_id = 'cvs'::text) AND ((storage.foldername(name))[1] = (auth.uid())::text)));



