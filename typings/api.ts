/* eslint-disable */
  /**
   * 该文件由 npx jsontots 命令自动生成，请勿手动修改
   */
   import * as net from request.ts;
  
  export const  getGETApiV1WlpaasMonitorLogDebugAppidQuery= (restfulParams: {appid:string;}) => net.getApi('/api/v1/wlpaas/monitor/log/debug/{appid}/query', {
        restful: restfulParams,
      });
export const postPOSTApiV1WlpaasComponentConnectorManageList = net.postApi(
        "/api/v1/wlpaas/component/connector/manage/list"
      );
export const deleteDELETEApiV1WlpaasComponentConnectorManageList = net.deleteApi(
        "/api/v1/wlpaas/component/connector/manage/list"
      );
export const putPUTApiV1WlpaasComponentConnectorManageList = net.putApi(
        "/api/v1/wlpaas/component/connector/manage/list"
      );
  