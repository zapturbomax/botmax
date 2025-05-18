import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

interface AvatarUploadProps {
  initialImage?: string;
  onImageChange: (imageDataUrl: string) => void;
  onImageRemove: () => void;
  getInitials: () => string;
}

export function AvatarUpload({ 
  initialImage, 
  onImageChange, 
  onImageRemove, 
  getInitials 
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validações
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('A imagem deve ter menos de 5MB.');
      return;
    }

    // Converter para base64
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreviewUrl(dataUrl);
      onImageChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageRemove();
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="relative h-24 w-24">
        <Avatar className="h-24 w-24 border">
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Avatar" />
          ) : (
            <AvatarFallback className="bg-primary/10 text-primary text-xl">
              {getInitials()}
            </AvatarFallback>
          )}
        </Avatar>

        {previewUrl && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-white shadow-sm hover:bg-destructive/90"
            aria-label="Remover imagem"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          onClick={triggerFileInput}
          className="flex items-center gap-2"
        >
          <Upload size={14} />
          <span>Carregar Foto</span>
        </Button>
        <p className="text-xs text-muted-foreground">
          Imagem com tamanho máximo de 5MB
        </p>
      </div>
    </div>
  );
}