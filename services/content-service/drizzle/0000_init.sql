CREATE TABLE "akhlaq_references" (
	"id" serial PRIMARY KEY NOT NULL,
	"arabic" text NOT NULL,
	"khmer" text NOT NULL,
	"source" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "akhlaq_virtues" (
	"id" text PRIMARY KEY NOT NULL,
	"kicker" text NOT NULL,
	"arabic" text NOT NULL,
	"title" text NOT NULL,
	"short" text NOT NULL,
	"long" text NOT NULL,
	"refs" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "books" (
	"key" text PRIMARY KEY NOT NULL,
	"id" integer NOT NULL,
	"subject" text NOT NULL,
	"arabic_title" text NOT NULL,
	"khmer_title" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dua_categories" (
	"name" text PRIMARY KEY NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "duas" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"reference" text NOT NULL,
	"arabic" text NOT NULL,
	"khmer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hadiths" (
	"id" serial PRIMARY KEY NOT NULL,
	"collection" text NOT NULL,
	"ref_number" text NOT NULL,
	"book" text NOT NULL,
	"topic" text NOT NULL,
	"grade" text NOT NULL,
	"narrator" text NOT NULL,
	"arabic" text NOT NULL,
	"translation" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "khutbah_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"label_km" text NOT NULL,
	"sort_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "khutbahs" (
	"id" text PRIMARY KEY NOT NULL,
	"topic" text NOT NULL,
	"topic_km" text NOT NULL,
	"title_km" text NOT NULL,
	"title_ar" text NOT NULL,
	"khatib_ar" text NOT NULL,
	"mosque" text NOT NULL,
	"date_km" text NOT NULL,
	"duration" text NOT NULL,
	"ayah_ar" text NOT NULL,
	"body" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lessons" (
	"book_key" text NOT NULL,
	"id" integer NOT NULL,
	"arabic_title" text NOT NULL,
	"khmer_title" text NOT NULL,
	"content" jsonb NOT NULL,
	CONSTRAINT "lessons_book_key_id_pk" PRIMARY KEY("book_key","id")
);
--> statement-breakpoint
CREATE TABLE "tazkiyah_topics" (
	"id" text PRIMARY KEY NOT NULL,
	"kicker" text NOT NULL,
	"arabic" text NOT NULL,
	"title" text NOT NULL,
	"short" text NOT NULL,
	"group" text NOT NULL,
	"entries" jsonb NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ustaz" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"image" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"specialization" text NOT NULL,
	"description" text NOT NULL,
	"videos" jsonb NOT NULL,
	"facebook" text,
	"youtube" text,
	CONSTRAINT "ustaz_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "duas" ADD CONSTRAINT "duas_category_dua_categories_name_fk" FOREIGN KEY ("category") REFERENCES "public"."dua_categories"("name") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "khutbahs" ADD CONSTRAINT "khutbahs_topic_khutbah_topics_id_fk" FOREIGN KEY ("topic") REFERENCES "public"."khutbah_topics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_book_key_books_key_fk" FOREIGN KEY ("book_key") REFERENCES "public"."books"("key") ON DELETE cascade ON UPDATE no action;