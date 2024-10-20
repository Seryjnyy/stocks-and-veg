import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { FileWithPath } from "react-dropzone";

import { type SyntheticEvent } from "react";

import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from "react-image-crop";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";

import { useUploadAvatar } from "@/hooks/supabase/profile/use-upload-avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { SaveIcon, Trash2Icon } from "lucide-react";
import { UserAvatar } from "../group/group-user-profile";
import SpinnerButton from "../spinner-button";

export type FileWithPreview = FileWithPath & {
    preview: string;
};

interface ImageCropperProps {
    dialogOpen: boolean;
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedFile: FileWithPreview | null;
    setSelectedFile: React.Dispatch<
        React.SetStateAction<FileWithPreview | null>
    >;
}

// Helper function to center the crop
function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
): Crop {
    return centerCrop(
        makeAspectCrop(
            {
                unit: "%",
                width: 50,
                height: 50,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export default function ImageCropper({
    dialogOpen,
    setDialogOpen,
    selectedFile,
    setSelectedFile,
}: ImageCropperProps) {
    const { profile, session } = useAuth();

    const aspect = 1;

    const imgRef = React.useRef<HTMLImageElement | null>(null);

    const [crop, setCrop] = React.useState<Crop>();
    const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");
    // const [croppedImage, setCroppedImage] = React.useState<string>("");
    const { mutateAsync: uploadAvatar, isPending } = useUploadAvatar();
    const { toast } = useToast();

    function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
        if (aspect) {
            const { width, height } = e.currentTarget;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    }

    function onCropComplete(crop: PixelCrop) {
        if (imgRef.current && crop.width && crop.height) {
            const croppedImageUrl = getCroppedImg(imgRef.current, crop);
            setCroppedImageUrl(croppedImageUrl);
            // console.log(croppedImageUrl);
        }
    }

    function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;

        const ctx = canvas.getContext("2d");

        if (ctx) {
            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(
                image,
                crop.x * scaleX,
                crop.y * scaleY,
                crop.width * scaleX,
                crop.height * scaleY,
                0,
                0,
                crop.width * scaleX,
                crop.height * scaleY
            );
        }

        return canvas.toDataURL("image/png", 1.0);
    }

    const onUpload = async () => {
        if (!session) return;

        const res: Response = await fetch(croppedImageUrl);
        const blob: Blob = await res.blob();

        // Only turning into a file because it cache helper throws an error if a blob, but uploads a blob just fine
        // Could just use standard supabase query for this tbh
        uploadAvatar(
            {
                files: [
                    new File([blob], `${session.user.id}.png`, {
                        type: "image/png",
                    }),
                ],
                path: `${session.user.id}`,
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Avatar changed successfully.",
                    });
                },
                onError: () => {
                    toast({
                        title: "Something went wrong.",
                        variant: "destructive",
                    });
                },
            }
        );

        setDialogOpen(false);
    };

    // Shouldn't happen but just in case
    if (!profile) return null;

    return (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <SpinnerButton
                    isPending={isPending}
                    disabled={isPending}
                    variant={"outline"}
                    size={"default"}
                    className="space-x-2"
                >
                    <UserAvatar
                        size={"xs"}
                        user={profile}
                        imgUrl={croppedImageUrl}
                    ></UserAvatar>
                    <span>Change Avatar</span>
                    <span className="w-2 h-2 bg-warning rounded-full"></span>
                </SpinnerButton>
            </DialogTrigger>
            <DialogContent className="">
                <div className="p-6 size-full">
                    <ReactCrop
                        crop={crop}
                        onChange={(_, percentCrop) => setCrop(percentCrop)}
                        onComplete={(c) => onCropComplete(c)}
                        aspect={aspect}
                        className="w-full"
                    >
                        <Avatar className="size-full rounded-none">
                            <AvatarImage
                                ref={imgRef}
                                className="size-full rounded-none "
                                alt="Image Cropper Shell"
                                src={selectedFile?.preview}
                                onLoad={onImageLoad}
                            />
                            <AvatarFallback className="size-full min-h-[460px] rounded-none">
                                Loading...
                            </AvatarFallback>
                        </Avatar>
                    </ReactCrop>
                </div>
                <DialogFooter className="  flex flex-row justify-between">
                    <DialogClose asChild>
                        <Button
                            size={"sm"}
                            type="reset"
                            className="w-fit"
                            variant={"outline"}
                            onClick={() => {
                                setSelectedFile(null);
                            }}
                        >
                            <Trash2Icon className="mr-1.5 size-3" />
                            Cancel
                        </Button>
                    </DialogClose>

                    <SpinnerButton
                        isPending={isPending}
                        disabled={isPending}
                        onClick={onUpload}
                        variant={"default"}
                        size={"sm"}
                        className="w-fit"
                    >
                        <SaveIcon className="mr-1.5 size-3" />
                        Save
                    </SpinnerButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
