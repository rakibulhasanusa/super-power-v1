CREATE TABLE "test_results" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"test_id" varchar(255) NOT NULL,
	"total_questions" integer NOT NULL,
	"correct_answers" integer NOT NULL,
	"wrong_answers" integer NOT NULL,
	"unanswered" integer NOT NULL,
	"score" integer NOT NULL,
	"percentage" integer NOT NULL,
	"time_taken_seconds" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"mcqs" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;