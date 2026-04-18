import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, Pencil, Images, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGallery } from "@/hooks/useGallery";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Gallery() {
  const navigate = useNavigate();
  const { items, removeItem, clearAll } = useGallery();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/?edit=${id}`);
  };

  const handleDelete = (id: string, name: string) => {
    removeItem(id);
    toast.success(`Removed "${name}" from gallery`);
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2.5 border-b glass">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-1 h-7 px-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-[11px]">Editor</span>
            </Button>
            <div className="w-px h-4 bg-foreground/10" />
            <h1 className="text-base font-display font-bold tracking-tight flex items-center gap-2">
              <Images className="w-4 h-4 text-primary" />
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Gallery
              </span>
            </h1>
            <span className="hidden sm:block text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
              {items.length} {items.length === 1 ? "image" : "images"}
            </span>
          </div>

          {items.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-7 px-2 text-muted-foreground hover:text-destructive rounded-xl hover:bg-white/10"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Clear All</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear entire gallery?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all {items.length} saved images from your browser. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      clearAll();
                      toast.success("Gallery cleared");
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete all
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mb-4">
                <Images className="w-7 h-7 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-display font-semibold mb-2">No saved images yet</h2>
              <p className="text-sm text-muted-foreground max-w-xs mb-5">
                Edit an image and tap <span className="font-mono text-foreground">Save</span> in the toolbar to store it here.
              </p>
              <Button
                onClick={() => navigate("/")}
                className="rounded-xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70"
              >
                Go to Editor
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="group relative rounded-2xl overflow-hidden glass aspect-square"
                  >
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-[11px] font-mono text-white/90 truncate mb-2">
                        {item.name}
                      </p>
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handleEdit(item.id)}
                          className="flex-1 h-7 text-[10px] font-mono rounded-lg bg-white/15 backdrop-blur text-white hover:bg-white/25 border-0"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="h-7 w-7 p-0 rounded-lg bg-white/10 text-white hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Always-visible mobile caption */}
                    <div className="sm:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                      <p className="text-[9px] font-mono text-white/80 truncate">{item.name}</p>
                    </div>

                    {/* Mobile action bar */}
                    <div className="sm:hidden absolute top-1.5 right-1.5 flex gap-1">
                      <button
                        onClick={() => handleEdit(item.id)}
                        className="w-7 h-7 rounded-full glass flex items-center justify-center text-foreground active:scale-95 transition-transform"
                        aria-label="Edit"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        className="w-7 h-7 rounded-full glass flex items-center justify-center text-destructive active:scale-95 transition-transform"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
