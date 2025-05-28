import { Link } from "react-router";
import type { IImageData } from "../MockAppData.ts";
import "./Images.css";

interface IImageGridProps {
    images: IImageData[];
}

export function ImageGrid(props: IImageGridProps) {
    const imageElements = props.images.map((image) => (
        <div key={image.id} className="ImageGrid-photo-container">
            <Link to={"/images/"+image.id}>
                <img src={image.src} alt={image.name}/>
            </Link>
        </div>
    ));
    return (
        <div className="ImageGrid">
            {imageElements}
        </div>
    );
}
