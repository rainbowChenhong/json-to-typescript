
/* eslint-disable */
import {RootObject as GETApiV1WlpaasMonitorLogDebugQuery} from "./GET/api/v1/wlpaas/monitor/log/debug/query.ts";
import {RootObject as POSTApiV1WlpaasComponentConnectorManageList} from "./POST/api/v1/wlpaas/component/connector/manage/list.ts";
import {RootObject as DELETEApiV1WlpaasComponentConnectorManageList} from "./DELETE/api/v1/wlpaas/component/connector/manage/list.ts";
import {RootObject as PUTApiV1WlpaasComponentConnectorManageList} from "./PUT/api/v1/wlpaas/component/connector/manage/list.ts";

export interface IGetRoutes {
    "/api/v1/wlpaas/monitor/log/debug/query":GETApiV1WlpaasMonitorLogDebugQuery
    };
export interface IPostRoutes {
    "/api/v1/wlpaas/component/connector/manage/list":POSTApiV1WlpaasComponentConnectorManageList
    };
export interface IDeleteRoutes {
    "/api/v1/wlpaas/component/connector/manage/list":DELETEApiV1WlpaasComponentConnectorManageList
    };
export interface IPutRoutes {
    "/api/v1/wlpaas/component/connector/manage/list":PUTApiV1WlpaasComponentConnectorManageList
    };
 