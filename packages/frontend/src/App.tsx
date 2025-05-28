/* eslint-disable @typescript-eslint/no-unused-vars */
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { useState } from "react";
import { fetchDataFromServer } from "./MockAppData.ts";

function App() {
    const [imageData, _setImageData] = useState(fetchDataFromServer);

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<AllImages data={imageData}/>} />
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/images/:imageId" element={<ImageDetails data={imageData}/>} />
            </Route>
            
        </Routes>
    );
}

export default App;
