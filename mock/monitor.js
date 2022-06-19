module.exports = {
  "GET /api/v1/wlpaas/monitor/log/debug/{appid}/query": {
    request: {
      nodeId: 0,
      debugId: 1,
      test: [1],
      test1: ["ee"],
      test12: [{a: 1}],
    },
    response: {
      debugId: "61e9841e01e8b50001370fdc",
      streamId: 701,
      version: "20220120_1.0",
      nodeId: 133241,
      input:
        '{"payload":null,"attributes":{},"variables":{},"flowException":null,"params":null,"body":null}',
      output:
        '{"payload":"adsfasf","attributes":{},"variables":{},"flowException":null,"params":null,"body":null}',
      exception: null,
      createTime: "2022-01-20T15:47:59.238+00:00",
      aa: null,
    },
  },

  "POST /api/v1/wlpaas/component/connector/manage/list": {
    request: {
      connectorType: 1,
      pageNo: 1,
      pageSize: 2,
    },
    response: {
      totalCount: 1,
      pageNo: 1,
      pageSize: 10,
      data: [
        {
          id: 0,
          tenantId: 1,
          name: "HttpListener",
          tag: 0,
          describes: "",
        },
      ],
    },
  },
  "DELETE /api/v1/wlpaas/component/connector/manage/list": {
    request: {
      connectorType: 1,
      pageNo: 1,
      pageSize: 2,
    },
    response: {
      totalCount: 1,
      pageNo: 1,
      pageSize: 10,
      data: [
        {
          id: 0,
          tenantId: 1,
          name: "HttpListener",
          tag: 0,
          describes: "",
        },
      ],
    },
  },
  "PUT /api/v1/wlpaas/component/connector/manage/list": {
    request: {
      connectorType: 1,
      pageNo: 1,
      pageSize: 2,
    },
    response: {
      totalCount: 1,
      pageNo: 1,
      pageSize: 10,
      data: [
        {
          id: 0,
          tenantId: 1,
          name: "HttpListener",
          tag: 0,
          describes: "",
        },
      ],
    },
  },
};
