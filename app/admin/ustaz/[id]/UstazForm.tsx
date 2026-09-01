"use client";

import Link from "next/link";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import type { Ustaz } from "@/app/admin/_data/ustaz";
import { Button } from "@/app/ui/button";
import { Card, CardContent } from "@/app/ui/card";
import { Input } from "@/app/ui/input";
import { Label } from "@/app/ui/label";
import { Switch } from "@/app/ui/switch";
import { Textarea } from "@/app/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import Field from "@/app/admin/_components/Field";
import { reportUnsaved } from "@/app/admin/_components/unsaved";

const VIDEO_TYPES = ["figh", "hadith", "akida"] as const;

interface FormValues {
  name: string;
  slug: string;
  specialization: string;
  image: string;
  description: string;
  featured: boolean;
  videos: { id: string; title: string; type: string }[];
  facebook: string;
  youtube: string;
}

export default function UstazForm({ ustaz }: { ustaz: Ustaz }) {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: ustaz.name,
      slug: ustaz.slug,
      specialization: ustaz.specialization,
      image: ustaz.image,
      description: ustaz.description,
      featured: ustaz.featured,
      videos: ustaz.videos.map((v) => ({ ...v })),
      // The source JSON stores null for a missing link although the type says string.
      facebook: ustaz.social?.facebook ?? "",
      youtube: ustaz.social?.youtube ?? "",
    },
  });

  const videos = useFieldArray({ control, name: "videos" });

  const onSubmit = handleSubmit((values) => {
    reportUnsaved(`ustaz:${ustaz.id}`, {
      id: ustaz.id,
      name: values.name,
      slug: values.slug,
      specialization: values.specialization,
      image: values.image,
      description: values.description,
      featured: values.featured,
      videos: values.videos,
      social: { facebook: values.facebook, youtube: values.youtube },
    });
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/ustaz">
            <ArrowLeft className="size-4" />
            ត្រឡប់
          </Link>
        </Button>
        <Button type="submit">
          <Save className="size-4" />
          រក្សាទុក
        </Button>
      </div>

      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="ឈ្មោះ" htmlFor="name">
            <Input id="name" {...register("name")} />
          </Field>
          <Field label="Slug" htmlFor="slug" hint="ប្រើក្នុង URL">
            <Input id="slug" {...register("slug")} />
          </Field>
          <Field label="ជំនាញ" htmlFor="specialization">
            <Input id="specialization" {...register("specialization")} />
          </Field>
          <Field label="រូបភាព" htmlFor="image" hint="ផ្លូវក្នុង /public">
            <Input id="image" {...register("image")} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="សេចក្តីពណ៌នា" htmlFor="description">
              <Textarea id="description" rows={4} {...register("description")} />
            </Field>
          </div>
          <div className="flex items-center gap-3 sm:col-span-2">
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <Switch
                  id="featured"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="featured">បង្ហាញជាអ៊ូស្តាសលេចធ្លោ</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">វីដេអូ</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => videos.append({ id: "", title: "", type: "figh" })}
            >
              <Plus className="size-4" />
              បន្ថែម
            </Button>
          </div>

          {videos.fields.length === 0 ? (
            <p className="text-muted-foreground text-sm">មិនទាន់មានវីដេអូ</p>
          ) : (
            videos.fields.map((field, index) => (
              <div
                key={field.id}
                className="grid gap-3 rounded-lg border p-3 sm:grid-cols-[1fr_1fr_140px_auto]"
              >
                <Input
                  aria-label={`YouTube ID ${index + 1}`}
                  placeholder="YouTube ID"
                  {...register(`videos.${index}.id`)}
                />
                <Input
                  aria-label={`ចំណងជើង ${index + 1}`}
                  placeholder="ចំណងជើង"
                  {...register(`videos.${index}.title`)}
                />
                <Controller
                  control={control}
                  name={`videos.${index}.type`}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger aria-label={`ប្រភេទ ${index + 1}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VIDEO_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`លុបវីដេអូ ${index + 1}`}
                  onClick={() => videos.remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <Field label="Facebook" htmlFor="facebook">
            <Input id="facebook" {...register("facebook")} />
          </Field>
          <Field label="YouTube" htmlFor="youtube">
            <Input id="youtube" {...register("youtube")} />
          </Field>
        </CardContent>
      </Card>
    </form>
  );
}
