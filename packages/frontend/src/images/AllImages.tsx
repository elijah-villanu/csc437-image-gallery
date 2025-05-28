import { ImageGrid } from "./ImageGrid.tsx";
import type { IImageData } from "../MockAppData.ts";

interface IAllImagesProps{
    data:IImageData[]
}

export function AllImages(props:IAllImagesProps) {
    return (
        <div>
            <h2>All Images</h2>
            <ImageGrid images={props.data} />
        </div>
    );
}
