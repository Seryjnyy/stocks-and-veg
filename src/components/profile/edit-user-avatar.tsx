import React from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/use-auth";
import { UserAvatar } from "../group/group-user-profile";
import ImageCropper, { FileWithPreview } from "./avatar-image-cropper";

const accept = {
    "image/*": [],
};

export default function EditUserAvatar() {
    const [selectedFile, setSelectedFile] =
        React.useState<FileWithPreview | null>(null);
    const [isDialogOpen, setDialogOpen] = React.useState(false);

    const { profile } = useAuth();
    const onDrop = React.useCallback(
        (acceptedFiles: FileWithPath[]) => {
            const file = acceptedFiles[0];
            if (!file) {
                alert("Selected image is too large!");
                return;
            }

            const fileWithPreview = Object.assign(file, {
                preview: URL.createObjectURL(file),
            });

            setSelectedFile(fileWithPreview);
            setDialogOpen(true);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept,
        multiple: false,
    });

    if (!profile) return null;

    return (
        <div className="relative ">
            {selectedFile ? (
                <ImageCropper
                    dialogOpen={isDialogOpen}
                    setDialogOpen={setDialogOpen}
                    selectedFile={selectedFile}
                    setSelectedFile={setSelectedFile}
                />
            ) : (
                <div {...getRootProps()}>
                    <Button
                        variant={"outline"}
                        size={"default"}
                        className="space-x-2"
                    >
                        <UserAvatar size={"xs"} user={profile}>
                            <input {...getInputProps()} />
                        </UserAvatar>
                        <span>Change Avatar</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
