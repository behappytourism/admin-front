import { useState } from "react";

import { isImageValid } from "../utils";

const useImageChange = (imageSize) => {
    const [image, setImage] = useState("");
    const [error, setError] = useState("");

    const handleImageChange = (e) => {
        setImage("");
        setError("");
        console.log(e.target.files);
        if (e.target.files.length < 1) {
            return;
        }

        console.log(
            e.target.files[0].size,
            imageSize,
            "e.target.files[0].size"
        );
        if (imageSize) {
            if (e.target.files[0].size > imageSize) {
                setError(
                    `Image size must be less than ${(
                        imageSize /
                        (1024 * 1024)
                    ).toFixed(2)} MB`
                );
                e.target.value = "";
            } else if (isImageValid(e.target.files[0])) {
                console.log("call reached");
                setImage(e.target.files[0]);
            } else {
                setError("Please upload an Image file.");
                e.target.value = "";
            }
        } else {
            if (isImageValid(e.target.files[0])) {
                console.log("call reached");
                setImage(e.target.files[0]);
            } else {
                setError("Please upload an Image file.");
                e.target.value = "";
            }
        }
    };
    console.log(image, "image");
    console.log(error, "error");

    return { image, error, handleImageChange, setError, setImage };
};

export default useImageChange;
