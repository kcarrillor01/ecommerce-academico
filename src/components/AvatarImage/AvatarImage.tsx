import React, { useEffect, useState } from "react";

interface AvatarImageProps {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
    src,
    alt = "Avatar",
    width = 40,
    height = 40,
}) => {
    const [avatarUrl, setAvatarUrl] = useState<string>("/default-avatar.png");

    useEffect(() => {
        if (src) {
            const img = new Image();
            img.src = src;
            img.crossOrigin = "anonymous"; // Para tratar problemas CORS
            img.onload = () => setAvatarUrl(src);
            img.onerror = () => setAvatarUrl("/default-avatar.png");
        } else {
            setAvatarUrl("/default-avatar.png");
        }
    }, [src]);

    return (
        <img
            src={avatarUrl}
            alt={alt}
            className="rounded-circle"
            style={{ width, height, objectFit: "cover" }}
        />
    );
};

export default AvatarImage;
