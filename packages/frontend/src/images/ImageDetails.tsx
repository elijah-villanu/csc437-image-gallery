/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useParams } from "react-router";
import type { IImageData } from "../MockAppData.ts";

interface IImageDetailsProps{
    data:IImageData[]
}

export function ImageDetails(props:IImageDetailsProps) {
    const [imageData, _setImageData] = useState(props.data);
    const { imageId } = useParams()
    const image = imageData.find(image => image.id === imageId);
    if (!image) {
        return <h2>Image not found</h2>;
    }

    return (
        <div>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </div>
    )
}
