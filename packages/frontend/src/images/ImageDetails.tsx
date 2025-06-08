import { useParams } from "react-router";
import type { IApiImageData } from "../../../backend/src/shared/ApiImageData.ts";
import { ImageNameEditor } from "../ImageNameEditor.tsx";

interface IImageDetailsProps{
    data:IApiImageData[],
    fetchState: boolean,
    errorState: boolean,
    handleChange: (arg:IApiImageData[]) => void
}

export function ImageDetails(props:IImageDetailsProps) {
    const { imageId } = useParams()

    // When parent state changes (edit name), will rerender
    const image = props.data.find(image => image.id === imageId);
    if (!image) {
        return <h2>Image not found</h2>;
    }

    return (
        <div>
            <h2>{image.name}</h2>
            <p>By {image.authorId}</p>
            <ImageNameEditor initialValue="" imageId={image.id} onEdit={props.handleChange}/>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
