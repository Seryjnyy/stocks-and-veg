import React from "react";
import DataError from "./data-error";

export default function GroupUserNotFound() {
    return (
        <DataError
            message="Couldn't retrieve user data."
            className="w-[16rem] h-16"
        />
    );
}
