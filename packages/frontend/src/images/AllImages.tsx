import { useState } from "react";
import { MainLayout } from "../MainLayout.tsx";
import { fetchDataFromServer } from "../MockAppData.ts";
import { ImageGrid } from "./ImageGrid.tsx";

export function AllImages() {
    const [imageData, _setImageData] = useState(fetchDataFromServer);
    return (
        <MainLayout>
            <h2>All Images</h2>
            <ImageGrid images={imageData} />
        </MainLayout>
    );
}
