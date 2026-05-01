"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createClient } from "@/lib/client";
import { Loader2, Upload, X, Image as ImageIcon, Film } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*").order("name");
      if (error) {
        console.error("Détails de l'erreur catégories:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
      }
      if (data) setCategories(data);
    };
    if (isOpen) fetchCategories();
  }, [isOpen, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setCategory("");
    setFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title || !content || !category) {
      toast.error("Veuillez remplir tous les champs et ajouter un média.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Vous devez être connecté.");

      // 1. Upload to Storage (Using 'covers' bucket from your SQL)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      // In covers bucket, policy allows upload if authenticated
      const filePath = `posts/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('covers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(filePath);

      // 2. Insert into media table (Matching your sql.md schema)
      const { data: mediaData, error: mediaError } = await supabase
        .from('media')
        .insert({
          uploaded_by: user.id,
          url: publicUrl,
          filename: file.name,
          bucket: 'covers',
          file_type: file.type.startsWith('video') ? 'video' : 'image',
          size_bytes: file.size
        })
        .select()
        .single();

      if (mediaError) throw mediaError;

      // 3. Insert into articles table (the "Post")
      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
      
      const { error: articleError } = await supabase
        .from('articles')
        .insert({
          title,
          slug,
          content,
          cover_url: publicUrl,
          category_id: parseInt(category),
          author_id: user.id,
          status: 'published', // Direct publishing for "posts"
        });

      if (articleError) throw articleError;

      toast.success("Post créé avec succès !");
      resetForm();
      onClose();
      // Optional: window.location.reload() or router.refresh()
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-none bg-white p-0 overflow-hidden shadow-2xl">
        <div className="h-1.5 w-full bg-primary" />
        
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-8 pt-8 pb-4">
            <DialogTitle className="text-3xl font-display text-primary flex items-center gap-2">
              Créer un nouveau récit
            </DialogTitle>
            <DialogDescription className="font-ui text-muted-foreground">
              Partagez une bribe de culture avec la communauté Yakanga.
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 space-y-6 max-h-[70vh] overflow-y-auto py-2">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="font-ui font-bold text-xs uppercase tracking-widest text-secondary">Titre du post</Label>
              <Input 
                id="title" 
                placeholder="Un titre percutant..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="font-body text-lg border-border focus-visible:ring-primary h-12"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="font-ui font-bold text-xs uppercase tracking-widest text-secondary">Rubrique</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-12 border-border focus:ring-primary w-full">
                  <SelectValue placeholder={categories.length === 0 ? "Chargement des rubriques..." : "Choisir une rubrique"} />
                </SelectTrigger>
                <SelectContent position="popper" className="z-[110]">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                  {categories.length === 0 && (
                    <div className="p-4 text-center text-xs text-muted-foreground italic">
                      Aucune rubrique trouvée
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Media Upload */}
            <div className="space-y-2">
              <Label className="font-ui font-bold text-xs uppercase tracking-widest text-secondary">Média (Image ou Vidéo)</Label>
              {preview ? (
                <div className="relative aspect-video rounded-lg overflow-hidden group border border-border">
                  {file?.type.startsWith('video') ? (
                    <video src={preview} className="w-full h-full object-cover" controls />
                  ) : (
                    <Image src={preview} alt="Preview" fill className="object-cover" />
                  )}
                  <button 
                    type="button"
                    onClick={() => { setFile(null); setPreview(null); }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-bg-cream/20 hover:border-primary/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-primary/50" />
                    <p className="mb-2 text-sm text-secondary font-ui">
                      <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-ui">PNG, JPG, MP4 (MAX. 10MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2 pb-4">
              <Label htmlFor="content" className="font-ui font-bold text-xs uppercase tracking-widest text-secondary">Votre texte</Label>
              <Textarea 
                id="content" 
                placeholder="Racontez votre histoire ici..." 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[150px] font-body text-base border-border focus-visible:ring-primary leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="px-8 py-6 bg-muted/30 border-t border-border">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="font-ui font-bold text-secondary"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-ui font-bold px-8 h-12 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publication...</>
              ) : (
                "Publier maintenant"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
