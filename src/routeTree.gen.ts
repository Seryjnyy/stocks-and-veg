/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

import { createFileRoute } from "@tanstack/react-router";

// Import Routes

import { Route as rootRoute } from "./routes/__root";
import { Route as ProfileImport } from "./routes/profile";
import { Route as InviteLinkImport } from "./routes/invite-link";
import { Route as GroupsImport } from "./routes/groups";
import { Route as AuthImport } from "./routes/auth";
import { Route as IndexImport } from "./routes/index";
import { Route as GroupsGroupIDImport } from "./routes/groups_.$groupID";
import { Route as GroupsGroupIDTomatoUserIDImport } from "./routes/groups_.$groupID_.tomato.$userID";

// Create Virtual Routes

const AboutLazyImport = createFileRoute("/about")();

// Create/Update Routes

const AboutLazyRoute = AboutLazyImport.update({
    path: "/about",
    getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/about.lazy").then((d) => d.Route));

const ProfileRoute = ProfileImport.update({
    path: "/profile",
    getParentRoute: () => rootRoute,
} as any);

const InviteLinkRoute = InviteLinkImport.update({
    path: "/invite-link",
    getParentRoute: () => rootRoute,
} as any);

const GroupsRoute = GroupsImport.update({
    path: "/groups",
    getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/groups.lazy").then((d) => d.Route));

const AuthRoute = AuthImport.update({
    path: "/auth",
    getParentRoute: () => rootRoute,
} as any);

const IndexRoute = IndexImport.update({
    path: "/",
    getParentRoute: () => rootRoute,
} as any).lazy(() => import("./routes/index.lazy").then((d) => d.Route));

const GroupsGroupIDRoute = GroupsGroupIDImport.update({
    path: "/groups/$groupID",
    getParentRoute: () => rootRoute,
} as any);

const GroupsGroupIDTomatoUserIDRoute = GroupsGroupIDTomatoUserIDImport.update({
    path: "/groups/$groupID/tomato/$userID",
    getParentRoute: () => rootRoute,
} as any);

// Populate the FileRoutesByPath interface

declare module "@tanstack/react-router" {
    interface FileRoutesByPath {
        "/": {
            id: "/";
            path: "/";
            fullPath: "/";
            preLoaderRoute: typeof IndexImport;
            parentRoute: typeof rootRoute;
        };
        "/auth": {
            id: "/auth";
            path: "/auth";
            fullPath: "/auth";
            preLoaderRoute: typeof AuthImport;
            parentRoute: typeof rootRoute;
        };
        "/groups": {
            id: "/groups";
            path: "/groups";
            fullPath: "/groups";
            preLoaderRoute: typeof GroupsImport;
            parentRoute: typeof rootRoute;
        };
        "/invite-link": {
            id: "/invite-link";
            path: "/invite-link";
            fullPath: "/invite-link";
            preLoaderRoute: typeof InviteLinkImport;
            parentRoute: typeof rootRoute;
        };
        "/profile": {
            id: "/profile";
            path: "/profile";
            fullPath: "/profile";
            preLoaderRoute: typeof ProfileImport;
            parentRoute: typeof rootRoute;
        };
        "/about": {
            id: "/about";
            path: "/about";
            fullPath: "/about";
            preLoaderRoute: typeof AboutLazyImport;
            parentRoute: typeof rootRoute;
        };
        "/groups/$groupID": {
            id: "/groups/$groupID";
            path: "/groups/$groupID";
            fullPath: "/groups/$groupID";
            preLoaderRoute: typeof GroupsGroupIDImport;
            parentRoute: typeof rootRoute;
        };
        "/groups/$groupID/tomato/$userID": {
            id: "/groups/$groupID/tomato/$userID";
            path: "/groups/$groupID/tomato/$userID";
            fullPath: "/groups/$groupID/tomato/$userID";
            preLoaderRoute: typeof GroupsGroupIDTomatoUserIDImport;
            parentRoute: typeof rootRoute;
        };
    }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
    "/": typeof IndexRoute;
    "/auth": typeof AuthRoute;
    "/groups": typeof GroupsRoute;
    "/invite-link": typeof InviteLinkRoute;
    "/profile": typeof ProfileRoute;
    "/about": typeof AboutLazyRoute;
    "/groups/$groupID": typeof GroupsGroupIDRoute;
    "/groups/$groupID/tomato/$userID": typeof GroupsGroupIDTomatoUserIDRoute;
}

export interface FileRoutesByTo {
    "/": typeof IndexRoute;
    "/auth": typeof AuthRoute;
    "/groups": typeof GroupsRoute;
    "/invite-link": typeof InviteLinkRoute;
    "/profile": typeof ProfileRoute;
    "/about": typeof AboutLazyRoute;
    "/groups/$groupID": typeof GroupsGroupIDRoute;
    "/groups/$groupID/tomato/$userID": typeof GroupsGroupIDTomatoUserIDRoute;
}

export interface FileRoutesById {
    __root__: typeof rootRoute;
    "/": typeof IndexRoute;
    "/auth": typeof AuthRoute;
    "/groups": typeof GroupsRoute;
    "/invite-link": typeof InviteLinkRoute;
    "/profile": typeof ProfileRoute;
    "/about": typeof AboutLazyRoute;
    "/groups/$groupID": typeof GroupsGroupIDRoute;
    "/groups/$groupID/tomato/$userID": typeof GroupsGroupIDTomatoUserIDRoute;
}

export interface FileRouteTypes {
    fileRoutesByFullPath: FileRoutesByFullPath;
    fullPaths:
        | "/"
        | "/auth"
        | "/groups"
        | "/invite-link"
        | "/profile"
        | "/tomato-live"
        | "/about"
        | "/groups/$groupID"
        | "/groups/$groupID/tomato/$userID";
    fileRoutesByTo: FileRoutesByTo;
    to:
        | "/"
        | "/auth"
        | "/groups"
        | "/invite-link"
        | "/profile"
        | "/tomato-live"
        | "/about"
        | "/groups/$groupID"
        | "/groups/$groupID/tomato/$userID";
    id:
        | "__root__"
        | "/"
        | "/auth"
        | "/groups"
        | "/invite-link"
        | "/profile"
        | "/tomato-live"
        | "/about"
        | "/groups/$groupID"
        | "/groups/$groupID/tomato/$userID";
    fileRoutesById: FileRoutesById;
}

export interface RootRouteChildren {
    IndexRoute: typeof IndexRoute;
    AuthRoute: typeof AuthRoute;
    GroupsRoute: typeof GroupsRoute;
    InviteLinkRoute: typeof InviteLinkRoute;
    ProfileRoute: typeof ProfileRoute;
    AboutLazyRoute: typeof AboutLazyRoute;
    GroupsGroupIDRoute: typeof GroupsGroupIDRoute;
    GroupsGroupIDTomatoUserIDRoute: typeof GroupsGroupIDTomatoUserIDRoute;
}

const rootRouteChildren: RootRouteChildren = {
    IndexRoute: IndexRoute,
    AuthRoute: AuthRoute,
    GroupsRoute: GroupsRoute,
    InviteLinkRoute: InviteLinkRoute,
    ProfileRoute: ProfileRoute,
    AboutLazyRoute: AboutLazyRoute,
    GroupsGroupIDRoute: GroupsGroupIDRoute,
    GroupsGroupIDTomatoUserIDRoute: GroupsGroupIDTomatoUserIDRoute,
};

export const routeTree = rootRoute
    ._addFileChildren(rootRouteChildren)
    ._addFileTypes<FileRouteTypes>();

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/auth",
        "/groups",
        "/invite-link",
        "/profile",
        "/tomato-live",
        "/about",
        "/groups/$groupID",
        "/groups/$groupID/tomato/$userID"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/auth": {
      "filePath": "auth.tsx"
    },
    "/groups": {
      "filePath": "groups.tsx"
    },
    "/invite-link": {
      "filePath": "invite-link.tsx"
    },
    "/profile": {
      "filePath": "profile.tsx"
    },
    "/tomato-live": {
      "filePath": "tomato-live.tsx"
    },
    "/about": {
      "filePath": "about.lazy.tsx"
    },
    "/groups/$groupID": {
      "filePath": "groups_.$groupID.tsx"
    },
    "/groups/$groupID/tomato/$userID": {
      "filePath": "groups_.$groupID_.tomato.$userID.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
