/* eslint-disable @typescript-eslint/no-unused-vars */
import { AllImages } from "./images/AllImages.tsx";
import { ImageDetails } from "./images/ImageDetails.tsx";
import { UploadPage } from "./UploadPage.tsx";
import { LoginPage } from "./LoginPage.tsx";
import { Route, Routes } from "react-router";
import { MainLayout } from "./MainLayout.tsx";
import { useState } from "react";
import { fetchDataFromServer } from "./MockAppData.ts";
import { ValidRoutes } from "../../backend/src/shared/ValidRoutes.ts";

function App() {
    const [imageData, _setImageData] = useState(fetchDataFromServer);

    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<AllImages data={imageData}/>} />
                <Route path={ValidRoutes.UPLOAD} element={<UploadPage />} />
                <Route path={ValidRoutes.LOGIN} element={<LoginPage />} />
                <Route path={ValidRoutes.IMAGES} element={<ImageDetails data={imageData}/>} />
            </Route>
            
        </Routes>
    );
}

export default App;
