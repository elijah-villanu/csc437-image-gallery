import type { IImageData } from "../MockAppData.ts";
import "./Images.css";

interface IImageGridProps {
    images: IImageData[];
}

export function ImageGrid(props: IImageGridProps) {
    const imageElements = props.images.map((image) => (
        <div key={image.id} className="ImageGrid-photo-container">
            <a href={"/images/" + image.id}>
                <img src={image.src} alt={image.name}/>
            </a>
        </div>
    ));
    return (
        <div className="ImageGrid">
            {imageElements}
        </div>
    );
}
