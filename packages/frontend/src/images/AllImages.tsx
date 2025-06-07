import { ImageGrid } from "./ImageGrid.tsx";
import type { IApiImageData } from "../../../backend/src/shared/ApiImageData.ts";

interface IAllImagesProps{
    data:IApiImageData[],
    fetchState: boolean,
    errorState: boolean,
    searchPanel: React.ReactNode
}

export function AllImages(props:IAllImagesProps) {
    return (
        <div>
            {props.searchPanel}
            <h2>All Images</h2>
            <ImageGrid images={props.data} />
        </div>
    );
}
