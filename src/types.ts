type ContactRaw = {
    headimg: string
    name: string
    node: string
    remarks: string
    wxcode: string
    wxid: string
}

type RoomRaw = {
    room_id: string
    member: string[],
    address: number
}

interface ResponseData {
    content: string;
    id: string;
    receiver: string;
    sender: string;
    srvid: number;
    status: string;
    time: string;
    type: number;
}

interface ContentRaw {
    content: string;
    detail: string;
    id1: string;
    id2: string;
    thumb: string;
}

interface MessageRaw {
    content: string | ContentRaw;
    id: string;
    id1: string;
    id2: string;
    id3: string;
    other: string; // other 字段包含 XML 或其他非 JSON 格式的数据，因此保留为字符串类型
    srvid: number;
    time: string; // 时间通常保留为字符串以保持格式和时区信息
    type: number;
    wxid: string;
}

export type {
  ContactRaw,
  RoomRaw,
  ResponseData,
  MessageRaw,
  ContentRaw,
}
