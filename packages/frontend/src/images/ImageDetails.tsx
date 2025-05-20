import { useState } from "react";
import { MainLayout } from "../MainLayout.tsx";
import { fetchDataFromServer } from "../MockAppData.ts";

interface IImageDetailsProps {
    imageId: string;
}

export function ImageDetails({ imageId }: IImageDetailsProps) {
    const [imageData, _setImageData] = useState(fetchDataFromServer);
    const image = imageData.find(image => image.id === imageId);
    if (!image) {
        return <MainLayout><h2>Image not found</h2></MainLayout>;
    }

    return (
        <MainLayout>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </MainLayout>
    )
}
