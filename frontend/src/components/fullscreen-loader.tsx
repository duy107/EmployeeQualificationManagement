import { LoaderIcon } from "lucide-react";

interface FullscreenLoaderProps {
    label?: string
}

function FullscreenLoader({ label = "Loading..." }: FullscreenLoaderProps) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-1">
            <LoaderIcon className="size-6 text-muted-foreground animate-spin " />
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

export default FullscreenLoader;