import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

export default function ImageDropZone({
    onFileDrop,
}: {
    onFileDrop: (acceptedFiles: FileWithPath[]) => void;
}) {
    // TODO : potentially duplicate code with edit user avatar
    const onDrop = useCallback(
        (acceptedFiles: FileWithPath[]) => {
            const file = acceptedFiles[0];
            if (!file) {
                alert("Selected image is too large!");
                return;
            }

            onFileDrop(acceptedFiles);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxSize: 5 * 1024 * 1024, // 5MB,
        accept: { "image/*": [] },
    });

    return (
        <>
            <div
                {...getRootProps()}
                className="border p-8 flex justify-center items-center w-full hover:ring ring-primary cursor-pointer rounded-lg"
            >
                <input {...getInputProps()} className="border" />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <p>
                        Drag 'n' drop some files here, or click to select files
                    </p>
                )}
            </div>
        </>
    );
}
