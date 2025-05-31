import { ImageGrid } from "./ImageGrid.tsx";
import type { IApiImageData } from "../../../backend/src/shared/ApiImageData.ts";

interface IAllImagesProps{
    data:IApiImageData[],
    fetchState: boolean,
    errorState: boolean,
}

export function AllImages(props:IAllImagesProps) {
    return (
        <div>
            <h2>All Images</h2>
            <ImageGrid images={props.data} />
        </div>
    );
}
